# Portal Kedisiplinan RCPS Sultan Iskandar Muda

Sistem portal kedisiplinan sekolah dengan fitur lengkap untuk siswa dan admin.

## 🚀 Fitur Utama

### Untuk Siswa:
- ✅ Dashboard dengan status kedisiplinan
- ✅ Riwayat pelanggaran
- ✅ Jadwal konseling
- ✅ Sistem booking konseling online
- ✅ Status poin real-time

### Untuk Admin:
- ✅ Panel manajemen data siswa
- ✅ CRUD jenis pelanggaran
- ✅ Manajemen jadwal konseling
- ✅ Pengaturan kategori penilaian
- ✅ Monitoring semua data

## 🔐 Akun Demo

### Siswa:
- Username: `ani` | Password: `ani123`
- Username: `budi` | Password: `budi123`

### Admin:
- Username: `Admin` | Password: `Admin123`

## 🗄️ Sistem Database

### Opsi 1: JSON + LocalStorage (Current)
Data disimpan dalam file `data.json` dan perubahan disimpan di browser localStorage.

**Keuntungan:**
- Mudah setup
- Tidak butuh server
- Cepat development

**Kekurangan:**
- Data hilang jika clear browser
- Tidak multi-user
- Tidak persistent

### Opsi 2: Backend API (Recommended for Production)

#### Setup dengan Node.js + Express + MongoDB:

1. **Install Dependencies:**
```bash
npm init -y
npm install express mongoose cors dotenv
npm install -D nodemon
```

2. **Struktur Backend:**
```
backend/
├── models/
│   ├── Siswa.js
│   ├── Pelanggaran.js
│   ├── Konseling.js
│   └── Kategori.js
├── routes/
│   ├── siswa.js
│   ├── pelanggaran.js
│   ├── konseling.js
│   └── auth.js
├── middleware/
│   └── auth.js
├── config/
│   └── database.js
├── app.js
└── package.json
```

3. **Model MongoDB (contoh Siswa.js):**
```javascript
const mongoose = require('mongoose');

const siswaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kelas: { type: String, required: true },
  poin: { type: Number, default: 100 },
  jumlahPelanggaran: { type: Number, default: 0 },
  status: { type: String, default: 'AMAN' }
});

module.exports = mongoose.model('Siswa', siswaSchema);
```

4. **API Routes (contoh siswa.js):**
```javascript
const express = require('express');
const router = express.Router();
const Siswa = require('../models/Siswa');

// GET semua siswa
router.get('/', async (req, res) => {
  try {
    const siswa = await Siswa.find();
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST siswa baru
router.post('/', async (req, res) => {
  const siswa = new Siswa({
    nama: req.body.nama,
    kelas: req.body.kelas,
    poin: req.body.poin || 100
  });

  try {
    const newSiswa = await siswa.save();
    res.status(201).json(newSiswa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
```

5. **Frontend Integration:**
Ganti fetch calls dari JSON ke API endpoints:

```javascript
// Dari:
const response = await fetch('./data.json');

// Menjadi:
const response = await fetch('http://localhost:3000/api/siswa');
```

## 📱 Cara Menjalankan

1. **Clone repository**
2. **Buka `index.html` di browser** (untuk versi JSON)
3. **Atau setup backend** untuk versi full-stack

## 🔧 Teknologi Digunakan

- **Frontend:** HTML, CSS (Tailwind), JavaScript
- **Styling:** Tailwind CSS
- **Icons:** Heroicons
- **Database:** JSON/LocalStorage atau MongoDB

## 📋 TODO untuk Production

- [ ] Implementasi autentikasi JWT
- [ ] Role-based access control
- [ ] File upload untuk foto siswa
- [ ] Email notifications untuk konseling
- [ ] Backup & restore database
- [ ] Logging aktivitas admin
- [ ] API rate limiting
- [ ] Input validation & sanitization

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

MIT License - bebas digunakan untuk keperluan pendidikan dan komersial.