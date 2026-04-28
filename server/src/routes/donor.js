const express = require('express')
const donorRouter = express.Router()

// Mock database for demo (in real app, use MongoDB)
let donorData = {
  walletBalance: 0,
  donations: [],
  profile: {
    name: 'Saikiran Abbu',
    email: 'donor@example.com',
    phone: '+91 99999 99999',
    bloodGroup: 'A+',
    notifications: { email: true, push: true, sms: false }
  }
}

// Get profile
donorRouter.get('/profile', (req, res) => {
  res.json(donorData.profile)
})

// Update profile
donorRouter.post('/profile', (req, res) => {
  donorData.profile = { ...donorData.profile, ...req.body }
  res.json({ success: true, profile: donorData.profile })
})

// Get wallet balance
donorRouter.get('/wallet', (req, res) => {
  res.json({ balance: donorData.walletBalance })
})

// Top-up wallet
donorRouter.post('/wallet/topup', (req, res) => {
  const { amount } = req.body
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })
  
  donorData.walletBalance += Number(amount)
  res.json({ balance: donorData.walletBalance, message: 'Top-up successful' })
})

// Get donation history
donorRouter.get('/history', (req, res) => {
  res.json({ donations: donorData.donations })
})

// Create donation
donorRouter.post('/donate', (req, res) => {
  const { type, amount, to } = req.body
  
  if (type === 'cash') {
    if (donorData.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' })
    }
    donorData.walletBalance -= Number(amount)
  }

  const newDonation = {
    id: donorData.donations.length + 1,
    type,
    amount,
    to,
    date: new Date().toISOString().split('T')[0],
    status: type === 'cash' ? 'Success' : 'Pending'
  }

  donorData.donations.unshift(newDonation)
  res.json({ donation: newDonation, balance: donorData.walletBalance })
})

// Clothes Donation (Shiprocket Integration)
donorRouter.post('/clothes', (req, res) => {
  const { items, address, city, pincode, date, time } = req.body
  
  // Simulate Shiprocket Order ID
  const shiprocketOrderId = `SR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
  const newDonation = {
    id: donorData.donations.length + 1,
    type: 'clothes',
    amount: items,
    to: 'NGO Collection Center',
    date: date,
    status: 'Scheduled',
    shiprocket_id: shiprocketOrderId,
    address_details: { address, city, pincode, time }
  }
  
  donorData.donations.unshift(newDonation)
  res.json({ 
    success: true, 
    donation: newDonation,
    shiprocket_order_id: shiprocketOrderId 
  })
})

// Blood Donation
donorRouter.post('/blood', (req, res) => {
  const { bloodGroup, location } = req.body
  const newDonation = {
    id: donorData.donations.length + 1,
    type: 'blood',
    amount: '1 Unit',
    to: location || 'City Blood Bank',
    date: new Date().toISOString().split('T')[0],
    status: 'Completed'
  }
  donorData.donations.unshift(newDonation)
  res.json({ donation: newDonation })
})

module.exports = { donorRouter }
