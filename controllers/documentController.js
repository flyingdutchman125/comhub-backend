const db = require('../config/db');

// --- FITUR MENGUNGGAH DOKUMEN ---
const uploadDocument = async (req, res) => {
    const communityId = req.params.communityId;
    const { title, document_type } = req.body;
    const userId = req.user.id;

    // req.file didapatkan dari middleware multer
    if (!req.file) {
        return res.status(400).json({ message: 'File wajib diunggah!' });
    }

    // Path file untuk disimpan di database
    const fileUrl = `/uploads/${req.file.filename}`;

    try {
        // 1. Otorisasi: Pastikan yang mengunggah adalah KETUA atau SEKRETARIS
        const [checkRole] = await db.query(
            'SELECT community_role FROM community_members WHERE user_id = ? AND community_id = ? AND status_keanggotaan = "AKTIF"',
            [userId, communityId]
        );

        if (checkRole.length === 0 || !['KETUA', 'SEKRETARIS'].includes(checkRole[0].community_role)) {
            return res.status(403).json({ message: 'Akses ditolak! Hanya Ketua dan Sekretaris yang bisa mengunggah dokumen.' });
        }

        // 2. Simpan data ke database
        const [result] = await db.query(
            'INSERT INTO documents (community_id, title, document_type, file_url, uploaded_by) VALUES (?, ?, ?, ?, ?)',
            [communityId, title, document_type, fileUrl, userId]
        );

        res.status(201).json({ message: 'Dokumen berhasil diunggah!', documentId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah dokumen.' });
    }
};

// --- FITUR MELIHAT DAFTAR DOKUMEN ---
const getDocuments = async (req, res) => {
    const communityId = req.params.communityId;

    try {
        const [documents] = await db.query(
            'SELECT * FROM documents WHERE community_id = ? ORDER BY created_at DESC',
            [communityId]
        );
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil dokumen.' });
    }
};

module.exports = { uploadDocument, getDocuments };