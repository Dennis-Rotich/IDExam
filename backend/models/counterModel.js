import mongoose from 'mongoose';

//a central, atomic source of truth for all the auto-incrementing IDs.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // The name of the sequence (e.g., 'questionId')
  seq: { type: Number, default: 0 }
});

export default mongoose.model('counter', counterSchema);