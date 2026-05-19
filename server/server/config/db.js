const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("⏳ Initializing handshake with MongoDB Atlas...");
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;