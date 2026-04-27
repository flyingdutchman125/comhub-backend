const bcrypt = require('bcrypt');
// Pastikan path ke config/db sudah benar (asumsi seed.js ada di root folder)
const db = require('./config/db');

const runSeeder = async () => {
    console.log('Memulai proses seeding data akun inti...');

    // Daftar akun yang akan disuntikkan ke database
    const coreUsers = [
        {
            nama: 'Ibu Yunia (Dosen Pembina)',
            email: 'yunia@pens.ac.id',
            password: 'password123',
            global_role: 'DOSEN'
        },
        {
            nama: 'Bapak Admin Kemahasiswaan',
            email: 'kemahasiswaan@pens.ac.id',
            password: 'password123',
            global_role: 'KEMAHASISWAAN'
        }
    ];

    try {
        for (let user of coreUsers) {
            // Cek apakah email sudah ada agar tidak error duplikat
            const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [user.email]);

            if (existingUser.length > 0) {
                console.log(`⏩ Akun ${user.email} sudah ada, melewati...`);
                continue;
            }

            // Hash password sebelum dimasukkan
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            // Suntikkan ke database
            await db.query(
                'INSERT INTO users (nama, email, password, global_role) VALUES (?, ?, ?, ?)',
                [user.nama, user.email, hashedPassword, user.global_role]
            );
            console.log(`✅ Akun ${user.global_role} (${user.email}) berhasil dibuat!`);
        }

        console.log('🎉 Seeding selesai!');
    } catch (error) {
        console.error('❌ Terjadi kesalahan saat seeding:', error);
    } finally {
        // Matikan koneksi agar script berhenti dengan sendirinya
        process.exit();
    }
};

runSeeder();