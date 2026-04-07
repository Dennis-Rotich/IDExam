import mongoose from "mongoose";

const connectDB = async () => {
  console.log("URI:", process.env.MONGODB_URI); // add this temporarily
  mongoose.connection.on("connected", () => console.log("Database connected"));
  await mongoose.connect(`${process.env.MONGODB_URI}/IDExam`);
  console.log(`connection established at ${process.env.MONGODB_URI}/IDExam`);
};

export default connectDB;
