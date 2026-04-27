const db = require('../config/db');

// --- TAHAP 1: KETUA MENGAJUKAN STATUS UKM ---
const requestUkmApproval = async (req, res) => {
    const communityId = req.params.communityId;
    const userId = req.user.id;

    try {
        // Otorisasi: Hanya KETUA yang bisa mengajukan
        const [checkRole] = await db.query(
            'SELECT community_role FROM community_members WHERE user_id = ? AND community_id = ? AND status_keanggotaan = "AKTIF"',
            [userId, communityId]
        );

        if (checkRole.length === 0 || checkRole[0].community_role !== 'KETUA') {
            return res.status(403).json({ message: 'Akses ditolak! Hanya Ketua yang dapat mengajukan pengesahan.' });
        }

        // Ubah status ke MENUNGGU_DOSEN
        await db.query(
            'UPDATE communities SET approval_status = "MENUNGGU_DOSEN" WHERE id = ?',
            [communityId]
        );

        res.status(200).json({ message: 'Pengajuan berhasil dikirim ke Dosen Pembina.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengajukan UKM.' });
    }
};

// --- TAHAP 2: DOSEN MEMBERIKAN PERSETUJUAN PERTAMA ---
const approveByDosen = async (req, res) => {
    const communityId = req.params.communityId;

    // Otorisasi Global: Pastikan user login adalah DOSEN
    if (req.user.role !== 'DOSEN') {
        return res.status(403).json({ message: 'Akses ditolak! Hanya Dosen yang memiliki wewenang ini.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE communities SET approval_status = "MENUNGGU_KEMAHASISWAAN" WHERE id = ? AND approval_status = "MENUNGGU_DOSEN"',
            [communityId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Komunitas tidak dalam status menunggu persetujuan Dosen.' });
        }

        res.status(200).json({ message: 'Persetujuan Dosen berhasil! Pengajuan diteruskan ke Kemahasiswaan.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan sistem.' });
    }
};

// --- TAHAP 3: KEMAHASISWAAN MENGESAHKAN ---
const approveByKemahasiswaan = async (req, res) => {
    const communityId = req.params.communityId;

    // Otorisasi Global: Pastikan user login adalah KEMAHASISWAAN
    if (req.user.role !== 'KEMAHASISWAAN') {
        return res.status(403).json({ message: 'Akses ditolak! Hanya pihak Kemahasiswaan yang memiliki wewenang ini.' });
    }

    try {
        // Ubah approval_status dan ubah status utama menjadi UKM
        const [result] = await db.query(
            'UPDATE communities SET approval_status = "DISETUJUI", status = "UKM" WHERE id = ? AND approval_status = "MENUNGGU_KEMAHASISWAAN"',
            [communityId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Pengajuan belum disetujui Dosen atau data tidak valid.' });
        }

        res.status(200).json({ message: 'SAH! Komunitas telah resmi menjadi UKM.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan sistem.' });
    }
};

module.exports = { requestUkmApproval, approveByDosen, approveByKemahasiswaan };