const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // File akan disimpan di folder uploads
    },
    filename: function (req, file, cb) {
        // Nama file diubah menjadi timestamp agar unik + ekstensi aslinya (misal: 1682029202.pdf)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Inisialisasi multer
const upload = multer({ storage: storage });

module.exports = upload;