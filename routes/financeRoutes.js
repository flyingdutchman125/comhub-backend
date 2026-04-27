const express = require('express');
const router = express.Router();
const { addTransaction, getFinancialReport } = require('../controllers/financeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint: Mencatat transaksi baru (Butuh token & role spesifik)
router.post('/communities/:communityId/finances', verifyToken, addTransaction);

// Endpoint: Melihat laporan keuangan (Bisa dibuat publik tanpa verifyToken agar transparan)
router.get('/communities/:communityId/finances/report', getFinancialReport);

module.exports = router;