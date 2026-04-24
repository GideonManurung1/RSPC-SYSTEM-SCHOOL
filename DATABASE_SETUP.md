# PANDUAN INTEGRASI DATABASE - RSPC SIM PORTAL

## 📋 Overview

Sistem ini telah disiapkan dengan struktur lengkap untuk integrasi database. Anda dapat dengan mudah menghubungkan sistem ini ke backend server Anda kapan saja.

### Status Saat Ini:
- ✅ **Login Page**: Sudah centered (tampilan sempurna)
- ✅ **Database Layer**: Sudah siap (gunakan local data.json sebagai default)
- 🔄 **Backend Connection**: Siap diintegrasikan

---

## 🗂️ Struktur File

### File Utama untuk Database:

1. **`config.js`** - Konfigurasi API & Database
   - Mengatur BASE_URL server
   - Menentukan endpoints API
   - Mengatur headers dan timeout
   - Mengontrol mode database (ON/OFF)

2. **`db-service.js`** - Service Layer Database
   - Menangani semua komunikasi dengan backend
   - Menyediakan fungsi-fungsi untuk CRUD data
   - Fallback otomatis ke data.json jika database tidak tersedia

3. **`index.html`** - File utama (sudah terintegrasi)
   - Login function sudah siap untuk API
   - Database service sudah diinisialisasi saat page load

---

## 🚀 Cara Mengaktifkan Database

### Step 1: Siapkan Backend Server Anda

Pastikan backend server Anda memiliki API dengan struktur berikut:

```
GET  /api/health                              - Health check
POST /api/auth/login                          - Login user
POST /api/auth/logout                         - Logout user
GET  /api/siswa                               - Dapatkan semua siswa
GET  /api/siswa/:id                           - Dapatkan siswa by ID
POST /api/pelanggaran                         - Buat pelanggaran
GET  /api/pelanggaran/siswa/:siswaId          - Dapatkan pelanggaran siswa
POST /api/konseling                           - Buat jadwal konseling
GET  /api/kategori                            - Dapatkan kategori penilaian
... dan endpoints lainnya (lihat config.js)
```

### Step 2: Ubah Konfigurasi

Edit file `config.js`:

```javascript
// Ganti BASE_URL dengan alamat server Anda
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',  // Ubah ke server Anda
    USE_DATABASE: true,                      // Aktifkan database
    TIMEOUT: 10000,
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
```

### Step 3: Jalankan Aplikasi

Aplikasi akan:
1. ✓ Mencoba konek ke database server
2. ✓ Jika berhasil → Gunakan data dari API
3. ✓ Jika gagal → Fallback ke `data.json` otomatis

---

## 🔌 Contoh API Response Yang Diharapkan

### Login Response:
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "username": "ani",
        "role": "siswa",
        "siswaId": 1
    }
}
```

### Siswa Response:
```json
{
    "id": 1,
    "nama": "Ani Wijaya",
    "kelas": "XII - IPA 2",
    "poin": 75,
    "jumlahPelanggaran": 5,
    "kategori": "Cukup",
    "status": "WASPADA"
}
```

---

## 📝 Fungsi-Fungsi Database yang Tersedia

### Authentication (db-service.js)
```javascript
await dbService.login(username, password)      // Login user
await dbService.logout()                        // Logout user
```

### Siswa
```javascript
await dbService.getAllSiswa()                  // Get semua siswa
await dbService.getSiswaById(id)               // Get siswa by ID
await dbService.createSiswa(data)              // Buat siswa baru
await dbService.updateSiswa(id, data)          // Update siswa
await dbService.deleteSiswa(id)                // Hapus siswa
```

### Pelanggaran
```javascript
await dbService.getAllPelanggaran()            // Get semua pelanggaran
await dbService.getPelanggaranBySiswa(siswaId)// Get pelanggaran siswa
await dbService.createPelanggaran(data)        // Buat pelanggaran
await dbService.updatePelanggaran(id, data)    // Update pelanggaran
await dbService.deletePelanggaran(id)          // Hapus pelanggaran
```

### Konseling
```javascript
await dbService.getAllKonseling()              // Get semua konseling
await dbService.getKonselingBySiswa(siswaId)   // Get konseling siswa
await dbService.createKonseling(data)          // Buat konseling
await dbService.updateKonseling(id, data)      // Update konseling
await dbService.deleteKonseling(id)            // Hapus konseling
```

### Kategori
```javascript
await dbService.getAllKategori()               // Get semua kategori
await dbService.createKategori(data)           // Buat kategori
await dbService.updateKategori(id, data)       // Update kategori
await dbService.deleteKategori(id)             // Hapus kategori
```

---

## 🛠️ Konfigurasi Lanjutan

### Mengatur Custom Headers
```javascript
// Tambah header custom (misalnya untuk authentication)
addCustomHeader('X-Custom-Header', 'value');

// atau untuk JWT token
setAuthToken('your_jwt_token_here');
```

### Toggle Database Mode
```javascript
// Aktifkan database
toggleDatabase(true);

// Nonaktifkan database (gunakan local data)
toggleDatabase(false);
```

### Mengubah Base URL secara Dinamis
```javascript
setAPIBaseUrl('https://api.production.com');
```

---

## 🔐 Keamanan

1. **Jangan simpan password di client-side** (sudah tidak ada di hash)
2. **Gunakan HTTPS** untuk production
3. **Simpan JWT token secara aman** di localStorage atau sessionStorage
4. **Implement CORS** dengan benar di backend
5. **Validate input** di server-side

---

## 📱 Login Page Status

✅ **Sudah Fixed!**
- Login form sekarang **perfectly centered** di tengah layar
- Responsive pada mobile dan desktop
- Menggunakan `fixed` positioning dengan flexbox centering

---

## 🧪 Testing Mode

Saat ini ada data default untuk testing:

**Test Credentials:**
```
Username: ani     / Password: ani123    → Role: siswa
Username: budi    / Password: budi123   → Role: siswa
Username: guru    / Password: guru123   → Role: guru
Username: User    / Password: User123   → Role: admin
```

---

## 🐛 Troubleshooting

### Database tidak connect?
- ✓ Cek console browser untuk error messages
- ✓ Pastikan backend server sudah running
- ✓ Periksa BASE_URL di config.js
- ✓ Sistem otomatis fallback ke data.json

### Login error?
- ✓ Cek credentials
- ✓ Lihat console untuk error details
- ✓ Pastikan API response format sesuai

### Data tidak terupdate?
- ✓ Reload halaman
- ✓ Clear localStorage: `localStorage.clear()`
- ✓ Periksa network tab di Developer Tools

---

## 📞 Next Steps

1. **Siapkan Backend Server** dengan endpoints sesuai config.js
2. **Test koneksi** dengan mengubah `USE_DATABASE: true`
3. **Update data.json** atau gunakan API
4. **Deploy ke production**

---

## 📚 File Reference

- **config.js** (228 lines) - API Configuration & Endpoints
- **db-service.js** (368 lines) - Database Service Layer
- **index.html** - Main application (updated with DB integration)
- **data.json** - Local fallback data
- **styles.css** - Styling
- **script.js** - Utility functions

---

**Status: ✅ Siap untuk Database Integration**

Sistem sudah fully prepared untuk dihubungkan ke database server kapan pun Anda siap! 🎉
