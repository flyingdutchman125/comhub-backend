const db = require('../config/db');

// --- FITUR MENCATAT PEMASUKAN / PENGELUARAN ---
const addTransaction = async (req, res) => {
    const communityId = req.params.communityId;
    const { type, amount, description, transaction_date } = req.body;
    const userId = req.user.id;

    try {
        // 1. Otorisasi: Pastikan yang menambah data HANYA Ketua atau Bendahara
        const [checkRole] = await db.query(
            'SELECT community_role FROM community_members WHERE user_id = ? AND community_id = ? AND status_keanggotaan = "AKTIF"',
            [userId, communityId]
        );

        if (checkRole.length === 0 || !['KETUA', 'BENDAHARA'].includes(checkRole[0].community_role)) {
            return res.status(403).json({ message: 'Akses ditolak! Hanya Ketua dan Bendahara yang bisa mencatat keuangan.' });
        }

        // 2. Simpan transaksi ke database
        const [result] = await db.query(
            'INSERT INTO finances (community_id, type, amount, description, transaction_date) VALUES (?, ?, ?, ?, ?)',
            [communityId, type, amount, description, transaction_date]
        );

        res.status(201).json({ message: 'Transaksi berhasil dicatat!', transactionId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mencatat keuangan.' });
    }
};

// --- FITUR MELIHAT LAPORAN KEUANGAN (PUBLIC DASHBOARD) ---
const getFinancialReport = async (req, res) => {
    const communityId = req.params.communityId;

    try {
        // 1. Ambil semua data transaksi komunitas tersebut
        const [transactions] = await db.query(
            'SELECT * FROM finances WHERE community_id = ? ORDER BY transaction_date DESC',
            [communityId]
        );

        // 2. Hitung total pemasukan, pengeluaran, dan saldo akhir
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(trx => {
            if (trx.type === 'INCOME') totalIncome += parseFloat(trx.amount);
            if (trx.type === 'EXPENSE') totalExpense += parseFloat(trx.amount);
        });

        const currentBalance = totalIncome - totalExpense;

        res.status(200).json({
            summary: {
                totalIncome,
                totalExpense,
                currentBalance
            },
            history: transactions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil laporan keuangan.' });
    }
};

module.exports = { addTransaction, getFinancialReport };