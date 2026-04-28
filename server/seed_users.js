const mongoose = require('mongoose');
require('dotenv').config();
const { User } = require('./src/models/User');

const sampleUsers = [
  { fullName: 'Global Relief Foundation', role: 'ngo', email: 'relief@global.org', mobile: '9876543210', stateCity: 'Mumbai, MH', verificationStatus: 'verified' },
  { fullName: 'Green Earth Initiative', role: 'ngo', email: 'green@earth.org', mobile: '9876543211', stateCity: 'Bangalore, KA', verificationStatus: 'pending' },
  { fullName: 'Saikiran Abbu', role: 'volunteer', email: 'saikiran@volunai.ai', mobile: '9876543212', stateCity: 'Hyderabad, TS', verificationStatus: 'verified' },
  { fullName: 'Priya Sharma', role: 'volunteer', email: 'priya@example.com', mobile: '9876543213', stateCity: 'Delhi, DL', verificationStatus: 'pending' },
  { fullName: 'Rahul Verma', role: 'donor', email: 'rahul@donors.net', mobile: '9876543214', stateCity: 'Pune, MH', verificationStatus: 'verified' },
  { fullName: 'Anita Desai', role: 'donor', email: 'anita@charity.com', mobile: '9876543215', stateCity: 'Chennai, TN', verificationStatus: 'verified' },
  { fullName: 'Tech Corp CSR', role: 'ngo', email: 'csr@techcorp.com', mobile: '9876543216', stateCity: 'San Jose, CA', verificationStatus: 'verified' },
  { fullName: 'City Food Bank', role: 'ngo', email: 'food@city.org', mobile: '9876543217', stateCity: 'Kolkata, WB', verificationStatus: 'pending' },
  { fullName: 'Arjun Kapoor', role: 'volunteer', email: 'arjun@volunai.ai', mobile: '9876543218', stateCity: 'Lucknow, UP', verificationStatus: 'verified' },
  { fullName: 'Sneha Reddy', role: 'volunteer', email: 'sneha@example.com', mobile: '9876543219', stateCity: 'Kochi, KL', verificationStatus: 'pending' },
  { fullName: 'Vikram Singh', role: 'donor', email: 'vikram@wealth.com', mobile: '9876543220', stateCity: 'Jaipur, RJ', verificationStatus: 'verified' },
  { fullName: 'Meera Iyer', role: 'donor', email: 'meera@philanthropy.org', mobile: '9876543221', stateCity: 'Ahmed अहमदाबाद, GJ', verificationStatus: 'verified' },
  { fullName: 'Education for All', role: 'ngo', email: 'edu@forall.org', mobile: '9876543222', stateCity: 'Patna, BR', verificationStatus: 'pending' },
  { fullName: 'Wildlife Rescue', role: 'ngo', email: 'wild@rescue.org', mobile: '9876543223', stateCity: 'Guwahati, AS', verificationStatus: 'verified' },
  { fullName: 'Karthik Raja', role: 'volunteer', email: 'karthik@volunai.ai', mobile: '9876543224', stateCity: 'Mysore, KA', verificationStatus: 'verified' },
  { fullName: 'Anjali Gupta', role: 'volunteer', email: 'anjali@example.com', mobile: '9876543225', stateCity: 'Indore, MP', verificationStatus: 'pending' },
  { fullName: 'Sanjay Malhotra', role: 'donor', email: 'sanjay@biz.com', mobile: '9876543226', stateCity: 'Gurugram, HR', verificationStatus: 'verified' },
  { fullName: 'Lakshmi Nair', role: 'donor', email: 'lakshmi@giving.org', mobile: '9876543227', stateCity: 'Trivandrum, KL', verificationStatus: 'verified' },
  { fullName: 'Clean Water Project', role: 'ngo', email: 'water@project.org', mobile: '9876543228', stateCity: 'Bhopal, MP', verificationStatus: 'verified' },
  { fullName: 'Animal Haven', role: 'ngo', email: 'haven@animals.org', mobile: '9876543229', stateCity: 'Chandigarh, CH', verificationStatus: 'pending' },
];

async function seed() {
  const uris = [
    process.env.DATABASE_URL,
    'mongodb://localhost:27017/VolunAI'
  ].filter(Boolean);

  let success = false;
  for (const uri of uris) {
    try {
      console.log(`Attempting to connect to: ${uri.split('@').pop()}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected successfully!');
      
      for (const user of sampleUsers) {
        try {
          await User.create(user);
          console.log(`Inserted: ${user.fullName}`);
        } catch (err) {
          // console.log(`Skipped: ${user.fullName}`);
        }
      }
      
      console.log('Seeding complete for this DB!');
      success = true;
      break; 
    } catch (err) {
      console.error(`Connection to ${uri.split('@').pop()} failed.`);
    }
  }

  if (!success) {
    console.error('All DB connection attempts failed. Seed aborted.');
    process.exit(1);
  }
  process.exit(0);
}

seed();
