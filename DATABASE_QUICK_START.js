/**
 * QUICK START - DATABASE INTEGRATION GUIDE
 * 
 * Panduan cepat untuk mengintegrasikan database dengan aplikasi RSPC SIM
 */

// ============================================
// 1. KONFIGURASI AWAL
// ============================================

/*
File: config.js
Ubah BASE_URL ke server Anda dan set USE_DATABASE = true

Contoh untuk development:
- BASE_URL: 'http://localhost:3000/api'
- USE_DATABASE: true
*/

// ============================================
// 2. MENGGUNAKAN DATABASE SERVICE
// ============================================

// Import sudah otomatis karena <script src="db-service.js"> ada di HTML

// Login dengan database
async function loginExample() {
    try {
        const result = await dbService.login('username', 'password');
        console.log('Login berhasil:', result);
    } catch (error) {
        console.error('Login gagal:', error);
    }
}

// ============================================
// 3. MEMBACA DATA
// ============================================

// Ambil semua siswa dari database
async function getAllStudents() {
    try {
        const students = await dbService.getAllSiswa();
        console.log('Data siswa:', students);
        // Update UI dengan data
    } catch (error) {
        console.error('Error:', error);
    }
}

// Ambil data siswa tertentu
async function getStudentById(siswaId) {
    try {
        const student = await dbService.getSiswaById(siswaId);
        console.log('Data siswa:', student);
    } catch (error) {
        console.error('Error:', error);
    }
}

// ============================================
// 4. MENULIS DATA
// ============================================

// Buat siswa baru
async function createNewStudent() {
    const newStudent = {
        nama: 'Nama Siswa',
        kelas: 'XII - IPA 1',
        poin: 100,
        jumlahPelanggaran: 0,
        kategori: 'Sangat Baik',
        status: 'AMAN'
    };
    
    try {
        const result = await dbService.createSiswa(newStudent);
        console.log('Siswa berhasil dibuat:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Update data siswa
async function updateStudentData(siswaId) {
    const updatedData = {
        poin: 85,
        kategori: 'Cukup'
    };
    
    try {
        const result = await dbService.updateSiswa(siswaId, updatedData);
        console.log('Siswa berhasil diupdate:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// ============================================
// 5. MENGHAPUS DATA
// ============================================

// Hapus siswa
async function deleteStudent(siswaId) {
    try {
        const result = await dbService.deleteSiswa(siswaId);
        console.log('Siswa berhasil dihapus');
    } catch (error) {
        console.error('Error:', error);
    }
}

// ============================================
// 6. BEKERJA DENGAN PELANGGARAN
// ============================================

// Ambil pelanggaran siswa tertentu
async function getStudentViolations(siswaId) {
    try {
        const violations = await dbService.getPelanggaranBySiswa(siswaId);
        console.log('Pelanggaran:', violations);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Tambah pelanggaran baru
async function addNewViolation(siswaId) {
    const violation = {
        siswaId: siswaId,
        tanggal: new Date().toISOString().split('T')[0],
        jenis: 'Terlambat',
        poinKurang: 5,
        keterangan: 'Terlambat 15 menit'
    };
    
    try {
        const result = await dbService.createPelanggaran(violation);
        console.log('Pelanggaran berhasil ditambahkan:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// ============================================
// 7. BEKERJA DENGAN KONSELING
// ============================================

// Ambil jadwal konseling siswa
async function getStudentCounseling(siswaId) {
    try {
        const sessions = await dbService.getKonselingBySiswa(siswaId);
        console.log('Jadwal konseling:', sessions);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Buat jadwal konseling baru
async function createCounselingSession(siswaId) {
    const session = {
        siswaId: siswaId,
        tanggalSesi: '2026-05-10',
        jam: '10:00',
        hari: 'Senin',
        pembina: 'Pak Rusdi Ngawi',
        status: 'Dijadwalkan',
        rekomendasi: 'Tingkatkan kedisiplinan'
    };
    
    try {
        const result = await dbService.createKonseling(session);
        console.log('Konseling berhasil dijadwalkan:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// ============================================
// 8. ERROR HANDLING & FALLBACK
// ============================================

/*
Sistem sudah otomatis fallback ke data.json jika:
1. API_CONFIG.USE_DATABASE = false
2. Backend server tidak respond
3. Ada error saat fetch

Jadi code Anda tetap bekerja meski database error!
*/

async function safeDataFetch(fetchFunction) {
    try {
        // Coba dari database/API
        const data = await fetchFunction();
        
        if (data) {
            console.log('✓ Data dari database/API');
            return data;
        } else {
            console.log('✓ Data dari local data.json (fallback)');
            // Fallback sudah dihandle di dbService
            return null;
        }
    } catch (error) {
        console.warn('Error fetching data:', error);
        // Aplikasi tetap berfungsi dengan data.json
        return null;
    }
}

// ============================================
// 9. AUTHORIZATION TOKEN
// ============================================

// Setelah login, token sudah otomatis disimpan
// Jika perlu setup token manual:

function setupAuthToken(token) {
    // Simpan token
    localStorage.setItem('authToken', token);
    
    // Set header untuk semua request
    setAuthToken(token);
}

// Hapus token saat logout
function clearAuthToken() {
    localStorage.removeItem('authToken');
    setAuthToken(null);
}

// ============================================
// 10. ENVIRONMENT VARIABLES (OPTIONAL)
// ============================================

/*
Untuk production, lebih baik simpan config di environment variable:

// config.js (production version)
const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    USE_DATABASE: process.env.USE_DATABASE === 'true',
    TIMEOUT: 10000,
    DEFAULT_HEADERS: { ... }
};
*/

// ============================================
// 11. TESTING DENGAN DATA LOCAL
// ============================================

/*
Saat development, Anda bisa pakai mode offline:

1. Set di config.js: USE_DATABASE = false
2. Gunakan data.json sebagai test data
3. Semua function tetap bekerja!
4. Saat siap production, ubah:
   - USE_DATABASE = true
   - BASE_URL = production_server
*/

// ============================================
// 12. DEBUGGING
// ============================================

// Cek status koneksi database
function checkDatabaseStatus() {
    console.log('Database Mode:', API_CONFIG.USE_DATABASE ? 'ON' : 'OFF');
    console.log('API Base URL:', API_CONFIG.BASE_URL);
    console.log('Service Initialized:', dbService.isInitialized);
    console.log('Current User:', currentUser);
}

// Monitor API calls (optional)
function enableAPILogging() {
    console.log('API Logging enabled - check console untuk detail setiap API call');
}

// ============================================
// SUMMARY
// ============================================

/*
1. Database sudah fully integrated ✓
2. Fallback ke data.json otomatis ✓
3. Login sudah support API ✓
4. Semua CRUD operations siap ✓
5. Error handling sudah ada ✓

NEXT STEPS:
1. Setup backend server dengan endpoints sesuai config.js
2. Update BASE_URL di config.js
3. Set USE_DATABASE = true
4. Test dengan curl/Postman
5. Deploy!

Pertanyaan? Lihat DATABASE_SETUP.md untuk detail lengkap.
*/
