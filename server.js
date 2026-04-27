const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const communityRoutes = require('./routes/communityRoutes');
const projectRoutes = require('./routes/projectRoutes');
const financeRoutes = require('./routes/financeRoutes');
const documentRoutes = require('./routes/documentRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar bisa membaca body request berupa JSON
app.use(xssClean());

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Menit
    max: 5,
    message: { message: 'Terlalu banyak percobaan login dari IP ini. Silakan coba lagi dalam 15 menit.' }
});

app.use('/uploads', express.static('uploads'));

// Route dasar untuk testing
app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API ComHub!' });
});

app.use('/api/auth/login', loginLimiter, authRoutes);
// app.use('/api/auth', authRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api', projectRoutes);
app.use('/api', financeRoutes);
app.use('/api', documentRoutes);
app.use('/api', approvalRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', dashboardRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server ComHub berjalan di http://localhost:${PORT}`);
});