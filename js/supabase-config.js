/**
 * ===================================================================
 * PASKAS BAHAGIA - SUPABASE & LOCAL STORAGE DATA SERVICE
 * ===================================================================
 * Mengatur koneksi cloud database Supabase dengan fallback otomatis
 * ke LocalStorage apabila kredensial belum dikonfigurasi.
 */

// ===================================================================
// KREDENSIAL DEFAULT CLOUD SUPABASE (Otomatis Aktif Saat Deploy Vercel)
// ===================================================================
const DEFAULT_SUPABASE_URL = 'https://cyqtyobzhqzmelmmpbdb.supabase.co'; // Project URL Supabase
const DEFAULT_SUPABASE_KEY = 'sb_publishable_B5TyssfXopumAzcLVGOQSw_GaHtGm5V'; // Project Publishable Key

const STORAGE_KEYS = {
  SUPABASE_URL: 'paskas_supabase_url',
  SUPABASE_KEY: 'paskas_supabase_key',
  REGISTRATIONS: 'paskas_registrations_data',
  SETTINGS: 'paskas_app_settings',
  DELETED_CODES: 'paskas_deleted_registration_codes'
};

// Default Settings Awal
const DEFAULT_SETTINGS = {
  registration_deadline: '2026-12-31T23:59:59',
  is_registration_open: 'true',
  is_room_group_enabled: 'true',
  closed_badge: 'Status: Pendaftaran Ditutup',
  closed_title: 'Mohon Maaf, Pendaftaran Telah Resmi Ditutup',
  closed_desc: 'Masa registrasi peserta Kumpul Keluarga Paskas Bahagia telah berakhir sesuai batas waktu yang telah ditentukan oleh panitia.',
  closed_message: 'Mohon maaf, pendaftaran peserta Paskas Bahagia telah ditutup. Silakan hubungi narahubung panitia.',
  event_headline: 'PASKAS BAHAGIA',
  event_name: 'Kumpul Keluarga  Pasukan Amal Sholeh (PASKAS)',
  event_location: 'Roket Convention Center',
  event_desc: 'Selamat datang di portal resmi registrasi Kumpul Keluarga PASKAS Bahagia. Mari pulang, berkumpul, dan saling menguatkan. Daftarkan dirimu untuk Kumpul Keluarga PASKAS Bahagia, 12-14 November 2026, Sleman, Yogyakarta. Kembali Menghadirkan Rasa dan Makna, Bertumbuh Sehat Bersama.',
  ticket_template_image: 'images/boarding-pass-canva.png',
  uniform_ikhwan_image: 'images/seragam-ikhwan.jpg',
  uniform_akhwat_image: 'images/seragam-akhwat.jpg',
  uniform_title_ikhwan: 'Model Kaos Resmi Ikhwan',
  uniform_title_akhwat: 'Model Kaos / Tunik Resmi Akhwat',
  uniform_desc_ikhwan: 'Bahan katun combed 24s premium adem, sablon plastisol emas logo resmi Paskas Bahagia.',
  uniform_size_chart_ikhwan: 'S: LB 49cm / PB 75cm / PT 20cm\nM: LB 52cm / PB 77cm / PT 21cm\nL: LB 55cm / PB 80cm / PT 22cm\nXL: LB 59cm / PB 82cm / PT 23cm\n2XL: LB 63cm / PB 84cm / PT 24cm\n3XL: LB 66cm / PB 86cm / PT 25cm',
  uniform_size_chart_akhwat: 'S: LD 96cm / PB 64cm / LB 40cm\nM: LD 100cm / PB 66cm / LB 42cm\nL: LD 104cm / PB 68cm / LB 44cm\nXL: LD 108cm / PB 70cm / LB 46cm\nXXL: LD 114cm / PB 72cm / LB 48cm\n3XL: LD 120cm / PB 74cm / LB 50cm\n4XL: LD 126cm / PB 76cm / LB 52cm',
  ticket_airline_name: 'MUNZALAN AIRLINES',
  ticket_event_tag: 'KUMPUL KELUARGA',
  ticket_route_from: 'RANTAUAN',
  ticket_route_to: 'RUMAH',
  confirmation_email_subject: 'Bukti Registrasi & Boarding Pass - Silaturahmi Akbar Paskas Bahagia',
  confirmation_email_body: `Ahlan wa Sahlan, {nama}!

Alhamdulillah, pendaftaran Anda untuk Silaturahmi Akbar Pasukan Amal Sholeh (PASKAS) Bahagia telah BERHASIL kami terima.

📋 DATA RESMI PESERTA:
• Kode Tiket      : {kode_tiket}
• Nama Lengkap    : {nama}
• Jenis Kelamin   : {gender}
• Wilayah Kafilah : {wilayah}
• Daerah Asal     : {daerah}
• Rombongan       : {rombongan}
• Tgl Kedatangan  : {jadwal_kedatangan} ({kendaraan_datang})
• Tgl Kepulangan  : {jadwal_kepulangan} ({kendaraan_pulang})
• Ukuran Seragam  : {ukuran_baju}
• Riwayat Medis   : {riwayat_medis}

🎫 TIKET BOARDING PASS:
Tiket boarding pass resmi Anda telah diterbitkan. Silakan simpan / cetak tiket ini dan tunjukkan kepada panitia pada saat registrasi kedatangan di lokasi acara.

Jazakumullahu Khairan Katsiran,
Panitia Pelaksana Silaturahmi Akbar Paskas Bahagia`,
  google_email_script_url: 'https://script.google.com/macros/s/AKfycbw1k6dhuACxMSKHLqFLKHla2QQzc2CnZddLp93mh98Jg-Mg0etauHLuQ0cakuCMMBZ83A/exec',
  announcement_enabled: 'true',
  announcement_title: 'Pengumuman & Update Acara',
  announcement_date: '20 Oktober 2026, 14:00 WIB',
  announcement_text: 'Ahlan wa Sahlan! Registrasi peserta Silaturahmi Akbar Paskas Bahagia resmi dibuka. Pastikan melengkapi data rombongan dan ukuran seragam dengan benar sebelum batas akhir pendaftaran.'
};

// Data Awal Murni (Kosong / 0 Peserta sampai ada pendaftaran baru)
const INITIAL_DEMO_DATA = [];

class PaskasDataService {
  constructor() {
    this.supabaseClient = null;
    this.isSupabaseConnected = false;
    this.init();
  }

  ensureSupabaseClient() {
    if (this.supabaseClient && this.isSupabaseConnected) {
      return this.supabaseClient;
    }
    let savedUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
    if (!savedUrl || !savedUrl.startsWith('https://') || savedUrl.length < 15) {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
      savedUrl = DEFAULT_SUPABASE_URL;
    }
    let savedKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY);
    if (!savedKey || savedKey.startsWith('eyJ') || savedKey.length < 20) {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
      savedKey = null;
    }
    const effectiveKey = savedKey || DEFAULT_SUPABASE_KEY;

    if (savedUrl && effectiveKey && typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        this.supabaseClient = window.supabase.createClient(savedUrl, effectiveKey);
        this.isSupabaseConnected = true;
        return this.supabaseClient;
      } catch (e) {
        console.warn('Gagal menginisialisasi Supabase client:', e);
        this.isSupabaseConnected = false;
      }
    }
    return null;
  }

  /**
   * Menunggu hingga Supabase client siap tersambung (anti-race condition jaringan lambat / mobile)
   */
  async waitForSupabase(timeoutMs = 1200) {
    if (this.ensureSupabaseClient()) return this.supabaseClient;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        const client = this.ensureSupabaseClient();
        if (client) return client;
      }
      await new Promise(r => setTimeout(r, 120));
    }
    return this.ensureSupabaseClient();
  }

  init() {
    this.ensureSupabaseClient();
    try {
      localStorage.removeItem(STORAGE_KEYS.DELETED_CODES);
    } catch (e) {}

    // Inisialisasi data lokal jika masih kosong atau bersihkan data dummy demo / test lama
    const existing = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
    } else {
      try {
        const parsed = JSON.parse(existing);
        if (Array.isArray(parsed)) {
          const testCodes = new Set(['PKB-001', 'PKB-002', 'PKB-003', 'PKB-004', 'PKB-IND-2026-001']);
          const cleaned = parsed.filter(p => p && !testCodes.has(p.registration_code) && p.full_name !== 'Ustadz Ahmad Fauzi');
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(cleaned));
            ['PKB-001', 'PKB-002', 'PKB-003', 'PKB-004'].forEach(code => this.recordDeletedCode(code));
          }
        }
      } catch (e) { }
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }

    // Auto-sync otomatis ketika browser/HP pengguna kembali mendapatkan sinyal online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Koneksi internet online kembali. Memeriksa antrean sinkronisasi Supabase...');
        this.syncLocalToSupabase().catch(() => { });
      });
    }
  }

  /**
   * Status koneksi aktif Supabase
   */
  isSupabaseConfigured() {
    this.ensureSupabaseClient();
    return Boolean(this.isSupabaseConnected && this.supabaseClient);
  }

  /**
   * Sinkronisasi pengaturan cloud Supabase ke localStorage
   */
  async syncSettingsFromSupabase() {
    this.ensureSupabaseClient();
    let data = null;

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const res = await this.supabaseClient.from('app_settings').select('*');
        if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
          data = res.data;
        }
      } catch (e) {
        console.warn('Gagal membaca app_settings via SDK, mencoba REST fetch:', e);
      }
    }

    if (!data) {
      try {
        const creds = this.getCredentials();
        if (creds.url && creds.key) {
          const cleanUrl = creds.url.replace(/\/+$/, '');
          const resp = await fetch(`${cleanUrl}/rest/v1/app_settings?select=*`, {
            headers: {
              'apikey': creds.key,
              'Authorization': `Bearer ${creds.key}`
            }
          });
          if (resp.ok) {
            const json = await resp.json();
            if (Array.isArray(json) && json.length > 0) {
              data = json;
              this.isSupabaseConnected = true;
            }
          }
        }
      } catch (fetchErr) {
        console.warn('REST API settings fetch error:', fetchErr);
      }
    }

    if (Array.isArray(data) && data.length > 0) {
      try {
        const cloudSettings = {};
        data.forEach(row => {
          if (!row.setting_key) return;
          cloudSettings[row.setting_key] = row.setting_value;

          // Sinkronisasi data struktur khusus ke LocalStorage jika tersimpan di Supabase
          if (row.setting_key === 'paskas_rooms_data' || row.setting_key === 'master_rooms') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_rooms_data', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'paskas_groups_data' || row.setting_key === 'master_groups') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_groups_data', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'paskas_master_wilayah' || row.setting_key === 'master_wilayah') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_master_wilayah', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'paskas_custom_cards' || row.setting_key === 'dashboard_cards') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_custom_cards', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'paskas_reg_content' || row.setting_key === 'reg_content') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_reg_content', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'paskas_admin_password') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_admin_password', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'is_room_group_enabled' || row.setting_key === 'paskas_room_group_enabled') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_room_group_enabled', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'paskas_announcements_list' || row.setting_key === 'announcements_list') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_announcements_list', row.setting_value);
            } catch (e) { }
          } else if (row.setting_key === 'uniform_ikhwan_image') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_ikhwan_image', row.setting_value); } catch (e) { }
          } else if (row.setting_key === 'uniform_akhwat_image') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_akhwat_image', row.setting_value); } catch (e) { }
          } else if (row.setting_key === 'uniform_title_ikhwan') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_ikhwan_title', row.setting_value); } catch (e) { }
          } else if (row.setting_key === 'uniform_title_akhwat') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_akhwat_title', row.setting_value); } catch (e) { }
          } else if (row.setting_key === 'uniform_desc_ikhwan') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_ikhwan_desc', row.setting_value); } catch (e) { }
          } else if (row.setting_key === 'uniform_desc_akhwat') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_akhwat_desc', row.setting_value); } catch (e) { }
          } else if (row.setting_key === 'uniform_size_chart_ikhwan' || row.setting_key === 'paskas_uniform_size_chart_ikhwan') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_size_chart_ikhwan', row.setting_value); } catch (e) { }
          } else if (row.setting_key === 'uniform_size_chart_akhwat' || row.setting_key === 'paskas_uniform_size_chart_akhwat') {
            try { if (row.setting_value) localStorage.setItem('paskas_uniform_size_chart_akhwat', row.setting_value); } catch (e) { }
          }
        });
        const merged = { ...this.getSettings(), ...cloudSettings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.warn('Gagal membaca app_settings dari Supabase:', e);
      }
    }
    return null;
  }

  /**
   * Mengambil kredensial yang tersimpan
   */
  getCredentials() {
    const localUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
    const localKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY);
    return {
      url: (localUrl && localUrl.trim() !== '') ? localUrl.trim() : (DEFAULT_SUPABASE_URL || ''),
      key: (localKey && localKey.trim() !== '') ? localKey.trim() : (DEFAULT_SUPABASE_KEY || '')
    };
  }

  /**
   * Menyimpan kredensial Supabase
   */
  setCredentials(url, key) {
    if (url && key) {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
      localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
      if (window.supabase) {
        this.supabaseClient = window.supabase.createClient(url.trim(), key.trim());
        this.isSupabaseConnected = true;
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
      this.supabaseClient = null;
      this.isSupabaseConnected = false;
    }
  }

  /**
   * Menguji koneksi ke Supabase
   */
  async testConnection(url, key) {
    if (!window.supabase) {
      throw new Error('Pustaka Supabase JS belum siap');
    }
    try {
      const testClient = window.supabase.createClient(url.trim(), key.trim());
      const { data, error } = await testClient.from('registrations').select('id').limit(1);
      if (error) {
        // Jika tabel belum dibuat tapi kredensial benar
        if (error.code === '42P01') {
          return { success: true, tableMissing: true, message: 'Koneksi Berhasil! Namun tabel "registrations" belum dibuat di SQL Editor.' };
        }
        throw error;
      }
      return { success: true, tableMissing: false, message: 'Koneksi ke Supabase Berhasil dan tabel registrations ditemukan!' };
    } catch (err) {
      return { success: false, error: err.message || 'Koneksi gagal diperiksa' };
    }
  }

  /**
   * Kolom resmi yang terdaftar di tabel Supabase registrations
   */
  getValidRegistrationColumns() {
    return new Set([
      'id',
      'registration_code',
      'registration_type',
      'group_name',
      'group_leader_name',
      'full_name',
      'gender',
      'wilayah',
      'email',
      'phone_number',
      'emergency_phone',
      'arrival_date',
      'arrival_time',
      'departure_date',
      'departure_time',
      'transport_arrival',
      'transport_departure',
      'cloth_size',
      'medical_history',
      'notes',
      'created_at',
      'updated_at',
      'daerah',
      'age',
      'is_child',
      'building',
      'room_number',
      'room_name',
      'guardian_name',
      'group_code',
      'join_year',
      'photo_url'
    ]);
  }

  /**
   * Bersihkan object peserta agar hanya mengirimkan kolom yang dikenali oleh Supabase
   */
  sanitizeRegistrationPayload(record) {
    if (!record || typeof record !== 'object') return {};
    const validCols = this.getValidRegistrationColumns();
    const clean = {};
    for (const [key, val] of Object.entries(record)) {
      if (validCols.has(key)) {
        clean[key] = val;
      }
    }
    if (clean.photo_url !== undefined && clean.photo_url !== null && typeof clean.photo_url !== 'string') {
      delete clean.photo_url;
    }
    return clean;
  }

  getDeletedCodes() {
    return [];
  }

  recordDeletedCode(code) {
    // Dinonaktifkan: penghapusan data hanya dilakukan secara sah via deleteRegistration di Cloud Supabase
  }

  removeDeletedCode(code) {
    // Dinonaktifkan
  }

  /**
   * Upload pas foto (base64) ke Supabase Storage bucket 'foto-peserta' dan kembalikan link publiknya.
   * Jika gagal, kembalikan data asli agar foto tidak hilang.
   */
  async uploadPhotoIfNeeded(photo, registrationCode) {
    if (typeof photo !== 'string' || !photo.startsWith('data:image')) return photo;
    if (!this.isSupabaseConnected || !this.supabaseClient) return photo;
    try {
      const blob = await (await fetch(photo)).blob();
      const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
      const safeCode = String(registrationCode || 'PKB').replace(/[^a-zA-Z0-9-]/g, '_');
      const path = `foto-peserta/${safeCode}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      // Utamakan bucket 'paskas bahagia' yang sudah ada di Supabase
      const bucketName = 'paskas bahagia';
      let { error } = await this.supabaseClient.storage
        .from(bucketName)
        .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false });

      if (error && error.message && error.message.includes('Bucket not found')) {
        const fb = await this.supabaseClient.storage
          .from('foto-peserta')
          .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false });
        if (!fb.error) {
          const { data } = this.supabaseClient.storage.from('foto-peserta').getPublicUrl(path);
          return (data && data.publicUrl) || photo;
        }
      }

      if (error) throw error;
      const { data } = this.supabaseClient.storage.from(bucketName).getPublicUrl(path);
      return (data && data.publicUrl) || photo;
    } catch (err) {
      console.warn('Gagal upload foto ke Supabase Storage, simpan base64 sebagai cadangan:', err);
      return photo;
    }
  }

  /**
   * Upload file gambar / dataUrl ke Supabase Storage (bucket 'paskas bahagia')
   * folder: 'cards', 'uniforms', 'polaroids', dll.
   * Mengembalikan URL publik permanen dari Supabase Storage.
   */
  async uploadAssetFile(fileOrDataUrl, folder = 'assets', prefix = 'img') {
    if (!fileOrDataUrl) return fileOrDataUrl;
    if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:image')) {
      return fileOrDataUrl; // Sudah berbentuk link URL
    }
    this.ensureSupabaseClient();
    if (!this.isSupabaseConnected || !this.supabaseClient) return fileOrDataUrl;
    try {
      let blob;
      let ext = 'jpg';
      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:image/')) {
        const res = await fetch(fileOrDataUrl);
        blob = await res.blob();
        ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
      } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
        blob = fileOrDataUrl;
        ext = (fileOrDataUrl.type?.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
      } else {
        return fileOrDataUrl;
      }

      const safePrefix = String(prefix || 'asset').replace(/[^a-zA-Z0-9-]/g, '_');
      const path = `${folder}/${safePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const bucketName = 'paskas bahagia';
      const { error } = await this.supabaseClient.storage
        .from(bucketName)
        .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: true });
      if (error) throw error;
      const { data } = this.supabaseClient.storage.from(bucketName).getPublicUrl(path);
      return (data && data.publicUrl) || fileOrDataUrl;
    } catch (err) {
      console.warn('Gagal upload asset ke Supabase Storage:', err);
      return fileOrDataUrl;
    }
  }

  /**
   * Mengambil semua pendaftaran peserta (Sinkron Cloud Supabase & Local)
   */
  async getRegistrations() {
    // Tunggu Supabase client siap (anti race-condition saat CDN belum fully loaded)
    await this.waitForSupabase(1200);
    let cloudList = null;
    const deletedCodes = new Set(this.getDeletedCodes());

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          cloudList = data;
        } else if (error) {
          console.warn('Supabase getRegistrations error:', error.message || error);
        }
      } catch (e) {
        console.warn('Gagal query Supabase SDK, mencoba direct REST fetch:', e);
      }
    }

    // RESILIENT FALLBACK: Direct REST API fetch menggunakan apikey default
    if (cloudList === null) {
      try {
        const creds = this.getCredentials();
        if (creds.url && creds.key) {
          const cleanUrl = creds.url.replace(/\/+$/, '');
          const resp = await fetch(`${cleanUrl}/rest/v1/registrations?select=*&order=created_at.desc`, {
            headers: {
              'apikey': creds.key,
              'Authorization': `Bearer ${creds.key}`
            }
          });
          if (resp.ok) {
            const restData = await resp.json();
            if (Array.isArray(restData)) {
              cloudList = restData;
              this.isSupabaseConnected = true;
            }
          } else {
            console.warn('Direct REST fetch returned status:', resp.status);
          }
        }
      } catch (fetchErr) {
        console.warn('Direct REST fetch fallback error:', fetchErr);
      }
    }

    let local = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      local = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(local)) local = [];
    } catch {
      local = [];
    }

    if (cloudList !== null) {
      // Gabungkan data lokal yang belum tersinkron ke cloud (offline pending) jika ada

      // 2. Gabungkan data lokal yang belum tersinkron ke cloud (dan bukan data yang sengaja dihapus)
      // Hanya data yang ditandai _is_offline_pending (gagal tersimpan ke cloud) yang boleh di-sync ulang,
      // agar cache lama dari perangkat lain tidak membangkitkan kembali data yang sudah dihapus.
      const cloudCodes = new Set(cloudList.map(r => r.registration_code));
      const localOnly = local.filter(r =>
        r &&
        r.registration_code &&
        r._is_offline_pending === true &&
        !deletedCodes.has(r.registration_code) &&
        !cloudCodes.has(r.registration_code)
      );

      if (localOnly.length > 0) {
        // Gabungkan agar data yang sudah diinput lokal tidak pernah hilang dari tabel
        cloudList = [...localOnly, ...cloudList];

        // Sinkronkan data lokal yang belum ada di cloud ke Supabase
        try {
          const cleanToSync = localOnly.map(r => {
            const clean = this.sanitizeRegistrationPayload(r);
            delete clean._is_offline_pending;
            delete clean.id; // Hindari constraint ID saat sync data baru
            return clean;
          });
          const { data: savedRows, error: upErr } = await this.supabaseClient
            .from('registrations')
            .insert(cleanToSync)
            .select();
          if (!upErr && savedRows && savedRows.length > 0) {
            const savedMap = new Map(savedRows.map(s => [s.registration_code, s]));
            cloudList = cloudList.map(item => savedMap.get(item.registration_code) || item);
          }
        } catch (syncErr) {
          console.warn('Gagal sync data lokal baru ke Supabase:', syncErr);
        }
      }

      // Update LocalStorage agar selalu konsisten dengan data gabungan cloud & lokal yang valid
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(cloudList));
      return cloudList;
    }

    // Jika sedang offline (Supabase tidak dapat dijangkau), gunakan LocalStorage
    if (deletedCodes.size > 0) {
      local = local.filter(r => !deletedCodes.has(r.registration_code));
    }
    return local;
  }

  /**
   * Menyimpan satu peserta baru (Individu) langsung ke Supabase
   */
  async addRegistration(record) {
    await this.waitForSupabase(6000);
    if (record && record.registration_code) {
      this.removeDeletedCode(record.registration_code);
    }
    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      created_at: record.created_at || now,
      updated_at: now
    };

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        newRecord.photo_url = await this.uploadPhotoIfNeeded(newRecord.photo_url, newRecord.registration_code);
        const insertData = this.sanitizeRegistrationPayload(newRecord);
        delete insertData.id;
        const { data, error } = await this.supabaseClient
          .from('registrations')
          .insert([insertData])
          .select();

        if (error && error.code === '23505') {
          // Unique key collision, ambil sequence terbaru dari Supabase dan coba lagi
          const { data: latest } = await this.supabaseClient
            .from('registrations')
            .select('registration_code')
            .order('id', { ascending: false })
            .limit(1);
          let newSeq = 2;
          if (latest && latest[0] && latest[0].registration_code) {
            const m = String(latest[0].registration_code).match(/PKB-(\d+)/i);
            if (m && m[1]) newSeq = parseInt(m[1], 10) + 1;
          }
          newRecord.registration_code = `PKB-${String(newSeq).padStart(3, '0')}`;
          const retryData = this.sanitizeRegistrationPayload(newRecord);
          delete retryData.id;
          const { data: retryRes, error: retryErr } = await this.supabaseClient
            .from('registrations')
            .insert([retryData])
            .select();
          if (!retryErr && retryRes && retryRes[0]) {
            newRecord.id = retryRes[0].id;
            newRecord._is_offline_pending = false;
          } else {
            throw retryErr || error;
          }
        } else if (error) {
          // Jika Supabase menolak karena kolom belum dibuat di PostgreSQL Supabase
          if (error.message && (error.message.includes('photo_url') || error.message.includes('column') || error.code === '42703' || error.code === 'PGRST204')) {
            console.warn('Kolom photo_url belum ada di remote Supabase. Menyimpan data peserta tanpa kolom photo_url...');
            const fallbackData = { ...insertData };
            delete fallbackData.photo_url;
            const { data: fbData, error: fbErr } = await this.supabaseClient
              .from('registrations')
              .insert([fallbackData])
              .select();
            if (!fbErr && fbData && fbData[0]) {
              newRecord.id = fbData[0].id;
              newRecord._is_offline_pending = false;
            } else {
              throw fbErr || error;
            }
          } else {
            console.warn('Supabase insert registration error:', error);
            throw error;
          }
        }

        if (data && data[0]) {
          newRecord.id = data[0].id;
          newRecord._is_offline_pending = false;
        }
      } catch (err) {
        console.warn('Gagal simpan ke Supabase via SDK, mencoba REST fallback:', err);
        newRecord._is_offline_pending = true;
      }
    } else {
      newRecord._is_offline_pending = true;
    }

    if (!newRecord.id || newRecord._is_offline_pending) {
      try {
        const creds = this.getCredentials();
        if (creds.url && creds.key) {
          const cleanUrl = creds.url.replace(/\/+$/, '');
          const postData = this.sanitizeRegistrationPayload(newRecord);
          delete postData.id;
          delete postData._is_offline_pending;
          const resp = await fetch(`${cleanUrl}/rest/v1/registrations`, {
            method: 'POST',
            headers: {
              'apikey': creds.key,
              'Authorization': `Bearer ${creds.key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(postData)
          });
          if (resp.ok) {
            const resJson = await resp.json();
            if (resJson && resJson[0]) {
              newRecord.id = resJson[0].id;
              newRecord._is_offline_pending = false;
              this.isSupabaseConnected = true;
            }
          }
        }
      } catch (rErr) {
        console.warn('Direct REST insert error:', rErr);
      }
    }

    // Simpan ke LocalStorage sebagai backup instan
    const current = await this.getLocalRegistrations();
    if (!newRecord.id) {
      newRecord.id = Date.now();
    }
    current.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(current));
    return newRecord;
  }

  /**
   * Menyimpan banyak peserta sekaligus (Kelompok/Rombongan) ke Supabase
   */
  async addBatchRegistrations(recordsList) {
    await this.waitForSupabase(6000);
    if (Array.isArray(recordsList)) {
      recordsList.forEach(r => {
        if (r && r.registration_code) {
          this.removeDeletedCode(r.registration_code);
        }
      });
    }
    const now = new Date().toISOString();
    const stampedList = recordsList.map((item, idx) => ({
      ...item,
      created_at: now,
      updated_at: now
    }));

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        for (const item of stampedList) {
          item.photo_url = await this.uploadPhotoIfNeeded(item.photo_url, item.registration_code);
        }
        const cleanList = stampedList.map(item => {
          const clean = this.sanitizeRegistrationPayload(item);
          delete clean.id;
          return clean;
        });
        const { data, error } = await this.supabaseClient
          .from('registrations')
          .insert(cleanList)
          .select();

        if (error) {
          if (error.message && (error.message.includes('photo_url') || error.code === '42703' || error.code === 'PGRST204')) {
            console.warn('Kolom photo_url belum ada di remote Supabase. Menyimpan batch tanpa photo_url...');
            const fallbackList = cleanList.map(item => {
              const fb = { ...item };
              delete fb.photo_url;
              return fb;
            });
            const { data: fbData, error: fbErr } = await this.supabaseClient
              .from('registrations')
              .insert(fallbackList)
              .select();
            if (!fbErr && fbData && Array.isArray(fbData)) {
              fbData.forEach((row, idx) => {
                if (stampedList[idx]) stampedList[idx].id = row.id;
              });
            } else {
              throw fbErr || error;
            }
          } else {
            console.warn('Supabase batch insert error:', error);
            throw error;
          }
        }

        if (data && Array.isArray(data)) {
          data.forEach((row, idx) => {
            if (stampedList[idx]) {
              stampedList[idx].id = row.id;
              stampedList[idx]._is_offline_pending = false;
            }
          });
        }
      } catch (err) {
        console.warn('Gagal batch insert ke Supabase via SDK, mencoba REST fallback:', err);
        stampedList.forEach(item => { item._is_offline_pending = true; });
      }
    } else {
      stampedList.forEach(item => { item._is_offline_pending = true; });
    }

    if (stampedList.some(item => !item.id || item._is_offline_pending)) {
      try {
        const creds = this.getCredentials();
        if (creds.url && creds.key) {
          const cleanUrl = creds.url.replace(/\/+$/, '');
          const cleanList = stampedList.map(item => {
            const c = this.sanitizeRegistrationPayload(item);
            delete c.id;
            delete c._is_offline_pending;
            return c;
          });
          const resp = await fetch(`${cleanUrl}/rest/v1/registrations`, {
            method: 'POST',
            headers: {
              'apikey': creds.key,
              'Authorization': `Bearer ${creds.key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(cleanList)
          });
          if (resp.ok) {
            const resJson = await resp.json();
            if (Array.isArray(resJson)) {
              resJson.forEach((row, idx) => {
                if (stampedList[idx]) {
                  stampedList[idx].id = row.id;
                  stampedList[idx]._is_offline_pending = false;
                }
              });
              this.isSupabaseConnected = true;
            }
          }
        }
      } catch (bErr) {
        console.warn('Direct REST batch insert error:', bErr);
      }
    }

    const current = await this.getLocalRegistrations();
    stampedList.forEach((item, index) => {
      if (!item.id) item.id = Date.now() + index;
    });
    const updated = [...stampedList, ...current];
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    return stampedList;
  }

  /**
   * Mengupdate data pendaftaran peserta (misal: setting kamar/gedung)
   */
  async updateRegistration(id, updates) {
    this.ensureSupabaseClient();
    const now = new Date().toISOString();
    const cleanUpdates = this.sanitizeRegistrationPayload({ ...updates, updated_at: now });

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        await this.supabaseClient
          .from('registrations')
          .update(cleanUpdates)
          .eq('id', id);
      } catch (err) {
        console.warn('Gagal update di Supabase, update lokal:', err);
      }
    }

    const current = await this.getLocalRegistrations();
    const updated = current.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, ...updates, updated_at: now };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    return updated.find(item => String(item.id) === String(id));
  }

  /**
   * Menghapus pendaftaran secara tuntas berdasarkan ID & Kode Tiket di Supabase & LocalStorage
   */
  async deleteRegistration(id, registrationCode = null) {
    await this.waitForSupabase(6000);
    let codeToDelete = registrationCode;
    let idToDelete = id;

    // Cari dari data lokal jika salah satu belum diketahui
    const current = this.getLocalRegistrations();
    const target = current.find(item =>
      (idToDelete && String(item.id) === String(idToDelete)) ||
      (codeToDelete && item.registration_code === codeToDelete)
    );

    if (target) {
      if (!codeToDelete) codeToDelete = target.registration_code;
      if (!idToDelete) idToDelete = target.id;
    }

    // Catat ke daftar tombstone deleted codes agar tidak pernah dibangkitkan lagi
    if (codeToDelete) {
      this.recordDeletedCode(codeToDelete);
    }

    // 1. Coba hapus di Cloud Supabase via SDK Client
    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        if (codeToDelete) {
          const { error: errCode } = await this.supabaseClient
            .from('registrations')
            .delete()
            .eq('registration_code', codeToDelete);
          if (errCode) console.warn('Supabase delete by code error:', errCode);
        }
        if (idToDelete && /^\d+$/.test(String(idToDelete))) {
          const { error: errId } = await this.supabaseClient
            .from('registrations')
            .delete()
            .eq('id', parseInt(idToDelete, 10));
          if (errId) console.warn('Supabase delete by id error:', errId);
        }
      } catch (err) {
        console.warn('Gagal delete di Supabase via SDK:', err);
      }
    }

    // 2. RESILIENT FALLBACK: Pastikan data terhapus permanen via Direct REST API ke Supabase
    try {
      const creds = this.getCredentials();
      if (creds.url && creds.key) {
        const cleanUrl = creds.url.replace(/\/+$/, '');
        if (codeToDelete) {
          await fetch(`${cleanUrl}/rest/v1/registrations?registration_code=eq.${encodeURIComponent(codeToDelete)}`, {
            method: 'DELETE',
            headers: {
              'apikey': creds.key,
              'Authorization': `Bearer ${creds.key}`
            }
          });
        }
        if (idToDelete && /^\d+$/.test(String(idToDelete))) {
          await fetch(`${cleanUrl}/rest/v1/registrations?id=eq.${parseInt(idToDelete, 10)}`, {
            method: 'DELETE',
            headers: {
              'apikey': creds.key,
              'Authorization': `Bearer ${creds.key}`
            }
          });
        }
      }
    } catch (restErr) {
      console.warn('Direct REST delete fallback error:', restErr);
    }

    const filtered = current.filter(item => {
      if (codeToDelete && item.registration_code === codeToDelete) return false;
      if (idToDelete && String(item.id) === String(idToDelete)) return false;
      return true;
    });
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filtered));
    return true;
  }

  /**
   * Mengambil data lokal murni
   */
  getLocalRegistrations() {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  /**
   * Sinkronisasi data lokal ke Supabase (Aman, tidak mere-insert data yang dihapus)
   */
  async syncLocalToSupabase() {
    this.ensureSupabaseClient();
    if (!this.isSupabaseConnected || !this.supabaseClient) {
      throw new Error('Supabase belum terkoneksi. Masukkan URL dan API Key terlebih dahulu.');
    }

    const localData = this.getLocalRegistrations();
    const deletedCodes = new Set(this.getDeletedCodes());

    // Filter hanya data yang sah, belum pernah dihapus, dan memang belum tersimpan ke cloud (offline pending).
    // Data lama hasil cache dari cloud tidak dikirim ulang agar data yang sudah dihapus tidak muncul kembali.
    const validData = localData.filter(item =>
      item &&
      item.registration_code &&
      item._is_offline_pending === true &&
      !deletedCodes.has(item.registration_code)
    );

    if (!validData.length) {
      return { count: 0, message: 'Tidak ada data lokal tertunda untuk disinkronkan.' };
    }

    // Ambil data tanpa ID auto-increment lokal agar tidak konflik primary key
    const cleanedData = validData.map(item => {
      const { id, _is_offline_pending, ...rest } = item;
      return this.sanitizeRegistrationPayload(rest);
    });

    const { data, error } = await this.supabaseClient
      .from('registrations')
      .upsert(cleanedData, { onConflict: 'registration_code' })
      .select();

    if (error) throw error;

    // Tandai data lokal sudah tersinkron agar tidak dikirim berulang
    const savedMap = new Map((data || []).map(s => [s.registration_code, s]));
    const updatedLocal = localData.map(item =>
      item && savedMap.has(item.registration_code)
        ? { ...item, id: savedMap.get(item.registration_code).id, _is_offline_pending: false }
        : item
    );
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updatedLocal));

    return { count: cleanedData.length, message: `Berhasil sinkronisasi ${cleanedData.length} data ke Supabase!` };
  }

  /**
   * Pengaturan Aplikasi (Settings & Deadline)
   */
  getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const res = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
      if (!res.ticket_template_image ||
        typeof res.ticket_template_image !== 'string' ||
        res.ticket_template_image.includes('[object') ||
        res.ticket_template_image.includes('boarding-pass-template.png') ||
        res.ticket_template_image.trim() === '') {
        res.ticket_template_image = 'images/boarding-pass-canva.png';
      }
      if (!res.google_email_script_url || typeof res.google_email_script_url !== 'string' || res.google_email_script_url.trim() === '') {
        res.google_email_script_url = DEFAULT_SETTINGS.google_email_script_url;
      }
      return res;
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  async saveSettings(newSettings) {
    this.ensureSupabaseClient();
    const current = this.getSettings();
    if (newSettings && newSettings.ticket_template_image) {
      if (typeof newSettings.ticket_template_image !== 'string' ||
        newSettings.ticket_template_image.includes('[object') ||
        newSettings.ticket_template_image.trim() === '') {
        newSettings.ticket_template_image = 'images/boarding-pass-canva.png';
      }
    }
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));

    // Bila terhubung ke Supabase, HANYA upsert keys yang benar-benar diubah (newSettings)
    // agar TIDAK menimpa pengaturan lain dengan cache lama yang tertumpuk
    if (this.isSupabaseConnected && this.supabaseClient && newSettings && typeof newSettings === 'object') {
      try {
        const rows = Object.entries(newSettings)
          .filter(([_, val]) => val !== undefined)
          .map(([key, val]) => ({
            setting_key: key,
            setting_value: typeof val === 'object' ? JSON.stringify(val) : String(val),
            updated_at: new Date().toISOString()
          }));
        if (rows.length > 0) {
          const { error } = await this.supabaseClient.from('app_settings').upsert(rows, { onConflict: 'setting_key' });
          if (error) {
            console.warn('Gagal upsert app_settings ke Supabase:', error);
            this.showCloudSaveWarning();
          }
        }
      } catch (e) {
        console.warn('Gagal update settings di Supabase:', e);
        this.showCloudSaveWarning();
      }
    }

    return updated;
  }

  /**
   * Menyimpan data objek/array/string langsung ke Supabase app_settings & localStorage
   */
  async saveCloudSetting(key, value) {
    this.ensureSupabaseClient();
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      localStorage.setItem(key, stringVal);
    } catch (e) { }

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const { error } = await this.supabaseClient.from('app_settings').upsert([
          {
            setting_key: key,
            setting_value: stringVal,
            updated_at: new Date().toISOString()
          }
        ], { onConflict: 'setting_key' });
        if (error) {
          console.warn(`Supabase upsert ${key} error:`, error);
          throw error;
        }
        return true;
      } catch (err) {
        console.warn(`Gagal simpan ${key} ke Supabase:`, err);
        this.showCloudSaveWarning();
        throw err;
      }
    }
    return false;
  }

  showCloudSaveWarning() {
    if (typeof document === 'undefined' || document.getElementById('cloudSaveWarning')) return;
    const el = document.createElement('div');
    el.id = 'cloudSaveWarning';
    el.textContent = '⚠️ Perubahan GAGAL tersimpan ke cloud (Supabase) dan hanya ada di perangkat ini. Hubungi admin untuk cek izin database.';
    el.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:99999;background:#b91c1c;color:#fff;padding:12px 18px;border-radius:10px;font:600 14px sans-serif;max-width:90vw;box-shadow:0 4px 16px rgba(0,0,0,.3)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }
}

// Global instance
window.dataService = new PaskasDataService();
