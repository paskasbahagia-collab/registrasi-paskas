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
const DEFAULT_SUPABASE_URL = ''; // Tempelkan Project URL Anda di sini (Cth: https://xxxx.supabase.co)
const DEFAULT_SUPABASE_KEY = ''; // Tempelkan Project API Key (anon public) Anda di sini

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
  event_location: 'Pondok Modern Munzalan / Convention Hall',
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

// Data Dummy Demo Awal (agar langsung terlihat indah saat pertama kali dibuka)
const INITIAL_DEMO_DATA = [
  {
    id: 1,
    registration_code: 'PKB-IND-2026-001',
    registration_type: 'individu',
    group_name: '',
    group_leader_name: '',
    full_name: 'Ustadz Ahmad Fauzi',
    age: 38,
    is_child: false,
    gender: 'Laki-laki',
    wilayah: 'Pontianak',
    arrival_date: '2026-11-19',
    arrival_time: '09:00',
    departure_date: '2026-11-22',
    departure_time: '15:00',
    transport_arrival: 'Pesawat Terbang',
    transport_departure: 'Pesawat Terbang',
    cloth_size: 'XL',
    medical_history: 'Tidak Ada',
    phone_number: '081234567890',
    notes: 'Kafilah Duta Infaq Pontianak',
    room_number: '101',
    room_name: 'Kamar Bilal bin Rabah',
    building: 'Gedung Asrama Utama',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 2,
    registration_code: 'PKB-IND-2026-002',
    registration_type: 'individu',
    group_name: '',
    group_leader_name: '',
    full_name: 'Siti Nurhaliza',
    age: 26,
    is_child: false,
    gender: 'Perempuan',
    wilayah: 'Bandung',
    arrival_date: '2026-11-19',
    arrival_time: '14:00',
    departure_date: '2026-11-22',
    departure_time: '13:00',
    transport_arrival: 'Kereta Api',
    transport_departure: 'Kereta Api',
    cloth_size: 'M',
    medical_history: 'Maag kambuhan (membawa obat antasida sendiri)',
    phone_number: '081398765432',
    notes: 'Mohon info posko akhwat',
    room_number: '201',
    room_name: 'Kamar Sayyidah Khadijah',
    building: 'Gedung Siti Maryam (Akhwat)',
    created_at: new Date(Date.now() - 3600000 * 24 * 1.5).toISOString()
  },
  {
    id: 3,
    registration_code: 'PKB-GRP-2026-001',
    registration_type: 'kelompok',
    group_name: 'Rombongan Paskas Wilayah Sambas',
    group_leader_name: 'H. Syamsul Bahri',
    full_name: 'H. Syamsul Bahri',
    age: 45,
    is_child: false,
    gender: 'Laki-laki',
    wilayah: 'Sambas',
    arrival_date: '2026-11-19',
    arrival_time: '11:00',
    departure_date: '2026-11-22',
    departure_time: '16:00',
    transport_arrival: 'Bus Panitia',
    transport_departure: 'Bus Panitia',
    cloth_size: 'XXL',
    medical_history: 'Tidak Ada',
    phone_number: '085245678901',
    notes: 'Ketua rombongan 1 bus dari Sambas',
    room_number: '102',
    room_name: 'Kamar Ali bin Abi Thalib',
    building: 'Gedung Asrama Utama',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 4,
    registration_code: 'PKB-GRP-2026-002',
    registration_type: 'kelompok',
    group_name: 'Rombongan Paskas Wilayah Sambas',
    group_leader_name: 'H. Syamsul Bahri',
    full_name: 'Muhammad Ilham',
    age: 12,
    is_child: true,
    gender: 'Laki-laki',
    wilayah: 'Sambas',
    arrival_date: '2026-11-19',
    arrival_time: '11:00',
    departure_date: '2026-11-22',
    departure_time: '16:00',
    transport_arrival: 'Bus Panitia',
    transport_departure: 'Bus Panitia',
    cloth_size: 'L',
    medical_history: 'Riwayat asma jika kena hawa dingin malam',
    phone_number: '085345678902',
    notes: 'Anggota rombongan Sambas (Ikut Orang Tua)',
    guardian_name: 'H. Syamsul Bahri',
    room_number: '102',
    room_name: 'Kamar Ali bin Abi Thalib',
    building: 'Gedung Asrama Utama',
    created_at: new Date(Date.now() - 3600000 * 17).toISOString()
  },
  {
    id: 5,
    registration_code: 'PKB-IND-2026-003',
    registration_type: 'individu',
    group_name: '',
    group_leader_name: '',
    full_name: 'dr. Fatimah Azzahra',
    age: 32,
    is_child: false,
    gender: 'Perempuan',
    wilayah: 'Jakarta Selatan',
    arrival_date: '2026-11-19',
    arrival_time: '10:30',
    departure_date: '2026-11-22',
    departure_time: '17:00',
    transport_arrival: 'Pesawat Terbang',
    transport_departure: 'Pesawat Terbang',
    cloth_size: 'S',
    medical_history: 'Tidak Ada',
    phone_number: '081122334455',
    notes: 'Siap bergabung piket di posko kesehatan panitia',
    room_number: '',
    room_name: '',
    building: '',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

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

    // Inisialisasi data lokal jika masih kosong
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_DEMO_DATA));
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
      if (!res.ticket_template_image || res.ticket_template_image.includes('boarding-pass-template.png')) {
        res.ticket_template_image = 'images/boarding-pass-canva.png';
      }
      return res;
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings(newSettings) {
    const current = this.getSettings();
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
