const express = require('express')
const { User } = require('../models/User')
const jwt = require('jsonwebtoken')

const kycRouter = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'change-me'

// Middleware to protect routes
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Auth required' })
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// POST /api/kyc/submit - Save AI verification results
kycRouter.post('/submit', auth, async (req, res) => {
  const { kycResult } = req.body

  try {
    const user = await User.findById(req.user.id || req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.verificationStatus = kycResult.is_verified ? 'verified' : 'rejected'
    user.kycData = kycResult.extracted_data
    user.kycVerifiedAt = new Date()

    // Map specific fields if available
    if (kycResult.extracted_data.pan_number) {
      user.panNumber = kycResult.extracted_data.pan_number
      user.panVerificationStatus = kycResult.is_verified ? 'verified' : 'rejected'
    }

    await user.save()

    res.json({ 
      success: true, 
      status: user.verificationStatus,
      message: kycResult.is_verified ? 'KYC verified successfully' : 'KYC rejected'
    })
  } catch (err) {
    console.error('KYC submit error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/kyc/status - Get current KYC status
kycRouter.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json({
      status: user.verificationStatus,
      kycData: user.kycData,
      verifiedAt: user.kycVerifiedAt
    })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = { kycRouter }
