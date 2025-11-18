import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  total_jobs: {
    type: Number,
    default: 0,
    min: 0
  },
  availability_status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  hourly_rate: {
    type: Number,
    default: 0,
    min: 0
  },
  bio: {
    type: String,
    default: ''
  },
  verification_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Worker', workerSchema);

