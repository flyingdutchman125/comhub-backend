const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments } = require('../controllers/documentController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Endpoint: Mengunggah dokumen (pakai upload.single('file') dari multer)
router.post('/communities/:communityId/documents', verifyToken, upload.single('file'), uploadDocument);

// Endpoint: Melihat daftar dokumen
router.get('/communities/:communityId/documents', verifyToken, getDocuments);

module.exports = router;