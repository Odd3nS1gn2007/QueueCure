// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const atlasURI = "mongodb+srv://Sankar:Sankar@cluster0.8d9okrk.mongodb.net/queuecure?retryWrites=true&w=majority";
    
    const conn = await mongoose.connect(atlasURI);
    console.log(`🍃 Cloud MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
  }
};

export default connectDB;