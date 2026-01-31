import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - prefer .env.local over .env
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log('Loaded configuration from .env.local');
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Loaded configuration from .env');
} else {
  dotenv.config();
  console.log('Using default environment variables');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy - configure based on deployment environment
// For Railway/Render/Heroku, use 1 to trust the first proxy
// For development, don't trust any proxy
const trustProxyConfig = process.env.NODE_ENV === 'production' ? 1 : false;
app.set('trust proxy', trustProxyConfig);

// Security middleware
app.use(helmet());

// Define allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://multi-ais-chat.netlify.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting in development
  skip: (req) => process.env.NODE_ENV === 'development',
  message: 'Too many requests from this IP, please try again later.',
  // Explicitly validate the trust proxy setting
  validate: {
    trustProxy: false, // Disable the built-in validation since we're handling it manually
    xForwardedForHeader: false, // Disable this validation too
  }
});
app.use('/api/', limiter);

// Session storage (in production, use Redis or a database)
const sessions = new Map();
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

// Cleanup expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

// Cache for extracted keys - computed once at startup
const keyCache = new Map();

// Helper to extract API keys from environment (with caching)
function extractKeys(baseKeyName) {
  // Return cached result if available
  if (keyCache.has(baseKeyName)) {
    return keyCache.get(baseKeyName);
  }

  const keys = new Set();
  const envVarMap = {
    'PERPLEXITY_API_KEY': 'PERPLEXITY_API_KEY',
    'GOOGLE_API_KEY': 'GOOGLE_API_KEY',
    'GROQ_API_KEY': 'GROQ_API_KEY',
    'OPENAI_API_KEY': 'OPENAI_API_KEY',
    'OPENROUTER_API_KEY': 'OPENROUTER_API_KEY',
    'GITHUB_TOKEN': 'GITHUB_TOKEN',
    'COHERE_API_KEY': 'COHERE_API_KEY',
    'XAI_API_KEY': 'XAI_API_KEY',
    'FASTROUTER_API_KEY': 'FASTROUTER_API_KEY',
  };

  const base = envVarMap[baseKeyName] || baseKeyName;

  // Direct key
  if (process.env[base]) {
    keys.add(process.env[base]);
  }

  // Numbered variants - check up to 20 keys per service
  for (let i = 1; i <= 20; i++) {
    // Try both KEY1 and KEY_1 formats
    const key1 = process.env[`${base}${i}`];
    const key2 = process.env[`${base}_${i}`];

    if (key1 && key1.trim()) keys.add(key1.trim());
    if (key2 && key2.trim()) keys.add(key2.trim());
  }

  // Debug logging for troubleshooting
  if (keys.size === 0) {
    console.log(`No keys found for ${baseKeyName}. Checked: ${base}, ${base}1-20, ${base}_1-20`);
  }

  const result = Array.from(keys);
  keyCache.set(baseKeyName, result);
  return result;
}

// Pre-warm the key cache at startup
function initializeKeyCache() {
  const services = [
    'GROQ_API_KEY', 'GOOGLE_API_KEY', 'PERPLEXITY_API_KEY', 'OPENAI_API_KEY',
    'OPENROUTER_API_KEY', 'GITHUB_TOKEN', 'COHERE_API_KEY', 'XAI_API_KEY', 'FASTROUTER_API_KEY'
  ];
  services.forEach(extractKeys);
}

// Middleware to verify session token
function authenticateSession(req, res, next) {
  const token = req.headers['x-session-token'];

  if (!token) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  const session = sessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid' });
  }

  // Refresh session
  session.expiresAt = Date.now() + SESSION_DURATION;
  req.session = session;
  next();
}

// Middleware to prevent caching of sensitive data
function preventCache(req, res, next) {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  next();
}

// Initialize session - client calls this first
app.post('/api/session/init', (req, res) => {
  const token = uuidv4();
  const session = {
    id: token,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
    keyIndices: {
      perplexity: 0,
      gemini: 0,
      groq: 0,
      openai: 0,
      openrouter: 0,
      github: 0,
      cohere: 0,
      xai: 0,
      fastrouter: 0
    }
  };

  sessions.set(token, session);

  // Get actual key counts for each service
  const groqKeys = extractKeys('GROQ_API_KEY');
  const geminiKeys = extractKeys('GOOGLE_API_KEY');
  const perplexityKeys = extractKeys('PERPLEXITY_API_KEY');
  const openaiKeys = extractKeys('OPENAI_API_KEY');
  const openrouterKeys = extractKeys('OPENROUTER_API_KEY');
  const githubKeys = extractKeys('GITHUB_TOKEN');
  const cohereKeys = extractKeys('COHERE_API_KEY');
  const xaiKeys = extractKeys('XAI_API_KEY');
  const fastrouterKeys = extractKeys('FASTROUTER_API_KEY');

  // Return session info with actual key counts
  res.json({
    token,
    expiresAt: session.expiresAt,
    services: {
      perplexity: perplexityKeys.length,
      gemini: geminiKeys.length,
      groq: groqKeys.length,
      openai: openaiKeys.length,
      openrouter: openrouterKeys.length,
      github: githubKeys.length,
      cohere: cohereKeys.length,
      xai: xaiKeys.length,
      fastrouter: fastrouterKeys.length,
    }
  });
});

// Get API key for a specific service
app.post('/api/keys/get', authenticateSession, preventCache, (req, res) => {
  const { service } = req.body;

  if (!service) {
    return res.status(400).json({ error: 'Service not specified' });
  }

  const keyMap = {
    perplexity: 'PERPLEXITY_API_KEY',
    gemini: 'GOOGLE_API_KEY',
    groq: 'GROQ_API_KEY',
    openai: 'OPENAI_API_KEY',
    openrouter: 'OPENROUTER_API_KEY',
    github: 'GITHUB_TOKEN',
    cohere: 'COHERE_API_KEY',
    xai: 'XAI_API_KEY',
    fastrouter: 'FASTROUTER_API_KEY',
  };

  const baseKey = keyMap[service];
  if (!baseKey) {
    return res.status(400).json({ error: 'Invalid service' });
  }

  const keys = extractKeys(baseKey);
  if (keys.length === 0) {
    return res.status(404).json({ error: `No keys configured for ${service}` });
  }

  // Get current index for this service
  const currentIndex = req.session.keyIndices[service] || 0;
  const key = keys[currentIndex % keys.length];

  // Set response type to prevent browser preview/caching
  res.type('application/octet-stream');

  // Send the response as a buffer to prevent text preview
  // Note: Only send the key, no obfuscated version (security)
  const responseData = {
    key,
    index: currentIndex,
    total: keys.length
  };

  // Convert to buffer and send
  const buffer = Buffer.from(JSON.stringify(responseData));
  res.send(buffer);
});

// Rotate to next key for a service
app.post('/api/keys/rotate', authenticateSession, (req, res) => {
  const { service } = req.body;

  if (!service || !req.session.keyIndices.hasOwnProperty(service)) {
    return res.status(400).json({ error: 'Invalid service' });
  }

  // Increment the index
  req.session.keyIndices[service] = (req.session.keyIndices[service] + 1) % 1000;

  res.json({
    success: true,
    newIndex: req.session.keyIndices[service]
  });
});

// Get service status (which services have keys configured)
app.get('/api/services/status', authenticateSession, (req, res) => {
  res.json({
    groq: extractKeys('GROQ_API_KEY').length > 0,
    gemini: extractKeys('GOOGLE_API_KEY').length > 0,
    perplexity: extractKeys('PERPLEXITY_API_KEY').length > 0,
    openai: extractKeys('OPENAI_API_KEY').length > 0,
    openrouter: extractKeys('OPENROUTER_API_KEY').length > 0,
    github: extractKeys('GITHUB_TOKEN').length > 0,
    cohere: extractKeys('COHERE_API_KEY').length > 0,
    xai: extractKeys('XAI_API_KEY').length > 0,
    fastrouter: extractKeys('FASTROUTER_API_KEY').length > 0,
  });
});

// Add a new endpoint to get key counts
app.get('/api/keys/count', authenticateSession, (req, res) => {
  res.json({
    groq: extractKeys('GROQ_API_KEY').length,
    gemini: extractKeys('GOOGLE_API_KEY').length,
    perplexity: extractKeys('PERPLEXITY_API_KEY').length,
    openai: extractKeys('OPENAI_API_KEY').length,
    openrouter: extractKeys('OPENROUTER_API_KEY').length,
    github: extractKeys('GITHUB_TOKEN').length,
    cohere: extractKeys('COHERE_API_KEY').length,
    xai: extractKeys('XAI_API_KEY').length,
    fastrouter: extractKeys('FASTROUTER_API_KEY').length,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =============================================================================
// SECURE PROXY ENDPOINTS - AI API calls made server-side (keys never sent to client)
// =============================================================================

// Helper to get next key with rotation
function getNextKey(session, service, baseKeyName) {
  const keys = extractKeys(baseKeyName);
  if (keys.length === 0) return null;
  const currentIndex = session.keyIndices[service] || 0;
  return { key: keys[currentIndex % keys.length], index: currentIndex, total: keys.length };
}

// Helper to rotate key on failure
function rotateKeyOnFailure(session, service) {
  session.keyIndices[service] = ((session.keyIndices[service] || 0) + 1) % 1000;
}

// Proxy endpoint for Groq API (with retry on rate limit)
app.post('/api/proxy/groq', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const keys = extractKeys('GROQ_API_KEY');
  const maxRetries = Math.min(keys.length, 5);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const keyData = getNextKey(req.session, 'groq', 'GROQ_API_KEY');
    if (!keyData) return res.status(503).json({ error: 'No Groq API keys available' });

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyData.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are Groq AI, an ultra-fast AI assistant. Provide concise, helpful responses.' },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return res.json({
          content: data.choices?.[0]?.message?.content || '',
          model: 'llama-3.1-8b-instant',
          source: 'groq',
          success: true
        });
      }

      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'groq');
        continue;
      }

      return res.status(response.status).json({ error: 'Groq API error', status: response.status });
    } catch (error) {
      rotateKeyOnFailure(req.session, 'groq');
      continue;
    }
  }

  res.status(429).json({ error: 'All Groq API keys rate limited', success: false });
});

// Proxy endpoint for Gemini API via FastRouter (with retry on rate limit)
app.post('/api/proxy/gemini', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // Use FastRouter API key for Gemini models
  const keys = extractKeys('FASTROUTER_API_KEY');
  const maxRetries = Math.min(keys.length, 5); // Try up to 5 different keys

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const keyData = getNextKey(req.session, 'fastrouter', 'FASTROUTER_API_KEY');
    if (!keyData) return res.status(503).json({ error: 'No FastRouter API keys available for Gemini' });

    try {
      const response = await fetch('https://go.fastrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyData.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are Gemini, a helpful AI assistant by Google.' },
            { role: 'user', content: message }
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return res.json({
          content: data.choices?.[0]?.message?.content || '',
          model: 'google/gemini-2.5-flash',
          source: 'gemini',
          success: true
        });
      }

      // Rate limit or auth error - rotate and retry
      if (response.status === 429 || response.status === 401 || response.status === 403) {
        rotateKeyOnFailure(req.session, 'fastrouter');
        continue; // Try next key
      }

      // Other errors - return immediately
      return res.status(response.status).json({ error: 'Gemini API error', status: response.status });
    } catch (error) {
      rotateKeyOnFailure(req.session, 'fastrouter');
      continue; // Try next key on network errors
    }
  }

  // All retries exhausted
  res.status(429).json({ error: 'All FastRouter API keys rate limited', success: false });
});

// Proxy endpoint for Perplexity API
app.post('/api/proxy/perplexity', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const keyData = getNextKey(req.session, 'perplexity', 'PERPLEXITY_API_KEY');
  if (!keyData) return res.status(503).json({ error: 'No Perplexity API keys available' });

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are Perplexity AI, a research-focused assistant with web search capabilities.' },
          { role: 'user', content: message }
        ],
        max_tokens: 1200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'perplexity');
      }
      return res.status(response.status).json({ error: 'Perplexity API error', status: response.status });
    }

    const data = await response.json();
    res.json({
      content: data.choices?.[0]?.message?.content || '',
      model: 'sonar',
      source: 'perplexity',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to call Perplexity API', success: false });
  }
});

// Proxy endpoint for Cohere API
app.post('/api/proxy/cohere', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const keyData = getNextKey(req.session, 'cohere', 'COHERE_API_KEY');
  if (!keyData) return res.status(503).json({ error: 'No Cohere API keys available' });

  try {
    const response = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-a-03-2025',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'cohere');
      }
      return res.status(response.status).json({ error: 'Cohere API error', status: response.status });
    }

    const data = await response.json();
    res.json({
      content: data.message?.content?.[0]?.text || '',
      model: 'command-a-03-2025',
      source: 'cohere',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to call Cohere API', success: false });
  }
});

// Proxy endpoint for GitHub Models API
app.post('/api/proxy/github', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const keyData = getNextKey(req.session, 'github', 'GITHUB_TOKEN');
  if (!keyData) return res.status(503).json({ error: 'No GitHub API tokens available' });

  const models = ['xai/grok-3-mini', 'deepseek/DeepSeek-V3-0324', 'openai/gpt-4.1'];
  const selectedModel = models[Math.floor(Date.now() / 1000) % models.length];

  try {
    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: 'You are GitHub AI, an advanced AI assistant.' },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'github');
      }
      return res.status(response.status).json({ error: 'GitHub API error', status: response.status });
    }

    const data = await response.json();
    res.json({
      content: data.choices?.[0]?.message?.content || '',
      model: selectedModel,
      source: 'github',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to call GitHub API', success: false });
  }
});

// Proxy endpoint for OpenRouter API
app.post('/api/proxy/openrouter', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const keyData = getNextKey(req.session, 'openrouter', 'OPENROUTER_API_KEY');
  if (!keyData) return res.status(503).json({ error: 'No OpenRouter API keys available' });

  const models = ['meta-llama/llama-3.3-70b-instruct:free', 'mistralai/mistral-7b-instruct:free'];

  for (const model of models) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyData.key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'AI Chat Fusion',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are OpenRouter AI, a flexible AI assistant.' },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return res.json({
          content: data.choices?.[0]?.message?.content || '',
          model,
          source: 'openrouter',
          success: true
        });
      }

      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'openrouter');
      }
    } catch (error) {
      continue;
    }
  }

  res.status(503).json({ error: 'All OpenRouter models failed', success: false });
});

// Proxy endpoint for xAI (Grok) via FastRouter API
app.post('/api/proxy/xai', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // Use FastRouter API key for xAI/Grok models
  const keyData = getNextKey(req.session, 'fastrouter', 'FASTROUTER_API_KEY');
  if (!keyData) return res.status(503).json({ error: 'No FastRouter API keys available for xAI' });

  try {
    const response = await fetch('https://go.fastrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-3-beta',
        messages: [
          { role: 'system', content: 'You are Grok, an AI assistant by xAI. Be helpful, witty, and insightful.' },
          { role: 'user', content: message }
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'fastrouter');
      }
      return res.status(response.status).json({ error: 'xAI API error', status: response.status });
    }

    const data = await response.json();
    res.json({
      content: data.choices?.[0]?.message?.content || '',
      model: 'x-ai/grok-3-beta',
      source: 'xai',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to call xAI API', success: false });
  }
});

// Proxy endpoint for OpenAI API via FastRouter
app.post('/api/proxy/openai', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // Use FastRouter API key for OpenAI models
  const keyData = getNextKey(req.session, 'fastrouter', 'FASTROUTER_API_KEY');
  if (!keyData) return res.status(503).json({ error: 'No FastRouter API keys available for OpenAI' });

  try {
    const response = await fetch('https://go.fastrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'fastrouter');
      }
      return res.status(response.status).json({ error: 'OpenAI API error', status: response.status });
    }

    const data = await response.json();
    res.json({
      content: data.choices?.[0]?.message?.content || '',
      model: 'openai/gpt-4o',
      source: 'openai',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to call OpenAI API', success: false });
  }
});

// Proxy endpoint for FastRouter (Anthropic Claude) API
app.post('/api/proxy/fastrouter', authenticateSession, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const keyData = getNextKey(req.session, 'fastrouter', 'FASTROUTER_API_KEY');
  if (!keyData) return res.status(503).json({ error: 'No FastRouter API keys available' });

  const models = [
    'anthropic/claude-3-7-sonnet-20250219',  // Claude 3.7 Sonnet (latest)
    'anthropic/claude-sonnet-4-20250514',     // Claude Sonnet 4
    'anthropic/claude-opus-4.5'               // Claude Opus 4.5 (most capable)
  ];
  const selectedModel = models[Math.floor(Date.now() / 1000) % models.length];

  try {
    const response = await fetch('https://go.fastrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: 'You are Claude, an AI assistant by Anthropic. Be helpful and honest.' },
          { role: 'user', content: message }
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'fastrouter');
      }
      return res.status(response.status).json({ error: 'FastRouter API error', status: response.status });
    }

    const data = await response.json();
    res.json({
      content: data.choices?.[0]?.message?.content || '',
      model: selectedModel,
      source: 'fastrouter',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to call FastRouter API', success: false });
  }
});

// Proxy endpoint for FastRouter Image Generation API
app.post('/api/proxy/image-generate', authenticateSession, async (req, res) => {
  const { prompt, model } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  const keyData = getNextKey(req.session, 'fastrouter', 'FASTROUTER_API_KEY');
  if (!keyData) return res.status(503).json({ error: 'No FastRouter API keys available' });

  // Use provided model or default to dall-e-3
  const imageModel = model || 'openai/dall-e-3';

  try {
    const response = await fetch('https://go.fastrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keyData.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageModel,
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 401) {
        rotateKeyOnFailure(req.session, 'fastrouter');
      }
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Image generation failed',
        status: response.status,
        details: errorText,
        success: false
      });
    }

    const data = await response.json();

    // FastRouter returns data in OpenAI-compatible format
    // DALL-E 3 returns b64_json, others may return url
    let imageUrl = data.data?.[0]?.url;
    const b64Json = data.data?.[0]?.b64_json;

    // If base64, prefix with data URI
    if (b64Json && !imageUrl) {
      imageUrl = `data:image/png;base64,${b64Json}`;
    }

    res.json({
      success: true,
      imageUrl: imageUrl,
      model: imageModel,
      source: 'fastrouter'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate image', success: false });
  }
});

// Initialize key cache before starting server
initializeKeyCache();

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Configured services:');

  // Keys are now cached, these calls are O(1)
  const groqKeys = extractKeys('GROQ_API_KEY');
  const geminiKeys = extractKeys('GOOGLE_API_KEY');
  const perplexityKeys = extractKeys('PERPLEXITY_API_KEY');
  const openaiKeys = extractKeys('OPENAI_API_KEY');
  const openrouterKeys = extractKeys('OPENROUTER_API_KEY');
  const githubKeys = extractKeys('GITHUB_TOKEN');
  const cohereKeys = extractKeys('COHERE_API_KEY');
  const xaiKeys = extractKeys('XAI_API_KEY');
  const fastrouterKeys = extractKeys('FASTROUTER_API_KEY');

  console.log('- Groq:', groqKeys.length, 'keys');
  console.log('- Gemini:', geminiKeys.length, 'keys');
  console.log('- Perplexity:', perplexityKeys.length, 'keys');
  console.log('- OpenAI:', openaiKeys.length, 'keys');
  console.log('- OpenRouter:', openrouterKeys.length, 'keys');
  console.log('- GitHub:', githubKeys.length, 'keys');
  console.log('- Cohere:', cohereKeys.length, 'keys');
  console.log('- XAI:', xaiKeys.length, 'keys');
  console.log('- FastRouter:', fastrouterKeys.length, 'keys');

  // Show total keys
  const totalKeys = groqKeys.length + geminiKeys.length + perplexityKeys.length +
    openaiKeys.length + openrouterKeys.length + githubKeys.length + cohereKeys.length + xaiKeys.length + fastrouterKeys.length;
  console.log('Total API keys configured:', totalKeys);

  if (totalKeys === 0) {
    console.warn('\n⚠️  WARNING: No API keys found!');
    console.warn('Please ensure your .env.local or .env file contains API keys.');
    console.warn('Example: GROQ_API_KEY1="your-key-here"');
  }
});