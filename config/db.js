const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Disable buffering globally so we get immediate errors
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Wait 10s for server selection
      socketTimeoutMS: 45000, // Close sockets after 45s
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('Detailed MongoDB Connection Error:');
    console.error('Message:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.name) console.error('Name:', error.name);
    
    // If it's a DNS or network issue, this might help
    if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.error('Suggestion: Check your internet connection and DNS settings.');
    }
  }
};

module.exports = connectDB;
