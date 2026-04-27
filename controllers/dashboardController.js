const db = require('../config/db');

// --- FITUR LENSA TRANSPARANSI (STATISTIK PUBLIK) ---
const getPublicDashboard = async (req, res) => {
    const communityId = req.params.communityId;

    try {
        // 1. Ambil Identitas Komunitas
        const [community] = await db.query('SELECT nama_komunitas, deskripsi, logo, status FROM communities WHERE id = ?', [communityId]);
        if (community.length === 0) {
            return res.status(404).json({ message: 'Komunitas tidak ditemukan!' });
        }

        // 2. Hitung Jumlah Anggota Aktif
        const [members] = await db.query(
            'SELECT COUNT(id) AS total_members FROM community_members WHERE community_id = ? AND status_keanggotaan = "AKTIF"',
            [communityId]
        );

        // 3. Hitung Jumlah Proker (Program Kerja)
        const [projects] = await db.query(
            'SELECT COUNT(id) AS total_projects FROM projects WHERE community_id = ?',
            [communityId]
        );

        // 4. Hitung Saldo Keuangan Singkat
        const [finances] = await db.query(
            'SELECT type, amount FROM finances WHERE community_id = ?',
            [communityId]
        );

        let balance = 0;
        finances.forEach(trx => {
            if (trx.type === 'INCOME') balance += parseFloat(trx.amount);
            if (trx.type === 'EXPENSE') balance -= parseFloat(trx.amount);
        });

        // 5. Gabungkan Semua Data
        res.status(200).json({
            community: community[0],
            statistics: {
                activeMembers: members[0].total_members,
                totalProjects: projects[0].total_projects,
                currentBalance: balance
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data dashboard.' });
    }
};

module.exports = { getPublicDashboard };