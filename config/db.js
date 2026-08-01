// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       maxPoolSize: 10,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });
//     console.log(`✅ MongoDB Cluster Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ MongoDB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');
const dns = require('dns');

// Fix DNS resolution issues on Windows/Local networks (Safe for merging)
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Safe fail-safe if custom DNS can't be applied
}

const connectDB = async () => {
  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log(`✅ MongoDB Cluster Connected: ${conn.connection.host}`);
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected! Attempting to reconnect...');
      });
      
      mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
      });
      
    } catch (error) {
      console.error(`❌ MongoDB Initial Connection Error: ${error.message}`);
      console.log('⏳ Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    }
  };
  
  connectWithRetry();
};

module.exports = connectDB;