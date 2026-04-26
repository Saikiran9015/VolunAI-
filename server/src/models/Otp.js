const mongoose = require('mongoose')

const OtpSchema = new mongoose.Schema(
  {
    mobile: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ['donor', 'volunteer', 'ngo', 'corporate', 'needy'],
      required: true,
      index: true,
    },
    code: { type: String, default: null },
    provider: { type: String, enum: ['local', 'messagecentral'], default: 'local' },
    providerVerificationId: { type: String, default: null, index: true },
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

OtpSchema.index({ mobile: 1, role: 1, createdAt: -1 })

const Otp = mongoose.model('Otp', OtpSchema)

module.exports = { Otp }

