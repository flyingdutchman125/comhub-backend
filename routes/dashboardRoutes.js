const express = require('express');
const router = express.Router();
const { getPublicDashboard } = require('../controllers/dashboardController');

// Endpoint: Melihat Lensa Transparansi (Bisa diakses publik tanpa token)
router.get('/communities/:communityId/public-dashboard', getPublicDashboard);

module.exports = router;