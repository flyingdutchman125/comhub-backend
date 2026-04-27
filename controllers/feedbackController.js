const db = require('../config/db');

// --- FITUR MENGIRIM SARAN ANONIM (BISA DIAKSES PUBLIK) ---
const submitFeedback = async (req, res) => {
    const communityId = req.params.communityId;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Pesan saran tidak boleh kosong!' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO feedbacks (community_id, message) VALUES (?, ?)',
            [communityId, message]
        );

        res.status(201).json({ message: 'Terima kasih! Saran Anda telah dikirim secara anonim.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengirim saran.' });
    }
};

// --- FITUR MEMBACA KOTAK SARAN (KHUSUS PENGURUS) ---
const getFeedbacks = async (req, res) => {
    const communityId = req.params.communityId;
    const userId = req.user.id;

    try {
        // Otorisasi: Pastikan yang membaca adalah KETUA atau SEKRETARIS
        const [checkRole] = await db.query(
            'SELECT community_role FROM community_members WHERE user_id = ? AND community_id = ? AND status_keanggotaan = "AKTIF"',
            [userId, communityId]
        );

        if (checkRole.length === 0 || !['KETUA', 'SEKRETARIS'].includes(checkRole[0].community_role)) {
            return res.status(403).json({ message: 'Akses ditolak! Hanya pengurus yang bisa membaca kotak saran.' });
        }

        const [feedbacks] = await db.query(
            'SELECT message, created_at FROM feedbacks WHERE community_id = ? ORDER BY created_at DESC',
            [communityId]
        );

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil kotak saran.' });
    }
};

module.exports = { submitFeedback, getFeedbacks };