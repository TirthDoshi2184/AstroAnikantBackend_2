const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    feedback: {
      type: String,
      required: [true, 'Feedback is required'],
      trim: true,
      minlength: [10, 'Feedback must be at least 10 characters long'],
      maxlength: [2000, 'Feedback cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
feedbackSchema.index({ email: 1, createdAt: -1 });
feedbackSchema.index({ status: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;