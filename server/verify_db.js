const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
}

console.log('🔄 Attempting to connect to MongoDB Cloud...');

mongoose.connect(MONGODB_URI, { 
    serverSelectionTimeoutMS: 5000 
})
.then(() => {
    console.log('✅ Success: MongoDB Cloud is CONNECTED!');
    console.log('📂 Database Name:', mongoose.connection.name);
    console.log('🔌 Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    process.exit(0);
})
.catch((err) => {
    console.error('❌ Error: MongoDB Cloud connection FAILED');
    console.error('📝 Details:', err.message);
    process.exit(1);
});
