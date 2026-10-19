/**
 * ===================================================================
 * PASKAS BAHAGIA - MAIN APPLICATION LOGIC
 * ===================================================================
 */

// Smart Image URL Sanitizer & High-Definition Image Converter
function parseDirectImageUrl(rawUrl, isThumb = false) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return isThumb ? 'images/rocket-convention-hall-card.jpg' : 'images/rocket-convention-hall-hero.jpg';
  }
  let url = rawUrl.trim();

  // 1. Data URLs (dari file picker upload), blob, atau path relatif lokal
  if (url.startsWith('data:image/') || url.startsWith('blob:') || url.startsWith('images/')) {
    return url;
  }

  // 2. Deteksi link Google Maps atau Rocket Convention Hall
  if (url.includes('google.com/maps') || url.includes('maps.google') || url.includes('goo.gl') || url.toLowerCase().includes('rocket')) {
    // Jika mengarah ke Rocket Convention Hall, gunakan aset foto arsitektur 4K UHD ultra-jernih lokal
    if (url.toLowerCase().includes('rocket') || url.toLowerCase().includes('convention')) {
      return isThumb ? 'images/rocket-convention-hall-card.jpg' : 'images/rocket-convention-hall-hero.jpg';
    }

    // Jika tempat lain, ekstrak dan naikkan resolusi Google CDN dari thumbnail kecil ke resolusi asli ultra HD (=s0 / =w2400)
    const cdnMatch = url.match(/!6s(https?[^!&]+)/i);
    if (cdnMatch && cdnMatch[1]) {
      try {
        let extracted = decodeURIComponent(cdnMatch[1]);
        if (extracted.includes('googleusercontent.com')) {
          if (extracted.includes('=')) {
            extracted = extracted.replace(/=w\d+[^/]*$/i, '=w2400-h1600-k-no').replace(/=s\d+[^/]*$/i, '=s0');
          } else {
            extracted += '=w2400-h1600-k-no';
          }
          return extracted;
        }
      } catch (err) {
        console.warn('Gagal decode URL Google CDN:', err);
      }
    }
    return isThumb ? 'images/rocket-convention-hall-card.jpg' : 'images/rocket-convention-hall-hero.jpg';
  }

  // 3. Jika pengguna memasukkan link Google UserContent CDN langsung, hilangkan kompresi resolusi kecil
  if (url.includes('googleusercontent.com')) {
    return url.replace(/=w\d+[^/]*$/i, '=w2400-h1600-k-no').replace(/=s\d+[^/]*$/i, '=s0');
  }

  // 4. Deteksi jika link dari Google Image Search
  if (url.includes('google.com/imgres')) {
    const imgParam = url.match(/[?&]imgurl=([^&]+)/i);
    if (imgParam && imgParam[1]) {
      try {
        return decodeURIComponent(imgParam[1]);
      } catch (e) {}
    }
  }

  return url;
}

// 1. DATA KARTU CAROUSEL DASHBOARD
// Terinspirasi dari gambar referensi pengguna (Beach, Nature, Hotel -> diadaptasi ke info Paskas Bahagia)
const DEFAULT_DASHBOARD_CARDS = [
  {
    id: 'card-1',
    category: 'AGENDA & RUNDOWN',
    title: 'Jadwal Acara',
    subtitle: 'Rangkaian 3 hari 2 malam silaturahmi penuh berkah',
    badge: '01 / 06',
    coverImg: 'images/tugu-jogja-hero.jpg',
    thumbImg: 'images/tugu-jogja-card.jpg',
    narration: `Pertemuan akbar ini dirancang khusus untuk mempererat tali persaudaraan antar relawan Paskas dari seluruh penjuru nusantara.

Rangkaian Agenda Utama:
• Hari Pertama (Jumat): Registrasi & Welcoming Banquet, pembagian kamar/asrama, dan malam ta'aruf akbar.
• Hari Kedua (Sabtu): Grand Silaturahmi & Halaqah Bahagia, kajian akbar, pemaparan gerakan infaq beras, dan sharing kebahagiaan antar wilayah.
• Hari Ketiga (Ahad): Subuh Akbar, Munajat & Pelepasan kafilah rombongan kembali ke wilayah masing-masing.
• Waktu Pelaksanaan: 08:00 - 22:00 WIB (menyesuaikan jadwal shalat berjamaah).`,
    content: `
      <div class="modal-rich-section">
        <h4><i class="fa-solid fa-clock-rotate-left"></i> Rangkaian Acara Silaturahmi Akbar</h4>
        <p>Pertemuan akbar ini dirancang khusus untuk mempererat tali persaudaraan antar relawan Paskas dari seluruh penjuru nusantara. Berikut ringkasan agenda utama:</p>
      </div>

      <div class="modal-highlights-grid">
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Hari Pertama (Jumat)</div>
          <div class="highlight-box-val">Registrasi & Welcoming Banquet</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Penyambutan kafilah, pembagian kamar/asrama, dan malam ta'aruf akbar.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Hari Kedua (Sabtu)</div>
          <div class="highlight-box-val">Grand Silaturahmi & Halaqah Bahagia</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Kajian akbar, pemaparan gerakan infaq beras, dan sharing kebahagiaan antar wilayah.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Hari Ketiga (Ahad)</div>
          <div class="highlight-box-val">Subuh Akbar, Munajat & Pelepasan</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Muhasabah, doa penutup, ramah tamah serta kepulangan rombongan.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Waktu Standar</div>
          <div class="highlight-box-val">08:00 - 22:00 WIB</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Jadwal fleksibel disesuaikan dengan waktu shalat berjamaah.</p>
        </div>
      </div>
    `
  },
  {
    id: 'card-2',
    category: 'VENUE & FASILITAS',
    title: 'Lokasi & Venue',
    subtitle: 'Gedung utama, asrama penginapan ber-AC & konsumsi',
    badge: '02 / 06',
    coverImg: 'images/rocket-convention-hall.jpg',
    thumbImg: 'images/rocket-convention-hall-card.jpg',
    narration: `Panitia telah menyiapkan fasilitas terbaik agar seluruh peserta dan keluarga merasa nyaman dan fokus menikmati rangkaian kegiatan.

Fasilitas Unggulan:
• Penginapan: Asrama & Guest House ber-AC terpisah rapi antara kafilah ikhwan dan akhwat lengkap dengan kasur & selimut.
• Konsumsi: Makan prasmanan 3x sehari dengan menu bergizi halal, kopi/teh hangat & snack tersedia sepanjang hari di lounge.
• Sanitasi & Wudhu: 100+ titik kran air bersih dan kamar mandi bersih terjaga berkala oleh relawan.
• Konektivitas: Free Wi-Fi & Charging Station di setiap sudut aula dan lorong asrama.`,
    content: `
      <div class="modal-rich-section">
        <h4><i class="fa-solid fa-hotel"></i> Akomodasi & Kenyamanan Peserta</h4>
        <p>Panitia telah menyiapkan fasilitas terbaik agar seluruh peserta dan keluarga merasa nyaman dan fokus menikmati rangkaian kegiatan.</p>
      </div>

      <div class="modal-highlights-grid">
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Penginapan</div>
          <div class="highlight-box-val">Asrama & Guest House Ber-AC</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Terpisah rapi antara kafilah Ikhwan dan Akhwat lengkap dengan kasur & selimut.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Konsumsi</div>
          <div class="highlight-box-val">Makan Prasmanan 3x Sehari</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Menu bergizi halal, kopi/teh hangat & snack tersedia sepanjang hari di lounge.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Sanitasi & Wudhu</div>
          <div class="highlight-box-val">100+ Titik Kran Air Bersih</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Kamar mandi luas, bersih, dan dijaga kebersihannya oleh tim relawan berkala.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Konektivitas</div>
          <div class="highlight-box-val">Free Wi-Fi & Charging Station</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Stop kontak tersedia di setiap sudut ruang aula dan lorong asrama.</p>
        </div>
      </div>
    `
  },
  {
    id: 'card-3',
    category: 'LOGISTIK & RUTE',
    title: 'Transportasi',
    subtitle: 'Armada bus, penjemputan bandara & stasiun',
    badge: '03 / 06',
    coverImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    thumbImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
    narration: `Panitia menyediakan layanan koordinasi penjemputan gratis bagi kafilah dari luar kota dan armada bus terkoordinasi.

Panduan Perjalanan & Armada:
• Shuttle Bandara / Stasiun: Standby setiap 1 jam (harap konfirmasi jam tiba di formulir registrasi).
• Kendaraan Pribadi: Area parkir luas & aman 24 jam dengan kapasitas 200+ mobil dan 500+ motor dengan pos keamanan.
• Rombongan Bus: Akses khusus drop-off langsung ke gerbang asrama utama.
• Bantuan Rute: Google Maps & posko penunjuk arah dari pintu tol dan bundaran utama kota.`,
    content: `
      <div class="modal-rich-section">
        <h4><i class="fa-solid fa-bus-simple"></i> Panduan Perjalanan & Armada Penjemputan</h4>
        <p>Panitia menyediakan layanan koordinasi penjemputan gratis bagi kafilah dari luar kota dan armada bus terkoordinasi.</p>
      </div>

      <div class="modal-highlights-grid">
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Shuttle Bandara / Stasiun</div>
          <div class="highlight-box-val">Standby Setiap 1 Jam</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Harap konfirmasi jam tiba di formulir registrasi agar tim logistik menjemput tepat waktu.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Kendaraan Pribadi</div>
          <div class="highlight-box-val">Area Parkir Luas & Aman 24 Jam</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Kapasitas lebih dari 200 mobil dan 500 motor dengan penjagaan pos keamanan.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Rombongan Bus</div>
          <div class="highlight-box-val">Akses Khusus Drop Off</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Bus rombongan wilayah langsung diarahkan ke gerbang asrama utama.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Bantuan Rute</div>
          <div class="highlight-box-val">Google Maps & Posko Penunjuk Arah</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Spanduk penunjuk jalan terpasang dari pintu tol dan bundaran utama kota.</p>
        </div>
      </div>
    `
  },
  {
    id: 'card-4',
    category: 'ATRIBUT RESMI',
    title: 'Seragam & Kit',
    subtitle: 'Kaos resmi, rompi Paskas, ID card & merchandise',
    badge: '04 / 06',
    coverImg: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    thumbImg: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
    narration: `Setiap peserta terdaftar berhak mendapatkan starter kit resmi eksklusif Silaturahmi Akbar Paskas Bahagia.

Isi Starter Kit & Atribut:
• Kaos Resmi Paskas: Bahan katun combed 24s premium adem, sablon plastisol awet dengan logo silaturahmi akbar.
• ID Card Peserta: Kartu barcode untuk tanda masuk aula acara, pengambilan konsumsi dan asrama.
• Goodie Bag & Buku Catatan: Tas kanvas dan alat tulis disertai modul materi silaturahmi.
• Pengambilan Kit: Meja registrasi kedatangan cukup dengan menunjukkan kode registrasi atau e-tiket.`,
    content: `
      <div class="modal-rich-section">
        <h4><i class="fa-solid fa-shirt"></i> Perlengkapan & Kit Peserta</h4>
        <p>Setiap peserta terdaftar berhak mendapatkan starter kit resmi eksklusif Silaturahmi Akbar Paskas Bahagia.</p>
      </div>

      <div class="modal-highlights-grid">
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Kaos Resmi Paskas</div>
          <div class="highlight-box-val">Bahan Katun Combed 24s Premium</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Adem, menyerap keringat, sablon plastisol awet dengan logo silaturahmi akbar.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">ID Card Peserta</div>
          <div class="highlight-box-val">Kartu Identitas Barcode & Akses</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Digunakan untuk tanda masuk ruang acara, pengambilan konsumsi dan asrama.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Goodie Bag & Buku Catatan</div>
          <div class="highlight-box-val">Tas Kanvas & Alat Tulis Paskas</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Disertai modul materi silaturahmi dan souvenir kenang-kenangan.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Pengambilan Kit</div>
          <div class="highlight-box-val">Meja Registrasi Kedatangan</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Cukup tunjukkan E-Tiket atau Kode Registrasi saat pertama kali tiba di lokasi.</p>
        </div>
      </div>
    `
  },
  {
    id: 'card-5',
    category: 'SIAGA KESEHATAN',
    title: 'Layanan Medis',
    subtitle: 'Posko kesehatan 24 jam, dokter & ambulans siaga',
    badge: '05 / 06',
    coverImg: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    thumbImg: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
    narration: `Kesehatan peserta adalah prioritas utama panitia. Kami bekerjasama dengan relawan medis dan rumah sakit rujukan terdekat.

Layanan & Siaga Medis:
• Posko Medis 24 Jam: Dokter & perawat siaga (pemeriksaan tensi darah, penanganan pusing, maag, asma, dan luka ringan gratis).
• Unit Ambulans: 2 unit siaga di lokasi untuk evakuasi darurat ke RS rujukan jika diperlukan.
• Riwayat Sakit: Tim medis memantau peserta yang mencantumkan riwayat penyakit kambuhan di formulir.
• Obat-Obatan Pribadi: Peserta dengan resep khusus diimbau membawa persediaan obat rutin pribadi.`,
    content: `
      <div class="modal-rich-section">
        <h4><i class="fa-solid fa-heart-pulse"></i> Keselamatan & Kenyamanan Kesehatan Anda</h4>
        <p>Kesehatan peserta adalah prioritas utama panitia. Kami bekerjasama dengan relawan medis dan rumah sakit rujukan terdekat.</p>
      </div>

      <div class="modal-highlights-grid">
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Posko Medis 24 Jam</div>
          <div class="highlight-box-val">Dokter & Perawat Siaga</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Pemeriksaan tensi darah, penanganan pusing, maag, asma, dan luka ringan tanpa biaya.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Unit Ambulans</div>
          <div class="highlight-box-val">2 Unit Siaga di Lokasi</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Siap siaga untuk evakuasi darurat ke RS rujukan jika diperlukan penanganan lanjutan.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Catatan Riwayat Sakit</div>
          <div class="highlight-box-val">Diinput di Form Registrasi</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Tim medis akan memantau peserta yang mencantumkan riwayat penyakit kambuhan.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Obat-Obatan Pribadi</div>
          <div class="highlight-box-val">Wajib Dibawa Peserta</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Bagi yang memiliki resep obat rutin khusus, disarankan membawa stok secukupnya.</p>
        </div>
      </div>
    `
  },
  {
    id: 'card-6',
    category: 'PUSAT BANTUAN',
    title: 'Kontak Panitia',
    subtitle: 'Narahubung wilayah & call center pelayanan peserta',
    badge: '06 / 06',
    coverImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=85',
    thumbImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    narration: `Jika ada pertanyaan seputar pendaftaran, transportasi, atau kebutuhan khusus, silakan hubungi tim narahubung kami:

Saluran Narahubung Resmi:
• Helpdesk Registrasi: 0812-3456-7890 (WA Call) untuk bantuan kendala pendaftaran online & konfirmasi perubahan data.
• Koordinator Transportasi: 0821-9876-5432 (Kak Ridwan) jadwal armada shuttle jemputan dan parkir bus.
• Koordinator Akomodasi: 0852-1122-3344 (Ust. Syarif) pengaturan kamar asrama, keluarga, lansia, & konsumsi.
• Sekretariat Paskas: pusat@paskasbahagia.id untuk administrasi kelembagaan kafilah wilayah.`,
    content: `
      <div class="modal-rich-section">
        <h4><i class="fa-solid fa-headset"></i> Narahubung & Pusat Informasi Panitia</h4>
        <p>Jika ada pertanyaan seputar pendaftaran, transportasi, atau kebutuhan khusus, silakan hubungi tim kami berikut ini:</p>
      </div>

      <div class="modal-highlights-grid">
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Helpdesk Registrasi</div>
          <div class="highlight-box-val">0812-3456-7890 (WA Call)</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Bantuan kendala pendaftaran online dan konfirmasi perubahan data peserta.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Koordinator Transportasi</div>
          <div class="highlight-box-val">0821-9876-5432 (Kak Ridwan)</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Informasi jadwal shuttle jemputan dan parkir armada rombongan bus.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Koordinator Akomodasi</div>
          <div class="highlight-box-val">0852-1122-3344 (Ust. Syarif)</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Pengaturan kamar asrama, keluarga, lansia, dan konsumsi khusus.</p>
        </div>
        <div class="modal-highlight-box">
          <div class="highlight-box-label">Sekretariat Paskas</div>
          <div class="highlight-box-val">pusat@paskasbahagia.id</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Layanan surat resmi dan administrasi kelembagaan kafilah wilayah.</p>
        </div>
      </div>
    `
  }
];

const CARDS_SCHEMA_VERSION = 'v40_tugu_jogja';

// Inisialisasi kartu dinamis (disimpan di browser agar user bisa tambah/edit langsung)
function loadStoredCards() {
  try {
    const currentVer = localStorage.getItem('paskas_cards_ver');
    if (currentVer !== CARDS_SCHEMA_VERSION) {
      // Pembersihan otomatis satu kali untuk kartu lama yang menduplikasi rocket hall di kartu 1
      localStorage.removeItem('paskas_custom_cards');
      localStorage.setItem('paskas_cards_ver', CARDS_SCHEMA_VERSION);
      return JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_CARDS));
    }

    const saved = localStorage.getItem('paskas_custom_cards');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let needsSave = false;
        parsed.forEach((c, idx) => {
          // Jika kartu 1 sempat ter-overwrite otomatis ke rocket hall, pulihkan ke Tugu Jogja
          if (idx === 0 && (typeof c.coverImg === 'string' && (c.coverImg.includes('rocket') || c.coverImg.includes('convention')))) {
            c.coverImg = 'images/tugu-jogja-hero.jpg';
            c.thumbImg = 'images/tugu-jogja-card.jpg';
            needsSave = true;
          }

          c.coverImg = parseDirectImageUrl(c.coverImg, false);
          c.thumbImg = parseDirectImageUrl(c.thumbImg || c.coverImg, true);
          if (!c.narration && DEFAULT_DASHBOARD_CARDS[idx]) {
            c.narration = DEFAULT_DASHBOARD_CARDS[idx].narration || c.subtitle || '';
          }
        });
        if (needsSave) {
          try {
            localStorage.setItem('paskas_custom_cards', JSON.stringify(parsed));
          } catch(e) {}
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gagal memuat kartu custom:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_CARDS));
}

let DASHBOARD_CARDS = loadStoredCards();

// ===================================================================
// PENGELOLA FOTO POLAROID GANTUNG, LOKASI & NARASI REGISTRASI
// ===================================================================
const DEFAULT_REGISTRATION_CONTENT = {
  location: 'Rocket Convention Hall, Sleman, D.I. Yogyakarta',
  kicker: 'KAFILAH & SAHABAT PASKAS',
  title: 'Silaturahmi Penuh Berkah di Alam Terbuka',
  narration: 'Silaturahmi Akbar Paskas Bahagia adalah ajang bertemunya hati para pejuang kebaikan, kafilah sedekah, dan keluarga besar dari penjuru tanah air. Mari daftarkan kehadiran Anda dan rombongan wilayah untuk menikmati kehangatan ukhuwah di tengah sejuknya alam asri.',
  photos: [
    {
      img: 'images/paskas-polaroid.jpg',
      title: 'Sahabat Paskas',
      sub: "Kafilah Silaturahmi '26"
    },
    {
      img: 'images/paskas-camp-circle.jpg',
      title: 'Kemah Ukhuwah',
      sub: 'Malam Bintang di Alam'
    },
    {
      img: 'images/paskas-berkah-smile.jpg',
      title: 'Berbagi Ceria',
      sub: 'Senyum Relawan Ummat'
    }
  ]
};

function loadStoredRegistrationContent() {
  try {
    const saved = localStorage.getItem('paskas_reg_content');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const savedSettings = window.dataService ? window.dataService.getSettings() : {};
        const fallbackLocation = savedSettings.event_location || DEFAULT_REGISTRATION_CONTENT.location;

        return {
          location: parsed.location || fallbackLocation,
          kicker: parsed.kicker || DEFAULT_REGISTRATION_CONTENT.kicker,
          title: parsed.title || DEFAULT_REGISTRATION_CONTENT.title,
          narration: parsed.narration || DEFAULT_REGISTRATION_CONTENT.narration,
          photos: Array.isArray(parsed.photos) && parsed.photos.length > 0
            ? parsed.photos.map((p, i) => ({
                img: p.img || (DEFAULT_REGISTRATION_CONTENT.photos[i] ? DEFAULT_REGISTRATION_CONTENT.photos[i].img : 'images/paskas-polaroid.jpg'),
                title: p.title || (DEFAULT_REGISTRATION_CONTENT.photos[i] ? DEFAULT_REGISTRATION_CONTENT.photos[i].title : `Foto Polaroid #${i + 1}`),
                sub: p.sub !== undefined ? p.sub : (DEFAULT_REGISTRATION_CONTENT.photos[i] ? DEFAULT_REGISTRATION_CONTENT.photos[i].sub : `Silaturahmi Akbar '26`)
              }))
            : JSON.parse(JSON.stringify(DEFAULT_REGISTRATION_CONTENT.photos))
        };
      }
    }
  } catch (e) {
    console.warn('Gagal memuat pengaturan narasi & foto registrasi:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_REGISTRATION_CONTENT));
}

let REGISTRATION_CONTENT = loadStoredRegistrationContent();

// STATE MANAGEMENT
let currentCardIndex = 0;
let registrationType = 'individu'; // 'individu' or 'kelompok'
let allRegistrations = [];
let filteredRegistrations = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 8;
let deadlineInterval = null;
let isRegistrationLocked = false;

// Chart Instances
let currentChartTab = 'cloth';
let chartClothInstance = null;
let chartTransportInstance = null;
let chartWilayahInstance = null;
let chartGenderInstance = null;
let chartTypeInstance = null;
let chartClothAllInstance = null;
let chartTransportAllInstance = null;
let chartWilayahAllInstance = null;
let chartGenderAllInstance = null;

// ===================================================================
// MASTER WILAYAH / ASAL DAERAH KAFILAH
// ===================================================================
const DEFAULT_MASTER_WILAYAH = [
  'Pontianak',
  'Kubu Raya',
  'Singkawang',
  'Sambas',
  'Mempawah',
  'Ketapang',
  'Sanggau',
  'Sintang',
  'Sekadau',
  'Melawi',
  'Kapuas Hulu',
  'Bengkayang',
  'Landak',
  'Kayong Utara',
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Semarang',
  'Yogyakarta',
  'Medan',
  'Palembang',
  'Makassar',
  'Banjarmasin',
  'Balikpapan',
  'Samarinda'
];

function escapeAttr(str) {
  if (typeof str !== 'string') return str || '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function normalizeWilayahName(str) {
  if (!str || typeof str !== 'string') return 'Lainnya';
  const clean = str.trim().replace(/\s+/g, ' ');
  if (!clean) return 'Lainnya';
  return clean.split(' ').map(w => {
    if (!w) return '';
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

function getMasterWilayahList() {
  try {
    const raw = localStorage.getItem('paskas_master_wilayah');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(w => typeof w === 'string' && w.trim());
      }
    }
  } catch (e) {
    console.error('Error loading master wilayah:', e);
  }
  const defaults = [...DEFAULT_MASTER_WILAYAH];
  saveMasterWilayahList(defaults);
  return defaults;
}

function saveMasterWilayahList(list) {
  try {
    const cleanList = Array.isArray(list) ? list.filter(w => typeof w === 'string' && w.trim()) : [];
    localStorage.setItem('paskas_master_wilayah', JSON.stringify(cleanList));
  } catch (e) {
    console.error('Error saving master wilayah:', e);
  }
}

function populateWilayahDropdowns() {
  const masterList = getMasterWilayahList();

  // Populate datalist id="wilayahList" (digunakan oleh form individu & kelompok)
  const datalist = document.getElementById('wilayahList');
  if (datalist) {
    datalist.innerHTML = masterList.map(w => `<option value="${escapeAttr(w)}">`).join('');
  }

  // Populate dropdown ind_wilayah_select di form registrasi individu
  const indSelect = document.getElementById('ind_wilayah_select');
  if (indSelect) {
    const curVal = indSelect.value;
    let html = '<option value="">-- Pilih Wilayah Asal --</option>';
    masterList.forEach(w => {
      html += `<option value="${escapeAttr(w)}">${escapeHtml(w)}</option>`;
    });
    indSelect.innerHTML = html;
    if (curVal && masterList.includes(curVal)) {
      indSelect.value = curVal;
    }
  }

  // Populate dropdown grp_defaultWilayah di form registrasi rombongan
  const grpSelect = document.getElementById('grp_defaultWilayah');
  if (grpSelect) {
    const curVal = grpSelect.value;
    let html = '<option value="">-- Pilih Wilayah Asal --</option>';
    masterList.forEach(w => {
      html += `<option value="${escapeAttr(w)}">${escapeHtml(w)}</option>`;
    });
    grpSelect.innerHTML = html;
    if (curVal && masterList.includes(curVal)) {
      grpSelect.value = curVal;
    }
  }
}

function handleIndividuWilayahSelect(val) {
  // Sync hidden ind_wilayah for backwards compatibility
  const hiddenEl = document.getElementById('ind_wilayah');
  if (hiddenEl) hiddenEl.value = val || '';
}

let editingWilayahIndex = -1;

function renderSettingsWilayahManager() {
  const fullList = getMasterWilayahList();
  const badge = document.getElementById('cfg_masterWilayahCountBadge');
  const tbody = document.getElementById('cfg_masterWilayahTableBody');
  const searchInput = document.getElementById('searchMasterWilayahInput');
  const searchQuery = (searchInput?.value || '').trim().toLowerCase();

  if (badge) badge.textContent = `Total ${fullList.length} Daerah Terdaftar`;
  if (!tbody) return;

  // Filter list by search query if any
  const displayItems = fullList
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => !searchQuery || item.toLowerCase().includes(searchQuery));

  if (fullList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: #94a3b8; padding: 32px 16px;">
          <i class="fa-solid fa-map-location-dot" style="font-size: 28px; opacity: 0.5; margin-bottom: 10px; display: block; color: #52b788;"></i>
          <span style="font-weight: 600; font-size: 14px; color: #cbd5e1; display: block;">Daftar wilayah saat ini kosong.</span>
          <span style="font-size: 12px; color: #64748b; margin-top: 4px; display: block;">
            Ketik nama daerah pada kolom input di atas lalu klik tombol <strong>+ Tambah Wilayah</strong>.
          </span>
        </td>
      </tr>
    `;
    return;
  }

  if (displayItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: #94a3b8; padding: 24px 16px;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 20px; opacity: 0.5; margin-bottom: 6px; display: block;"></i>
          Tidak ada wilayah yang cocok dengan kata kunci <em>"${escapeHtml(searchQuery)}"</em>.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = displayItems.map(({ item, originalIndex }) => {
    const isEditing = editingWilayahIndex === originalIndex;

    if (isEditing) {
      return `
        <tr style="background: rgba(245, 158, 11, 0.12);">
          <td class="wilayah-num-col">
            <span class="wilayah-num-badge" style="border-color: #f59e0b; color: #fbbf24;">${originalIndex + 1}</span>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-pen" style="color: #fbbf24; font-size: 13px;"></i>
              <input type="text" id="inputEditWilayah_${originalIndex}" class="form-control" 
                value="${escapeAttr(item)}" 
                style="padding: 7px 12px; font-size: 13.5px; font-weight: 600; border-color: #b89333; background: #ffffff; color: #1a1815;"
                onkeydown="if(event.key==='Enter'){event.preventDefault();saveMasterWilayahEdit(${originalIndex});}else if(event.key==='Escape'){event.preventDefault();cancelMasterWilayahEdit();}">
            </div>
          </td>
          <td class="wilayah-action-col">
            <div class="wilayah-actions-wrap">
              <button type="button" class="btn-wilayah-btn save" onclick="saveMasterWilayahEdit(${originalIndex})" title="Simpan Perubahan">
                <i class="fa-solid fa-check"></i> Simpan
              </button>
              <button type="button" class="btn-wilayah-btn cancel" onclick="cancelMasterWilayahEdit()" title="Batal Edit">
                <i class="fa-solid fa-xmark"></i> Batal
              </button>
            </div>
          </td>
        </tr>
      `;
    }

    return `
      <tr>
        <td class="wilayah-num-col">
          <span class="wilayah-num-badge">${originalIndex + 1}</span>
        </td>
        <td class="wilayah-name-col">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-location-dot" style="color: #52b788; font-size: 13px;"></i>
            <span>${escapeHtml(item)}</span>
          </div>
        </td>
        <td class="wilayah-action-col">
          <div class="wilayah-actions-wrap">
            <button type="button" class="btn-wilayah-btn edit" onclick="startMasterWilayahEdit(${originalIndex})" title="Edit Nama Wilayah">
              <i class="fa-regular fa-pen-to-square"></i> Edit
            </button>
            <button type="button" class="btn-wilayah-btn delete" onclick="openDeleteWilayahModal('${escapeAttr(item)}')" title="Hapus Wilayah">
              <i class="fa-regular fa-trash-can"></i> Hapus
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterMasterWilayahTable() {
  renderSettingsWilayahManager();
}

function startMasterWilayahEdit(originalIndex) {
  editingWilayahIndex = originalIndex;
  renderSettingsWilayahManager();
  setTimeout(() => {
    const input = document.getElementById(`inputEditWilayah_${originalIndex}`);
    if (input) {
      input.focus();
      input.select();
    }
  }, 40);
}

function cancelMasterWilayahEdit() {
  editingWilayahIndex = -1;
  renderSettingsWilayahManager();
}

function saveMasterWilayahEdit(originalIndex) {
  const input = document.getElementById(`inputEditWilayah_${originalIndex}`);
  if (!input) return;

  const raw = input.value.trim();
  if (!raw) {
    showToast('Nama wilayah tidak boleh kosong.', 'warning');
    input.focus();
    return;
  }

  const normalized = normalizeWilayahName(raw);
  const list = getMasterWilayahList();
  const oldName = list[originalIndex];

  // Check if new name duplicates another item in the list
  const isDuplicate = list.some((w, idx) => idx !== originalIndex && w.toLowerCase() === normalized.toLowerCase());
  if (isDuplicate) {
    showToast(`Wilayah "${normalized}" sudah ada dalam daftar.`, 'info');
    input.select();
    return;
  }

  list[originalIndex] = normalized;
  list.sort((a, b) => a.localeCompare('id'));
  saveMasterWilayahList(list);

  editingWilayahIndex = -1;
  renderSettingsWilayahManager();
  populateWilayahDropdowns();
  showToast(`Wilayah "${oldName}" berhasil diubah menjadi "${normalized}".`, 'success');
}

function addMasterWilayahItem() {
  const input = document.getElementById('cfg_newWilayahInput');
  if (!input) return;
  const raw = input.value.trim();
  if (!raw) {
    showToast('Harap ketik nama wilayah/daerah terlebih dahulu.', 'warning');
    input.focus();
    return;
  }

  const normalized = normalizeWilayahName(raw);
  const list = getMasterWilayahList();

  // Check duplicate case-insensitively
  if (list.some(w => w.toLowerCase() === normalized.toLowerCase())) {
    showToast(`Wilayah "${normalized}" sudah ada dalam daftar.`, 'info');
    input.select();
    return;
  }

  list.push(normalized);
  list.sort((a, b) => a.localeCompare('id'));
  saveMasterWilayahList(list);

  renderSettingsWilayahManager();
  populateWilayahDropdowns();
  input.value = '';
  input.focus();
  showToast(`Wilayah "${normalized}" berhasil ditambahkan ke daftar!`, 'success');
}

// ===================================================================
// POP-UP MODAL KONFIRMASI HAPUS WILAYAH (ELEGAN)
// ===================================================================
let pendingDeleteWilayahTarget = null; // string name (for single) or '__ALL__' (for clear all)

function openDeleteWilayahModal(name) {
  pendingDeleteWilayahTarget = name;
  const modal = document.getElementById('deleteWilayahConfirmModal');
  const title = document.getElementById('deleteWilayahModalTitle');
  const desc = document.getElementById('deleteWilayahModalDesc');
  const targetBadge = document.getElementById('deleteWilayahModalTargetBadge');
  const targetName = document.getElementById('deleteWilayahModalTargetName');
  const subnote = document.getElementById('deleteWilayahModalSubnote');
  const icon = document.getElementById('deleteWilayahModalIcon');
  const confirmBtn = document.getElementById('btnConfirmDeleteWilayahAction');

  if (title) title.textContent = 'Hapus Wilayah?';
  if (desc) desc.textContent = 'Apakah Anda yakin ingin menghapus wilayah berikut dari daftar pilihan?';
  if (targetName) targetName.textContent = name;
  if (targetBadge) targetBadge.style.display = 'inline-flex';
  if (subnote) subnote.textContent = 'Wilayah ini tidak akan muncul lagi di dropdown formulir pendaftaran peserta.';
  if (icon) icon.className = 'fa-solid fa-trash-can';
  if (confirmBtn) {
    confirmBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Ya, Hapus Sekarang';
    confirmBtn.onclick = executeDeleteWilayahConfirmed;
  }

  if (modal) modal.classList.add('active');
}

function openClearAllWilayahModal() {
  const list = getMasterWilayahList();
  if (list.length === 0) {
    showToast('Daftar pilihan wilayah saat ini sudah kosong.', 'info');
    return;
  }

  pendingDeleteWilayahTarget = '__ALL__';
  const modal = document.getElementById('deleteWilayahConfirmModal');
  const title = document.getElementById('deleteWilayahModalTitle');
  const desc = document.getElementById('deleteWilayahModalDesc');
  const targetBadge = document.getElementById('deleteWilayahModalTargetBadge');
  const targetName = document.getElementById('deleteWilayahModalTargetName');
  const subnote = document.getElementById('deleteWilayahModalSubnote');
  const icon = document.getElementById('deleteWilayahModalIcon');
  const confirmBtn = document.getElementById('btnConfirmDeleteWilayahAction');

  if (title) title.textContent = 'Hapus Semua Wilayah?';
  if (desc) desc.textContent = `Apakah Anda yakin ingin MENGHAPUS SEMUA (${list.length}) daftar wilayah terdaftar?`;
  if (targetBadge) {
    targetBadge.style.display = 'inline-flex';
    if (targetName) targetName.textContent = `Seluruh ${list.length} Daerah Pilihan`;
  }
  if (subnote) subnote.textContent = 'Seluruh daftar pilihan daerah akan dikosongkan. Anda dapat menambahkan daerah baru kapan saja.';
  if (icon) icon.className = 'fa-solid fa-triangle-exclamation';
  if (confirmBtn) {
    confirmBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Ya, Kosongkan Semua';
    confirmBtn.onclick = executeDeleteWilayahConfirmed;
  }

  if (modal) modal.classList.add('active');
}

function closeDeleteWilayahModal() {
  pendingDeleteWilayahTarget = null;
  const modal = document.getElementById('deleteWilayahConfirmModal');
  if (modal) modal.classList.remove('active');
}

function executeDeleteWilayahConfirmed() {
  if (!pendingDeleteWilayahTarget) return;

  if (pendingDeleteWilayahTarget === '__ALL__') {
    saveMasterWilayahList([]);
    editingWilayahIndex = -1;
    renderSettingsWilayahManager();
    populateWilayahDropdowns();
    closeDeleteWilayahModal();
    showToast('Seluruh daftar wilayah telah berhasil dikosongkan.', 'info');
  } else {
    const name = pendingDeleteWilayahTarget;
    let list = getMasterWilayahList();
    list = list.filter(w => w.toLowerCase() !== name.toLowerCase());
    saveMasterWilayahList(list);

    editingWilayahIndex = -1;
    renderSettingsWilayahManager();
    populateWilayahDropdowns();
    closeDeleteWilayahModal();
    showToast(`Wilayah "${name}" berhasil dihapus dari daftar pilihan.`, 'success');
  }
}

// Fallbacks for direct call if needed
function removeMasterWilayahItem(name) {
  openDeleteWilayahModal(name);
}

function clearAllMasterWilayah() {
  openClearAllWilayahModal();
}

function initMasterWilayah() {
  populateWilayahDropdowns();
  renderSettingsWilayahManager();
}

// Bind globally to window object for reliable HTML onclick access
window.getMasterWilayahList = getMasterWilayahList;
window.saveMasterWilayahList = saveMasterWilayahList;
window.renderSettingsWilayahManager = renderSettingsWilayahManager;
window.filterMasterWilayahTable = filterMasterWilayahTable;
window.startMasterWilayahEdit = startMasterWilayahEdit;
window.cancelMasterWilayahEdit = cancelMasterWilayahEdit;
window.saveMasterWilayahEdit = saveMasterWilayahEdit;
window.addMasterWilayahItem = addMasterWilayahItem;
window.removeMasterWilayahItem = removeMasterWilayahItem;
window.clearAllMasterWilayah = clearAllMasterWilayah;
window.openDeleteWilayahModal = openDeleteWilayahModal;
window.openClearAllWilayahModal = openClearAllWilayahModal;
window.closeDeleteWilayahModal = closeDeleteWilayahModal;
window.executeDeleteWilayahConfirmed = executeDeleteWilayahConfirmed;
window.initMasterWilayah = initMasterWilayah;
window.handleIndividuWilayahSelect = handleIndividuWilayahSelect;

// ===================================================================
// INITALIZATION
// ===================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Auto-clean any corrupt ticket template image in localStorage
  try {
    const rawSettings = localStorage.getItem('paskas_settings_cache');
    if (rawSettings && (rawSettings.includes('[object') || rawSettings.includes('boarding-pass-template.png'))) {
      const parsed = JSON.parse(rawSettings);
      if (!parsed.ticket_template_image || typeof parsed.ticket_template_image !== 'string' || parsed.ticket_template_image.includes('[object') || parsed.ticket_template_image.includes('boarding-pass-template.png')) {
        parsed.ticket_template_image = 'images/boarding-pass-canva.png';
        localStorage.setItem('paskas_settings_cache', JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.warn('Settings cleanup error:', e);
  }

  if (DASHBOARD_CARDS && DASHBOARD_CARDS[0] && DASHBOARD_CARDS[0].coverImg) {
    const bg1 = document.getElementById('heroBg1');
    if (bg1) {
      bg1.style.backgroundImage = `url('${parseDirectImageUrl(DASHBOARD_CARDS[0].coverImg)}')`;
    }
  }
  // Sinkronisasi data pengaturan dari Supabase jika terhubung
  if (window.dataService && window.dataService.syncSettingsFromSupabase) {
    try {
      await window.dataService.syncSettingsFromSupabase();
    } catch (e) {
      console.warn('Sync settings on load:', e);
    }
  }

  renderDashboardCards();
  applyEventInfoToUI();
  renderRegistrationPageContent();
  initCountdownTimer();
  updateDatabaseBadge();
  setupEventListeners();

  // Inisialisasi Master Wilayah (Dropdown & Settings)
  initMasterWilayah();

  // Load Registrations & Metrics
  await loadAndRenderRegistrations();

  // Initialize group member form with 1 default card
  initGroupMembers();

  // Default dates for input (Today + 1 month)
  setDefaultDates();

  // If page-settings is already active on load, ensure theme class is applied
  if (document.getElementById('page-settings')?.classList.contains('active')) {
    document.body.classList.add('page-settings-active');
  }
});

function setDefaultDates() {
  const defaultArrival = '2026-11-10';
  const defaultDeparture = '2026-11-13';

  const arrivalInput = document.getElementById('ind_arrivalDate');
  const departureInput = document.getElementById('ind_departureDate');
  const grpArrInput = document.getElementById('grp_defaultArrival');
  const grpDepInput = document.getElementById('grp_defaultDeparture');

  if (arrivalInput) arrivalInput.value = defaultArrival;
  if (departureInput) departureInput.value = defaultDeparture;
  if (grpArrInput) grpArrInput.value = defaultArrival;
  if (grpDepInput) grpDepInput.value = defaultDeparture;
}

// ===================================================================
// 1. DASHBOARD CARDS CAROUSEL & DETAIL MODAL
// ===================================================================
let activeBgLayer = 1;

function crossfadeHeroBackground(imageUrl) {
  const bg1 = document.getElementById('heroBg1');
  const bg2 = document.getElementById('heroBg2');
  if (!bg1 || !bg2 || !imageUrl) return;

  const validUrl = parseDirectImageUrl(imageUrl);

  if (activeBgLayer === 1) {
    bg2.style.backgroundImage = `url('${validUrl}')`;
    bg2.classList.add('active');
    bg1.classList.remove('active');
    activeBgLayer = 2;
  } else {
    bg1.style.backgroundImage = `url('${validUrl}')`;
    bg1.classList.add('active');
    bg2.classList.remove('active');
    activeBgLayer = 1;
  }
}

// ===================================================================
// INFINITE SEAMLESS DASHBOARD CAROUSEL ENGINE (NO REWIND / CONTINUOUS)
// ===================================================================
let currentCarouselPos = 0;
let isCarouselSliding = false;
let isCarouselTransitionBound = false;
let isCarouselTouchBound = false;

function syncActiveCardHighlight() {
  const thumbs = document.querySelectorAll('.info-card-thumb');
  thumbs.forEach(thumb => {
    const realIdx = parseInt(thumb.getAttribute('data-real-index'), 10);
    thumb.classList.toggle('active-card', realIdx === currentCardIndex);
  });
}

function renderDashboardCards() {
  const track = document.getElementById('cardsTrack');
  if (!track || !DASHBOARD_CARDS || DASHBOARD_CARDS.length === 0) return;

  const N = DASHBOARD_CARDS.length;
  // Duplicate 3x sets [Set 0 (prefix clones), Set 1 (main/center), Set 2 (suffix clones)]
  // This allows 100% seamless infinite loop in both directions without any rewind!
  const fullCards = [...DASHBOARD_CARDS, ...DASHBOARD_CARDS, ...DASHBOARD_CARDS];

  track.innerHTML = fullCards.map((card, idx) => {
    const realIdx = idx % N;
    return `
      <div class="info-card-thumb ${realIdx === currentCardIndex ? 'active-card' : ''}" 
           data-real-index="${realIdx}"
           data-virtual-index="${idx}"
           onclick="openCardDetail('${card.id}')"
           title="${card.title} - Klik untuk melihat detail">
        <img src="${parseDirectImageUrl(card.thumbImg || card.coverImg, true)}" 
             alt="${card.title}" 
             loading="lazy"
             onerror="this.onerror=null; this.src='images/rocket-convention-hall-card.jpg';">
        <div class="info-card-gradient">
          <span class="info-card-label">${card.title}</span>
          <span class="info-card-sub">${card.category}</span>
        </div>
        <span class="info-card-badge">${card.badge}</span>
      </div>
    `;
  }).join('');

  // Start in the center set
  currentCarouselPos = N + currentCardIndex;
  track.style.transition = 'none';
  const cardStep = getCardStep();
  track.style.transform = `translateX(-${currentCarouselPos * cardStep}px)`;
  void track.offsetWidth; // Force synchronous layout reflow
  track.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';

  // Bind transitionend once
  if (!isCarouselTransitionBound) {
    track.addEventListener('transitionend', handleCarouselTransitionEnd);
    isCarouselTransitionBound = true;
  }

  // Bind mobile touch swiping once
  bindCarouselTouchEvents();

  renderCarouselDashes();
  updateCarouselProgress();
}

function getCardStep() {
  const track = document.getElementById('cardsTrack');
  if (track && track.children.length > 1) {
    const card1 = track.children[0];
    const card2 = track.children[1];
    const step = card2.offsetLeft - card1.offsetLeft;
    if (step > 50) return step;
  }
  return 232; // fallback default (216px card + 16px gap)
}

function slideCards(direction) {
  if (isCarouselSliding) return;
  const N = DASHBOARD_CARDS.length;
  if (N <= 1) return;

  isCarouselSliding = true;

  if (direction === 'next') {
    currentCarouselPos++;
  } else {
    currentCarouselPos--;
  }

  // Calculate real active card index in circular loop
  currentCardIndex = ((currentCarouselPos - N) % N + N) % N;

  const track = document.getElementById('cardsTrack');
  const cardStep = getCardStep();
  if (track) {
    track.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
    track.style.transform = `translateX(-${currentCarouselPos * cardStep}px)`;
  }

  // Crossfade hero background seamlessly
  if (DASHBOARD_CARDS[currentCardIndex]) {
    crossfadeHeroBackground(DASHBOARD_CARDS[currentCardIndex].coverImg);
  }

  syncActiveCardHighlight();
  updateCarouselProgress();

  // Safety fallback in case transitionend event is missed
  setTimeout(() => {
    if (isCarouselSliding) {
      resetCarouselIfOutOfBounds();
    }
  }, 600);
}

function handleCarouselTransitionEnd(e) {
  if (e && e.propertyName && e.propertyName !== 'transform') return;
  resetCarouselIfOutOfBounds();
}

function resetCarouselIfOutOfBounds() {
  const track = document.getElementById('cardsTrack');
  if (!track || !DASHBOARD_CARDS || DASHBOARD_CARDS.length === 0) {
    isCarouselSliding = false;
    return;
  }

  const N = DASHBOARD_CARDS.length;
  let resetNeeded = false;

  // If passed the end of the center set, jump back to center set invisibly without transition
  if (currentCarouselPos >= 2 * N) {
    currentCarouselPos -= N;
    resetNeeded = true;
  } else if (currentCarouselPos < N) {
    // If passed before the start of the center set, jump forward to center set invisibly
    currentCarouselPos += N;
    resetNeeded = true;
  }

  if (resetNeeded) {
    const cardStep = getCardStep();
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentCarouselPos * cardStep}px)`;
    void track.offsetWidth; // Force reflow
    track.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  isCarouselSliding = false;
}

function goToCardIndex(targetIndex) {
  if (targetIndex < 0 || targetIndex >= DASHBOARD_CARDS.length) return;
  if (targetIndex === currentCardIndex && !isCarouselSliding) return;

  const N = DASHBOARD_CARDS.length;
  // Calculate shortest direction around the circular ring (-3 to +3)
  let diff = targetIndex - currentCardIndex;
  if (diff > N / 2) diff -= N;
  if (diff < -N / 2) diff += N;

  currentCarouselPos += diff;
  currentCardIndex = targetIndex;
  isCarouselSliding = true;

  const track = document.getElementById('cardsTrack');
  const cardStep = getCardStep();
  if (track) {
    track.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
    track.style.transform = `translateX(-${currentCarouselPos * cardStep}px)`;
  }

  if (DASHBOARD_CARDS[currentCardIndex]) {
    crossfadeHeroBackground(DASHBOARD_CARDS[currentCardIndex].coverImg);
  }

  syncActiveCardHighlight();
  updateCarouselProgress();

  setTimeout(() => {
    if (isCarouselSliding) {
      resetCarouselIfOutOfBounds();
    }
  }, 600);
}

function bindCarouselTouchEvents() {
  if (isCarouselTouchBound) return;
  const viewport = document.getElementById('cardsViewport') || document.getElementById('cardsTrack');
  if (!viewport) return;

  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  viewport.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = true;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        slideCards('next');
      } else {
        slideCards('prev');
      }
    }
  }, { passive: true });

  isCarouselTouchBound = true;
}

window.addEventListener('resize', () => {
  const track = document.getElementById('cardsTrack');
  if (track && typeof DASHBOARD_CARDS !== 'undefined' && DASHBOARD_CARDS.length > 0) {
    const cardStep = getCardStep();
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentCarouselPos * cardStep}px)`;
    void track.offsetWidth;
    track.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
  }
});

function updateCarouselProgress() {
  const counter = document.getElementById('carouselCounter');
  const dashesContainer = document.getElementById('carouselDashes');

  if (counter) {
    const activeNum = String(currentCardIndex + 1).padStart(2, '0');
    const totalNum = String(DASHBOARD_CARDS.length).padStart(2, '0');
    counter.textContent = `${activeNum} / ${totalNum}`;
  }

  if (dashesContainer) {
    if (dashesContainer.children.length !== DASHBOARD_CARDS.length) {
      renderCarouselDashes();
    } else {
      const pills = dashesContainer.querySelectorAll('.carousel-dash-pill');
      pills.forEach((pill, idx) => {
        pill.classList.toggle('active', idx === currentCardIndex);
      });
    }
  }
}

function renderCarouselDashes() {
  const dashesContainer = document.getElementById('carouselDashes');
  if (!dashesContainer) return;

  dashesContainer.innerHTML = DASHBOARD_CARDS.map((card, idx) => `
    <div class="carousel-dash-pill ${idx === currentCardIndex ? 'active' : ''}" 
         onclick="goToCardIndex(${idx})" 
         title="Kartu ${idx + 1}: ${card.title}">
    </div>
  `).join('');
}

// ===================================================================
// SEAMLESS IN-PLACE HERO STORY CONTROLLER (ZERO SCROLL, DOMINANT VIVID BG)
// ===================================================================
let currentStoryIndex = 0;

function openCardDetail(cardId) {
  const cardIdx = DASHBOARD_CARDS.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return;
  currentStoryIndex = cardIdx;
  currentCardIndex = cardIdx;

  // Render konten story kartu
  renderHeroStoryContent(cardIdx);

  // Ganti background ke foto kartu dengan kualitas jernih & tajam
  crossfadeHeroBackground(DASHBOARD_CARDS[cardIdx].coverImg);

  // Aktifkan mode story di hero (tanpa scroll, in-place transition)
  const hero = document.getElementById('heroWrapper');
  if (hero) {
    hero.classList.add('story-active');
  }

  // Sinkronkan highlight kartu di track
  syncActiveCardHighlight();
  updateCarouselProgress();
}

function renderHeroStoryContent(idx) {
  const card = DASHBOARD_CARDS[idx];
  if (!card) return;

  const tagEl = document.getElementById('storyCategoryTag');
  const titleEl = document.getElementById('storyMainTitle');
  const subEl = document.getElementById('storyMainSub') || document.getElementById('storySubtitle');
  const bodyEl = document.getElementById('storyMainBody') || document.getElementById('storyContentBody');
  const counterEl = document.getElementById('storyCounterPill') || document.getElementById('carouselCounter');

  if (tagEl) tagEl.textContent = card.category || '';
  if (titleEl) titleEl.textContent = card.title || '';
  if (subEl) subEl.textContent = card.subtitle || '';

  if (bodyEl) {
    if (card.narration && card.narration.trim()) {
      const paras = card.narration.split('\n\n').filter(p => p.trim());
      const pTags = paras.length > 0
        ? paras.map(p => `<p style="margin-bottom: 12px; line-height: 1.7; color: #e2e8f0; font-size: 14.5px;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('')
        : `<p style="line-height: 1.7; color: #e2e8f0; font-size: 14.5px;">${escapeHtml(card.narration).replace(/\n/g, '<br>')}</p>`;

      bodyEl.innerHTML = `
        <div class="modal-rich-section">
          <h4><i class="fa-solid fa-circle-info"></i> Informasi & Narasi Acara</h4>
          ${pTags}
        </div>
      `;
    } else if (card.content) {
      bodyEl.innerHTML = card.content;
    } else {
      bodyEl.innerHTML = `
        <div class="modal-rich-section">
          <h4><i class="fa-solid fa-circle-info"></i> Informasi Acara</h4>
          <p style="color: #cbd5e1; font-size: 14px;">${escapeHtml(card.subtitle || 'Belum ada rincian narasi untuk informasi ini.')}</p>
        </div>
      `;
    }
  }

  if (counterEl) {
    counterEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(DASHBOARD_CARDS.length).padStart(2, '0')}`;
  }
}

function closeHeroStory() {
  const hero = document.getElementById('heroWrapper');
  if (hero) {
    hero.classList.remove('story-active');
  }
}

function navigateHeroStory(direction) {
  if (direction === 'next') {
    currentStoryIndex = (currentStoryIndex + 1) % DASHBOARD_CARDS.length;
  } else {
    currentStoryIndex = (currentStoryIndex - 1 + DASHBOARD_CARDS.length) % DASHBOARD_CARDS.length;
  }

  currentCardIndex = currentStoryIndex;
  renderHeroStoryContent(currentStoryIndex);

  // Crossfade background gambar yang jernih dan dominan
  crossfadeHeroBackground(DASHBOARD_CARDS[currentStoryIndex].coverImg);

  // Sinkronkan thumbnail di track
  syncActiveCardHighlight();
  updateCarouselProgress();
}

// ===================================================================
// 2. NAVIGATION & ROUTING
// ===================================================================
function navigateTo(pageId) {
  if (pageId === 'rekap') {
    if (!isAdminLoggedIn) {
      openSettingsWithAuth('rekap');
      return;
    } else {
      navigateTo('settings');
      switchSettingsTab('rekap');
      return;
    }
  }

  if (pageId === 'settings' && !isAdminLoggedIn) {
    openSettingsWithAuth('rekap');
    return;
  }

  if (pageId === 'dashboard') {
    closeHeroStory();
  }

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  // Update btn-icon with data-page
  document.querySelectorAll('.btn-icon[data-page]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  // Update mobile nav links
  document.querySelectorAll('.mobile-link').forEach(btn => {
    const text = btn.textContent.toLowerCase();
    btn.classList.toggle('active', text.includes(pageId));
  });

  // Switch page view
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle theme class for settings page
  document.body.classList.toggle('page-settings-active', pageId === 'settings');

  // If going to registration page, reset to show start button initially
  if (pageId === 'registration') {
    const storyGrid = document.getElementById('storyContentGrid');
    const ctaWrap = document.getElementById('regisCtaWrapper');
    const promptBox = document.getElementById('regTypePromptBox');
    const formCard = document.getElementById('regFormCardContainer');
    if (storyGrid) storyGrid.style.display = 'grid';
    if (ctaWrap) ctaWrap.style.display = 'flex';
    if (promptBox) promptBox.style.display = 'none';
    if (formCard) formCard.style.display = 'none';
  }

  // If going to rekap page, re-render charts
  if (pageId === 'rekap') {
    renderCharts();
  }

  // If going to settings page, initialize settings fields and cards
  if (pageId === 'settings') {
    initSettingsPage();
  }
}

function toggleMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  if (drawer) drawer.classList.toggle('active');
}

// ===================================================================
// 3. COUNTDOWN TIMER & DEADLINE LOGIC
// ===================================================================
function initCountdownTimer() {
  if (deadlineInterval) clearInterval(deadlineInterval);

  const checkCountdown = () => {
    const settings = window.dataService.getSettings();
    const deadlineStr = settings.registration_deadline || '2026-12-31T23:59:59';
    const isManuallyOpen = settings.is_registration_open !== 'false';
    const deadlineDate = new Date(deadlineStr).getTime();
    const now = new Date().getTime();
    const distance = deadlineDate - now;

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');
    const statusBadge = document.getElementById('countdownStatusBadge');
    const deadlineBanner = document.getElementById('regDeadlineBanner');
    const deadlineText = document.getElementById('regDeadlineText');
    const regBadgeText = document.getElementById('regCountdownBadgeText');
    const formPeriodDisplay = document.getElementById('form-period-display');
    const countdownBadge = document.getElementById('countdown-badge');

    if (!isManuallyOpen || distance <= 0) {
      // Pendaftaran Tutup!
      isRegistrationLocked = true;
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';

      if (statusBadge) {
        statusBadge.textContent = 'Tutup';
        statusBadge.classList.add('closed');
      }

      if (deadlineBanner) {
        deadlineBanner.classList.add('closed');
        deadlineBanner.innerHTML = `<i class="fa-solid fa-lock"></i> <span>${settings.closed_message || 'Batas pendaftaran telah berakhir.'}</span>`;
      }

      if (regBadgeText) regBadgeText.textContent = 'Pendaftaran Ditutup';
      if (countdownBadge) countdownBadge.classList.add('closed');
      if (formPeriodDisplay) formPeriodDisplay.textContent = 'Batas Waktu Telah Berakhir';

      lockRegistrationForms(true);
    } else {
      // Pendaftaran Buka
      isRegistrationLocked = false;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');

      if (statusBadge) {
        statusBadge.textContent = 'Buka';
        statusBadge.classList.remove('closed');
      }

      const d = new Date(deadlineStr);
      const dateFormatted = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      if (deadlineBanner) {
        deadlineBanner.classList.remove('closed');
        deadlineBanner.innerHTML = `<i class="fa-solid fa-bell"></i> <span>Pendaftaran dibuka sampai ${dateFormatted} WIB. Segera amankan kuota Anda!</span>`;
      }

      if (regBadgeText) regBadgeText.textContent = `Dibuka (${days} Hari ${hours} Jam Lagi)`;
      if (countdownBadge) countdownBadge.classList.remove('closed');
      if (formPeriodDisplay) formPeriodDisplay.textContent = `Batas Akhir: ${dateFormatted} WIB`;

      lockRegistrationForms(false);
    }
  };

  checkCountdown();
  deadlineInterval = setInterval(checkCountdown, 1000);
}

function lockRegistrationForms(locked) {
  const indBtn = document.getElementById('indSubmitBtn');
  const grpBtn = document.getElementById('grpSubmitBtn');
  if (indBtn) {
    indBtn.disabled = locked;
    indBtn.innerHTML = locked 
      ? '<i class="fa-solid fa-lock"></i> Pendaftaran Telah Ditutup'
      : '<i class="fa-solid fa-paper-plane"></i> Kirim Pendaftaran Individu';
  }
  if (grpBtn) {
    grpBtn.disabled = locked;
  }
}

// ===================================================================
// 4. REGISTRATION FORM CONTROLLERS (INDIVIDU & KELOMPOK)
// ===================================================================
function setRegistrationType(type) {
  handleRegistrationTypeSelect(type);
}

// ===================================================================
// KONTROL MINIMALIST LUXURY SELECTOR JENIS PENDAFTARAN
// ===================================================================
function chooseCategoryOption(type) {
  const nativeSelect = document.getElementById('formCategorySelect');
  if (nativeSelect) {
    nativeSelect.value = type;
  }
  handleRegistrationTypeSelect(type);
}

function chooseCategoryOption(type) {
  const nativeSelect = document.getElementById('formCategorySelect');
  if (nativeSelect) {
    nativeSelect.value = type;
  }
  handleRegistrationTypeSelect(type);
}

function openRegistrationSelector() {
  const promptBox = document.getElementById('regTypePromptBox');
  const ctaWrap = document.getElementById('regisCtaWrapper');
  const storyGrid = document.getElementById('storyContentGrid');
  if (!promptBox) return;

  // Sembunyikan deskripsi singkat dan tatacara pengisian sesuai permintaan pengguna
  if (storyGrid) {
    storyGrid.style.display = 'none';
  }

  // Sembunyikan tombol 'Mulai Mengisi Formulir' ketika kartu pemilihan muncul
  if (ctaWrap) {
    ctaWrap.style.display = 'none';
  }

  // Tampilkan kotak pemilihan kategori langsung tepat di bawah foto gantung
  promptBox.style.display = 'block';
  promptBox.classList.remove('form-unfolded');
  void promptBox.offsetWidth; // Force DOM reflow
  promptBox.classList.add('form-unfolded');

  setTimeout(() => {
    const topOffset = promptBox.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  }, 90);
}

function closeRegistrationSelector() {
  const promptBox = document.getElementById('regTypePromptBox');
  const ctaWrap = document.getElementById('regisCtaWrapper');
  const formCard = document.getElementById('regFormCardContainer');
  const storyGrid = document.getElementById('storyContentGrid');

  if (promptBox) promptBox.style.display = 'none';
  if (formCard) formCard.style.display = 'none';

  // Tampilkan kembali deskripsi singkat dan tatacara pengisian
  if (storyGrid) {
    storyGrid.style.display = 'grid';
    storyGrid.classList.remove('animate-fade-in');
    void storyGrid.offsetWidth;
    storyGrid.classList.add('animate-fade-in');
  }

  // Tampilkan kembali tombol 'Mulai Mengisi Formulir'
  if (ctaWrap) {
    ctaWrap.style.display = 'flex';
    ctaWrap.classList.remove('animate-fade-in');
    void ctaWrap.offsetWidth;
    ctaWrap.classList.add('animate-fade-in');
  }

  const triggerBtn = document.getElementById('btnTriggerRegis');
  if (triggerBtn) {
    const topOffset = triggerBtn.getBoundingClientRect().top + window.pageYOffset - 120;
    window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  }
}

function resetToSelectionScreen() {
  const nativeSelect = document.getElementById('formCategorySelect');
  const formCard = document.getElementById('regFormCardContainer');
  const promptBox = document.getElementById('regTypePromptBox');
  const cardIndividu = document.getElementById('cardChoiceIndividu');
  const cardKelompok = document.getElementById('cardChoiceKelompok');

  if (nativeSelect) {
    nativeSelect.value = '';
  }
  registrationType = '';

  // Sembunyikan lembar form dan tampilkan kembali kartu pemilihan format kepesertaan
  if (cardIndividu) cardIndividu.classList.remove('is-selected');
  if (cardKelompok) cardKelompok.classList.remove('is-selected');
  if (formCard) formCard.style.display = 'none';

  if (promptBox) {
    promptBox.style.display = 'block';
    promptBox.classList.remove('form-unfolded');
    void promptBox.offsetWidth;
    promptBox.classList.add('form-unfolded');

    const topOffset = promptBox.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  }
}

function handleRegistrationTypeSelect(type) {
  const formCard = document.getElementById('regFormCardContainer');
  const guidelines = document.getElementById('guidelines-container');
  const indForm = document.getElementById('formIndividu');
  const grpForm = document.getElementById('formKelompok');
  const typeBadge = document.getElementById('selectedTypeBadge');
  const headerTitle = document.getElementById('rfHeaderTitle');
  const categorySelect = document.getElementById('formCategorySelect');
  const promptBox = document.getElementById('regTypePromptBox');
  const cardIndividu = document.getElementById('cardChoiceIndividu');
  const cardKelompok = document.getElementById('cardChoiceKelompok');
  const formStatusText = document.getElementById('formStatusText');

  // Pastikan guidelines tetap terlihat
  if (guidelines) guidelines.style.display = 'block';

  // Sinkronkan nilai dropdown tersembunyi
  if (categorySelect && type !== undefined && categorySelect.value !== type) {
    categorySelect.value = type;
  }

  if (type === 'individu') {
    registrationType = 'individu';
    
    // Otomatis sembunyikan kotak pemilihan kategori agar tinggal formulir saja di bawah foto
    if (promptBox) {
      promptBox.style.display = 'none';
    }

    // Highlight aktif pada kartu Individu
    if (cardIndividu) cardIndividu.classList.add('is-selected');
    if (cardKelompok) cardKelompok.classList.remove('is-selected');

    if (formStatusText) {
      formStatusText.innerHTML = 'Formulir Aktif: <strong>Pendaftaran Individu (Mandiri)</strong>';
    }
    if (formCard) {
      formCard.style.display = 'block';
      formCard.classList.remove('form-unfolded');
      void formCard.offsetWidth; // Force reflow for smooth animation
      formCard.classList.add('form-unfolded');
    }
    if (indForm) {
      indForm.style.display = 'block';
      indForm.classList.add('animate-fade-in');
      jumpToIndividuStep(1, true);
    }
    if (grpForm) grpForm.style.display = 'none';
    if (typeBadge) {
      typeBadge.innerHTML = '<i class="fa-solid fa-user-check"></i> Pendaftaran Individu (Mandiri)';
    }
    if (headerTitle) {
      headerTitle.textContent = 'Formulir Pendaftaran Peserta Individu';
    }

    // Scroll halus mengarahkan pandangan ke formulir aktif tepat di bawah foto
    setTimeout(() => {
      if (formCard) {
        const topOffset = formCard.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
      }
    }, 100);

  } else if (type === 'kelompok') {
    registrationType = 'kelompok';

    // Otomatis sembunyikan kotak pemilihan kategori agar tinggal formulir saja di bawah foto
    if (promptBox) {
      promptBox.style.display = 'none';
    }

    // Highlight aktif pada kartu Kelompok
    if (cardKelompok) cardKelompok.classList.add('is-selected');
    if (cardIndividu) cardIndividu.classList.remove('is-selected');

    if (formStatusText) {
      formStatusText.innerHTML = 'Formulir Aktif: <strong>Pendaftaran Kelompok (Kafilah / Rombongan)</strong>';
    }
    if (formCard) {
      formCard.style.display = 'block';
      formCard.classList.remove('form-unfolded');
      void formCard.offsetWidth; // Force reflow for smooth animation
      formCard.classList.add('form-unfolded');
    }
    if (grpForm) {
      grpForm.style.display = 'block';
      grpForm.classList.add('animate-fade-in');
      const container = document.getElementById('groupMembersContainer');
      if (container && container.children.length === 0) {
        initGroupMembers();
      }
    }
    if (indForm) indForm.style.display = 'none';
    if (typeBadge) {
      typeBadge.innerHTML = '<i class="fa-solid fa-users"></i> Pendaftaran Kelompok (Kafilah)';
    }
    if (headerTitle) {
      headerTitle.textContent = 'Formulir Pendaftaran Kafilah / Rombongan';
    }

    // Scroll halus mengarahkan pandangan ke formulir aktif tepat di bawah foto
    setTimeout(() => {
      if (formCard) {
        const topOffset = formCard.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
      }
    }, 100);

  } else {
    // Belum memilih jenis / Reset kembali ke tampilan awal
    registrationType = '';
    if (cardIndividu) cardIndividu.classList.remove('is-selected');
    if (cardKelompok) cardKelompok.classList.remove('is-selected');
    if (formCard) formCard.style.display = 'none';
    if (indForm) indForm.style.display = 'none';
    if (grpForm) grpForm.style.display = 'none';
  }
}

function quickFillMedical(targetId) {
  const el = document.getElementById(targetId);
  if (el) el.value = 'Tidak Ada (Alhamdulillah Sehat)';
}

// Global variable to hold pending registration data for preview modal (Model formkwpselindo)
let pendingRegistrationData = null;

function startFillForm() {
  openRegistrationSelector();
}

function toggleGuidelines(show) {
  const guidelines = document.getElementById('guidelines-container');
  if (guidelines) {
    guidelines.style.display = 'block';
    guidelines.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===================================================================
// PROGRESSIVE STEP WIZARD & ANSWER PREVIEW LOGIC (Form Individu)
// ===================================================================
let currentIndividuStep = 1;

function updateIndividuStepperUI(step) {
  for (let i = 1; i <= 4; i++) {
    const indicator = document.getElementById(`stepIndicator${i}`);
    if (indicator) {
      if (i < step) {
        indicator.classList.remove('active');
        indicator.classList.add('completed');
      } else if (i === step) {
        indicator.classList.add('active');
        indicator.classList.remove('completed');
      } else {
        indicator.classList.remove('active', 'completed');
      }
    }
  }

  for (let line = 1; line <= 3; line++) {
    const lineEl = document.getElementById(`stepLine${line}`);
    if (lineEl) {
      if (line < step) {
        lineEl.classList.add('completed');
      } else {
        lineEl.classList.remove('completed');
      }
    }
  }
}

function handleTransportArrivalChange() {
  const select = document.getElementById('ind_transportArrival');
  const wrap = document.getElementById('wrap_transportArrivalOther');
  const otherInput = document.getElementById('ind_transportArrivalOther');
  if (!select || !wrap) return;

  if (select.value === 'Lainnya') {
    wrap.style.display = 'block';
    if (otherInput) {
      setTimeout(() => otherInput.focus(), 60);
    }
  } else {
    wrap.style.display = 'none';
    if (otherInput) {
      otherInput.value = '';
    }
  }
}

function handleTransportDepartureChange() {
  const select = document.getElementById('ind_transportDeparture');
  const wrap = document.getElementById('wrap_transportDepartureOther');
  const otherInput = document.getElementById('ind_transportDepartureOther');
  if (!select || !wrap) return;

  if (select.value === 'Lainnya') {
    wrap.style.display = 'block';
    if (otherInput) {
      setTimeout(() => otherInput.focus(), 60);
    }
  } else {
    wrap.style.display = 'none';
    if (otherInput) {
      otherInput.value = '';
    }
  }
}

function handleGroupTransportChange() {
  const select = document.getElementById('grp_defaultTransport');
  const wrap = document.getElementById('wrap_grpDefaultTransportOther');
  const otherInput = document.getElementById('grp_defaultTransportOther');
  if (!select || !wrap) return;

  if (select.value === 'Lainnya') {
    wrap.style.display = 'block';
    if (otherInput) {
      setTimeout(() => otherInput.focus(), 60);
    }
  } else {
    wrap.style.display = 'none';
    if (otherInput) {
      otherInput.value = '';
    }
  }
}

let currentMedicalStatus = 'healthy';

function selectMedicalStatus(status) {
  currentMedicalStatus = status;
  const cardHealthy = document.getElementById('cardMedHealthy');
  const cardNotes = document.getElementById('cardMedNotes');
  const boxHealthy = document.getElementById('boxMedHealthy');
  const boxNotes = document.getElementById('boxMedNotes');
  const hiddenInput = document.getElementById('ind_medical');
  const detailInput = document.getElementById('ind_medical_detail');

  if (status === 'healthy') {
    if (cardHealthy) cardHealthy.classList.add('active');
    if (cardNotes) cardNotes.classList.remove('active');
    if (boxHealthy) boxHealthy.style.display = 'flex';
    if (boxNotes) boxNotes.style.display = 'none';
    if (hiddenInput) hiddenInput.value = 'Tidak Ada (Alhamdulillah Sehat)';
  } else {
    if (cardNotes) cardNotes.classList.add('active');
    if (cardHealthy) cardHealthy.classList.remove('active');
    if (boxHealthy) boxHealthy.style.display = 'none';
    if (boxNotes) boxNotes.style.display = 'block';
    syncMedicalDetailInput();
    if (detailInput) {
      setTimeout(() => detailInput.focus(), 80);
    }
  }
}

function addSymptomTag(tagName) {
  const detailInput = document.getElementById('ind_medical_detail');
  if (!detailInput) return;

  const currentVal = detailInput.value.trim();
  if (!currentVal) {
    detailInput.value = tagName;
  } else {
    const items = currentVal.split(',').map(s => s.trim().toLowerCase());
    if (!items.includes(tagName.toLowerCase())) {
      detailInput.value = currentVal + ', ' + tagName;
    }
  }
  syncMedicalDetailInput();
  detailInput.focus();
}

function syncMedicalDetailInput() {
  const detailInput = document.getElementById('ind_medical_detail');
  const hiddenInput = document.getElementById('ind_medical');
  if (!hiddenInput) return;

  if (currentMedicalStatus === 'healthy') {
    hiddenInput.value = 'Tidak Ada (Alhamdulillah Sehat)';
  } else {
    const text = detailInput ? detailInput.value.trim() : '';
    hiddenInput.value = text ? text : 'Ada Riwayat Sakit (Belum dirinci)';
  }
}

function handleIndividuAgeChange() {
  const ageInput = document.getElementById('ind_age');
  const alertBox = document.getElementById('ind_age_child_alert');
  const guardianRow = document.getElementById('ind_child_guardian_row');
  if (!ageInput) return;
  const age = parseInt(ageInput.value, 10);
  if (!isNaN(age) && age > 0 && age < 15) {
    if (alertBox) alertBox.style.display = 'block';
    if (guardianRow) guardianRow.style.display = 'block';
    populateRegisteredGuardiansDatalist();
  } else {
    if (alertBox) alertBox.style.display = 'none';
    if (guardianRow) guardianRow.style.display = 'none';
  }
}

function populateRegisteredGuardiansDatalist() {
  const datalist = document.getElementById('registeredGuardiansList');
  if (!datalist) return;
  datalist.innerHTML = '';

  const candidates = [];
  const seen = new Set();

  (allRegistrations || []).forEach(reg => {
    const name = (reg.full_name || reg.name || '').trim();
    if (!name || seen.has(name.toLowerCase())) return;

    const ageNum = parseInt(reg.age, 10);
    const isChild = reg.is_child || (!isNaN(ageNum) && ageNum > 0 && ageNum < 15);
    if (!isChild) {
      seen.add(name.toLowerCase());
      candidates.push(reg);
    }
  });

  candidates.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || '')).forEach(cand => {
    const opt = document.createElement('option');
    opt.value = cand.full_name;
    const detailParts = [];
    if (cand.region) detailParts.push(cand.region);
    if (cand.city) detailParts.push(cand.city);
    if (cand.registration_code) detailParts.push(cand.registration_code);
    opt.label = detailParts.join(' • ');
    datalist.appendChild(opt);
  });
}

function handleGuardianSelect(input) {
  if (!input) return;
  const val = input.value.trim().toLowerCase();
  if (!val) return;

  const matched = (allRegistrations || []).find(reg => {
    const name = (reg.full_name || reg.name || '').trim().toLowerCase();
    return name === val;
  });

  if (matched) {
    // Autofill wilayah & daerah
    const wilayahSelect = document.getElementById('ind_wilayah_select');
    if (wilayahSelect && matched.region) {
      wilayahSelect.value = matched.region;
    }
    const daerahInput = document.getElementById('ind_daerah');
    if (daerahInput && matched.city) {
      daerahInput.value = matched.city;
    }

    // Autofill jadwal & transportasi
    const arrDateInput = document.getElementById('ind_arrivalDate');
    if (arrDateInput && matched.arrival_date) {
      arrDateInput.value = matched.arrival_date;
    }
    const arrTimeInput = document.getElementById('ind_arrivalTime');
    if (arrTimeInput && matched.arrival_time) {
      arrTimeInput.value = matched.arrival_time;
    }
    const arrTransInput = document.getElementById('ind_transportArrival');
    if (arrTransInput && matched.arrival_transport) {
      arrTransInput.value = matched.arrival_transport;
    }

    const depDateInput = document.getElementById('ind_departureDate');
    if (depDateInput && matched.departure_date) {
      depDateInput.value = matched.departure_date;
    }
    const depTimeInput = document.getElementById('ind_departureTime');
    if (depTimeInput && matched.departure_time) {
      depTimeInput.value = matched.departure_time;
    }
    const depTransInput = document.getElementById('ind_transportDeparture');
    if (depTransInput && matched.departure_transport) {
      depTransInput.value = matched.departure_transport;
    }

    showToast(`Data wilayah, kedatangan & kepulangan otomatis disinkronkan dari Orang Tua/Wali: ${matched.full_name}`, 'success');
  }
}
window.handleGuardianSelect = handleGuardianSelect;
window.populateRegisteredGuardiansDatalist = populateRegisteredGuardiansDatalist;

function validateIndividuStep(step) {
  if (step === 1) {
    const fullName = document.getElementById('ind_fullName')?.value.trim();
    if (!fullName) {
      showToast('Mohon lengkapi nama lengkap sesuai tanda pengenal.', 'error');
      document.getElementById('ind_fullName')?.focus();
      return false;
    }
    const rawAge = document.getElementById('ind_age')?.value;
    const parsedAge = parseInt(rawAge || '0', 10);
    if (!rawAge || isNaN(parsedAge) || parsedAge <= 0) {
      showToast('Mohon cantumkan usia Anda (dalam angka tahun).', 'error');
      document.getElementById('ind_age')?.focus();
      return false;
    }
    const wilayah = document.getElementById('ind_wilayah_select')?.value.trim();
    if (!wilayah) {
      showToast('Mohon pilih wilayah asal kafilah Anda.', 'error');
      document.getElementById('ind_wilayah_select')?.focus();
      return false;
    }
    const daerah = document.getElementById('ind_daerah')?.value.trim();
    if (!daerah) {
      showToast('Mohon lengkapi nama daerah (kota/kabupaten) asal kafilah Anda.', 'error');
      document.getElementById('ind_daerah')?.focus();
      return false;
    }
    const email = document.getElementById('ind_email')?.value.trim();
    if (!email) {
      showToast('Mohon cantumkan alamat email untuk pengiriman E-Tiket.', 'error');
      document.getElementById('ind_email')?.focus();
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Format alamat email belum tepat (contoh: nama@domain.com).', 'error');
      document.getElementById('ind_email')?.focus();
      return false;
    }
    const phone = document.getElementById('ind_phone')?.value.trim();
    if (!phone) {
      showToast('Mohon cantumkan nomor WhatsApp / HP aktif.', 'error');
      document.getElementById('ind_phone')?.focus();
      return false;
    }
    const emergencyPhone = document.getElementById('ind_emergencyPhone')?.value.trim();
    if (!emergencyPhone) {
      showToast('Mohon cantumkan nomor HP darurat (keluarga).', 'error');
      document.getElementById('ind_emergencyPhone')?.focus();
      return false;
    }
    return true;
  }

  if (step === 2) {
    const arrivalDate = document.getElementById('ind_arrivalDate')?.value;
    if (!arrivalDate) {
      showToast('Mohon tentukan tanggal rencana kedatangan.', 'error');
      document.getElementById('ind_arrivalDate')?.focus();
      return false;
    }
    const transportArrival = document.getElementById('ind_transportArrival')?.value;
    if (!transportArrival) {
      showToast('Mohon pilih armada kendaraan keberangkatan/kedatangan.', 'error');
      document.getElementById('ind_transportArrival')?.focus();
      return false;
    }
    if (transportArrival === 'Lainnya') {
      const otherArrival = document.getElementById('ind_transportArrivalOther')?.value.trim();
      if (!otherArrival) {
        showToast('Mohon sebutkan jenis kendaraan berangkat lainnya yang digunakan.', 'error');
        document.getElementById('ind_transportArrivalOther')?.focus();
        return false;
      }
    }
    const departureDate = document.getElementById('ind_departureDate')?.value;
    if (!departureDate) {
      showToast('Mohon tentukan tanggal rencana kepulangan.', 'error');
      document.getElementById('ind_departureDate')?.focus();
      return false;
    }
    const transportDeparture = document.getElementById('ind_transportDeparture')?.value;
    if (!transportDeparture) {
      showToast('Mohon pilih armada kendaraan kepulangan.', 'error');
      document.getElementById('ind_transportDeparture')?.focus();
      return false;
    }
    if (transportDeparture === 'Lainnya') {
      const otherDeparture = document.getElementById('ind_transportDepartureOther')?.value.trim();
      if (!otherDeparture) {
        showToast('Mohon sebutkan jenis kendaraan pulang lainnya yang digunakan.', 'error');
        document.getElementById('ind_transportDepartureOther')?.focus();
        return false;
      }
    }
    return true;
  }

  if (step === 3) {
    const clothEl = document.querySelector('input[name="ind_clothSize"]:checked');
    if (!clothEl) {
      showToast('Mohon pilih ukuran seragam kaos resmi Anda.', 'error');
      return false;
    }
    if (currentMedicalStatus === 'has_notes') {
      const detail = document.getElementById('ind_medical_detail')?.value.trim();
      if (!detail) {
        showToast('Mohon tuliskan rincian riwayat penyakit / obat yang dibawa atau pilih opsi Alhamdulillah Sehat.', 'error');
        document.getElementById('ind_medical_detail')?.focus();
        return false;
      }
      document.getElementById('ind_medical').value = detail;
    } else {
      document.getElementById('ind_medical').value = 'Tidak Ada (Alhamdulillah Sehat)';
    }
    return true;
  }

  return true;
}

function nextIndividuStep(targetStep) {
  if (targetStep > currentIndividuStep) {
    if (!validateIndividuStep(currentIndividuStep)) {
      return;
    }
  }

  if (targetStep === 4) {
    renderIndividuStepPreview();
  }

  for (let i = 1; i <= 4; i++) {
    const pane = document.getElementById(`indStepPane${i}`);
    if (pane) pane.style.display = (i === targetStep) ? 'block' : 'none';
  }

  currentIndividuStep = targetStep;
  updateIndividuStepperUI(currentIndividuStep);

  const formCard = document.getElementById('regFormCardContainer');
  if (formCard) {
    const topOffset = formCard.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  }
}

function prevIndividuStep(targetStep) {
  for (let i = 1; i <= 4; i++) {
    const pane = document.getElementById(`indStepPane${i}`);
    if (pane) pane.style.display = (i === targetStep) ? 'block' : 'none';
  }

  currentIndividuStep = targetStep;
  updateIndividuStepperUI(currentIndividuStep);

  const formCard = document.getElementById('regFormCardContainer');
  if (formCard) {
    const topOffset = formCard.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  }
}

function jumpToIndividuStep(targetStep, bypassValidation = false) {
  if (bypassValidation) {
    for (let i = 1; i <= 4; i++) {
      const pane = document.getElementById(`indStepPane${i}`);
      if (pane) pane.style.display = (i === targetStep) ? 'block' : 'none';
    }
    currentIndividuStep = targetStep;
    updateIndividuStepperUI(currentIndividuStep);
    return;
  }

  if (targetStep < currentIndividuStep) {
    for (let i = 1; i <= 4; i++) {
      const pane = document.getElementById(`indStepPane${i}`);
      if (pane) pane.style.display = (i === targetStep) ? 'block' : 'none';
    }
    currentIndividuStep = targetStep;
    updateIndividuStepperUI(currentIndividuStep);

    const formCard = document.getElementById('regFormCardContainer');
    if (formCard) {
      const topOffset = formCard.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
    return;
  }

  if (targetStep > currentIndividuStep) {
    for (let s = currentIndividuStep; s < targetStep; s++) {
      if (!validateIndividuStep(s)) {
        return;
      }
    }

    if (targetStep === 4) {
      renderIndividuStepPreview();
    }

    for (let i = 1; i <= 4; i++) {
      const pane = document.getElementById(`indStepPane${i}`);
      if (pane) pane.style.display = (i === targetStep) ? 'block' : 'none';
    }
    currentIndividuStep = targetStep;
    updateIndividuStepperUI(currentIndividuStep);

    const formCard = document.getElementById('regFormCardContainer');
    if (formCard) {
      const topOffset = formCard.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  }
}

function renderIndividuStepPreview() {
  const container = document.getElementById('indPreviewSummaryContainer');
  if (!container) return;

  const fullName = document.getElementById('ind_fullName')?.value.trim() || '-';
  const rawAge = document.getElementById('ind_age')?.value;
  const age = parseInt(rawAge || '0', 10);
  const isChild = age > 0 && age < 15;
  const genderEl = document.querySelector('input[name="ind_gender"]:checked');
  const gender = genderEl ? genderEl.value : '-';
  const wilayah = document.getElementById('ind_wilayah_select')?.value.trim() || '-';
  const daerah = document.getElementById('ind_daerah')?.value.trim() || '-';
  const email = document.getElementById('ind_email')?.value.trim() || '-';
  const phone = document.getElementById('ind_phone')?.value.trim() || '-';
  const emergencyPhone = document.getElementById('ind_emergencyPhone')?.value.trim() || '-';

  const arrivalDate = document.getElementById('ind_arrivalDate')?.value || '';
  const arrivalTime = document.getElementById('ind_arrivalTime')?.value || '10:00';
  const rawArrival = document.getElementById('ind_transportArrival')?.value || '-';
  const otherArrival = document.getElementById('ind_transportArrivalOther')?.value.trim();
  const transportArrival = (rawArrival === 'Lainnya' && otherArrival) ? `Lainnya (${otherArrival})` : rawArrival;

  const departureDate = document.getElementById('ind_departureDate')?.value || '';
  const departureTime = document.getElementById('ind_departureTime')?.value || '16:00';
  const rawDeparture = document.getElementById('ind_transportDeparture')?.value || '-';
  const otherDeparture = document.getElementById('ind_transportDepartureOther')?.value.trim();
  const transportDeparture = (rawDeparture === 'Lainnya' && otherDeparture) ? `Lainnya (${otherDeparture})` : rawDeparture;

  const clothEl = document.querySelector('input[name="ind_clothSize"]:checked');
  const clothSize = clothEl ? clothEl.value : 'L';
  const medical = document.getElementById('ind_medical')?.value.trim() || 'Tidak Ada (Sehat)';
  const notes = document.getElementById('ind_notes')?.value.trim() || '';

  container.innerHTML = `
    <div class="summary-preview-notice">
      <i class="fa-solid fa-circle-check"></i>
      <div>
        <strong>Pemeriksaan Jawaban Terakhir</strong><br>
        Seluruh data telah divalidasi. Mohon pastikan kebenaran informasi di bawah ini sebelum mengirimkan pendaftaran untuk penerbitan E-Tiket resmi.
      </div>
    </div>

    <!-- Block 1: Identitas Diri & Kontak -->
    <div class="summary-block-card">
      <div class="summary-block-head">
        <span class="summary-block-title">
          <i class="fa-solid fa-id-card-clip"></i> 1. Identitas & Kontak Diri
        </span>
        <button type="button" class="btn-edit-step" onclick="jumpToIndividuStep(1)">
          <i class="fa-solid fa-pen-to-square"></i> Ubah Data
        </button>
      </div>
      <div class="summary-block-grid">
        <div class="summary-field-item">
          <span class="summary-field-label">Nama Lengkap</span>
          <span class="summary-field-value"><strong>${escapeHtml(fullName)}</strong></span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Usia & Kategori</span>
          <span class="summary-field-value ${isChild ? 'highlight-amber' : ''}">
            <strong>${age > 0 ? age + ' Tahun' : '-'}</strong>
            ${isChild ? '<span style="font-size: 11px; padding: 2px 7px; background: rgba(245, 158, 11, 0.2); border-radius: 4px; color: #b45309; font-weight: 700; margin-left: 5px;"><i class="fa-solid fa-child"></i> Anak-anak</span>' : (age >= 15 ? '<span style="font-size: 11px; color: #64748b; margin-left: 5px;">(Dewasa)</span>' : '')}
          </span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Jenis Kelamin</span>
          <span class="summary-field-value badge-pill-val"><i class="fa-solid ${gender === 'Laki-laki' ? 'fa-mars' : 'fa-venus'}"></i> ${escapeHtml(gender)}</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Wilayah Asal Kafilah</span>
          <span class="summary-field-value">${escapeHtml(wilayah)}</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Daerah Asal Kafilah</span>
          <span class="summary-field-value">${escapeHtml(daerah)}</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Alamat Email</span>
          <span class="summary-field-value">${escapeHtml(email)}</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">No. WhatsApp / HP Aktif</span>
          <span class="summary-field-value">${escapeHtml(phone)}</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">No. HP Darurat (Keluarga)</span>
          <span class="summary-field-value highlight-amber"><i class="fa-solid fa-phone-volume"></i> ${escapeHtml(emergencyPhone)}</span>
        </div>
      </div>
    </div>

    <!-- Block 2: Jadwal & Transportasi -->
    <div class="summary-block-card">
      <div class="summary-block-head">
        <span class="summary-block-title">
          <i class="fa-solid fa-calendar-days"></i> 2. Jadwal & Transportasi
        </span>
        <button type="button" class="btn-edit-step" onclick="jumpToIndividuStep(2)">
          <i class="fa-solid fa-pen-to-square"></i> Ubah Data
        </button>
      </div>
      <div class="summary-block-grid">
        <div class="summary-field-item">
          <span class="summary-field-label">Rencana Kedatangan</span>
          <span class="summary-field-value">${formatDateIndo(arrivalDate)} (Pukul ${arrivalTime} WIB)</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Kendaraan Tiba</span>
          <span class="summary-field-value badge-pill-val"><i class="fa-solid fa-van-shuttle"></i> ${escapeHtml(transportArrival)}</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Rencana Kepulangan</span>
          <span class="summary-field-value">${formatDateIndo(departureDate)} (Pukul ${departureTime} WIB)</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Kendaraan Pulang</span>
          <span class="summary-field-value badge-pill-val"><i class="fa-solid fa-van-shuttle"></i> ${escapeHtml(transportDeparture)}</span>
        </div>
      </div>
    </div>

    <!-- Block 3: Ukuran Baju & Medis -->
    <div class="summary-block-card">
      <div class="summary-block-head">
        <span class="summary-block-title">
          <i class="fa-solid fa-shirt"></i> 3. Ukuran Baju & Riwayat Medis
        </span>
        <button type="button" class="btn-edit-step" onclick="jumpToIndividuStep(3)">
          <i class="fa-solid fa-pen-to-square"></i> Ubah Data
        </button>
      </div>
      <div class="summary-block-grid">
        <div class="summary-field-item">
          <span class="summary-field-label">Ukuran Baju Seragam</span>
          <span class="summary-field-value badge-cloth-val">${escapeHtml(clothSize)}</span>
        </div>
        <div class="summary-field-item">
          <span class="summary-field-label">Riwayat Kesehatan & Obat Rutin</span>
          <span class="summary-field-value">${escapeHtml(medical)}</span>
        </div>
        <div class="summary-field-item full-width">
          <span class="summary-field-label">Catatan Tambahan</span>
          <span class="summary-field-value" style="color: ${notes ? '#193222' : '#8c806d'}; font-style: ${notes ? 'normal' : 'italic'};">
            ${notes ? escapeHtml(notes) : 'Tidak ada catatan tambahan khusus'}
          </span>
        </div>
      </div>
    </div>
  `;
}

// ===================================================================
// SISTEM ANTI-DUPLIKAT & NOMOR REGISTRASI RESMI
// ===================================================================
function normalizePhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.substring(2);
  }
  return cleaned;
}

function checkDuplicateRegistration({ full_name, phone_number, wilayah, is_child, excludeId = null }) {
  if (!allRegistrations || !allRegistrations.length) return null;

  const targetName = (full_name || '').trim().toLowerCase();
  const targetPhone = normalizePhoneNumber(phone_number);
  const targetWilayah = (wilayah || '').trim().toLowerCase();

  for (const reg of allRegistrations) {
    if (excludeId && String(reg.id) === String(excludeId)) continue;

    const existingName = (reg.full_name || '').trim().toLowerCase();
    const existingPhone = normalizePhoneNumber(reg.phone_number);
    const existingWilayah = (reg.wilayah || '').trim().toLowerCase();
    const existingIsChild = reg.is_child || (reg.age && parseInt(reg.age, 10) < 15);

    // Kriteria 1: Untuk dewasa (bukan anak-anak), nomor WhatsApp sama persis
    if (!is_child && !existingIsChild && targetPhone && existingPhone && targetPhone.length >= 8 && targetPhone === existingPhone) {
      return {
        matchedBy: 'phone',
        message: `Nomor WhatsApp ${phone_number} sudah terdaftar atas nama "${reg.full_name}".`,
        existing: reg
      };
    }

    // Kriteria 2: Nama Lengkap sama di Wilayah yang sama
    if (targetName && existingName && targetName === existingName) {
      if (!targetWilayah || !existingWilayah || targetWilayah === existingWilayah) {
        return {
          matchedBy: 'name_wilayah',
          message: `Peserta dengan nama "${reg.full_name}" dari kafilah "${reg.wilayah}" sudah terdaftar sebelumnya.`,
          existing: reg
        };
      }
    }
  }

  return null;
}

function showDuplicateModal(duplicateInfo) {
  const reg = duplicateInfo.existing;
  const modal = document.getElementById('duplicateAlertModal');
  if (modal) {
    const elReason = document.getElementById('dupModalReason');
    const elCode = document.getElementById('dupModalCode');
    const elName = document.getElementById('dupModalName');
    const elWilayah = document.getElementById('dupModalWilayah');
    const elType = document.getElementById('dupModalType');

    if (elReason) elReason.textContent = duplicateInfo.message;
    if (elCode) elCode.textContent = reg.registration_code || '-';
    if (elName) elName.textContent = reg.full_name || '-';
    if (elWilayah) elWilayah.textContent = reg.wilayah || '-';
    if (elType) elType.textContent = (reg.registration_type || 'Individu').toUpperCase();

    const btnViewTicket = document.getElementById('btnDupViewTicket');
    if (btnViewTicket) {
      btnViewTicket.onclick = () => {
        modal.classList.remove('active');
        showTicketModal(reg);
      };
    }
    modal.classList.add('active');
  } else {
    if (confirm(`${duplicateInfo.message}\n\nNomor Registrasi: ${reg.registration_code}\n\nApakah Anda ingin membuka E-Tiket yang sudah terdaftar?`)) {
      showTicketModal(reg);
    }
  }
}

function closeDuplicateModal() {
  const modal = document.getElementById('duplicateAlertModal');
  if (modal) modal.classList.remove('active');
}

function autoAllocateRoomAndGroup(gender = 'Laki-laki', isChild = false, guardianName = '', contextBatch = []) {
  // 1. Anak di bawah umur (< 15 th): Tidak masuk kelompok, kamar ikut orang tua/wali
  if (isChild) {
    let parentRoom = '';
    // Cek di context batch terlebih dahulu (jika rombongan satu keluarga didaftarkan bersamaan)
    if (guardianName && Array.isArray(contextBatch) && contextBatch.length > 0) {
      const parentInBatch = contextBatch.find(b => 
        b.full_name && b.full_name.trim().toLowerCase() === guardianName.trim().toLowerCase()
      );
      if (parentInBatch && (parentInBatch.room_number || parentInBatch.kamar)) {
        parentRoom = parentInBatch.room_number || parentInBatch.kamar;
      }
    }
    // Jika belum ketemu di batch, cek di database allRegistrations
    if (!parentRoom && guardianName && typeof allRegistrations !== 'undefined' && Array.isArray(allRegistrations)) {
      const parent = allRegistrations.find(a => 
        a.full_name && a.full_name.trim().toLowerCase() === guardianName.trim().toLowerCase()
      );
      if (parent && (parent.room_number || parent.kamar)) {
        parentRoom = parent.room_number || parent.kamar;
      }
    }

    if (!parentRoom) {
      parentRoom = 'Ikut Ortu';
    }

    return {
      group_name: '-',
      group_code: '-',
      room_number: parentRoom,
      room_name: parentRoom === 'Ikut Ortu' ? 'Kamar Orang Tua' : `Kamar ${parentRoom} (Ikut Ortu)`,
      building: 'Ikut Orang Tua'
    };
  }

  // 2. Dewasa (Ikhwan vs Akhwat)
  const isAkhwat = String(gender).toLowerCase().includes('perempuan') || 
                   String(gender).toLowerCase().includes('akhwat') || 
                   String(gender).toLowerCase() === 'p';
  const targetGender = isAkhwat ? 'akhwat' : 'ikhwan';

  // Master Rooms (Alokasi Kamar Sesuai Gender & Kapasitas Kasur)
  const allRooms = (typeof getMasterRooms === 'function') ? getMasterRooms() : DEFAULT_ROOMS;
  const filteredRooms = allRooms.filter(r => r.gender_type === targetGender || r.gender_type === 'umum' || r.gender_type === 'campur');
  const poolRooms = filteredRooms.length > 0 ? filteredRooms : allRooms;

  // Hitung keterisian kasur setiap kamar (termasuk anak-anak yang ikut ortu di kamar tersebut)
  const combinedRegs = [
    ...(typeof allRegistrations !== 'undefined' && Array.isArray(allRegistrations) ? allRegistrations : []),
    ...(Array.isArray(contextBatch) ? contextBatch : [])
  ];

  const getOccupancy = (roomNum) => {
    const numStr = String(roomNum).trim().toLowerCase();
    return combinedRegs.filter(p => {
      const pRoom = String(p.room_number || p.kamar || '').trim().toLowerCase();
      if (pRoom === numStr) return true;
      if (p.is_child && p.guardian_name) {
        const parent = combinedRegs.find(a => a.full_name && a.full_name.trim().toLowerCase() === p.guardian_name.trim().toLowerCase());
        if (parent && String(parent.room_number || parent.kamar).trim().toLowerCase() === numStr) {
          return true;
        }
      }
      return false;
    }).length;
  };

  // Prioritaskan kamar yang kuotanya masih tersedia (anak tetap memotong kuota kasur)
  const availableRooms = poolRooms.filter(r => {
    const cap = parseInt(r.capacity, 10) || 4;
    return getOccupancy(r.room_number) < cap;
  });

  const finalPool = availableRooms.length > 0 ? availableRooms : poolRooms;
  const pickedRoom = finalPool[Math.floor(Math.random() * finalPool.length)] || {
    room_number: isAkhwat ? '04' : '01',
    room_name: isAkhwat ? 'Asrama Akhwat' : 'Asrama Ikhwan',
    building: 'Gedung Utama'
  };

  // Master Groups (Acak Kelompok Sesuai Gender)
  const allGroups = (typeof getMasterGroups === 'function') ? getMasterGroups() : DEFAULT_GROUPS;
  const filteredGroups = allGroups.filter(g => g.gender_type === targetGender || g.gender_type === 'campur' || g.gender_type === 'umum');
  const poolGroups = filteredGroups.length > 0 ? filteredGroups : allGroups;
  const pickedGroup = poolGroups[Math.floor(Math.random() * poolGroups.length)] || {
    group_code: isAkhwat ? 'B201' : 'A123',
    group_name: isAkhwat ? 'Kafilah Khadijah' : 'Kafilah Al-Fatih'
  };

  return {
    group_name: pickedGroup.group_name || pickedGroup.group_code || (isAkhwat ? 'B201' : 'A123'),
    group_code: pickedGroup.group_code || pickedGroup.group_name || (isAkhwat ? 'B201' : 'A123'),
    room_number: pickedRoom.room_number || (isAkhwat ? '04' : '01'),
    room_name: pickedRoom.room_name || `Kamar ${pickedRoom.room_number}`,
    building: pickedRoom.building || 'Gedung Utama'
  };
}

function generateRegistrationCode(type = 'individu', index = 0) {
  const existingCount = (allRegistrations ? allRegistrations.length : 0) + 1 + index;
  const seq = String(existingCount).padStart(3, '0');
  return `PKB-${seq}`;
}

async function handleIndividuFinalSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  if (isRegistrationLocked) {
    showToast('Pendaftaran telah ditutup sesuai batas waktu yang ditentukan.', 'error');
    return;
  }

  // Validate all previous steps sequentially
  if (!validateIndividuStep(1)) {
    jumpToIndividuStep(1);
    return;
  }
  if (!validateIndividuStep(2)) {
    jumpToIndividuStep(2);
    return;
  }
  if (!validateIndividuStep(3)) {
    jumpToIndividuStep(3);
    return;
  }

  const submitBtn = document.getElementById('indFinalSubmitBtn');
  let originalBtnHtml = '';
  if (submitBtn) {
    originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan Pendaftaran...';
  }

  try {
    const fullName = document.getElementById('ind_fullName').value.trim();
    const rawAge = document.getElementById('ind_age')?.value;
    const age = parseInt(rawAge || '0', 10);
    const isChild = age > 0 && age < 15;
    const genderEl = document.querySelector('input[name="ind_gender"]:checked');
    const gender = genderEl ? genderEl.value : 'Laki-laki';
    const rawWilayah = document.getElementById('ind_wilayah_select')?.value || '';
    const wilayah = normalizeWilayahName(rawWilayah);
    const daerah = document.getElementById('ind_daerah')?.value.trim() || '';
    const email = document.getElementById('ind_email')?.value.trim() || '';
    const phone = document.getElementById('ind_phone').value.trim();
    const emergencyPhone = document.getElementById('ind_emergencyPhone')?.value.trim() || '';
    const arrivalDate = document.getElementById('ind_arrivalDate').value;
    const arrivalTime = document.getElementById('ind_arrivalTime').value || '10:00';
    const departureDate = document.getElementById('ind_departureDate').value;
    const departureTime = document.getElementById('ind_departureTime').value || '16:00';
    const rawArrival = document.getElementById('ind_transportArrival').value;
    const otherArrival = document.getElementById('ind_transportArrivalOther')?.value.trim();
    const transportArrival = (rawArrival === 'Lainnya' && otherArrival) ? `Lainnya: ${otherArrival}` : rawArrival;

    const rawDeparture = document.getElementById('ind_transportDeparture').value;
    const otherDeparture = document.getElementById('ind_transportDepartureOther')?.value.trim();
    const transportDeparture = (rawDeparture === 'Lainnya' && otherDeparture) ? `Lainnya: ${otherDeparture}` : rawDeparture;

    const clothEl = document.querySelector('input[name="ind_clothSize"]:checked');
    const clothSize = clothEl ? clothEl.value : 'L';
    const medical = document.getElementById('ind_medical').value.trim();
    const notes = document.getElementById('ind_notes').value.trim();

    // CEK DATA DUPLIKAT SEBELUM SIMPAN (ANTI-DUPLIKASI)
    const duplicateCheck = checkDuplicateRegistration({
      full_name: fullName,
      phone_number: phone,
      wilayah: wilayah,
      is_child: isChild
    });

    if (duplicateCheck) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
      showDuplicateModal(duplicateCheck);
      return;
    }

    // Generate Nomor Registrasi Resmi Unik
    const regCode = generateRegistrationCode('individu');

    // Auto-alokasi Kamar & Kelompok secara cerdas & acak sesuai gender
    const alloc = autoAllocateRoomAndGroup(gender, isChild, document.getElementById('ind_guardianName')?.value.trim() || null);

    const registrationPayload = {
      registration_code: regCode,
      registration_type: 'individu',
      group_name: alloc.group_name,
      group_code: alloc.group_code,
      group_leader_name: '',
      room_number: alloc.room_number,
      room_name: alloc.room_name,
      building: alloc.building,
      full_name: fullName,
      age: age > 0 ? age : null,
      is_child: isChild,
      guardian_name: isChild ? (document.getElementById('ind_guardianName')?.value.trim() || null) : null,
      gender: gender,
      wilayah: wilayah,
      daerah: daerah,
      email: email,
      phone_number: phone,
      emergency_phone: emergencyPhone,
      arrival_date: arrivalDate,
      arrival_time: arrivalTime,
      departure_date: departureDate,
      departure_time: departureTime,
      transport_arrival: transportArrival,
      transport_departure: transportDeparture,
      cloth_size: clothSize,
      medical_history: medical || 'Tidak Ada (Sehat)',
      notes: notes
    };

    const saved = await window.dataService.addRegistration(registrationPayload);

    if (window.confetti) {
      window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    }

    showToast(`Alhamdulillah! Pendaftaran berhasil dengan No. Registrasi: ${saved.registration_code}`, 'success');
    document.getElementById('formIndividu').reset();
    setDefaultDates();
    selectMedicalStatus('healthy');
    const detailMed = document.getElementById('ind_medical_detail');
    if (detailMed) detailMed.value = '';
    const wrapArrOther = document.getElementById('wrap_transportArrivalOther');
    if (wrapArrOther) wrapArrOther.style.display = 'none';
    const wrapDepOther = document.getElementById('wrap_transportDepartureOther');
    if (wrapDepOther) wrapDepOther.style.display = 'none';
    jumpToIndividuStep(1, true);

    // Show official E-Tiket Modal
    showTicketModal(saved);

    // Refresh data rekap
    await loadAndRenderRegistrations();
  } catch (err) {
    showToast('Terjadi kendala saat menyimpan pendaftaran: ' + err.message, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  }
}

// 1. PRATINJAU REGISTRASI INDIVIDU (Modal Fallback)
function handleIndividuPreview(e) {
  if (e && e.preventDefault) e.preventDefault();
  jumpToIndividuStep(4);
}

// 2. PRATINJAU REGISTRASI KELOMPOK (Model formkwpselindo)
function handleKelompokPreview(e) {
  e.preventDefault();
  if (isRegistrationLocked) {
    showToast('Pendaftaran telah ditutup sesuai batas waktu yang ditentukan.', 'error');
    return;
  }

  const memberCards = document.querySelectorAll('.member-card');
  if (memberCards.length === 0) {
    showToast('Harap tambahkan minimal 1 anggota rombongan.', 'error');
    return;
  }

  const groupName = document.getElementById('grp_name').value.trim();
  const groupLeader = document.getElementById('grp_leader').value.trim();
  const groupEmail = document.getElementById('grp_email')?.value.trim() || '';
  const leaderPhone = document.getElementById('grp_leaderPhone').value.trim();
  const defaultWilayahRaw = document.getElementById('grp_defaultWilayah')?.value || '';
  const defaultWilayah = normalizeWilayahName(defaultWilayahRaw);
  const defaultDaerah = (document.getElementById('grp_defaultDaerah')?.value || '').trim() || defaultWilayah;

  if (!defaultWilayah) {
    showToast('Harap pilih Wilayah Asal kafilah rombongan.', 'warning');
    document.getElementById('grp_defaultWilayah')?.focus();
    return;
  }
  if (!defaultDaerah) {
    showToast('Harap isi Daerah Asal (Kota / Kabupaten) rombongan.', 'warning');
    document.getElementById('grp_defaultDaerah')?.focus();
    return;
  }

  const defaultArrival = document.getElementById('grp_defaultArrival').value;
  const defaultDeparture = document.getElementById('grp_defaultDeparture').value;
  const defaultTransportSelect = document.getElementById('grp_defaultTransport').value;
  let defaultTransport = defaultTransportSelect;
  if (defaultTransportSelect === 'Lainnya') {
    const otherVal = document.getElementById('grp_defaultTransportOther')?.value.trim();
    if (!otherVal) {
      showToast('Harap sebutkan jenis armada/kendaraan lainnya untuk rombongan.', 'warning');
      document.getElementById('grp_defaultTransportOther')?.focus();
      return;
    }
    defaultTransport = `Lainnya (${otherVal})`;
  }

  const batchRecords = [];
  const year = new Date().getFullYear();
  const baseCode = Math.floor(1000 + Math.random() * 9000);

  let membersRowsHtml = '';
  const seenTableNames = new Set();

  for (let idx = 0; idx < memberCards.length; idx++) {
    const card = memberCards[idx];
    const name = card.querySelector('.grp-member-name').value.trim();
    if (!name) {
      showToast(`Mohon isi nama lengkap untuk baris ke-${idx + 1}.`, 'warning');
      card.querySelector('.grp-member-name').focus();
      return;
    }

    // 1. Cek duplikasi nama di dalam tabel rombongan ini
    const lowerName = name.toLowerCase();
    if (seenTableNames.has(lowerName)) {
      showToast(`Nama "${name}" terdaftar lebih dari satu kali di tabel rombongan (baris ke-${idx + 1}). Mohon periksa kembali.`, 'error');
      card.querySelector('.grp-member-name').focus();
      return;
    }
    seenTableNames.add(lowerName);

    const rawAge = card.querySelector('.grp-member-age')?.value;
    const age = parseInt(rawAge || '0', 10);
    if (!rawAge || isNaN(age) || age <= 0) {
      showToast(`Mohon cantumkan usia untuk peserta "${name}" (baris ke-${idx + 1}).`, 'warning');
      card.querySelector('.grp-member-age')?.focus();
      return;
    }
    const isChild = age > 0 && age < 15;

    const genderSelect = card.querySelector('.grp-member-gender');
    const genderRadio = card.querySelector('input[type="radio"]:checked');
    const gender = genderSelect ? genderSelect.value : (genderRadio ? genderRadio.value : 'Laki-laki');
    const cloth = card.querySelector('.grp-member-cloth').value;
    const med = card.querySelector('.grp-member-med').value.trim();
    const phone = card.querySelector('.grp-member-phone').value.trim() || leaderPhone;

    // 2. Cek duplikasi dengan data peserta yang sudah ada di sistem
    const dupCheck = checkDuplicateRegistration({
      full_name: name,
      phone_number: phone,
      wilayah: defaultWilayah,
      daerah: defaultDaerah,
      is_child: isChild
    });

    if (dupCheck) {
      showToast(`Peserta "${name}" (baris ke-${idx + 1}) sudah pernah terdaftar sebelumnya dengan Nomor Registrasi: ${dupCheck.existing.registration_code}.`, 'error');
      card.querySelector('.grp-member-name').focus();
      return;
    }

    const guardianSelect = card.querySelector('.grp-member-guardian');
    const guardianName = (isChild && guardianSelect) ? guardianSelect.value.trim() : '';

    const code = generateRegistrationCode('kelompok', idx);
    const alloc = autoAllocateRoomAndGroup(gender, isChild, guardianName, batchRecords);

    batchRecords.push({
      registration_code: code,
      registration_type: 'kelompok',
      group_name: groupName,
      group_code: alloc.group_code,
      group_leader_name: groupLeader,
      room_number: alloc.room_number,
      room_name: alloc.room_name,
      building: alloc.building,
      full_name: name,
      age: age > 0 ? age : null,
      is_child: isChild,
      guardian_name: guardianName || null,
      gender: gender,
      wilayah: defaultWilayah,
      daerah: defaultDaerah,
      arrival_date: defaultArrival,
      arrival_time: '12:00',
      departure_date: defaultDeparture,
      departure_time: '14:00',
      transport_arrival: defaultTransport,
      transport_departure: defaultTransport,
      cloth_size: cloth,
      medical_history: med || 'Tidak Ada',
      phone_number: phone,
      email: groupEmail || null,
      notes: `Rombongan: ${groupName} (Ketua: ${groupLeader})${guardianName ? ' • Ikut Ortu: ' + guardianName : ''}`
    });

    membersRowsHtml += `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td>
          <strong>${escapeHtml(name)}</strong>
          ${isChild ? `
            <div style="font-size: 11.5px; color: #fbbf24; margin-top: 3px;">
              <i class="fa-solid fa-child"></i> Anak (${age} th)
              ${guardianName ? ` &bull; <span style="color: #38bdf8;"><i class="fa-solid fa-people-roof"></i> Ikut Kamar: <strong>${escapeHtml(guardianName)}</strong></span>` : ''}
            </div>
          ` : ''}
        </td>
        <td style="text-align: center; font-weight: 600;">${age} th</td>
        <td>${escapeHtml(gender)}</td>
        <td><strong style="color: #fbbf24;">${cloth}</strong></td>
        <td>${escapeHtml(med || 'Sehat')}</td>
      </tr>
    `;
  }

  pendingRegistrationData = {
    type: 'kelompok',
    groupName: groupName,
    groupLeader: groupLeader,
    leaderEmail: groupEmail,
    leaderPhone: leaderPhone,
    wilayah: defaultWilayah,
    data: batchRecords
  };

  const previewBody = document.getElementById('previewModalBody');
  if (previewBody) {
    previewBody.innerHTML = `
      <div class="preview-summary-box">
        <div class="preview-summary-heading">
          <i class="fa-solid fa-users"></i> Informasi Rombongan & Koordinator
          <span class="preview-badge-status kelompok" style="margin-left: auto;">Registrasi Kelompok (${batchRecords.length} Peserta)</span>
        </div>
        <div class="preview-detail-grid">
          <div class="preview-item">
            <span class="preview-label">Nama Rombongan</span>
            <span class="preview-val">${escapeHtml(groupName)}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Wilayah Kafilah</span>
            <span class="preview-val">${escapeHtml(defaultWilayah)}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Ketua / Koordinator</span>
            <span class="preview-val">${escapeHtml(groupLeader)}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">No. WA Koordinator</span>
            <span class="preview-val">${escapeHtml(leaderPhone)}</span>
          </div>
        </div>
      </div>

      <div class="preview-summary-box">
        <div class="preview-summary-heading">
          <i class="fa-solid fa-calendar-days"></i> Rencana Jadwal & Transportasi Bersama
        </div>
        <div class="preview-detail-grid">
          <div class="preview-item">
            <span class="preview-label">Tanggal Kedatangan</span>
            <span class="preview-val">${formatDateIndo(defaultArrival)}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Tanggal Kepulangan</span>
            <span class="preview-val">${formatDateIndo(defaultDeparture)}</span>
          </div>
          <div class="preview-item full-width">
            <span class="preview-label">Armada Transportasi</span>
            <span class="preview-val">${escapeHtml(defaultTransport)}</span>
          </div>
        </div>
      </div>

      <div class="preview-summary-box">
        <div class="preview-summary-heading">
          <i class="fa-solid fa-list-ol"></i> Daftar Anggota Rombongan (${batchRecords.length} Orang)
        </div>
        <div style="overflow-x: auto;">
          <table class="preview-members-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">No</th>
                <th>Nama Peserta</th>
                <th style="width: 70px; text-align: center;">Usia</th>
                <th>Gender</th>
                <th>Baju</th>
                <th>Riwayat Medis</th>
              </tr>
            </thead>
            <tbody>
              ${membersRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.add('active');
}

function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.remove('active');
}

// 3. KONFIRMASI & SIMPAN KE DATABASE (Model formkwpselindo)
async function confirmAndSubmitRegistration() {
  if (!pendingRegistrationData) return;

  const confirmBtn = document.getElementById('btnConfirmSubmit');
  const originalText = confirmBtn.innerHTML;
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

  try {
    if (pendingRegistrationData.type === 'individu') {
      const saved = await window.dataService.addRegistration(pendingRegistrationData.data);

      if (window.confetti) {
        window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      }

      showToast(`Alhamdulillah! Pendaftaran individu berhasil dengan No. Registrasi: ${saved.registration_code}`, 'success');
      document.getElementById('formIndividu').reset();
      closePreviewModal();

      // Show official E-Tiket Modal
      showTicketModal(saved);

      // Refresh data rekap
      await loadAndRenderRegistrations();
    } else if (pendingRegistrationData.type === 'kelompok') {
      const savedBatch = await window.dataService.addBatchRegistrations(pendingRegistrationData.data);

      if (window.confetti) {
        window.confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
      }

      const firstCode = savedBatch[0]?.registration_code || '';
      const lastCode = savedBatch[savedBatch.length - 1]?.registration_code || '';
      const codeInfo = (firstCode && lastCode && firstCode !== lastCode) ? ` (No. Reg: ${firstCode} s/d ${lastCode})` : (firstCode ? ` (No. Reg: ${firstCode})` : '');
      showToast(`Alhamdulillah! Berhasil mendaftarkan ${savedBatch.length} peserta rombongan${codeInfo}.`, 'success');
      document.getElementById('formKelompok').reset();
      initGroupMembers();
      closePreviewModal();

      // Tampilkan tiket satu per satu untuk seluruh peserta rombongan
      if (savedBatch && savedBatch.length > 0) {
        showTicketModal(savedBatch, 0);
      }

      await loadAndRenderRegistrations();
    }
  } catch (err) {
    showToast('Terjadi kendala saat menyimpan pendaftaran: ' + err.message, 'error');
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = originalText;
    pendingRegistrationData = null;
  }
}

// GROUP MEMBERS REPEATER LOGIC
let groupMemberCount = 0;

function initGroupMembers() {
  const container = document.getElementById('groupMembersContainer');
  if (!container) return;
  container.innerHTML = '';
  groupMemberCount = 0;

  // Bind input ketua rombongan agar otomatis terdeteksi sebagai kandidat wali/orang tua
  const leaderInput = document.getElementById('grp_leader');
  if (leaderInput && !leaderInput.dataset.syncBound) {
    leaderInput.addEventListener('input', () => syncAllGroupGuardians());
    leaderInput.dataset.syncBound = 'true';
  }

  // Inisialisasi 3 baris bersih siap ketik langsung
  addGroupMemberCard();
  addGroupMemberCard();
  addGroupMemberCard();
}

function syncAllGroupGuardians() {
  const rows = document.querySelectorAll('#groupMembersContainer tr.member-card');
  const adults = [];

  // Ambil nama Ketua Rombongan dari input utama di atas tabel jika ada
  const leaderInput = document.getElementById('grp_leader');
  const leaderName = leaderInput ? leaderInput.value.trim() : '';
  if (leaderName) {
    adults.push({ name: `${leaderName} (Ketua Rombongan)`, valName: leaderName, gender: 'Laki-laki' });
  }

  // Kumpulkan semua peserta dewasa yang namanya sudah diisi
  rows.forEach(r => {
    const name = r.querySelector('.grp-member-name')?.value.trim();
    const age = parseInt(r.querySelector('.grp-member-age')?.value || '0', 10);
    const gender = r.querySelector('.grp-member-gender')?.value || 'Laki-laki';
    if (name && (isNaN(age) || age === 0 || age >= 15)) {
      if (!adults.some(a => a.valName.toLowerCase() === name.toLowerCase())) {
        adults.push({ name: `${name} (${gender})`, valName: name, gender: gender });
      }
    }
  });

  // Perbarui dropdown wali di setiap baris peserta anak (< 15 th)
  rows.forEach(r => {
    const wrap = r.querySelector('.grp-child-guardian-wrap');
    const select = r.querySelector('.grp-member-guardian');
    const age = parseInt(r.querySelector('.grp-member-age')?.value || '0', 10);
    const childGender = r.querySelector('.grp-member-gender')?.value || 'Laki-laki';

    if (age > 0 && age < 15) {
      if (wrap) wrap.style.display = 'block';
      if (select) {
        const currentVal = select.value;
        let optHtml = '<option value="">-- Pilih Orang Tua / Wali di Rombongan --</option>';

        const sameGender = adults.filter(a => a.gender === childGender);
        const otherGender = adults.filter(a => a.gender !== childGender);

        if (sameGender.length > 0) {
          const grpTitle = childGender === 'Laki-laki' ? 'Ayah / Wali Laki-laki (Kamar Ikhwan)' : 'Ibu / Wali Perempuan (Kamar Akhwat)';
          optHtml += `<optgroup label="${grpTitle}">`;
          sameGender.forEach(a => {
            const isSel = (currentVal === a.valName) ? 'selected' : '';
            optHtml += `<option value="${escapeHtml(a.valName)}" ${isSel}>${escapeHtml(a.name)}</option>`;
          });
          optHtml += `</optgroup>`;
        }

        if (otherGender.length > 0) {
          optHtml += `<optgroup label="Anggota Dewasa Lainnya">`;
          otherGender.forEach(a => {
            const isSel = (currentVal === a.valName) ? 'selected' : '';
            optHtml += `<option value="${escapeHtml(a.valName)}" ${isSel}>${escapeHtml(a.name)}</option>`;
          });
          optHtml += `</optgroup>`;
        }

        select.innerHTML = optHtml;
      }
    } else {
      if (wrap) wrap.style.display = 'none';
      if (select) select.value = '';
    }
  });
}

function addGroupMemberCard(opts = {}) {
  groupMemberCount++;
  const container = document.getElementById('groupMembersContainer');
  if (!container) return;
  const memberId = groupMemberCount;

  const initialName = opts.name || '';
  const initialAge = opts.age !== undefined ? opts.age : '';
  const initialGender = opts.gender || 'Laki-laki';
  const initialCloth = opts.cloth || 'L';
  const initialMed = opts.med || 'Tidak Ada / Sehat';
  const initialPhone = opts.phone || '';

  const tr = document.createElement('tr');
  tr.className = 'member-card member-row-item';
  tr.id = `memberCard-${memberId}`;
  tr.innerHTML = `
    <td style="text-align: center; vertical-align: middle;">
      <span class="member-num-badge">${memberId}</span>
    </td>
    <td>
      <input type="text" class="form-control form-control-sm grp-member-name" 
             placeholder="Nama lengkap peserta" value="${escapeHtml(initialName)}" 
             oninput="syncAllGroupGuardians()" required>
      <div class="grp-child-guardian-wrap" id="guardianWrap-${memberId}" style="display: none; margin-top: 5px;">
        <div style="display: flex; align-items: center; gap: 5px; background: rgba(245, 158, 11, 0.12); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.35);">
          <span style="font-size: 10.5px; color: #fbbf24; white-space: nowrap; font-weight: 600;">
            <i class="fa-solid fa-people-roof"></i> Ikut Kamar:
          </span>
          <select class="form-control form-control-sm grp-member-guardian" style="font-size: 11px; padding: 2px 5px; height: 26px; border-color: rgba(245, 158, 11, 0.4); background: #0f172a; color: #f8fafc; width: 100%;" title="Pilih Orang Tua / Wali yang kamarnya akan diikuti anak ini">
            <option value="">-- Pilih Orang Tua / Wali --</option>
          </select>
        </div>
      </div>
    </td>
    <td>
      <input type="number" class="form-control form-control-sm grp-member-age" 
             placeholder="Usia" min="1" max="120" value="${escapeHtml(String(initialAge))}" 
             oninput="syncAllGroupGuardians(); updateGroupStats();" required title="Usia peserta (tahun)">
    </td>
    <td>
      <select class="form-control form-control-sm grp-member-gender" onchange="syncAllGroupGuardians(); updateGroupStats();">
        <option value="Laki-laki" ${initialGender === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
        <option value="Perempuan" ${initialGender === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
      </select>
    </td>
    <td>
      <select class="form-control form-control-sm grp-member-cloth">
        <option value="S" ${initialCloth === 'S' ? 'selected' : ''}>S</option>
        <option value="M" ${initialCloth === 'M' ? 'selected' : ''}>M</option>
        <option value="L" ${initialCloth === 'L' ? 'selected' : ''}>L</option>
        <option value="XL" ${initialCloth === 'XL' ? 'selected' : ''}>XL</option>
        <option value="XXL" ${initialCloth === 'XXL' ? 'selected' : ''}>XXL</option>
        <option value="3XL" ${initialCloth === '3XL' ? 'selected' : ''}>3XL</option>
        <option value="4XL" ${initialCloth === '4XL' ? 'selected' : ''}>4XL</option>
      </select>
    </td>
    <td>
      <input type="text" class="form-control form-control-sm grp-member-med" 
             placeholder="Asma / Maag / Sehat" value="${escapeHtml(initialMed)}">
    </td>
    <td>
      <input type="tel" class="form-control form-control-sm grp-member-phone" 
             placeholder="08xxxxxxxx" value="${escapeHtml(initialPhone)}">
    </td>
    <td style="text-align: center; vertical-align: middle;">
      <button type="button" class="btn-remove-row-sm" onclick="removeMemberCard(${memberId})" title="Hapus baris ini">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </td>
  `;

  container.appendChild(tr);
  reindexMemberRows();
  updateGroupStats();
  syncAllGroupGuardians();
}

function addGroupMembersBatch(count = 5) {
  for (let i = 0; i < count; i++) {
    addGroupMemberCard();
  }
  showToast(`Berhasil menambahkan ${count} baris anggota ke tabel.`, 'success');
}

function openBulkPasteModal() {
  const modal = document.getElementById('bulkPasteModal');
  const textarea = document.getElementById('bulkPasteTextarea');
  if (modal) {
    if (textarea) textarea.value = '';
    modal.classList.add('active');
    setTimeout(() => textarea?.focus(), 80);
  }
}

function closeBulkPasteModal() {
  const modal = document.getElementById('bulkPasteModal');
  if (modal) modal.classList.remove('active');
}

function applyBulkPaste() {
  const textarea = document.getElementById('bulkPasteTextarea');
  const clothSelect = document.getElementById('bulkDefaultCloth');
  const genderSelect = document.getElementById('bulkDefaultGender');
  if (!textarea) return;

  const rawText = textarea.value.trim();
  if (!rawText) {
    showToast('Harap tempelkan daftar nama terlebih dahulu.', 'warning');
    return;
  }

  const defaultCloth = clothSelect ? clothSelect.value : 'L';
  const defaultGender = genderSelect ? genderSelect.value : 'Laki-laki';
  const lines = rawText.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Bersihkan format nomor seperti '1. ', '1 - ', '• ', dll.
  const cleanedNames = lines.map(line => {
    return line.replace(/^[\d]+[\.\-\)\s]+/, '').replace(/^[\•\-\*]\s*/, '').trim();
  }).filter(name => name.length > 0);

  if (cleanedNames.length === 0) {
    showToast('Tidak ada nama valid yang ditemukan.', 'warning');
    return;
  }

  // Jika tabel hanya berisi baris kosong, bersihkan terlebih dahulu
  const container = document.getElementById('groupMembersContainer');
  if (container) {
    const existingRows = container.querySelectorAll('.member-card');
    let hasFilledRow = false;
    existingRows.forEach(row => {
      const input = row.querySelector('.grp-member-name');
      if (input && input.value.trim()) hasFilledRow = true;
    });

    if (!hasFilledRow) {
      container.innerHTML = '';
      groupMemberCount = 0;
    }
  }

  cleanedNames.forEach(name => {
    addGroupMemberCard({
      name: name,
      gender: defaultGender,
      cloth: defaultCloth,
      med: 'Tidak Ada / Sehat'
    });
  });

  closeBulkPasteModal();
  showToast(`Alhamdulillah, berhasil memasukkan ${cleanedNames.length} nama anggota ke tabel.`, 'success');
}

function removeMemberCard(id) {
  const card = document.getElementById(`memberCard-${id}`);
  if (card) {
    card.remove();
    reindexMemberRows();
    updateGroupStats();
    syncAllGroupGuardians();
  }
}

function reindexMemberRows() {
  const rows = document.querySelectorAll('#groupMembersContainer tr.member-card');
  rows.forEach((row, idx) => {
    const badge = row.querySelector('.member-num-badge');
    if (badge) badge.textContent = idx + 1;
  });
}

function updateGroupStats() {
  const rows = document.querySelectorAll('#groupMembersContainer tr.member-card');
  const total = rows.length;
  let male = 0;
  let female = 0;
  let children = 0;

  rows.forEach(row => {
    const genderSel = row.querySelector('.grp-member-gender');
    const genderRad = row.querySelector('input[type="radio"]:checked');
    const g = genderSel ? genderSel.value : (genderRad ? genderRad.value : 'Laki-laki');
    if (g === 'Perempuan') {
      female++;
    } else {
      male++;
    }

    const ageVal = parseInt(row.querySelector('.grp-member-age')?.value || '0', 10);
    if (ageVal > 0 && ageVal < 15) {
      children++;
    }
  });

  const countEl = document.getElementById('grpTotalMemberCounter');
  if (countEl) countEl.textContent = total;

  const statTotalEl = document.getElementById('grpStatTotal');
  if (statTotalEl) statTotalEl.textContent = `${total} Orang`;

  const statMaleEl = document.getElementById('grpStatMale');
  if (statMaleEl) statMaleEl.textContent = male;

  const statFemaleEl = document.getElementById('grpStatFemale');
  if (statFemaleEl) statFemaleEl.textContent = female;

  const statChildEl = document.getElementById('grpStatChildren');
  if (statChildEl) statChildEl.textContent = children;
}

function updateGroupMemberCounter() {
  updateGroupStats();
}

// ===================================================================
// ===================================================================
// 5. E-TIKET BOARDING PASS & CONFIRMATION MESSAGE
// ===================================================================
let currentTicketRecord = null;
let customTicketTemplateBase64 = null;

function formatTicketDate(dateStr) {
  if (!dateStr) return '14/11/26';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const yearShort = parts[0].slice(-2);
    return `${parts[2]}/${parts[1]}/${yearShort}`;
  }
  return dateStr;
}

let currentTicketBatch = [];
let currentTicketIndex = 0;

function getValidTicketTemplateUrl(val) {
  if (!val) return 'images/boarding-pass-canva.png';
  if (typeof val === 'object' && val !== null) {
    if (val.dataUrl && typeof val.dataUrl === 'string') return val.dataUrl;
    return 'images/boarding-pass-canva.png';
  }
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s || s === '[object Object]' || s.includes('[object')) {
      return 'images/boarding-pass-canva.png';
    }
    return s;
  }
  return 'images/boarding-pass-canva.png';
}

function renderActiveTicket(record) {
  if (!record) return;
  currentTicketRecord = record;
  const settings = window.dataService.getSettings();

  // Tampilkan Nomor Registrasi di header modal tiket
  const elBadgeCode = document.getElementById('modalTicketRegCodeBadge');
  if (elBadgeCode) {
    elBadgeCode.textContent = `No. Registrasi: ${record.registration_code || '-'}`;
  }

  const ticketCard = document.getElementById('printableTicket');

  // Apply boarding pass template (official Canva or customized upload)
  if (ticketCard) {
    const tplImg = getValidTicketTemplateUrl(settings.ticket_template_image);
    ticketCard.style.backgroundImage = `url('${tplImg}')`;
    ticketCard.style.backgroundSize = '100% 100%';
    ticketCard.style.backgroundPosition = 'center';
    ticketCard.style.backgroundRepeat = 'no-repeat';
  }

  // Kop Maskapai & Tagline
  const elAirline = document.getElementById('ticketBpAirlineText');
  if (elAirline) elAirline.textContent = settings.ticket_airline_name || 'MUNZALAN AIRLINES';

  const elStubTag = document.getElementById('ticketBpStubTagline');
  if (elStubTag) elStubTag.textContent = settings.ticket_event_tag || 'KUMPUL KELUARGA';

  // Rute From -> To
  const elRouteFrom = document.getElementById('ticketBpRouteFrom');
  if (elRouteFrom) elRouteFrom.textContent = (settings.ticket_route_from || 'RANTAUAN').toUpperCase();

  const elRouteTo = document.getElementById('ticketBpRouteTo');
  if (elRouteTo) elRouteTo.textContent = (settings.ticket_route_to || 'RUMAH').toUpperCase();

  // Nama Peserta / Nama Keluarga
  const pName = (record.full_name || record.name || '-').toUpperCase();
  const elPassName = document.getElementById('ticketBpPassengerName');
  if (elPassName) elPassName.textContent = pName;

  const elStubPassName = document.getElementById('ticketBpStubPassengerName');
  if (elStubPassName) elStubPassName.textContent = pName;

  // Tanggal Pulang & Jam Datang
  const elReturnDate = document.getElementById('ticketBpReturnDate');
  if (elReturnDate) {
    elReturnDate.textContent = formatTicketDate(record.departure_date || record.return_date || '2026-11-14');
  }

  const elArrivalTime = document.getElementById('ticketBpArrivalTime');
  if (elArrivalTime) {
    elArrivalTime.textContent = record.arrival_time ? record.arrival_time : (record.arrival_date ? formatTicketDate(record.arrival_date) : '15:00 AM');
  }

  // Deteksi status anak di bawah umur (< 15 th)
  const ageVal = parseInt(record.age, 10);
  const isChild = record.is_child || (!isNaN(ageVal) && ageVal > 0 && ageVal < 15);
  const genderChar = (record.gender && record.gender.toLowerCase().startsWith('p')) ? 'P' : 'L';

  // Aturan Kelompok: Anak di bawah umur TIDAK masuk kelompok (kosong / '-')
  let grpVal = '-';
  if (!isChild) {
    if (record.group_code) {
      grpVal = String(record.group_code).toUpperCase();
    } else if (record.group_name) {
      grpVal = String(record.group_name).toUpperCase();
    } else {
      const alloc = autoAllocateRoomAndGroup(record.gender, false);
      grpVal = alloc.group_code.toUpperCase();
    }
  }
  
  const elGroup = document.getElementById('ticketBpGroup');
  if (elGroup) elGroup.textContent = grpVal;

  // Aturan Kamar: Kamar anak otomatis mengikuti kamar orang tua / wali yang se-gender
  let roomVal = record.room_number || record.kamar || '';
  if ((!roomVal || roomVal === 'Ikut Ortu' || roomVal.toLowerCase().includes('ortu')) && isChild && record.guardian_name) {
    // 1. Cek dari currentTicketBatch jika sedang membuka rombongan
    if (typeof currentTicketBatch !== 'undefined' && Array.isArray(currentTicketBatch)) {
      const parentInBatch = currentTicketBatch.find(a => 
        a.full_name && a.full_name.trim().toLowerCase() === record.guardian_name.trim().toLowerCase()
      );
      if (parentInBatch && (parentInBatch.room_number || parentInBatch.kamar) && parentInBatch.room_number !== 'Ikut Ortu') {
        roomVal = parentInBatch.room_number || parentInBatch.kamar;
      }
    }
    // 2. Cek dari allRegistrations
    if ((!roomVal || roomVal === 'Ikut Ortu' || roomVal.toLowerCase().includes('ortu')) && typeof allRegistrations !== 'undefined' && Array.isArray(allRegistrations)) {
      const parent = allRegistrations.find(a => 
        a.full_name && a.full_name.trim().toLowerCase() === record.guardian_name.trim().toLowerCase()
      );
      if (parent && (parent.room_number || parent.kamar) && parent.room_number !== 'Ikut Ortu') {
        roomVal = parent.room_number || parent.kamar;
      }
    }
  }
  if (!roomVal) {
    if (isChild) {
      roomVal = 'Ikut Ortu';
    } else {
      const alloc = autoAllocateRoomAndGroup(record.gender, false);
      roomVal = alloc.room_number;
    }
  }

  const elRoom = document.getElementById('ticketBpRoom');
  if (elRoom) {
    elRoom.textContent = roomVal;
    if (roomVal.length > 4) {
      elRoom.style.fontSize = '8.5px';
      elRoom.style.letterSpacing = '-0.02em';
      elRoom.style.lineHeight = '1';
    } else {
      elRoom.style.fontSize = '';
      elRoom.style.letterSpacing = '';
      elRoom.style.lineHeight = '';
    }
  }

  const cityVal = (record.daerah || record.wilayah || 'KLATEN').toUpperCase();
  const elOriginCity = document.getElementById('ticketBpOriginCity');
  if (elOriginCity) elOriginCity.textContent = cityVal;

  const elGender = document.getElementById('ticketBpGenderCode');
  if (elGender) elGender.textContent = genderChar;

  // Stub Section: NIK / Nomor Registrasi Peserta, Kelompok, Kamar
  const elStubNik = document.getElementById('ticketBpStubNik');
  if (elStubNik) {
    const rawVal = String(record.registration_code || record.nik || '001');
    // Format simpel 3-digit (misal: PKB-001 -> 001) agar serasi dengan Kelompok (A123) dan Kamar (08)
    const match = rawVal.match(/(\d+)/g);
    let simpleNum = '001';
    if (match && match.length > 0) {
      const lastDigits = match[match.length - 1];
      simpleNum = String(lastDigits).slice(-3).padStart(3, '0');
    }
    elStubNik.textContent = simpleNum;
    elStubNik.title = `No. Registrasi: ${rawVal}`;
  }

  const elStubGroup = document.getElementById('ticketBpStubGroup');
  if (elStubGroup) elStubGroup.textContent = grpVal;

  const elStubRoom = document.getElementById('ticketBpStubRoom');
  if (elStubRoom) {
    elStubRoom.textContent = roomVal;
    if (roomVal.length > 4) {
      elStubRoom.style.fontSize = '7.5px';
      elStubRoom.style.letterSpacing = '-0.03em';
    } else {
      elStubRoom.style.fontSize = '';
      elStubRoom.style.letterSpacing = '';
    }
  }

  // Barcode Reg Code
  const elBarcode = document.getElementById('ticketBpBarcodeNumber');
  if (elBarcode) elBarcode.textContent = record.registration_code || 'PKB-001';
}

function showTicketModal(recordOrBatch, initialIndex = 0) {
  const modal = document.getElementById('ticketModal');
  if (!modal || !recordOrBatch) return;

  if (Array.isArray(recordOrBatch)) {
    currentTicketBatch = recordOrBatch;
  } else {
    currentTicketBatch = [recordOrBatch];
  }

  currentTicketIndex = (initialIndex >= 0 && initialIndex < currentTicketBatch.length) ? initialIndex : 0;

  // Setup Group Navigation Bar jika data rombongan / batch
  const navWrap = document.getElementById('groupTicketNavWrap');
  const selMember = document.getElementById('groupTicketMemberSelect');
  const counterText = document.getElementById('groupTicketCounterText');
  const btnPrev = document.getElementById('btnPrevGroupTicket');
  const btnNext = document.getElementById('btnNextGroupTicket');

  if (currentTicketBatch.length > 1) {
    if (navWrap) navWrap.style.display = 'flex';
    if (selMember) {
      selMember.innerHTML = currentTicketBatch.map((item, idx) => {
        const ageNum = parseInt(item.age, 10);
        const ageInfo = (!isNaN(ageNum) && ageNum > 0) ? ` (${ageNum} th)` : '';
        const childInfo = (item.is_child || (ageNum > 0 && ageNum < 15)) ? ' [Anak]' : '';
        return `<option value="${idx}">Peserta ${idx + 1}: ${escapeHtml(item.full_name || item.name || 'Peserta')}${ageInfo}${childInfo}</option>`;
      }).join('');
      selMember.value = String(currentTicketIndex);
    }
    if (counterText) {
      counterText.textContent = `Peserta ${currentTicketIndex + 1} dari ${currentTicketBatch.length}`;
    }
    if (btnPrev) btnPrev.disabled = currentTicketIndex === 0;
    if (btnNext) btnNext.disabled = currentTicketIndex === currentTicketBatch.length - 1;
  } else {
    if (navWrap) navWrap.style.display = 'none';
  }

  renderActiveTicket(currentTicketBatch[currentTicketIndex]);
  modal.classList.add('active');
}

function stepGroupTicket(delta) {
  const newIndex = currentTicketIndex + delta;
  if (newIndex >= 0 && newIndex < currentTicketBatch.length) {
    switchGroupTicketMember(newIndex);
  }
}

function switchGroupTicketMember(indexVal) {
  const idx = parseInt(indexVal, 10);
  if (isNaN(idx) || idx < 0 || idx >= currentTicketBatch.length) return;
  currentTicketIndex = idx;

  const selMember = document.getElementById('groupTicketMemberSelect');
  if (selMember) selMember.value = String(idx);

  const counterText = document.getElementById('groupTicketCounterText');
  if (counterText) {
    counterText.textContent = `Peserta ${idx + 1} dari ${currentTicketBatch.length}`;
  }

  const btnPrev = document.getElementById('btnPrevGroupTicket');
  const btnNext = document.getElementById('btnNextGroupTicket');
  if (btnPrev) btnPrev.disabled = idx === 0;
  if (btnNext) btnNext.disabled = idx === currentTicketBatch.length - 1;

  renderActiveTicket(currentTicketBatch[idx]);
}

async function downloadTicketImage() {
  if (!currentTicketRecord) {
    showToast('Tidak ada data tiket yang sedang aktif.', 'warning');
    return;
  }

  const ticketCard = document.getElementById('printableTicket');
  if (!ticketCard) return;

  if (typeof html2canvas !== 'function') {
    showToast('Library html2canvas belum termuat. Membuka jendela cetak...', 'info');
    window.print();
    return;
  }

  const btn = document.getElementById('btnDownloadTicketPng');
  const origText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyiapkan...';
  }

  try {
    const canvas = await html2canvas(ticketCard, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    const regCode = (currentTicketRecord.registration_code || 'TIKET').replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanName = (currentTicketRecord.full_name || 'Peserta').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `E-Tiket_${regCode}_${cleanName}.png`;

    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUri;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`E-Tiket untuk "${currentTicketRecord.full_name}" berhasil diunduh (PNG)!`, 'success');
  } catch (err) {
    console.error('Error downloading ticket image:', err);
    showToast('Kendala saat mengunduh gambar tiket: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }
}

async function downloadAllGroupTicketsOneByOne() {
  if (!currentTicketBatch || currentTicketBatch.length === 0) {
    showToast('Tidak ada tiket rombongan yang dapat diunduh.', 'warning');
    return;
  }

  const btn = document.getElementById('btnDownloadAllGroup');
  const origText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunduh...';
  }

  showToast(`Memulai proses pengunduhan ${currentTicketBatch.length} tiket rombongan satu per satu...`, 'info');

  try {
    for (let i = 0; i < currentTicketBatch.length; i++) {
      switchGroupTicketMember(i);
      // Wait for DOM update
      await new Promise(r => setTimeout(r, 200));

      const ticketCard = document.getElementById('printableTicket');
      const canvas = await html2canvas(ticketCard, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      const member = currentTicketBatch[i];
      const regCode = (member.registration_code || `TIKET-${i+1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanName = (member.full_name || `Peserta_${i+1}`).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `E-Tiket_${regCode}_${cleanName}.png`;

      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Delay between downloads to prevent browser throttling
      await new Promise(r => setTimeout(r, 450));
    }

    showToast(`Alhamdulillah! Berhasil mengunduh semua (${currentTicketBatch.length}) tiket rombongan satu per satu.`, 'success');
  } catch (err) {
    console.error('Error downloading all group tickets:', err);
    showToast('Kendala saat mengunduh tiket rombongan: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }
}

function closeTicketModal() {
  const modal = document.getElementById('ticketModal');
  if (modal) modal.classList.remove('active');
}

function printTicketOnly() {
  window.print();
}

// Build confirmation message using user-configured narrative from settings
function buildConfirmationMessage(record) {
  if (!record) return '';
  const settings = window.dataService.getSettings();
  let template = settings.confirmation_email_body || '';

  if (!template) {
    template = `E-TIKET & BUKTI REGISTRASI RESMI
SILATURAHMI AKBAR PASKAS BAHAGIA
===================================================

Ahlan wa Sahlan, {nama}!

Alhamdulillah, pendaftaran resmi Anda untuk Silaturahmi Akbar Paskas Bahagia telah BERHASIL kami terima.

📋 RINCIAN BOARDING PASS PESERTA:
---------------------------------------------------
• No. Registrasi : {kode_tiket}
• Nama Peserta   : {nama}
• Kategori       : {tipe}
• Usia           : {usia}
• Jenis Kelamin  : {gender}
• Wilayah Asal   : {wilayah} ({daerah})
• Kelompok       : {kelompok}
• Gedung / Kamar : {kamar}
• Tanggal Pulang : {tgl_pulang}
• Jam Datang     : {jam_datang}
• Rute           : {rute_from} -> {rute_to}
{info_pendamping}

🎫 PETUNJUK KEDATANGAN:
1. Harap unduh / simpan E-Tiket (Boarding Pass) resmi yang telah diterbitkan.
2. Tunjukkan kode tiket atau kartu e-tiket kepada panitia saat registrasi kedatangan di lokasi acara.

Jazakumullahu Khairan Katsiran,
Panitia Pelaksana Silaturahmi Akbar Paskas Bahagia`;
  }

  const returnDate = formatTicketDate(record.departure_date || record.return_date || '2026-11-14');
  const arrivalTime = record.arrival_time ? record.arrival_time : (record.arrival_date ? formatTicketDate(record.arrival_date) : '15:00 AM');
  const ageVal = parseInt(record.age, 10);
  const isChild = record.is_child || (!isNaN(ageVal) && ageVal > 0 && ageVal < 15);
  const grpVal = isChild ? '-' : (record.group_name || (record.registration_type === 'kelompok' ? 'Kelompok' : 'Reguler'));
  
  let roomVal = record.room_number || record.kamar || '';
  if (!roomVal && isChild && record.guardian_name && typeof allRegistrations !== 'undefined') {
    const parent = allRegistrations.find(a => 
      a.full_name && a.full_name.trim().toLowerCase() === record.guardian_name.trim().toLowerCase()
    );
    if (parent && (parent.room_number || parent.kamar)) {
      roomVal = parent.room_number || parent.kamar;
    }
  }
  if (!roomVal) roomVal = isChild ? 'Ikut Ortu' : '08';

  const daerahVal = record.daerah || record.wilayah || '-';
  const wilayahVal = record.wilayah || '-';
  const tipeVal = record.registration_type === 'kelompok' ? 'Rombongan / Kelompok' : 'Individu';
  const usiaVal = record.age ? `${record.age} Tahun${isChild ? ' (Anak-anak)' : ''}` : '-';
  const pendampingVal = (isChild && record.guardian_name) ? `• Pendamping/Wali: ${record.guardian_name} (Kamar Mengikuti Orang Tua)` : '';

  return template
    .replace(/{nama}/g, record.full_name || '-')
    .replace(/{kode_tiket}/g, record.registration_code || '-')
    .replace(/{tipe}/g, tipeVal)
    .replace(/{usia}/g, usiaVal)
    .replace(/{wilayah}/g, wilayahVal)
    .replace(/{daerah}/g, daerahVal)
    .replace(/{kelompok}/g, grpVal)
    .replace(/{kamar}/g, roomVal)
    .replace(/{tgl_pulang}/g, returnDate)
    .replace(/{jam_datang}/g, arrivalTime)
    .replace(/{gender}/g, record.gender || 'Laki-laki')
    .replace(/{nik}/g, record.nik || '-')
    .replace(/{hp}/g, record.phone_number || record.phone || '-')
    .replace(/{info_pendamping}/g, pendampingVal)
    .replace(/{rute_from}/g, settings.ticket_route_from || 'RANTAUAN')
    .replace(/{rute_to}/g, settings.ticket_route_to || 'RUMAH')
    .replace(/{rombongan}/g, record.group_name || (record.registration_type === 'kelompok' ? 'Rombongan' : '-'))
    .replace(/{jadwal_kedatangan}/g, record.arrival_date ? formatTicketDate(record.arrival_date) : '-')
    .replace(/{kendaraan_datang}/g, record.transport_arrival || 'Bus Panitia')
    .replace(/{jadwal_kepulangan}/g, record.departure_date ? formatTicketDate(record.departure_date) : '-')
    .replace(/{kendaraan_pulang}/g, record.transport_departure || 'Bus Panitia')
    .replace(/{ukuran_baju}/g, record.cloth_size || '-')
    .replace(/{riwayat_medis}/g, record.medical_history || 'Tidak Ada / Sehat');
}

function sendTicketWhatsApp() {
  if (!currentTicketRecord) {
    showToast('Tidak ada data tiket yang sedang aktif.', 'warning');
    return;
  }
  let phone = (currentTicketRecord.phone_number || currentTicketRecord.phone || '').trim();
  if (!phone) {
    const input = prompt('Kirim E-Tiket via WhatsApp:\nMasukkan No. WhatsApp peserta / koordinator (contoh: 08123456789):', '');
    if (input === null) return;
    phone = input.trim();
  }
  if (!phone) {
    showToast('Nomor WhatsApp belum diisi.', 'warning');
    return;
  }
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }

  const body = buildConfirmationMessage(currentTicketRecord);
  const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(body)}`;
  window.open(waUrl, '_blank');
  showToast(`Membuka WhatsApp untuk mengirim tiket ke No: ${phone}`, 'success');
}
window.sendTicketWhatsApp = sendTicketWhatsApp;

async function sendTicketEmail() {
  if (!currentTicketRecord) {
    showToast('Tidak ada data tiket yang sedang aktif.', 'warning');
    return;
  }

  let destEmail = (currentTicketRecord.email || '').trim();
  if (!destEmail) {
    const input = prompt('Kirim E-Tiket ke alamat email:\nMasukkan email peserta / koordinator:', '');
    if (input === null) return;
    destEmail = input.trim();
  }

  if (!destEmail) {
    showToast('Alamat email belum diisi. Pengiriman dibatalkan.', 'warning');
    return;
  }

  const settings = window.dataService.getSettings();
  const subject = settings.confirmation_email_subject || `[E-TIKET RESMI] Silaturahmi Akbar Paskas Bahagia - ${currentTicketRecord.registration_code}`;
  const body = buildConfirmationMessage(currentTicketRecord);

  // Selalu salin narasi ke clipboard peserta sebagai cadangan
  copyTicketConfirmationMessage(false);

  const btn = document.getElementById('btnSendTicketEmail');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim E-Tiket...';
  }

  showToast(`Sedang memproses pengiriman E-Tiket ke: ${destEmail}...`, 'info');

  try {
    const emailjsServiceId = settings.emailjs_service_id || '';
    const emailjsTemplateId = settings.emailjs_template_id || '';
    const emailjsPublicKey = settings.emailjs_public_key || '';

    if (window.emailjs && emailjsPublicKey && emailjsServiceId && emailjsTemplateId) {
      await window.emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        {
          to_email: destEmail,
          to_name: currentTicketRecord.full_name || 'Peserta',
          subject: subject,
          message: body,
          registration_code: currentTicketRecord.registration_code || '-'
        },
        emailjsPublicKey
      );
      showToast(`Alhamdulillah! E-Tiket resmi berhasil dikirim ke: ${destEmail}`, 'success');
    } else {
      // Fallback Nyata & Pasti Berfungsi: Buka Gmail Web dengan email tujuan, subjek & narasi tiket otomatis terisi
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const mailtoUrl = `mailto:${encodeURIComponent(destEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const win = window.open(gmailUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = mailtoUrl;
      }
      showToast(`Membuka email untuk dikirimkan ke: ${destEmail}`, 'success');
    }

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Siap Dikirim!';
      setTimeout(() => {
        if (btn) btn.innerHTML = originalText;
      }, 3500);
    }
  } catch (err) {
    console.error('Email send error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
    showToast(`Pengiriman email: ${err.text || err.message || 'Periksa koneksi'}`, 'error');
  }
}

function copyTicketConfirmationMessage(notify = true) {
  if (!currentTicketRecord) {
    if (notify) showToast('Tidak ada data tiket yang sedang aktif.', 'warning');
    return;
  }
  const msg = buildConfirmationMessage(currentTicketRecord);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msg).then(() => {
      if (notify) showToast('Teks e-tiket berhasil disalin ke clipboard!', 'success');
    }).catch(() => {
      if (notify) showToast('Gagal menyalin otomatis, silakan coba lagi.', 'error');
    });
  } else {
    const tempTa = document.createElement('textarea');
    tempTa.value = msg;
    document.body.appendChild(tempTa);
    tempTa.select();
    document.execCommand('copy');
    document.body.removeChild(tempTa);
    if (notify) showToast('Teks e-tiket berhasil disalin!', 'success');
  }
}

function showSingleTicketFromTable(id) {
  const attendee = allRegistrations.find(a => String(a.id) === String(id));
  if (!attendee) return;

  // Jika peserta ini bagian dari rombongan, kumpulkan anggota rombongannya agar bisa dilihat satu per satu
  if (attendee.registration_type === 'kelompok' && attendee.group_name) {
    const groupMembers = allRegistrations.filter(a => 
      a.registration_type === 'kelompok' && 
      a.group_name && 
      a.group_name.trim().toLowerCase() === attendee.group_name.trim().toLowerCase()
    );
    if (groupMembers.length > 1) {
      const initIdx = groupMembers.findIndex(m => String(m.id) === String(id));
      showTicketModal(groupMembers, initIdx !== -1 ? initIdx : 0);
      return;
    }
  }

  // Individu atau rombongan tunggal
  showTicketModal(attendee);
}

window.showTicketModal = showTicketModal;
window.closeTicketModal = closeTicketModal;
window.printTicketOnly = printTicketOnly;
window.sendTicketEmail = sendTicketEmail;
window.downloadTicketImage = downloadTicketImage;
window.downloadAllGroupTicketsOneByOne = downloadAllGroupTicketsOneByOne;
window.stepGroupTicket = stepGroupTicket;
window.switchGroupTicketMember = switchGroupTicketMember;
window.showSingleTicketFromTable = showSingleTicketFromTable;
window.copyTicketConfirmationMessage = copyTicketConfirmationMessage;

// ===================================================================
// 6. REKAP DATA & METRICS
// ===================================================================
async function loadAndRenderRegistrations() {
  allRegistrations = await window.dataService.getRegistrations();
  filteredRegistrations = [...allRegistrations];
  currentPage = 1;

  // Populate Wilayah dropdown filter
  populateWilayahFilter();

  // Update summary metric counters
  updateSummaryMetrics();

  // Render Table & Pagination
  renderRekapTable();

  // Render Visual Charts
  renderCharts();

  // Update Nav & Settings Badge & Magazine Seal Pill
  const badge = document.getElementById('rekapBadgeCount');
  if (badge) badge.textContent = allRegistrations.length;
  const settingsBadge = document.getElementById('settingsRekapBadge');
  if (settingsBadge) settingsBadge.textContent = allRegistrations.length;
  const magTotal = document.getElementById('magPillTotal');
  if (magTotal) magTotal.textContent = allRegistrations.length + ' Jiwa';
}

function populateWilayahFilter() {
  const select = document.getElementById('filterWilayah');
  if (!select) return;

  const currentValue = select.value;
  // Group case-insensitively and sort alphabetically
  const wilayahMap = {};
  allRegistrations.forEach(r => {
    if (r.wilayah) {
      const clean = normalizeWilayahName(r.wilayah);
      wilayahMap[clean] = (wilayahMap[clean] || 0) + 1;
    }
  });

  const uniqueWilayah = Object.keys(wilayahMap).sort((a, b) => a.localeCompare('id'));

  select.innerHTML = '<option value="ALL">Semua Wilayah</option>' +
    uniqueWilayah.map(w => `<option value="${w}">${w} (${wilayahMap[w]} Org)</option>`).join('');

  if (uniqueWilayah.includes(currentValue)) {
    select.value = currentValue;
  }
}

function updateSummaryMetrics() {
  const totalOrang = allRegistrations.length;
  const individuCount = allRegistrations.filter(r => r.registration_type === 'individu').length;
  const kelompokMemberCount = allRegistrations.filter(r => r.registration_type === 'kelompok').length;

  // Hitung jumlah rombongan / kafilah unik
  const uniqueGroupNames = Array.from(new Set(
    allRegistrations
      .filter(r => r.registration_type === 'kelompok' && r.group_name)
      .map(r => r.group_name)
  ));
  const totalKafilah = uniqueGroupNames.length;

  const male = allRegistrations.filter(r => r.gender === 'Laki-laki').length;
  const female = allRegistrations.filter(r => r.gender === 'Perempuan').length;

  const malePct = totalOrang > 0 ? Math.round((male / totalOrang) * 100) : 0;
  const femalePct = totalOrang > 0 ? (100 - malePct) : 0;

  // Group Wilayah unik dan hitung terbanyak (nama sama langsung digabungkan jumlahnya)
  const wilayahMap = {};
  allRegistrations.forEach(r => {
    if (r.wilayah) {
      const w = normalizeWilayahName(r.wilayah);
      wilayahMap[w] = (wilayahMap[w] || 0) + 1;
    }
  });

  const uniqueWilayahList = Object.keys(wilayahMap);
  let topWilayah = '-';
  let maxCount = 0;
  for (const [w, count] of Object.entries(wilayahMap)) {
    if (count > maxCount) {
      maxCount = count;
      topWilayah = `${w} (${count} Org)`;
    }
  }

  // Top Cloth Size
  const clothCounts = {};
  allRegistrations.forEach(r => {
    if (r.cloth_size) clothCounts[r.cloth_size] = (clothCounts[r.cloth_size] || 0) + 1;
  });
  let topCloth = '-';
  let maxClothCount = 0;
  for (const [s, count] of Object.entries(clothCounts)) {
    if (count > maxClothCount) {
      maxClothCount = count;
      topCloth = `${s} (${count} Org)`;
    }
  }

  // Top Transport Arrival
  const transportCounts = {};
  allRegistrations.forEach(r => {
    const t = r.transport_arrival || 'Lainnya';
    transportCounts[t] = (transportCounts[t] || 0) + 1;
  });
  let topTransport = '-';
  let maxTransportCount = 0;
  for (const [t, count] of Object.entries(transportCounts)) {
    if (count > maxTransportCount) {
      maxTransportCount = count;
      topTransport = `${t} (${count} Org)`;
    }
  }

  // Top Transport Departure
  const transportDepCounts = {};
  allRegistrations.forEach(r => {
    const td = r.transport_departure || 'Lainnya';
    transportDepCounts[td] = (transportDepCounts[td] || 0) + 1;
  });
  let topTransportDep = '-';
  let maxTransportDepCount = 0;
  for (const [td, count] of Object.entries(transportDepCounts)) {
    if (count > maxTransportDepCount) {
      maxTransportDepCount = count;
      topTransportDep = `${td} (${count} Org)`;
    }
  }

  // Medical notes with real concerns (not "Tidak Ada")
  const medicalSpecial = allRegistrations.filter(r => {
    const med = (r.medical_history || '').toLowerCase();
    return med && !med.includes('tidak ada') && !med.includes('sehat');
  }).length;

  // KPI Percentages
  const pctMandiri = totalOrang > 0 ? Math.round((individuCount / totalOrang) * 100) : 0;
  const pctKelompok = totalOrang > 0 ? (100 - pctMandiri) : 0;
  const pctHealthy = totalOrang > 0 ? Math.round(((totalOrang - medicalSpecial) / totalOrang) * 100) : 100;

  // DOM Elements - Pillar 01 (Kehadiran)
  const elTotal = document.getElementById('statTotalPeserta');
  const elSub = document.getElementById('statSubPeserta');
  const elInfogIndividu = document.getElementById('infographicIndividu');
  const elInfogKelompok = document.getElementById('infographicKelompok');
  const elInfogKafilahCount = document.getElementById('infographicKafilahCount');

  if (elTotal) {
    elTotal.innerHTML = `${totalOrang} <small class="pillar-unit">Jiwa</small>`;
  }
  
  if (elSub) {
    if (kelompokMemberCount > 0) {
      elSub.textContent = `${individuCount} Orang Mandiri \u2022 ${kelompokMemberCount} Orang Rombongan (${totalKafilah} Kafilah)`;
    } else {
      elSub.textContent = `${individuCount} Orang Pendaftar Mandiri`;
    }
  }

  if (elInfogIndividu) elInfogIndividu.textContent = `${individuCount} Orang`;
  if (elInfogKelompok) elInfogKelompok.textContent = `${kelompokMemberCount} Orang`;
  if (elInfogKafilahCount) elInfogKafilahCount.textContent = `${totalKafilah} Kafilah terdaftar`;

  // DOM Elements - Pillar 02 (Gender)
  const elGender = document.getElementById('statGender');
  const elMale = document.getElementById('statMale');
  const elFemale = document.getElementById('statFemale');
  const elGenderSub = document.getElementById('statGenderSub');
  const elBarMale = document.getElementById('infographicBarMale');
  const elBarFemale = document.getElementById('infographicBarFemale');
  const elMaleCount = document.getElementById('infographicMaleCount');
  const elFemaleCount = document.getElementById('infographicFemaleCount');
  const elMalePct = document.getElementById('infographicMalePct');
  const elFemalePct = document.getElementById('infographicFemalePct');

  if (elGender) {
    elGender.innerHTML = `<span id="statMale">${male}</span> <small class="pillar-unit">L</small> : <span id="statFemale">${female}</span> <small class="pillar-unit">P</small>`;
  } else {
    if (elMale) elMale.textContent = male;
    if (elFemale) elFemale.textContent = female;
  }

  if (elGenderSub) {
    elGenderSub.textContent = `${male} Ikhwan \u2022 ${female} Akhwat (Total: ${totalOrang} Jiwa)`;
  }

  if (elBarMale) elBarMale.style.width = `${totalOrang > 0 ? malePct : 50}%`;
  if (elBarFemale) elBarFemale.style.width = `${totalOrang > 0 ? femalePct : 50}%`;

  if (elMaleCount) elMaleCount.textContent = `${male} Orang`;
  if (elFemaleCount) elFemaleCount.textContent = `${female} Orang`;
  if (elMalePct) elMalePct.textContent = `${malePct}%`;
  if (elFemalePct) elFemalePct.textContent = `${femalePct}%`;

  // DOM Elements - Pillar 03 (Logistik Seragam)
  const elStatLogistikLead = document.getElementById('statLogistikLead');
  const elStatLogistikSub = document.getElementById('statLogistikSub');
  const elTopCloth = document.getElementById('infographicTopCloth');
  const elTotalCloth = document.getElementById('infographicTotalCloth');

  if (elStatLogistikLead) {
    elStatLogistikLead.innerHTML = `${totalOrang} <small class="pillar-unit">Pcs</small>`;
  }
  if (elStatLogistikSub) {
    elStatLogistikSub.textContent = topCloth !== '-' ? `Terbanyak: ${topCloth}` : 'Total Kebutuhan Seragam';
  }
  if (elTopCloth) elTopCloth.textContent = topCloth;
  if (elTotalCloth) elTotalCloth.textContent = `${totalOrang} Potong`;

  // DOM Elements - Pillar 04 (Armada Transportasi)
  const elStatArmadaLead = document.getElementById('statArmadaLead');
  const elStatArmadaSub = document.getElementById('statArmadaSub');
  const elTopTransport = document.getElementById('infographicTopTransport');
  const elTopTransportDep = document.getElementById('infographicTopTransportDep');

  if (elStatArmadaLead) {
    elStatArmadaLead.textContent = maxTransportCount > 0 ? (topTransport.split(' (')[0]) : 'Armada';
  }
  if (elStatArmadaSub) {
    elStatArmadaSub.textContent = maxTransportCount > 0 ? `${maxTransportCount} Orang (Kedatangan Utama)` : 'Kesiapan rute transportasi';
  }
  if (elTopTransport) elTopTransport.textContent = topTransport;
  if (elTopTransportDep) elTopTransportDep.textContent = topTransportDep;

  // DOM Elements - Pillar 05 (Wilayah & Medis)
  const elWilayah = document.getElementById('statTotalWilayah');
  const elTopWil = document.getElementById('statTopWilayah');
  const elMed = document.getElementById('statMedicalNotes');
  const elWilSummary = document.getElementById('infographicWilayahSummary');

  if (elWilayah) {
    elWilayah.innerHTML = `${uniqueWilayahList.length} <small class="pillar-unit">Wilayah</small>`;
  }
  if (elTopWil) elTopWil.textContent = `Terbanyak: ${topWilayah}`;
  if (elWilSummary) elWilSummary.textContent = `${uniqueWilayahList.length} Kota/Kab`;
  
  if (elMed) {
    elMed.innerHTML = `${medicalSpecial} <small class="pillar-unit">Orang</small>`;
  }

  // Circular KPI Ribbon
  const elKpiMandiri = document.getElementById('kpiPctMandiri');
  const elKpiKelompok = document.getElementById('kpiPctKelompok');
  const elKpiCloth = document.getElementById('kpiPctCloth');
  const elKpiHealthy = document.getElementById('kpiPctHealthy');

  if (elKpiMandiri) elKpiMandiri.textContent = `${pctMandiri}%`;
  if (elKpiKelompok) elKpiKelompok.textContent = `${pctKelompok}%`;
  if (elKpiCloth) elKpiCloth.textContent = `${totalOrang > 0 ? 100 : 0}%`;
  if (elKpiHealthy) elKpiHealthy.textContent = `${pctHealthy}%`;
}

// FILTER & SEARCH HANDLER
function handleRekapSearch() {
  const query = document.getElementById('searchRekapInput').value.trim();
  const clearBtn = document.getElementById('btnClearSearch');
  if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';
  applyRekapFilters();
}

function clearRekapSearch() {
  const input = document.getElementById('searchRekapInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('btnClearSearch');
  if (clearBtn) clearBtn.style.display = 'none';
  applyRekapFilters();
}

function applyRekapFilters() {
  const search = document.getElementById('searchRekapInput').value.toLowerCase().trim();
  const filterAge = document.getElementById('filterAgeCategory')?.value || 'ALL';
  const type = document.getElementById('filterType').value;
  const gender = document.getElementById('filterGender').value;
  const wilayah = document.getElementById('filterWilayah').value;
  const cloth = document.getElementById('filterCloth').value;

  filteredRegistrations = allRegistrations.filter(item => {
    // Search match
    const matchSearch = !search ||
      (item.full_name && item.full_name.toLowerCase().includes(search)) ||
      (item.registration_code && item.registration_code.toLowerCase().includes(search)) ||
      (item.wilayah && item.wilayah.toLowerCase().includes(search)) ||
      (item.daerah && item.daerah.toLowerCase().includes(search)) ||
      (item.phone_number && item.phone_number.includes(search)) ||
      (item.email && item.email.toLowerCase().includes(search)) ||
      (item.emergency_phone && item.emergency_phone.includes(search)) ||
      (item.group_name && item.group_name.toLowerCase().includes(search));

    // Type match
    const matchType = type === 'ALL' || item.registration_type === type;

    // Gender match
    const matchGender = gender === 'ALL' || item.gender === gender;

    // Wilayah match
    const matchWilayah = wilayah === 'ALL' || normalizeWilayahName(item.wilayah) === wilayah;

    // Cloth match
    const matchCloth = cloth === 'ALL' || item.cloth_size === cloth;

    // Age match
    let matchAge = true;
    const aVal = item.age ? parseInt(item.age, 10) : null;
    if (filterAge === 'child') {
      matchAge = aVal !== null && aVal < 15;
    } else if (filterAge === 'adult') {
      matchAge = aVal === null || aVal >= 15;
    }

    return matchSearch && matchType && matchGender && matchWilayah && matchCloth && matchAge;
  });

  currentPage = 1;
  renderRekapTable();
}

// RENDER REKAP DATA TABLE
function renderRekapTable() {
  const tbody = document.getElementById('rekapTableBody');
  const emptyState = document.getElementById('rekapEmptyState');
  const paginationInfo = document.getElementById('paginationInfo');
  const paginationButtons = document.getElementById('paginationButtons');

  if (!tbody) return;

  if (filteredRegistrations.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (paginationInfo) paginationInfo.textContent = 'Menampilkan 0 data';
    if (paginationButtons) paginationButtons.innerHTML = '';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Calculate pagination
  const totalItems = filteredRegistrations.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredRegistrations.slice(startIndex, endIndex);

  tbody.innerHTML = currentItems.map((item, index) => {
    const rowNo = startIndex + index + 1;
    const isMale = item.gender === 'Laki-laki';
    const isSpecialMed = item.medical_history && 
                         !item.medical_history.toLowerCase().includes('tidak ada') && 
                         !item.medical_history.toLowerCase().includes('sehat');

    const ageVal = item.age ? parseInt(item.age, 10) : null;
    const isChild = ageVal !== null && ageVal < 15;
    const ageDisplay = ageVal !== null 
      ? (isChild 
          ? `<span class="badge-age-child" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; background: rgba(245, 158, 11, 0.18); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; border-radius: 999px; font-size: 11px; font-weight: 800;"><i class="fa-solid fa-child"></i> ${ageVal} th</span>`
          : `<span style="font-size: 12.5px; font-weight: 600; color: #cbd5e1;">${ageVal} th</span>`)
      : `<span style="color: #64748b;">-</span>`;

    return `
      <tr>
        <td style="color: #94a3b8; font-weight: 600;">${rowNo}</td>
        <td><span class="badge-table-code">${item.registration_code}</span></td>
        <td>
          <strong style="color: #ffffff; display: block;">${item.full_name}</strong>
          ${item.group_name ? `<small style="color: #fbbf24;"><i class="fa-solid fa-users"></i> ${item.group_name}</small>` : '<small style="color: #64748b;">Individu</small>'}
        </td>
        <td>
          <span class="${isMale ? 'badge-gender-l' : 'badge-gender-p'}">
            ${isMale ? '<i class="fa-solid fa-mars"></i> L' : '<i class="fa-solid fa-venus"></i> P'}
          </span>
        </td>
        <td style="text-align: center;">${ageDisplay}</td>
        <td>
          <i class="fa-solid fa-location-dot" style="color: #fbbf24; font-size: 11px;"></i> ${escapeHtml(item.wilayah)}
          ${item.daerah ? `<br><small style="color: #94a3b8;"><i class="fa-solid fa-city" style="font-size: 9px;"></i> ${escapeHtml(item.daerah)}</small>` : ''}
        </td>
        <td>${item.arrival_date} <br><small style="color: #64748b;">${item.arrival_time || '10:00'}</small></td>
        <td>${item.departure_date} <br><small style="color: #64748b;">${item.departure_time || '16:00'}</small></td>
        <td>${item.transport_arrival}</td>
        <td><span class="badge-size">${item.cloth_size}</span></td>
        <td>
          ${isSpecialMed 
            ? `<span class="badge-medical-alert" title="${item.medical_history}"><i class="fa-solid fa-triangle-exclamation"></i> ${truncateText(item.medical_history, 20)}</span>`
            : '<span class="badge-medical-ok"><i class="fa-solid fa-check"></i> Sehat</span>'
          }
        </td>
        <td>
          <div class="table-action-btns">
            <button class="btn-table-action" onclick="viewAttendeeDetail('${item.id}')" title="Lihat Profil Lengkap">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button class="btn-table-action" onclick="showSingleTicketFromTable('${item.id}')" title="Lihat & Unduh E-Tiket (Boarding Pass)" style="color: #38bdf8;">
              <i class="fa-solid fa-ticket"></i>
            </button>
            <button class="btn-table-action delete" onclick="confirmDeleteAttendee('${item.id}', '${item.full_name}')" title="Hapus Data">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Update Pagination Info
  if (paginationInfo) {
    paginationInfo.textContent = `Menampilkan ${startIndex + 1} - ${endIndex} dari ${totalItems} data peserta`;
  }

  // Update Pagination Buttons
  if (paginationButtons) {
    let btnsHtml = `
      <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      btnsHtml += `
        <button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="changePage(${p})">
          ${p}
        </button>
      `;
    }

    btnsHtml += `
      <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;

    paginationButtons.innerHTML = btnsHtml;
  }
}

function changePage(page) {
  const totalPages = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderRekapTable();
}

function truncateText(str, max) {
  if (!str) return '-';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

// ATTENDEE DETAIL MODAL
let currentViewingAttendee = null;

function renderModalRoomOptions(attendee) {
  const rooms = typeof getMasterRooms === 'function' ? getMasterRooms() : [];
  if (!rooms.length) {
    return `<option value="">Belum ada master kamar yang dibuat di Pengaturan</option>`;
  }

  return rooms.map(r => {
    const isSelected = (attendee.room_number && String(attendee.room_number) === String(r.room_number)) || 
                       (attendee.room_name && attendee.room_name === r.room_name);
    const genderTag = r.gender_type === 'ikhwan' ? '[Ikhwan]' : (r.gender_type === 'akhwat' ? '[Akhwat]' : '[Campur/Keluarga]');
    const bldTag = r.building ? `${r.building} - ` : '';
    return `<option value="${r.id}" ${isSelected ? 'selected' : ''}>${bldTag}${r.room_name} (No. ${r.room_number}) ${genderTag} - Kap: ${r.capacity} org</option>`;
  }).join('');
}

async function saveAttendeeRoomAssignment(attendeeId) {
  const select = document.getElementById('modalAttendeeRoomSelect');
  if (!select) return;

  const selectedRoomId = select.value;
  const rooms = typeof getMasterRooms === 'function' ? getMasterRooms() : [];
  const selectedRoom = rooms.find(r => String(r.id) === String(selectedRoomId));

  const updates = selectedRoom ? {
    building: selectedRoom.building || '',
    room_number: selectedRoom.room_number || '',
    room_name: selectedRoom.room_name || ''
  } : {
    building: '',
    room_number: '',
    room_name: ''
  };

  try {
    await window.dataService.updateRegistration(attendeeId, updates);
    
    // Update local references
    const idx = allRegistrations.findIndex(a => String(a.id) === String(attendeeId));
    if (idx !== -1) {
      allRegistrations[idx] = { ...allRegistrations[idx], ...updates };
      currentViewingAttendee = allRegistrations[idx];

      // Auto-sinkronisasi anak-anak yang terhubung ke orang tua / wali ini
      const parentName = allRegistrations[idx].full_name;
      if (parentName) {
        const linkedChildren = allRegistrations.filter(a => 
          a.guardian_name && a.guardian_name.trim().toLowerCase() === parentName.trim().toLowerCase()
        );
        for (const child of linkedChildren) {
          await window.dataService.updateRegistration(child.id, updates);
          const cIdx = allRegistrations.findIndex(a => String(a.id) === String(child.id));
          if (cIdx !== -1) allRegistrations[cIdx] = { ...allRegistrations[cIdx], ...updates };
        }
        if (linkedChildren.length > 0) {
          showToast(`Kamar untuk ${linkedChildren.length} anak yang ikut "${parentName}" otomatis disinkronkan!`, 'info');
        }
      }
    }
    
    showToast(selectedRoom ? `Berhasil setting tempat: ${selectedRoom.room_name} (No. ${selectedRoom.room_number})` : 'Alokasi tempat berhasil dikosongkan.', 'success');

    // Refresh modal view and rekap table
    viewAttendeeDetail(attendeeId);
    applyRekapFilters();
  } catch (err) {
    console.error('Error saving room assignment:', err);
    showToast('Gagal menyimpan alokasi tempat: ' + err.message, 'error');
  }
}

function viewAttendeeDetail(id) {
  const attendee = allRegistrations.find(a => String(a.id) === String(id));
  if (!attendee) return;
  currentViewingAttendee = attendee;

  const modal = document.getElementById('attendeeDetailModal');
  const body = document.getElementById('attendeeModalBody');

  const ageNum = parseInt(attendee.age, 10);
  const isChild = attendee.is_child || (!isNaN(ageNum) && ageNum > 0 && ageNum < 15);

  body.innerHTML = `
    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div>
          <span class="badge-table-code">${attendee.registration_code}</span>
          <h3 style="font-size: 22px; margin-top: 6px; color: #ffffff;">${attendee.full_name}</h3>
          <span style="font-size: 13px; color: #fbbf24;">${attendee.gender} &bull; ${attendee.wilayah}${attendee.daerah ? ` &bull; ${attendee.daerah}` : ''}</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${isChild ? `<span class="badge-count-pill" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);"><i class="fa-solid fa-child"></i> ANAK-ANAK (${ageNum || '<15'} Th)</span>` : ''}
          <span class="badge-count-pill">${attendee.registration_type.toUpperCase()}</span>
        </div>
      </div>

      ${attendee.group_name ? `
        <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 4px; font-size: 13px; margin-top: 10px;">
          <strong>Rombongan:</strong> ${attendee.group_name}<br>
          <strong>Koordinator:</strong> ${attendee.group_leader_name || '-'}
        </div>
      ` : ''}
    </div>

    <!-- Alert Khusus Bila Peserta Anak di Bawah Umur -->
    ${isChild ? `
      <div style="margin-bottom: 20px; padding: 14px 16px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.45); display: flex; align-items: flex-start; gap: 12px;">
        <i class="fa-solid fa-child-reaching" style="font-size: 26px; color: #fbbf24; margin-top: 2px;"></i>
        <div style="flex: 1;">
          <strong style="color: #fbbf24; font-size: 14.5px; display: block; margin-bottom: 3px;">
            <i class="fa-solid fa-triangle-exclamation"></i> Peserta Di Bawah Umur (${ageNum ? ageNum + ' Tahun' : '< 15 Tahun'})
          </strong>
          <p style="font-size: 13px; color: #fef3c7; margin: 0; line-height: 1.5;">
            ${attendee.guardian_name 
              ? `Terdata mendampingi orang tua / wali: <strong style="color: #38bdf8;">${attendee.guardian_name}</strong>. Di tiket boarding pass, bagian kelompok otomatis dikosongkan dan kamar mengikuti kamar orang tuanya.`
              : `Peserta terdata sebagai anak di bawah umur. Di tiket boarding pass, bagian kelompok otomatis dikosongkan dan kamar mengikuti kamar orang tuanya.`}
          </p>
        </div>
      </div>
    ` : ''}

    <div class="ticket-info-grid" style="gap: 16px 20px;">
      <div class="ticket-item">
        <span class="item-label">Usia & Kategori</span>
        <strong class="item-val">
          ${attendee.age ? `${attendee.age} Tahun` : '-'} 
          ${isChild ? '<span style="color:#b45309; font-size:12px; margin-left:4px; font-weight:700;">(Anak-anak)</span>' : (attendee.age ? '<span style="color:#554d3f; font-size:12px; margin-left:4px;">(Dewasa)</span>' : '')}
        </strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">Alokasi Gedung / Kamar</span>
        <strong class="item-val" style="color: ${attendee.room_name || attendee.room_number ? '#8a6a24' : '#554d3f'};">
          ${attendee.building ? attendee.building + ' &bull; ' : ''}${attendee.room_name || (attendee.room_number ? 'Kamar ' + attendee.room_number : 'Belum Disetting')}
        </strong>
      </div>
      ${attendee.guardian_name ? `
        <div class="ticket-item" style="grid-column: 1 / -1; background: rgba(245, 158, 11, 0.08); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(245, 158, 11, 0.25);">
          <span class="item-label" style="color: #fbbf24;"><i class="fa-solid fa-people-roof"></i> Orang Tua / Wali Pendamping:</span>
          <strong class="item-val" style="color: #ffffff; font-size: 14px;">${attendee.guardian_name}</strong>
          <span style="font-size: 11.5px; color: #94a3b8; display: block; margin-top: 2px;">(Kamar anak ini otomatis mengikuti alokasi kamar orang tua tersebut)</span>
        </div>
      ` : ''}
      <div class="ticket-item">
        <span class="item-label">Alamat Email</span>
        <strong class="item-val">${attendee.email || '-'}</strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">Nomor WhatsApp</span>
        <strong class="item-val">${attendee.phone_number || '-'}</strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">HP Darurat (Keluarga)</span>
        <strong class="item-val" style="color: #f59e0b;">${attendee.emergency_phone || '-'}</strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">Ukuran Baju Seragam</span>
        <strong class="item-val">${attendee.cloth_size}</strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">Jadwal Kedatangan</span>
        <strong class="item-val">${attendee.arrival_date} &bull; Jam ${attendee.arrival_time || '10:00'}</strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">Transportasi Berangkat</span>
        <strong class="item-val">${attendee.transport_arrival}</strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">Jadwal Kepulangan</span>
        <strong class="item-val">${attendee.departure_date} &bull; Jam ${attendee.departure_time || '16:00'}</strong>
      </div>
      <div class="ticket-item">
        <span class="item-label">Transportasi Pulang</span>
        <strong class="item-val">${attendee.transport_departure}</strong>
      </div>
    </div>

    <!-- PANEL SETTING TEMPAT (GEDUNG & KAMAR) -->
    <div style="margin-top: 22px; padding: 18px; border-radius: var(--radius-md); background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.25);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <span class="item-label" style="color: #38bdf8; font-weight: 600; font-size: 13.5px;">
          <i class="fa-solid fa-bed"></i> Setting Tempat (Gedung & Kamar Penginapan):
        </span>
        ${(attendee.room_name || attendee.room_number) 
          ? `<span class="badge-count-pill" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); font-size: 11.5px;"><i class="fa-solid fa-circle-check"></i> Sudah Disetting</span>` 
          : `<span class="badge-count-pill" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 11.5px;"><i class="fa-solid fa-clock"></i> Belum Disetting</span>`}
      </div>

      <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 10px; align-items: center;">
        <select id="modalAttendeeRoomSelect" class="form-input" style="background: #0f172a; border-color: rgba(14, 165, 233, 0.4); color: #f8fafc; font-size: 13px;">
          <option value="">-- Kosongkan / Lepas Alokasi --</option>
          ${renderModalRoomOptions(attendee)}
        </select>
        <button type="button" class="btn btn-primary" onclick="saveAttendeeRoomAssignment('${attendee.id}')" style="padding: 10px 18px; font-size: 13px; white-space: nowrap; background: #0284c7;">
          <i class="fa-solid fa-floppy-disk"></i> Simpan Tempat
        </button>
      </div>

      <div id="modalAttendeeRoomCurrentInfo" style="margin-top: 10px; font-size: 12.5px; color: #94a3b8;">
        ${(attendee.room_name || attendee.room_number) 
          ? `Status Penempatan Saat Ini: <strong style="color: #38bdf8;">${attendee.building ? attendee.building + ' &bull; ' : ''}${attendee.room_name || ''} (No. ${attendee.room_number || '-'})</strong>` 
          : '<em>Peserta ini belum dialokasikan ke gedung/kamar mana pun. Pilih opsi di atas lalu klik "Simpan Tempat".</em>'}
      </div>
    </div>

    <div style="margin-top: 18px; padding: 14px; border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.25);">
      <span class="item-label" style="color: #fb7185;"><i class="fa-solid fa-heart-pulse"></i> Riwayat Kesehatan / Penyakit Kambuhan:</span>
      <p style="font-size: 14px; color: #f8fafc; margin-top: 4px;">${attendee.medical_history || 'Tidak Ada (Sehat)'}</p>
    </div>

    ${attendee.notes ? `
      <div style="margin-top: 14px;">
        <span class="item-label">Catatan Khusus:</span>
        <p style="font-size: 13.5px; color: #94a3b8; margin-top: 4px;">${attendee.notes}</p>
      </div>
    ` : ''}
  `;

  modal.classList.add('active');
}

function closeAttendeeModal() {
  const modal = document.getElementById('attendeeDetailModal');
  if (modal) modal.classList.remove('active');
}

function printFromAttendeeDetail() {
  if (currentViewingAttendee) {
    closeAttendeeModal();
    showTicketModal(currentViewingAttendee);
  }
}

async function confirmDeleteAttendee(id, name) {
  if (confirm(`Apakah Anda yakin ingin menghapus data peserta "${name}"?`)) {
    await window.dataService.deleteRegistration(id);
    showToast(`Data peserta "${name}" telah dihapus.`, 'info');
    await loadAndRenderRegistrations();
  }
}

// ===================================================================
// 7. CHART.JS VISUAL ANALYTICS (INTERACTIVE CATEGORY SWITCHER)
// ===================================================================
function toggleChartsVisibility() {
  const body = document.getElementById('chartsBody');
  const btn = document.getElementById('btnToggleChart');
  if (!body) return;

  const isCollapsed = body.style.display === 'none';
  body.style.display = isCollapsed ? 'block' : 'none';
  if (btn) {
    btn.innerHTML = isCollapsed 
      ? '<i class="fa-solid fa-chevron-up"></i>' 
      : '<i class="fa-solid fa-chevron-down"></i>';
  }
}

function switchChartTab(tabName) {
  currentChartTab = tabName;

  // Update tab pill active state
  const tabs = document.querySelectorAll('#chartSelectorTabs .chart-tab-pill');
  tabs.forEach(btn => {
    if (btn.getAttribute('data-chart') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Panels mapping
  const panels = {
    cloth: document.getElementById('chartViewCloth'),
    transport: document.getElementById('chartViewTransport'),
    wilayah: document.getElementById('chartViewWilayah'),
    gender: document.getElementById('chartViewGender'),
    all: document.getElementById('chartViewAll')
  };

  Object.entries(panels).forEach(([key, panel]) => {
    if (panel) {
      panel.style.display = (key === tabName) ? 'block' : 'none';
    }
  });

  // Re-render chart for selected view
  setTimeout(() => {
    renderCharts();
  }, 50);
}

function renderCharts() {
  if (!window.Chart) return;

  const totalOrang = allRegistrations.length;

  // --- 1. DATA COMPUTATION ---
  // Cloth
  const clothCounts = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, '3XL': 0, '4XL': 0 };
  allRegistrations.forEach(r => {
    if (clothCounts[r.cloth_size] !== undefined) clothCounts[r.cloth_size]++;
  });
  let topCloth = '-';
  let topClothCount = 0;
  for (const [s, c] of Object.entries(clothCounts)) {
    if (c > topClothCount) { topClothCount = c; topCloth = s; }
  }
  const topClothPct = totalOrang > 0 ? Math.round((topClothCount / totalOrang) * 100) : 0;
  const sumStd = (clothCounts['M'] || 0) + (clothCounts['L'] || 0) + (clothCounts['XL'] || 0);
  const stdPct = totalOrang > 0 ? Math.round((sumStd / totalOrang) * 100) : 0;
  const sumBig = (clothCounts['XXL'] || 0) + (clothCounts['3XL'] || 0) + (clothCounts['4XL'] || 0);
  const bigPct = totalOrang > 0 ? Math.round((sumBig / totalOrang) * 100) : 0;

  // Transport
  const transportCounts = {};
  allRegistrations.forEach(r => {
    const t = r.transport_arrival || 'Lainnya';
    transportCounts[t] = (transportCounts[t] || 0) + 1;
  });
  let topTransport = '-';
  let topTransportCount = 0;
  for (const [t, c] of Object.entries(transportCounts)) {
    if (c > topTransportCount) { topTransportCount = c; topTransport = t; }
  }
  const topTransportPct = totalOrang > 0 ? Math.round((topTransportCount / totalOrang) * 100) : 0;

  // Wilayah (Grouped case-insensitively, identical region names merged automatically)
  const wilayahAggregated = {};
  allRegistrations.forEach(r => {
    if (r.wilayah) {
      const w = normalizeWilayahName(r.wilayah);
      if (!wilayahAggregated[w]) {
        wilayahAggregated[w] = {
          name: w,
          count: 0,
          male: 0,
          female: 0,
          individu: 0,
          kelompok: 0
        };
      }
      wilayahAggregated[w].count += 1;
      if (r.gender === 'Laki-laki') wilayahAggregated[w].male += 1;
      else if (r.gender === 'Perempuan') wilayahAggregated[w].female += 1;
      if (r.registration_type === 'individu') wilayahAggregated[w].individu += 1;
      else if (r.registration_type === 'kelompok') wilayahAggregated[w].kelompok += 1;
    }
  });

  const sortedWilayahList = Object.values(wilayahAggregated).sort((a, b) => b.count - a.count);
  const sortedWilayah = sortedWilayahList.map(item => [item.name, item.count]);
  const topWilayahEntries = sortedWilayah.slice(0, 8);
  const topWilayahName = sortedWilayah.length > 0 ? sortedWilayah[0][0] : '-';
  const topWilayahCount = sortedWilayah.length > 0 ? sortedWilayah[0][1] : 0;
  const topWilayahPct = totalOrang > 0 ? Math.round((topWilayahCount / totalOrang) * 100) : 0;

  // Gender & Type
  const male = allRegistrations.filter(r => r.gender === 'Laki-laki').length;
  const female = allRegistrations.filter(r => r.gender === 'Perempuan').length;
  const malePct = totalOrang > 0 ? Math.round((male / totalOrang) * 100) : 0;
  const femalePct = totalOrang > 0 ? (100 - malePct) : 0;
  const individu = allRegistrations.filter(r => r.registration_type === 'individu').length;
  const kelompok = allRegistrations.filter(r => r.registration_type === 'kelompok').length;
  const indPct = totalOrang > 0 ? Math.round((individu / totalOrang) * 100) : 0;
  const kelPct = totalOrang > 0 ? (100 - indPct) : 0;

  // Render Rekapitulasi Peserta per Daerah Table
  renderRekapWilayahSummaryTable(sortedWilayahList, totalOrang, male, female, individu, kelompok);

  // --- 2. POPULATE INSIGHT PODS & TAGS ---
  const tagCloth = document.getElementById('tagClothLead');
  if (tagCloth) tagCloth.textContent = `Ukuran Terbanyak: ${topCloth} (${topClothCount} Org)`;

  const listCloth = document.getElementById('clothInsightList');
  if (listCloth) {
    listCloth.innerHTML = `
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-users text-green"></i> Total Kebutuhan Pakaian</span>
        <span class="insight-item-val">${totalOrang} Potong</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-award text-green"></i> Ukuran Terbanyak</span>
        <span class="insight-item-val">${topCloth} (${topClothCount} Orang / ${topClothPct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-circle-check text-green"></i> Ukuran Standar (M, L, XL)</span>
        <span class="insight-item-val">${sumStd} Orang (${stdPct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-arrow-up-right-dots text-green"></i> Ukuran Ekstra (XXL - 4XL)</span>
        <span class="insight-item-val">${sumBig} Orang (${bigPct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-shirt text-green"></i> Ukuran Kecil (S)</span>
        <span class="insight-item-val">${clothCounts['S'] || 0} Orang</span>
      </div>
    `;
  }

  const tagTrans = document.getElementById('tagTransportLead');
  if (tagTrans) tagTrans.textContent = `Moda Terbanyak: ${topTransport} (${topTransportCount} Org)`;

  const listTrans = document.getElementById('transportInsightList');
  if (listTrans) {
    const itemsHtml = Object.entries(transportCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([mod, cnt]) => {
        const p = totalOrang > 0 ? Math.round((cnt / totalOrang) * 100) : 0;
        return `
          <div class="insight-item">
            <span class="insight-item-name"><i class="fa-solid fa-circle-dot text-green"></i> ${mod}</span>
            <span class="insight-item-val">${cnt} Orang (${p}%)</span>
          </div>
        `;
      }).join('');
    listTrans.innerHTML = itemsHtml || '<div class="insight-item"><span>Belum ada data armada</span></div>';
  }

  const tagWil = document.getElementById('tagWilayahLead');
  if (tagWil) tagWil.textContent = `Daerah Utama: ${topWilayahName} (${topWilayahCount} Org)`;

  const listWil = document.getElementById('wilayahInsightList');
  if (listWil) {
    listWil.innerHTML = `
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-earth-asia text-green"></i> Total Cakupan Wilayah</span>
        <span class="insight-item-val">${sortedWilayah.length} Kota/Kab</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-location-pin text-green"></i> Daerah Asal Terbanyak</span>
        <span class="insight-item-val">${topWilayahName} (${topWilayahCount} Org / ${topWilayahPct}%)</span>
      </div>
    ` + topWilayahEntries.slice(0, 4).map(([w, c], idx) => {
      const p = totalOrang > 0 ? Math.round((c / totalOrang) * 100) : 0;
      return `
        <div class="insight-item">
          <span class="insight-item-name"><i class="fa-solid fa-caret-right text-green"></i> #${idx + 1} ${w}</span>
          <span class="insight-item-val">${c} Orang (${p}%)</span>
        </div>
      `;
    }).join('');
  }

  const tagGen = document.getElementById('tagGenderLead');
  if (tagGen) tagGen.textContent = `${male} Ikhwan (${malePct}%) \u2022 ${female} Akhwat (${femalePct}%)`;

  const tagType = document.getElementById('tagTypeLead');
  if (tagType) tagType.textContent = `${individu} Mandiri (${indPct}%) \u2022 ${kelompok} Rombongan (${kelPct}%)`;

  const listGen = document.getElementById('genderInsightList');
  if (listGen) {
    listGen.innerHTML = `
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-mars text-green"></i> Peserta Ikhwan (Laki-laki)</span>
        <span class="insight-item-val">${male} Orang (${malePct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-venus text-green"></i> Peserta Akhwat (Perempuan)</span>
        <span class="insight-item-val">${female} Orang (${femalePct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-user text-green"></i> Pendaftar Mandiri</span>
        <span class="insight-item-val">${individu} Orang (${indPct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-users text-green"></i> Peserta Rombongan (Kafilah)</span>
        <span class="insight-item-val">${kelompok} Orang (${kelPct}%)</span>
      </div>
    `;
  }

  // --- 3. CHART RENDERING ENGINE BASED ON ACTIVE TAB ---

  // Chart Function: Cloth
  function renderClothChart(canvasId, refInstance, isDoughnut = false) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (refInstance) refInstance.destroy();

    const maxVal = Math.max(0, ...Object.values(clothCounts));

    // Plugin custom untuk menampilkan angka ukuran terpampang langsung di atas batang grafik
    const barValuesPlugin = {
      id: 'barValuesPlugin',
      afterDatasetsDraw(chart) {
        const { ctx, data } = chart;
        ctx.save();
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach((bar, index) => {
          const val = data.datasets[0].data[index];
          ctx.font = 'bold 12.5px "Outfit", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          if (val > 0) {
            ctx.fillStyle = '#132a1c';
            ctx.fillText(`${val} Org`, bar.x, bar.y - 5);
          } else {
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('0', bar.x, bar.y - 5);
          }
        });
        ctx.restore();
      }
    };

    return new Chart(ctx, {
      type: 'bar',
      plugins: [barValuesPlugin],
      data: {
        labels: Object.keys(clothCounts),
        datasets: [{
          label: 'Jumlah Peserta',
          data: Object.values(clothCounts),
          backgroundColor: [
            '#1e4620', '#265934', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#b7dfc8'
          ],
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 24
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#132a1c',
            titleColor: '#ffffff',
            bodyColor: '#eaf4ee',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.parsed.y} Orang Peserta (Ukuran ${context.label})`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(2, maxVal + 1),
            ticks: { color: '#52796f', precision: 0, font: { weight: '600' } },
            grid: { color: '#edf4f0' }
          },
          x: {
            ticks: { color: '#132a1c', font: { weight: '700' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Plugin custom untuk menampilkan angka kuota peserta langsung di atas irisan pie/doughnut chart
  const doughnutSliceValuesPlugin = {
    id: 'doughnutSliceValuesPlugin',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data) return;

      meta.data.forEach((arc, index) => {
        const val = data.datasets[0].data[index];
        if (!val || val <= 0) return;

        let x = 0;
        let y = 0;
        if (typeof arc.tooltipPosition === 'function') {
          const pos = arc.tooltipPosition();
          x = pos.x;
          y = pos.y;
        } else if (arc.x !== undefined && arc.y !== undefined) {
          const midAngle = (arc.startAngle + arc.endAngle) / 2;
          const midRadius = (arc.innerRadius + arc.outerRadius) / 2;
          x = arc.x + Math.cos(midAngle) * midRadius;
          y = arc.y + Math.sin(midAngle) * midRadius;
        }

        const angleSpan = Math.abs(arc.endAngle - arc.startAngle);
        if (angleSpan < 0.12) return;

        ctx.save();
        ctx.font = 'bold 12.5px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const labelText = angleSpan < 0.35 ? `${val}` : `${val} Org`;

        // Dark outline for clear legibility on all slice backgrounds
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(10, 20, 15, 0.65)';
        ctx.strokeText(labelText, x, y);

        // Crisp white text fill
        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, x, y);
        ctx.restore();
      });
    }
  };

  // Chart Function: Transport
  function renderTransportChart(canvasId, refInstance) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (refInstance) refInstance.destroy();
    return new Chart(ctx, {
      type: 'doughnut',
      plugins: [doughnutSliceValuesPlugin],
      data: {
        labels: Object.keys(transportCounts),
        datasets: [{
          data: Object.values(transportCounts),
          backgroundColor: [
            '#1e4620', '#2d6a4f', '#40916c', '#d4af37', '#e28743', '#8b5cf6', '#0284c7', '#64748b'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#132a1c', font: { size: 12, weight: '600' }, boxWidth: 14 }
          },
          tooltip: {
            backgroundColor: '#132a1c',
            titleColor: '#ffffff',
            bodyColor: '#eaf4ee',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw || 0;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${val} Orang (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Chart Function: Wilayah (Horizontal Bar)
  function renderWilayahChart(canvasId, refInstance) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (refInstance) refInstance.destroy();

    const maxWVal = topWilayahEntries.length > 0 ? Math.max(...topWilayahEntries.map(e => e[1])) : 0;

    const horizontalBarValuesPlugin = {
      id: 'horizontalBarValuesPlugin',
      afterDatasetsDraw(chart) {
        const { ctx, data } = chart;
        ctx.save();
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach((bar, index) => {
          const val = data.datasets[0].data[index];
          if (val > 0) {
            ctx.fillStyle = '#132a1c';
            ctx.font = 'bold 12px "Outfit", sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${val} Org`, bar.x + 8, bar.y);
          }
        });
        ctx.restore();
      }
    };

    return new Chart(ctx, {
      type: 'bar',
      plugins: [horizontalBarValuesPlugin],
      data: {
        labels: topWilayahEntries.map(e => e[0]),
        datasets: [{
          label: 'Jumlah Peserta',
          data: topWilayahEntries.map(e => e[1]),
          backgroundColor: '#2d6a4f',
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 42
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#132a1c',
            titleColor: '#ffffff',
            bodyColor: '#eaf4ee',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.parsed.x} Orang (${context.label})`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            suggestedMax: Math.max(2, maxWVal + 1),
            ticks: { color: '#52796f', precision: 0 },
            grid: { color: '#edf4f0' }
          },
          y: {
            ticks: { color: '#132a1c', font: { weight: '700' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Chart Function: Gender Only (Ikhwan vs Akhwat)
  function renderGenderChart(canvasId, refInstance) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (refInstance) refInstance.destroy();
    return new Chart(ctx, {
      type: 'doughnut',
      plugins: [doughnutSliceValuesPlugin],
      data: {
        labels: ['Peserta Ikhwan (L)', 'Peserta Akhwat (P)'],
        datasets: [{
          label: 'Gender',
          data: [male, female],
          backgroundColor: ['#1b4332', '#d4838f'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#132a1c', font: { size: 12, weight: '600' }, boxWidth: 14 }
          },
          tooltip: {
            backgroundColor: '#132a1c',
            titleColor: '#ffffff',
            bodyColor: '#eaf4ee',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const total = male + female;
                const val = context.raw || 0;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${val} Orang (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Chart Function: Tipe Kepesertaan Only (Mandiri vs Rombongan)
  function renderTypeChart(canvasId, refInstance) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (refInstance) refInstance.destroy();
    return new Chart(ctx, {
      type: 'doughnut',
      plugins: [doughnutSliceValuesPlugin],
      data: {
        labels: ['Pendaftar Mandiri', 'Peserta Rombongan (Kafilah)'],
        datasets: [{
          label: 'Tipe Kepesertaan',
          data: [individu, kelompok],
          backgroundColor: ['#40916c', '#d4af37'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#132a1c', font: { size: 12, weight: '600' }, boxWidth: 14 }
          },
          tooltip: {
            backgroundColor: '#132a1c',
            titleColor: '#ffffff',
            bodyColor: '#eaf4ee',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const total = individu + kelompok;
                const val = context.raw || 0;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${val} Orang (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Execute chart renders according to selected tab
  if (currentChartTab === 'cloth') {
    chartClothInstance = renderClothChart('chartClothSize', chartClothInstance);
  } else if (currentChartTab === 'transport') {
    chartTransportInstance = renderTransportChart('chartTransport', chartTransportInstance);
  } else if (currentChartTab === 'wilayah') {
    chartWilayahInstance = renderWilayahChart('chartWilayah', chartWilayahInstance);
  } else if (currentChartTab === 'gender') {
    chartGenderInstance = renderGenderChart('chartGenderOnly', chartGenderInstance);
    chartTypeInstance = renderTypeChart('chartTypeOnly', chartTypeInstance);
  } else if (currentChartTab === 'all') {
    chartClothAllInstance = renderClothChart('chartClothSizeAll', chartClothAllInstance);
    chartTransportAllInstance = renderTransportChart('chartTransportAll', chartTransportAllInstance);
    chartWilayahAllInstance = renderWilayahChart('chartWilayahAll', chartWilayahAllInstance);
    chartGenderAllInstance = renderGenderChart('chartGenderAll', chartGenderAllInstance);
  }
}

/**
 * Render Tabel Rekapitulasi Jumlah Peserta per Daerah Asal Kafilah
 * Mengakumulasikan kuota peserta per daerah, jika ada nama daerah yang sama langsung ditambahkan jumlahnya.
 */
function renderRekapWilayahSummaryTable(sortedList, totalOrang, male, female, individu, kelompok) {
  const tbody = document.getElementById('rekapWilayahSummaryTableBody');
  const badge = document.getElementById('rekapWilayahTotalBadge');
  const sumTotal = document.getElementById('rekapWilayahSumTotal');
  const sumGender = document.getElementById('rekapWilayahSumGender');
  const sumType = document.getElementById('rekapWilayahSumType');

  if (badge) badge.textContent = `${sortedList.length} Daerah Terdata`;
  if (sumTotal) sumTotal.textContent = `${totalOrang} Orang`;
  if (sumGender) sumGender.textContent = `${male} L / ${female} P`;
  if (sumType) sumType.textContent = `${individu} Mandiri / ${kelompok} Rombongan`;

  if (!tbody) return;

  if (sortedList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #64748b; padding: 26px;">
          <i class="fa-solid fa-map-location-dot" style="font-size: 24px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
          Belum ada data pendaftar daerah asal kafilah.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = sortedList.map((item, idx) => {
    const pct = totalOrang > 0 ? ((item.count / totalOrang) * 100).toFixed(1) : 0;
    const rankBadge = idx === 0 
      ? '<span style="color: #fbbf24; font-weight: 800;"><i class="fa-solid fa-crown"></i> 1</span>'
      : (idx === 1 ? '<span style="color: #94a3b8; font-weight: 700;">2</span>' 
      : (idx === 2 ? '<span style="color: #b45309; font-weight: 700;">3</span>' : `${idx + 1}`));

    return `
      <tr>
        <td style="text-align: center;">${rankBadge}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-location-dot" style="color: #2d6a4f; font-size: 13px;"></i>
            <strong style="color: #132a1c;">${escapeHtml(item.name)}</strong>
          </div>
        </td>
        <td style="text-align: center;">
          <span style="font-size: 14px; font-weight: 800; color: #132a1c;">${item.count}</span>
          <span style="font-size: 11.5px; color: #64748b;"> Org</span>
        </td>
        <td style="text-align: center;">
          <span class="badge" style="background: rgba(45, 106, 79, 0.12); color: #2d6a4f; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
            ${pct}%
          </span>
        </td>
        <td style="text-align: center; font-size: 12.5px;">
          <span style="color: #0284c7; font-weight: 600;"><i class="fa-solid fa-mars"></i> ${item.male}</span> &bull; 
          <span style="color: #db2777; font-weight: 600;"><i class="fa-solid fa-venus"></i> ${item.female}</span>
        </td>
        <td style="text-align: center; font-size: 12.5px; color: #475569;">
          <span>${item.individu} Mandiri</span> &bull; <span>${item.kelompok} Rombongan</span>
        </td>
      </tr>
    `;
  }).join('');
}

// ===================================================================
// 8. DATA EXPORTS (EXCEL & CSV)
// ===================================================================
function exportToExcel() {
  if (!window.XLSX) {
    showToast('Pustaka Excel sedang dimuat, coba sebentar lagi.', 'error');
    return;
  }

  const exportData = filteredRegistrations.map((item, idx) => ({
    'No': idx + 1,
    'Kode Tiket': item.registration_code,
    'Tipe Registrasi': item.registration_type,
    'Nama Kelompok': item.group_name || '-',
    'Koordinator Kelompok': item.group_leader_name || '-',
    'Nama Peserta': item.full_name,
    'Usia': item.age ? `${item.age} Th` : '-',
    'Kategori Usia': (item.is_child || (item.age && item.age < 15)) ? 'Anak-anak (<15)' : (item.age ? 'Dewasa' : '-'),
    'Orang Tua / Wali': item.guardian_name || '-',
    'Gedung / Asrama': item.building || '-',
    'Kamar / Tenda': item.room_name ? `${item.room_name} (No. ${item.room_number || '-'})` : (item.room_number || '-'),
    'Jenis Kelamin': item.gender,
    'Wilayah': item.wilayah,
    'Daerah': item.daerah || '-',
    'Email': item.email || '-',
    'No WhatsApp': item.phone_number || '-',
    'No HP Darurat': item.emergency_phone || '-',
    'Tgl Kedatangan': item.arrival_date,
    'Jam Kedatangan': item.arrival_time,
    'Transport Berangkat': item.transport_arrival,
    'Tgl Kepulangan': item.departure_date,
    'Jam Kepulangan': item.departure_time,
    'Transport Pulang': item.transport_departure,
    'Ukuran Baju': item.cloth_size,
    'Riwayat Medis': item.medical_history || 'Tidak Ada',
    'Catatan': item.notes || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Peserta Paskas');
  
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Rekap_Peserta_Paskas_Bahagia_${dateStr}.xlsx`);
  showToast('File Excel berhasil diunduh!', 'success');
}

function exportToCSV() {
  const headers = [
    'No', 'Kode Tiket', 'Tipe', 'Nama Peserta', 'Usia', 'Kategori Usia', 'Orang Tua / Wali', 'Gedung', 'Kamar',
    'Gender', 'Wilayah', 'Daerah', 'Email', 'No WA', 'HP Darurat',
    'Tgl Datang', 'Kendaraan Datang', 'Tgl Pulang', 'Kendaraan Pulang', 
    'Ukuran Baju', 'Riwayat Medis'
  ];

  const rows = filteredRegistrations.map((item, idx) => [
    idx + 1,
    `"${item.registration_code}"`,
    `"${item.registration_type}"`,
    `"${item.full_name}"`,
    `"${item.age ? item.age + ' Th' : '-'}"`,
    `"${(item.is_child || (item.age && item.age < 15)) ? 'Anak-anak' : (item.age ? 'Dewasa' : '-')}"`,
    `"${(item.guardian_name || '-').replace(/"/g, '""')}"`,
    `"${(item.building || '-').replace(/"/g, '""')}"`,
    `"${(item.room_name ? item.room_name + ' (No. ' + (item.room_number || '-') + ')' : (item.room_number || '-')).replace(/"/g, '""')}"`,
    `"${item.gender}"`,
    `"${item.wilayah}"`,
    `"${item.daerah || ''}"`,
    `"${item.email || ''}"`,
    `"${item.phone_number || ''}"`,
    `"${item.emergency_phone || ''}"`,
    `"${item.arrival_date}"`,
    `"${item.transport_arrival}"`,
    `"${item.departure_date}"`,
    `"${item.transport_departure}"`,
    `"${item.cloth_size}"`,
    `"${(item.medical_history || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
    [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Rekap_Paskas_Bahagia_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('File CSV berhasil diunduh!', 'success');
}

// ===================================================================
// 9. SETTINGS PAGE (DEADLINE, SUPABASE, EVENT INFO & CARDS)
// ===================================================================
function initSettingsPage(defaultTab = 'rekap') {
  const settings = window.dataService.getSettings();
  const credentials = window.dataService.getCredentials();

  const deadlineInput = document.getElementById('cfg_deadlineTime');
  const regStatusInput = document.getElementById('cfg_registrationStatus');
  const statusLabel = document.getElementById('cfg_statusLabel');
  const closedMsgInput = document.getElementById('cfg_closedMessage');
  const supabaseUrlInput = document.getElementById('cfg_supabaseUrl');
  const supabaseKeyInput = document.getElementById('cfg_supabaseKey');
  const eventHeadlineInput = document.getElementById('cfg_eventHeadline');
  const eventNameInput = document.getElementById('cfg_eventName');
  const eventLocationInput = document.getElementById('cfg_eventLocation');
  const eventDescInput = document.getElementById('cfg_eventDesc');

  if (deadlineInput) deadlineInput.value = settings.registration_deadline || '2026-12-31T23:59';
  if (regStatusInput) regStatusInput.checked = settings.is_registration_open !== 'false';
  if (statusLabel) statusLabel.textContent = settings.is_registration_open !== 'false' ? 'Pendaftaran DIBUKA' : 'Pendaftaran DITUTUP';
  if (closedMsgInput) closedMsgInput.value = settings.closed_message || '';

  if (supabaseUrlInput) supabaseUrlInput.value = credentials.url || '';
  if (supabaseKeyInput) supabaseKeyInput.value = credentials.key || '';

  if (eventHeadlineInput) eventHeadlineInput.value = settings.event_headline || 'PASKAS BAHAGIA';
  if (eventNameInput) eventNameInput.value = settings.event_name || '';
  if (eventLocationInput) eventLocationInput.value = settings.event_location || '';
  if (eventDescInput) eventDescInput.value = settings.event_desc || '';

  renderSettingsCardsManager();
  populateRegistrationContentSettings();
  renderSettingsWilayahManager();
  renderSettingsRoomsAndGroupsManager();
  loadTicketTemplateSettings();

  // Update Magazine Seal Header Pills
  const magTotal = document.getElementById('magPillTotal');
  if (magTotal) magTotal.textContent = allRegistrations.length + ' Jiwa';

  const magDb = document.getElementById('magPillDb');
  if (magDb) {
    const isCloud = window.dataService && window.dataService.isSupabaseConfigured && window.dataService.isSupabaseConfigured();
    magDb.textContent = isCloud ? 'Cloud Supabase' : 'Lokal Aktif';
  }

  const cleanTab = (defaultTab || 'rekap').replace('tab-', '');
  switchSettingsTab(cleanTab);
}

// ===================================================================
// ADMIN AUTHENTICATION & PASSWORD PROTECTION FOR SETTINGS
// ===================================================================
let isAdminLoggedIn = false;
let pendingAuthTargetTab = 'rekap';

function getAdminPassword() {
  return localStorage.getItem('paskas_admin_password') || 'admin123';
}

function openSettingsWithAuth(targetTab = 'rekap') {
  pendingAuthTargetTab = targetTab;
  if (isAdminLoggedIn) {
    navigateTo('settings');
    const cleanTab = (targetTab || 'rekap').replace('tab-', '');
    switchSettingsTab(cleanTab);
    return;
  }

  const modal = document.getElementById('adminAuthModal');
  const input = document.getElementById('adminPasswordInput');
  const errEl = document.getElementById('adminAuthError');
  const card = modal?.querySelector('.modal-auth-green-card, .modal-auth-sleek-card, .modal-auth-card');

  if (errEl) errEl.style.display = 'none';
  if (card) card.classList.remove('shake-animation');
  if (input) {
    input.value = '';
    input.type = 'password';
  }
  if (modal) modal.classList.add('active');

  setTimeout(() => {
    if (input) input.focus();
  }, 120);
}

function closeAdminAuthModal() {
  const modal = document.getElementById('adminAuthModal');
  if (modal) modal.classList.remove('active');
}

function submitAdminPassword() {
  const input = document.getElementById('adminPasswordInput');
  const errEl = document.getElementById('adminAuthError');
  const card = document.querySelector('#adminAuthModal .modal-auth-green-card, #adminAuthModal .modal-auth-sleek-card, #adminAuthModal .modal-auth-card');
  const entered = (input?.value || '').trim();

  if (entered === getAdminPassword()) {
    isAdminLoggedIn = true;
    closeAdminAuthModal();
    navigateTo('settings');
    const cleanTab = (pendingAuthTargetTab || 'rekap').replace('tab-', '');
    switchSettingsTab(cleanTab);
    showToast('Akses administrator berhasil diverifikasi!', 'success');
  } else {
    if (errEl) errEl.style.display = 'flex';
    if (card) {
      card.classList.remove('shake-animation');
      void card.offsetWidth; // force reflow
      card.classList.add('shake-animation');
    }
    if (input) {
      input.select();
      input.focus();
    }
  }
}

function lockAdminSession() {
  isAdminLoggedIn = false;
  navigateTo('dashboard');
  showToast('Sesi administrator telah dikunci.', 'info');
}

function saveNewAdminPassword() {
  const curInput = document.getElementById('cfg_currentAdminPassword');
  const newInput = document.getElementById('cfg_newAdminPassword');
  const confInput = document.getElementById('cfg_confirmAdminPassword');

  const curVal = (curInput?.value || '').trim();
  const newVal = (newInput?.value || '').trim();
  const confVal = (confInput?.value || '').trim();

  if (curVal !== getAdminPassword()) {
    showToast('Kata sandi saat ini tidak sesuai!', 'error');
    if (curInput) { curInput.focus(); curInput.select(); }
    return;
  }

  if (newVal.length < 4) {
    showToast('Kata sandi baru minimal 4 karakter.', 'warning');
    if (newInput) newInput.focus();
    return;
  }

  if (newVal !== confVal) {
    showToast('Konfirmasi kata sandi baru tidak cocok!', 'warning');
    if (confInput) confInput.focus();
    return;
  }

  localStorage.setItem('paskas_admin_password', newVal);
  if (curInput) curInput.value = '';
  if (newInput) newInput.value = '';
  if (confInput) confInput.value = '';

  showToast('Kata sandi admin berhasil diperbarui!', 'success');
}

function resetAdminPasswordDefault() {
  if (confirm('Kembalikan kata sandi admin ke setelan awal bawaan (admin123)?')) {
    localStorage.removeItem('paskas_admin_password');
    const curInput = document.getElementById('cfg_currentAdminPassword');
    const newInput = document.getElementById('cfg_newAdminPassword');
    const confInput = document.getElementById('cfg_confirmAdminPassword');
    if (curInput) curInput.value = '';
    if (newInput) newInput.value = '';
    if (confInput) confInput.value = '';
    showToast('Kata sandi admin dikembalikan ke bawaan: admin123', 'info');
  }
}

function lockSettingsSession() {
  isAdminLoggedIn = false;
  showToast('Sesi administrator telah dikunci kembali.', 'info');
  navigateTo('dashboard');
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  const icon = btnEl?.querySelector('i');
  if (icon) {
    icon.className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  }
}

function openSettingsModal(defaultTab = 'deadline') {
  openSettingsWithAuth(defaultTab);
}

function closeSettingsModal() {
  navigateTo('dashboard');
}

const SETTINGS_CATEGORIES = {
  tampilan: ['rekap', 'info', 'deadline', 'reg-content', 'wilayah', 'ticket-template', 'kamar-kelompok'],
  web: ['supabase', 'security', 'deploy']
};

let currentSettingsCategory = 'tampilan';

function switchSettingsCategory(catName) {
  currentSettingsCategory = catName;

  // 1. Gambar 1: Toggle 2 Master Classification Cards
  const cardTampilan = document.getElementById('workCard-tampilan');
  const cardWeb = document.getElementById('workCard-web');
  if (cardTampilan) cardTampilan.classList.toggle('active', catName === 'tampilan');
  if (cardWeb) cardWeb.classList.toggle('active', catName === 'web');

  document.querySelectorAll('.settings-cat-btn, .mag-cat-card, .settings-cat-master-card').forEach(btn => {
    btn.classList.toggle('active', btn.id === `catBtn-${catName}`);
  });

  // 2. Gambar 2: Toggle Sub-Items View
  const viewTampilan = document.getElementById('magCategoryItems-tampilan');
  const viewWeb = document.getElementById('magCategoryItems-web');
  if (viewTampilan) viewTampilan.style.display = catName === 'tampilan' ? 'block' : 'none';
  if (viewWeb) viewWeb.style.display = catName === 'web' ? 'block' : 'none';

  // 3. Update category title indicator
  const lbl = document.getElementById('lblCurrentCatTitle');
  if (lbl) {
    lbl.innerHTML = catName === 'web' 
      ? '<i class="fa-solid fa-server text-gold"></i> SUB-MENU: PENGATURAN WEB &amp; SISTEM' 
      : '<i class="fa-solid fa-layer-group text-gold"></i> SUB-MENU: PENGATURAN TAMPILAN';
  }

  // 4. Toggle subtabs group buttons
  const groupTampilan = document.getElementById('subtabsGroup-tampilan');
  const groupWeb = document.getElementById('subtabsGroup-web');
  if (groupTampilan) groupTampilan.style.display = catName === 'tampilan' ? 'flex' : 'none';
  if (groupWeb) groupWeb.style.display = catName === 'web' ? 'flex' : 'none';

  // 5. Automatically switch tab if current panel is not in this category
  const activePanel = document.querySelector('.settings-tab-panel.active');
  const activeTabName = activePanel ? activePanel.id.replace('settingsPanel-', '') : '';
  const tabsInCat = SETTINGS_CATEGORIES[catName] || [];

  if (!tabsInCat.includes(activeTabName)) {
    const defaultTab = catName === 'web' ? 'supabase' : 'rekap';
    switchSettingsTab(defaultTab);
  } else {
    // Re-highlight the active subitem in Gambar 2
    document.querySelectorAll('.mag-subitem-card').forEach(item => {
      item.classList.toggle('active', item.id === `subitem-${activeTabName}`);
    });
  }
}

function switchSettingsTab(tabName) {
  // Determine category for this tab
  let catForTab = 'tampilan';
  if (SETTINGS_CATEGORIES.web.includes(tabName)) {
    catForTab = 'web';
  }

  currentSettingsCategory = catForTab;

  // 1. Gambar 1: Highlight active category card
  const cardTampilan = document.getElementById('workCard-tampilan');
  const cardWeb = document.getElementById('workCard-web');
  if (cardTampilan) cardTampilan.classList.toggle('active', catForTab === 'tampilan');
  if (cardWeb) cardWeb.classList.toggle('active', catForTab === 'web');

  // 2. Gambar 2: Toggle sub-items view & highlight active sub-item card
  const viewTampilan = document.getElementById('magCategoryItems-tampilan');
  const viewWeb = document.getElementById('magCategoryItems-web');
  if (viewTampilan) viewTampilan.style.display = catForTab === 'tampilan' ? 'block' : 'none';
  if (viewWeb) viewWeb.style.display = catForTab === 'web' ? 'block' : 'none';

  document.querySelectorAll('.mag-subitem-card').forEach(item => {
    item.classList.toggle('active', item.id === `subitem-${tabName}`);
  });

  // 3. Category Indicator & Subtabs
  const lbl = document.getElementById('lblCurrentCatTitle');
  if (lbl) {
    lbl.innerHTML = catForTab === 'web' 
      ? '<i class="fa-solid fa-server text-gold"></i> SUB-MENU: PENGATURAN WEB &amp; SISTEM' 
      : '<i class="fa-solid fa-layer-group text-gold"></i> SUB-MENU: PENGATURAN TAMPILAN';
  }

  const groupTampilan = document.getElementById('subtabsGroup-tampilan');
  const groupWeb = document.getElementById('subtabsGroup-web');
  if (groupTampilan) groupTampilan.style.display = catForTab === 'tampilan' ? 'flex' : 'none';
  if (groupWeb) groupWeb.style.display = catForTab === 'web' ? 'flex' : 'none';

  // Highlight subtab buttons
  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === `subtabBtn-${tabName}`);
  });

  // 4. Gambar 3: Activate corresponding settings form/panel
  document.querySelectorAll('.settings-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `settingsPanel-${tabName}`);
  });

  // Update pills on connect bar
  const pillTotal = document.getElementById('magPillTotal');
  if (pillTotal) {
    const list = typeof getRegistrations === 'function' ? getRegistrations() : [];
    pillTotal.textContent = `${list.length} Jiwa`;
  }
  const pillDb = document.getElementById('magPillDb');
  if (pillDb) {
    pillDb.textContent = (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) ? 'Supabase Connected' : 'Lokal Aktif';
  }

  // Sinkronisasi highlight nav menu Rekap Data jika tab Rekap aktif
  const navRekapBtn = document.querySelector('.nav-link[data-page="rekap"]');
  if (navRekapBtn) {
    navRekapBtn.classList.toggle('active', tabName === 'rekap');
  }

  if (tabName === 'rekap') {
    renderStats();
    setTimeout(() => {
      renderCharts();
    }, 60);
    renderRekapTable();
  }
  if (tabName === 'wilayah') {
    renderSettingsWilayahManager();
  }
  if (tabName === 'kamar-kelompok') {
    renderSettingsRoomsAndGroupsManager();
  }
  if (tabName === 'ticket-template') {
    loadTicketTemplateSettings();
  }
}

window.switchSettingsCategory = switchSettingsCategory;
window.switchSettingsTab = switchSettingsTab;
window.openSettingsWithAuth = openSettingsWithAuth;
window.closeAdminAuthModal = closeAdminAuthModal;
window.submitAdminPassword = submitAdminPassword;
window.lockAdminSession = lockAdminSession;
window.saveNewAdminPassword = saveNewAdminPassword;
window.resetAdminPasswordDefault = resetAdminPasswordDefault;
window.togglePasswordVisibility = togglePasswordVisibility;

function saveDeadlineSettings() {
  const deadlineVal = document.getElementById('cfg_deadlineTime').value;
  const isOpen = document.getElementById('cfg_registrationStatus').checked;
  const closedMsg = document.getElementById('cfg_closedMessage').value.trim();

  window.dataService.saveSettings({
    registration_deadline: deadlineVal,
    is_registration_open: String(isOpen),
    closed_message: closedMsg
  });

  initCountdownTimer();
  showToast('Pengaturan batas waktu berhasil disimpan!', 'success');
}

async function saveSupabaseSettings() {
  const url = document.getElementById('cfg_supabaseUrl').value.trim();
  const key = document.getElementById('cfg_supabaseKey').value.trim();

  window.dataService.setCredentials(url, key);
  updateDatabaseBadge();
  showToast('Kredensial Supabase berhasil disimpan!', 'success');

  // Reload data from cloud
  await loadAndRenderRegistrations();
}

async function testSupabaseConnection() {
  const url = document.getElementById('cfg_supabaseUrl').value.trim();
  const key = document.getElementById('cfg_supabaseKey').value.trim();

  if (!url || !key) {
    showToast('Harap masukkan URL dan Anon Key terlebih dahulu.', 'error');
    return;
  }

  showToast('Menguji koneksi ke Supabase...', 'info');
  const res = await window.dataService.testConnection(url, key);

  if (res.success) {
    showToast(res.message, res.tableMissing ? 'info' : 'success');
  } else {
    showToast('Koneksi Gagal: ' + res.error, 'error');
  }
}

async function syncLocalToSupabase() {
  try {
    showToast('Menyinkronkan data lokal ke cloud Supabase...', 'info');
    const result = await window.dataService.syncLocalToSupabase();
    showToast(result.message, 'success');
    await loadAndRenderRegistrations();
  } catch (err) {
    showToast('Gagal sinkronisasi: ' + err.message, 'error');
  }
}

function formatHeroHeadline(text) {
  if (!text) return 'PASKAS <span class="text-gradient">BAHAGIA</span>';
  if (text.includes('<span') || text.includes('<br>')) {
    return text;
  }
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) {
    return `<span class="text-gradient">${text}</span>`;
  }
  const lastWord = words.pop();
  return `${words.join(' ')} <span class="text-gradient">${lastWord}</span>`;
}

function applyEventInfoToUI(settings) {
  try {
    if (!settings && window.dataService) {
      settings = window.dataService.getSettings();
    }
    if (!settings) return;

    const heroHeadline = document.getElementById('heroMainHeadline');
    if (heroHeadline && settings.event_headline) {
      heroHeadline.innerHTML = formatHeroHeadline(settings.event_headline);
    }

    const heroDesc = document.getElementById('heroEventDesc');
    if (heroDesc && settings.event_desc) {
      heroDesc.textContent = settings.event_desc;
    }
  } catch (err) {
    console.warn('Gagal memperbarui UI info acara:', err);
  }
}

function saveEventInfoSettings() {
  const headlineInput = document.getElementById('cfg_eventHeadline');
  const headline = headlineInput ? headlineInput.value.trim() : 'PASKAS BAHAGIA';
  const name = document.getElementById('cfg_eventName').value.trim();
  const loc = document.getElementById('cfg_eventLocation').value.trim();
  const desc = document.getElementById('cfg_eventDesc').value.trim();

  window.dataService.saveSettings({
    event_headline: headline,
    event_name: name,
    event_location: loc,
    event_desc: desc
  });

  applyEventInfoToUI({
    event_headline: headline,
    event_name: name,
    event_desc: desc
  });

  showToast('Info acara & headline berhasil diperbarui!', 'success');
}

// ===================================================================
// MASTER KAMAR & KELOMPOK PESERTA (SETTINGS - GEDUNG, IKHWAN & AKHWAT)
// ===================================================================
const DEFAULT_ROOMS = [
  { id: 'R01', building: 'Asrama Ikhwan', room_number: '01', room_name: 'Kamar Al-Fatih', gender_type: 'ikhwan', capacity: 4 },
  { id: 'R02', building: 'Asrama Ikhwan', room_number: '02', room_name: 'Kamar Shalahuddin', gender_type: 'ikhwan', capacity: 4 },
  { id: 'R03', building: 'Asrama Ikhwan', room_number: '03', room_name: 'Kamar Khalid bin Walid', gender_type: 'ikhwan', capacity: 6 },
  { id: 'R04', building: 'Asrama Akhwat', room_number: '04', room_name: 'Kamar Maryam binti Imran', gender_type: 'akhwat', capacity: 6 },
  { id: 'R05', building: 'Glamping & Tenda', room_number: '05', room_name: 'Glamping Khadijah', gender_type: 'akhwat', capacity: 8 },
  { id: 'R06', building: 'Glamping & Tenda', room_number: '06', room_name: 'Glamping Aisyah', gender_type: 'akhwat', capacity: 8 },
  { id: 'R07', building: 'Gedung Utama', room_number: '07', room_name: 'Asrama Ikhwan Utama', gender_type: 'ikhwan', capacity: 12 },
  { id: 'R08', building: 'Convention VIP', room_number: '08', room_name: 'Kamar Munzalan VIP', gender_type: 'umum', capacity: 4 }
];

const DEFAULT_GROUPS = [
  { id: 'G01', group_code: 'A123', group_name: 'Kafilah Al-Fatih', gender_type: 'ikhwan', max_members: 10 },
  { id: 'G02', group_code: 'A124', group_name: 'Kafilah Shalahuddin', gender_type: 'ikhwan', max_members: 10 },
  { id: 'G03', group_code: 'B201', group_name: 'Kafilah Khadijah', gender_type: 'akhwat', max_members: 12 },
  { id: 'G04', group_code: 'B202', group_name: 'Kafilah Syiar Ummat', gender_type: 'campur', max_members: 10 }
];

function getMasterRooms() {
  try {
    const raw = localStorage.getItem('paskas_rooms_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading rooms:', e);
  }
  return DEFAULT_ROOMS;
}

function saveMasterRooms(rooms) {
  localStorage.setItem('paskas_rooms_data', JSON.stringify(rooms));
  renderSettingsRoomsTable();
}

function addMasterRoomItem() {
  const bldInput = document.getElementById('cfg_newRoomBuilding');
  const numInput = document.getElementById('cfg_newRoomNumber');
  const nameInput = document.getElementById('cfg_newRoomName');
  const genderInput = document.getElementById('cfg_newRoomGender');
  const capInput = document.getElementById('cfg_newRoomCapacity');

  const bldVal = (bldInput?.value || '').trim() || 'Gedung Utama';
  const numVal = (numInput?.value || '').trim();
  const nameVal = (nameInput?.value || '').trim();
  const genderVal = (genderInput?.value || 'ikhwan').toLowerCase();
  const capVal = parseInt(capInput?.value || '4', 10);

  if (!numVal) {
    showToast('Nomor kamar harus diisi!', 'warning');
    if (numInput) numInput.focus();
    return;
  }
  if (!nameVal) {
    showToast('Nama kamar / tenda harus diisi!', 'warning');
    if (nameInput) nameInput.focus();
    return;
  }
  if (isNaN(capVal) || capVal <= 0) {
    showToast('Kapasitas kamar minimal 1 orang!', 'warning');
    if (capInput) capInput.focus();
    return;
  }

  const rooms = getMasterRooms();
  if (rooms.some(r => r.room_number.toLowerCase() === numVal.toLowerCase())) {
    showToast(`Nomor kamar "${numVal}" sudah ada di daftar!`, 'error');
    if (numInput) numInput.focus();
    return;
  }

  rooms.push({
    id: 'R' + Date.now().toString().slice(-4),
    building: bldVal,
    room_number: numVal,
    room_name: nameVal,
    gender_type: genderVal,
    capacity: capVal
  });

  saveMasterRooms(rooms);

  if (numInput) numInput.value = '';
  if (nameInput) nameInput.value = '';
  if (capInput) capInput.value = '4';

  const genderLabel = genderVal === 'ikhwan' ? 'Khusus Ikhwan' : (genderVal === 'akhwat' ? 'Khusus Akhwat' : 'Umum/Campur');
  showToast(`Kamar ${numVal} (${nameVal} - ${bldVal} - ${genderLabel}) berhasil ditambahkan!`, 'success');
}

function deleteMasterRoomItem(index) {
  const rooms = getMasterRooms();
  const target = rooms[index];
  if (!target) return;

  if (confirm(`Hapus kamar nomor "${target.room_number}" (${target.room_name})?`)) {
    rooms.splice(index, 1);
    saveMasterRooms(rooms);
    showToast(`Kamar ${target.room_number} berhasil dihapus.`, 'info');
  }
}

function editMasterRoomItem(index) {
  const rooms = getMasterRooms();
  const target = rooms[index];
  if (!target) return;

  const newBld = prompt('Ubah Nama Gedung / Asrama:', target.building || 'Gedung Utama');
  if (newBld === null) return;
  const newNum = prompt('Ubah Nomor Kamar:', target.room_number);
  if (newNum === null) return;
  const newName = prompt('Ubah Nama Kamar / Tenda:', target.room_name);
  if (newName === null) return;
  const newGender = prompt('Ubah Peruntukan (ketik: ikhwan / akhwat / umum):', target.gender_type || 'ikhwan');
  if (newGender === null) return;
  const newCap = prompt('Ubah Kapasitas Kamar (Jumlah Orang):', target.capacity);
  if (newCap === null) return;

  const parsedCap = parseInt(newCap, 10);
  const cleanGender = newGender.trim().toLowerCase();
  const finalGender = ['ikhwan', 'akhwat', 'umum'].includes(cleanGender) ? cleanGender : (target.gender_type || 'ikhwan');

  if (!newNum.trim() || !newName.trim() || isNaN(parsedCap) || parsedCap <= 0) {
    showToast('Input kamar tidak valid!', 'error');
    return;
  }

  target.building = newBld.trim() || target.building || 'Gedung Utama';
  target.room_number = newNum.trim();
  target.room_name = newName.trim();
  target.gender_type = finalGender;
  target.capacity = parsedCap;

  saveMasterRooms(rooms);
  showToast(`Kamar ${target.room_number} (${target.building}) berhasil diperbarui!`, 'success');
}

function resetRoomsToDefault() {
  if (confirm('Kembalikan daftar kamar ke setelan bawaan?')) {
    saveMasterRooms(DEFAULT_ROOMS);
    showToast('Daftar kamar berhasil dikembalikan ke default.', 'info');
  }
}

function filterMasterRoomTable() {
  const q = (document.getElementById('searchMasterRoomInput')?.value || '').trim();
  renderSettingsRoomsTable(q);
}

function renderSettingsRoomsTable(query = '') {
  const tbody = document.getElementById('cfg_masterRoomTableBody');
  const bldBadge = document.getElementById('cfg_buildingTotalCountBadge');
  const countBadge = document.getElementById('cfg_roomTotalCountBadge');
  const capBadge = document.getElementById('cfg_roomCapacityBadge');
  if (!tbody) return;

  const rooms = getMasterRooms();
  const allRegs = window.allRegistrations || [];

  let totalCap = 0;
  const uniqueBuildings = new Set();
  rooms.forEach(r => {
    totalCap += (parseInt(r.capacity, 10) || 0);
    if (r.building && r.building.trim()) {
      uniqueBuildings.add(r.building.trim());
    }
  });

  if (bldBadge) bldBadge.innerHTML = `<i class="fa-solid fa-building"></i> ${uniqueBuildings.size} Gedung`;
  if (countBadge) countBadge.innerHTML = `<i class="fa-solid fa-door-closed"></i> ${rooms.length} Kamar`;
  if (capBadge) capBadge.innerHTML = `<i class="fa-solid fa-users"></i> Kapasitas ${totalCap} Orang`;

  const qLower = query.toLowerCase();
  const filtered = rooms.map((r, idx) => ({ ...r, originalIndex: idx })).filter(r => {
    if (!qLower) return true;
    const bld = (r.building || '').toLowerCase();
    const gType = (r.gender_type || '').toLowerCase();
    return bld.includes(qLower) ||
           r.room_number.toLowerCase().includes(qLower) || 
           r.room_name.toLowerCase().includes(qLower) ||
           gType.includes(qLower);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 24px;">Tidak ada data kamar atau gedung yang cocok.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((item, displayIdx) => {
    const occupied = allRegs.filter(p => {
      const pRoom = String(p.room_number || p.kamar || '').trim().toLowerCase();
      if (pRoom === item.room_number.toLowerCase()) return true;
      if (p.is_child && p.guardian_name) {
        const parent = allRegs.find(a => a.full_name && a.full_name.trim().toLowerCase() === p.guardian_name.trim().toLowerCase());
        if (parent && String(parent.room_number || parent.kamar).trim().toLowerCase() === item.room_number.toLowerCase()) {
          return true;
        }
      }
      return false;
    }).length;

    const cap = parseInt(item.capacity, 10) || 1;
    const isFull = occupied >= cap;
    const statusBadge = isFull 
      ? `<span class="settings-chip-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-size: 11px;"><i class="fa-solid fa-circle-exclamation"></i> Penuh (${occupied}/${cap})</span>`
      : `<span class="settings-chip-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px;"><i class="fa-solid fa-circle-check"></i> ${occupied}/${cap} Terisi</span>`;

    // Gender badge
    const gType = (item.gender_type || 'ikhwan').toLowerCase();
    let genderBadge = '';
    if (gType === 'ikhwan') {
      genderBadge = `<span class="settings-chip-badge" style="background: #eef2ff; border: 1px solid #c7d2fe; color: #3730a3; font-size: 11px; padding: 3px 8px;"><i class="fa-solid fa-mars"></i> Khusus Ikhwan</span>`;
    } else if (gType === 'akhwat') {
      genderBadge = `<span class="settings-chip-badge" style="background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; font-size: 11px; padding: 3px 8px;"><i class="fa-solid fa-venus"></i> Khusus Akhwat</span>`;
    } else {
      genderBadge = `<span class="settings-chip-badge" style="background: #fdf6e7; border: 1px solid #e2cf9b; color: #8a6a24; font-size: 11px; padding: 3px 8px;"><i class="fa-solid fa-people-arrows"></i> Umum / Campur</span>`;
    }

    return `
      <tr>
        <td style="text-align: center; color: #1a1815; font-weight: 700;">${displayIdx + 1}</td>
        <td style="font-weight: 700; color: #1a1815;">
          <i class="fa-solid fa-building" style="margin-right: 5px; font-size: 11px; color: #8a6a24;"></i>
          ${escapeHtml(item.building || 'Gedung Utama')}
        </td>
        <td style="text-align: center;">
          <span style="display: inline-block; padding: 3px 10px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 4px; font-weight: 800; font-size: 13px;">
            ${escapeHtml(item.room_number)}
          </span>
        </td>
        <td style="font-weight: 700; color: #1a1815;">${escapeHtml(item.room_name)}</td>
        <td style="text-align: center;">${genderBadge}</td>
        <td style="text-align: center; font-weight: 800; color: #1a1815;">${cap} Orang</td>
        <td style="text-align: center;">${statusBadge}</td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 6px; justify-content: center;">
            <button type="button" class="btn btn-wilayah-btn edit btn-xs" onclick="editMasterRoomItem(${item.originalIndex})" title="Edit Kamar">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button type="button" class="btn btn-danger-soft btn-xs" onclick="deleteMasterRoomItem(${item.originalIndex})" title="Hapus Kamar">
              <i class="fa-solid fa-trash-can"></i> Hapus
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// -------------------------------------------------------------------
// GROUPS / KELOMPOK MANAGEMENT (IKHWAN & AKHWAT)
// -------------------------------------------------------------------
function getGlobalMaxGroupMembers() {
  const settings = window.dataService ? window.dataService.getSettings() : {};
  return parseInt(settings.max_group_members, 10) || 10;
}

function saveGlobalMaxGroupMembersSetting() {
  const val = parseInt(document.getElementById('cfg_globalMaxGroupMembers')?.value || '10', 10);
  if (isNaN(val) || val <= 0) {
    showToast('Batas anggota kelompok minimal 1 orang!', 'warning');
    return;
  }

  window.dataService.saveSettings({ max_group_members: val });
  showToast(`Batas maksimal kelompok berhasil diatur ke ${val} orang!`, 'success');
  renderSettingsGroupsTable();
}

function getMasterGroups() {
  try {
    const raw = localStorage.getItem('paskas_groups_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading groups:', e);
  }
  return DEFAULT_GROUPS;
}

function saveMasterGroups(groups) {
  localStorage.setItem('paskas_groups_data', JSON.stringify(groups));
  renderSettingsGroupsTable();
}

function addMasterGroupItem() {
  const nameInput = document.getElementById('cfg_newGroupName');
  const genderInput = document.getElementById('cfg_newGroupGender');
  const maxInput = document.getElementById('cfg_newGroupMax');

  const nameVal = (nameInput?.value || '').trim();
  const genderVal = (genderInput?.value || 'ikhwan').toLowerCase();
  const maxVal = parseInt(maxInput?.value || String(getGlobalMaxGroupMembers()), 10);

  if (!nameVal) {
    showToast('Nama atau kode kelompok harus diisi!', 'warning');
    if (nameInput) nameInput.focus();
    return;
  }
  if (isNaN(maxVal) || maxVal <= 0) {
    showToast('Batas anggota minimal 1 orang!', 'warning');
    if (maxInput) maxInput.focus();
    return;
  }

  const groups = getMasterGroups();
  if (groups.some(g => (g.group_code || g.group_name).toLowerCase() === nameVal.toLowerCase())) {
    showToast(`Kelompok "${nameVal}" sudah terdaftar!`, 'error');
    if (nameInput) nameInput.focus();
    return;
  }

  groups.push({
    id: 'G' + Date.now().toString().slice(-4),
    group_code: nameVal,
    group_name: nameVal,
    gender_type: genderVal,
    max_members: maxVal
  });

  saveMasterGroups(groups);

  if (nameInput) nameInput.value = '';
  if (maxInput) maxInput.value = '';

  const gLabel = genderVal === 'ikhwan' ? 'Khusus Ikhwan' : (genderVal === 'akhwat' ? 'Khusus Akhwat' : 'Campur/Rombongan');
  showToast(`Kelompok ${nameVal} (${gLabel}) berhasil ditambahkan!`, 'success');
}

function deleteMasterGroupItem(index) {
  const groups = getMasterGroups();
  const target = groups[index];
  if (!target) return;

  if (confirm(`Hapus kelompok "${target.group_name || target.group_code}"?`)) {
    groups.splice(index, 1);
    saveMasterGroups(groups);
    showToast(`Kelompok ${target.group_name || target.group_code} berhasil dihapus.`, 'info');
  }
}

function editMasterGroupItem(index) {
  const groups = getMasterGroups();
  const target = groups[index];
  if (!target) return;

  const newName = prompt('Ubah Nama / Kode Kelompok:', target.group_name || target.group_code);
  if (newName === null) return;
  const newGender = prompt('Ubah Kategori (ketik: ikhwan / akhwat / campur):', target.gender_type || 'ikhwan');
  if (newGender === null) return;
  const newMax = prompt('Ubah Batas Maksimal Anggota (Orang):', target.max_members || getGlobalMaxGroupMembers());
  if (newMax === null) return;

  const parsedMax = parseInt(newMax, 10);
  const cleanGender = newGender.trim().toLowerCase();
  const finalGender = ['ikhwan', 'akhwat', 'campur'].includes(cleanGender) ? cleanGender : (target.gender_type || 'ikhwan');

  if (!newName.trim() || isNaN(parsedMax) || parsedMax <= 0) {
    showToast('Input kelompok tidak valid!', 'error');
    return;
  }

  target.group_code = newName.trim();
  target.group_name = newName.trim();
  target.gender_type = finalGender;
  target.max_members = parsedMax;

  saveMasterGroups(groups);
  showToast(`Kelompok ${target.group_name} berhasil diperbarui!`, 'success');
}

function resetGroupsToDefault() {
  if (confirm('Kembalikan daftar kelompok ke setelan bawaan?')) {
    saveMasterGroups(DEFAULT_GROUPS);
    showToast('Daftar kelompok berhasil dikembalikan ke default.', 'info');
  }
}

function filterMasterGroupTable() {
  const q = (document.getElementById('searchMasterGroupInput')?.value || '').trim();
  renderSettingsGroupsTable(q);
}

function renderSettingsGroupsTable(query = '') {
  const tbody = document.getElementById('cfg_masterGroupTableBody');
  const countBadge = document.getElementById('cfg_groupTotalCountBadge');
  if (!tbody) return;

  const groups = getMasterGroups();
  const allRegs = window.allRegistrations || [];
  const globalMax = getGlobalMaxGroupMembers();

  if (countBadge) countBadge.innerHTML = `<i class="fa-solid fa-people-group"></i> ${groups.length} Kelompok`;

  const qLower = query.toLowerCase();
  const filtered = groups.map((g, idx) => ({ ...g, originalIndex: idx })).filter(g => {
    if (!qLower) return true;
    const name = (g.group_name || g.group_code || '').toLowerCase();
    const gType = (g.gender_type || '').toLowerCase();
    return name.includes(qLower) || gType.includes(qLower);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 24px;">Tidak ada data kelompok yang cocok.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((item, displayIdx) => {
    const gName = item.group_name || item.group_code;
    const max = parseInt(item.max_members, 10) || globalMax;

    const occupied = allRegs.filter(p => {
      const pg = String(p.group_name || '').trim().toLowerCase();
      return pg === gName.toLowerCase() || (item.group_code && pg === item.group_code.toLowerCase());
    }).length;

    const isFull = occupied >= max;
    const statusBadge = isFull 
      ? `<span class="settings-chip-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-size: 11px;"><i class="fa-solid fa-circle-exclamation"></i> Penuh (${occupied}/${max})</span>`
      : `<span class="settings-chip-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px;"><i class="fa-solid fa-circle-check"></i> ${occupied}/${max} Anggota</span>`;

    // Gender badge
    const gType = (item.gender_type || 'ikhwan').toLowerCase();
    let genderBadge = '';
    if (gType === 'ikhwan') {
      genderBadge = `<span class="settings-chip-badge" style="background: #eef2ff; border: 1px solid #c7d2fe; color: #3730a3; font-size: 11px; padding: 3px 8px;"><i class="fa-solid fa-mars"></i> Ikhwan</span>`;
    } else if (gType === 'akhwat') {
      genderBadge = `<span class="settings-chip-badge" style="background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; font-size: 11px; padding: 3px 8px;"><i class="fa-solid fa-venus"></i> Akhwat</span>`;
    } else {
      genderBadge = `<span class="settings-chip-badge" style="background: #fdf6e7; border: 1px solid #e2cf9b; color: #8a6a24; font-size: 11px; padding: 3px 8px;"><i class="fa-solid fa-people-roof"></i> Campur / Rombongan</span>`;
    }

    return `
      <tr>
        <td style="text-align: center; color: #1a1815; font-weight: 700;">${displayIdx + 1}</td>
        <td style="font-weight: 700; color: #1a1815;">
          <i class="fa-solid fa-users" style="color: #8a6a24; margin-right: 6px; font-size: 12px;"></i>
          ${escapeHtml(gName)}
        </td>
        <td style="text-align: center;">${genderBadge}</td>
        <td style="text-align: center; font-weight: 800; color: #1a1815;">Maks. ${max} Orang</td>
        <td style="text-align: center;">${statusBadge}</td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 6px; justify-content: center;">
            <button type="button" class="btn btn-wilayah-btn edit btn-xs" onclick="editMasterGroupItem(${item.originalIndex})" title="Edit Kelompok">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button type="button" class="btn btn-danger-soft btn-xs" onclick="deleteMasterGroupItem(${item.originalIndex})" title="Hapus Kelompok">
              <i class="fa-solid fa-trash-can"></i> Hapus
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSettingsRoomsAndGroupsManager() {
  const globalMaxInp = document.getElementById('cfg_globalMaxGroupMembers');
  if (globalMaxInp) globalMaxInp.value = getGlobalMaxGroupMembers();

  renderSettingsRoomsTable();
  renderSettingsGroupsTable();
}

// ===================================================================
// PENGATURAN TEMPLATE E-TIKET & NARASI KONFIRMASI (WHATSAPP / EMAIL)
// ===================================================================

function loadTicketTemplateSettings() {
  const settings = window.dataService.getSettings();

  const airlineInp = document.getElementById('cfg_ticketAirlineName');
  const tagInp = document.getElementById('cfg_ticketEventTag');
  const fromInp = document.getElementById('cfg_ticketRouteFrom');
  const toInp = document.getElementById('cfg_ticketRouteTo');
  const subjInp = document.getElementById('cfg_confirmationSubject');
  const bodyInp = document.getElementById('cfg_confirmationBody');
  const srcLabel = document.getElementById('ticketTemplateSourceLabel');

  if (airlineInp) airlineInp.value = settings.ticket_airline_name || 'MUNZALAN AIRLINES';
  if (tagInp) tagInp.value = settings.ticket_event_tag || 'KUMPUL KELUARGA';
  if (fromInp) fromInp.value = settings.ticket_route_from || 'RANTAUAN';
  if (toInp) toInp.value = settings.ticket_route_to || 'RUMAH';

  const emServiceInp = document.getElementById('cfg_emailjsServiceId');
  const emTemplateInp = document.getElementById('cfg_emailjsTemplateId');
  const emPublicInp = document.getElementById('cfg_emailjsPublicKey');
  if (emServiceInp) emServiceInp.value = settings.emailjs_service_id || '';
  if (emTemplateInp) emTemplateInp.value = settings.emailjs_template_id || '';
  if (emPublicInp) emPublicInp.value = settings.emailjs_public_key || '';

  const tplImg = getValidTicketTemplateUrl(settings.ticket_template_image);
  
  // Jika tersimpan format yang korup atau [object Object], perbaiki otomatis
  if (settings.ticket_template_image && (typeof settings.ticket_template_image === 'object' || String(settings.ticket_template_image).includes('[object'))) {
    window.dataService.saveSettings({ ticket_template_image: tplImg });
  }

  if (srcLabel) {
    srcLabel.textContent = tplImg.startsWith('data:') ? 'Custom Upload (Gambar Kosongan Aktif)' : tplImg;
  }
  const thumbImg = document.getElementById('ticketTemplateThumbImg');
  if (thumbImg) {
    thumbImg.src = tplImg;
  }

  const statusBadge = document.getElementById('ticketTemplateStatusBadge');
  if (statusBadge) {
    if (tplImg.startsWith('data:')) {
      statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Template Kustom Aktif';
      statusBadge.style.background = '#e0f2fe';
      statusBadge.style.color = '#0369a1';
      statusBadge.style.borderColor = '#bae6fd';
    } else {
      statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Template Resmi Aktif';
      statusBadge.style.background = '#d1fae5';
      statusBadge.style.color = '#065f46';
      statusBadge.style.borderColor = '#a7f3d0';
    }
  }

  if (subjInp) subjInp.value = settings.confirmation_email_subject || 'Konfirmasi Registrasi Peserta - Silaturahmi Akbar Paskas Bahagia';
  if (bodyInp) bodyInp.value = settings.confirmation_email_body || '';

  renderTicketTemplateLivePreview();
}

function handleTicketTemplateFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    showToast('Ukuran file gambar maksimal 8MB.', 'warning');
    return;
  }

  showToast('Memproses gambar template...', 'info');

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Data = e.target.result;
    if (typeof base64Data !== 'string' || !base64Data.startsWith('data:image/')) {
      showToast('Format file gambar tidak valid.', 'error');
      return;
    }

    customTicketTemplateBase64 = base64Data;

    const srcLabel = document.getElementById('ticketTemplateSourceLabel');
    if (srcLabel) srcLabel.textContent = `File: ${file.name} (Tersimpan & Aktif)`;

    const thumbImg = document.getElementById('ticketTemplateThumbImg');
    if (thumbImg) thumbImg.src = base64Data;

    const statusBadge = document.getElementById('ticketTemplateStatusBadge');
    if (statusBadge) {
      statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Template Kustom Aktif';
      statusBadge.style.background = '#e0f2fe';
      statusBadge.style.color = '#0369a1';
      statusBadge.style.borderColor = '#bae6fd';
    }

    // Auto-save setting agar langsung aktif permanen
    window.dataService.saveSettings({
      ticket_template_image: base64Data
    });

    renderTicketTemplateLivePreview();
    showToast('Template kosongan berhasil diunggah & langsung aktif!', 'success');
  };
  reader.onerror = function() {
    showToast('Gagal membaca file gambar.', 'error');
  };
  reader.readAsDataURL(file);
}

function handleTicketTemplateUrlChange() {
  customTicketTemplateBase64 = null;
  const urlInp = document.getElementById('cfg_ticketTemplateUrl');
  const srcLabel = document.getElementById('ticketTemplateSourceLabel');
  if (srcLabel && urlInp) {
    srcLabel.textContent = urlInp.value.trim() || 'images/boarding-pass-canva.png';
  }
  const thumbImg = document.getElementById('ticketTemplateThumbImg');
  if (thumbImg && urlInp) {
    thumbImg.src = urlInp.value.trim() || 'images/boarding-pass-canva.png';
  }
  renderTicketTemplateLivePreview();
}

function resetTicketTemplateImage() {
  customTicketTemplateBase64 = null;
  const fileInp = document.getElementById('cfg_ticketTemplateFile');
  if (fileInp) fileInp.value = '';
  const srcLabel = document.getElementById('ticketTemplateSourceLabel');
  if (srcLabel) srcLabel.textContent = 'images/boarding-pass-canva.png';
  const thumbImg = document.getElementById('ticketTemplateThumbImg');
  if (thumbImg) thumbImg.src = 'images/boarding-pass-canva.png';

  const statusBadge = document.getElementById('ticketTemplateStatusBadge');
  if (statusBadge) {
    statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Template Resmi Aktif';
    statusBadge.style.background = '#d1fae5';
    statusBadge.style.color = '#065f46';
    statusBadge.style.borderColor = '#a7f3d0';
  }

  window.dataService.saveSettings({
    ticket_template_image: 'images/boarding-pass-canva.png'
  });

  renderTicketTemplateLivePreview();
  showToast('Gambar template dikembalikan ke default resmi Munzalan Airlines.', 'info');
}

function renderTicketTemplateLivePreview() {
  const prevCard = document.getElementById('settingsLivePreviewTicket');
  if (!prevCard) return;

  const airlineInp = document.getElementById('cfg_ticketAirlineName');
  const tagInp = document.getElementById('cfg_ticketEventTag');
  const fromInp = document.getElementById('cfg_ticketRouteFrom');
  const toInp = document.getElementById('cfg_ticketRouteTo');

  const airlineVal = (airlineInp?.value || 'MUNZALAN AIRLINES').trim();
  const tagVal = (tagInp?.value || 'KUMPUL KELUARGA').trim();
  const fromVal = (fromInp?.value || 'RANTAUAN').trim();
  const toVal = (toInp?.value || 'RUMAH').trim();

  const settings = window.dataService.getSettings();
  let targetImg = customTicketTemplateBase64 || getValidTicketTemplateUrl(settings.ticket_template_image);

  const elAirline = document.getElementById('prevBpAirlineText');
  if (elAirline) elAirline.textContent = airlineVal;

  const elStubTag = document.getElementById('prevBpStubTagline');
  if (elStubTag) elStubTag.textContent = tagVal;

  const elFrom = document.getElementById('prevBpRouteFrom');
  if (elFrom) elFrom.textContent = fromVal.toUpperCase();

  const elTo = document.getElementById('prevBpRouteTo');
  if (elTo) elTo.textContent = toVal.toUpperCase();

  const elStubNik = document.getElementById('prevBpStubNik');
  if (elStubNik) elStubNik.textContent = '001';

  const elPrevBarcode = document.getElementById('prevBpBarcodeNumber');
  if (elPrevBarcode) elPrevBarcode.textContent = 'PKB-001';

  prevCard.style.backgroundImage = `url('${targetImg}')`;
  prevCard.style.backgroundSize = '100% 100%';
  prevCard.style.backgroundPosition = 'center';
  prevCard.style.backgroundRepeat = 'no-repeat';
}

function insertTagToConfirmationBody(tag) {
  const ta = document.getElementById('cfg_confirmationBody');
  if (!ta) return;
  const start = ta.selectionStart || 0;
  const end = ta.selectionEnd || 0;
  const text = ta.value;
  ta.value = text.substring(0, start) + tag + text.substring(end);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = start + tag.length;
}

function saveTicketTemplateSettings() {
  const airlineInp = document.getElementById('cfg_ticketAirlineName');
  const tagInp = document.getElementById('cfg_ticketEventTag');
  const fromInp = document.getElementById('cfg_ticketRouteFrom');
  const toInp = document.getElementById('cfg_ticketRouteTo');
  const urlInp = document.getElementById('cfg_ticketTemplateUrl');
  const subjInp = document.getElementById('cfg_confirmationSubject');
  const bodyInp = document.getElementById('cfg_confirmationBody');

  const settings = window.dataService.getSettings();
  let finalImg = customTicketTemplateBase64 || getValidTicketTemplateUrl(settings.ticket_template_image);

  const emServiceInp = document.getElementById('cfg_emailjsServiceId');
  const emTemplateInp = document.getElementById('cfg_emailjsTemplateId');
  const emPublicInp = document.getElementById('cfg_emailjsPublicKey');

  window.dataService.saveSettings({
    ticket_template_image: finalImg,
    ticket_airline_name: airlineInp?.value?.trim() || 'MUNZALAN AIRLINES',
    ticket_event_tag: tagInp?.value?.trim() || 'KUMPUL KELUARGA',
    ticket_route_from: fromInp?.value?.trim() || 'RANTAUAN',
    ticket_route_to: toInp?.value?.trim() || 'RUMAH',
    confirmation_email_subject: subjInp?.value?.trim() || '',
    confirmation_email_body: bodyInp?.value || '',
    emailjs_service_id: emServiceInp?.value?.trim() || '',
    emailjs_template_id: emTemplateInp?.value?.trim() || '',
    emailjs_public_key: emPublicInp?.value?.trim() || ''
  });

  showToast('Pengaturan template tiket dan narasi berhasil disimpan!', 'success');
}

function resetConfirmationNarrativeDefault() {
  if (confirm('Kembalikan format narasi konfirmasi ke setelan bawaan?')) {
    const subjInp = document.getElementById('cfg_confirmationSubject');
    const bodyInp = document.getElementById('cfg_confirmationBody');
    if (subjInp) subjInp.value = 'Konfirmasi Registrasi Peserta - Silaturahmi Akbar Paskas Bahagia';
    if (bodyInp) {
      bodyInp.value = `*E-TIKET & BUKTI REGISTRASI PASKAS BAHAGIA*\n----------------------------------------\nHalo *{nama}*,\nAlhamdulillah, pendaftaran Anda di Silaturahmi Akbar Paskas Bahagia telah BERHASIL!\n\n*DATA BOARDING PASS:*\n✈️ Maskapai: MUNZALAN AIRLINES\n🎫 Kode Tiket: *{kode_tiket}*\n👤 Nama: *{nama}*\n📍 Wilayah/Daerah: *{wilayah}* ({daerah})\n👥 Kelompok: *{kelompok}*\n🚪 Kamar: *{kamar}*\n📅 Tanggal Pulang: *{tgl_pulang}*\n⏰ Jam Datang: *{jam_datang}*\n🚻 Jenis Kelamin: *{gender}*\n🪪 NIK: *{nik}*\n🛣️ Rute: {rute_from} ➔ {rute_to}\n\nMohon simpan bukti e-tiket ini dan tunjukkan kepada panitia registrasi di lapangan pada saat kedatangan.\n\nSampai jumpa di lokasi acara! Semoga perjalanan berkah dan lancar. Barokallahu fiikum.`;
    }
    showToast('Narasi konfirmasi dikembalikan ke bawaan.', 'info');
  }
}

window.loadTicketTemplateSettings = loadTicketTemplateSettings;
window.handleTicketTemplateFileUpload = handleTicketTemplateFileUpload;
window.handleTicketTemplateUrlChange = handleTicketTemplateUrlChange;
window.resetTicketTemplateImage = resetTicketTemplateImage;
window.renderTicketTemplateLivePreview = renderTicketTemplateLivePreview;
window.insertTagToConfirmationBody = insertTagToConfirmationBody;
window.saveTicketTemplateSettings = saveTicketTemplateSettings;
window.resetConfirmationNarrativeDefault = resetConfirmationNarrativeDefault;

// ===================================================================
// PENGELOLA KARTU INFORMASI ACARA, GAMBAR & NARASI (DASHBOARD CARDS)
// ===================================================================

/**
 * Kompres gambar lokal otomatis dengan resolusi tinggi (HD/2K) agar tetap tajam
 */
function compressImageFile(file, maxWidth = 1920, quality = 0.86) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const isLowRes = img.width < 500 || img.height < 350;
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', quality),
          width: img.width,
          height: img.height,
          isLowRes
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Handle upload foto langsung dari file picker pengguna
 */
async function handleCardImageUpload(event, idx) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    showToast('Memproses file foto kualitas tinggi...', 'info');
    const res = await compressImageFile(file, 1920, 0.86);

    const box = document.querySelector(`.settings-card-item-box[data-card-idx="${idx}"]`);
    if (box) {
      const inputCover = box.querySelector('.card-input-cover');
      if (inputCover) {
        inputCover.value = res.dataUrl;
      }
      const img = box.querySelector('.settings-card-preview-thumb');
      if (img) {
        img.src = res.dataUrl;
      }
    }
    if (res.isLowRes) {
      showToast(`⚠️ Peringatan: Gambar sumber berukuran kecil (${res.width}x${res.height}px), gambar di layar besar mungkin akan buram/pecah. Disarankan gunakan foto asli beresolusi min 1000px.`, 'warning');
    } else {
      showToast('Foto kualitas tajam berhasil dimuat! Klik "Simpan Perubahan Kartu" untuk menerapkan.', 'success');
    }
  } catch (err) {
    console.error('Gagal upload gambar:', err);
    showToast('Gagal memproses file foto. Pastikan format file gambar valid.', 'error');
  }
}

function renderSettingsCardsManager() {
  const container = document.getElementById('settingsCardsList');
  if (!container) return;

  container.innerHTML = DASHBOARD_CARDS.map((card, idx) => `
    <div class="settings-card-item-box" data-card-idx="${idx}">
      <div class="settings-card-box-header">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          <img src="${card.coverImg || card.thumbImg}" class="settings-card-preview-thumb" alt="${card.title}" onerror="this.src='images/rocket-convention-hall-card.jpg'">
          <div>
            <div class="settings-card-box-title">Kartu #${idx + 1}: ${escapeHtml(card.title)}</div>
            <span style="font-size: 11.5px; color: #94a3b8;">${escapeHtml(card.category)}</span>
          </div>
        </div>
        ${DASHBOARD_CARDS.length > 1 ? `
          <button type="button" class="btn-remove-card-item" onclick="removeCardFromSettings(${idx})" title="Hapus kartu ini">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        ` : ''}
      </div>

      <div class="form-row col-2" style="margin-top: 6px;">
        <div class="form-group" style="margin: 0;">
          <label class="form-label" style="font-size: 12px;">Judul Kartu</label>
          <input type="text" class="form-control card-input-title" value="${escapeHtml(card.title || '')}" placeholder="Cth: Jadwal Acara" style="padding: 8px 12px; font-size: 13px;">
        </div>
        <div class="form-group" style="margin: 0;">
          <label class="form-label" style="font-size: 12px;">Kategori / Tagline</label>
          <input type="text" class="form-control card-input-category" value="${escapeHtml(card.category || '')}" placeholder="Cth: AGENDA & RUNDOWN" style="padding: 8px 12px; font-size: 13px;">
        </div>
      </div>

      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 12px;">Narasi Ringkas di Kartu (Subjudul)</label>
        <input type="text" class="form-control card-input-subtitle" value="${escapeHtml(card.subtitle || '')}" placeholder="Deskripsi ringkas yang tampil di kartu..." style="padding: 8px 12px; font-size: 13px;">
      </div>

      <div class="form-group" style="margin: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <label class="form-label" style="font-size: 12px; margin: 0;">Gambar Latar & Kartu</label>
          <label class="btn btn-outline-cyan btn-xs" style="cursor: pointer; padding: 4px 10px; font-size: 11.5px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; margin: 0;">
            <i class="fa-solid fa-upload"></i> Upload Foto
            <input type="file" accept="image/*" style="display: none;" onchange="handleCardImageUpload(event, ${idx})">
          </label>
        </div>
        <div class="input-with-icon">
          <i class="fa-solid fa-image"></i>
          <input type="text" class="form-control card-input-cover" value="${card.coverImg || ''}" placeholder="https://... atau klik tombol Upload Foto" style="padding: 8px 12px 8px 38px; font-size: 13px;" oninput="updateCardThumbPreview(this, ${idx})">
        </div>
      </div>

      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 12px;">Narasi / Penjelasan Lengkap (Muncul Saat Kartu Dibuka)</label>
        <textarea class="form-control card-input-narration" rows="4" placeholder="Tuliskan narasi lengkap agenda, fasilitas, atau panduan acara..." style="padding: 8px 12px; font-size: 12.5px; line-height: 1.5; resize: vertical;">${escapeHtml(card.narration || '')}</textarea>
      </div>
    </div>
  `).join('');
}

function updateCardThumbPreview(input, idx) {
  const box = input.closest('.settings-card-item-box');
  if (!box) return;
  const img = box.querySelector('.settings-card-preview-thumb');
  if (!img) return;

  let val = input.value.trim();
  if (!val) return;

  // Auto-detect and convert if user pasted Google Maps link
  if (val.includes('google.com/maps') || val.includes('maps.app.goo.gl')) {
    const directUrl = parseDirectImageUrl(val);
    if (directUrl && directUrl !== val) {
      input.value = directUrl;
      val = directUrl;
      if (typeof showToast === 'function') {
        showToast('Link Google Maps berhasil dikonversi ke foto venue asli!', 'success');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast('Tips: Link halaman Google Maps bukan file foto langsung. Disarankan gunakan tombol "Upload Foto" dari HP/Laptop atau klik kanan foto di Google Maps lalu pilih "Salin alamat gambar".', 'warning', 6500);
      }
    }
  }

  img.src = parseDirectImageUrl(val, true);
  img.onerror = function() {
    this.onerror = null;
    this.src = 'images/rocket-convention-hall-card.jpg';
  };
}

function addNewCardFromSettings() {
  const newIdx = DASHBOARD_CARDS.length + 1;
  const newCard = {
    id: 'card-' + Date.now(),
    category: 'INFORMASI ACARA',
    title: 'Informasi Baru ' + newIdx,
    subtitle: 'Keterangan seputar kegiatan silaturahmi Paskas',
    narration: 'Tuliskan narasi lengkap penjelasan acara di sini...',
    badge: String(newIdx).padStart(2, '0') + ' / ' + String(newIdx).padStart(2, '0'),
    coverImg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    thumbImg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80',
    content: ''
  };
  DASHBOARD_CARDS.push(newCard);
  renderSettingsCardsManager();
  showToast('Kartu baru berhasil ditambahkan! Silakan lengkapi judul/foto/narasi & klik Simpan Perubahan.', 'info');
}

function removeCardFromSettings(idx) {
  if (DASHBOARD_CARDS.length <= 1) {
    showToast('Minimal harus ada 1 kartu informasi acara.', 'error');
    return;
  }
  DASHBOARD_CARDS.splice(idx, 1);
  renderSettingsCardsManager();
  showToast('Kartu berhasil dihapus dari daftar.', 'info');
}

function saveCardsFromSettings() {
  const cardElements = document.querySelectorAll('.settings-card-item-box');
  if (!cardElements.length) return;

  const total = cardElements.length;
  cardElements.forEach((el, idx) => {
    const title = el.querySelector('.card-input-title')?.value.trim() || `Info ${idx + 1}`;
    const category = el.querySelector('.card-input-category')?.value.trim() || 'INFORMASI';
    const subtitle = el.querySelector('.card-input-subtitle')?.value.trim() || '';
    let cover = el.querySelector('.card-input-cover')?.value.trim() || 'images/rocket-convention-hall.jpg';
    const narration = el.querySelector('.card-input-narration')?.value.trim() || '';

    // Auto-sanitize jika terinput link Google Maps
    cover = parseDirectImageUrl(cover);

    if (DASHBOARD_CARDS[idx]) {
      DASHBOARD_CARDS[idx].title = title;
      DASHBOARD_CARDS[idx].category = category;
      DASHBOARD_CARDS[idx].subtitle = subtitle;
      if (idx === 0 && (cover.includes('rocket') || cover.includes('convention'))) {
        DASHBOARD_CARDS[idx].thumbImg = 'images/rocket-convention-hall-card.jpg';
        DASHBOARD_CARDS[idx].coverImg = 'images/rocket-convention-hall-hero.jpg';
      } else {
        DASHBOARD_CARDS[idx].coverImg = cover;
        DASHBOARD_CARDS[idx].thumbImg = cover;
      }
      DASHBOARD_CARDS[idx].narration = narration;
      DASHBOARD_CARDS[idx].badge = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
  });

  try {
    localStorage.setItem('paskas_custom_cards', JSON.stringify(DASHBOARD_CARDS));
  } catch (e) {
    console.warn('Gagal menyimpan kartu custom:', e);
  }

  // Refresh tampilan di dashboard
  currentCardIndex = 0;
  renderDashboardCards();

  // Update background hero dengan kartu pertama
  if (DASHBOARD_CARDS[0] && DASHBOARD_CARDS[0].coverImg) {
    crossfadeHeroBackground(DASHBOARD_CARDS[0].coverImg);
  }

  renderSettingsCardsManager();
  showToast('Perubahan kartu informasi, gambar & narasi berhasil disimpan!', 'success');
}

function resetCardsToDefault() {
  if (confirm('Kembalikan semua kartu informasi ke pengaturan dan gambar bawaan awal?')) {
    localStorage.removeItem('paskas_custom_cards');
    DASHBOARD_CARDS = JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_CARDS));
    currentCardIndex = 0;
    renderDashboardCards();
    if (DASHBOARD_CARDS[0] && DASHBOARD_CARDS[0].coverImg) {
      crossfadeHeroBackground(DASHBOARD_CARDS[0].coverImg);
    }
    renderSettingsCardsManager();
    showToast('Kartu berhasil dikembalikan ke setelan awal.', 'info');
  }
}

// ===================================================================
// PENGELOLA FOTO & NARASI REGISTRASI DI SETTINGS (DINAMIS & FLEKSIBEL)
// ===================================================================
function renderRegistrationPageContent() {
  const locEl = document.getElementById('regLocationDisplay');
  const kickerEl = document.getElementById('regStoryBadgeKicker');
  const titleEl = document.getElementById('regStorySerifTitle');
  const leadEl = document.getElementById('regStoryLeadText');

  if (locEl) locEl.textContent = REGISTRATION_CONTENT.location || 'Bumi Perkemahan Silaturahmi';
  if (kickerEl) kickerEl.textContent = REGISTRATION_CONTENT.kicker || '';
  if (titleEl) titleEl.textContent = REGISTRATION_CONTENT.title || '';
  if (leadEl) leadEl.textContent = REGISTRATION_CONTENT.narration || '';

  const track = document.getElementById('hangingPhotosTrack');
  if (track && Array.isArray(REGISTRATION_CONTENT.photos)) {
    track.innerHTML = REGISTRATION_CONTENT.photos.map((item, idx) => {
      const swayClass = `photo-sway-${(idx % 3) + 1}`;
      const title = escapeHtml(item.title || `Foto #${idx + 1}`);
      const sub = escapeHtml(item.sub || '');
      const imgSrc = item.img || 'images/paskas-polaroid.jpg';

      return `
        <div class="hanging-photo-item ${swayClass}" onclick="interactHangingPhoto(this)" title="Klik foto untuk suara krincing & goyangan!">
          <div class="hanging-peg">
            <div class="peg-wood"></div>
            <div class="peg-bell"><i class="fa-solid fa-bell"></i></div>
          </div>
          <div class="hanging-card">
            <div class="hanging-img-box">
              <img src="${imgSrc}" alt="${title}" class="hanging-img" onerror="this.src='images/paskas-polaroid.jpg'">
            </div>
            <div class="hanging-caption">
              <p class="h-title">${title}</p>
              <span class="h-sub">${sub}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function populateRegistrationContentSettings() {
  const locInput = document.getElementById('cfg_regLocation');
  const kickerInput = document.getElementById('cfg_regKicker');
  const titleInput = document.getElementById('cfg_regTitle');
  const narrationInput = document.getElementById('cfg_regNarration');

  if (locInput) locInput.value = REGISTRATION_CONTENT.location || '';
  if (kickerInput) kickerInput.value = REGISTRATION_CONTENT.kicker || '';
  if (titleInput) titleInput.value = REGISTRATION_CONTENT.title || '';
  if (narrationInput) narrationInput.value = REGISTRATION_CONTENT.narration || '';

  renderHangingPhotosSettingsManager();
}

function renderHangingPhotosSettingsManager() {
  const container = document.getElementById('settingsHangingPhotosContainer');
  const badge = document.getElementById('polaroidCountBadge');
  if (!container) return;

  const photos = Array.isArray(REGISTRATION_CONTENT.photos) ? REGISTRATION_CONTENT.photos : [];
  if (badge) badge.textContent = `${photos.length} Foto`;

  container.innerHTML = photos.map((item, idx) => `
    <div class="settings-photo-box" data-photo-idx="${idx}">
      <div class="settings-photo-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-image text-gold"></i>
          <span>Foto Polaroid #${idx + 1}</span>
        </div>
        ${photos.length > 1 ? `
          <button type="button" class="btn-remove-photo-item" onclick="removeHangingPhoto(${idx})" title="Hapus foto polaroid #${idx + 1}">
            <i class="fa-solid fa-trash-can"></i> Hapus
          </button>
        ` : ''}
      </div>

      <img class="settings-hanging-preview" src="${item.img || 'images/paskas-polaroid.jpg'}" alt="Preview ${idx + 1}" onerror="this.src='images/paskas-polaroid.jpg'">

      <div class="form-group" style="margin: 4px 0;">
        <label class="form-label" style="font-size: 11px;">Judul Foto</label>
        <input type="text" class="form-control hanging-input-title" value="${escapeHtml(item.title || '')}" placeholder="Cth: Sahabat Paskas" style="padding: 7px 10px; font-size: 12.5px;">
      </div>

      <div class="form-group" style="margin: 4px 0;">
        <label class="form-label" style="font-size: 11px;">Subjudul Foto</label>
        <input type="text" class="form-control hanging-input-sub" value="${escapeHtml(item.sub || '')}" placeholder="Cth: Kafilah Silaturahmi '26" style="padding: 7px 10px; font-size: 12.5px;">
      </div>

      <div class="form-group" style="margin: 4px 0 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <label class="form-label" style="font-size: 11px; margin: 0;">Link / Upload Foto</label>
          <label class="btn btn-outline-cyan btn-xs" style="cursor: pointer; padding: 3px 8px; font-size: 11px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; margin: 0;">
            <i class="fa-solid fa-upload"></i> Upload
            <input type="file" accept="image/*" style="display: none;" onchange="handleHangingPhotoUploadDynamic(event, ${idx})">
          </label>
        </div>
        <input type="text" class="form-control hanging-input-img" value="${item.img || ''}" placeholder="URL foto atau klik Upload" style="padding: 7px 10px; font-size: 12px;" oninput="updateHangingPhotoPreviewDynamic(this, ${idx})">
      </div>
    </div>
  `).join('');
}

function syncHangingPhotoInputsToState() {
  const boxes = document.querySelectorAll('.settings-photo-box');
  if (!boxes.length) return;

  const updatedPhotos = [];
  boxes.forEach((box, i) => {
    const title = (box.querySelector('.hanging-input-title')?.value || '').trim() || `Foto #${i + 1}`;
    const sub = (box.querySelector('.hanging-input-sub')?.value || '').trim() || '';
    const img = (box.querySelector('.hanging-input-img')?.value || '').trim() || (REGISTRATION_CONTENT.photos[i]?.img || 'images/paskas-polaroid.jpg');
    updatedPhotos.push({ img, title, sub });
  });

  REGISTRATION_CONTENT.photos = updatedPhotos;
}

function addNewHangingPhoto() {
  if (!Array.isArray(REGISTRATION_CONTENT.photos)) {
    REGISTRATION_CONTENT.photos = [];
  }
  syncHangingPhotoInputsToState();

  const newIdx = REGISTRATION_CONTENT.photos.length + 1;
  REGISTRATION_CONTENT.photos.push({
    img: 'images/paskas-polaroid.jpg',
    title: `Momen Bahagia ${newIdx}`,
    sub: `Silaturahmi Akbar '26`
  });

  renderHangingPhotosSettingsManager();
  showToast(`Foto Polaroid #${newIdx} berhasil ditambahkan! Silakan atur foto lalu klik Simpan.`, 'info');
}

function removeHangingPhoto(idx) {
  if (!Array.isArray(REGISTRATION_CONTENT.photos) || REGISTRATION_CONTENT.photos.length <= 1) {
    showToast('Minimal harus ada 1 foto polaroid gantung.', 'error');
    return;
  }
  syncHangingPhotoInputsToState();
  REGISTRATION_CONTENT.photos.splice(idx, 1);
  renderHangingPhotosSettingsManager();
  showToast('Foto polaroid berhasil dihapus dari daftar.', 'info');
}

function updateHangingPhotoPreviewDynamic(input, idx) {
  const box = input.closest('.settings-photo-box');
  if (!box) return;
  const prevImg = box.querySelector('.settings-hanging-preview');
  if (prevImg && input.value.trim()) {
    prevImg.src = input.value.trim();
  }
}

async function handleHangingPhotoUploadDynamic(event, idx) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    showToast('Memproses & mengompres foto kualitas tajam...', 'info');
    const res = await compressImageFile(file, 1400, 0.85);

    const box = document.querySelector(`.settings-photo-box[data-photo-idx="${idx}"]`);
    if (box) {
      const inputImg = box.querySelector('.hanging-input-img');
      const prevImg = box.querySelector('.settings-hanging-preview');
      if (inputImg) inputImg.value = res.dataUrl;
      if (prevImg) prevImg.src = res.dataUrl;
    }

    if (REGISTRATION_CONTENT.photos[idx]) {
      REGISTRATION_CONTENT.photos[idx].img = res.dataUrl;
    }

    if (res.isLowRes) {
      showToast(`⚠️ Peringatan: Resolusi gambar sumber agak kecil (${res.width}x${res.height}px).`, 'warning');
    } else {
      showToast(`Foto polaroid #${idx + 1} siap! Klik 'Simpan Lokasi, Narasi & Foto' untuk menerapkan.`, 'success');
    }
  } catch (err) {
    console.error('Gagal upload foto polaroid:', err);
    showToast('Gagal memproses file foto. Pastikan format file gambar valid.', 'error');
  }
}

function saveRegistrationContent() {
  const locationVal = (document.getElementById('cfg_regLocation')?.value || '').trim();
  const kicker = (document.getElementById('cfg_regKicker')?.value || '').trim();
  const title = (document.getElementById('cfg_regTitle')?.value || '').trim();
  const narration = (document.getElementById('cfg_regNarration')?.value || '').trim();

  // Ambil semua input foto yang dinamis
  syncHangingPhotoInputsToState();

  REGISTRATION_CONTENT = {
    location: locationVal || DEFAULT_REGISTRATION_CONTENT.location,
    kicker: kicker || DEFAULT_REGISTRATION_CONTENT.kicker,
    title: title || DEFAULT_REGISTRATION_CONTENT.title,
    narration: narration || DEFAULT_REGISTRATION_CONTENT.narration,
    photos: Array.isArray(REGISTRATION_CONTENT.photos) && REGISTRATION_CONTENT.photos.length > 0 
      ? REGISTRATION_CONTENT.photos 
      : JSON.parse(JSON.stringify(DEFAULT_REGISTRATION_CONTENT.photos))
  };

  try {
    localStorage.setItem('paskas_reg_content', JSON.stringify(REGISTRATION_CONTENT));
  } catch (e) {
    console.warn('Gagal menyimpan paskas_reg_content:', e);
    showToast('Penyimpanan lokal penuh. Coba gunakan link URL gambar.', 'error');
    return;
  }

  // Also sync event_location in settings if dataService exists
  if (window.dataService && typeof window.dataService.saveSettings === 'function') {
    window.dataService.saveSettings({ event_location: REGISTRATION_CONTENT.location });
    const evLocInput = document.getElementById('cfg_eventLocation');
    if (evLocInput) evLocInput.value = REGISTRATION_CONTENT.location;
  }

  renderRegistrationPageContent();
  renderHangingPhotosSettingsManager();
  showToast('Pengaturan lokasi, narasi & galeri foto polaroid berhasil disimpan!', 'success');
}

function resetRegistrationContent() {
  if (confirm('Kembalikan lokasi, narasi dan galeri foto polaroid registrasi ke setelan awal?')) {
    localStorage.removeItem('paskas_reg_content');
    REGISTRATION_CONTENT = JSON.parse(JSON.stringify(DEFAULT_REGISTRATION_CONTENT));
    if (window.dataService && typeof window.dataService.saveSettings === 'function') {
      window.dataService.saveSettings({ event_location: DEFAULT_REGISTRATION_CONTENT.location });
      const evLocInput = document.getElementById('cfg_eventLocation');
      if (evLocInput) evLocInput.value = DEFAULT_REGISTRATION_CONTENT.location;
    }
    renderRegistrationPageContent();
    populateRegistrationContentSettings();
    showToast('Lokasi, narasi & foto polaroid registrasi dikembalikan ke setelan awal.', 'info');
  }
}

function copySqlSchema() {
  const sql = `CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  registration_code VARCHAR(50) UNIQUE NOT NULL,
  registration_type VARCHAR(20) NOT NULL,
  group_name VARCHAR(150),
  group_leader_name VARCHAR(150),
  full_name VARCHAR(200) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  wilayah VARCHAR(150) NOT NULL,
  daerah VARCHAR(150),
  email VARCHAR(150),
  phone_number VARCHAR(50),
  emergency_phone VARCHAR(50),
  arrival_date DATE NOT NULL,
  arrival_time VARCHAR(20),
  departure_date DATE NOT NULL,
  departure_time VARCHAR(20),
  transport_arrival VARCHAR(100) NOT NULL,
  transport_departure VARCHAR(100) NOT NULL,
  cloth_size VARCHAR(10) NOT NULL,
  medical_history TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;
  navigator.clipboard.writeText(sql).then(() => {
    showToast('Skrip SQL berhasil disalin ke clipboard!', 'success');
  });
}

function updateDatabaseBadge() {
  const dot = document.getElementById('dbStatusDot');
  const text = document.getElementById('dbStatusText');
  if (!dot || !text) return;

  if (window.dataService.isSupabaseConnected) {
    dot.className = 'status-dot online';
    text.textContent = 'Supabase Online';
  } else {
    dot.className = 'status-dot local';
    text.textContent = 'Mode Lokal';
  }
}

// ===================================================================
// 10. TOAST NOTIFICATIONS & LISTENERS
// ===================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;

  const iconClass = type === 'success' ? 'fa-circle-check' :
                    type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function setupEventListeners() {
  // Toggle switch label in settings
  const toggleStatus = document.getElementById('cfg_registrationStatus');
  if (toggleStatus) {
    toggleStatus.addEventListener('change', (e) => {
      const label = document.getElementById('cfg_statusLabel');
      if (label) {
        label.textContent = e.target.checked ? 'Pendaftaran DIBUKA' : 'Pendaftaran DITUTUP';
      }
    });
  }

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Keyboard Escape to close modal & story mode
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHeroStory();
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    }
  });
}

// ===================================================================
// 11. KRINCING-KRINCING CHIME SOUND & HANGING PHOTO INTERACTION
// ===================================================================
function playChimeSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // High crystalline metallic wind chime / brass bell frequencies (E6, G6, B6, D7, E7, G7, B7, D8)
    const bellPitches = [1318.51, 1567.98, 1975.53, 2349.32, 2637.02, 3135.96, 3520.00, 3951.07];
    const now = ctx.currentTime;
    
    // Play a burst of 6-7 sparkling cascading bell strikes ("Krincing-krincing!")
    const count = 7;
    for (let i = 0; i < count; i++) {
      const strikeTime = now + (i * 0.052) + (Math.random() * 0.02);
      const pitch = bellPitches[Math.floor(Math.random() * bellPitches.length)] * (1 + (Math.random() * 0.03 - 0.015));

      // Fundamental oscillator (pure crystal sine)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, strikeTime);

      // Inharmonic metallic overtone for realistic bell shimmer
      const overtone = ctx.createOscillator();
      const overGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(pitch * 2.756, strikeTime);

      // Volume envelope (crisp attack, natural acoustic decay)
      gain.gain.setValueAtTime(0, strikeTime);
      gain.gain.linearRampToValueAtTime(0.22, strikeTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 0.95);

      overGain.gain.setValueAtTime(0, strikeTime);
      overGain.gain.linearRampToValueAtTime(0.08, strikeTime + 0.004);
      overGain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 0.6);

      // Connect nodes
      osc.connect(gain);
      overtone.connect(overGain);
      gain.connect(ctx.destination);
      overGain.connect(ctx.destination);

      osc.start(strikeTime);
      overtone.start(strikeTime);
      osc.stop(strikeTime + 1.0);
      overtone.stop(strikeTime + 0.65);
    }
  } catch (err) {
    console.warn('AudioContext playback error:', err);
  }
}

function interactHangingPhoto(photoEl) {
  if (!photoEl) return;

  // 1. Play crystal bell chime sound ("krincing-krincing")
  playChimeSound();

  // 2. Trigger vigorous sway animation on the clicked photo
  photoEl.classList.remove('is-ringing');
  void photoEl.offsetWidth; // Force DOM reflow
  photoEl.classList.add('is-ringing');

  // Remove animation class after finishing
  setTimeout(() => {
    photoEl.classList.remove('is-ringing');
  }, 1350);
}

