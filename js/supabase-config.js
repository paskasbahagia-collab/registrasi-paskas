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
  closed_message: 'Mohon maaf, pendaftaran peserta Paskas Bahagia telah ditutup. Silakan hubungi narahubung panitia.',
  event_headline: 'PASKAS BAHAGIA',
  event_name: 'Silaturahmi Akbar Pasukan Amal Sholeh (PASKAS) Bahagia',
  event_location: 'Rocket Convention Hall, Sleman, D.I. Yogyakarta',
  event_desc: 'Selamat datang di portal resmi registrasi peserta Silaturahmi Akbar Paskas Bahagia. Mari eratkan ukhuwah, satukan langkah perjuangan, dan hadirkan senyum bahagia untuk sesama.',
  ticket_template_image: 'images/boarding-pass-canva.png',
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
Panitia Pelaksana Silaturahmi Akbar Paskas Bahagia`
};

// Data Awal Murni (Kosong / 0 Peserta sampai ada pendaftaran baru)
const INITIAL_DEMO_DATA = [];

class PaskasDataService {
  constructor() {
    this.supabaseClient = null;
    this.isSupabaseConnected = false;
    this.init();
  }

  init() {
    const savedUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || DEFAULT_SUPABASE_URL;
    const savedKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || DEFAULT_SUPABASE_KEY;

    if (savedUrl && savedKey && window.supabase) {
      try {
        this.supabaseClient = window.supabase.createClient(savedUrl, savedKey);
        this.isSupabaseConnected = true;
      } catch (e) {
        console.warn('Gagal menginisialisasi Supabase client:', e);
        this.isSupabaseConnected = false;
      }
    }

    // Inisialisasi data lokal jika masih kosong atau bersihkan data dummy demo lama
    const existing = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
    } else {
      try {
        const parsed = JSON.parse(existing);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => p && p.registration_code !== 'PKB-IND-2026-001' && p.full_name !== 'Ustadz Ahmad Fauzi');
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(cleaned));
          }
        }
      } catch (e) {}
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  /**
   * Status koneksi aktif Supabase
   */
  isSupabaseConfigured() {
    return Boolean(this.isSupabaseConnected && this.supabaseClient);
  }

  /**
   * Sinkronisasi pengaturan cloud Supabase ke localStorage
   */
  async syncSettingsFromSupabase() {
    if (!this.isSupabaseConnected || !this.supabaseClient) return null;
    try {
      const { data, error } = await this.supabaseClient.from('app_settings').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const cloudSettings = {};
        data.forEach(row => {
          if (!row.setting_key) return;
          cloudSettings[row.setting_key] = row.setting_value;

          // Sinkronisasi data struktur khusus ke LocalStorage jika tersimpan di Supabase
          if (row.setting_key === 'paskas_rooms_data' || row.setting_key === 'master_rooms') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_rooms_data', row.setting_value);
            } catch (e) {}
          } else if (row.setting_key === 'paskas_groups_data' || row.setting_key === 'master_groups') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_groups_data', row.setting_value);
            } catch (e) {}
          } else if (row.setting_key === 'paskas_master_wilayah' || row.setting_key === 'master_wilayah') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_master_wilayah', row.setting_value);
            } catch (e) {}
          } else if (row.setting_key === 'paskas_custom_cards' || row.setting_key === 'dashboard_cards') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_custom_cards', row.setting_value);
            } catch (e) {}
          } else if (row.setting_key === 'paskas_reg_content' || row.setting_key === 'reg_content') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_reg_content', row.setting_value);
            } catch (e) {}
          } else if (row.setting_key === 'paskas_admin_password') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_admin_password', row.setting_value);
            } catch (e) {}
          } else if (row.setting_key === 'is_room_group_enabled' || row.setting_key === 'paskas_room_group_enabled') {
            try {
              if (row.setting_value) localStorage.setItem('paskas_room_group_enabled', row.setting_value);
            } catch (e) {}
          }
        });
        const merged = { ...this.getSettings(), ...cloudSettings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn('Gagal membaca app_settings dari Supabase:', e);
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
      'group_code'
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
    return clean;
  }

  getDeletedCodes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DELETED_CODES);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  recordDeletedCode(code) {
    if (!code) return;
    try {
      const list = this.getDeletedCodes();
      if (!list.includes(code)) {
        list.push(code);
        if (list.length > 500) list.shift();
        localStorage.setItem(STORAGE_KEYS.DELETED_CODES, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Gagal record deleted code:', e);
    }
  }

  /**
   * Mengambil semua pendaftaran peserta (Sinkron Cloud Supabase & Local)
   */
  async getRegistrations() {
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
        }
      } catch (e) {
        console.warn('Gagal query Supabase, membaca dari LocalStorage:', e);
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
      // 1. Bersihkan jika masih ada row di Supabase yang sudah tercatat dihapus
      if (deletedCodes.size > 0) {
        const toClean = cloudList.filter(r => deletedCodes.has(r.registration_code));
        if (toClean.length > 0) {
          for (const item of toClean) {
            try {
              await this.supabaseClient
                .from('registrations')
                .delete()
                .eq('registration_code', item.registration_code);
            } catch (delErr) {
              console.warn('Gagal purge deleted code di Supabase:', delErr);
            }
          }
          cloudList = cloudList.filter(r => !deletedCodes.has(r.registration_code));
        }
      }

      // 2. Hanya upload peserta yang benar-benar didaftarkan saat offline (_is_offline_pending === true)
      // JANGAN PERNAH re-upload data lokal biasa karena data yang hilang di cloud adalah data yang TELAH DIHAPUS!
      const pendingOffline = local.filter(r => 
        r && 
        r.registration_code && 
        r._is_offline_pending === true && 
        !deletedCodes.has(r.registration_code)
      );

      if (pendingOffline.length > 0) {
        try {
          const cleanUnsynced = pendingOffline.map(r => {
            const clean = this.sanitizeRegistrationPayload(r);
            delete clean._is_offline_pending;
            return clean;
          });
          const { data: savedRows, error: upErr } = await this.supabaseClient
            .from('registrations')
            .insert(cleanUnsynced)
            .select();
          if (!upErr && savedRows && savedRows.length > 0) {
            cloudList = [...savedRows, ...cloudList];
          }
        } catch (syncErr) {
          console.warn('Gagal sync data offline pending ke Supabase:', syncErr);
        }
      }

      // Supabase adalah SUMBER KEBENARAN UTAMA (Single Source of Truth).
      // Update LocalStorage agar persis sama dengan Supabase.
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
    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      created_at: record.created_at || now,
      updated_at: now
    };

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const insertData = this.sanitizeRegistrationPayload(newRecord);
        const { data, error } = await this.supabaseClient
          .from('registrations')
          .insert([insertData])
          .select();

        if (error) {
          console.warn('Supabase insert registration error:', error);
          throw error;
        }

        if (data && data[0]) {
          newRecord.id = data[0].id;
          newRecord._is_offline_pending = false;
        }
      } catch (err) {
        console.warn('Gagal simpan ke Supabase, simpan lokal sebagai cadangan:', err);
        newRecord._is_offline_pending = true;
      }
    } else {
      newRecord._is_offline_pending = true;
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
    const now = new Date().toISOString();
    const stampedList = recordsList.map((item, idx) => ({
      ...item,
      created_at: now,
      updated_at: now
    }));

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const cleanList = stampedList.map(item => this.sanitizeRegistrationPayload(item));
        const { data, error } = await this.supabaseClient
          .from('registrations')
          .insert(cleanList)
          .select();

        if (error) {
          console.warn('Supabase batch insert error:', error);
          throw error;
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
        console.warn('Gagal batch insert ke Supabase, simpan lokal sebagai cadangan:', err);
        stampedList.forEach(item => { item._is_offline_pending = true; });
      }
    } else {
      stampedList.forEach(item => { item._is_offline_pending = true; });
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

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        if (codeToDelete) {
          const { error: errCode } = await this.supabaseClient
            .from('registrations')
            .delete()
            .eq('registration_code', codeToDelete);
          if (errCode) console.warn('Supabase delete by code error:', errCode);
        }
        if (idToDelete) {
          const { error: errId } = await this.supabaseClient
            .from('registrations')
            .delete()
            .eq('id', idToDelete);
          if (errId) console.warn('Supabase delete by id error:', errId);
        }
      } catch (err) {
        console.warn('Gagal delete di Supabase:', err);
      }
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
    if (!this.isSupabaseConnected || !this.supabaseClient) {
      throw new Error('Supabase belum terkoneksi. Masukkan URL dan API Key terlebih dahulu.');
    }

    const localData = this.getLocalRegistrations();
    const deletedCodes = new Set(this.getDeletedCodes());

    // Filter hanya data yang sah dan belum pernah dihapus
    const validData = localData.filter(item => 
      item && 
      item.registration_code && 
      !deletedCodes.has(item.registration_code)
    );

    if (!validData.length) {
      return { count: 0, message: 'Tidak ada data lokal valid untuk disinkronkan.' };
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
      return res;
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  async saveSettings(newSettings) {
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

    // Bila terhubung ke Supabase, update tabel app_settings jika tersedia
    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const rows = Object.entries(updated).map(([key, val]) => ({
          setting_key: key,
          setting_value: typeof val === 'object' ? JSON.stringify(val) : String(val),
          updated_at: new Date().toISOString()
        }));
        const { error } = await this.supabaseClient.from('app_settings').upsert(rows, { onConflict: 'setting_key' });
        if (error) console.warn('Gagal upsert app_settings ke Supabase:', error);
      } catch (e) {
        console.warn('Gagal update settings di Supabase:', e);
      }
    }

    return updated;
  }

  /**
   * Menyimpan data objek/array/string langsung ke Supabase app_settings & localStorage
   */
  async saveCloudSetting(key, value) {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      localStorage.setItem(key, stringVal);
    } catch (e) {}

    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const { error } = await this.supabaseClient.from('app_settings').upsert([
          {
            setting_key: key,
            setting_value: stringVal,
            updated_at: new Date().toISOString()
          }
        ], { onConflict: 'setting_key' });
        if (error) console.warn(`Supabase upsert ${key} error:`, error);
      } catch (err) {
        console.warn(`Gagal simpan ${key} ke Supabase:`, err);
      }
    }
  }
}

// Global instance
window.dataService = new PaskasDataService();
