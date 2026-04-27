const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body, validationResult } = require('express-validator'); // TAMBAHAN BARU

// Middleware kecil untuk mengecek hasil validasi
const validateData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Endpoint Register dengan aturan ketat
router.post('/register', [
    body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
], validateData, register);

// Endpoint Login
router.post('/login', login);

module.exports = router;