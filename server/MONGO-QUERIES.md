## MongoDB setup queries (collections + indexes)

Run these in Mongo shell (`mongosh`) after selecting your DB:

```javascript
use ngo_connect

db.createCollection("users")
db.createCollection("otps")

db.users.createIndex({ role: 1 })
db.users.createIndex({ mobile: 1, role: 1 }, { unique: true, sparse: true })
db.users.createIndex({ email: 1, role: 1 }, { unique: true, sparse: true })

db.otps.createIndex({ mobile: 1 })
db.otps.createIndex({ role: 1 })
db.otps.createIndex({ expiresAt: 1 })
db.otps.createIndex({ mobile: 1, role: 1, createdAt: -1 })
db.otps.createIndex({ providerVerificationId: 1 })
```

Notes:
- Mongoose auto-creates collections, but these queries are useful if you want explicit DB setup.
- OTP records are still validated by `expiresAt` in API logic.

