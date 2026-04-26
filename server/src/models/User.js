const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['donor', 'volunteer', 'ngo', 'corporate', 'needy'],
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, trim: true, index: true, sparse: true },
    email: { type: String, trim: true, lowercase: true, index: true, sparse: true },
    passwordHash: { type: String },
    stateCity: { type: String, trim: true },
    panNumber: { type: String, trim: true, uppercase: true, index: true, sparse: true },
    panName: { type: String, trim: true },
    panDob: { type: String, trim: true },
    panVerificationStatus: {
      type: String,
      enum: ['not_submitted', 'pending', 'verified', 'rejected'],
      default: 'not_submitted',
    },

    verificationStatus: {
      type: String,
      enum: ['not_started', 'pending', 'verified', 'rejected'],
      default: 'not_started',
    },
    kycData: { type: mongoose.Schema.Types.Mixed },
    kycVerifiedAt: { type: Date },
  },
  { timestamps: true },
)

UserSchema.index({ mobile: 1, role: 1 }, { unique: true, sparse: true })
UserSchema.index({ email: 1, role: 1 }, { unique: true, sparse: true })
UserSchema.index({ panNumber: 1, role: 1 }, { unique: true, sparse: true })

const User = mongoose.model('User', UserSchema)

module.exports = { User }

