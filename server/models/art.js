import mongoose from 'mongoose';

const artSchema = new mongoose.Schema({
  prompt: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Art = mongoose.model('Art', artSchema);
export default Art;
