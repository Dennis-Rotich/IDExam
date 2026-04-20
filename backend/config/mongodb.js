import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("FATAL ERROR: MONGODB_URI is not defined in the environment.");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // You MUST throw the error here so server.js knows it failed
    throw error; 
  }
};

export default connectDB;
