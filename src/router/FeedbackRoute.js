const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats
} = require('../controller/FeedbackController');

// Import your auth middleware (if you have one)
// const { protect, authorize } = require('../middleware/auth');

// Public route
router.post('/submit', submitFeedback);

// Admin routes (add authentication middleware)
// router.get('/all', protect, authorize('admin'), getAllFeedback);
// router.get('/stats', protect, authorize('admin'), getFeedbackStats);
// router.get('/:id', protect, authorize('admin'), getFeedbackById);
// router.put('/:id', protect, authorize('admin'), updateFeedback);
// router.delete('/:id', protect, authorize('admin'), deleteFeedback);

// For now without auth (comment out above and use these):
router.get('/all', getAllFeedback);
router.get('/stats', getFeedbackStats);
router.get('/:id', getFeedbackById);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;