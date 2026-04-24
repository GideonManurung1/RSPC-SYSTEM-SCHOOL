/**
 * CONFIG.JS - Konfigurasi Database & API Server
 * File ini berisi pengaturan koneksi database dan API endpoints
 * Gunakan file ini untuk menyesuaikan pengaturan backend Anda
 */

// ============================================
// KONFIGURASI API ENDPOINT
// ============================================
const API_CONFIG = {
    // Ubah BASE_URL sesuai dengan server Anda
    // Contoh: 'http://localhost:3000/api' atau 'https://api.example.com'
    BASE_URL: 'http://localhost:3000/api',
    
    // Timeout untuk request (dalam millisecond)
    TIMEOUT: 10000,
    
    // Aktifkan/Nonaktifkan koneksi database (gunakan data.json jika false)
    USE_DATABASE: false,
    
    // Headers default untuk semua request
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// ============================================
// API ENDPOINTS
// ============================================
const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    
    // Siswa
    GET_SISWA: '/siswa',
    GET_SISWA_BY_ID: '/siswa/:id',
    CREATE_SISWA: '/siswa',
    UPDATE_SISWA: '/siswa/:id',
    DELETE_SISWA: '/siswa/:id',
    
    // Pelanggaran
    GET_PELANGGARAN: '/pelanggaran',
    GET_PELANGGARAN_BY_SISWA: '/pelanggaran/siswa/:siswaId',
    CREATE_PELANGGARAN: '/pelanggaran',
    UPDATE_PELANGGARAN: '/pelanggaran/:id',
    DELETE_PELANGGARAN: '/pelanggaran/:id',
    
    // Konseling
    GET_KONSELING: '/konseling',
    GET_KONSELING_BY_SISWA: '/konseling/siswa/:siswaId',
    CREATE_KONSELING: '/konseling',
    UPDATE_KONSELING: '/konseling/:id',
    DELETE_KONSELING: '/konseling/:id',
    
    // Kategori Penilaian
    GET_KATEGORI: '/kategori',
    CREATE_KATEGORI: '/kategori',
    UPDATE_KATEGORI: '/kategori/:id',
    DELETE_KATEGORI: '/kategori/:id',
    
    // Guru/Pembina
    GET_GURU: '/guru',
    GET_GURU_BY_ID: '/guru/:id',
    CREATE_GURU: '/guru',
    UPDATE_GURU: '/guru/:id',
    DELETE_GURU: '/guru/:id'
};

// ============================================
// FUNGSI HELPER UNTUK KONFIGURASI
// ============================================

/**
 * Mendapatkan full URL untuk endpoint tertentu
 * @param {string} endpoint - Endpoint API
 * @param {object} params - Parameter untuk replace di URL (opsional)
 * @returns {string} Full URL
 */
function getAPIUrl(endpoint, params = {}) {
    let url = API_CONFIG.BASE_URL + endpoint;
    
    // Replace parameter dalam URL
    for (const key in params) {
        url = url.replace(`:${key}`, params[key]);
    }
    
    return url;
}

/**
 * Mengatur API base URL secara dinamis
 * @param {string} newBaseUrl - URL base server
 */
function setAPIBaseUrl(newBaseUrl) {
    API_CONFIG.BASE_URL = newBaseUrl;
    console.log('API Base URL updated to:', newBaseUrl);
}

/**
 * Toggle penggunaan database on/off
 * @param {boolean} useDatabase - true = gunakan database, false = gunakan JSON
 */
function toggleDatabase(useDatabase) {
    API_CONFIG.USE_DATABASE = useDatabase;
    console.log('Database usage:', useDatabase ? 'ON' : 'OFF');
}

/**
 * Menambahkan custom header untuk semua request
 * @param {string} key - Header key
 * @param {string} value - Header value
 */
function addCustomHeader(key, value) {
    API_CONFIG.DEFAULT_HEADERS[key] = value;
    console.log(`Header added: ${key}`);
}

/**
 * Mengatur token authorization untuk API request
 * @param {string} token - JWT token atau authorization token
 */
function setAuthToken(token) {
    if (token) {
        addCustomHeader('Authorization', `Bearer ${token}`);
    } else {
        delete API_CONFIG.DEFAULT_HEADERS['Authorization'];
    }
}

// ============================================
// EXPORT UNTUK PENGGUNAAN DI MODUL LAIN
// ============================================
// Uncomment jika menggunakan ES6 modules
// export { API_CONFIG, API_ENDPOINTS, getAPIUrl, setAPIBaseUrl, toggleDatabase, addCustomHeader, setAuthToken };
