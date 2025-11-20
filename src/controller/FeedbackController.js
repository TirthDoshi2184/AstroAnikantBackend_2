const Feedback = require('../models/Feedback');

// @desc    Submit new feedback
// @route   POST /api/feedback/submit
// @access  Public
exports.submitFeedback = async (req, res) => {
  try {
    const { email, feedback } = req.body;

    // Validation
    if (!email || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and feedback'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Feedback length validation
    if (feedback.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Feedback must be at least 10 characters long'
      });
    }

    if (feedback.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Feedback cannot exceed 2000 characters'
      });
    }

    // Create new feedback
    const newFeedback = await Feedback.create({
      email: email.trim().toLowerCase(),
      feedback: feedback.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.',
      data: {
        id: newFeedback._id,
        email: newFeedback.email,
        createdAt: newFeedback.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again later.',
      error: error.message
    });
  }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback/all
// @access  Private/Admin
exports.getAllFeedback = async (req, res) => {
  try {
    const { status, isRead, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    // Pagination
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: feedbacks
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// @desc    Get single feedback by ID (Admin)
// @route   GET /api/feedback/:id
// @access  Private/Admin
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Mark as read
    if (!feedback.isRead) {
      feedback.isRead = true;
      await feedback.save();
    }

    res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// @desc    Update feedback status (Admin)
// @route   PUT /api/feedback/:id
// @access  Private/Admin
exports.updateFeedback = async (req, res) => {
  try {
    const { status, adminNotes, rating } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Update fields
    if (status) feedback.status = status;
    if (adminNotes) feedback.adminNotes = adminNotes;
    if (rating) feedback.rating = rating;
    feedback.isRead = true;

    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });

  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
};

// @desc    Delete feedback (Admin)
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

// @desc    Get feedback statistics (Admin)
// @route   GET /api/feedback/stats
// @access  Private/Admin
exports.getFeedbackStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const pending = await Feedback.countDocuments({ status: 'pending' });
    const reviewed = await Feedback.countDocuments({ status: 'reviewed' });
    const resolved = await Feedback.countDocuments({ status: 'resolved' });
    const unread = await Feedback.countDocuments({ isRead: false });

    // Get recent feedback
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email feedback createdAt status');

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        reviewed,
        resolved,
        unread,
        recentFeedback
      }
    });

  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
};