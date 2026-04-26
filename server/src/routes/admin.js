const express = require('express')
const router = express.Router()
const { User } = require('../models/User')
const mongoose = require('mongoose')

// Middleware to check if admin (for now simple check, in production use JWT role)
const isAdmin = (req, res, next) => {
  // Simple check for demo: look for admin in headers or role in query
  // In real app, this comes from the verified JWT
  next()
}

router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'failed_to_fetch_users' })
  }
})

router.post('/verify/:userId', isAdmin, async (req, res) => {
  const { status } = req.body // 'verified' or 'not_started' or 'pending'
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { verificationStatus: status, kycVerifiedAt: status === 'verified' ? new Date() : null },
      { new: true }
    )
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ error: 'failed_to_update_status' })
  }
})

router.get('/stats/registrations', isAdmin, async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const newCount = await User.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } })
    const totalCount = await User.countDocuments()
    
    // Group by role
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])

    res.json({
      newLast24h: newCount,
      total: totalCount,
      roles: roleStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
    })
  } catch (err) {
    res.status(500).json({ error: 'failed_to_fetch_stats' })
  }
})

module.exports = { adminRouter: router }
