require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const axios = require('axios')

const { authRouter } = require('./routes/auth')
const { kycRouter } = require('./routes/kyc')
const { adminRouter } = require('./routes/admin')
const { donorRouter } = require('./routes/donor')

const PORT = 4999
const DATABASE_URL = process.env.DATABASE_URL
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4'
const AZURE_OPENAI_API_VERSION =
  process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview'

async function main() {
  const app = express()
  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json({ limit: '1mb' }))

  if (DATABASE_URL) {
    try {
      await mongoose.connect(DATABASE_URL, { serverSelectionTimeoutMS: 8000 });
      console.log('📦 Status: Cloud Infrastructure Connected');
    } catch (err) {
      console.error('❌ Cloud Connection Failed:', err.message);
      console.log('🔄 Attempting local fallback...');
      try {
        await mongoose.connect('mongodb://localhost:27017/VolunAI', { serverSelectionTimeoutMS: 3000 });
        console.log('📦 Status: Local Database Connected');
      } catch (localErr) {
        console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('\x1b[33m%s\x1b[0m', '🛡️  PROTOCOL: LOCAL SECURE MODE ACTIVE')
        console.log('ℹ️  Storage: Encrypted Memory (Demo Mode)')
        console.log('ℹ️  Note: Both Cloud and Local DB unreachable.')
        console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      }
    }
  } else {
    console.warn('DATABASE_URL missing. Auth/OTP DB features may not work; chat can still run.')
  }

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/auth', authRouter)
  app.use('/api/kyc', kycRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api/donor', donorRouter)

  app.post('/api/chat', async (req, res) => {
    const { messages } = req.body || {}

    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY) {
      return res.json({
        role: 'assistant',
        content:
          'VolunAI assistant is in demo mode right now. Configure Azure keys in server/.env to enable live AI responses.',
      })
    }

    try {
      const response = await axios.post(
        `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`,
        {
          messages:
            Array.isArray(messages) && messages.length
              ? messages
              : [{ role: 'user', content: 'Hello!' }],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            'api-key': AZURE_OPENAI_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      )

      const reply = response?.data?.choices?.[0]?.message
      if (!reply) {
        return res.status(500).json({ error: 'No response from Azure OpenAI deployment' })
      }
      return res.json(reply)
    } catch (error) {
      console.error('Azure OpenAI error:', error?.response?.data || error?.message || error)
      return res.json({
        role: 'assistant',
        content:
          'Live AI is temporarily unavailable. You can continue using VolunAI features while chat reconnects.',
      })
    }
  })

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error('Critical server startup error:', err)
})

