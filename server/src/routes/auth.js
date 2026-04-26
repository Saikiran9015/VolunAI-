const express = require('express')
const axios = require('axios')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const mongoose = require('mongoose')

const { User } = require('../models/User')
const { Otp } = require('../models/Otp')

const authRouter = express.Router()

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'
const MESSAGECENTRAL_AUTH_TOKEN = process.env.MESSAGECENTRAL_AUTH_TOKEN
const MESSAGECENTRAL_COUNTRY_CODE = process.env.MESSAGECENTRAL_COUNTRY_CODE || '91'

const localUsers = [] // Fallback for demo mode

function createToken(user) {
  return jwt.sign(
    { sub: String(user._id || user.id), role: user.role, fullName: user.fullName },
    AUTH_SECRET,
    { expiresIn: '7d' },
  )
}

authRouter.post('/register', async (req, res) => {
  const schema = z.object({
    role: z.enum(['donor', 'volunteer', 'ngo', 'corporate', 'needy']),
    fullName: z.string().min(2),
    mobile: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    password: z.string().min(6).optional().nullable(),
    stateCity: z.string().optional().nullable(),
    panNumber: z.string().optional().nullable(),
    panName: z.string().optional().nullable(),
    panDob: z.string().optional().nullable(),
    verificationStatus: z.enum(['not_started', 'pending']).optional(),
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    return res.status(400).json({
      error: 'validation_failed',
      message: Object.values(fieldErrors).flat().filter(Boolean).join(', ') || 'Invalid input values',
      fieldErrors,
    })
  }

  const {
    role,
    fullName,
    mobile,
    email,
    password,
    stateCity,
    panNumber,
    panName,
    panDob,
    verificationStatus,
  } = parsed.data
  if (!mobile && !email) return res.status(400).json({ error: 'mobile_or_email_required', message: 'Mobile or Email is required.' })
  if (email && !password) return res.status(400).json({ error: 'password_required_for_email_login', message: 'Password is required for email registration.' })

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined

  try {
    const user = await User.create({
      role,
      fullName,
      mobile: mobile ?? undefined,
      email: email ?? undefined,
      passwordHash,
      stateCity: stateCity ?? undefined,
      panNumber: panNumber?.trim() || undefined,
      panName: panName?.trim() || undefined,
      panDob: panDob?.trim() || undefined,
      panVerificationStatus: panNumber?.trim() ? 'pending' : 'not_submitted',
      verificationStatus: verificationStatus ?? 'not_started',
    })
    const token = createToken(user)
    return res.json({ user: { id: user._id, role: user.role, fullName: user.fullName }, token })
  } catch (e) {
    if (e && e.code === 11000) {
      const duplicateField = Object.keys(e.keyPattern || {})[0] || 'record'
      return res.status(409).json({
        error: 'duplicate_entry',
        message: `${duplicateField} already exists for this role. Please use a different value.`,
      })
    }
    
    // Fallback to Memory Mode if DB is unreachable
    if (mongoose.connection.readyState !== 1) {
      const mockUser = {
        id: 'mock-' + Date.now(),
        role,
        fullName,
        email,
        verificationStatus: 'pending'
      }
      localUsers.push({ ...mockUser, passwordHash })
      const token = createToken(mockUser)
      console.warn('User registered in MEMORY MODE due to DB connection failure.')
      return res.json({ user: mockUser, token, note: 'stored_in_memory' })
    }

    return res.status(409).json({ error: 'user_exists_or_invalid', message: 'Could not create account' })
  }
})

authRouter.post('/login-email', async (req, res) => {
  const schema = z.object({
    role: z.enum(['donor', 'volunteer', 'ngo', 'corporate', 'needy']),
    email: z.string().email(),
    password: z.string().min(1),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { role, email, password } = parsed.data
  
  // Super Admin Bypass for Demo
  if (email.toLowerCase().trim() === 'admin@volunai.ai' && password === 'admin123') {
    const adminUser = { id: 'super-admin', role: 'admin', fullName: 'Super Admin' }
    const token = createToken(adminUser)
    return res.json({ user: adminUser, token })
  }

  let user = await User.findOne({ role, email: email.toLowerCase().trim() }).catch(() => null)
  
  // Fallback to local memory if DB is down
  if (!user && mongoose.connection.readyState !== 1) {
    user = localUsers.find(u => u.role === role && u.email?.toLowerCase().trim() === email.toLowerCase().trim())
  }

  if (!user || !user.passwordHash) return res.status(401).json({ error: 'invalid_credentials' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' })

  const token = createToken(user)
  return res.json({ user: { id: user._id, role: user.role, fullName: user.fullName }, token })
})

authRouter.post('/send-otp', async (req, res) => {
  const schema = z.object({
    role: z.enum(['donor', 'volunteer', 'ngo', 'corporate', 'needy']),
    mobile: z.string().min(6),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { role, mobile } = parsed.data
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
  let provider = 'local'
  let providerVerificationId = null
  let providerSendError = null

  if (MESSAGECENTRAL_AUTH_TOKEN) {
    try {
      const response = await axios.post(
        'https://cpaas.messagecentral.com/verification/v3/send',
        {
          countryCode: MESSAGECENTRAL_COUNTRY_CODE,
          flowType: 'SMS',
          mobileNumber: mobile,
        },
        {
          headers: {
            authToken: MESSAGECENTRAL_AUTH_TOKEN,
          },
        },
      )

      providerVerificationId =
        response?.data?.data?.verificationId ??
        response?.data?.verificationId ??
        null
      if (providerVerificationId) provider = 'messagecentral'
    } catch (err) {
      providerSendError = 'messagecentral_send_failed'
    }
  }

  try {
    await Otp.create({
      role,
      mobile,
      code,
      provider,
      providerVerificationId,
      expiresAt,
    })
  } catch (err) {
    if (mongoose.connection.readyState !== 1) {
       console.warn('OTP stored in memory mode.')
       // We can just skip DB storage for OTP in memory mode
    } else {
       throw err
    }
  }

  const payload = {
    ok: true,
    provider,
    smsFormat: `Your OTP is: ${code}.\\n\\n@localhost #${code}`,
    providerSendError,
  }

  if (process.env.NODE_ENV !== 'production') {
    payload.demoOtp = code
  }

  return res.json(payload)
})

authRouter.post('/verify-otp', async (req, res) => {
  const schema = z.object({
    role: z.enum(['donor', 'volunteer', 'ngo', 'corporate', 'needy']),
    mobile: z.string().min(6),
    otp: z.string().min(4),
    fullName: z.string().optional(),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { role, mobile, otp, fullName } = parsed.data

  let record = null
  try {
    record = await Otp.findOne({
      role,
      mobile,
      code: otp,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 })
  } catch (err) {
    if (mongoose.connection.readyState !== 1) {
      // In memory mode, we accept ANY 6-digit OTP for demo convenience
      console.warn('Accepting demo OTP in memory mode.')
      record = { provider: 'local', code: otp }
    }
  }

  if (!record) return res.status(401).json({ error: 'invalid_or_expired_otp' })

  let isVerified = false

  if (record.provider === 'messagecentral' && record.providerVerificationId && MESSAGECENTRAL_AUTH_TOKEN) {
    try {
      // MessageCentral validation endpoint (provider-side OTP verification)
      const response = await axios.post(
        'https://cpaas.messagecentral.com/verification/v3/validateOtp',
        {
          countryCode: MESSAGECENTRAL_COUNTRY_CODE,
          mobileNumber: mobile,
          verificationId: record.providerVerificationId,
          code: otp,
        },
        {
          headers: {
            authToken: MESSAGECENTRAL_AUTH_TOKEN,
          },
        },
      )

      const status = response?.data?.status || response?.data?.responseCode
      isVerified = Boolean(
        response?.data?.verified === true ||
          response?.data?.data?.verified === true ||
          status === 'SUCCESS' ||
          status === 200,
      )
    } catch (e) {
      isVerified = false
    }
  }

  // Local fallback verification (development / non-provider flow)
  if (!isVerified && record.code) {
    isVerified = record.code === otp
  }

  if (!isVerified) return res.status(401).json({ error: 'invalid_or_expired_otp' })

  record.consumedAt = new Date()
  await record.save()

  // Create user if not exists (OTP-only users)
  let user = await User.findOne({ role, mobile })
  if (!user) {
    user = await User.create({
      role,
      fullName: fullName?.trim() || 'User',
      mobile,
      verificationStatus: 'not_started',
    })
  }

  const token = createToken(user)
  return res.json({ ok: true, user: { id: user._id, role: user.role, fullName: user.fullName }, token })
})

module.exports = { authRouter }

