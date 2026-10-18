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
const DEFAULT_SUPABASE_KEY = ''; // Tempelkan Project API Key (anon/publishable) di sini

const STORAGE_KEYS = {
  SUPABASE_URL: 'paskas_supabase_url',
  SUPABASE_KEY: 'paskas_supabase_key',
  REGISTRATIONS: 'paskas_registrations_data',
  SETTINGS: 'paskas_app_settings'
};

// Default Settings Awal
const DEFAULT_SETTINGS = {
  registration_deadline: '2026-12-31T23:59:59',
  is_registration_open: 'true',
  closed_message: 'Mohon maaf, pendaftaran peserta Paskas Bahagia telah ditutup. Silakan hubungi narahubung panitia.',
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
        if (Array.isArray(parsed) && parsed.some(p => p.registration_code === 'PKB-IND-2026-001' || p.full_name === 'Ustadz Ahmad Fauzi')) {
          localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
        }
      } catch (e) {}
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  /**
   * Mengambil kredensial yang tersimpan
   */
  getCredentials() {
    return {
      url: localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || DEFAULT_SUPABASE_URL || '',
      key: localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || DEFAULT_SUPABASE_KEY || ''
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
   * Mengambil semua pendaftaran peserta
   */
  async getRegistrations() {
    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          // Sync backup ke lokal
          localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('Gagal query Supabase, membaca dari LocalStorage:', e);
      }
    }

    // Fallback: LocalStorage
    try {
      const local = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  /**
   * Menyimpan satu peserta baru (Individu)
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
        let insertData = { ...newRecord };
        let { data, error } = await this.supabaseClient
          .from('registrations')
          .insert([insertData])
          .select();

        if (error && (String(error.message).includes('daerah') || error.code === 'PGRST204' || error.code === '42703')) {
          const fallback = { ...insertData };
          delete fallback.daerah;
          const retryRes = await this.supabaseClient
            .from('registrations')
            .insert([fallback])
            .select();
          if (retryRes.error) throw retryRes.error;
          data = retryRes.data;
        } else if (error) {
          throw error;
        }

        if (data && data[0]) {
          newRecord.id = data[0].id;
        }
      } catch (err) {
        console.warn('Gagal simpan ke Supabase, simpan lokal:', err);
      }
    }

    // Simpan ke LocalStorage juga
    const current = await this.getLocalRegistrations();
    if (!newRecord.id) {
      newRecord.id = Date.now();
    }
    current.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(current));
    return newRecord;
  }

  /**
   * Menyimpan banyak peserta sekaligus (Kelompok/Rombongan)
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
        const { data, error } = await this.supabaseClient
          .from('registrations')
          .insert(stampedList)
          .select();

        if (error) throw error;
      } catch (err) {
        console.warn('Gagal batch insert ke Supabase, simpan lokal:', err);
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
    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updated_at: now };

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
        return { ...item, ...cleanUpdates };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
    return updated.find(item => String(item.id) === String(id));
  }

  /**
   * Menghapus pendaftaran berdasarkan ID
   */
  async deleteRegistration(id) {
    if (this.isSupabaseConnected && this.supabaseClient) {
      try {
        await this.supabaseClient.from('registrations').delete().eq('id', id);
      } catch (err) {
        console.warn('Gagal delete di Supabase:', err);
      }
    }

    const current = await this.getLocalRegistrations();
    const filtered = current.filter(item => String(item.id) !== String(id));
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
   * Sinkronisasi data lokal ke Supabase
   */
  async syncLocalToSupabase() {
    if (!this.isSupabaseConnected || !this.supabaseClient) {
      throw new Error('Supabase belum terkoneksi. Masukkan URL dan API Key terlebih dahulu.');
    }

    const localData = this.getLocalRegistrations();
    if (!localData.length) {
      return { count: 0, message: 'Tidak ada data lokal untuk disinkronkan.' };
    }

    // Ambil data tanpa ID auto-increment lokal agar tidak konflik primary key
    const cleanedData = localData.map(item => {
      const { id, ...rest } = item;
      return rest;
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

  saveSettings(newSettings) {
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
          setting_value: String(val),
          updated_at: new Date().toISOString()
        }));
        this.supabaseClient.from('app_settings').upsert(rows, { onConflict: 'setting_key' }).then();
      } catch (e) {
        console.warn('Gagal update settings di Supabase:', e);
      }
    }

    return updated;
  }
}

// Global instance
window.dataService = new PaskasDataService();
