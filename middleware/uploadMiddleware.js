const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// TAMBAHAN BARU: Filter Ekstensi File
const fileFilter = (req, file, cb) => {
    // Hanya izinkan ekstensi ini
    const allowedTypes = /pdf|jpg|jpeg|png/;
    // Cek ekstensi file
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // Cek MIME type (header file)
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Akses ditolak! Hanya file PDF, JPG, atau PNG yang diperbolehkan.'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // TAMBAHAN BARU: Limit maksimal 5MB
    fileFilter: fileFilter
});

module.exports = upload;