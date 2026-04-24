/**
 * DB-SERVICE.JS - Database Service Layer
 * File ini menangani semua komunikasi dengan backend/database
 * Semua request ke API melalui file ini
 */

class DatabaseService {
    constructor() {
        this.isInitialized = false;
        this.requestQueue = [];
    }

    /**
     * Menginisialisasi service dengan mengecek koneksi API
     */
    async init() {
        try {
            // Cek apakah database mode aktif
            if (!API_CONFIG.USE_DATABASE) {
                console.log('Database mode OFF - Using local data (data.json)');
                this.isInitialized = true;
                return true;
            }
            
            // Test koneksi ke API
            const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
                method: 'GET',
                headers: API_CONFIG.DEFAULT_HEADERS,
                timeout: 5000
            });
            
            if (response.ok) {
                console.log('✓ Database connection established');
                this.isInitialized = true;
                return true;
            } else {
                console.warn('Database connection failed, falling back to local data');
                API_CONFIG.USE_DATABASE = false;
                this.isInitialized = true;
                return false;
            }
        } catch (error) {
            console.warn('Database connection error:', error.message);
            console.warn('Falling back to local data (data.json)');
            API_CONFIG.USE_DATABASE = false;
            this.isInitialized = true;
            return false;
        }
    }

    /**
     * Generic fetch function untuk semua API request
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {string} endpoint - API endpoint
     * @param {object} data - Data untuk dikirim (untuk POST/PUT)
     * @param {object} params - URL parameters
     * @returns {Promise} Response dari API
     */
    async request(method, endpoint, data = null, params = {}) {
        if (!this.isInitialized) {
            await this.init();
        }

        // Jika database mode OFF, return null (gunakan data.json)
        if (!API_CONFIG.USE_DATABASE) {
            console.log(`[LOCAL] ${method} ${endpoint}`);
            return null;
        }

        const url = getAPIUrl(endpoint, params);
        
        const options = {
            method: method,
            headers: API_CONFIG.DEFAULT_HEADERS,
            timeout: API_CONFIG.TIMEOUT
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`[API] ${method} ${endpoint}`);
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error during ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    /**
     * Login user dengan username dan password
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise} User data dan token
     */
    async login(username, password) {
        try {
            const response = await this.request('POST', API_ENDPOINTS.LOGIN, {
                username,
                password
            });

            if (response && response.token) {
                setAuthToken(response.token);
                localStorage.setItem('authToken', response.token);
            }

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * Logout user
     * @returns {Promise}
     */
    async logout() {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                await this.request('POST', API_ENDPOINTS.LOGOUT);
            }
            
            localStorage.removeItem('authToken');
            setAuthToken(null);
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            // Tetap hapus token meski API request gagal
            localStorage.removeItem('authToken');
            setAuthToken(null);
            return true;
        }
    }

    // ============================================
    // SISWA
    // ============================================

    /**
     * Mendapatkan daftar semua siswa
     * @returns {Promise} Array siswa
     */
    async getAllSiswa() {
        try {
            return await this.request('GET', API_ENDPOINTS.GET_SISWA);
        } catch (error) {
            console.error('Get all siswa failed:', error);
            return null;
        }
    }

    /**
     * Mendapatkan data siswa berdasarkan ID
     * @param {number} siswaId - ID siswa
     * @returns {Promise} Data siswa
     */
    async getSiswaById(siswaId) {
        try {
            return await this.request('GET', API_ENDPOINTS.GET_SISWA_BY_ID, null, { id: siswaId });
        } catch (error) {
            console.error('Get siswa by ID failed:', error);
            return null;
        }
    }

    /**
     * Membuat siswa baru
     * @param {object} siswaData - Data siswa
     * @returns {Promise} Data siswa yang dibuat
     */
    async createSiswa(siswaData) {
        try {
            return await this.request('POST', API_ENDPOINTS.CREATE_SISWA, siswaData);
        } catch (error) {
            console.error('Create siswa failed:', error);
            throw error;
        }
    }

    /**
     * Update data siswa
     * @param {number} siswaId - ID siswa
     * @param {object} siswaData - Data yang diupdate
     * @returns {Promise} Data siswa yang diupdate
     */
    async updateSiswa(siswaId, siswaData) {
        try {
            return await this.request('PUT', API_ENDPOINTS.UPDATE_SISWA, siswaData, { id: siswaId });
        } catch (error) {
            console.error('Update siswa failed:', error);
            throw error;
        }
    }

    /**
     * Menghapus siswa
     * @param {number} siswaId - ID siswa
     * @returns {Promise}
     */
    async deleteSiswa(siswaId) {
        try {
            return await this.request('DELETE', API_ENDPOINTS.DELETE_SISWA, null, { id: siswaId });
        } catch (error) {
            console.error('Delete siswa failed:', error);
            throw error;
        }
    }

    // ============================================
    // PELANGGARAN
    // ============================================

    /**
     * Mendapatkan semua pelanggaran
     * @returns {Promise} Array pelanggaran
     */
    async getAllPelanggaran() {
        try {
            return await this.request('GET', API_ENDPOINTS.GET_PELANGGARAN);
        } catch (error) {
            console.error('Get all pelanggaran failed:', error);
            return null;
        }
    }

    /**
     * Mendapatkan pelanggaran untuk siswa tertentu
     * @param {number} siswaId - ID siswa
     * @returns {Promise} Array pelanggaran siswa
     */
    async getPelanggaranBySiswa(siswaId) {
        try {
            return await this.request('GET', API_ENDPOINTS.GET_PELANGGARAN_BY_SISWA, null, { siswaId });
        } catch (error) {
            console.error('Get pelanggaran by siswa failed:', error);
            return null;
        }
    }

    /**
     * Membuat data pelanggaran baru
     * @param {object} pelanggaranData - Data pelanggaran
     * @returns {Promise} Data pelanggaran yang dibuat
     */
    async createPelanggaran(pelanggaranData) {
        try {
            return await this.request('POST', API_ENDPOINTS.CREATE_PELANGGARAN, pelanggaranData);
        } catch (error) {
            console.error('Create pelanggaran failed:', error);
            throw error;
        }
    }

    /**
     * Update data pelanggaran
     * @param {number} pelanggaranId - ID pelanggaran
     * @param {object} pelanggaranData - Data yang diupdate
     * @returns {Promise} Data pelanggaran yang diupdate
     */
    async updatePelanggaran(pelanggaranId, pelanggaranData) {
        try {
            return await this.request('PUT', API_ENDPOINTS.UPDATE_PELANGGARAN, pelanggaranData, { id: pelanggaranId });
        } catch (error) {
            console.error('Update pelanggaran failed:', error);
            throw error;
        }
    }

    /**
     * Menghapus pelanggaran
     * @param {number} pelanggaranId - ID pelanggaran
     * @returns {Promise}
     */
    async deletePelanggaran(pelanggaranId) {
        try {
            return await this.request('DELETE', API_ENDPOINTS.DELETE_PELANGGARAN, null, { id: pelanggaranId });
        } catch (error) {
            console.error('Delete pelanggaran failed:', error);
            throw error;
        }
    }

    // ============================================
    // KONSELING
    // ============================================

    /**
     * Mendapatkan semua sesi konseling
     * @returns {Promise} Array konseling
     */
    async getAllKonseling() {
        try {
            return await this.request('GET', API_ENDPOINTS.GET_KONSELING);
        } catch (error) {
            console.error('Get all konseling failed:', error);
            return null;
        }
    }

    /**
     * Mendapatkan konseling untuk siswa tertentu
     * @param {number} siswaId - ID siswa
     * @returns {Promise} Array konseling siswa
     */
    async getKonselingBySiswa(siswaId) {
        try {
            return await this.request('GET', API_ENDPOINTS.GET_KONSELING_BY_SISWA, null, { siswaId });
        } catch (error) {
            console.error('Get konseling by siswa failed:', error);
            return null;
        }
    }

    /**
     * Membuat jadwal konseling baru
     * @param {object} konselingData - Data konseling
     * @returns {Promise} Data konseling yang dibuat
     */
    async createKonseling(konselingData) {
        try {
            return await this.request('POST', API_ENDPOINTS.CREATE_KONSELING, konselingData);
        } catch (error) {
            console.error('Create konseling failed:', error);
            throw error;
        }
    }

    /**
     * Update jadwal konseling
     * @param {number} konselingId - ID konseling
     * @param {object} konselingData - Data yang diupdate
     * @returns {Promise} Data konseling yang diupdate
     */
    async updateKonseling(konselingId, konselingData) {
        try {
            return await this.request('PUT', API_ENDPOINTS.UPDATE_KONSELING, konselingData, { id: konselingId });
        } catch (error) {
            console.error('Update konseling failed:', error);
            throw error;
        }
    }

    /**
     * Menghapus jadwal konseling
     * @param {number} konselingId - ID konseling
     * @returns {Promise}
     */
    async deleteKonseling(konselingId) {
        try {
            return await this.request('DELETE', API_ENDPOINTS.DELETE_KONSELING, null, { id: konselingId });
        } catch (error) {
            console.error('Delete konseling failed:', error);
            throw error;
        }
    }

    // ============================================
    // KATEGORI PENILAIAN
    // ============================================

    /**
     * Mendapatkan semua kategori penilaian
     * @returns {Promise} Array kategori
     */
    async getAllKategori() {
        try {
            return await this.request('GET', API_ENDPOINTS.GET_KATEGORI);
        } catch (error) {
            console.error('Get all kategori failed:', error);
            return null;
        }
    }

    /**
     * Membuat kategori penilaian baru
     * @param {object} kategoriData - Data kategori
     * @returns {Promise} Data kategori yang dibuat
     */
    async createKategori(kategoriData) {
        try {
            return await this.request('POST', API_ENDPOINTS.CREATE_KATEGORI, kategoriData);
        } catch (error) {
            console.error('Create kategori failed:', error);
            throw error;
        }
    }

    /**
     * Update kategori penilaian
     * @param {number} kategoriId - ID kategori
     * @param {object} kategoriData - Data yang diupdate
     * @returns {Promise} Data kategori yang diupdate
     */
    async updateKategori(kategoriId, kategoriData) {
        try {
            return await this.request('PUT', API_ENDPOINTS.UPDATE_KATEGORI, kategoriData, { id: kategoriId });
        } catch (error) {
            console.error('Update kategori failed:', error);
            throw error;
        }
    }

    /**
     * Menghapus kategori penilaian
     * @param {number} kategoriId - ID kategori
     * @returns {Promise}
     */
    async deleteKategori(kategoriId) {
        try {
            return await this.request('DELETE', API_ENDPOINTS.DELETE_KATEGORI, null, { id: kategoriId });
        } catch (error) {
            console.error('Delete kategori failed:', error);
            throw error;
        }
    }
}

// Inisialisasi singleton instance
const dbService = new DatabaseService();
