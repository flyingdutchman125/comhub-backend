const express = require('express');
const router = express.Router(); // <--- Ini yang membuat variabel router
const {
    requestUkmApproval,
    approveByDosen,
    approveByKemahasiswaan
} = require('../controllers/approvalController');
const { verifyToken } = require('../middleware/authMiddleware');

// Ketua mengajukan ke Dosen
router.post('/communities/:communityId/request-approval', verifyToken, requestUkmApproval);

// Dosen menyetujui (naik ke Kemahasiswaan)
router.put('/communities/:communityId/dosen-approve', verifyToken, approveByDosen);

// Kemahasiswaan mengesahkan menjadi UKM
router.put('/communities/:communityId/kemahasiswaan-approve', verifyToken, approveByKemahasiswaan);

// WAJIB ADA: Baris inilah yang diekspor ke server.js
module.exports = router;