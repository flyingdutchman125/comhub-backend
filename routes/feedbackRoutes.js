const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbacks } = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint: Mengirim saran (Publik, TANPA verifyToken)
router.post('/communities/:communityId/feedbacks', submitFeedback);

// Endpoint: Melihat daftar saran (Protected, butuh token pengurus)
router.get('/communities/:communityId/feedbacks', verifyToken, getFeedbacks);

module.exports = router;