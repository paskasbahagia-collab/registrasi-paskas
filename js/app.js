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

  if (url.includes('google.com/maps') || url.includes('maps.google') || url.includes('goo.gl')) {
    // Jika mengarah ke Rocket Convention Hall di Google Maps, gunakan aset foto ultra-jernih lokal
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
    subtitle: 'Dari kedatangan hingga pulang penuh rasa dan makna, kita berkumpul sebagai keluarga',
    badge: '01 / 06',
    coverImg: 'images/tugu-jogja-hero.jpg',
    thumbImg: 'images/tugu-jogja-card.jpg',
    narration: `PASKAS Bahagia merupakan rumah perjumpaan keluarga besar Pasukan Amal Sholeh dari berbagai penjuru Nusantara. Sebuah momentum untuk pulang, merajut kembali ukhuwah, berbagi inspirasi, memperkuat identitas gerakan, serta menumbuhkan semangat kolaborasi dalam menghadirkan manfaat bagi umat.

Selama tiga hari, para PASKAS akan mengikuti rangkaian kegiatan yang memadukan silaturahim, pembelajaran, pengabdian, kreativitas, dan penguatan kapasitas. Seperti pulang kampung, setiap peserta datang membawa kisah dan program dari daerahnya, lalu kembali dengan pengalaman bermakna dan semangat baru untuk menggerakkan kebaikan di daerah masing-masing.

**RABU, 11 NOVEMBER**
• Kedatangan dan registrasi peserta

**KAMIS, 12 NOVEMBER**
• Opening ceremony
• Upgrading PASKAS
• Pameran Kampong PASKAS
• Workshop dan sharing inspirasi

**JUMAT, 13 NOVEMBER**
• SMK
• Outbound Ukhuwah
• Dahar Kembulan
• Malam Puncak PASKAS Bahagia
• Panggung Karya PASKAS
• Sesi bersama Ayah Man

**SABTU, 14 NOVEMBER**
• Upgrading PASKAS
• Closing Ceremony`,
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
    subtitle: 'Venue Kegiatan',
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
    coverImg: 'images/paskas-transportasi-truck.jpg',
    thumbImg: 'images/paskas-transportasi-truck.jpg',
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

// Inisialisasi kartu dinamis (disimpan di browser & Supabase cloud)
function loadStoredCards() {
  try {
    const saved = localStorage.getItem('paskas_custom_cards');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let needsSave = false;
        parsed.forEach((c, idx) => {
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
  location: 'Roket Convention Center',
  kicker: 'KAFILAH & SAHABAT PASKAS',
  title: 'Kumpul Keluarga Paskas Bahagia di Sleman, Yogyakarta',
  narration: 'Mari pulang, berkumpul, dan saling menguatkan. Daftarkan dirimu untuk Kumpul Keluarga PASKAS Bahagia, Sleman, Yogyakarta. Kembali Menghadirkan Rasa dan Makna, Bertumbuh Sehat Bersama.',
  photos: [
    {
      img: 'images/paskas-polaroid.jpg',
      title: 'Sahabat Paskas',
      sub: 'Menjalin Ukhuwah'
    },
    {
      img: 'images/paskas-camp-circle.jpg',
      title: 'Terus Bergerak',
      sub: 'Peduli Sesama'
    },
    {
      img: 'images/paskas-berkah-smile.jpg',
      title: 'Berbagi Ceria',
      sub: 'Senyum Relawan Ummat'
    },
    {
      img: 'images/paskas-relawan-banner.jpg',
      title: 'Hadirkan Rasa',
      sub: 'Tetap Bergerak'
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
        const resolvedLocation = parsed.location || fallbackLocation;

        return {
          location: resolvedLocation,
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
let chartHealthInstance = null;
let chartHealthAllInstance = null;
let chartPaskasInstance = null;
let chartPaskasAllInstance = null;

// ===================================================================
// MASTER WILAYAH / ASAL DAERAH KAFILAH
// ===================================================================
const DEFAULT_MASTER_WILAYAH = [
  'Ibt',
  '3 J',
  'Barat Jawa',
  'Sumatera 1',
  'Sumatera 2',
  'Kalimantan 1',
  'Kalimantan 2'
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(w => typeof w === 'string' && w.trim());
      }
    }
  } catch (e) {
    console.error('Error loading master wilayah:', e);
  }
  return [...DEFAULT_MASTER_WILAYAH];
}

function saveMasterWilayahList(list) {
  try {
    const cleanList = Array.isArray(list) ? list.filter(w => typeof w === 'string' && w.trim()) : [];
    localStorage.setItem('paskas_master_wilayah', JSON.stringify(cleanList));
    if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
      window.dataService.saveCloudSetting('paskas_master_wilayah', cleanList);
    }
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

  // 1. FIRST PAINT INSTAN (0 milidetik): Render UI langsung dari data lokal & default
  // Mencegah countdown 00:00:00:00 atau kartu kosong saat menunggu koneksi jaringan Supabase
  try {
    DASHBOARD_CARDS = loadStoredCards();
    REGISTRATION_CONTENT = loadStoredRegistrationContent();
  } catch (errCards) {
    console.warn('Gagal memuat kartu/konten tersimpan:', errCards);
  }

  if (DASHBOARD_CARDS && DASHBOARD_CARDS[0] && DASHBOARD_CARDS[0].coverImg) {
    const bg1 = document.getElementById('heroBg1');
    if (bg1) {
      bg1.style.backgroundImage = `url('${parseDirectImageUrl(DASHBOARD_CARDS[0].coverImg)}')`;
    }
  }

  renderDashboardCards();
  applyEventInfoToUI();
  renderRegistrationPageContent();
  renderAnnouncementUI();
  initCountdownTimer();
  updateDatabaseBadge();
  setupEventListeners();

  // Inisialisasi Master Wilayah (Dropdown & Settings)
  initMasterWilayah();

  // Inisialisasi form kelompok & tanggal default
  initGroupMembers();
  setDefaultDates();

  // If page-settings is already active on load, ensure theme class is applied
  if (document.getElementById('page-settings')?.classList.contains('active')) {
    document.body.classList.add('page-settings-active');
  }

  // 2. SINKRONISASI DATA DARI SUPABASE DI LATAR BELAKANG (Non-blocking)
  if (window.dataService && window.dataService.syncSettingsFromSupabase) {
    try {
      await window.dataService.syncSettingsFromSupabase();

      // Muat ulang kartu dan konten registrasi setelah sinkronisasi dari Supabase
      DASHBOARD_CARDS = loadStoredCards();
      REGISTRATION_CONTENT = loadStoredRegistrationContent();

      if (DASHBOARD_CARDS && DASHBOARD_CARDS[0] && DASHBOARD_CARDS[0].coverImg) {
        const bg1 = document.getElementById('heroBg1');
        if (bg1) {
          bg1.style.backgroundImage = `url('${parseDirectImageUrl(DASHBOARD_CARDS[0].coverImg)}')`;
        }
      }

      renderDashboardCards();
      applyEventInfoToUI();
      renderRegistrationPageContent();
      renderAnnouncementUI();
      initCountdownTimer();
      initMasterWilayah();
    } catch (e) {
      console.warn('Sync settings on load:', e);
    }
  }

  // Inisialisasi input Pengaturan dengan data Cloud Supabase (tanpa berpindah tab)
  try {
    initSettingsPage('rekap', true);
  } catch (errSettings) {
    console.warn('Gagal inisialisasi form pengaturan:', errSettings);
  }

  // Load Registrations & Metrics
  await loadAndRenderRegistrations();
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
          <span class="info-card-label">${escapeHtml(card.title)}</span>
          <span class="info-card-sub">${escapeHtml(card.subtitle || card.category || '')}</span>
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
    hero.classList.remove('announcement-active');
    hero.classList.add('story-active');
  }

  // Sinkronkan highlight kartu di track
  syncActiveCardHighlight();
  updateCarouselProgress();
}

// ===================================================================
// KATALOG & DESAIN MODEL SERAGAM RESMI IKHWAN & AKHWAT
// ===================================================================
// KATALOG & DESAIN MODEL SERAGAM RESMI IKHWAN & AKHWAT
// ===================================================================
const DEFAULT_SIZE_CHART_IKHWAN = 'S: LB 49cm / PB 75cm / PT 20cm\nM: LB 52cm / PB 77cm / PT 21cm\nL: LB 55cm / PB 80cm / PT 22cm\nXL: LB 59cm / PB 82cm / PT 23cm\n2XL: LB 63cm / PB 84cm / PT 24cm\n3XL: LB 66cm / PB 86cm / PT 25cm';
const DEFAULT_SIZE_CHART_AKHWAT = 'S: LD 96cm / PB 64cm / LB 40cm\nM: LD 100cm / PB 66cm / LB 42cm\nL: LD 104cm / PB 68cm / LB 44cm\nXL: LD 108cm / PB 70cm / LB 46cm\nXXL: LD 114cm / PB 72cm / LB 48cm\n3XL: LD 120cm / PB 74cm / LB 50cm\n4XL: LD 126cm / PB 76cm / LB 52cm';
const DEFAULT_SIZE_CHART_TEXT = DEFAULT_SIZE_CHART_IKHWAN;

function getUniformSettings() {
  const settings = (window.dataService && typeof window.dataService.getSettings === 'function')
    ? window.dataService.getSettings()
    : {};

  let ikhwanChart = settings.uniform_size_chart_ikhwan || localStorage.getItem('paskas_uniform_size_chart_ikhwan');
  if (!ikhwanChart || ikhwanChart.includes('Lebar 46cm / LD 92cm')) {
    ikhwanChart = DEFAULT_SIZE_CHART_IKHWAN;
  }

  let akhwatChart = settings.uniform_size_chart_akhwat || localStorage.getItem('paskas_uniform_size_chart_akhwat');
  if (!akhwatChart || akhwatChart.includes('Lebar 46cm / LD 92cm')) {
    akhwatChart = DEFAULT_SIZE_CHART_AKHWAT;
  }

  return {
    ikhwanImg: settings.uniform_ikhwan_image || localStorage.getItem('paskas_uniform_ikhwan_image') || 'images/seragam-ikhwan.jpg',
    akhwatImg: settings.uniform_akhwat_image || localStorage.getItem('paskas_uniform_akhwat_image') || 'images/seragam-akhwat.jpg',
    ikhwanTitle: settings.uniform_title_ikhwan || localStorage.getItem('paskas_uniform_ikhwan_title') || 'Model Kaos Resmi Ikhwan',
    akhwatTitle: settings.uniform_title_akhwat || localStorage.getItem('paskas_uniform_akhwat_title') || 'Model Kaos / Tunik Resmi Akhwat',
    ikhwanDesc: settings.uniform_desc_ikhwan || localStorage.getItem('paskas_uniform_ikhwan_desc') || 'Bahan katun combed 24s premium adem, sablon plastisol emas logo resmi Paskas Bahagia.',
    akhwatDesc: settings.uniform_desc_akhwat || localStorage.getItem('paskas_uniform_akhwat_desc') || 'Model tunik lengan panjang syar\'i & anggun, bahan katun combed 24s adem dengan aksen list emas.',
    ikhwanSizeChart: ikhwanChart,
    akhwatSizeChart: akhwatChart
  };
}

function renderSizeChartPills(rawText, genderType = 'ikhwan') {
  if (!rawText || !rawText.trim()) return '';
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const badgeClass = genderType === 'ikhwan' ? 'ikhwan' : 'akhwat';
  return lines.map(line => {
    let code = '';
    let val = line;
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      code = line.substring(0, colonIdx).trim();
      val = line.substring(colonIdx + 1).trim();
    }

    const parts = val.split(/[\/\&•|;]/).map(p => p.trim()).filter(Boolean);
    let specsHtml = '';
    if (parts.length > 0) {
      specsHtml = parts.map(p => {
        const m = p.match(/^([A-Za-z]+)\s*(.*)$/);
        if (m && m[1] && m[2]) {
          return `<span class="size-metric-badge"><span class="metric-key">${escapeHtml(m[1])}</span><span class="metric-val">${escapeHtml(m[2])}</span></span>`;
        }
        return `<span class="size-metric-badge single-metric">${escapeHtml(p)}</span>`;
      }).join('');
    } else {
      specsHtml = `<span class="size-metric-badge single-metric">${escapeHtml(val)}</span>`;
    }

    return `
      <div class="size-row-card size-row-${badgeClass}">
        ${code ? `<div class="size-code-badge">${escapeHtml(code)}</div>` : ''}
        <div class="size-specs-group">
          ${specsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function renderUniformShowcaseHTML() {
  const uniforms = getUniformSettings();

  return `
    <div class="uniform-showcase-wrap">
      <!-- Luxury Header Bar -->
      <div class="uniform-showcase-header-luxury">
        <div class="uniform-showcase-tag">
          <i class="fa-solid fa-sparkles text-gold"></i>
          <span>EDISI EKSKLUSIF RESMI SILATURAHMI AKBAR PASKAS</span>
        </div>
        <h3 class="uniform-showcase-title">
          <i class="fa-solid fa-shirt text-gold"></i>
          Atribut &amp; Seragam Resmi Peserta
        </h3>
        <p class="uniform-showcase-subtitle">
          Disediakan khusus 2 desain resmi seragam untuk seluruh peserta terdaftar. Didesain secara syar'i, elegan, dan nyaman digunakan selama seluruh rangkaian agenda acara.
        </p>
      </div>

      <!-- Grid 2 Baju: Ikhwan & Akhwat -->
      <div class="uniform-cards-grid">
        <!-- Card 1: Seragam Ikhwan -->
        <div class="uniform-item-card uniform-card-ikhwan">
          <div class="uniform-card-top-bar">
            <span class="badge-gender-ikhwan">
              <i class="fa-solid fa-mars"></i> Khusus Ikhwan (Laki-laki)
            </span>
            <span class="uniform-model-tag">
              <i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> Model 01
            </span>
          </div>

          <div class="uniform-img-viewport" onclick="openUniformImageLightbox('${uniforms.ikhwanImg}', '${escapeHtml(uniforms.ikhwanTitle)}')">
            <img src="${uniforms.ikhwanImg}" id="storyUniformImgIkhwan" alt="Desain Seragam Ikhwan" onerror="this.src='images/seragam-ikhwan.jpg'">
            <div class="uniform-img-overlay">
              <span class="uniform-zoom-pill">
                <i class="fa-solid fa-magnifying-glass-plus"></i> Klik untuk Perbesar HD
              </span>
            </div>
          </div>

          <div class="uniform-card-content">
            <div class="uniform-card-header-meta">
              <h5 class="uniform-card-title">${escapeHtml(uniforms.ikhwanTitle)}</h5>
              <div class="uniform-card-subtitle-badge ikhwan">
                <i class="fa-solid fa-mars"></i> Seragam Kaos Resmi Ikhwan
              </div>
            </div>
            ${uniforms.ikhwanDesc ? `
              <div class="uniform-card-notes-box uniform-notes-box-ikhwan">
                <div class="uniform-notes-tag">
                  <i class="fa-solid fa-clipboard-list"></i>
                  <span>Catatan &amp; Spesifikasi Baju Ikhwan</span>
                </div>
                <div class="uniform-notes-body">
                  ${renderFormattedNarrationHTML(uniforms.ikhwanDesc)}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Card 2: Seragam Akhwat -->
        <div class="uniform-item-card uniform-card-akhwat">
          <div class="uniform-card-top-bar">
            <span class="badge-gender-akhwat">
              <i class="fa-solid fa-venus"></i> Khusus Akhwat (Perempuan)
            </span>
            <span class="uniform-model-tag">
              <i class="fa-solid fa-circle-check" style="color: #f472b6;"></i> Model 02
            </span>
          </div>

          <div class="uniform-img-viewport" onclick="openUniformImageLightbox('${uniforms.akhwatImg}', '${escapeHtml(uniforms.akhwatTitle)}')">
            <img src="${uniforms.akhwatImg}" id="storyUniformImgAkhwat" alt="Desain Seragam Akhwat" onerror="this.src='images/seragam-akhwat.jpg'">
            <div class="uniform-img-overlay">
              <span class="uniform-zoom-pill">
                <i class="fa-solid fa-magnifying-glass-plus"></i> Klik untuk Perbesar HD
              </span>
            </div>
          </div>

          <div class="uniform-card-content">
            <div class="uniform-card-header-meta">
              <h5 class="uniform-card-title">${escapeHtml(uniforms.akhwatTitle)}</h5>
              <div class="uniform-card-subtitle-badge akhwat">
                <i class="fa-solid fa-venus"></i> Seragam Rompi / Outer Resmi Akhwat
              </div>
            </div>
            ${uniforms.akhwatDesc ? `
              <div class="uniform-card-notes-box uniform-notes-box-akhwat">
                <div class="uniform-notes-tag">
                  <i class="fa-solid fa-clipboard-list"></i>
                  <span>Catatan &amp; Spesifikasi Rompi Akhwat</span>
                </div>
                <div class="uniform-notes-body">
                  ${renderFormattedNarrationHTML(uniforms.akhwatDesc)}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Size Chart Guide Banner (Ikhwan & Akhwat Terpisah Rapi & Elegan) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 20px;">
        <!-- Size Chart Ikhwan -->
        <div class="uniform-size-guide-card uniform-size-card-ikhwan">
          <div class="uniform-size-guide-head">
            <div class="uniform-size-guide-left">
              <div class="uniform-size-badge-pill ikhwan">
                <i class="fa-solid fa-mars"></i> Size Chart Ikhwan
              </div>
              <span class="uniform-size-guide-sub">Kaos Paskas &bull; Model 01</span>
            </div>
            <button type="button" class="btn-visual-guide btn-visual-guide-ikhwan" onclick="openUniformImageLightbox('https://cyqtyobzhqzmelmmpbdb.supabase.co/storage/v1/object/public/paskas%20bahagia/size-charts/size-chart-kaos-ikhwan.png', 'Panduan Visual Size Chart Kaos Ikhwan')">
              <i class="fa-solid fa-expand"></i>
              <span>Panduan Visual HD</span>
            </button>
          </div>

          <div class="uniform-size-grid-list">
            ${renderSizeChartPills(uniforms.ikhwanSizeChart, 'ikhwan')}
          </div>

          <div class="uniform-size-guide-footer">
            <div class="uniform-size-legend">
              <i class="fa-solid fa-circle-info"></i>
              <span><strong>Keterangan:</strong> LB = Lebar Badan &bull; PB = Panjang Badan &bull; PT = Panjang Tangan <span class="legend-tolerance">(Toleransi &plusmn;1&ndash;2 cm)</span></span>
            </div>
          </div>
        </div>

        <!-- Size Chart Akhwat -->
        <div class="uniform-size-guide-card uniform-size-card-akhwat">
          <div class="uniform-size-guide-head">
            <div class="uniform-size-guide-left">
              <div class="uniform-size-badge-pill akhwat">
                <i class="fa-solid fa-venus"></i> Size Chart Akhwat
              </div>
              <span class="uniform-size-guide-sub">Rompi / Outer &bull; Model 02</span>
            </div>
            <button type="button" class="btn-visual-guide btn-visual-guide-akhwat" onclick="openUniformImageLightbox('https://cyqtyobzhqzmelmmpbdb.supabase.co/storage/v1/object/public/paskas%20bahagia/size-charts/size-chart-rompi-akhwat.png', 'Panduan Visual Size Chart Rompi Akhwat')">
              <i class="fa-solid fa-expand"></i>
              <span>Panduan Visual HD</span>
            </button>
          </div>

          <div class="uniform-size-grid-list">
            ${renderSizeChartPills(uniforms.akhwatSizeChart, 'akhwat')}
          </div>

          <div class="uniform-size-guide-footer">
            <div class="uniform-size-legend">
              <i class="fa-solid fa-circle-info"></i>
              <span><strong>Keterangan:</strong> LD = Lingkar Dada &bull; PB = Panjang Badan &bull; LB = Lebar Bahu <span class="legend-tolerance">(Toleransi &plusmn;1&ndash;2 cm)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function handleUniformImageUpload(event, genderType) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    showToast('Ukuran file gambar maksimal 8MB.', 'warning');
    return;
  }

  showToast(`Sedang mengunggah foto desain seragam ${genderType === 'ikhwan' ? 'Ikhwan' : 'Akhwat'} ke Supabase Storage...`, 'info');

  try {
    const res = await compressImageFile(file, 1600, 0.88);
    let finalUrl = res.dataUrl;
    if (window.dataService && typeof window.dataService.uploadAssetFile === 'function') {
      try {
        finalUrl = await window.dataService.uploadAssetFile(res.dataUrl, 'uniforms', `uniform-${genderType}`);
      } catch (errUp) {
        console.warn('Gagal upload ke storage:', errUp);
      }
    }

    const key = genderType === 'ikhwan' ? 'uniform_ikhwan_image' : 'uniform_akhwat_image';
    const localKey = genderType === 'ikhwan' ? 'paskas_uniform_ikhwan_image' : 'paskas_uniform_akhwat_image';

    try {
      localStorage.setItem(localKey, finalUrl);
    } catch(err) {
      console.warn('Storage quota warning for uniform image:', err);
    }

    if (window.dataService) {
      if (typeof window.dataService.saveSettings === 'function') {
        try { await window.dataService.saveSettings({ [key]: finalUrl }); } catch (err) {}
      }
      if (typeof window.dataService.saveCloudSetting === 'function') {
        try { await window.dataService.saveCloudSetting(key, finalUrl); } catch (err) {}
      }
    }

    // Update DOM image preview
    const imgEl = document.getElementById(genderType === 'ikhwan' ? 'storyUniformImgIkhwan' : 'storyUniformImgAkhwat');
    if (imgEl) imgEl.src = finalUrl;

    // Refresh if settings panel is open
    const cfgImgEl = document.getElementById(genderType === 'ikhwan' ? 'cfg_uniformIkhwanThumb' : 'cfg_uniformAkhwatThumb');
    if (cfgImgEl) cfgImgEl.src = finalUrl;
    const cfgCardEl = document.getElementById(genderType === 'ikhwan' ? 'cfg_cardUniformIkhwanThumb' : 'cfg_cardUniformAkhwatThumb');
    if (cfgCardEl) cfgCardEl.src = finalUrl;
    const cfgInput = document.getElementById(genderType === 'ikhwan' ? 'cfg_cardUniformIkhwanImg' : 'cfg_cardUniformAkhwatImg');
    if (cfgInput) cfgInput.value = finalUrl;

    showToast(`Alhamdulillah, desain baju ${genderType === 'ikhwan' ? 'Ikhwan' : 'Akhwat'} berhasil disimpan permanen ke Cloud Supabase!`, 'success');
  } catch (err) {
    console.error('Gagal memproses upload baju:', err);
    showToast('Gagal memproses file desain baju.', 'error');
  }
}

function openUniformImageLightbox(src, title) {
  const modal = document.getElementById('uniformLightboxModal');
  const img = document.getElementById('uniformLightboxImg');
  const titleEl = document.getElementById('uniformLightboxTitle');
  if (!modal || !img) return;

  img.src = src;
  if (titleEl) titleEl.textContent = title || 'Model Seragam Paskas';
  modal.classList.add('active');
}

function closeUniformImageLightbox(e) {
  if (e && e.target && e.target.closest && e.target.closest('.uniform-lightbox-card')) return;
  const modal = document.getElementById('uniformLightboxModal');
  if (modal) modal.classList.remove('active');
}

window.getUniformSettings = getUniformSettings;
window.renderUniformShowcaseHTML = renderUniformShowcaseHTML;
window.handleUniformImageUpload = handleUniformImageUpload;
window.handleUniformSettingsUpload = handleUniformSettingsUpload;
window.updateUniformThumbPreview = updateUniformThumbPreview;
window.openUniformImageLightbox = openUniformImageLightbox;
window.closeUniformImageLightbox = closeUniformImageLightbox;

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

  if (counterEl) {
    counterEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(DASHBOARD_CARDS.length).padStart(2, '0')}`;
  }

  if (bodyEl) {
    const isUniformCard = (card.id === 'card-4') || 
                          (card.title && card.title.toLowerCase().includes('seragam')) ||
                          (card.category && card.category.toLowerCase().includes('atribut'));

    if (isUniformCard) {
      bodyEl.innerHTML = renderUniformShowcaseHTML();
      return;
    }

    if (card.narration && card.narration.trim()) {
      bodyEl.innerHTML = `
        <div class="modal-rich-section">
          <h4><i class="fa-solid fa-circle-info"></i> Informasi &amp; Narasi Acara</h4>
          ${renderFormattedNarrationHTML(card.narration)}
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
    populateWilayahDropdowns();
    const successContainer = document.getElementById('regSuccessViewContainer');
    if (successContainer) successContainer.style.display = 'none';

    const hangingGallery = document.querySelector('.hanging-gallery-wrapper');
    const floatingBar = document.querySelector('.retreat-floating-bar-wrapper');
    const storyGrid = document.getElementById('storyContentGrid');
    const ctaWrap = document.getElementById('regisCtaWrapper');
    const promptBox = document.getElementById('regTypePromptBox');
    const formCard = document.getElementById('regFormCardContainer');

    if (hangingGallery) hangingGallery.style.display = '';
    if (floatingBar) floatingBar.style.display = '';
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

function toggleWideFormLayout(enableWide) {
  const storySection = document.getElementById('guidelines-container');
  const formCard = document.getElementById('regFormCardContainer');
  if (storySection) {
    if (enableWide) {
      storySection.classList.add('wide-mode');
    } else {
      storySection.classList.remove('wide-mode');
    }
  }
  if (formCard) {
    if (enableWide) {
      formCard.classList.add('wide-mode');
    } else {
      formCard.classList.remove('wide-mode');
    }
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
  toggleWideFormLayout(false);

  // Sembunyikan lembar form dan tampilkan kembali kartu pemilihan format kepesertaan
  if (cardIndividu) cardIndividu.classList.remove('is-selected');
  if (cardKelompok) cardKelompok.classList.remove('is-selected');
  if (formCard) formCard.style.display = 'none';

  const grpInputs = document.getElementById('grpInputsContainer');
  const grpPane = document.getElementById('grpPreviewPane');
  if (grpPane) grpPane.style.display = 'none';
  if (grpInputs) grpInputs.style.display = 'block';

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
  populateWilayahDropdowns();
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
    toggleWideFormLayout(false);
    
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
    toggleWideFormLayout(true); // Otomatis aktifkan mode lebar plong untuk kenyamanan tabel kelompok

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
// ===================================================================
// PAS FOTO PESERTA: COMPRESSION & UPLOAD HANDLERS
// ===================================================================
let ind_selectedPhotoData = null;

function compressImageFile(file, maxWidth = 800, maxHeight = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar valid.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar untuk dikompresi.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}

async function handleIndividuPhotoSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  try {
    showToast('Memproses dan mengoptimalkan pas foto...', 'info');
    const compressed = await compressImageFile(file, 800, 1000, 0.82);
    ind_selectedPhotoData = compressed;

    const previewSlot = document.getElementById('ind_photoPreviewSlot');
    const emptyState = document.getElementById('ind_photoEmptyState');
    const previewImg = document.getElementById('ind_photoPreviewImg');
    const btnRemove = document.getElementById('ind_btnRemovePhoto');
    const btnLabel = document.getElementById('ind_btnPhotoLabel');

    if (emptyState) emptyState.style.display = 'none';
    if (previewImg) {
      previewImg.src = compressed;
      previewImg.style.display = 'block';
    }
    if (btnRemove) btnRemove.style.display = 'inline-flex';
    if (btnLabel) btnLabel.textContent = 'Ganti Foto';

    showToast('Pas foto berhasil diunggah dan siap dicetak pada E-Tiket.', 'success');
  } catch (err) {
    showToast('Gagal memproses foto: ' + err.message, 'error');
  }
}

function removeIndividuPhoto() {
  ind_selectedPhotoData = null;
  const input = document.getElementById('ind_photoInput');
  if (input) input.value = '';

  const emptyState = document.getElementById('ind_photoEmptyState');
  const previewImg = document.getElementById('ind_photoPreviewImg');
  const btnRemove = document.getElementById('ind_btnRemovePhoto');
  const btnLabel = document.getElementById('ind_btnPhotoLabel');

  if (emptyState) emptyState.style.display = 'flex';
  if (previewImg) {
    previewImg.src = '';
    previewImg.style.display = 'none';
  }
  if (btnRemove) btnRemove.style.display = 'none';
  if (btnLabel) btnLabel.textContent = 'Pilih / Ambil Foto';
  showToast('Pas foto telah dihapus.', 'info');
}

function triggerRowPhotoUpload(type, id) {
  const input = document.getElementById(`${type}PhotoInput-${id}`);
  if (input) input.click();
}

async function handleRowPhotoSelected(e, type, id) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  try {
    const compressed = await compressImageFile(file, 750, 950, 0.80);
    const hiddenInput = document.getElementById(`${type}PhotoData-${id}`);
    if (hiddenInput) hiddenInput.value = compressed;

    const slot = document.getElementById(`${type}PhotoSlot-${id}`);
    if (slot) {
      slot.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <img src="${compressed}" class="cell-photo-thumb" onclick="openPhotoPreviewLightbox('${compressed.replace(/'/g, "\\'")}', 'Peserta #${id}')" title="Klik untuk lihat foto">
          <i class="fa-solid fa-circle-xmark" style="color: #ef4444; font-size: 14px; cursor: pointer;" onclick="removeRowPhoto('${type}', ${id})" title="Hapus foto"></i>
        </div>
      `;
    }
    showToast('Foto peserta berhasil dipasang.', 'success');
  } catch (err) {
    showToast('Gagal memproses foto: ' + err.message, 'error');
  }
}

function removeRowPhoto(type, id) {
  const hiddenInput = document.getElementById(`${type}PhotoData-${id}`);
  if (hiddenInput) hiddenInput.value = '';
  const fileInput = document.getElementById(`${type}PhotoInput-${id}`);
  if (fileInput) fileInput.value = '';

  const slot = document.getElementById(`${type}PhotoSlot-${id}`);
  if (slot) {
    slot.innerHTML = `
      <button type="button" class="cell-photo-btn" onclick="triggerRowPhotoUpload('${type}', ${id})" title="Unggah Pas Foto">
        <i class="fa-solid fa-camera"></i> +Foto
      </button>
    `;
  }
}

function openPhotoPreviewLightbox(imgSrc, name = 'Peserta') {
  if (!imgSrc) return;
  const modal = document.getElementById('photoPreviewLightboxModal');
  const imgEl = document.getElementById('photoLightboxImg');
  const titleEl = document.getElementById('photoLightboxTitle');
  if (imgEl) imgEl.src = imgSrc;
  if (titleEl) titleEl.textContent = `Pas Foto: ${name}`;
  if (modal) modal.classList.add('active');
}

function closePhotoPreviewLightbox(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('btn-close-modal-sm') && !e.target.closest('.btn-close-modal-sm') && !e.target.classList.contains('btn-secondary')) {
    return;
  }
  const modal = document.getElementById('photoPreviewLightboxModal');
  if (modal) modal.classList.remove('active');
}

window.handleIndividuPhotoSelected = handleIndividuPhotoSelected;
window.removeIndividuPhoto = removeIndividuPhoto;
window.triggerRowPhotoUpload = triggerRowPhotoUpload;
window.handleRowPhotoSelected = handleRowPhotoSelected;
window.removeRowPhoto = removeRowPhoto;
window.openPhotoPreviewLightbox = openPhotoPreviewLightbox;
window.closePhotoPreviewLightbox = closePhotoPreviewLightbox;

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

function checkEmergencyPhoneMatch(notifyUser = true) {
  const phoneInput = document.getElementById('ind_phone');
  const emergencyInput = document.getElementById('ind_emergencyPhone');
  const errorEl = document.getElementById('ind_emergencyPhone_error');
  if (!phoneInput || !emergencyInput) return false;

  const phone = phoneInput.value.trim();
  const emergency = emergencyInput.value.trim();
  if (!phone || !emergency) {
    if (errorEl) errorEl.style.display = 'none';
    emergencyInput.classList.remove('is-invalid');
    emergencyInput.style.borderColor = '';
    return false;
  }

  // Normalisasi nomor HP (hanya angka, konversi awalan 62 ke 0)
  const normPhone = phone.replace(/\D/g, '').replace(/^62/, '0');
  const normEmergency = emergency.replace(/\D/g, '').replace(/^62/, '0');

  if (normPhone && normEmergency && normPhone === normEmergency) {
    if (errorEl) errorEl.style.display = 'block';
    emergencyInput.classList.add('is-invalid');
    emergencyInput.style.borderColor = '#ef4444';
    if (notifyUser && typeof showToast === 'function') {
      showToast('⚠️ Nomor HP darurat tidak boleh sama dengan nomor WhatsApp aktif Anda! Harap cantumkan nomor keluarga/kerabat terdekat demi keselamatan.', 'warning', 6000);
    }
    return true;
  } else {
    if (errorEl) errorEl.style.display = 'none';
    emergencyInput.classList.remove('is-invalid');
    emergencyInput.style.borderColor = '';
    return false;
  }
}
window.checkEmergencyPhoneMatch = checkEmergencyPhoneMatch;

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
    const joinYear = document.getElementById('ind_joinYear')?.value.trim();
    if (!joinYear) {
      showToast('Mohon cantumkan tahun bergabung Anda di Paskas (hanya tahun, contoh: 2021).', 'error');
      document.getElementById('ind_joinYear')?.focus();
      return false;
    }
    const currentYear = new Date().getFullYear();
    const joinYearNum = parseInt(joinYear, 10);
    if (isNaN(joinYearNum) || joinYearNum < 2000 || joinYearNum > currentYear) {
      showToast(`Tahun bergabung harus berupa tahun 4 digit yang valid (antara 2000 s/d ${currentYear}).`, 'error');
      document.getElementById('ind_joinYear')?.focus();
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
    if (checkEmergencyPhoneMatch(true)) {
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

function checkDuplicateRegistration({ full_name, phone_number, email = '', wilayah, is_child, excludeId = null, isGroupMember = false, leaderPhone = '' }) {
  if (!allRegistrations || !allRegistrations.length) return null;

  const targetName = (full_name || '').trim().toLowerCase();
  const targetPhone = normalizePhoneNumber(phone_number);
  const targetEmail = (email || '').trim().toLowerCase();
  const normLeaderPhone = normalizePhoneNumber(leaderPhone);
  const targetWilayah = (wilayah || '').trim().toLowerCase();

  for (const reg of allRegistrations) {
    if (excludeId && String(reg.id) === String(excludeId)) continue;

    const existingName = (reg.full_name || '').trim().toLowerCase();
    const existingPhone = normalizePhoneNumber(reg.phone_number);
    const existingEmail = (reg.email || '').trim().toLowerCase();
    const existingWilayah = (reg.wilayah || '').trim().toLowerCase();
    const existingIsChild = reg.is_child || (reg.age && parseInt(reg.age, 10) < 15);

    // Kriteria 1: Nama Lengkap sama di Wilayah yang sama (atau nama sama persis)
    if (targetName && existingName && targetName === existingName) {
      if (!targetWilayah || !existingWilayah || targetWilayah === existingWilayah) {
        return {
          matchedBy: 'name_wilayah',
          message: `Peserta dengan nama "${reg.full_name}" dari kafilah "${reg.wilayah || 'Umum'}" sudah terdaftar sebelumnya.`,
          existing: reg
        };
      }
    }

    // Kriteria 2: Untuk dewasa (bukan anak-anak), nomor WhatsApp sama persis
    // PENTING: Jika anggota rombongan memakai nomor HP koordinator/ketua, jangan dianggap duplikat jika namanya berbeda!
    const isSharedLeaderPhone = isGroupMember && normLeaderPhone && targetPhone === normLeaderPhone;
    if (!is_child && !existingIsChild && targetPhone && existingPhone && targetPhone.length >= 8 && targetPhone === existingPhone) {
      if (!isSharedLeaderPhone || targetName === existingName) {
        return {
          matchedBy: 'phone',
          message: `Nomor WhatsApp ${phone_number} sudah terdaftar atas nama "${reg.full_name}".`,
          existing: reg
        };
      }
    }

    // Kriteria 3: Alamat Email sama persis
    if (targetEmail && existingEmail && targetEmail.includes('@') && targetEmail === existingEmail) {
      return {
        matchedBy: 'email',
        message: `Alamat email ${email} sudah terdaftar atas nama "${reg.full_name}".`,
        existing: reg
      };
    }
  }

  return null;
}

// Mode Safe Preview: Membuka tiket untuk inspeksi tanpa mereset formulir yang sedang diisi
window.isViewingTicketInSafeMode = false;

function viewDuplicateTicketSafely(regCodeOrRecord) {
  let record = null;
  if (typeof regCodeOrRecord === 'object' && regCodeOrRecord !== null) {
    record = regCodeOrRecord;
  } else if (typeof regCodeOrRecord === 'string') {
    record = (allRegistrations || []).find(r => r.registration_code === regCodeOrRecord);
  }

  if (!record) {
    showToast('Data E-Tiket peserta tidak ditemukan.', 'warning');
    return;
  }

  window.isViewingTicketInSafeMode = true;
  showTicketModal(record);
}

// Validasi Cepat & Direct Ticket Preview untuk Formulir Individu
let foundIndividualDupRecord = null;

function checkIndividualDuplicateOnBlur() {
  const phoneInput = document.getElementById('ind_phone');
  const nameInput = document.getElementById('ind_fullName');
  const emailInput = document.getElementById('ind_email');
  
  // Elemen Notifikasi di Bagian Kontak
  const phoneNoticeBox = document.getElementById('ind_dupPhoneNotice');
  const phoneNoticeText = document.getElementById('ind_dupPhoneText');
  const phoneBtnOpen = document.getElementById('ind_btnOpenDupTicket');

  // Elemen Notifikasi di Bagian Identitas Diri (Nama Lengkap)
  const nameNoticeBox = document.getElementById('ind_dupNameNotice');
  const nameNoticeText = document.getElementById('ind_dupNameText');
  const nameBtnOpen = document.getElementById('ind_btnOpenDupNameTicket');

  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const name = nameInput ? nameInput.value.trim() : '';
  const wilayah = document.getElementById('ind_wilayah')?.value || '';

  if (phone.length < 8 && name.length < 3 && (!email || !email.includes('@'))) {
    hideIndividualDuplicateNotice();
    return;
  }

  const dup = checkDuplicateRegistration({
    full_name: name,
    phone_number: phone,
    email: email,
    wilayah: wilayah,
    is_child: false
  });

  if (dup) {
    // ATURAN PENTING:
    // Jika nama yang diisi di formulir BERBEDA dengan nama data lama di database,
    // berarti pengguna sedang mendaftarkan orang lain/keluarga menggunakan kontak ini.
    // Sembunyikan kotak notifikasi ini agar form tetap bersih dan tidak membingungkan pengguna!
    const currentName = name.trim().toLowerCase();
    const existingName = (dup.existing.full_name || '').trim().toLowerCase();
    if (currentName && existingName && currentName !== existingName) {
      hideIndividualDuplicateNotice();
      return;
    }

    foundIndividualDupRecord = dup.existing;
    
    let msg = `Data sudah terdaftar atas nama <strong>${escapeHtml(dup.existing.full_name)}</strong> <span class="dup-code-pill">${escapeHtml(dup.existing.registration_code)}</span>`;
    if (dup.matchedBy === 'email') {
      msg = `Alamat email ini sudah terdaftar atas nama <strong>${escapeHtml(dup.existing.full_name)}</strong> <span class="dup-code-pill">${escapeHtml(dup.existing.registration_code)}</span>`;
    } else if (dup.matchedBy === 'phone') {
      msg = `Nomor WhatsApp ini sudah terdaftar atas nama <strong>${escapeHtml(dup.existing.full_name)}</strong> <span class="dup-code-pill">${escapeHtml(dup.existing.registration_code)}</span>`;
    } else if (dup.matchedBy === 'name_wilayah') {
      msg = `Nama peserta ini sudah terdaftar resmi di kafilah <strong>${escapeHtml(dup.existing.wilayah || 'Paskas')}</strong> <span class="dup-code-pill">${escapeHtml(dup.existing.registration_code)}</span>`;
    }

    if (nameNoticeText) nameNoticeText.innerHTML = msg;
    if (phoneNoticeText) phoneNoticeText.innerHTML = msg;

    const handleOpenTicket = () => {
      viewDuplicateTicketSafely(dup.existing);
    };

    if (nameBtnOpen) nameBtnOpen.onclick = handleOpenTicket;
    if (phoneBtnOpen) phoneBtnOpen.onclick = handleOpenTicket;

    if (nameNoticeBox) nameNoticeBox.style.display = 'block';
    if (phoneNoticeBox) phoneNoticeBox.style.display = 'block';
  } else {
    hideIndividualDuplicateNotice();
  }
}

function hideIndividualDuplicateNotice() {
  foundIndividualDupRecord = null;
  const phoneNoticeBox = document.getElementById('ind_dupPhoneNotice');
  if (phoneNoticeBox) phoneNoticeBox.style.display = 'none';
  const nameNoticeBox = document.getElementById('ind_dupNameNotice');
  if (nameNoticeBox) nameNoticeBox.style.display = 'none';
}

function showDuplicatePromptModal(dup, newName, newPhone, newWilayah, newEmail) {
  const modal = document.getElementById('duplicatePromptModal');
  const title = document.getElementById('dupModalTitle');
  const desc = document.getElementById('dupModalDesc');
  const btnNew = document.getElementById('dupBtnProceedNew');
  const btnOpen = document.getElementById('dupBtnOpenExisting');
  if (!modal) return;

  if (dup.matchedBy === 'name_wilayah') {
    if (title) title.textContent = 'Nama Peserta Sudah Terdaftar';
    if (desc) {
      desc.innerHTML = `Nama <strong>${escapeHtml(newName)}</strong> dari kafilah <strong>${escapeHtml(newWilayah || 'Umum')}</strong> sudah pernah terdaftar sebelumnya dengan kode <strong>${escapeHtml(dup.existing.registration_code)}</strong>.<br><br>Apakah ini orang yang berbeda dan Anda ingin tetap mendaftarkannya sebagai peserta baru?`;
    }
  } else if (dup.matchedBy === 'email') {
    if (title) title.textContent = 'Alamat Email Sudah Terdaftar';
    if (desc) {
      desc.innerHTML = `Alamat email <strong>${escapeHtml(newEmail || dup.existing.email)}</strong> sebelumnya sudah terdaftar atas nama <strong>${escapeHtml(dup.existing.full_name)}</strong> (Kode: ${escapeHtml(dup.existing.registration_code)}).<br><br>Apakah Anda ingin mendaftarkan <strong>${escapeHtml(newName)}</strong> sebagai peserta baru menggunakan email ini?`;
    }
  } else {
    if (title) title.textContent = 'Kontak WhatsApp Sudah Terdaftar';
    if (desc) {
      desc.innerHTML = `Nomor WhatsApp <strong>${escapeHtml(newPhone)}</strong> sebelumnya sudah terdaftar atas nama <strong>${escapeHtml(dup.existing.full_name)}</strong> (Kode: ${escapeHtml(dup.existing.registration_code)}).<br><br>Apakah Anda ingin mendaftarkan <strong>${escapeHtml(newName)}</strong> sebagai peserta baru menggunakan kontak ini?`;
    }
  }

  if (btnNew) {
    btnNew.onclick = () => {
      closeDuplicatePromptModal();
      handleIndividuFinalSubmit(null, true);
    };
  }

  if (btnOpen) {
    btnOpen.onclick = () => {
      closeDuplicatePromptModal();
      showTicketModal(dup.existing);
    };
  }

  modal.classList.add('active');
}

function closeDuplicatePromptModal() {
  const modal = document.getElementById('duplicatePromptModal');
  if (modal) modal.classList.remove('active');
}
window.closeDuplicatePromptModal = closeDuplicatePromptModal;
window.showDuplicatePromptModal = showDuplicatePromptModal;

// Pengecekan Duplikasi Baris Rombongan secara Real-Time & Interaktif
function checkSingleGroupMemberDuplicate(memberId) {
  const card = document.getElementById(`memberCard-${memberId}`);
  if (!card) return;

  const nameInput = card.querySelector('.grp-member-name');
  const phoneInput = card.querySelector('.grp-member-phone');
  const name = nameInput ? nameInput.value.trim() : '';
  const rawPhone = phoneInput ? phoneInput.value.trim() : '';
  const leaderPhone = document.getElementById('grp_leaderPhone')?.value.trim() || '';
  const defaultWilayah = document.getElementById('grp_defaultWilayah')?.value || '';
  const wrap = document.getElementById(`dupWarningWrap-${memberId}`);

  if (!name && !rawPhone) {
    clearSingleGroupMemberWarning(memberId);
    return;
  }

  const dup = checkDuplicateRegistration({
    full_name: name,
    phone_number: rawPhone || leaderPhone,
    wilayah: defaultWilayah,
    is_child: false,
    isGroupMember: true,
    leaderPhone: leaderPhone
  });

  if (dup) {
    if (nameInput) nameInput.style.borderColor = '#d97706';
    if (wrap) {
      wrap.style.display = 'block';
      wrap.innerHTML = `
        <div class="duplicate-alert-banner" style="padding: 6px 10px !important; margin-top: 5px;">
          <div class="dup-banner-header" style="font-size: 11px; margin-bottom: 2px;">
            <i class="fa-solid fa-triangle-exclamation" style="color: #b45309; font-size: 12px;"></i>
            <span>SUDAH TERDAFTAR!</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
            <div class="dup-banner-body" style="font-size: 11px !important;">
              Atas nama <strong>${escapeHtml(dup.existing.full_name)}</strong> <span class="dup-code-pill">${escapeHtml(dup.existing.registration_code)}</span>
            </div>
            <div style="display: flex; gap: 4px; flex-shrink: 0;">
              <button type="button" class="btn-open-dup-ticket" onclick="viewDuplicateTicketSafely('${escapeHtml(dup.existing.registration_code)}')" style="padding: 3px 8px !important; font-size: 10.5px !important;" title="Lihat E-Tiket (Aman, form tidak akan ter-reset)">
                <i class="fa-solid fa-ticket"></i> Cek Tiket
              </button>
              <button type="button" onclick="removeMemberCard(${memberId})" style="background: #ef4444; color: #ffffff; border: none; border-radius: 5px; padding: 3px 8px; font-size: 10.5px; font-weight: 700; cursor: pointer;" title="Hapus peserta ini dari daftar rombongan">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }
    return;
  }

  clearSingleGroupMemberWarning(memberId);
}

function clearSingleGroupMemberWarning(memberId) {
  const card = document.getElementById(`memberCard-${memberId}`);
  if (card) {
    const nameInput = card.querySelector('.grp-member-name');
    if (nameInput && (nameInput.style.borderColor === 'rgb(245, 158, 11)' || nameInput.style.borderColor === 'rgb(217, 119, 6)')) {
      nameInput.style.borderColor = '';
    }
  }
  const wrap = document.getElementById(`dupWarningWrap-${memberId}`);
  if (wrap) {
    wrap.style.display = 'none';
    wrap.innerHTML = '';
  }
}

// Pengecekan Duplikasi Koordinator Rombongan secara Real-Time & Interaktif
function checkSingleCoordinatorDuplicate(coordId) {
  const card = document.getElementById(`coordCard-${coordId}`);
  if (!card) return;

  const nameInput = card.querySelector('.grp-coord-name');
  const phoneInput = card.querySelector('.grp-coord-phone');
  const emailInput = card.querySelector('.grp-coord-email');
  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const defaultWilayah = document.getElementById('grp_defaultWilayah')?.value || '';
  const wrap = document.getElementById(`coordDupWrap-${coordId}`);

  if (name.length < 3 && phone.length < 8 && (!email || !email.includes('@'))) {
    clearSingleCoordinatorDuplicate(coordId);
    return;
  }

  const dup = checkDuplicateRegistration({
    full_name: name,
    phone_number: phone,
    email: email,
    wilayah: defaultWilayah,
    is_child: false,
    isGroupMember: true,
    leaderPhone: phone
  });

  if (dup) {
    if (nameInput) nameInput.style.borderColor = '#d97706';
    if (wrap) {
      wrap.style.display = 'block';
      wrap.innerHTML = `
        <div class="duplicate-alert-banner" style="padding: 6px 10px !important; margin-top: 5px;">
          <div class="dup-banner-header" style="font-size: 11px; margin-bottom: 2px;">
            <i class="fa-solid fa-triangle-exclamation" style="color: #b45309; font-size: 12px;"></i>
            <span>KOORDINATOR SUDAH TERDAFTAR!</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
            <div class="dup-banner-body" style="font-size: 11px !important;">
              Atas nama <strong>${escapeHtml(dup.existing.full_name)}</strong> <span class="dup-code-pill">${escapeHtml(dup.existing.registration_code)}</span>
            </div>
            <div style="display: flex; gap: 4px; flex-shrink: 0;">
              <button type="button" class="btn-open-dup-ticket" onclick="viewDuplicateTicketSafely('${escapeHtml(dup.existing.registration_code)}')" style="padding: 3px 8px !important; font-size: 10.5px !important;" title="Lihat E-Tiket (Aman, form tidak akan ter-reset)">
                <i class="fa-solid fa-ticket"></i> Cek Tiket
              </button>
            </div>
          </div>
        </div>
      `;
    }
    return;
  }

  clearSingleCoordinatorDuplicate(coordId);
}

function clearSingleCoordinatorDuplicate(coordId) {
  const card = document.getElementById(`coordCard-${coordId}`);
  if (card) {
    const nameInput = card.querySelector('.grp-coord-name');
    if (nameInput && (nameInput.style.borderColor === 'rgb(245, 158, 11)' || nameInput.style.borderColor === 'rgb(217, 119, 6)')) {
      nameInput.style.borderColor = '';
    }
  }
  const wrap = document.getElementById(`coordDupWrap-${coordId}`);
  if (wrap) {
    wrap.style.display = 'none';
    wrap.innerHTML = '';
  }
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

function isRoomGroupAllocationEnabled() {
  const localVal = localStorage.getItem('paskas_room_group_enabled');
  if (localVal !== null) {
    return localVal !== 'false';
  }
  const settings = (window.dataService && typeof window.dataService.getSettings === 'function') 
    ? window.dataService.getSettings() 
    : {};
  return settings.is_room_group_enabled !== 'false' && settings.is_room_group_enabled !== false;
}

function autoAllocateRoomAndGroup(gender = 'Laki-laki', isChild = false, guardianName = '', contextBatch = []) {
  // Jika fitur pembagian kamar & kelompok di-close/dinonaktifkan oleh panitia:
  if (!isRoomGroupAllocationEnabled()) {
    return {
      group_name: '-',
      group_code: '-',
      room_number: '-',
      room_name: '-',
      building: '-'
    };
  }

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
  let maxSeq = 0;
  const list = Array.isArray(allRegistrations) ? allRegistrations : [];
  list.forEach(r => {
    if (r && r.registration_code) {
      const match = String(r.registration_code).match(/PKB-(\d+)/i);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxSeq) maxSeq = num;
      }
    }
  });

  try {
    const raw = localStorage.getItem('paskas_registrations_data');
    const local = raw ? JSON.parse(raw) : [];
    if (Array.isArray(local)) {
      local.forEach(r => {
        if (r && r.registration_code) {
          const match = String(r.registration_code).match(/PKB-(\d+)/i);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxSeq) maxSeq = num;
          }
        }
      });
    }
  } catch (e) {}

  const nextSeq = maxSeq + 1 + index;
  const seq = String(nextSeq).padStart(3, '0');
  return `PKB-${seq}`;
}

async function handleIndividuFinalSubmit(e, bypassDuplicate = false) {
  if (e && e.preventDefault) e.preventDefault();

  // 0. Anti-bot honeypot verification
  const honeypot = document.getElementById('ind_hp_fax')?.value;
  if (honeypot && honeypot.trim() !== '') {
    console.warn('Bot submission blocked via honeypot field.');
    showToast('Aktivitas tidak wajar terdeteksi. Pendaftaran dibatalkan.', 'error');
    return;
  }

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
    const medical = document.getElementById('ind_medical')?.value.trim() || 'Tidak Ada (Sehat)';

    // CEK DATA DUPLIKAT SECARA RAMAH (DAPAT KONFIRMASI DAFTARKAN ORANG LAIN)
    if (!bypassDuplicate) {
      const duplicateCheck = checkDuplicateRegistration({
        full_name: fullName,
        phone_number: phone,
        email: email,
        wilayah: wilayah,
        is_child: isChild
      });

      if (duplicateCheck) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
        showDuplicatePromptModal(duplicateCheck, fullName, phone, wilayah, email);
        return;
      }
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
      photo_url: ind_selectedPhotoData || null,
      notes: ''
    };

    const saved = await window.dataService.addRegistration(registrationPayload);

    if (window.confetti) {
      window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    }

    showToast(`Alhamdulillah! Pendaftaran berhasil dengan No. Registrasi: ${saved.registration_code}`, 'success');
    document.getElementById('formIndividu').reset();
    removeIndividuPhoto();
    setDefaultDates();
    selectMedicalStatus('healthy');
    const detailMed = document.getElementById('ind_medical_detail');
    if (detailMed) detailMed.value = '';
    const wrapArrOther = document.getElementById('wrap_transportArrivalOther');
    if (wrapArrOther) wrapArrOther.style.display = 'none';
    const wrapDepOther = document.getElementById('wrap_transportDepartureOther');
    if (wrapDepOther) wrapDepOther.style.display = 'none';
    jumpToIndividuStep(1, true);

    // Tampilkan Halaman Mahabbah & Sukses Langsung di Halaman (Bukan popup gambar tiket)
    showSuccessRegistrationView(saved, 'individu');

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

  // 0. Anti-bot honeypot verification
  const honeypot = document.getElementById('grp_hp_fax')?.value;
  if (honeypot && honeypot.trim() !== '') {
    console.warn('Bot submission blocked via honeypot field.');
    showToast('Aktivitas tidak wajar terdeteksi. Pendaftaran dibatalkan.', 'error');
    return;
  }

  if (isRegistrationLocked) {
    showToast('Pendaftaran telah ditutup sesuai batas waktu yang ditentukan.', 'error');
    return;
  }

  const coordCards = document.querySelectorAll('.coord-card');
  if (coordCards.length === 0) {
    showToast('Harap isi minimal 1 data koordinator rombongan.', 'warning');
    return;
  }
  const memberCards = document.querySelectorAll('.member-card');

  const groupName = document.getElementById('grp_name').value.trim();
  if (!groupName) {
    showToast('Harap isi Nama Rombongan.', 'warning');
    document.getElementById('grp_name')?.focus();
    return;
  }

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
  const seenTableNames = new Set();
  let primaryLeaderName = '';
  let primaryLeaderPhone = '';
  let primaryLeaderEmail = '';
  let coordinatorsRowsHtml = '';
  let membersRowsHtml = '';

  // 1. PROSES TABEL KOORDINATOR ROMBONGAN
  for (let cIdx = 0; cIdx < coordCards.length; cIdx++) {
    const card = coordCards[cIdx];
    const name = card.querySelector('.grp-coord-name')?.value.trim() || '';
    if (!name) {
      showToast(`Mohon isi nama lengkap untuk Koordinator ke-${cIdx + 1}.`, 'warning');
      card.querySelector('.grp-coord-name')?.focus();
      return;
    }

    const lowerName = name.toLowerCase();
    if (seenTableNames.has(lowerName)) {
      showToast(`Nama "${name}" terdaftar lebih dari satu kali di rombongan ini. Mohon periksa kembali.`, 'error');
      card.querySelector('.grp-coord-name')?.focus();
      return;
    }
    seenTableNames.add(lowerName);

    const rawAge = card.querySelector('.grp-coord-age')?.value;
    const age = parseInt(rawAge || '0', 10);
    if (!rawAge || isNaN(age) || age <= 0) {
      showToast(`Mohon cantumkan usia untuk Koordinator "${name}".`, 'warning');
      card.querySelector('.grp-coord-age')?.focus();
      return;
    }

    const gender = card.querySelector('.grp-coord-gender')?.value || 'Laki-laki';
    const cloth = card.querySelector('.grp-coord-cloth')?.value || 'L';
    const med = card.querySelector('.grp-coord-med')?.value.trim() || '';
    const phone = card.querySelector('.grp-coord-phone')?.value.trim() || '';
    if (!phone) {
      showToast(`Mohon cantumkan nomor WhatsApp untuk Koordinator "${name}".`, 'warning');
      card.querySelector('.grp-coord-phone')?.focus();
      return;
    }
    const email = card.querySelector('.grp-coord-email')?.value.trim() || '';
    if (!email) {
      showToast(`Mohon isi alamat Email untuk Koordinator "${name}".`, 'warning');
      card.querySelector('.grp-coord-email')?.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast(`Format alamat Email untuk Koordinator "${name}" tidak valid.`, 'warning');
      card.querySelector('.grp-coord-email')?.focus();
      return;
    }

    if (cIdx === 0) {
      primaryLeaderName = name;
      primaryLeaderPhone = phone;
      primaryLeaderEmail = email;
    }

    const rawJoinYear = card.querySelector('.grp-coord-join-year')?.value;
    const defaultJoinYear = document.getElementById('grp_joinYear')?.value || '';
    const joinYear = parseInt(rawJoinYear || defaultJoinYear || String(new Date().getFullYear()), 10);

    const dupCheck = checkDuplicateRegistration({
      full_name: name,
      phone_number: phone,
      wilayah: defaultWilayah,
      daerah: defaultDaerah,
      is_child: false,
      isGroupMember: true,
      leaderPhone: phone
    });

    if (dupCheck) {
      showToast(`Koordinator "${name}" sudah pernah terdaftar sebelumnya (${dupCheck.existing.registration_code}).`, 'warning');
      card.querySelector('.grp-coord-name')?.focus();
      return;
    }

    const code = generateRegistrationCode('kelompok', batchRecords.length);
    const alloc = autoAllocateRoomAndGroup(gender, false, '', batchRecords);
    const coordRoleTitle = (cIdx === 0) ? 'Koordinator Utama' : `Koordinator Pendamping #${cIdx + 1}`;

    batchRecords.push({
      registration_code: code,
      registration_type: 'kelompok',
      group_name: groupName,
      group_code: alloc.group_code,
      group_leader_name: primaryLeaderName || name,
      room_number: alloc.room_number,
      room_name: alloc.room_name,
      building: alloc.building,
      full_name: name,
      age: age > 0 ? age : null,
      join_year: joinYear > 0 ? joinYear : null,
      is_child: false,
      guardian_name: null,
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
      photo_url: (card.querySelector('.grp-coord-photo-data')?.value.trim() || null),
      phone_number: phone,
      email: email,
      notes: ''
    });

    coordinatorsRowsHtml += `
      <tr style="background: rgba(245, 158, 11, 0.08);">
        <td style="text-align: center;">
          <span style="font-weight: 800; color: #fbbf24;"><i class="fa-solid fa-crown text-gold"></i> #${cIdx + 1}</span>
        </td>
        <td>
          <strong>${escapeHtml(name)}</strong>
          <div style="font-size: 11px; color: #fbbf24; font-weight: 700;">${coordRoleTitle}</div>
        </td>
        <td style="text-align: center; font-weight: 600;">${age} th</td>
        <td style="text-align: center; font-weight: 600; color: #38bdf8;">${joinYear > 0 ? joinYear : '-'}</td>
        <td>${escapeHtml(gender)}</td>
        <td><strong style="color: #fbbf24;">${cloth}</strong></td>
        <td>${escapeHtml(med || 'Sehat')}</td>
        <td style="font-size: 12px;">${escapeHtml(phone)}</td>
        <td style="font-size: 12px; color: #cbd5e1;">${escapeHtml(email)}</td>
      </tr>
    `;
  }

  // 2. PROSES TABEL ANGGOTA ROMBONGAN
  for (let idx = 0; idx < memberCards.length; idx++) {
    const card = memberCards[idx];
    const name = card.querySelector('.grp-member-name')?.value.trim() || '';
    if (!name) {
      showToast(`Mohon isi nama lengkap untuk Anggota baris ke-${idx + 1}.`, 'warning');
      card.querySelector('.grp-member-name')?.focus();
      return;
    }

    const lowerName = name.toLowerCase();
    if (seenTableNames.has(lowerName)) {
      showToast(`Nama "${name}" terdaftar lebih dari satu kali di rombongan ini (baris ke-${idx + 1}). Mohon periksa kembali.`, 'error');
      card.querySelector('.grp-member-name')?.focus();
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
    const cloth = card.querySelector('.grp-member-cloth')?.value || 'L';
    const med = card.querySelector('.grp-member-med')?.value.trim() || '';
    const phone = card.querySelector('.grp-member-phone')?.value.trim() || primaryLeaderPhone;

    const dupCheck = checkDuplicateRegistration({
      full_name: name,
      phone_number: phone,
      wilayah: defaultWilayah,
      daerah: defaultDaerah,
      is_child: isChild,
      isGroupMember: true,
      leaderPhone: primaryLeaderPhone
    });

    if (dupCheck) {
      showToast(`Peserta "${name}" (baris ke-${idx + 1}) sudah pernah terdaftar sebelumnya (${dupCheck.existing.registration_code}).`, 'warning');
      const nameInput = card.querySelector('.grp-member-name');
      if (nameInput) {
        nameInput.focus();
        nameInput.style.borderColor = '#f59e0b';
      }
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      checkSingleGroupMemberDuplicate(card.id.replace('memberCard-', ''));
      return;
    }

    const guardianSelect = card.querySelector('.grp-member-guardian');
    const guardianName = (isChild && guardianSelect) ? guardianSelect.value.trim() : '';

    const rawJoinYear = card.querySelector('.grp-member-join-year')?.value;
    const defaultJoinYear = document.getElementById('grp_joinYear')?.value || '';
    const joinYear = parseInt(rawJoinYear || defaultJoinYear || String(new Date().getFullYear()), 10);

    const code = generateRegistrationCode('kelompok', batchRecords.length);
    const alloc = autoAllocateRoomAndGroup(gender, isChild, guardianName, batchRecords);

    batchRecords.push({
      registration_code: code,
      registration_type: 'kelompok',
      group_name: groupName,
      group_code: alloc.group_code,
      group_leader_name: primaryLeaderName,
      room_number: alloc.room_number,
      room_name: alloc.room_name,
      building: alloc.building,
      full_name: name,
      age: age > 0 ? age : null,
      join_year: joinYear > 0 ? joinYear : null,
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
      photo_url: (card.querySelector('.grp-member-photo-data')?.value.trim() || null),
      phone_number: phone,
      email: primaryLeaderEmail || null,
      notes: `Rombongan: ${groupName} (Ketua: ${primaryLeaderName})${guardianName ? ' • Ikut Ortu: ' + guardianName : ''}`
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
        <td style="text-align: center; font-weight: 600; color: #38bdf8;">${joinYear > 0 ? joinYear : '-'}</td>
        <td>${escapeHtml(gender)}</td>
        <td><strong style="color: #fbbf24;">${cloth}</strong></td>
        <td>${escapeHtml(med || 'Sehat')}</td>
      </tr>
    `;
  }

  pendingRegistrationData = {
    type: 'kelompok',
    groupName: groupName,
    groupLeader: primaryLeaderName,
    leaderEmail: primaryLeaderEmail,
    leaderPhone: primaryLeaderPhone,
    wilayah: defaultWilayah,
    data: batchRecords
  };

  // SUNTIKKAN KE PRATINJAU IN-PAGE KELOMPOK (Format Persis Sama & Serasi dengan Individu)
  const grpSummaryContainer = document.getElementById('grpPreviewSummaryContainer');
  if (grpSummaryContainer) {
    const allMembersRowsHtml = batchRecords.map((item, idx) => {
      const isCoord = idx < coordCards.length;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
          <td>
            ${isCoord 
              ? '<span style="background: rgba(217, 119, 6, 0.15); color: #b45309; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 11px;"><i class="fa-solid fa-crown"></i> Koordinator</span>' 
              : '<span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">Anggota</span>'
            }
          </td>
          <td>
            <strong style="text-transform: capitalize;">${escapeHtml(item.full_name)}</strong> 
            ${item.is_child ? '<span style="font-size: 10px; padding: 1px 6px; background: rgba(245, 158, 11, 0.2); border-radius: 4px; color: #b45309; font-weight: 700; margin-left: 4px;"><i class="fa-solid fa-child"></i> Anak</span>' : ''}
          </td>
          <td style="text-align: center;">${item.age ? item.age + ' th' : '-'}</td>
          <td>${escapeHtml(item.gender || '-')}</td>
          <td style="text-align: center;"><span class="badge-cloth-val" style="padding: 2px 8px; font-size: 11.5px;">${escapeHtml(item.cloth_size || '-')}</span></td>
          <td><small style="color: #047857; font-weight: 600;">${escapeHtml(item.medical_history || 'Sehat')}</small></td>
          <td><small style="color: #64748b;">${escapeHtml(item.phone_number || '-')}</small></td>
        </tr>
      `;
    }).join('');

    grpSummaryContainer.innerHTML = `
      <div class="summary-preview-notice">
        <i class="fa-solid fa-circle-check"></i>
        <div>
          <strong>Pemeriksaan Jawaban Terakhir Rombongan</strong><br>
          Seluruh data telah divalidasi. Mohon pastikan kebenaran informasi rombongan di bawah ini sebelum mengirimkan pendaftaran untuk penerbitan E-Tiket resmi.
        </div>
      </div>

      <!-- Block 1: Identitas Rombongan & Rute -->
      <div class="summary-block-card">
        <div class="summary-block-head">
          <span class="summary-block-title">
            <i class="fa-solid fa-flag text-gold"></i> 1. Identitas Rombongan &amp; Rute Perjalanan
          </span>
          <button type="button" class="btn-edit-step" onclick="closeKelompokInPagePreview()">
            <i class="fa-solid fa-pen-to-square"></i> Ubah Data
          </button>
        </div>
        <div class="summary-block-grid">
          <div class="summary-field-item">
            <span class="summary-field-label">Nama Rombongan</span>
            <span class="summary-field-value"><strong>${escapeHtml(groupName)}</strong></span>
          </div>
          <div class="summary-field-item">
            <span class="summary-field-label">Total Kafilah</span>
            <span class="summary-field-value"><strong style="color: #b45309;">${batchRecords.length} Peserta</strong> (${coordCards.length} Koord, ${memberCards.length} Anggota)</span>
          </div>
          <div class="summary-field-item">
            <span class="summary-field-label">Wilayah Kafilah</span>
            <span class="summary-field-value">${escapeHtml(defaultWilayah)}</span>
          </div>
          <div class="summary-field-item">
            <span class="summary-field-label">Daerah Asal Kafilah</span>
            <span class="summary-field-value">${escapeHtml(defaultDaerah)}</span>
          </div>
          <div class="summary-field-item">
            <span class="summary-field-label">Koordinator Utama</span>
            <span class="summary-field-value"><strong>${escapeHtml(primaryLeaderName)}</strong></span>
          </div>
          <div class="summary-field-item">
            <span class="summary-field-label">No. WhatsApp Koordinator</span>
            <span class="summary-field-value">${escapeHtml(primaryLeaderPhone)}</span>
          </div>
          ${primaryLeaderEmail ? `
          <div class="summary-field-item full-width">
            <span class="summary-field-label">Alamat Email Koordinator</span>
            <span class="summary-field-value">${escapeHtml(primaryLeaderEmail)}</span>
          </div>` : ''}
        </div>
      </div>

      <!-- Block 2: Jadwal & Transportasi Rombongan -->
      <div class="summary-block-card">
        <div class="summary-block-head">
          <span class="summary-block-title">
            <i class="fa-solid fa-calendar-days text-forest"></i> 2. Jadwal &amp; Transportasi Bersama
          </span>
          <button type="button" class="btn-edit-step" onclick="closeKelompokInPagePreview()">
            <i class="fa-solid fa-pen-to-square"></i> Ubah Data
          </button>
        </div>
        <div class="summary-block-grid">
          <div class="summary-field-item">
            <span class="summary-field-label">Rencana Kedatangan</span>
            <span class="summary-field-value">${formatDateIndo(defaultArrival)} (12:00 WIB)</span>
          </div>
          <div class="summary-field-item">
            <span class="summary-field-label">Rencana Kepulangan</span>
            <span class="summary-field-value">${formatDateIndo(defaultDeparture)} (14:00 WIB)</span>
          </div>
          <div class="summary-field-item full-width">
            <span class="summary-field-label">Armada Transportasi</span>
            <span class="summary-field-value"><i class="fa-solid fa-bus text-forest"></i> ${escapeHtml(defaultTransport)}</span>
          </div>
        </div>
      </div>

      <!-- Block 3: Rincian Seluruh Peserta Rombongan -->
      <div class="summary-block-card">
        <div class="summary-block-head">
          <span class="summary-block-title">
            <i class="fa-solid fa-users text-gold"></i> 3. Rincian Anggota Rombongan (${batchRecords.length} Jiwa)
          </span>
          <button type="button" class="btn-edit-step" onclick="closeKelompokInPagePreview()">
            <i class="fa-solid fa-pen-to-square"></i> Ubah Data
          </button>
        </div>
        <div class="summary-preview-table-wrap">
          <table class="summary-preview-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">No</th>
                <th>Peran</th>
                <th>Nama Lengkap</th>
                <th style="width: 60px; text-align: center;">Usia</th>
                <th>Gender</th>
                <th style="width: 60px; text-align: center;">Baju</th>
                <th>Kesehatan</th>
                <th>Kontak</th>
              </tr>
            </thead>
            <tbody>
              ${allMembersRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Sembunyikan lembar input dan tampilkan lembar pratinjau in-page persis seperti Individu
    const grpInputs = document.getElementById('grpInputsContainer');
    const grpPane = document.getElementById('grpPreviewPane');
    if (grpInputs) grpInputs.style.display = 'none';
    if (grpPane) {
      grpPane.style.display = 'block';
      setTimeout(() => {
        const topOffset = grpPane.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
      }, 80);
    }
  }
}

function closeKelompokInPagePreview() {
  const grpInputs = document.getElementById('grpInputsContainer');
  const grpPane = document.getElementById('grpPreviewPane');
  if (grpPane) grpPane.style.display = 'none';
  if (grpInputs) {
    grpInputs.style.display = 'block';
    setTimeout(() => {
      const topOffset = grpInputs.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }, 80);
  }
}
window.closeKelompokInPagePreview = closeKelompokInPagePreview;

function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.remove('active');
}

// 3. KONFIRMASI & SIMPAN KE DATABASE (Model formkwpselindo)
async function confirmAndSubmitRegistration() {
  if (!pendingRegistrationData) return;

  // Proteksi Rate Limiting & Anti-Spam Cooldown (5 detik jeda)
  const LAST_SUBMIT_KEY = 'paskas_last_submit_ts';
  const lastSubmit = parseInt(sessionStorage.getItem(LAST_SUBMIT_KEY) || '0', 10);
  const now = Date.now();
  const COOLDOWN_MS = 5000;
  if (now - lastSubmit < COOLDOWN_MS) {
    const waitSec = Math.ceil((COOLDOWN_MS - (now - lastSubmit)) / 1000);
    showToast(`Mohon tunggu ${waitSec} detik sebelum mengirim pendaftaran kembali.`, 'warning');
    return;
  }

  const confirmBtn = document.getElementById('btnConfirmSubmit');
  const originalText = confirmBtn.innerHTML;
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

  try {
    sessionStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());
    if (pendingRegistrationData.type === 'individu') {
      const saved = await window.dataService.addRegistration(pendingRegistrationData.data);

      if (window.confetti) {
        window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      }

      showToast(`Alhamdulillah! Pendaftaran individu berhasil dengan No. Registrasi: ${saved.registration_code}`, 'success');
      document.getElementById('formIndividu').reset();
      closePreviewModal();

      // Tampilkan Halaman Mahabbah Sukses Langsung di Halaman (Bukan popup)
      showSuccessRegistrationView(saved, 'individu');

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
      if (typeof closeKelompokInPagePreview === 'function') closeKelompokInPagePreview();

      // Tampilkan Halaman Mahabbah Sukses Langsung di Halaman (Bukan popup)
      if (savedBatch && savedBatch.length > 0) {
        showSuccessRegistrationView(savedBatch, 'kelompok');
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

// GROUP COORDINATORS & MEMBERS REPEATER LOGIC
let groupCoordinatorCount = 0;
let groupMemberCount = 0;

function syncPrimaryCoordinatorHiddenFields() {
  const firstCoord = document.querySelector('#groupCoordinatorsContainer tr.coord-card');
  const hLeader = document.getElementById('grp_leader');
  const hPhone = document.getElementById('grp_leaderPhone');
  const hEmail = document.getElementById('grp_email');

  if (firstCoord) {
    const name = firstCoord.querySelector('.grp-coord-name')?.value.trim() || '';
    const phone = firstCoord.querySelector('.grp-coord-phone')?.value.trim() || '';
    const email = firstCoord.querySelector('.grp-coord-email')?.value.trim() || '';
    if (hLeader) hLeader.value = name;
    if (hPhone) hPhone.value = phone;
    if (hEmail) hEmail.value = email;
  }
}

function reindexGroupCoordinators() {
  const rows = document.querySelectorAll('#groupCoordinatorsContainer tr.coord-card');
  rows.forEach((row, idx) => {
    const badge = row.querySelector('.member-num-badge');
    if (badge) badge.textContent = idx + 1;
    const tag = row.querySelector('.badge-coord-primary');
    if (tag) tag.innerHTML = `<i class="fa-solid fa-crown text-gold"></i> ${idx === 0 ? 'Utama' : 'Pendamping'}`;
  });
}

function removeGroupCoordinatorCard(coordId) {
  const card = document.getElementById(`coordCard-${coordId}`);
  if (card) {
    card.remove();
    reindexGroupCoordinators();
    syncPrimaryCoordinatorHiddenFields();
    syncAllGroupGuardians();
    updateGroupStats();
  }
}

function addGroupCoordinatorCard(opts = {}) {
  groupCoordinatorCount++;
  const container = document.getElementById('groupCoordinatorsContainer');
  if (!container) return;
  const coordId = groupCoordinatorCount;
  const isPrimary = container.children.length === 0;

  const initialName = opts.name || '';
  const initialAge = opts.age !== undefined ? opts.age : '';
  const defaultJoinYear = document.getElementById('grp_joinYear')?.value || '';
  const initialJoinYear = opts.joinYear !== undefined ? opts.joinYear : (defaultJoinYear || new Date().getFullYear());
  const initialGender = opts.gender || (isPrimary ? 'Laki-laki' : 'Perempuan');
  const initialCloth = opts.cloth || 'L';
  const initialMed = opts.med !== undefined ? opts.med : '';
  const initialPhone = opts.phone || '';
  const initialEmail = opts.email || '';
  const initialPhoto = opts.photo || '';

  const tr = document.createElement('tr');
  tr.className = 'coord-card coord-row-item';
  tr.id = `coordCard-${coordId}`;
  tr.innerHTML = `
    <td style="text-align: center; vertical-align: middle;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
        <span class="member-num-badge" style="background: linear-gradient(135deg, #d97706, #b45309); color: #ffffff; font-weight: 800;">${container.children.length + 1}</span>
        <span class="badge-coord-primary" style="font-size: 9.5px; padding: 1px 4px; white-space: nowrap;">
          <i class="fa-solid fa-crown text-gold"></i> ${isPrimary ? 'Utama' : 'Pendamping'}
        </span>
      </div>
    </td>
    <td style="text-align: center; vertical-align: middle;">
      <div id="coordPhotoSlot-${coordId}">
        ${initialPhoto ? `
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
            <img src="${initialPhoto}" class="cell-photo-thumb" onclick="openPhotoPreviewLightbox('${initialPhoto.replace(/'/g, "\\'")}', 'Koordinator #${coordId}')" title="Klik untuk lihat foto">
            <i class="fa-solid fa-circle-xmark" style="color: #ef4444; font-size: 14px; cursor: pointer;" onclick="removeRowPhoto('coord', ${coordId})" title="Hapus foto"></i>
          </div>
        ` : `
          <button type="button" class="cell-photo-btn" onclick="triggerRowPhotoUpload('coord', ${coordId})" title="Unggah Pas Foto Koordinator">
            <i class="fa-solid fa-camera"></i> +Foto
          </button>
        `}
      </div>
      <input type="file" id="coordPhotoInput-${coordId}" accept="image/*" style="display: none;" onchange="handleRowPhotoSelected(event, 'coord', ${coordId})">
      <input type="hidden" class="grp-coord-photo-data" id="coordPhotoData-${coordId}" value="${escapeHtml(initialPhoto)}">
    </td>
    <td>
      <input type="text" class="form-control form-control-sm grp-coord-name" 
             placeholder="Nama lengkap koordinator" value="${escapeHtml(initialName)}" 
             maxlength="100"
             oninput="syncPrimaryCoordinatorHiddenFields(); syncAllGroupGuardians(); updateGroupStats(); clearSingleCoordinatorDuplicate(${coordId});" 
             onblur="checkSingleCoordinatorDuplicate(${coordId});"
             required>
      <div class="coord-dup-warning-wrap" id="coordDupWrap-${coordId}" style="display: none; margin-top: 5px;"></div>
    </td>
    <td>
      <input type="number" class="form-control form-control-sm grp-coord-age" 
             placeholder="Usia" min="15" max="120" value="${escapeHtml(String(initialAge))}" 
             oninput="updateGroupStats();" required title="Usia koordinator (tahun)">
    </td>
    <td>
      <input type="number" class="form-control form-control-sm grp-coord-join-year" 
             placeholder="Tahun" min="2000" max="${new Date().getFullYear()}" value="${escapeHtml(String(initialJoinYear))}" 
             required title="Tahun pertama aktif di Paskas">
    </td>
    <td>
      <select class="form-control form-control-sm grp-coord-gender" onchange="syncAllGroupGuardians(); updateGroupStats();">
        <option value="Laki-laki" ${initialGender === 'Laki-laki' ? 'selected' : ''}>Laki-laki (Ikhwan)</option>
        <option value="Perempuan" ${initialGender === 'Perempuan' ? 'selected' : ''}>Perempuan (Akhwat)</option>
      </select>
    </td>
    <td>
      <select class="form-control form-control-sm grp-coord-cloth">
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
      <input type="text" class="form-control form-control-sm grp-coord-med" 
             placeholder="Cth: Maag, Alergi (Kosongkan bila sehat)" value="${escapeHtml(initialMed)}" 
             maxlength="200">
    </td>
    <td>
      <input type="tel" class="form-control form-control-sm grp-coord-phone" 
             placeholder="08xxxxxxxxxx" value="${escapeHtml(initialPhone)}" 
             inputmode="numeric" pattern="[0-9]*" maxlength="16" 
             oninput="this.value = this.value.replace(/[^0-9]/g, ''); syncPrimaryCoordinatorHiddenFields(); clearSingleCoordinatorDuplicate(${coordId});" 
             onblur="checkSingleCoordinatorDuplicate(${coordId});"
             required title="Nomor WhatsApp aktif koordinator">
    </td>
    <td>
      <input type="email" class="form-control form-control-sm grp-coord-email" 
             placeholder="email@domain.com" value="${escapeHtml(initialEmail)}" 
             maxlength="100" 
             oninput="syncPrimaryCoordinatorHiddenFields();" 
             required 
             title="Email koordinator (Wajib diisi)">
    </td>
    <td style="text-align: center; vertical-align: middle;">
      ${!isPrimary ? `
        <button type="button" class="btn-remove-row-circle" onclick="removeGroupCoordinatorCard(${coordId})" title="Hapus koordinator pendamping ini">
          <i class="fa-solid fa-xmark"></i>
        </button>
      ` : `
        <span title="Koordinator Utama wajib ada minimal 1" style="color: #94a3b8; font-size: 13px;">
          <i class="fa-solid fa-lock"></i>
        </span>
      `}
    </td>
  `;

  container.appendChild(tr);
  syncPrimaryCoordinatorHiddenFields();
  syncAllGroupGuardians();
  updateGroupStats();
}

function initGroupMembers() {
  const coordContainer = document.getElementById('groupCoordinatorsContainer');
  if (coordContainer) {
    coordContainer.innerHTML = '';
    groupCoordinatorCount = 0;
    addGroupCoordinatorCard();
  }

  const container = document.getElementById('groupMembersContainer');
  if (!container) return;
  container.innerHTML = '';
  groupMemberCount = 0;

  // Bind input tahun bergabung koordinator agar otomatis menjadi default bagi baris anggota & koordinator
  const grpJoinYearInput = document.getElementById('grp_joinYear');
  if (grpJoinYearInput && !grpJoinYearInput.dataset.syncBound) {
    grpJoinYearInput.addEventListener('input', () => {
      const val = grpJoinYearInput.value;
      if (val && val.length === 4) {
        document.querySelectorAll('.grp-coord-join-year, .grp-member-join-year').forEach(inp => {
          if (!inp.value || inp.dataset.autoFilled === 'true') {
            inp.value = val;
            inp.dataset.autoFilled = 'true';
          }
        });
      }
    });
    grpJoinYearInput.dataset.syncBound = 'true';
  }

  // Inisialisasi 3 baris anggota bersih siap ketik langsung
  addGroupMemberCard();
  addGroupMemberCard();
  addGroupMemberCard();
}

function syncAllGroupGuardians() {
  const coordRows = document.querySelectorAll('#groupCoordinatorsContainer tr.coord-card');
  const rows = document.querySelectorAll('#groupMembersContainer tr.member-card');
  const adults = [];

  // Kumpulkan koordinator sebagai kandidat orang tua / wali
  coordRows.forEach((r, idx) => {
    const name = r.querySelector('.grp-coord-name')?.value.trim();
    const gender = r.querySelector('.grp-coord-gender')?.value || 'Laki-laki';
    if (name) {
      adults.push({
        name: `${name} (${idx === 0 ? 'Koordinator Utama' : 'Koordinator Pendamping'})`,
        valName: name,
        gender: gender
      });
    }
  });

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
  const defaultLeaderJoinYear = document.getElementById('grp_joinYear')?.value || '';
  const initialJoinYear = opts.joinYear !== undefined ? opts.joinYear : (defaultLeaderJoinYear || new Date().getFullYear());
  const initialGender = opts.gender || 'Laki-laki';
  const initialCloth = opts.cloth || 'L';
  const initialMed = opts.med !== undefined ? opts.med : '';
  const initialPhone = opts.phone || '';
  const initialEmergency = opts.emergency || '';
  const initialPhoto = opts.photo || '';

  const tr = document.createElement('tr');
  tr.className = 'member-card member-row-item';
  tr.id = `memberCard-${memberId}`;
  tr.innerHTML = `
    <td style="text-align: center; vertical-align: middle;">
      <span class="member-num-badge">${memberId}</span>
    </td>
    <td style="text-align: center; vertical-align: middle;">
      <div id="memberPhotoSlot-${memberId}">
        ${initialPhoto ? `
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
            <img src="${initialPhoto}" class="cell-photo-thumb" onclick="openPhotoPreviewLightbox('${initialPhoto.replace(/'/g, "\\'")}', 'Anggota #${memberId}')" title="Klik untuk lihat foto">
            <i class="fa-solid fa-circle-xmark" style="color: #ef4444; font-size: 14px; cursor: pointer;" onclick="removeRowPhoto('member', ${memberId})" title="Hapus foto"></i>
          </div>
        ` : `
          <button type="button" class="cell-photo-btn" onclick="triggerRowPhotoUpload('member', ${memberId})" title="Unggah Pas Foto Anggota">
            <i class="fa-solid fa-camera"></i> +Foto
          </button>
        `}
      </div>
      <input type="file" id="memberPhotoInput-${memberId}" accept="image/*" style="display: none;" onchange="handleRowPhotoSelected(event, 'member', ${memberId})">
      <input type="hidden" class="grp-member-photo-data" id="memberPhotoData-${memberId}" value="${escapeHtml(initialPhoto)}">
    </td>
    <td>
      <input type="text" class="form-control form-control-sm grp-member-name" 
             placeholder="Nama lengkap peserta" value="${escapeHtml(initialName)}" 
             maxlength="100"
             oninput="syncAllGroupGuardians(); clearSingleGroupMemberWarning(${memberId});" 
             onblur="checkSingleGroupMemberDuplicate(${memberId})" required>
      <div class="grp-dup-warning-wrap" id="dupWarningWrap-${memberId}" style="display: none; margin-top: 5px;"></div>
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
      <input type="number" class="form-control form-control-sm grp-member-join-year" 
             placeholder="Tahun" min="2000" max="${new Date().getFullYear()}" value="${escapeHtml(String(initialJoinYear))}" 
             data-auto-filled="${initialJoinYear ? 'true' : 'false'}"
             oninput="this.dataset.autoFilled = 'false';"
             required title="Tahun pertama bergabung di Paskas">
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
             placeholder="Asma / Alergi / Sehat" value="${escapeHtml(initialMed)}" maxlength="200">
    </td>
    <td>
      <input type="tel" inputmode="numeric" pattern="[0-9]*" class="form-control form-control-sm grp-member-phone" 
             placeholder="08xxxxxxxx" value="${escapeHtml(initialPhone)}"
             maxlength="16"
             onblur="checkSingleGroupMemberDuplicate(${memberId})"
             oninput="this.value = this.value.replace(/[^0-9]/g, ''); clearSingleGroupMemberWarning(${memberId});">
    </td>
    <td>
      <input type="tel" inputmode="numeric" pattern="[0-9]*" class="form-control form-control-sm grp-member-emergency" 
             placeholder="08xxxxxxxx" value="${escapeHtml(initialEmergency)}"
             maxlength="16"
             oninput="this.value = this.value.replace(/[^0-9]/g, '');" title="Nomor HP darurat / keluarga">
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
  const coordRows = document.querySelectorAll('#groupCoordinatorsContainer tr.coord-card');
  const memberRows = document.querySelectorAll('#groupMembersContainer tr.member-card');
  const coordCount = coordRows.length;
  const memberCount = memberRows.length;
  const total = coordCount + memberCount;
  let male = 0;
  let female = 0;
  let children = 0;

  coordRows.forEach(row => {
    const genderSel = row.querySelector('.grp-coord-gender');
    const g = genderSel ? genderSel.value : 'Laki-laki';
    if (g === 'Perempuan') {
      female++;
    } else {
      male++;
    }

    const ageVal = parseInt(row.querySelector('.grp-coord-age')?.value || '0', 10);
    if (ageVal > 0 && ageVal < 15) {
      children++;
    }
  });

  memberRows.forEach(row => {
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
  if (statTotalEl) {
    if (coordCount > 0) {
      statTotalEl.textContent = `${total} Orang (${coordCount} Koord + ${memberCount} Anggota)`;
    } else {
      statTotalEl.textContent = `${total} Orang`;
    }
  }

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

  // Pas foto peserta TIDAK ditampilkan di tiket (foto hanya disimpan di Supabase untuk keperluan panitia)
  const photoImg = document.getElementById('ticketBpPhotoImg');
  if (ticketCard) ticketCard.classList.remove('has-photo');
  if (photoImg) {
    photoImg.onerror = null;
    photoImg.src = '';
    photoImg.style.display = 'none';
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

  const isAllocActive = isRoomGroupAllocationEnabled();

  // Aturan Kelompok: Jika fitur pembagian di-close ATAU peserta anak-anak -> Tampil strip '-'
  let grpVal = '-';
  if (isAllocActive && !isChild) {
    if (record.group_code && record.group_code !== '-') {
      grpVal = String(record.group_code).toUpperCase();
    } else if (record.group_name && record.group_name !== '-') {
      grpVal = String(record.group_name).toUpperCase();
    } else {
      const alloc = autoAllocateRoomAndGroup(record.gender, false);
      grpVal = (alloc.group_code && alloc.group_code !== '-') ? alloc.group_code.toUpperCase() : '-';
    }
  }
  
  const elGroup = document.getElementById('ticketBpGroup');
  if (elGroup) elGroup.textContent = grpVal;

  // Aturan Kamar: Jika fitur pembagian di-close -> Tampil strip '-', jika aktif alokasikan sesuai kamar/orang tua
  let roomVal = '-';
  if (isAllocActive) {
    roomVal = record.room_number || record.kamar || '';
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
    if (!roomVal || roomVal === '-') {
      if (isChild) {
        roomVal = 'Ikut Ortu';
      } else {
        const alloc = autoAllocateRoomAndGroup(record.gender, false);
        roomVal = (alloc.room_number && alloc.room_number !== '-') ? alloc.room_number : '-';
      }
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

  // Pastikan tombol WhatsApp yang telah dihapus tidak muncul
  const waBtn = document.getElementById('btnSendTicketWa');
  if (waBtn) waBtn.remove();

  // Reset status notifikasi email dan tombol
  const statusBox = document.getElementById('ticketEmailStatusBox');
  if (statusBox) {
    statusBox.style.display = 'none';
    statusBox.innerHTML = '';
  }
  const emailBtn = document.getElementById('btnSendTicketEmail');
  if (emailBtn) {
    emailBtn.disabled = false;
    emailBtn.innerHTML = '<i class="fa-solid fa-envelope"></i> Kirim via Email';
    emailBtn.style.background = '#0284c7';
  }

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
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunduh...';
  }

  // Microtask yield: Catat dan render perubahan tombol seketika tanpa delay
  await new Promise(r => setTimeout(r, 40));

  try {
    const canvas = await html2canvas(ticketCard, {
      scale: 2.2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 0
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
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0
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

  // Bersihkan efek konfeti jika masih ada
  const confCanvas = document.getElementById('confettiCanvas');
  if (confCanvas) {
    const ctx = confCanvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  }

  // Jika tiket dibuka dalam Safe Preview Mode (misal saat cek anggota duplikat di form kelompok atau dari form isian):
  if (window.isViewingTicketInSafeMode) {
    window.isViewingTicketInSafeMode = false;
    // JANGAN reset form dan JANGAN alihkan halaman! Form rombongan tetap utuh 100%.
    return;
  }

  // Anggap selesai pendaftaran baru dan arahkan langsung ke halaman dashboard
  resetToSelectionScreen();
  navigateTo('dashboard');
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
  const isChild = Boolean(record.is_child || (!isNaN(ageVal) && ageVal > 0 && ageVal < 15) || (record.attendee_type === 'anak'));
  const isAllocActive = isRoomGroupAllocationEnabled();
  const grpVal = (!isAllocActive || isChild) ? '-' : (record.group_name || (record.registration_type === 'kelompok' ? 'Kelompok' : 'Reguler'));
  
  let roomVal = '-';
  if (isAllocActive) {
    roomVal = record.room_number || record.kamar || '';
    if (!roomVal && isChild && record.guardian_name && typeof allRegistrations !== 'undefined') {
      const parent = allRegistrations.find(a => 
        a.full_name && a.full_name.trim().toLowerCase() === record.guardian_name.trim().toLowerCase()
      );
      if (parent && (parent.room_number || parent.kamar)) {
        roomVal = parent.room_number || parent.kamar;
      }
    }
    if (!roomVal || roomVal === '-') roomVal = isChild ? 'Ikut Ortu' : '08';
  }

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
async function sendTicketEmail() {
  const btn = document.getElementById('btnSendTicketEmail');
  const statusBox = document.getElementById('ticketEmailStatusBox');
  const originalText = btn ? btn.innerHTML : '<i class="fa-solid fa-envelope"></i> Kirim via Email';

  try {
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

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim E-Tiket...';
    }
    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.style.background = 'rgba(2, 132, 199, 0.2)';
      statusBox.style.border = '1px solid #0284c7';
      statusBox.style.color = '#38bdf8';
      statusBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sedang memproses pengiriman E-Tiket ke: <strong>${escapeHtml(destEmail)}</strong>...`;
    }

    const settings = window.dataService.getSettings();
    const subject = settings.confirmation_email_subject || `[E-TIKET RESMI] Silaturahmi Akbar Paskas Bahagia - ${currentTicketRecord.registration_code}`;
    const body = buildConfirmationMessage(currentTicketRecord);

    // Selalu salin narasi ke clipboard peserta sebagai cadangan
    try {
      copyTicketConfirmationMessage(false);
    } catch (clipErr) {
      console.warn('Clipboard write warning:', clipErr);
    }

    const fallbackUrl = 'https://script.google.com/macros/s/AKfycbw1k6dhuACxMSKHLqFLKHla2QQzc2CnZddLp93mh98Jg-Mg0etauHLuQ0cakuCMMBZ83A/exec';
    const googleScriptUrl = (settings.google_email_script_url && settings.google_email_script_url.trim())
      ? settings.google_email_script_url.trim()
      : fallbackUrl;
    const emailjsServiceId = settings.emailjs_service_id || '';
    const emailjsTemplateId = settings.emailjs_template_id || '';
    const emailjsPublicKey = settings.emailjs_public_key || '';

    // Render gambar kartu tiket secara otomatis untuk dilampirkan ke email
    let imageBase64 = '';
    const ticketCard = document.getElementById('printableTicket');
    if (ticketCard && typeof html2canvas === 'function') {
      try {
        if (statusBox) {
          statusBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyiapkan gambar E-Tiket & memproses pengiriman...`;
        }
        await new Promise(r => setTimeout(r, 40));
        const canvas = await html2canvas(ticketCard, {
          scale: 2.2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0
        });
        imageBase64 = canvas.toDataURL('image/png');
      } catch (canvasErr) {
        console.warn('Gagal render gambar tiket untuk email:', canvasErr);
      }
    }

    if (googleScriptUrl) {
      showToast(`Sedang mengirim E-Tiket ke: ${destEmail}...`, 'info');
      await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          to_email: destEmail,
          email: destEmail,
          to_name: currentTicketRecord.full_name || 'Peserta',
          name: currentTicketRecord.full_name || 'Peserta',
          subject: subject,
          message: body,
          body: body,
          registration_code: currentTicketRecord.registration_code || '-',
          image_base64: imageBase64,
          photo_base64: [currentTicketRecord.photo_url, currentTicketRecord.photo_data].find(p => typeof p === 'string' && p.startsWith('data:image')) || ''
        })
      });

      showToast(`Alhamdulillah! E-Tiket resmi berhasil dikirim ke: ${destEmail}`, 'success');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(16, 185, 129, 0.22)';
        statusBox.style.border = '1px solid #10b981';
        statusBox.style.color = '#34d399';
        statusBox.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 16px;"></i> <strong>Alhamdulillah, Tiket Berhasil Dikirim!</strong><br><span style="font-size: 13px; color: #f1f5f9;">E-Tiket resmi beserta gambar boarding pass telah terkirim ke email: <strong>${escapeHtml(destEmail)}</strong>.<br><span style="font-size: 12px; color: #94a3b8;">Silakan periksa Kotak Masuk (Inbox) atau folder Spam pada email Anda.</span></span>`;
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Tiket Terkirim!';
        btn.style.background = '#059669';
      }
      return;
    } else if (window.emailjs && emailjsPublicKey && emailjsServiceId && emailjsTemplateId) {
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
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(16, 185, 129, 0.22)';
        statusBox.style.border = '1px solid #10b981';
        statusBox.style.color = '#34d399';
        statusBox.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 16px;"></i> <strong>Alhamdulillah, Tiket Berhasil Dikirim!</strong><br><span style="font-size: 13px; color: #f1f5f9;">E-Tiket resmi telah terkirim ke email: <strong>${escapeHtml(destEmail)}</strong>.<br><span style="font-size: 12px; color: #94a3b8;">Silakan periksa Kotak Masuk (Inbox) atau folder Spam pada email Anda.</span></span>`;
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Tiket Terkirim!';
        btn.style.background = '#059669';
      }
      return;
    } else {
      // Buka Gmail Web / aplikasi Email dengan tujuan, subjek, dan tiket yang sudah otomatis terisi
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const mailtoUrl = `mailto:${encodeURIComponent(destEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      let opened = false;
      try {
        const win = window.open(gmailUrl, '_blank');
        if (win && !win.closed) opened = true;
      } catch (e) {
        opened = false;
      }
      if (!opened) {
        window.location.href = mailtoUrl;
      }
      showToast(`Membuka Gmail ke: ${destEmail}. Rincian tiket telah disalin ke clipboard!`, 'info');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(2, 132, 199, 0.2)';
        statusBox.style.border = '1px solid #0284c7';
        statusBox.style.color = '#38bdf8';
        statusBox.innerHTML = `<i class="fa-solid fa-envelope-open-text"></i> Halaman Gmail telah dibuka untuk pengiriman ke: <strong>${escapeHtml(destEmail)}</strong>. Teks tiket sudah tersalin otomatis.`;
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Siap Dikirim!';
        setTimeout(() => {
          if (btn) btn.innerHTML = originalText;
        }, 3500);
      }
    }
  } catch (err) {
    console.error('Email send error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.style.background = 'rgba(239, 68, 68, 0.22)';
      statusBox.style.border = '1px solid #ef4444';
      statusBox.style.color = '#f87171';
      statusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal mengirim email: ${escapeHtml(err.text || err.message || 'Periksa koneksi Anda')}`;
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
window.viewDuplicateTicketSafely = viewDuplicateTicketSafely;
window.checkSingleGroupMemberDuplicate = checkSingleGroupMemberDuplicate;
window.clearSingleGroupMemberWarning = clearSingleGroupMemberWarning;
window.checkSingleCoordinatorDuplicate = checkSingleCoordinatorDuplicate;
window.clearSingleCoordinatorDuplicate = clearSingleCoordinatorDuplicate;
window.checkIndividualDuplicateOnBlur = checkIndividualDuplicateOnBlur;
window.hideIndividualDuplicateNotice = hideIndividualDuplicateNotice;

// ===================================================================
// SECTION: MAHABBAH & SUKSES REGISTRASI (IN-PAGE VIEW)
// ===================================================================
let activeSuccessRecord = null;
let activeSuccessBatch = null;
let activeSuccessIndex = 0;
let activeSuccessType = 'individu';
let isSuccessTicketPreviewOpen = false;

function showSuccessRegistrationView(recordOrBatch, type = 'individu') {
  activeSuccessType = type;
  const container = document.getElementById('regSuccessViewContainer');
  const formCard = document.getElementById('regFormCardContainer');
  const promptBox = document.getElementById('regTypePromptBox');
  const nameEl = document.getElementById('successAttendeeName');
  const codeBadge = document.getElementById('successRegCodeBadge');
  const detailsContainer = document.getElementById('successSummaryDetailsContainer');
  const ticketCollapsible = document.getElementById('successTicketPreviewCollapsible');
  const btnToggle = document.getElementById('btnSuccessTogglePreview');
  const emailAlert = document.getElementById('successEmailStatusAlert');

  // Tutup modal pop-up secara langsung tanpa redirect ke dashboard
  const tModal = document.getElementById('ticketModal');
  if (tModal) tModal.classList.remove('active');
  const pModal = document.getElementById('previewModal');
  if (pModal) pModal.classList.remove('active');

  // Bersihkan efek konfeti
  const confCanvas = document.getElementById('confettiCanvas');
  if (confCanvas) {
    const ctx = confCanvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  }

  // Pastikan view page-registration aktif tanpa memicu scroll ke top
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const regPage = document.getElementById('page-registration');
  if (regPage) regPage.classList.add('active');

  // Sembunyikan SEMUA elemen panduan & tombol registrasi agar kartu sukses Mahabbah tampil murni dan fokus
  const hangingGallery = document.querySelector('.hanging-gallery-wrapper');
  const storyGrid = document.getElementById('storyContentGrid');
  const ctaWrap = document.getElementById('regisCtaWrapper');
  const floatingBar = document.querySelector('.retreat-floating-bar-wrapper');

  if (hangingGallery) hangingGallery.style.display = 'none';
  if (storyGrid) storyGrid.style.setProperty('display', 'none', 'important');
  if (ctaWrap) ctaWrap.style.setProperty('display', 'none', 'important');
  if (floatingBar) floatingBar.style.display = 'none';
  if (formCard) formCard.style.display = 'none';
  if (promptBox) promptBox.style.display = 'none';

  // LANGSUNG TAMPILKAN KONTAINER SUKSES IN-PAGE
  if (container) {
    container.style.display = 'block';
  }

  // Reset ticket preview & alert status
  isSuccessTicketPreviewOpen = false;
  if (ticketCollapsible) ticketCollapsible.style.display = 'none';
  if (btnToggle) btnToggle.innerHTML = '<i class="fa-solid fa-eye"></i> Pratinjau E-Tiket';
  if (emailAlert) emailAlert.style.display = 'none';

  if (type === 'individu') {
    activeSuccessRecord = recordOrBatch;
    activeSuccessBatch = null;
    currentTicketRecord = recordOrBatch;

    if (nameEl) nameEl.textContent = recordOrBatch.full_name || 'Sahabat Paskas';
    if (codeBadge) codeBadge.textContent = recordOrBatch.registration_code || '-';

    // Render Ringkasan Individu
    if (detailsContainer) {
      const isHealthy = !recordOrBatch.medical_history || recordOrBatch.medical_history.toLowerCase().includes('sehat') || recordOrBatch.medical_history.toLowerCase().includes('tidak ada');
      const healthHtml = isHealthy 
        ? `<span style="color: #047857; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> ${escapeHtml(recordOrBatch.medical_history || 'Tidak Ada (Alhamdulillah Sehat)')}</span>`
        : `<span style="color: #b45309; font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(recordOrBatch.medical_history)}</span>`;

      detailsContainer.innerHTML = `
        <div class="success-summary-grid">
          <div class="summary-cell">
            <div class="summary-cell-label"><i class="fa-solid fa-user" style="color:#d97706;"></i> Nama Lengkap & Usia</div>
            <div class="summary-cell-value" style="text-transform: capitalize;">${escapeHtml(recordOrBatch.full_name || '-')} ${recordOrBatch.age ? `(${recordOrBatch.age} th)` : ''}</div>
          </div>
          <div class="summary-cell">
            <div class="summary-cell-label"><i class="fa-solid fa-venus-mars" style="color:#0284c7;"></i> Jenis Kelamin</div>
            <div class="summary-cell-value">${escapeHtml(recordOrBatch.gender || '-')}</div>
          </div>
          <div class="summary-cell">
            <div class="summary-cell-label"><i class="fa-solid fa-map-location-dot" style="color:#d97706;"></i> Wilayah & Daerah</div>
            <div class="summary-cell-value" style="text-transform: capitalize;">${escapeHtml(recordOrBatch.wilayah || '-')} ${recordOrBatch.daerah ? `<span style="color:#64748b; font-weight:600;">/ ${escapeHtml(recordOrBatch.daerah)}</span>` : ''}</div>
          </div>
          <div class="summary-cell">
            <div class="summary-cell-label"><i class="fa-solid fa-shirt" style="color:#64748b;"></i> Ukuran Seragam</div>
            <div class="summary-cell-value"><span class="badge-size" style="background:#0f172a; color:#f8fafc; padding:3px 10px; border-radius:6px; font-size:12px; font-weight:800;">${escapeHtml(recordOrBatch.cloth_size || '-')}</span></div>
          </div>
          <div class="summary-cell">
            <div class="summary-cell-label"><i class="fa-solid fa-plane-arrival" style="color:#059669;"></i> Kedatangan</div>
            <div class="summary-cell-value">${escapeHtml(recordOrBatch.arrival_date || '-')} <small style="color:#64748b; font-weight:600;">(${escapeHtml(recordOrBatch.transport_arrival || '-')})</small></div>
          </div>
          <div class="summary-cell">
            <div class="summary-cell-label"><i class="fa-solid fa-plane-departure" style="color:#0284c7;"></i> Kepulangan</div>
            <div class="summary-cell-value">${escapeHtml(recordOrBatch.departure_date || '-')} <small style="color:#64748b; font-weight:600;">(${escapeHtml(recordOrBatch.transport_departure || '-')})</small></div>
          </div>
          <div class="summary-cell" style="grid-column: 1 / -1;">
            <div class="summary-cell-label"><i class="fa-solid fa-heart-pulse" style="color:#059669;"></i> Riwayat Kesehatan</div>
            <div class="summary-cell-value">${healthHtml}</div>
          </div>
        </div>
      `;
    }
  } else {
    // Kelompok / Rombongan
    activeSuccessRecord = Array.isArray(recordOrBatch) ? recordOrBatch[0] : recordOrBatch;
    activeSuccessBatch = Array.isArray(recordOrBatch) ? recordOrBatch : [recordOrBatch];
    activeSuccessIndex = 0;
    currentTicketRecord = activeSuccessRecord;
    currentTicketBatch = activeSuccessBatch;
    currentTicketIndex = 0;

    const groupName = activeSuccessRecord?.group_name || 'Kafilah Ukhuwah';
    const leaderName = activeSuccessRecord?.group_leader_name || activeSuccessRecord?.full_name || 'Koordinator';
    const count = activeSuccessBatch.length;
    const firstCode = activeSuccessBatch[0]?.registration_code || '';
    const lastCode = activeSuccessBatch[count - 1]?.registration_code || '';
    const codeDisplay = (firstCode && lastCode && firstCode !== lastCode) ? `${firstCode} s/d ${lastCode}` : firstCode;

    if (nameEl) nameEl.textContent = `${groupName} (Koord: ${leaderName})`;
    if (codeBadge) codeBadge.textContent = codeDisplay || `${count} Peserta`;

    if (detailsContainer) {
      const rowsHtml = activeSuccessBatch.map((item, idx) => {
        return `
          <tr id="successGroupRow_${idx}">
            <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
            <td><strong style="color: #b45309; font-family: monospace;">${escapeHtml(item.registration_code || '-')}</strong></td>
            <td><strong>${escapeHtml(item.full_name || '-')}</strong> ${item.is_child ? '<span class="badge-role-child" style="font-size:10px;">Anak</span>' : ''}</td>
            <td>${escapeHtml(item.gender || '-')}</td>
            <td>${item.age ? `${item.age} th` : '-'}</td>
            <td><span class="badge-size" style="background:#0f172a; color:#f8fafc; padding:2px 6px; border-radius:4px; font-size:11px;">${escapeHtml(item.cloth_size || '-')}</span></td>
            <td><small style="color: #047857; font-weight:600;">${escapeHtml(item.medical_history || 'Sehat')}</small></td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-view-ticket" onclick="successSwitchGroupMember(${idx}); toggleSuccessTicketPreview(true);" title="Lihat E-Tiket ${escapeHtml(item.full_name || '')}">
                <i class="fa-solid fa-eye"></i> Lihat
              </button>
            </td>
          </tr>
        `;
      }).join('');

      detailsContainer.innerHTML = `
        <div style="margin-bottom: 12px; font-size: 13.5px; color: #475569;">
          Kafilah: <strong>${escapeHtml(groupName)}</strong> &bull; Wilayah: <strong>${escapeHtml(activeSuccessRecord?.wilayah || '-')}</strong> &bull; Total: <strong>${count} Jiwa</strong>
        </div>
        <div class="success-group-table-wrap">
          <table class="success-group-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">No</th>
                <th>Kode Tiket</th>
                <th>Nama Peserta</th>
                <th>Gender</th>
                <th>Usia</th>
                <th>Baju</th>
                <th>Kesehatan</th>
                <th style="width: 75px; text-align: center;">E-Tiket</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  // Atur visibilitas tombol unduh rombongan vs individu
  const btnDownloadAll = document.getElementById('btnSuccessDownloadAll');
  const btnDownloadSingle = document.getElementById('btnSuccessDownload');
  const batchLabel = document.getElementById('successBatchCountLabel');

  if (type === 'kelompok' && activeSuccessBatch && activeSuccessBatch.length > 1) {
    if (btnDownloadAll) {
      btnDownloadAll.style.display = 'inline-flex';
      if (batchLabel) batchLabel.textContent = `${activeSuccessBatch.length} Tiket`;
    }
    if (btnDownloadSingle) {
      btnDownloadSingle.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> Unduh E-Tiket Ini (PNG)';
    }
  } else {
    if (btnDownloadAll) btnDownloadAll.style.display = 'none';
    if (btnDownloadSingle) {
      btnDownloadSingle.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> Unduh E-Tiket (PNG)';
    }
  }

  // Update slider navigasi tiket rombongan
  updateSuccessGroupSliderUI();

  // Siapkan dan suntikkan tampilan tiket boarding pass ke area pratinjau live
  try {
    renderSuccessTicketIntoArea(activeSuccessRecord);
  } catch (err) {
    console.warn('Kendala render tiket sukses:', err);
  }

  // Pastikan formCard & promptBox tersembunyi
  if (formCard) formCard.style.display = 'none';
  if (promptBox) promptBox.style.display = 'none';
  if (container) container.style.display = 'block';

  // Smooth scroll langsung menuju puncak kartu sukses mahabbah
  setTimeout(() => {
    if (container) {
      const topOffset = container.getBoundingClientRect().top + window.pageYOffset - 40;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  }, 100);
}

function renderSuccessTicketIntoArea(record) {
  const renderArea = document.getElementById('successTicketRenderArea');
  if (!renderArea || !record) return;

  try {
    // 1. KOSONGKAN renderArea TERLEBIH DAHULU agar tidak ada elemen duplikat ID di DOM
    renderArea.innerHTML = '';

    // 2. Isi #printableTicket yang asli dengan data peserta yang dipilih
    if (typeof renderActiveTicket === 'function') {
      renderActiveTicket(record);
    }

    // 3. Klon tiket yang sudah terisi data resmi peserta
    const sourceTicket = document.getElementById('printableTicket');
    if (sourceTicket) {
      const clonedTicket = sourceTicket.cloneNode(true);
      clonedTicket.id = 'successClonedPrintableTicket';
      // Beri awalan 'cloned_' pada semua ID di dalam elemen tiruan agar tidak terjadi konflik DOM ID
      clonedTicket.querySelectorAll('[id]').forEach(el => {
        el.id = 'cloned_' + el.id;
      });
      renderArea.appendChild(clonedTicket);
    }
  } catch (err) {
    console.warn('Gagal merender pratinjau tiket sukses:', err);
  }
}

function updateSuccessGroupSliderUI() {
  const slider = document.getElementById('successGroupNavSlider');
  const selMember = document.getElementById('successGroupMemberSelect');
  const counterText = document.getElementById('successGroupCounterText');
  const btnPrev = document.getElementById('btnSuccessPrevTicket');
  const btnNext = document.getElementById('btnSuccessNextTicket');

  if (!slider) return;

  if (activeSuccessType === 'kelompok' && activeSuccessBatch && activeSuccessBatch.length > 1) {
    slider.style.display = 'flex';
    if (selMember) {
      selMember.innerHTML = activeSuccessBatch.map((item, idx) => {
        const isCurrent = idx === activeSuccessIndex;
        return `<option value="${idx}" ${isCurrent ? 'selected' : ''}>Peserta ${idx + 1}: ${escapeHtml(item.full_name || 'Peserta')} (${escapeHtml(item.registration_code || '-')})</option>`;
      }).join('');
      selMember.value = String(activeSuccessIndex);
    }
    if (counterText) {
      counterText.textContent = `Peserta ${activeSuccessIndex + 1} dari ${activeSuccessBatch.length}`;
    }
    if (btnPrev) btnPrev.disabled = activeSuccessIndex === 0;
    if (btnNext) btnNext.disabled = activeSuccessIndex === activeSuccessBatch.length - 1;
  } else {
    slider.style.display = 'none';
  }
}

function successStepGroupTicket(delta) {
  if (!activeSuccessBatch || activeSuccessBatch.length <= 1) return;
  const newIndex = activeSuccessIndex + delta;
  if (newIndex >= 0 && newIndex < activeSuccessBatch.length) {
    successSwitchGroupMember(newIndex);
  }
}

function successSwitchGroupMember(indexVal) {
  const idx = parseInt(indexVal, 10);
  if (isNaN(idx) || !activeSuccessBatch || idx < 0 || idx >= activeSuccessBatch.length) return;

  activeSuccessIndex = idx;
  activeSuccessRecord = activeSuccessBatch[idx];
  currentTicketRecord = activeSuccessRecord;
  currentTicketIndex = idx;

  // Update UI slider & dropdown
  updateSuccessGroupSliderUI();

  // Render ulang tiket di area pratinjau live
  renderSuccessTicketIntoArea(activeSuccessRecord);

  // Jika pratinjau sedang tertutup, buka agar peserta langsung melihatnya
  const collapsible = document.getElementById('successTicketPreviewCollapsible');
  const btnToggle = document.getElementById('btnSuccessTogglePreview');
  if (collapsible && collapsible.style.display === 'none') {
    isSuccessTicketPreviewOpen = true;
    collapsible.style.display = 'block';
    if (btnToggle) {
      btnToggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Sembunyikan E-Tiket';
    }
  }

  // Highlight baris di tabel ringkasan
  document.querySelectorAll('.success-group-table tbody tr').forEach((tr, rIdx) => {
    if (rIdx === idx) {
      tr.style.background = '#fef3c7';
      tr.style.transition = 'background 0.3s ease';
    } else {
      tr.style.background = '';
    }
  });
}

function toggleSuccessTicketPreview(forceOpen = null) {
  const collapsible = document.getElementById('successTicketPreviewCollapsible');
  const btnToggle = document.getElementById('btnSuccessTogglePreview');
  if (!collapsible) return;

  if (typeof forceOpen === 'boolean') {
    isSuccessTicketPreviewOpen = forceOpen;
  } else {
    isSuccessTicketPreviewOpen = !isSuccessTicketPreviewOpen;
  }

  collapsible.style.display = isSuccessTicketPreviewOpen ? 'block' : 'none';

  if (btnToggle) {
    btnToggle.innerHTML = isSuccessTicketPreviewOpen 
      ? '<i class="fa-solid fa-eye-slash"></i> Sembunyikan E-Tiket'
      : '<i class="fa-solid fa-eye"></i> Pratinjau E-Tiket';
  }

  if (isSuccessTicketPreviewOpen) {
    collapsible.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function triggerSuccessEmailSend() {
  const alertBox = document.getElementById('successEmailStatusAlert');
  if (alertBox) {
    alertBox.style.display = 'block';
    alertBox.style.background = '#f0f9ff';
    alertBox.style.border = '1px solid #7dd3fc';
    alertBox.style.color = '#0369a1';
    alertBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyiapkan pengiriman E-Tiket ke email...';
  }

  // Panggil fungsi sendTicketEmail yang sudah ada
  try {
    await sendTicketEmail();
    if (alertBox) {
      alertBox.style.background = '#ecfdf5';
      alertBox.style.border = '1px solid #6ee7b7';
      alertBox.style.color = '#065f46';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> E-Tiket resmi telah diproses untuk dikirim ke email peserta.';
    }
  } catch (err) {
    if (alertBox) {
      alertBox.style.background = '#fef2f2';
      alertBox.style.border = '1px solid #fca5a5';
      alertBox.style.color = '#991b1b';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + (err.message || 'Kendala saat mengirim email.');
    }
  }
}

async function triggerSuccessTicketDownload() {
  // Pastikan #printableTicket terisi data peserta yang sedang aktif di pratinjau
  if (activeSuccessRecord && typeof renderActiveTicket === 'function') {
    renderActiveTicket(activeSuccessRecord);
  }
  // Unduh tiket yang sedang aktif di pratinjau live
  await downloadTicketImage();
}

async function triggerSuccessDownloadAllTickets() {
  if (!activeSuccessBatch || activeSuccessBatch.length === 0) {
    showToast('Tidak ada tiket rombongan yang dapat diunduh.', 'warning');
    return;
  }

  const btn = document.getElementById('btnSuccessDownloadAll');
  const origHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mengunduh (0/${activeSuccessBatch.length})...`;
  }

  const alertBox = document.getElementById('successEmailStatusAlert');
  if (alertBox) {
    alertBox.style.display = 'block';
    alertBox.style.background = '#f0fdf4';
    alertBox.style.border = '1.5px solid #86efac';
    alertBox.style.color = '#166534';
    alertBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memulai pengunduhan otomatis untuk ${activeSuccessBatch.length} tiket rombongan...`;
  }

  showToast(`Memulai proses pengunduhan ${activeSuccessBatch.length} tiket rombongan satu per satu...`, 'info');

  try {
    for (let i = 0; i < activeSuccessBatch.length; i++) {
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mengunduh (${i + 1}/${activeSuccessBatch.length})...`;
      }
      if (alertBox) {
        alertBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyiapkan gambar PNG (${i + 1}/${activeSuccessBatch.length}): <strong>${escapeHtml(activeSuccessBatch[i].full_name || 'Peserta')}</strong>...`;
      }

      // Ganti tiket aktif
      successSwitchGroupMember(i);
      await new Promise(r => setTimeout(r, 220));

      const ticketCard = document.getElementById('printableTicket');
      if (ticketCard && window.html2canvas) {
        const canvas = await window.html2canvas(ticketCard, {
          scale: 2.2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0
        });

        const member = activeSuccessBatch[i];
        const regCode = (member.registration_code || `PKB_${i+1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
        const cleanName = (member.full_name || `Peserta_${i+1}`).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `E-Tiket_${regCode}_${cleanName}.png`;

        const imageUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Delay jeda aman antar unduhan agar browser tidak mencegat multiple download
      await new Promise(r => setTimeout(r, 450));
    }

    if (alertBox) {
      alertBox.style.background = '#ecfdf5';
      alertBox.style.border = '1.5px solid #6ee7b7';
      alertBox.style.color = '#047857';
      alertBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Alhamdulillah!</strong> Seluruh ${activeSuccessBatch.length} tiket rombongan berhasil diunduh lengkap.`;
    }
    showToast(`Alhamdulillah! Berhasil mengunduh semua (${activeSuccessBatch.length}) tiket rombongan.`, 'success');
  } catch (err) {
    console.error('Error downloading all group tickets:', err);
    showToast('Kendala saat mengunduh tiket rombongan: ' + err.message, 'error');
    if (alertBox) {
      alertBox.style.background = '#fef2f2';
      alertBox.style.border = '1.5px solid #fca5a5';
      alertBox.style.color = '#991b1b';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Kendala saat mengunduh: ' + err.message;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  }
}

function finishSuccessRegistration() {
  const container = document.getElementById('regSuccessViewContainer');
  if (container) container.style.display = 'none';

  // Pulihkan tampilan normal registrasi
  const hangingGallery = document.querySelector('.hanging-gallery-wrapper');
  const storyGrid = document.getElementById('storyContentGrid');
  const ctaWrap = document.getElementById('regisCtaWrapper');
  const floatingBar = document.querySelector('.retreat-floating-bar-wrapper');
  if (hangingGallery) hangingGallery.style.display = '';
  if (storyGrid) storyGrid.style.display = '';
  if (ctaWrap) ctaWrap.style.display = '';
  if (floatingBar) floatingBar.style.display = '';

  // Bersihkan form & kembalikan ke beranda
  resetToSelectionScreen();
  navigateTo('dashboard');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function registerAnotherParticipant() {
  const container = document.getElementById('regSuccessViewContainer');
  if (container) container.style.display = 'none';

  // Pulihkan tampilan normal registrasi
  const hangingGallery = document.querySelector('.hanging-gallery-wrapper');
  const floatingBar = document.querySelector('.retreat-floating-bar-wrapper');
  if (hangingGallery) hangingGallery.style.display = '';
  if (floatingBar) floatingBar.style.display = '';

  resetToSelectionScreen();
  if (typeof navigateTo === 'function') {
    navigateTo('registration');
  }
  openRegistrationSelector();
}

window.showSuccessRegistrationView = showSuccessRegistrationView;
window.toggleSuccessTicketPreview = toggleSuccessTicketPreview;
window.triggerSuccessEmailSend = triggerSuccessEmailSend;
window.triggerSuccessTicketDownload = triggerSuccessTicketDownload;
window.triggerSuccessDownloadAllTickets = triggerSuccessDownloadAllTickets;
window.successStepGroupTicket = successStepGroupTicket;
window.successSwitchGroupMember = successSwitchGroupMember;
window.finishSuccessRegistration = finishSuccessRegistration;
window.registerAnotherParticipant = registerAnotherParticipant;

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

async function forceReloadCloudData(btn) {
  const origHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menghubungkan Supabase...';
  }
  try {
    showToast('Menghubungkan & menarik data dari Cloud Supabase...', 'info');
    allRegistrations = await window.dataService.getRegistrations();
    filteredRegistrations = [...allRegistrations];
    currentPage = 1;
    populateWilayahFilter();
    updateSummaryMetrics();
    renderRekapTable();
    renderCharts();

    const badge = document.getElementById('rekapBadgeCount');
    if (badge) badge.textContent = allRegistrations.length;
    const settingsBadge = document.getElementById('settingsRekapBadge');
    if (settingsBadge) settingsBadge.textContent = allRegistrations.length;

    showToast(`Alhamdulillah! Berhasil memuat ${allRegistrations.length} data peserta dari Supabase.`, 'success');
  } catch (err) {
    console.error('Gagal force reload Supabase data:', err);
    showToast('Kendala menarik data: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  }
}
window.forceReloadCloudData = forceReloadCloudData;

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
    try {
    const isMale = item.gender === 'Laki-laki';
    const isSpecialMed = item.medical_history && 
                         !item.medical_history.toLowerCase().includes('tidak ada') && 
                         !item.medical_history.toLowerCase().includes('sehat');

    const ageVal = item.age ? parseInt(item.age, 10) : null;
    const isChild = ageVal !== null && ageVal < 15;
    const ageDisplay = ageVal !== null 
      ? (isChild 
          ? `<span class="badge-age-child" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #b45309; border-radius: 999px; font-size: 11px; font-weight: 800;"><i class="fa-solid fa-child"></i> ${ageVal} th</span>`
          : `<span style="font-size: 13px; font-weight: 700; color: #1e293b;">${ageVal} th</span>`)
      : `<span style="color: #64748b;">-</span>`;

    const photoSrc = [item.photo_url, item.photo_data].find(p => typeof p === 'string' && p.trim() !== '') || '';
    const safeFullName = String(item.full_name || '');
    return `
      <tr>
        <td style="color: #475569; font-weight: 700; text-align: center;">${rowNo}</td>
        <td><span class="badge-table-code">${item.registration_code}</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            ${photoSrc
              ? `<img src="${photoSrc}" class="rekap-avatar-img" alt="${escapeHtml(safeFullName)}" onclick="openPhotoPreviewLightbox('${photoSrc.replace(/'/g, "\\'")}', '${escapeHtml(safeFullName).replace(/'/g, "\\'")}')" title="Klik untuk perbesar pas foto">`
              : `<div class="rekap-avatar-placeholder" title="Belum ada pas foto"><i class="fa-solid fa-user"></i></div>`
            }
            <div style="min-width: 0;">
              <strong style="color: #0f172a; font-size: 14.5px; font-weight: 800; display: block; letter-spacing: -0.01em;">${escapeHtml(item.full_name)}</strong>
              ${item.group_name ? `<small style="color: #b45309; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; margin-top: 3px;"><i class="fa-solid fa-users"></i> ${escapeHtml(item.group_name)}</small>` : '<small style="color: #64748b; font-weight: 600; margin-top: 3px; display: block;">Individu</small>'}
            </div>
          </div>
        </td>
        <td>
          <span class="${isMale ? 'badge-gender-l' : 'badge-gender-p'}">
            ${isMale ? '<i class="fa-solid fa-mars"></i> L' : '<i class="fa-solid fa-venus"></i> P'}
          </span>
        </td>
        <td style="text-align: center;">${ageDisplay}</td>
        <td>
          <strong style="color: #0f172a; font-weight: 700;"><i class="fa-solid fa-location-dot" style="color: #d97706; font-size: 11px;"></i> ${escapeHtml(item.wilayah)}</strong>
          ${item.daerah ? `<br><small style="color: #64748b; font-weight: 600;"><i class="fa-solid fa-city" style="font-size: 9px;"></i> ${escapeHtml(item.daerah)}</small>` : ''}
        </td>
        <td><span style="color: #1e293b; font-weight: 600;">${escapeHtml(item.arrival_date)}</span> <br><small style="color: #64748b;">${escapeHtml(item.arrival_time || '10:00')}</small></td>
        <td><span style="color: #1e293b; font-weight: 600;">${escapeHtml(item.departure_date)}</span> <br><small style="color: #64748b;">${escapeHtml(item.departure_time || '16:00')}</small></td>
        <td><span style="color: #1e293b; font-weight: 600;">${escapeHtml(item.transport_arrival)}</span></td>
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
            <button class="btn-table-action delete" onclick="confirmDeleteAttendee('${item.id}', '${(item.full_name || '').replace(/'/g, "\\'")}', '${item.registration_code}')" title="Hapus Data">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    } catch (rowErr) {
      console.error('Gagal render baris rekap:', item && item.registration_code, rowErr);
      return `<tr><td style="text-align:center;">${rowNo}</td><td>${escapeHtml(String((item && item.registration_code) || '-'))}</td><td colspan="10" style="color:#b91c1c;">Data peserta ini gagal ditampilkan (format data tidak valid)</td></tr>`;
    }
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
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          ${attendee.photo_url || attendee.photo_data ? `
            <img src="${attendee.photo_url || attendee.photo_data}" style="width: 70px; height: 88px; object-fit: cover; object-position: top center; border-radius: 8px; border: 2px solid #fbbf24; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" onclick="openPhotoPreviewLightbox('${(attendee.photo_url || attendee.photo_data).replace(/'/g, "\\'")}', '${escapeHtml(attendee.full_name).replace(/'/g, "\\'")}')" title="Klik untuk perbesar pas foto">
          ` : ''}
          <div>
            <span class="badge-table-code">${attendee.registration_code}</span>
            <h3 style="font-size: 22px; margin-top: 6px; color: #ffffff;">${attendee.full_name}</h3>
            <span style="font-size: 13px; color: #fbbf24;">${attendee.gender} &bull; ${attendee.wilayah}${attendee.daerah ? ` &bull; ${attendee.daerah}` : ''}</span>
          </div>
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

async function confirmDeleteAttendee(id, name, registrationCode = null) {
  if (confirm(`Apakah Anda yakin ingin menghapus data peserta "${name}" secara permanen?`)) {
    if (!registrationCode) {
      const found = allRegistrations.find(a => String(a.id) === String(id));
      if (found) registrationCode = found.registration_code;
    }
    await window.dataService.deleteRegistration(id, registrationCode);
    showToast(`Data peserta "${name}" telah dihapus permanen.`, 'info');
    await loadAndRenderRegistrations();
  }
}

async function deleteFromAttendeeDetail() {
  if (!currentViewingAttendee) return;
  const { id, full_name, registration_code } = currentViewingAttendee;
  if (confirm(`Apakah Anda yakin ingin menghapus data peserta "${full_name}" (${registration_code}) secara permanen?`)) {
    closeAttendeeModal();
    await window.dataService.deleteRegistration(id, registration_code);
    showToast(`Data peserta "${full_name}" telah dihapus permanen.`, 'info');
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
    health: document.getElementById('chartViewHealth'),
    paskas: document.getElementById('chartViewPaskas'),
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

  // Health computation
  function checkHasMedicalIssue(r) {
    if (!r || !r.medical_history) return false;
    const s = String(r.medical_history).trim().toLowerCase();
    if (!s || s === '-' || s === 'none' || s === 'nihil' || s === 'null') return false;
    if (s.includes('tidak ada') || s.includes('sehat') || s.includes('normal') || s.includes('prima') || s.includes('baik')) {
      return false;
    }
    return true;
  }

  const healthyList = allRegistrations.filter(r => !checkHasMedicalIssue(r));
  const healthIssueList = allRegistrations.filter(r => checkHasMedicalIssue(r));
  const healthyCount = healthyList.length;
  const issueCount = healthIssueList.length;
  const healthyPct = totalOrang > 0 ? Math.round((healthyCount / totalOrang) * 100) : 0;
  const issuePct = totalOrang > 0 ? (100 - healthyPct) : 0;
  const emergencyReadyCount = allRegistrations.filter(r => r.emergency_phone && r.emergency_phone.trim() !== '' && r.emergency_phone.trim() !== '-').length;

  renderHealthSection(healthIssueList, healthyCount, issueCount, healthyPct, issuePct, emergencyReadyCount, totalOrang);

  // Paskas membership computation
  const currentYr = new Date().getFullYear();
  function calcPaskasCategory(item) {
    let joinYear = null;
    if (item.join_year) {
      const p = parseInt(item.join_year, 10);
      if (!isNaN(p) && p > 1900 && p <= currentYr + 1) joinYear = p;
    }
    if (!joinYear && item.created_at) {
      const cYear = new Date(item.created_at).getFullYear();
      if (!isNaN(cYear)) joinYear = cYear;
    }
    if (!joinYear) joinYear = currentYr;

    const diff = Math.max(0, currentYr - joinYear);
    if (diff < 1) {
      return { level: 'PASKAS Baru', desc: '< 1 Tahun', years: diff, joinYear };
    } else if (diff < 5) {
      return { level: 'PASKAS Madya', desc: `${diff} Tahun`, years: diff, joinYear };
    } else {
      return { level: 'PASKAS Senior', desc: `${diff} Tahun`, years: diff, joinYear };
    }
  }

  let countBaru = 0, countMadya = 0, countSenior = 0;
  const paskasByWilayah = {};

  allRegistrations.forEach(r => {
    const cat = calcPaskasCategory(r);
    if (cat.level === 'PASKAS Baru') countBaru++;
    else if (cat.level === 'PASKAS Madya') countMadya++;
    else countSenior++;

    const w = normalizeWilayahName(r.wilayah || 'Lainnya');
    if (!paskasByWilayah[w]) {
      paskasByWilayah[w] = { name: w, total: 0, baru: 0, madya: 0, senior: 0 };
    }
    paskasByWilayah[w].total++;
    if (cat.level === 'PASKAS Baru') paskasByWilayah[w].baru++;
    else if (cat.level === 'PASKAS Madya') paskasByWilayah[w].madya++;
    else paskasByWilayah[w].senior++;
  });

  const pctBaru = totalOrang > 0 ? Math.round((countBaru / totalOrang) * 100) : 0;
  const pctMadya = totalOrang > 0 ? Math.round((countMadya / totalOrang) * 100) : 0;
  const pctSenior = totalOrang > 0 ? (100 - pctBaru - pctMadya) : 0;

  renderPaskasSection(paskasByWilayah, countBaru, countMadya, countSenior, pctBaru, pctMadya, pctSenior, totalOrang);

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

  // Chart Function: Health Status (Doughnut)
  function renderHealthChart(canvasId, refInstance) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (refInstance) refInstance.destroy();
    return new Chart(ctx, {
      type: 'doughnut',
      plugins: [doughnutSliceValuesPlugin],
      data: {
        labels: ['Kondisi Prima (Sehat)', 'Perlu Perhatian Medis Khusus'],
        datasets: [{
          label: 'Status Kesehatan',
          data: [healthyCount, issueCount],
          backgroundColor: ['#166534', '#dc2626'],
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
                const total = healthyCount + issueCount;
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

  // Chart Function: Paskas Membership (Doughnut)
  function renderPaskasChart(canvasId, refInstance) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (refInstance) refInstance.destroy();
    return new Chart(ctx, {
      type: 'doughnut',
      plugins: [doughnutSliceValuesPlugin],
      data: {
        labels: ['PASKAS Baru (< 1 Th)', 'PASKAS Madya (1 - <5 Th)', 'PASKAS Senior (≥ 5 Th)'],
        datasets: [{
          label: 'Jenjang Keanggotaan',
          data: [countBaru, countMadya, countSenior],
          backgroundColor: ['#0284c7', '#d97706', '#15803d'],
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
                const total = countBaru + countMadya + countSenior;
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
  } else if (currentChartTab === 'health') {
    chartHealthInstance = renderHealthChart('chartHealthStatus', chartHealthInstance);
  } else if (currentChartTab === 'paskas') {
    chartPaskasInstance = renderPaskasChart('chartPaskasStatus', chartPaskasInstance);
  } else if (currentChartTab === 'all') {
    chartClothAllInstance = renderClothChart('chartClothSizeAll', chartClothAllInstance);
    chartTransportAllInstance = renderTransportChart('chartTransportAll', chartTransportAllInstance);
    chartWilayahAllInstance = renderWilayahChart('chartWilayahAll', chartWilayahAllInstance);
    chartGenderAllInstance = renderGenderChart('chartGenderAll', chartGenderAllInstance);
    chartHealthAllInstance = renderHealthChart('chartHealthAll', chartHealthAllInstance);
    chartPaskasAllInstance = renderPaskasChart('chartPaskasAll', chartPaskasAllInstance);
  }
}

/**
 * Render Insight Pod & Tabel Daftar Peserta Perhatian Medis Khusus
 */
function renderHealthSection(healthIssueList, healthyCount, issueCount, healthyPct, issuePct, emergencyReadyCount, totalOrang) {
  const tagHealth = document.getElementById('tagHealthLead');
  if (tagHealth) {
    tagHealth.textContent = `${healthyCount} Prima (${healthyPct}%) \u2022 ${issueCount} Perlu Pantauan (${issuePct}%)`;
  }

  const badgeTotal = document.getElementById('rekapHealthTotalBadge');
  if (badgeTotal) {
    badgeTotal.textContent = `${issueCount} Perlu Pantauan`;
    badgeTotal.style.background = issueCount > 0 ? '#fee2e2' : '#dcfce7';
    badgeTotal.style.color = issueCount > 0 ? '#991b1b' : '#15803d';
    badgeTotal.style.borderColor = issueCount > 0 ? '#fca5a5' : '#86efac';
  }

  const listInsight = document.getElementById('healthInsightList');
  if (listInsight) {
    listInsight.innerHTML = `
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-users text-green"></i> Total Peserta Terdata</span>
        <span class="insight-item-val">${totalOrang} Orang</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-heart text-green"></i> Kondisi Prima / Bebas Keluhan</span>
        <span class="insight-item-val" style="color: #15803d; font-weight: 700;">${healthyCount} Orang (${healthyPct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-triangle-exclamation" style="color: #dc2626;"></i> Memerlukan Perhatian Medis</span>
        <span class="insight-item-val" style="color: ${issueCount > 0 ? '#dc2626' : '#64748b'}; font-weight: 700;">${issueCount} Orang (${issuePct}%)</span>
      </div>
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-phone-volume text-green"></i> Kontak Darurat Terdaftar</span>
        <span class="insight-item-val">${emergencyReadyCount} Kontak Siaga</span>
      </div>
    `;
  }

  const tbody = document.getElementById('rekapHealthTableBody');
  if (!tbody) return;

  if (healthIssueList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; color: #15803d; padding: 28px; background: #f0fdf4;">
          <i class="fa-solid fa-shield-heart" style="font-size: 28px; margin-bottom: 8px; display: block; color: #16a34a;"></i>
          <strong>Alhamdulillah, semua peserta dalam kondisi prima dan sehat!</strong>
          <p style="font-size: 12px; color: #4b5563; margin: 4px 0 0 0;">Tidak ada peserta yang tercatat memiliki riwayat medis darurat atau penyakit berisiko.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = healthIssueList.map((item, idx) => {
    const roomInfo = item.building 
      ? `${item.building} - ${item.room_name || item.room_number || '-'}` 
      : (item.room_name || item.room_number || '-');
    const waClean = (item.phone_number || '').replace(/[^0-9]/g, '');
    const waLink = waClean ? `https://wa.me/${waClean.startsWith('0') ? '62' + waClean.slice(1) : waClean}` : '#';
    const emClean = (item.emergency_phone || '').replace(/[^0-9]/g, '');
    const emLink = emClean ? `https://wa.me/${emClean.startsWith('0') ? '62' + emClean.slice(1) : emClean}` : '#';

    return `
      <tr>
        <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
        <td style="font-weight: 700; color: #111827;">${item.full_name || '-'}</td>
        <td style="text-align: center;">${item.age ? item.age + ' Th' : '-'}</td>
        <td style="text-align: center;">
          <span class="badge ${item.gender === 'Laki-laki' ? 'badge-ikhwan' : 'badge-akhwat'}">
            ${item.gender || '-'}
          </span>
        </td>
        <td>${item.wilayah || '-'}${item.daerah ? ' - ' + item.daerah : ''}</td>
        <td>${roomInfo}</td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 6px; background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px;">
            <i class="fa-solid fa-notes-medical" style="color: #dc2626;"></i>
            ${item.medical_history || '-'}
          </span>
        </td>
        <td style="text-align: center;">
          ${waClean ? `<a href="${waLink}" target="_blank" style="color: #15803d; font-weight: 600; text-decoration: none;"><i class="fa-brands fa-whatsapp"></i> ${item.phone_number}</a>` : '-'}
        </td>
        <td style="text-align: center;">
          ${emClean ? `<a href="${emLink}" target="_blank" style="color: #dc2626; font-weight: 600; text-decoration: none;"><i class="fa-solid fa-phone"></i> ${item.emergency_phone}</a>` : '-'}
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Render Insight Pod & Tabel Rekapitulasi Jenjang PASKAS per Wilayah
 */
function renderPaskasSection(paskasByWilayah, countBaru, countMadya, countSenior, pctBaru, pctMadya, pctSenior, totalOrang) {
  const tagPaskas = document.getElementById('tagPaskasLead');
  if (tagPaskas) {
    tagPaskas.textContent = `Senior: ${countSenior} (${pctSenior}%) \u2022 Madya: ${countMadya} (${pctMadya}%) \u2022 Baru: ${countBaru} (${pctBaru}%)`;
  }

  const badgeTotal = document.getElementById('rekapPaskasTotalBadge');
  const wilayahList = Object.values(paskasByWilayah).sort((a, b) => b.total - a.total);
  if (badgeTotal) badgeTotal.textContent = `${wilayahList.length} Wilayah Terdata`;

  const sumTotal = document.getElementById('rekapPaskasSumTotal');
  const sumBaru = document.getElementById('rekapPaskasSumBaru');
  const sumMadya = document.getElementById('rekapPaskasSumMadya');
  const sumSenior = document.getElementById('rekapPaskasSumSenior');
  if (sumTotal) sumTotal.textContent = `${totalOrang} Orang`;
  if (sumBaru) sumBaru.textContent = `${countBaru} Orang`;
  if (sumMadya) sumMadya.textContent = `${countMadya} Orang`;
  if (sumSenior) sumSenior.textContent = `${countSenior} Orang`;

  const listInsight = document.getElementById('paskasInsightList');
  if (listInsight) {
    listInsight.innerHTML = `
      <div class="insight-item">
        <span class="insight-item-name"><i class="fa-solid fa-users text-green"></i> Total Anggota Terdaftar</span>
        <span class="insight-item-val">${totalOrang} Orang</span>
      </div>
      <div class="insight-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <span class="insight-item-name"><i class="fa-solid fa-crown" style="color: #15803d;"></i> PASKAS Senior (\u2265 5 Th)</span>
          <span class="insight-item-val" style="color: #15803d; font-weight: 700;">${countSenior} Orang (${pctSenior}%)</span>
        </div>
        <small style="font-size: 11px; color: #4b5563;">Masa keanggotaan 5 tahun atau lebih sejak tanggal bergabung</small>
      </div>
      <div class="insight-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <span class="insight-item-name"><i class="fa-solid fa-star" style="color: #d97706;"></i> PASKAS Madya (1 - &lt;5 Th)</span>
          <span class="insight-item-val" style="color: #d97706; font-weight: 700;">${countMadya} Orang (${pctMadya}%)</span>
        </div>
        <small style="font-size: 11px; color: #4b5563;">Masa keanggotaan mulai 1 tahun hingga kurang dari 5 tahun</small>
      </div>
      <div class="insight-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <span class="insight-item-name"><i class="fa-solid fa-seedling" style="color: #0284c7;"></i> PASKAS Baru (&lt; 1 Th)</span>
          <span class="insight-item-val" style="color: #0284c7; font-weight: 700;">${countBaru} Orang (${pctBaru}%)</span>
        </div>
        <small style="font-size: 11px; color: #4b5563;">Masa keanggotaan kurang dari 1 (satu) tahun</small>
      </div>
    `;
  }

  const tbody = document.getElementById('rekapPaskasTableBody');
  if (!tbody) return;

  if (wilayahList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">
          Belum ada data wilayah keanggotaan Paskas.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = wilayahList.map((w, idx) => {
    return `
      <tr>
        <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
        <td style="font-weight: 700; color: #132a1c;">${w.name}</td>
        <td style="text-align: center; font-weight: 700;">${w.total} Orang</td>
        <td style="text-align: center;">
          <span style="background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 12px;">
            ${w.baru} Orang
          </span>
        </td>
        <td style="text-align: center;">
          <span style="background: #fef3c7; color: #b45309; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 12px;">
            ${w.madya} Orang
          </span>
        </td>
        <td style="text-align: center;">
          <span style="background: #dcfce7; color: #15803d; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 12px;">
            ${w.senior} Orang
          </span>
        </td>
      </tr>
    `;
  }).join('');
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
// 8. DATA EXPORTS (EXCEL & CSV) - TERLINDUNGI DARI FORMULA INJECTION
// ===================================================================
function sanitizeSpreadsheetValue(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (/^[=\+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function exportToExcel() {
  if (!window.XLSX) {
    showToast('Pustaka Excel sedang dimuat, coba sebentar lagi.', 'error');
    return;
  }

  const sourceData = (filteredRegistrations && filteredRegistrations.length > 0)
    ? filteredRegistrations
    : (allRegistrations && allRegistrations.length > 0 ? allRegistrations : []);

  if (sourceData.length === 0) {
    showToast('Tidak ada data peserta untuk diunduh.', 'warning');
    return;
  }

  const workbook = XLSX.utils.book_new();

  // Helper Styling
  function createHeaderStyle(hexColor) {
    return {
      fill: { fgColor: { rgb: hexColor } },
      font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thin', color: { rgb: 'D1D5DB' } },
        bottom: { style: 'medium', color: { rgb: '1F2937' } },
        left: { style: 'thin', color: { rgb: 'D1D5DB' } },
        right: { style: 'thin', color: { rgb: 'D1D5DB' } }
      }
    };
  }

  function createDataStyle(isEven, align = 'left', customBg = null, customColor = null, isBold = false) {
    return {
      fill: { fgColor: { rgb: customBg || (isEven ? 'FFFFFF' : 'F9FAFB') } },
      font: { name: 'Calibri', sz: 10, color: { rgb: customColor || '111827' }, bold: isBold },
      alignment: { horizontal: align, vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thin', color: { rgb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
        left: { style: 'thin', color: { rgb: 'E5E7EB' } },
        right: { style: 'thin', color: { rgb: 'E5E7EB' } }
      }
    };
  }

  function formatSheet(ws, aoaData, headerRowIndexes, headerColor, getCellCustomStyle = null) {
    const colWidths = [];
    const numCols = Math.max(...aoaData.map(r => r.length));
    for (let c = 0; c < numCols; c++) colWidths[c] = 12;

    const rowHeights = [];

    aoaData.forEach((row, rIdx) => {
      const isHeader = headerRowIndexes.includes(rIdx);
      rowHeights.push({ hpt: isHeader ? 26 : 20 });

      row.forEach((cellVal, cIdx) => {
        const valStr = cellVal !== null && cellVal !== undefined ? String(cellVal) : '';
        if (valStr.length + 3 > colWidths[cIdx]) {
          colWidths[cIdx] = Math.min(Math.max(colWidths[cIdx], valStr.length + 3), 45);
        }
        const cellRef = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
        if (!ws[cellRef]) ws[cellRef] = { t: 's', v: valStr };

        if (isHeader) {
          ws[cellRef].s = createHeaderStyle(headerColor);
        } else if (getCellCustomStyle) {
          const customStyle = getCellCustomStyle(rIdx, cIdx, cellVal, row);
          ws[cellRef].s = customStyle || createDataStyle(rIdx % 2 === 0, cIdx === 0 ? 'center' : 'left');
        } else {
          ws[cellRef].s = createDataStyle(rIdx % 2 === 0, cIdx === 0 ? 'center' : 'left');
        }
      });
    });

    ws['!cols'] = colWidths.map(w => ({ wch: w }));
    ws['!rows'] = rowHeights;
  }

  // Helper: Kategori Indikator Keanggotaan Paskas
  const currentYear = new Date().getFullYear();
  function getPaskasCategory(item) {
    let joinYear = null;
    if (item.join_year) {
      const p = parseInt(item.join_year, 10);
      if (!isNaN(p) && p > 1900 && p <= currentYear + 1) joinYear = p;
    }
    if (!joinYear && item.created_at) {
      const cYear = new Date(item.created_at).getFullYear();
      if (!isNaN(cYear)) joinYear = cYear;
    }
    if (!joinYear) joinYear = currentYear;

    const diff = Math.max(0, currentYear - joinYear);
    if (diff < 1) {
      return {
        level: 'PASKAS Baru',
        desc: '< 1 Tahun',
        years: diff,
        joinYear: joinYear,
        badgeColor: '0369A1', // Sky/Cyan Blue
        bgColor: 'E0F2FE'     // Light Soft Blue
      };
    } else if (diff < 5) {
      return {
        level: 'PASKAS Madya',
        desc: `${diff} Tahun`,
        years: diff,
        joinYear: joinYear,
        badgeColor: 'B45309', // Amber Gold
        bgColor: 'FEF3C7'     // Light Soft Amber
      };
    } else {
      return {
        level: 'PASKAS Senior',
        desc: `${diff} Tahun`,
        years: diff,
        joinYear: joinYear,
        badgeColor: '15803D', // Emerald Green
        bgColor: 'DCFCE7'     // Light Soft Green
      };
    }
  }

  // ===================================================================
  // 1. HALAMAN PERTAMA: REKAP KESELURUHAN
  // ===================================================================
  const s1Headers = [
    'No', 'Kode Tiket', 'Tipe Registrasi', 'Nama Kelompok', 'Koordinator Kelompok', 
    'Nama Peserta', 'Usia', 'Kategori Usia', 'Tahun Bergabung', 'Indikator Keanggotaan', 
    'Orang Tua / Wali', 'Gedung / Asrama', 'Kamar / Tenda', 'Jenis Kelamin', 'Wilayah', 
    'Daerah', 'Email', 'No WhatsApp', 'No HP Darurat', 'Tgl Kedatangan', 'Jam Kedatangan', 
    'Transport Berangkat', 'Tgl Kepulangan', 'Jam Kepulangan', 'Transport Pulang', 
    'Ukuran Baju', 'Riwayat Medis', 'Catatan'
  ];
  const s1Rows = [s1Headers];
  sourceData.forEach((item, idx) => {
    const cat = getPaskasCategory(item);
    s1Rows.push([
      idx + 1,
      sanitizeSpreadsheetValue(item.registration_code),
      sanitizeSpreadsheetValue(item.registration_type),
      sanitizeSpreadsheetValue(item.group_name || '-'),
      sanitizeSpreadsheetValue(item.group_leader_name || '-'),
      sanitizeSpreadsheetValue(item.full_name),
      item.age ? `${item.age} Th` : '-',
      (item.is_child || (item.age && item.age < 15)) ? 'Anak-anak (<15)' : (item.age ? 'Dewasa' : '-'),
      cat.joinYear || '-',
      cat.level,
      sanitizeSpreadsheetValue(item.guardian_name || '-'),
      sanitizeSpreadsheetValue(item.building || '-'),
      sanitizeSpreadsheetValue(item.room_name ? `${item.room_name} (No. ${item.room_number || '-'})` : (item.room_number || '-')),
      sanitizeSpreadsheetValue(item.gender),
      sanitizeSpreadsheetValue(item.wilayah),
      sanitizeSpreadsheetValue(item.daerah || '-'),
      sanitizeSpreadsheetValue(item.email || '-'),
      sanitizeSpreadsheetValue(item.phone_number || '-'),
      sanitizeSpreadsheetValue(item.emergency_phone || '-'),
      sanitizeSpreadsheetValue(item.arrival_date),
      sanitizeSpreadsheetValue(item.arrival_time),
      sanitizeSpreadsheetValue(item.transport_arrival),
      sanitizeSpreadsheetValue(item.departure_date),
      sanitizeSpreadsheetValue(item.departure_time),
      sanitizeSpreadsheetValue(item.transport_departure),
      sanitizeSpreadsheetValue(item.cloth_size),
      sanitizeSpreadsheetValue(item.medical_history || 'Tidak Ada'),
      sanitizeSpreadsheetValue(item.notes || '-')
    ]);
  });
  const ws1 = XLSX.utils.aoa_to_sheet(s1Rows);
  formatSheet(ws1, s1Rows, [0], '165B33', (rIdx, cIdx, val, row) => {
    if (cIdx === 9) { // Indikator Keanggotaan
      const catVal = row[9];
      if (catVal === 'PASKAS Senior') return createDataStyle(rIdx % 2 === 0, 'center', 'DCFCE7', '15803D', true);
      if (catVal === 'PASKAS Madya') return createDataStyle(rIdx % 2 === 0, 'center', 'FEF3C7', 'B45309', true);
      if (catVal === 'PASKAS Baru') return createDataStyle(rIdx % 2 === 0, 'center', 'E0F2FE', '0369A1', true);
    }
    if (cIdx === 8) return createDataStyle(rIdx % 2 === 0, 'center');
    return null;
  });
  XLSX.utils.book_append_sheet(workbook, ws1, 'Rekap Keseluruhan');

  // ===================================================================
  // 2. HALAMAN KEDUA: KEDATANGAN & TRANSPORTASI (DIURUTKAN DARI TERBANYAK)
  // ===================================================================
  const arrivalCounts = {};
  sourceData.forEach(i => {
    const m = (i.transport_arrival || 'Belum Ditentukan').trim();
    arrivalCounts[m] = (arrivalCounts[m] || 0) + 1;
  });

  const sortedArrival = [...sourceData].sort((a, b) => {
    const cA = arrivalCounts[(a.transport_arrival || 'Belum Ditentukan').trim()] || 0;
    const cB = arrivalCounts[(b.transport_arrival || 'Belum Ditentukan').trim()] || 0;
    if (cB !== cA) return cB - cA; // Terbanyak ke tersedikit
    const tCmp = (a.transport_arrival || '').localeCompare(b.transport_arrival || '');
    if (tCmp !== 0) return tCmp;
    const dCmp = (a.arrival_date || '').localeCompare(b.arrival_date || '');
    if (dCmp !== 0) return dCmp;
    const timeCmp = (a.arrival_time || '').localeCompare(b.arrival_time || '');
    if (timeCmp !== 0) return timeCmp;
    return (a.full_name || '').localeCompare(b.full_name || '');
  });

  const s2Headers = [
    'No', 'Moda Transportasi', 'Tgl Kedatangan', 'Jam Kedatangan', 'Nama Peserta', 
    'Jenis Kelamin', 'Wilayah', 'Daerah', 'No WhatsApp', 'Gedung / Kamar', 'Catatan Kedatangan'
  ];
  const s2Rows = [s2Headers];
  sortedArrival.forEach((item, idx) => {
    const roomInfo = item.building 
      ? `${item.building} - ${item.room_name || item.room_number || '-'}` 
      : (item.room_name || item.room_number || '-');
    s2Rows.push([
      idx + 1,
      sanitizeSpreadsheetValue(item.transport_arrival || 'Belum Ditentukan'),
      sanitizeSpreadsheetValue(item.arrival_date || '-'),
      sanitizeSpreadsheetValue(item.arrival_time || '-'),
      sanitizeSpreadsheetValue(item.full_name),
      sanitizeSpreadsheetValue(item.gender),
      sanitizeSpreadsheetValue(item.wilayah),
      sanitizeSpreadsheetValue(item.daerah || '-'),
      sanitizeSpreadsheetValue(item.phone_number || '-'),
      sanitizeSpreadsheetValue(roomInfo),
      sanitizeSpreadsheetValue(item.notes || '-')
    ]);
  });
  const ws2 = XLSX.utils.aoa_to_sheet(s2Rows);
  formatSheet(ws2, s2Rows, [0], '1D4ED8', (rIdx, cIdx) => {
    if (cIdx === 1) { // Kolom Moda Transportasi bold & center
      return createDataStyle(rIdx % 2 === 0, 'center', null, '1D4ED8', true);
    }
    if (cIdx === 2 || cIdx === 3) {
      return createDataStyle(rIdx % 2 === 0, 'center');
    }
    return null;
  });
  XLSX.utils.book_append_sheet(workbook, ws2, 'Kedatangan & Transport');

  // ===================================================================
  // 3. HALAMAN KETIGA: JENIS KELAMIN (IKHWAN & AKHWAT DIPISAH)
  // ===================================================================
  const ikhwanList = sourceData.filter(i => /laki|ikhwan|^l$/i.test(String(i.gender || '')));
  const akhwatList = sourceData.filter(i => /perempuan|akhwat|^p$/i.test(String(i.gender || '')));

  // Urutkan alfabetis nama
  ikhwanList.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
  akhwatList.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));

  const s3Headers = [
    'No', 'Kode Tiket', 'Nama Peserta', 'Jenis Kelamin', 'Usia', 
    'Kategori Usia', 'Gedung / Asrama', 'Kamar / Tenda', 'Wilayah', 'Daerah', 
    'No WhatsApp', 'Orang Tua / Wali', 'Catatan'
  ];
  const s3Rows = [];

  // Seksi 1: Ikhwan
  const rIkhwanTitleIdx = s3Rows.length;
  s3Rows.push([`DATA PESERTA IKHWAN (LAKI-LAKI) - TOTAL: ${ikhwanList.length} PESERTA`, '', '', '', '', '', '', '', '', '', '', '', '']);
  const rIkhwanHeaderIdx = s3Rows.length;
  s3Rows.push([...s3Headers]);
  ikhwanList.forEach((item, idx) => {
    s3Rows.push([
      idx + 1,
      sanitizeSpreadsheetValue(item.registration_code),
      sanitizeSpreadsheetValue(item.full_name),
      sanitizeSpreadsheetValue(item.gender),
      item.age ? `${item.age} Th` : '-',
      (item.is_child || (item.age && item.age < 15)) ? 'Anak-anak (<15)' : (item.age ? 'Dewasa' : '-'),
      sanitizeSpreadsheetValue(item.building || '-'),
      sanitizeSpreadsheetValue(item.room_name ? `${item.room_name} (No. ${item.room_number || '-'})` : (item.room_number || '-')),
      sanitizeSpreadsheetValue(item.wilayah),
      sanitizeSpreadsheetValue(item.daerah || '-'),
      sanitizeSpreadsheetValue(item.phone_number || '-'),
      sanitizeSpreadsheetValue(item.guardian_name || '-'),
      sanitizeSpreadsheetValue(item.notes || '-')
    ]);
  });

  // Jeda baris pemisah antar seksi
  s3Rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '']);

  // Seksi 2: Akhwat
  const rAkhwatTitleIdx = s3Rows.length;
  s3Rows.push([`DATA PESERTA AKHWAT (PEREMPUAN) - TOTAL: ${akhwatList.length} PESERTA`, '', '', '', '', '', '', '', '', '', '', '', '']);
  const rAkhwatHeaderIdx = s3Rows.length;
  s3Rows.push([...s3Headers]);
  akhwatList.forEach((item, idx) => {
    s3Rows.push([
      idx + 1,
      sanitizeSpreadsheetValue(item.registration_code),
      sanitizeSpreadsheetValue(item.full_name),
      sanitizeSpreadsheetValue(item.gender),
      item.age ? `${item.age} Th` : '-',
      (item.is_child || (item.age && item.age < 15)) ? 'Anak-anak (<15)' : (item.age ? 'Dewasa' : '-'),
      sanitizeSpreadsheetValue(item.building || '-'),
      sanitizeSpreadsheetValue(item.room_name ? `${item.room_name} (No. ${item.room_number || '-'})` : (item.room_number || '-')),
      sanitizeSpreadsheetValue(item.wilayah),
      sanitizeSpreadsheetValue(item.daerah || '-'),
      sanitizeSpreadsheetValue(item.phone_number || '-'),
      sanitizeSpreadsheetValue(item.guardian_name || '-'),
      sanitizeSpreadsheetValue(item.notes || '-')
    ]);
  });

  const ws3 = XLSX.utils.aoa_to_sheet(s3Rows);
  ws3['!merges'] = [
    { s: { r: rIkhwanTitleIdx, c: 0 }, e: { r: rIkhwanTitleIdx, c: s3Headers.length - 1 } },
    { s: { r: rAkhwatTitleIdx, c: 0 }, e: { r: rAkhwatTitleIdx, c: s3Headers.length - 1 } }
  ];

  formatSheet(ws3, s3Rows, [rIkhwanHeaderIdx, rAkhwatHeaderIdx], '1E40AF', (rIdx, cIdx) => {
    if (rIdx === rIkhwanTitleIdx) {
      return {
        fill: { fgColor: { rgb: '1E3A8A' } },
        font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
        alignment: { horizontal: 'left', vertical: 'center', indent: 1 }
      };
    }
    if (rIdx === rAkhwatTitleIdx) {
      return {
        fill: { fgColor: { rgb: '831843' } },
        font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
        alignment: { horizontal: 'left', vertical: 'center', indent: 1 }
      };
    }
    if (rIdx === rAkhwatHeaderIdx) {
      return createHeaderStyle('9D174D');
    }
    return null;
  });
  XLSX.utils.book_append_sheet(workbook, ws3, 'Ikhwan & Akhwat');

  // ===================================================================
  // 4. HALAMAN KEEMPAT: REKAP BAJU (DIURUTKAN PER UKURAN)
  // ===================================================================
  const sizeOrder = ['ANAK', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', 'XXXL', '3XL', '4XL', '5XL'];
  function getSizeRank(s) {
    if (!s) return 999;
    const clean = String(s).toUpperCase().trim();
    const idx = sizeOrder.findIndex(o => clean === o || clean.includes(o));
    return idx >= 0 ? idx : 500;
  }

  const sortedBaju = [...sourceData].sort((a, b) => {
    const rA = getSizeRank(a.cloth_size);
    const rB = getSizeRank(b.cloth_size);
    if (rA !== rB) return rA - rB;
    const gCmp = (a.gender || '').localeCompare(b.gender || '');
    if (gCmp !== 0) return gCmp;
    return (a.full_name || '').localeCompare(b.full_name || '');
  });

  const s4Headers = [
    'No', 'Ukuran Baju', 'Nama Peserta', 'Jenis Kelamin', 'Usia', 
    'Kategori Usia', 'Wilayah', 'Daerah', 'No WhatsApp', 'Gedung / Kamar', 'Catatan'
  ];
  const s4Rows = [s4Headers];
  sortedBaju.forEach((item, idx) => {
    const roomInfo = item.building 
      ? `${item.building} - ${item.room_name || item.room_number || '-'}` 
      : (item.room_name || item.room_number || '-');
    s4Rows.push([
      idx + 1,
      sanitizeSpreadsheetValue(item.cloth_size || '-'),
      sanitizeSpreadsheetValue(item.full_name),
      sanitizeSpreadsheetValue(item.gender),
      item.age ? `${item.age} Th` : '-',
      (item.is_child || (item.age && item.age < 15)) ? 'Anak-anak (<15)' : (item.age ? 'Dewasa' : '-'),
      sanitizeSpreadsheetValue(item.wilayah),
      sanitizeSpreadsheetValue(item.daerah || '-'),
      sanitizeSpreadsheetValue(item.phone_number || '-'),
      sanitizeSpreadsheetValue(roomInfo),
      sanitizeSpreadsheetValue(item.notes || '-')
    ]);
  });
  const ws4 = XLSX.utils.aoa_to_sheet(s4Rows);
  formatSheet(ws4, s4Rows, [0], 'B45309', (rIdx, cIdx) => {
    if (cIdx === 1) { // Ukuran baju diberi warna font & rata tengah
      return createDataStyle(rIdx % 2 === 0, 'center', null, 'B45309', true);
    }
    return null;
  });
  XLSX.utils.book_append_sheet(workbook, ws4, 'Rekap Baju');

  // ===================================================================
  // 5. HALAMAN KELIMA: KEPULANGAN & TRANSPORTASI (DIURUTKAN DARI TERBANYAK)
  // ===================================================================
  const departureCounts = {};
  sourceData.forEach(i => {
    const m = (i.transport_departure || 'Belum Ditentukan').trim();
    departureCounts[m] = (departureCounts[m] || 0) + 1;
  });

  const sortedDeparture = [...sourceData].sort((a, b) => {
    const cA = departureCounts[(a.transport_departure || 'Belum Ditentukan').trim()] || 0;
    const cB = departureCounts[(b.transport_departure || 'Belum Ditentukan').trim()] || 0;
    if (cB !== cA) return cB - cA; // Terbanyak ke tersedikit
    const tCmp = (a.transport_departure || '').localeCompare(b.transport_departure || '');
    if (tCmp !== 0) return tCmp;
    const dCmp = (a.departure_date || '').localeCompare(b.departure_date || '');
    if (dCmp !== 0) return dCmp;
    const timeCmp = (a.departure_time || '').localeCompare(b.departure_time || '');
    if (timeCmp !== 0) return timeCmp;
    return (a.full_name || '').localeCompare(b.full_name || '');
  });

  const s5Headers = [
    'No', 'Moda Transportasi Pulang', 'Tgl Kepulangan', 'Jam Kepulangan', 'Nama Peserta', 
    'Jenis Kelamin', 'Wilayah', 'Daerah', 'No WhatsApp', 'Gedung / Kamar', 'Catatan Kepulangan'
  ];
  const s5Rows = [s5Headers];
  sortedDeparture.forEach((item, idx) => {
    const roomInfo = item.building 
      ? `${item.building} - ${item.room_name || item.room_number || '-'}` 
      : (item.room_name || item.room_number || '-');
    s5Rows.push([
      idx + 1,
      sanitizeSpreadsheetValue(item.transport_departure || 'Belum Ditentukan'),
      sanitizeSpreadsheetValue(item.departure_date || '-'),
      sanitizeSpreadsheetValue(item.departure_time || '-'),
      sanitizeSpreadsheetValue(item.full_name),
      sanitizeSpreadsheetValue(item.gender),
      sanitizeSpreadsheetValue(item.wilayah),
      sanitizeSpreadsheetValue(item.daerah || '-'),
      sanitizeSpreadsheetValue(item.phone_number || '-'),
      sanitizeSpreadsheetValue(roomInfo),
      sanitizeSpreadsheetValue(item.notes || '-')
    ]);
  });
  const ws5 = XLSX.utils.aoa_to_sheet(s5Rows);
  formatSheet(ws5, s5Rows, [0], '4338CA', (rIdx, cIdx) => {
    if (cIdx === 1) { // Kolom Moda Transportasi Pulang bold & center
      return createDataStyle(rIdx % 2 === 0, 'center', null, '4338CA', true);
    }
    if (cIdx === 2 || cIdx === 3) {
      return createDataStyle(rIdx % 2 === 0, 'center');
    }
    return null;
  });
  XLSX.utils.book_append_sheet(workbook, ws5, 'Kepulangan & Transport');

  // ===================================================================
  // 6. HALAMAN KEENAM: REKAP KESEHATAN (DIUTAMAKAN RIWAYAT MEDIS)
  // ===================================================================
  function hasMedicalIssue(item) {
    if (!item || !item.medical_history) return false;
    const str = String(item.medical_history).trim().toLowerCase();
    if (!str || str === '-' || str === 'none' || str === 'nihil' || str === 'null') return false;
    if (str.includes('tidak ada') || str.includes('sehat') || str.includes('normal') || str.includes('prima') || str.includes('baik')) {
      return false;
    }
    return true;
  }

  const sortedHealth = [...sourceData].sort((a, b) => {
    const hA = hasMedicalIssue(a) ? 1 : 0;
    const hB = hasMedicalIssue(b) ? 1 : 0;
    if (hB !== hA) return hB - hA; // Yang memiliki riwayat medis berada paling atas
    return (a.full_name || '').localeCompare(b.full_name || '');
  });

  const s6Headers = [
    'No', 'Status Kesehatan', 'Riwayat Medis / Sakit', 'Nama Peserta', 'Usia', 
    'Jenis Kelamin', 'Gedung / Asrama', 'Kamar / Tenda', 'No WhatsApp', 'No HP Darurat', 'Catatan Medis'
  ];
  const s6Rows = [s6Headers];
  sortedHealth.forEach((item, idx) => {
    const isIssue = hasMedicalIssue(item);
    s6Rows.push([
      idx + 1,
      isIssue ? '⚠️ PERHATIAN MEDIS' : '✅ Normal',
      sanitizeSpreadsheetValue(item.medical_history || 'Tidak Ada'),
      sanitizeSpreadsheetValue(item.full_name),
      item.age ? `${item.age} Th` : '-',
      sanitizeSpreadsheetValue(item.gender),
      sanitizeSpreadsheetValue(item.building || '-'),
      sanitizeSpreadsheetValue(item.room_name ? `${item.room_name} (No. ${item.room_number || '-'})` : (item.room_number || '-')),
      sanitizeSpreadsheetValue(item.phone_number || '-'),
      sanitizeSpreadsheetValue(item.emergency_phone || '-'),
      sanitizeSpreadsheetValue(item.notes || '-')
    ]);
  });
  const ws6 = XLSX.utils.aoa_to_sheet(s6Rows);
  formatSheet(ws6, s6Rows, [0], '991B1B', (rIdx, cIdx, val, row) => {
    const statusVal = row[1];
    if (statusVal === '⚠️ PERHATIAN MEDIS') {
      return {
        fill: { fgColor: { rgb: rIdx % 2 === 0 ? 'FEE2E2' : 'FECACA' } },
        font: { name: 'Calibri', sz: 10, bold: (cIdx === 1 || cIdx === 2), color: { rgb: '991B1B' } },
        alignment: { horizontal: (cIdx === 0 || cIdx === 1) ? 'center' : 'left', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { rgb: 'FCA5A5' } },
          bottom: { style: 'thin', color: { rgb: 'FCA5A5' } },
          left: { style: 'thin', color: { rgb: 'FCA5A5' } },
          right: { style: 'thin', color: { rgb: 'FCA5A5' } }
        }
      };
    }
    return null;
  });
  XLSX.utils.book_append_sheet(workbook, ws6, 'Rekap Kesehatan');

  // ===================================================================
  // 7. HALAMAN KETUJUH: REKAPITULASI WILAYAH & INDIKATOR KEANGGOTAAN
  // ===================================================================
  const wilayahMap = new Map();
  sourceData.forEach(item => {
    const w = (item.wilayah || 'Belum Ditentukan').trim();
    if (!wilayahMap.has(w)) wilayahMap.set(w, []);
    wilayahMap.get(w).push(item);
  });

  // Urutkan wilayah berdasarkan total peserta terbanyak
  const sortedWilayahList = Array.from(wilayahMap.entries()).sort((a, b) => b[1].length - a[1].length);

  const s7Rows = [];
  const s7HeaderIndexes = [];
  const s7BannerIndexes = [];
  const s7Merges = [];

  // BAGIAN 1: RINGKASAN REKAPITULASI WILAYAH
  const rSumTitleIdx = s7Rows.length;
  s7Rows.push(['RINGKASAN REKAPITULASI PESERTA PASKAS PER WILAYAH', '', '', '', '', '']);
  s7BannerIndexes.push({ rIdx: rSumTitleIdx, color: '0F766E' });
  s7Merges.push({ s: { r: rSumTitleIdx, c: 0 }, e: { r: rSumTitleIdx, c: 5 } });

  const rSumHeadIdx = s7Rows.length;
  s7Rows.push(['No', 'Nama Wilayah', 'Total Peserta', 'PASKAS Baru (< 1 Th)', 'PASKAS Madya (1-4 Th)', 'PASKAS Senior (≥ 5 Th)']);
  s7HeaderIndexes.push(rSumHeadIdx);

  let grandTotal = 0, grandBaru = 0, grandMadya = 0, grandSenior = 0;
  sortedWilayahList.forEach(([wName, wItems], idx) => {
    let cBaru = 0, cMadya = 0, cSenior = 0;
    wItems.forEach(i => {
      const cat = getPaskasCategory(i);
      if (cat.level === 'PASKAS Baru') cBaru++;
      else if (cat.level === 'PASKAS Madya') cMadya++;
      else cSenior++;
    });
    grandTotal += wItems.length;
    grandBaru += cBaru;
    grandMadya += cMadya;
    grandSenior += cSenior;

    s7Rows.push([idx + 1, wName, wItems.length, cBaru, cMadya, cSenior]);
  });

  // Baris Total Ringkasan
  const rTotalIdx = s7Rows.length;
  s7Rows.push(['TOTAL KESELURUHAN', '', grandTotal, grandBaru, grandMadya, grandSenior]);
  s7Merges.push({ s: { r: rTotalIdx, c: 0 }, e: { r: rTotalIdx, c: 1 } });

  // Jeda baris pemisah antar tabel
  s7Rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '']);
  s7Rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '']);

  // BAGIAN 2: RINCIAN PESERTA PER WILAYAH
  const detailWilayahHeaders = [
    'No', 'Indikator Keanggotaan', 'Tahun Bergabung', 'Masa Keanggotaan', 
    'Nama Peserta', 'Daerah / Kota', 'Jenis Kelamin', 'Usia', 
    'Kategori Usia', 'Tipe Registrasi', 'Nama Kelompok', 'No WhatsApp', 'Gedung / Kamar'
  ];

  sortedWilayahList.forEach(([wName, wItems]) => {
    // Urutkan data peserta dalam wilayah ini:
    // 1. Daerah (kota/kabupaten)
    // 2. Masa keanggotaan (Senior -> Madya -> Baru)
    // 3. Nama peserta
    const sortedItems = [...wItems].sort((a, b) => {
      const dCmp = (a.daerah || '').localeCompare(b.daerah || '');
      if (dCmp !== 0) return dCmp;
      const catA = getPaskasCategory(a);
      const catB = getPaskasCategory(b);
      if (catB.years !== catA.years) return catB.years - catA.years; // Senior di atas
      return (a.full_name || '').localeCompare(b.full_name || '');
    });

    let wBaru = 0, wMadya = 0, wSenior = 0;
    sortedItems.forEach(i => {
      const c = getPaskasCategory(i);
      if (c.level === 'PASKAS Baru') wBaru++;
      else if (c.level === 'PASKAS Madya') wMadya++;
      else wSenior++;
    });

    const rBannerIdx = s7Rows.length;
    s7Rows.push([
      `WILAYAH: ${wName.toUpperCase()} — TOTAL: ${sortedItems.length} PESERTA (Baru: ${wBaru} | Madya: ${wMadya} | Senior: ${wSenior})`,
      '', '', '', '', '', '', '', '', '', '', '', ''
    ]);
    s7BannerIndexes.push({ rIdx: rBannerIdx, color: '0F766E' });
    s7Merges.push({ s: { r: rBannerIdx, c: 0 }, e: { r: rBannerIdx, c: detailWilayahHeaders.length - 1 } });

    const rHeadIdx = s7Rows.length;
    s7Rows.push([...detailWilayahHeaders]);
    s7HeaderIndexes.push(rHeadIdx);

    sortedItems.forEach((item, idx) => {
      const cat = getPaskasCategory(item);
      const roomInfo = item.building 
        ? `${item.building} - ${item.room_name || item.room_number || '-'}` 
        : (item.room_name || item.room_number || '-');
      s7Rows.push([
        idx + 1,
        cat.level,
        cat.joinYear,
        cat.desc,
        sanitizeSpreadsheetValue(item.full_name),
        sanitizeSpreadsheetValue(item.daerah || '-'),
        sanitizeSpreadsheetValue(item.gender),
        item.age ? `${item.age} Th` : '-',
        (item.is_child || (item.age && item.age < 15)) ? 'Anak-anak (<15)' : (item.age ? 'Dewasa' : '-'),
        sanitizeSpreadsheetValue(item.registration_type),
        sanitizeSpreadsheetValue(item.group_name || '-'),
        sanitizeSpreadsheetValue(item.phone_number || '-'),
        sanitizeSpreadsheetValue(roomInfo)
      ]);
    });

    // Jeda 1 baris setelah tiap wilayah
    s7Rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '']);
  });

  const ws7 = XLSX.utils.aoa_to_sheet(s7Rows);
  ws7['!merges'] = s7Merges;

  formatSheet(ws7, s7Rows, s7HeaderIndexes, '115E59', (rIdx, cIdx, val, row) => {
    // Styling Banner Judul / Wilayah
    const banner = s7BannerIndexes.find(b => b.rIdx === rIdx);
    if (banner) {
      return {
        fill: { fgColor: { rgb: banner.color } },
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
        alignment: { horizontal: 'left', vertical: 'center', indent: 1 }
      };
    }

    // Baris Total Ringkasan
    if (rIdx === rTotalIdx) {
      return {
        fill: { fgColor: { rgb: 'CCFBF1' } },
        font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F766E' } },
        alignment: { horizontal: (cIdx === 0 || cIdx === 1) ? 'left' : 'center', vertical: 'center' },
        border: {
          top: { style: 'medium', color: { rgb: '0F766E' } },
          bottom: { style: 'double', color: { rgb: '0F766E' } },
          left: { style: 'thin', color: { rgb: 'D1D5DB' } },
          right: { style: 'thin', color: { rgb: 'D1D5DB' } }
        }
      };
    }

    // Styling Indikator Keanggotaan pada tabel detail (kolom indeks 1)
    if (cIdx === 1) {
      const catVal = row[1];
      if (catVal === 'PASKAS Senior') return createDataStyle(rIdx % 2 === 0, 'center', 'DCFCE7', '15803D', true);
      if (catVal === 'PASKAS Madya') return createDataStyle(rIdx % 2 === 0, 'center', 'FEF3C7', 'B45309', true);
      if (catVal === 'PASKAS Baru') return createDataStyle(rIdx % 2 === 0, 'center', 'E0F2FE', '0369A1', true);
    }

    // Rata tengah untuk kolom Tahun, Masa, Gender, Usia
    if (cIdx === 2 || cIdx === 3 || cIdx === 6 || cIdx === 7) {
      return createDataStyle(rIdx % 2 === 0, 'center');
    }

    return null;
  });
  XLSX.utils.book_append_sheet(workbook, ws7, 'Rekapitulasi Wilayah');

  // ===================================================================
  // UNDUH FILE WORKBOOK EXCEL LENGKAP 7 HALAMAN
  // ===================================================================
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Rekap_Peserta_Paskas_Bahagia_${dateStr}.xlsx`);
  showToast('File Excel 7 halaman (termasuk Rekapitulasi Wilayah) berhasil diunduh!', 'success');
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
function initSettingsPage(defaultTab = 'rekap', skipSwitchTab = false) {
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

  // Form Pengaturan Papan Informasi & Warta Pengumuman Dashboard
  const annEnabled = document.getElementById('cfg_announcementEnabled');
  const annLabel = document.getElementById('cfg_announcementStatusLabel');
  const isAnnOn = settings.announcement_enabled !== 'false' && settings.announcement_enabled !== false && settings.announcement_enabled !== undefined;
  if (annEnabled) annEnabled.checked = isAnnOn;
  if (annLabel) annLabel.textContent = isAnnOn ? 'Aktif' : 'Nonaktif';
  try {
    setNowAnnouncementDate();
    renderSettingsAnnouncementsList();
  } catch (e) {}

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

  if (!skipSwitchTab) {
    const cleanTab = (defaultTab || 'rekap').replace('tab-', '');
    switchSettingsTab(cleanTab);
  }
}

// ===================================================================
// ADMIN AUTHENTICATION & PASSWORD PROTECTION FOR SETTINGS
// ===================================================================
let isAdminLoggedIn = false;
let pendingAuthTargetTab = 'rekap';

// Hash bawaan untuk kata sandi default 'admin123' (SHA-256)
const DEFAULT_ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

/**
 * Utilitas enkripsi SHA-256 menggunakan Web Crypto API asli browser
 */
async function hashSHA256(text) {
  if (!text) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Crypto subtle SHA-256 error:', err);
    return text;
  }
}

function getStoredAdminPasswordHash() {
  return localStorage.getItem('paskas_admin_password') || DEFAULT_ADMIN_PASSWORD_HASH;
}

/**
 * Verifikasi kata sandi admin dengan aman:
 * Membandingkan SHA-256 hash input dengan hash tersimpan.
 * Mendukung migrasi otomatis dari teks biasa lama ke SHA-256 jika ada.
 */
async function verifyAdminPassword(entered) {
  if (!entered) return false;
  const stored = getStoredAdminPasswordHash();
  const enteredHash = await hashSHA256(entered);

  // 1. Pencocokan langsung SHA-256 (Standar Utama yang Aman)
  if (enteredHash.toLowerCase() === stored.toLowerCase()) {
    return true;
  }

  // 2. Backward compatibility & Auto-migration: Jika data lama di localStorage/Supabase masih plaintext
  if (stored === entered || stored === 'admin123') {
    // Migrasikan otomatis ke hash SHA-256
    localStorage.setItem('paskas_admin_password', enteredHash);
    if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
      window.dataService.saveCloudSetting('paskas_admin_password', enteredHash);
    }
    return true;
  }

  return false;
}

// ===================================================================
// PROTEKSI BRUTE FORCE LOGIN ADMIN (Maks 5x salah, Kunci 60 detik)
// ===================================================================
const ADMIN_MAX_ATTEMPTS = 5;
const ADMIN_LOCKOUT_MS = 60 * 1000;

function getAdminLockoutRemaining() {
  const lockoutUntil = parseInt(sessionStorage.getItem('paskas_admin_lockout_until') || '0', 10);
  const now = Date.now();
  if (now < lockoutUntil) {
    return Math.ceil((lockoutUntil - now) / 1000);
  }
  return 0;
}

function getAdminFailedAttempts() {
  return parseInt(sessionStorage.getItem('paskas_admin_failed_attempts') || '0', 10);
}

function recordAdminFailedAttempt() {
  const current = getAdminFailedAttempts() + 1;
  sessionStorage.setItem('paskas_admin_failed_attempts', String(current));
  if (current >= ADMIN_MAX_ATTEMPTS) {
    sessionStorage.setItem('paskas_admin_lockout_until', String(Date.now() + ADMIN_LOCKOUT_MS));
  }
  return current;
}

function resetAdminFailedAttempts() {
  sessionStorage.removeItem('paskas_admin_failed_attempts');
  sessionStorage.removeItem('paskas_admin_lockout_until');
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

  const remainingLock = getAdminLockoutRemaining();
  if (remainingLock > 0) {
    if (errEl) {
      errEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Akses dikunci sementara karena 5x salah. Tunggu <strong>${remainingLock} detik</strong>.`;
      errEl.style.display = 'flex';
    }
  } else {
    if (errEl) errEl.style.display = 'none';
  }

  if (card) card.classList.remove('shake-animation');
  if (input) {
    input.value = '';
    input.type = 'password';
  }
  if (modal) modal.classList.add('active');

  setTimeout(() => {
    if (input && remainingLock === 0) input.focus();
  }, 120);
}

function closeAdminAuthModal() {
  const modal = document.getElementById('adminAuthModal');
  if (modal) modal.classList.remove('active');
}

async function submitAdminPassword() {
  const remainingLock = getAdminLockoutRemaining();
  const input = document.getElementById('adminPasswordInput');
  const errEl = document.getElementById('adminAuthError');
  const card = document.querySelector('#adminAuthModal .modal-auth-green-card, #adminAuthModal .modal-auth-sleek-card, #adminAuthModal .modal-auth-card');

  if (remainingLock > 0) {
    if (errEl) {
      errEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Terlalu banyak percobaan gagal. Mohon tunggu <strong>${remainingLock} detik</strong>.`;
      errEl.style.display = 'flex';
    }
    showToast(`Akses admin dikunci sementara. Mohon tunggu ${remainingLock} detik.`, 'warning');
    return;
  }

  const entered = (input?.value || '').trim();
  const isValid = await verifyAdminPassword(entered);

  if (isValid) {
    resetAdminFailedAttempts();
    isAdminLoggedIn = true;
    if (typeof resetAdminInactivityTimer === 'function') resetAdminInactivityTimer();
    closeAdminAuthModal();
    navigateTo('settings');
    const cleanTab = (pendingAuthTargetTab || 'rekap').replace('tab-', '');
    switchSettingsTab(cleanTab);
    showToast('Akses administrator berhasil diverifikasi!', 'success');
  } else {
    const failedCount = recordAdminFailedAttempt();
    const remaining = ADMIN_MAX_ATTEMPTS - failedCount;

    if (errEl) {
      if (failedCount >= ADMIN_MAX_ATTEMPTS) {
        errEl.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Batas 5x percobaan terlampaui. Akses dikunci selama <strong>60 detik</strong>.`;
      } else {
        errEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Kata sandi tidak sesuai. Sisa kesempatan: <strong>${remaining} kali</strong>.`;
      }
      errEl.style.display = 'flex';
    }

    if (card) {
      card.classList.remove('shake-animation');
      void card.offsetWidth; // force reflow
      card.classList.add('shake-animation');
    }
    if (input) {
      input.select();
      input.focus();
    }

    if (failedCount >= ADMIN_MAX_ATTEMPTS) {
      showToast('Akses admin terkunci selama 60 detik karena 5x kesalahan kata sandi.', 'error');
    }
  }
}

function lockAdminSession() {
  isAdminLoggedIn = false;
  if (typeof clearAdminInactivityTimer === 'function') clearAdminInactivityTimer();
  navigateTo('dashboard');
  showToast('Sesi administrator telah dikunci.', 'info');
}

async function saveNewAdminPassword() {
  const curInput = document.getElementById('cfg_currentAdminPassword');
  const newInput = document.getElementById('cfg_newAdminPassword');
  const confInput = document.getElementById('cfg_confirmAdminPassword');

  const curVal = (curInput?.value || '').trim();
  const newVal = (newInput?.value || '').trim();
  const confVal = (confInput?.value || '').trim();

  const isCurValid = await verifyAdminPassword(curVal);
  if (!isCurValid) {
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

  const newHash = await hashSHA256(newVal);
  localStorage.setItem('paskas_admin_password', newHash);
  if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
    window.dataService.saveCloudSetting('paskas_admin_password', newHash);
  }
  if (curInput) curInput.value = '';
  if (newInput) newInput.value = '';
  if (confInput) confInput.value = '';

  showToast('Kata sandi admin berhasil diperbarui (terenkripsi aman SHA-256)!', 'success');
}

function resetAdminPasswordDefault() {
  if (confirm('Kembalikan kata sandi admin ke setelan awal bawaan (admin123)?')) {
    localStorage.setItem('paskas_admin_password', DEFAULT_ADMIN_PASSWORD_HASH);
    if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
      window.dataService.saveCloudSetting('paskas_admin_password', DEFAULT_ADMIN_PASSWORD_HASH);
    }
    const curInput = document.getElementById('cfg_currentAdminPassword');
    const newInput = document.getElementById('cfg_newAdminPassword');
    const confInput = document.getElementById('cfg_confirmAdminPassword');
    if (curInput) curInput.value = '';
    if (newInput) newInput.value = '';
    if (confInput) confInput.value = '';
    showToast('Kata sandi admin dikembalikan ke bawaan: admin123 (terenkripsi SHA-256)', 'info');
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
  tampilan: ['rekap', 'info', 'deadline', 'reg-content', 'wilayah', 'ticket-template', 'kamar-kelompok', 'pengumuman'],
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
    pillTotal.textContent = `${allRegistrations.length} Jiwa`;
  }
  const pillDb = document.getElementById('magPillDb');
  if (pillDb) {
    const isCloud = window.dataService && typeof window.dataService.isSupabaseConfigured === 'function' && window.dataService.isSupabaseConfigured();
    pillDb.textContent = isCloud ? 'Cloud Supabase' : 'Lokal Aktif';
  }

  // Sinkronisasi highlight nav menu Rekap Data jika tab Rekap aktif
  const navRekapBtn = document.querySelector('.nav-link[data-page="rekap"]');
  if (navRekapBtn) {
    navRekapBtn.classList.toggle('active', tabName === 'rekap');
  }

  if (tabName === 'rekap') {
    updateSummaryMetrics();
    renderRekapTable();
    setTimeout(() => {
      renderCharts();
    }, 60);
    // Refresh otomatis data terbaru dari cloud database / local storage
    if (typeof loadAndRenderRegistrations === 'function') {
      loadAndRenderRegistrations().catch(err => console.warn('Gagal refresh rekap:', err));
    }
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
  if (tabName === 'pengumuman') {
    setNowAnnouncementDate();
    renderSettingsAnnouncementsList();
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

    // 1. Headline Utama Dashboard
    const heroHeadline = document.getElementById('heroMainHeadline');
    if (heroHeadline && settings.event_headline) {
      heroHeadline.innerHTML = formatHeroHeadline(settings.event_headline);
    }

    // 2. Deskripsi Singkat Dashboard
    const heroDesc = document.getElementById('heroEventDesc');
    if (heroDesc && settings.event_desc) {
      heroDesc.textContent = settings.event_desc;
    }

    // 3. Badge Info Acara di Atas Headline Dashboard (Lokasi Ditiadakan)
    const heroBadge = document.getElementById('heroEventBadge');
    if (heroBadge) {
      const name = (settings.event_name || 'Kumpul Keluarga Pasukan Amal Sholeh (Paskas)').trim();
      heroBadge.textContent = name.toUpperCase();
    }

    // 4. Sinkronkan ke Info Lokasi di Halaman Registrasi
    if (settings.event_location) {
      const regLoc = document.getElementById('regLocationDisplay');
      if (regLoc) regLoc.textContent = settings.event_location;
    }
  } catch (err) {
    console.warn('Gagal memperbarui UI info acara:', err);
  }
}

async function saveEventInfoSettings() {
  const headlineInput = document.getElementById('cfg_eventHeadline');
  const headline = headlineInput ? headlineInput.value.trim() : 'PASKAS BAHAGIA';
  const name = document.getElementById('cfg_eventName').value.trim();
  const loc = document.getElementById('cfg_eventLocation').value.trim();
  const desc = document.getElementById('cfg_eventDesc').value.trim();

  await window.dataService.saveSettings({
    event_headline: headline,
    event_name: name,
    event_location: loc,
    event_desc: desc
  });

  if (loc) {
    REGISTRATION_CONTENT.location = loc;
    try {
      localStorage.setItem('paskas_reg_content', JSON.stringify(REGISTRATION_CONTENT));
    } catch (e) { }
    if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
      window.dataService.saveCloudSetting('paskas_reg_content', REGISTRATION_CONTENT).catch(() => { });
    }
    const regLocInput = document.getElementById('cfg_regLocation');
    if (regLocInput) regLocInput.value = loc;
  }

  applyEventInfoToUI({
    event_headline: headline,
    event_name: name,
    event_location: loc,
    event_desc: desc
  });

  showToast('Info acara & headline berhasil disimpan permanen ke Supabase!', 'success');
}

// ===================================================================
// PENGELOLA PAPAN INFORMASI & WARTA PENGUMUMAN DI DASHBOARD (MULTI-ITEM)
// ===================================================================
const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Informasi Penjemputan Peserta & Rute Armada Shuttle',
    date: '20 Oktober 2026, 14:00 WIB',
    category: 'Penjemputan & Transportasi',
    content: 'Ahlan wa Sahlan para kafilah peserta! Panitia menyediakan armada bus penjemputan gratis di Bandara Internasional Yogyakarta (YIA) dan Stasiun Tugu / Lempuyangan. Mohon kafilah mengonfirmasi jadwal kedatangan kepada narahubung divisi transportasi.',
    is_pinned: true
  },
  {
    id: 'ann-2',
    title: 'Pembagian Kamar & Ketentuan Pengambilan Seragam Resmi',
    date: '18 Oktober 2026, 10:30 WIB',
    category: 'Akomodasi & Seragam',
    content: 'Bagi seluruh peserta yang telah menerima Boarding Pass resmi, pengambilan seragam kaos resmi Paskas Bahagia (Ikhwan) dan tunik (Akhwat) dapat dilakukan di Meja Registrasi Utama Gedung Convention Hall saat kedatangan.',
    is_pinned: false
  }
];

function loadStoredAnnouncements() {
  const sanitizeDate = (d) => {
    if (!d || d.includes('Update Terkini:') || d.trim() === '-') {
      return '20 Oktober 2026, 14:00 WIB';
    }
    return d;
  };

  try {
    const raw = localStorage.getItem('paskas_announcements_list');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => ({
          ...item,
          date: sanitizeDate(item.date)
        }));
      }
    }
  } catch (e) {}

  const settings = window.dataService ? window.dataService.getSettings() : {};
  if (settings.announcement_title && settings.announcement_text && settings.announcement_title.trim() !== '') {
    return [
      {
        id: 'ann-1',
        title: settings.announcement_title,
        date: sanitizeDate(settings.announcement_date),
        category: 'Pemberitahuan Penting',
        content: settings.announcement_text,
        is_pinned: true
      }
    ];
  }
  return [...DEFAULT_ANNOUNCEMENTS];
}

function formatCurrentAnnouncementDate() {
  const now = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
}

function setNowAnnouncementDate() {
  const inp = document.getElementById('ann_inputDate');
  if (inp && !inp.value) {
    inp.value = formatCurrentAnnouncementDate();
  }
}

function renderAnnouncementUI() {
  const container = document.getElementById('broadcastContainerInner');
  const heroBtn = document.getElementById('heroAnnouncementBtn');
  if (!container) return;

  const settings = window.dataService ? window.dataService.getSettings() : {};
  const isEnabled = settings.announcement_enabled !== 'false' && settings.announcement_enabled !== false;
  const announcements = loadStoredAnnouncements();

  if (isEnabled && announcements.length > 0) {
    if (heroBtn) heroBtn.style.display = 'inline-flex';

    // Badge jumlah pengumuman (hanya muncul di awal sampai user membukanya di sesi ini)
    const hasSeenAnnouncements = sessionStorage.getItem('paskas_announcement_seen') === 'true';
    const badge = document.getElementById('heroAnnBadgeCount');
    if (badge) {
      if (!hasSeenAnnouncements && announcements.length > 0) {
        badge.textContent = String(announcements.length);
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }

    // Pengumuman paling atas adalah pengumuman TERBARU
    const latest = announcements[0];
    const previous = announcements.slice(1);

    let html = `
      <!-- Top Bar Full Width -->
      <div class="broadcast-section-topbar">
        <div class="broadcast-topbar-left">
          <div class="broadcast-topbar-badge">
            <span class="broadcast-pulse-dot"></span>
            <i class="fa-solid fa-bullhorn text-gold"></i>
            <span>PAPAN INFORMASI &amp; WARTA RESMI</span>
          </div>
          <h2 class="broadcast-topbar-title">Warta Pengumuman &amp; Arahan Kegiatan</h2>
          <p class="broadcast-topbar-sub">Pantau informasi terbaru, perubahan jadwal, dan arahan teknis resmi dari Panitia Pelaksana Silaturahmi Akbar Paskas Bahagia.</p>
        </div>
        <div class="broadcast-topbar-right">
          <span class="broadcast-chip-live">
            <span class="broadcast-pulse-dot green"></span> Update Panitia
          </span>
          <span class="broadcast-chip-count">
            <i class="fa-solid fa-newspaper text-gold"></i> ${announcements.length} Warta Tersedia
          </span>
        </div>
      </div>

      <!-- Kartu Pengumuman Paling Baru (Featured Editorial Bulletin 3-Kolom) -->
      <div class="broadcast-featured-card">
        <div class="broadcast-banner-glow"></div>
        <div class="broadcast-motif-overlay" aria-hidden="true"></div>
        
        <div class="broadcast-bulletin-grid">
          <!-- Kolom 1: Tile Tanggal & Status Visual (Kiri) -->
          <div class="broadcast-col-tile">
            <div class="broadcast-tile-badge-wrap">
              <span class="broadcast-badge-new">
                <i class="fa-solid fa-sparkles"></i> TERBARU
              </span>
            </div>

            <div class="broadcast-tile-datebox">
              <div class="broadcast-tile-cal-icon">
                <i class="fa-regular fa-calendar-check text-gold"></i>
              </div>
              <div class="broadcast-tile-date-info">
                <span class="broadcast-tile-date-label">TANGGAL RILIS</span>
                <span class="broadcast-tile-date-val">${escapeHtml(latest.date || '20 Oktober 2026, 14:00 WIB')}</span>
              </div>
            </div>

            <div class="broadcast-tile-catbox">
              <span class="broadcast-category-pill">
                <i class="fa-solid fa-tag text-gold"></i> ${escapeHtml(latest.category || 'Pemberitahuan')}
              </span>
            </div>

            <div class="broadcast-tile-badge-status">
              <span class="broadcast-pulse-dot gold"></span>
              <span>WARTA UTAMA</span>
            </div>
          </div>

          <!-- Kolom 2: Judul, Isi Arahan Warta & Tombol Aksi (Kanan/Utama) -->
          <div class="broadcast-col-main">
            <div class="broadcast-main-kicker">
              <span class="broadcast-kicker-tag">
                <i class="fa-solid fa-bullhorn text-gold"></i> PENGUMUMAN RESMI
              </span>
              <span class="broadcast-kicker-sep">•</span>
              <span class="broadcast-kicker-event">Panitia Silaturahmi Akbar Paskas</span>
            </div>

            <h3 class="broadcast-featured-title">${escapeHtml(latest.title || 'Pengumuman Resmi')}</h3>
            
            <div class="broadcast-featured-content-wrap">
              <div class="broadcast-featured-text">${renderFormattedNarrationHTML(latest.content || '')}</div>
            </div>

            <div class="broadcast-main-action-footer">
              <div class="broadcast-main-footer-line">
                <i class="fa-solid fa-circle-check text-green"></i>
                <span>Arahan resmi Panitia Pelaksana. Harap disimak oleh seluruh kafilah &amp; koordinator rombongan.</span>
              </div>
              ${previous.length > 0 ? `
              <div class="broadcast-footer-cta-group">
                <button type="button" class="broadcast-btn-archive" onclick="document.getElementById('broadcastHistorySec')?.scrollIntoView({ behavior: 'smooth' })">
                  <i class="fa-solid fa-clock-rotate-left text-gold"></i>
                  <span>Lihat Arsip Warta</span>
                </button>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    // Jika ada pengumuman sebelumnya, tampilkan di bawahnya dengan tanggal jelas
    if (previous.length > 0) {
      html += `
        <div class="broadcast-history-section" id="broadcastHistorySec">
          <div class="broadcast-history-heading">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span>Pengumuman &amp; Update Sebelumnya (${previous.length})</span>
          </div>
          <div class="broadcast-history-grid">
            ${previous.map((item, idx) => `
              <div class="broadcast-history-card">
                <div class="broadcast-history-card-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="broadcast-date-badge" style="font-size: 11.5px; padding: 4px 12px;">
                      <i class="fa-regular fa-calendar-days text-gold"></i> ${escapeHtml(item.date || '-')}
                    </span>
                    <span class="broadcast-category-badge" style="font-size: 11px; padding: 4px 10px;">
                      <i class="fa-solid fa-tag text-gold"></i> ${escapeHtml(item.category || 'Umum')}
                    </span>
                  </div>
                  <span style="font-size: 11px; color: #94a3b8; font-weight: 700; background: rgba(255,255,255,0.05); padding: 3px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08);">
                    <i class="fa-solid fa-box-archive text-gold"></i> Warta Sebelumnya #${idx + 2}
                  </span>
                </div>
                <h4 class="broadcast-history-card-title">${escapeHtml(item.title || '')}</h4>
                <div class="broadcast-history-card-desc">${renderFormattedNarrationHTML(item.content || '')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  } else {
    if (heroBtn) heroBtn.style.display = 'none';
    closeHeroAnnouncement();
  }
}

function openHeroAnnouncement() {
  // Tandai sudah dibuka dalam sesi browser ini agar badge jumlah pengumuman langsung hilang
  sessionStorage.setItem('paskas_announcement_seen', 'true');
  const badge = document.getElementById('heroAnnBadgeCount');
  if (badge) {
    badge.style.display = 'none';
  }

  const hero = document.getElementById('heroWrapper');
  if (hero) {
    hero.classList.remove('story-active');
    hero.classList.add('announcement-active');
    hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeHeroAnnouncement() {
  const hero = document.getElementById('heroWrapper');
  if (hero) {
    hero.classList.remove('announcement-active');
  }
}

function scrollToAnnouncement() {
  openHeroAnnouncement();
}

function toggleAnnouncementSetting(enabled) {
  const label = document.getElementById('cfg_announcementStatusLabel');
  if (label) label.textContent = enabled ? 'Aktif' : 'Nonaktif';
}

let currentEditingAnnId = null;

function renderSettingsAnnouncementsList() {
  const container = document.getElementById('settingsAnnouncementsList');
  const countLabel = document.getElementById('settingsAnnCountLabel');
  if (!container) return;

  const list = loadStoredAnnouncements();
  if (countLabel) countLabel.textContent = `${list.length} Pengumuman`;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 13px;">
        Belum ada pengumuman. Gunakan formulir di atas untuk menerbitkan pengumuman pertama.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, idx) => {
    const isLatest = idx === 0;
    return `
      <div class="settings-ann-item-box ${isLatest ? 'is-latest' : ''}">
        <div class="settings-ann-item-header">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            ${isLatest ? `
              <span class="settings-chip-badge" style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px;">
                <i class="fa-solid fa-sparkles"></i> #1 TERBARU
              </span>
            ` : `
              <span class="settings-chip-badge" style="background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">
                #${idx + 1}
              </span>
            `}
            <span style="font-size: 11.5px; color: ${isLatest ? '#b45309' : '#64748b'}; font-weight: 700;">
              <i class="fa-regular fa-calendar-check"></i> ${escapeHtml(item.date || '-')}
            </span>
            <span style="font-size: 11px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 8px; border-radius: 4px; color: #475569; font-weight: 600;">
              ${escapeHtml(item.category || 'Umum')}
            </span>
          </div>
          <div class="settings-ann-item-actions">
            <button type="button" class="btn btn-xs" onclick="editAnnouncementFromSettings('${escapeHtml(item.id)}')" style="background: #ffffff; border: 1.5px solid #cbd5e1; color: #1e293b; font-weight: 700; padding: 4px 10px; border-radius: 5px; cursor: pointer;" title="Edit Pengumuman">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button type="button" class="btn btn-xs" onclick="deleteAnnouncementFromSettings('${escapeHtml(item.id)}')" style="background: #fee2e2; border: 1px solid #fca5a5; color: #b91c1c; font-weight: 700; padding: 4px 8px; border-radius: 5px; cursor: pointer;" title="Hapus Pengumuman">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <div style="font-size: 14.5px; font-weight: 800; color: #1e293b; margin-bottom: 5px; line-height: 1.35;">${escapeHtml(item.title || '')}</div>
        <div style="font-size: 12.5px; color: #475569; line-height: 1.55; max-height: 52px; overflow: hidden; text-overflow: ellipsis;">${renderPreviewTextHTML(item.content || '')}</div>
      </div>
    `;
  }).join('');
}

async function saveSingleAnnouncementFromForm() {
  const titleInp = document.getElementById('ann_inputTitle');
  const dateInp = document.getElementById('ann_inputDate');
  const catInp = document.getElementById('ann_inputCategory');
  const textInp = document.getElementById('ann_inputText');
  const editIdInp = document.getElementById('ann_editId');
  const saveBtn = document.getElementById('btnSaveSingleAnn');

  const title = (titleInp?.value || '').trim();
  const date = (dateInp?.value || '').trim() || formatCurrentAnnouncementDate();
  const category = (catInp?.value || '').trim() || 'Pemberitahuan Penting';
  const content = (textInp?.value || '').trim();
  const editId = (editIdInp?.value || '').trim();

  if (!title) {
    showToast('Mohon masukkan judul pengumuman!', 'warning');
    if (titleInp) titleInp.focus();
    return;
  }
  if (!content) {
    showToast('Mohon tuliskan isi/narasi pengumuman!', 'warning');
    if (textInp) textInp.focus();
    return;
  }

  let list = loadStoredAnnouncements();

  if (editId) {
    // Mode Update
    const idx = list.findIndex(item => item.id === editId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        title,
        date,
        category,
        content
      };
    }
  } else {
    // Mode Tambah Baru: Tempatkan di urutan teratas (idx 0 = Paling Baru!)
    const newItem = {
      id: 'ann-' + Date.now(),
      title,
      date,
      category,
      content,
      is_pinned: true
    };
    list.unshift(newItem);
  }

  // Tampilkan loading saat proses simpan ke Cloud
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...`;
  }

  try {
    await saveAnnouncementsToStorage(list);
    showToast(editId ? 'Perubahan pengumuman berhasil disimpan ke Supabase!' : 'Pengumuman baru berhasil diterbitkan & tersimpan ke Cloud!', 'success');
  } catch (err) {
    console.warn('Gagal sinkron pengumuman:', err);
    showToast('Pengumuman tersimpan di lokal!', 'info');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span id="btnSaveSingleAnnText">Terbitkan Pengumuman</span>`;
    }
  }

  cancelEditAnnouncement();
  sessionStorage.removeItem('paskas_announcement_seen');
  renderSettingsAnnouncementsList();
  renderAnnouncementUI();
}

function editAnnouncementFromSettings(id) {
  const list = loadStoredAnnouncements();
  const item = list.find(x => x.id === id);
  if (!item) return;

  currentEditingAnnId = id;
  const editIdInp = document.getElementById('ann_editId');
  const titleInp = document.getElementById('ann_inputTitle');
  const dateInp = document.getElementById('ann_inputDate');
  const catInp = document.getElementById('ann_inputCategory');
  const textInp = document.getElementById('ann_inputText');
  const modeTitle = document.getElementById('annFormModeTitle');
  const cancelBtn = document.getElementById('btnCancelEditAnn');
  const saveBtnText = document.getElementById('btnSaveSingleAnnText');

  if (editIdInp) editIdInp.value = item.id;
  if (titleInp) titleInp.value = item.title || '';
  if (dateInp) dateInp.value = item.date || '';
  if (catInp) catInp.value = item.category || '';
  if (textInp) textInp.value = item.content || '';

  if (modeTitle) modeTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Pengumuman: ${escapeHtml(item.title)}`;
  if (cancelBtn) cancelBtn.style.display = 'inline-block';
  if (saveBtnText) saveBtnText.textContent = 'Simpan Perubahan';

  if (titleInp) titleInp.focus();
}

function cancelEditAnnouncement() {
  currentEditingAnnId = null;
  const editIdInp = document.getElementById('ann_editId');
  const titleInp = document.getElementById('ann_inputTitle');
  const dateInp = document.getElementById('ann_inputDate');
  const catInp = document.getElementById('ann_inputCategory');
  const textInp = document.getElementById('ann_inputText');
  const modeTitle = document.getElementById('annFormModeTitle');
  const cancelBtn = document.getElementById('btnCancelEditAnn');
  const saveBtnText = document.getElementById('btnSaveSingleAnnText');

  if (editIdInp) editIdInp.value = '';
  if (titleInp) titleInp.value = '';
  if (dateInp) dateInp.value = formatCurrentAnnouncementDate();
  if (catInp) catInp.value = '';
  if (textInp) textInp.value = '';

  if (modeTitle) modeTitle.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Tambah Pengumuman Baru`;
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (saveBtnText) saveBtnText.textContent = 'Terbitkan Pengumuman';
}

async function deleteAnnouncementFromSettings(id) {
  let list = loadStoredAnnouncements();
  const item = list.find(x => x.id === id);
  const title = item ? item.title : 'ini';

  if (!confirm(`Apakah Anda yakin ingin menghapus pengumuman "${title}"?`)) return;

  list = list.filter(x => x.id !== id);
  await saveAnnouncementsToStorage(list);

  if (currentEditingAnnId === id) cancelEditAnnouncement();
  renderSettingsAnnouncementsList();
  renderAnnouncementUI();
  showToast('Pengumuman berhasil dihapus!', 'info');
}

async function saveAllAnnouncementSettings() {
  const titleInp = document.getElementById('ann_inputTitle');
  const textInp = document.getElementById('ann_inputText');
  const title = (titleInp?.value || '').trim();
  const content = (textInp?.value || '').trim();

  // Jika admin sedang mengisi formulir di atas lalu langsung klik tombol Simpan
  if (title && content) {
    await saveSingleAnnouncementFromForm();
    return;
  }

  const enabledInput = document.getElementById('cfg_announcementEnabled');
  const isEnabled = enabledInput ? enabledInput.checked : true;
  const list = loadStoredAnnouncements();

  await saveAnnouncementsToStorage(list, isEnabled);
  renderAnnouncementUI();
  showToast('Pengaturan pengumuman berhasil disimpan ke Supabase!', 'success');
}

async function saveAnnouncementsToStorage(list, isEnabledOverride) {
  const safeList = Array.isArray(list) ? list : [];
  try {
    localStorage.setItem('paskas_announcements_list', JSON.stringify(safeList));
  } catch (e) {}

  const enabledInput = document.getElementById('cfg_announcementEnabled');
  const isEnabled = isEnabledOverride !== undefined ? isEnabledOverride : (enabledInput ? enabledInput.checked : true);

  const payload = {
    announcement_enabled: String(isEnabled),
    announcement_title: safeList.length > 0 ? safeList[0].title : '',
    announcement_date: safeList.length > 0 ? safeList[0].date : '',
    announcement_text: safeList.length > 0 ? safeList[0].content : ''
  };

  if (window.dataService) {
    if (typeof window.dataService.saveSettings === 'function') {
      await window.dataService.saveSettings(payload);
    }
    if (typeof window.dataService.saveCloudSetting === 'function') {
      await window.dataService.saveCloudSetting('paskas_announcements_list', safeList);
    }
  }
}

window.renderAnnouncementUI = renderAnnouncementUI;
window.openHeroAnnouncement = openHeroAnnouncement;
window.closeHeroAnnouncement = closeHeroAnnouncement;
window.scrollToAnnouncement = scrollToAnnouncement;
window.toggleAnnouncementSetting = toggleAnnouncementSetting;
window.setNowAnnouncementDate = setNowAnnouncementDate;
window.saveSingleAnnouncementFromForm = saveSingleAnnouncementFromForm;
window.editAnnouncementFromSettings = editAnnouncementFromSettings;
window.cancelEditAnnouncement = cancelEditAnnouncement;
window.deleteAnnouncementFromSettings = deleteAnnouncementFromSettings;
window.saveAllAnnouncementSettings = saveAllAnnouncementSettings;
window.renderSettingsAnnouncementsList = renderSettingsAnnouncementsList;

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
  if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
    window.dataService.saveCloudSetting('paskas_rooms_data', rooms);
  }
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
  if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
    window.dataService.saveCloudSetting('paskas_groups_data', groups);
  }
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

  updateRoomGroupControlUI();
  renderSettingsRoomsTable();
  renderSettingsGroupsTable();
}

function updateRoomGroupControlUI() {
  const isEnabled = isRoomGroupAllocationEnabled();
  const card = document.getElementById('cfg_roomGroupControlCard');
  const badge = document.getElementById('cfg_roomGroupStatusBadge');
  const desc = document.getElementById('cfg_roomGroupStatusDesc');
  const btn = document.getElementById('btnToggleRoomGroupAllocation');
  const icon = document.getElementById('cfg_roomGroupIcon');

  if (!badge || !btn) return;

  if (isEnabled) {
    if (card) {
      card.style.borderLeft = '5px solid #10b981';
      card.style.background = '#ffffff';
    }
    if (icon) {
      icon.className = 'fa-solid fa-hotel';
      if (icon.parentElement) {
        icon.parentElement.style.background = 'rgba(16, 185, 129, 0.12)';
        icon.parentElement.style.color = '#059669';
      }
    }
    badge.style.background = '#ecfdf5';
    badge.style.border = '1px solid #a7f3d0';
    badge.style.color = '#065f46';
    badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> AKTIF (DIBAGI OTOMATIS)';

    if (desc) {
      desc.innerHTML = 'Pembagian kamar &amp; kelompok berjalan otomatis saat peserta mendaftar. Nomor kamar &amp; nama/kode kelompok akan dicetak pada tiket boarding pass peserta.';
    }

    btn.className = 'btn btn-secondary';
    btn.style.background = '#fef2f2';
    btn.style.border = '1.5px solid #fca5a5';
    btn.style.color = '#b91c1c';
    btn.innerHTML = '<i class="fa-solid fa-power-off"></i> Tutup / Close Pembagian';
    btn.title = 'Klik untuk mematikan alokasi kamar & kelompok (tiket akan menampilkan tanda -)';
  } else {
    if (card) {
      card.style.borderLeft = '5px solid #ef4444';
      card.style.background = '#fffaf9';
    }
    if (icon) {
      icon.className = 'fa-solid fa-ban';
      if (icon.parentElement) {
        icon.parentElement.style.background = 'rgba(239, 68, 68, 0.12)';
        icon.parentElement.style.color = '#dc2626';
      }
    }
    badge.style.background = '#fef2f2';
    badge.style.border = '1px solid #fecaca';
    badge.style.color = '#991b1b';
    badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> DITUTUP / CLOSE (TIDAK DIBAGI -)';

    if (desc) {
      desc.innerHTML = '<strong style="color: #b91c1c;">Fitur Sedang Ditutup (CLOSE):</strong> Pembagian kamar &amp; kelompok dinonaktifkan. Setiap peserta yang mendaftar <u>tidak dialokasikan</u> kamar/kelompok dan di tiket boarding pass akan tercetak strip (<strong>-</strong>).';
    }

    btn.className = 'btn btn-primary';
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    btn.style.border = 'none';
    btn.style.color = '#ffffff';
    btn.innerHTML = '<i class="fa-solid fa-play"></i> Buka / Aktifkan Pembagian';
    btn.title = 'Klik untuk mengaktifkan kembali pembagian kamar & kelompok';
  }

  // Update strip indikator tampilan di tiket
  const strip = document.getElementById('cfg_roomGroupPreviewStrip');
  const sim = document.getElementById('cfg_roomGroupTicketPreviewSim');
  if (sim) {
    if (isEnabled) {
      sim.innerHTML = '<span style="color:#059669; font-weight:800;">KELOMPOK: [A123]</span> &bull; <span style="color:#059669; font-weight:800;">KAMAR: [08]</span> <small style="color:#64748b; font-weight:normal;">(Otomatis Terisi)</small>';
      if (strip) {
        strip.style.background = '#f0fdf4';
        strip.style.borderColor = '#a7f3d0';
      }
    } else {
      sim.innerHTML = '<span style="color:#dc2626; font-weight:800;">KELOMPOK: [-]</span> &bull; <span style="color:#dc2626; font-weight:800;">KAMAR: [-]</span> <small style="color:#dc2626; font-weight:700;">(Terkunci / Ditutup)</small>';
      if (strip) {
        strip.style.background = '#fef2f2';
        strip.style.borderColor = '#fca5a5';
      }
    }
  }

  // Otomatis sinkronkan dan update Pratinjau Tampilan Tiket (Live Preview)
  if (typeof renderTicketTemplateLivePreview === 'function') {
    renderTicketTemplateLivePreview();
  }
}

async function toggleRoomGroupAllocation() {
  const currentStatus = isRoomGroupAllocationEnabled();
  const newStatus = !currentStatus;
  const statusStr = newStatus ? 'true' : 'false';

  localStorage.setItem('paskas_room_group_enabled', statusStr);

  if (window.dataService) {
    if (typeof window.dataService.saveSettings === 'function') {
      try {
        await window.dataService.saveSettings({ is_room_group_enabled: statusStr });
      } catch (e) {}
    }
    if (typeof window.dataService.saveCloudSetting === 'function') {
      try {
        await window.dataService.saveCloudSetting('is_room_group_enabled', statusStr);
      } catch (e) {}
    }
  }

  updateRoomGroupControlUI();

  if (newStatus) {
    showToast('Alhamdulillah, pembagian kamar & kelompok otomatis telah DIAKTIFKAN kembali.', 'success');
  } else {
    showToast('Pembagian kamar & kelompok telah DI-CLOSE (DITUTUP). Di tiket peserta akan tampil tanda strip (-).', 'warning');
  }
}

window.toggleRoomGroupAllocation = toggleRoomGroupAllocation;
window.updateRoomGroupControlUI = updateRoomGroupControlUI;
window.isRoomGroupAllocationEnabled = isRoomGroupAllocationEnabled;

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
  const scriptInp = document.getElementById('cfg_googleEmailScriptUrl');
  if (emServiceInp) emServiceInp.value = settings.emailjs_service_id || '';
  if (emTemplateInp) emTemplateInp.value = settings.emailjs_template_id || '';
  if (emPublicInp) emPublicInp.value = settings.emailjs_public_key || '';
  if (scriptInp) scriptInp.value = settings.google_email_script_url || '';

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

  // Sinkronisasi status pembagian kamar & kelompok ke Live Preview
  const isAllocActive = isRoomGroupAllocationEnabled();

  const elGroup = document.getElementById('prevBpGroup');
  if (elGroup) {
    elGroup.textContent = isAllocActive ? 'A123' : '-';
    elGroup.style.color = isAllocActive ? '#ffffff' : '#fca5a5';
  }

  const elRoom = document.getElementById('prevBpRoom');
  if (elRoom) {
    elRoom.textContent = isAllocActive ? '08' : '-';
    elRoom.style.color = isAllocActive ? '#ffffff' : '#fca5a5';
  }

  const elStubGroup = document.getElementById('prevBpStubGroup');
  if (elStubGroup) {
    elStubGroup.textContent = isAllocActive ? 'A123' : '-';
    elStubGroup.style.color = isAllocActive ? '#ffffff' : '#fca5a5';
  }

  const elStubRoom = document.getElementById('prevBpStubRoom');
  if (elStubRoom) {
    elStubRoom.textContent = isAllocActive ? '08' : '-';
    elStubRoom.style.color = isAllocActive ? '#ffffff' : '#fca5a5';
  }

  const pill = document.getElementById('prevTicketAllocStatusPill');
  if (pill) {
    if (!isAllocActive) {
      pill.style.background = '#fef2f2';
      pill.style.color = '#dc2626';
      pill.style.border = '1px solid #fca5a5';
      pill.innerHTML = '<i class="fa-solid fa-lock"></i> Terkunci: Kelompok &amp; Kamar Ditutup (-)';
    } else {
      pill.style.background = '#ecfdf5';
      pill.style.color = '#065f46';
      pill.style.border = '1px solid #a7f3d0';
      pill.innerHTML = '<i class="fa-solid fa-circle-check"></i> Aktif: Kelompok &amp; Kamar Dibagi Otomatis';
    }
  }

  const btnQuick = document.getElementById('btnQuickToggleAllocFromPreview');
  if (btnQuick) {
    if (!isAllocActive) {
      btnQuick.innerHTML = '<i class="fa-solid fa-play" style="color: #059669;"></i> Buka / Aktifkan Pembagian';
      btnQuick.title = 'Klik untuk mengaktifkan kembali pembagian kamar & kelompok';
      btnQuick.style.background = '#ecfdf5';
      btnQuick.style.color = '#065f46';
      btnQuick.style.border = '1px solid #a7f3d0';
    } else {
      btnQuick.innerHTML = '<i class="fa-solid fa-lock" style="color: #dc2626;"></i> Kunci / Close Pembagian (-)';
      btnQuick.title = 'Klik untuk mengunci pembagian kamar & kelompok (tiket akan menampilkan tanda -)';
      btnQuick.style.background = '#fef2f2';
      btnQuick.style.color = '#991b1b';
      btnQuick.style.border = '1px solid #fecaca';
    }
  }

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
  const scriptInp = document.getElementById('cfg_googleEmailScriptUrl');

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
    emailjs_public_key: emPublicInp?.value?.trim() || '',
    google_email_script_url: scriptInp?.value?.trim() || ''
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
    showToast('Memproses dan mengunggah foto ke Cloud Supabase Storage...', 'info');
    const res = await compressImageFile(file, 1920, 0.86);

    let finalUrl = res.dataUrl;
    if (window.dataService && typeof window.dataService.uploadAssetFile === 'function') {
      try {
        finalUrl = await window.dataService.uploadAssetFile(res.dataUrl, 'cards', `card-${idx + 1}`);
      } catch (uploadErr) {
        console.warn('Gagal upload kartu ke storage, menggunakan base64:', uploadErr);
      }
    }

    const box = document.querySelector(`.settings-card-item-box[data-card-idx="${idx}"]`);
    if (box) {
      const inputCover = box.querySelector('.card-input-cover');
      if (inputCover) {
        inputCover.value = finalUrl;
      }
      const img = box.querySelector('.settings-card-preview-thumb');
      if (img) {
        img.src = finalUrl;
      }
    }
    showToast('Foto latar kartu berhasil diunggah ke Supabase! Klik "Simpan Perubahan Kartu".', 'success');
  } catch (err) {
    console.error('Gagal upload gambar:', err);
    showToast('Gagal memproses file foto. Pastikan format file gambar valid.', 'error');
  }
}

/* ===================================================================
   HELPER FORMAT TEKS & REORDER KARTU INFORMASI DASHBOARD
   =================================================================== */

function renderPreviewTextHTML(rawText) {
  if (!rawText) return '';
  let str = escapeHtml(rawText);
  str = str.replace(/&lt;(\/?)b&gt;/gi, '<$1b>');
  str = str.replace(/&lt;(\/?)strong&gt;/gi, '<$1strong>');
  str = str.replace(/&lt;(\/?)i&gt;/gi, '<$1i>');
  str = str.replace(/&lt;(\/?)em&gt;/gi, '<$1em>');
  str = str.replace(/&lt;(\/?)u&gt;/gi, '<$1u>');
  str = str.replace(/&lt;mark&gt;/gi, '<mark>');
  str = str.replace(/&lt;\/mark&gt;/gi, '</mark>');
  str = str.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  str = str.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  str = str.replace(/\*(.+?)\*/g, '<em>$1</em>');
  str = str.replace(/__(.+?)__/g, '<u>$1</u>');
  return str;
}

function renderFormattedNarrationHTML(rawText) {
  if (!rawText) return '';
  const paras = rawText.split(/\r?\n\s*\r?\n/).filter(p => p.trim());
  return paras.map(para => {
    const lines = para.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    const formattedLines = lines.map(line => {
      let l = escapeHtml(line);
      
      // Decode safe allowed formatting tags
      l = l.replace(/&lt;(\/?)b&gt;/gi, '<$1b>');
      l = l.replace(/&lt;(\/?)strong&gt;/gi, '<$1strong>');
      l = l.replace(/&lt;(\/?)i&gt;/gi, '<$1i>');
      l = l.replace(/&lt;(\/?)em&gt;/gi, '<$1em>');
      l = l.replace(/&lt;(\/?)u&gt;/gi, '<$1u>');
      l = l.replace(/&lt;mark&gt;/gi, '<mark style="background: rgba(251, 191, 36, 0.25); color: #fbbf24; padding: 2px 6px; border-radius: 4px; font-weight: 700;">');
      l = l.replace(/&lt;\/mark&gt;/gi, '</mark>');
      l = l.replace(/&lt;br\s*\/?&gt;/gi, '<br>');

      // Markdown syntax (bold, italic, underline)
      l = l.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #ffffff; font-weight: 800; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">$1</strong>');
      l = l.replace(/\*(.+?)\*/g, '<em style="color: #fde68a;">$1</em>');
      l = l.replace(/__(.+?)__/g, '<u style="text-decoration-color: #fbbf24; text-underline-offset: 3px;">$1</u>');

      // Markdown Headings: #, ##, ###
      const headingMatch = l.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        const hLevel = headingMatch[1].length;
        const hText = headingMatch[2];
        const hSize = hLevel === 1 ? '17px' : (hLevel === 2 ? '15.5px' : '14.5px');
        return `<div class="story-narration-heading" style="font-size: ${hSize}; font-weight: 800; color: #fbbf24; margin: 14px 0 6px 0; letter-spacing: 0.02em;">${hText}</div>`;
      }

      // Check if line is a bullet item: starts with •, -, *, or . followed by space
      const bulletMatch = l.match(/^([-•*]|\.)\s+(.+)$/);
      if (bulletMatch) {
        return `<div class="story-narration-bullet" style="display: flex; align-items: baseline; gap: 8px; margin: 4px 0 4px 4px;">
          <i class="fa-solid fa-circle-check text-gold" style="font-size: 12px; flex-shrink: 0; transform: translateY(1px);"></i>
          <span style="color: #f1f5f9; font-size: 14.5px; line-height: 1.6;">${bulletMatch[2]}</span>
        </div>`;
      }

      // Check if line is a day/date heading (e.g. RABU, 11 NOVEMBER or HARI PERTAMA) or section ending with colon
      const cleanPlain = line.replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim();
      const isDayHeading = /^(RABU|KAMIS|JUMAT|SABTU|AHAD|MINGGU|SENIN|SELASA|HARI\s+[A-Z0-9]+)/i.test(cleanPlain);
      const isSectionHeading = /^([A-Z0-9\s,&'\/\-]{3,}):$/.test(cleanPlain) && cleanPlain.length <= 60 && !cleanPlain.includes('.');

      if (isDayHeading || isSectionHeading) {
        return `<div class="story-narration-heading" style="font-size: 15px; font-weight: 800; color: #fbbf24; margin: 14px 0 6px 0; letter-spacing: 0.03em; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid ${isDayHeading ? 'fa-calendar-day' : 'fa-circle-info'}" style="font-size: 13px; color: #fbbf24;"></i>
          <span>${l}</span>
        </div>`;
      }

      return `<div style="line-height: 1.75; color: #e2e8f0; font-size: 14.5px;">${l}</div>`;
    });

    return `<div class="story-narration-para" style="margin-bottom: 14px;">${formattedLines.join('')}</div>`;
  }).join('');
}

function applyTextFormatting(btnEl, formatType) {
  const container = btnEl.closest('.form-group') || btnEl.closest('.settings-card-item-box') || btnEl.parentElement.parentElement;
  const textarea = container ? container.querySelector('textarea') : null;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const selectedText = val.substring(start, end);

  let replacement = '';
  let cursorOffset = 0;

  switch (formatType) {
    case 'bold':
      replacement = selectedText ? `**${selectedText}**` : `**Teks Tebal**`;
      cursorOffset = selectedText ? replacement.length : 2;
      break;
    case 'italic':
      replacement = selectedText ? `*${selectedText}*` : `*Teks Miring*`;
      cursorOffset = selectedText ? replacement.length : 1;
      break;
    case 'underline':
      replacement = selectedText ? `<u>${selectedText}</u>` : `<u>Teks Garis Bawah</u>`;
      cursorOffset = selectedText ? replacement.length : 3;
      break;
    case 'paragraph':
      replacement = `\n\n`;
      cursorOffset = 2;
      break;
    case 'bullet':
      if (selectedText) {
        replacement = selectedText.split('\n').map(l => {
          const trimmed = l.trim();
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('. ') || trimmed.startsWith('* ')) {
            return `• ${trimmed.replace(/^([•\-\.\*]\s*)/, '')}`;
          }
          return `• ${l}`;
        }).join('\n');
      } else {
        replacement = `\n• Poin penting: `;
      }
      cursorOffset = replacement.length;
      break;
    case 'highlight':
      replacement = selectedText ? `<mark>${selectedText}</mark>` : `<mark>Teks Sorot</mark>`;
      cursorOffset = selectedText ? replacement.length : 6;
      break;
    default:
      return;
  }

  textarea.value = val.substring(0, start) + replacement + val.substring(end);
  textarea.focus();
  
  if (selectedText) {
    textarea.setSelectionRange(start, start + replacement.length);
  } else {
    const selLen = (formatType === 'bold' ? 10 : formatType === 'italic' ? 11 : formatType === 'underline' ? 16 : (formatType === 'highlight' ? 10 : 0));
    textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + selLen);
  }

  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function getFormattingToolbarHTML(hintText = 'Pilih kata lalu klik tombol format:') {
  return `
    <div class="narration-toolbar">
      <div class="narration-toolbar-group">
        <span style="font-size: 11px; font-weight: 700; color: #475569; margin-right: 4px; display: inline-flex; align-items: center; gap: 4px;">
          <i class="fa-solid fa-pen-nib text-gold"></i> Format:
        </span>
        <button type="button" class="btn-format-tool" onmousedown="event.preventDefault()" onclick="applyTextFormatting(this, 'bold')" title="Tebalkan Tulisan (Bold: **teks**)">
          <i class="fa-solid fa-bold"></i> <b>Tebal</b>
        </button>
        <button type="button" class="btn-format-tool" onmousedown="event.preventDefault()" onclick="applyTextFormatting(this, 'italic')" title="Miringkan Tulisan (Italic: *teks*)">
          <i class="fa-solid fa-italic"></i> <i>Miring</i>
        </button>
        <button type="button" class="btn-format-tool" onmousedown="event.preventDefault()" onclick="applyTextFormatting(this, 'underline')" title="Garis Bawahi Tulisan (Underline: <u>teks</u>)">
          <i class="fa-solid fa-underline"></i> <u>Garis Bawah</u>
        </button>
        <button type="button" class="btn-format-tool" onmousedown="event.preventDefault()" onclick="applyTextFormatting(this, 'paragraph')" title="Ganti Baris / Paragraf Baru (Enter)">
          <i class="fa-solid fa-paragraph"></i> Baris Baru
        </button>
        <button type="button" class="btn-format-tool" onmousedown="event.preventDefault()" onclick="applyTextFormatting(this, 'bullet')" title="Tambahkan Simbol Poin (•)">
          <i class="fa-solid fa-list-ul"></i> Poin (•)
        </button>
        <button type="button" class="btn-format-tool tool-highlight" onmousedown="event.preventDefault()" onclick="applyTextFormatting(this, 'highlight')" title="Sorot Teks Warna Emas (<mark>)">
          <i class="fa-solid fa-highlighter"></i> Sorot
        </button>
      </div>
      <span style="font-size: 10.5px; color: #94a3b8; font-style: italic;">
        ${hintText}
      </span>
    </div>
  `;
}

function syncCardFormInputsToMemory() {
  const cardElements = document.querySelectorAll('.settings-card-item-box');
  if (!cardElements.length) return;
  cardElements.forEach((el, idx) => {
    if (!DASHBOARD_CARDS[idx]) return;
    const title = el.querySelector('.card-input-title')?.value;
    const category = el.querySelector('.card-input-category')?.value;
    const subtitle = el.querySelector('.card-input-subtitle')?.value;
    const cover = el.querySelector('.card-input-cover')?.value;
    const narration = el.querySelector('.card-input-narration')?.value;

    if (title !== undefined) DASHBOARD_CARDS[idx].title = title.trim();
    if (category !== undefined) DASHBOARD_CARDS[idx].category = category.trim();
    if (subtitle !== undefined) DASHBOARD_CARDS[idx].subtitle = subtitle.trim();
    if (cover !== undefined) DASHBOARD_CARDS[idx].coverImg = cover.trim();
    if (narration !== undefined) DASHBOARD_CARDS[idx].narration = narration.trim();
  });
}

function updateCardBadges() {
  const total = DASHBOARD_CARDS.length;
  DASHBOARD_CARDS.forEach((c, i) => {
    c.badge = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  });
}

function moveCardUp(idx) {
  if (idx <= 0) return;
  syncCardFormInputsToMemory();
  const temp = DASHBOARD_CARDS[idx];
  DASHBOARD_CARDS[idx] = DASHBOARD_CARDS[idx - 1];
  DASHBOARD_CARDS[idx - 1] = temp;
  updateCardBadges();
  renderSettingsCardsManager();
  renderDashboardCards();
  showToast(`Kartu "${DASHBOARD_CARDS[idx - 1].title}" digeser naik ke Posisi #${idx}`, 'info');
}

function moveCardDown(idx) {
  if (idx >= DASHBOARD_CARDS.length - 1) return;
  syncCardFormInputsToMemory();
  const temp = DASHBOARD_CARDS[idx];
  DASHBOARD_CARDS[idx] = DASHBOARD_CARDS[idx + 1];
  DASHBOARD_CARDS[idx + 1] = temp;
  updateCardBadges();
  renderSettingsCardsManager();
  renderDashboardCards();
  showToast(`Kartu "${DASHBOARD_CARDS[idx + 1].title}" digeser turun ke Posisi #${idx + 2}`, 'info');
}

function moveCardToPosition(fromIdx, targetIdx) {
  targetIdx = parseInt(targetIdx, 10);
  if (isNaN(targetIdx) || fromIdx === targetIdx || targetIdx < 0 || targetIdx >= DASHBOARD_CARDS.length) return;
  syncCardFormInputsToMemory();
  const [movedCard] = DASHBOARD_CARDS.splice(fromIdx, 1);
  DASHBOARD_CARDS.splice(targetIdx, 0, movedCard);
  updateCardBadges();
  renderSettingsCardsManager();
  renderDashboardCards();
  showToast(`Kartu "${movedCard.title}" berhasil dipindahkan ke Posisi #${targetIdx + 1}!`, 'success');
}

function renderSettingsCardsManager() {
  const container = document.getElementById('settingsCardsList');
  if (!container) return;

  const uniforms = getUniformSettings();

  container.innerHTML = DASHBOARD_CARDS.map((card, idx) => {
    const isUniformCard = (card.id === 'card-4') || 
                          (card.title && card.title.toLowerCase().includes('seragam')) ||
                          (card.category && card.category.toLowerCase().includes('atribut'));

    const orderControlsHTML = `
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <div class="card-order-controls">
          <span style="font-size: 11px; font-weight: 700; color: #475569; margin-right: 4px; display: inline-flex; align-items: center; gap: 3px;">
            <i class="fa-solid fa-arrow-down-up-across-line text-gold"></i> Urutan:
          </span>
          <select onchange="moveCardToPosition(${idx}, this.value)" style="font-size: 11.5px; font-weight: 700; padding: 3px 6px; border: 1px solid #e2e8f0; border-radius: 5px; background: #f8fafc; color: #1e293b; cursor: pointer;" title="Pindahkan urutan kartu ini">
            ${DASHBOARD_CARDS.map((_, pIdx) => `
              <option value="${pIdx}" ${pIdx === idx ? 'selected' : ''}>
                Posisi #${pIdx + 1} ${pIdx === 0 ? '(Utama / #1)' : ''}
              </option>
            `).join('')}
          </select>
          <button type="button" class="btn-order-arrow" onclick="moveCardUp(${idx})" ${idx === 0 ? 'disabled' : ''} title="Geser Naik (1 tingkat lebih awal)">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button type="button" class="btn-order-arrow" onclick="moveCardDown(${idx})" ${idx === DASHBOARD_CARDS.length - 1 ? 'disabled' : ''} title="Geser Turun (1 tingkat lebih akhir)">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
        </div>

        ${DASHBOARD_CARDS.length > 1 ? `
          <button type="button" class="btn-remove-card-item" onclick="removeCardFromSettings(${idx})" title="Hapus kartu ini" style="background: #fee2e2; border: 1px solid #fca5a5; color: #b91c1c; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        ` : ''}
      </div>
    `;

    if (isUniformCard) {
      return `
        <div class="settings-card-item-box settings-card-uniform-mode" data-card-idx="${idx}">
          <div class="settings-card-box-header" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 240px;">
              <img src="${card.coverImg || uniforms.ikhwanImg || card.thumbImg}" class="settings-card-preview-thumb" alt="${card.title}" onerror="this.src='images/seragam-ikhwan.jpg'">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span class="settings-chip-badge" style="background: #f1f5f9; color: #334155; border: 1.5px solid #cbd5e1; font-weight: 800; font-size: 12px; padding: 2px 8px; border-radius: 6px;">
                    #${idx + 1}
                  </span>
                  <div class="settings-card-box-title">${escapeHtml(card.title)}</div>
                  <span class="settings-chip-badge" style="background: rgba(217, 119, 6, 0.15); color: #d97706; border: 1px solid rgba(217, 119, 6, 0.35); font-weight: 700; font-size: 11px;">
                    <i class="fa-solid fa-shirt"></i> Khusus Baju
                  </span>
                </div>
                <span style="font-size: 11.5px; color: #94a3b8;">${escapeHtml(card.category)}</span>
              </div>
            </div>
            ${orderControlsHTML}
          </div>

          <div class="form-row col-2" style="margin-top: 6px;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-size: 12px;">Judul Kartu</label>
              <input type="text" class="form-control card-input-title" value="${escapeHtml(card.title || '')}" placeholder="Cth: Seragam & Kit" style="padding: 8px 12px; font-size: 13px;">
            </div>
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-size: 12px;">Kategori / Tagline</label>
              <input type="text" class="form-control card-input-category" value="${escapeHtml(card.category || '')}" placeholder="Cth: ATRIBUT RESMI" style="padding: 8px 12px; font-size: 13px;">
            </div>
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" style="font-size: 12px;">Narasi Ringkas di Kartu (Subjudul)</label>
            <input type="text" class="form-control card-input-subtitle" value="${escapeHtml(card.subtitle || '')}" placeholder="Deskripsi ringkas yang tampil di kartu..." style="padding: 8px 12px; font-size: 13px;">
          </div>

          <!-- PENGATURAN KHUSUS BAJU IKHWAN & AKHWAT -->
          <div class="settings-uniform-manager-box" style="margin-top: 8px; background: linear-gradient(145deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.95)); border: 1.5px solid #d4af37; border-radius: 14px; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 28px; height: 28px; border-radius: 7px; background: #d4af37; color: #1a1815; display: flex; align-items: center; justify-content: center; font-size: 13px;">
                  <i class="fa-solid fa-shirt"></i>
                </div>
                <div>
                  <strong style="font-size: 13.5px; color: #1e293b;">Pengaturan Khusus Baju &amp; Seragam</strong>
                  <div style="font-size: 11.5px; color: #64748b;">Upload foto desain dan tentukan narasi eksklusif untuk peserta Ikhwan dan Akhwat</div>
                </div>
              </div>
              <span style="font-size: 11px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 3px 8px; border-radius: 6px; font-weight: 600;">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Mode Khusus Ikhwan &amp; Akhwat
              </span>
            </div>

            <div class="settings-uniform-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 16px;">
              <!-- Panel Ikhwan -->
              <div class="settings-uniform-panel" style="background: #ffffff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span class="badge-gender-ikhwan" style="font-size: 11px; padding: 3px 9px;">
                    <i class="fa-solid fa-mars"></i> Khusus Ikhwan (Laki-laki)
                  </span>
                  <span style="font-size: 11px; color: #64748b; font-weight: 600;">Model 01</span>
                </div>

                <div style="display: flex; gap: 12px; align-items: center;">
                  <div style="position: relative; width: 85px; height: 85px; border-radius: 10px; overflow: hidden; border: 1.5px solid #93c5fd; background: #0b1120; flex-shrink: 0;">
                    <img id="cfg_cardUniformIkhwanThumb" src="${uniforms.ikhwanImg}" alt="Preview Ikhwan" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/seragam-ikhwan.jpg'">
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                    <label class="btn btn-outline-cyan btn-xs" style="cursor: pointer; padding: 6px 12px; font-size: 12px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; background: #eff6ff;">
                      <i class="fa-solid fa-cloud-arrow-up text-cyan"></i> Upload Baju Ikhwan
                      <input type="file" accept="image/*" style="display: none;" onchange="handleUniformSettingsUpload(event, 'ikhwan', ${idx})">
                    </label>
                    <button type="button" class="btn btn-secondary btn-xs" onclick="openUniformImageLightbox(document.getElementById('cfg_cardUniformIkhwanThumb').src, 'Model Baju Ikhwan')" style="padding: 4px 10px; font-size: 11px; border-radius: 6px;">
                      <i class="fa-regular fa-eye"></i> Perbesar Foto
                    </button>
                  </div>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 11.5px; margin-bottom: 3px;">URL / Link Foto Baju Ikhwan</label>
                  <input type="text" class="form-control card-uniform-ikhwan-img" id="cfg_cardUniformIkhwanImg" value="${escapeHtml(uniforms.ikhwanImg)}" placeholder="URL foto atau klik Upload Baju Ikhwan" style="padding: 6px 10px; font-size: 12px;" oninput="updateUniformThumbPreview(this, 'ikhwan')">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 11.5px; margin-bottom: 3px;">Judul Model Baju Ikhwan</label>
                  <input type="text" class="form-control card-uniform-ikhwan-title" value="${escapeHtml(uniforms.ikhwanTitle)}" placeholder="Cth: Model Kaos Resmi Ikhwan" style="padding: 6px 10px; font-size: 12px; font-weight: 600;">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 11.5px; margin-bottom: 3px; font-weight: 700; color: #0284c7;">
                    <i class="fa-solid fa-clipboard-list"></i> Catatan &amp; Spesifikasi Baju Ikhwan (Tampil di Kartu Ikhwan)
                  </label>
                  ${getFormattingToolbarHTML('Pilih teks lalu format:')}
                  <textarea class="form-control card-uniform-ikhwan-desc textarea-with-toolbar" rows="6" placeholder="Tuliskan spesifikasi bahan kaos, kenyamanan, sirkulasi udara, logo PASKAS untuk ikhwan..." style="padding: 10px 12px; font-size: 13px; line-height: 1.5; min-height: 140px; resize: vertical;">${escapeHtml(uniforms.ikhwanDesc)}</textarea>
                </div>

                <!-- Size Chart Ikhwan Input -->
                <div class="form-group" style="margin: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 4px; gap: 6px;">
                    <label class="form-label" style="font-size: 11.5px; margin: 0; font-weight: 700; color: #0284c7;">
                      <i class="fa-solid fa-ruler-combined"></i> Panduan Standar Ukuran Baju (Size Chart) Ikhwan
                    </label>
                    <button type="button" class="btn btn-outline-secondary btn-xs" onclick="openUniformImageLightbox('https://cyqtyobzhqzmelmmpbdb.supabase.co/storage/v1/object/public/paskas%20bahagia/size-charts/size-chart-kaos-ikhwan.png', 'Panduan Visual Size Chart Kaos Ikhwan')" style="padding: 2px 8px; font-size: 10.5px; border-radius: 5px; background: #f0f9ff; border-color: #bae6fd; color: #0369a1; cursor: pointer;">
                      <i class="fa-regular fa-image"></i> Lihat Gambar Panduan Kaos
                    </button>
                  </div>
                  <div style="font-size: 10.5px; color: #64748b; margin-bottom: 4px;">Format 1 baris per ukuran: <code>S: LB 49cm / PB 75cm / PT 20cm</code></div>
                  <textarea class="form-control card-uniform-ikhwan-size-chart" rows="7" placeholder="S: LB 49cm / PB 75cm / PT 20cm&#10;M: LB 52cm / PB 77cm / PT 21cm&#10;L: LB 55cm / PB 80cm / PT 22cm..." style="padding: 8px 10px; font-size: 12px; font-family: monospace; line-height: 1.5; resize: vertical; border-color: #bfdbfe;">${escapeHtml(uniforms.ikhwanSizeChart)}</textarea>
                  <div style="font-size: 10.5px; color: #64748b; margin-top: 3px;"><i class="fa-solid fa-circle-info text-primary"></i> <b>Keterangan:</b> LB = Lebar Badan &bull; PB = Panjang Badan &bull; PT = Panjang Tangan (Toleransi &plusmn;1-2cm)</div>
                </div>
              </div>

              <!-- Panel Akhwat -->
              <div class="settings-uniform-panel" style="background: #ffffff; border: 1.5px solid #fbcfe8; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span class="badge-gender-akhwat" style="font-size: 11px; padding: 3px 9px;">
                    <i class="fa-solid fa-venus"></i> Khusus Akhwat (Perempuan)
                  </span>
                  <span style="font-size: 11px; color: #64748b; font-weight: 600;">Model 02</span>
                </div>

                <div style="display: flex; gap: 12px; align-items: center;">
                  <div style="position: relative; width: 85px; height: 85px; border-radius: 10px; overflow: hidden; border: 1.5px solid #f472b6; background: #0b1120; flex-shrink: 0;">
                    <img id="cfg_cardUniformAkhwatThumb" src="${uniforms.akhwatImg}" alt="Preview Akhwat" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/seragam-akhwat.jpg'">
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                    <label class="btn btn-outline-cyan btn-xs" style="cursor: pointer; padding: 6px 12px; font-size: 12px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; background: #fdf2f8;">
                      <i class="fa-solid fa-cloud-arrow-up text-pink"></i> Upload Baju Akhwat
                      <input type="file" accept="image/*" style="display: none;" onchange="handleUniformSettingsUpload(event, 'akhwat', ${idx})">
                    </label>
                    <button type="button" class="btn btn-secondary btn-xs" onclick="openUniformImageLightbox(document.getElementById('cfg_cardUniformAkhwatThumb').src, 'Model Baju Akhwat')" style="padding: 4px 10px; font-size: 11px; border-radius: 6px;">
                      <i class="fa-regular fa-eye"></i> Perbesar Foto
                    </button>
                  </div>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 11.5px; margin-bottom: 3px;">URL / Link Foto Baju Akhwat</label>
                  <input type="text" class="form-control card-uniform-akhwat-img" id="cfg_cardUniformAkhwatImg" value="${escapeHtml(uniforms.akhwatImg)}" placeholder="URL foto atau klik Upload Baju Akhwat" style="padding: 6px 10px; font-size: 12px;" oninput="updateUniformThumbPreview(this, 'akhwat')">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 11.5px; margin-bottom: 3px;">Judul Model Baju Akhwat</label>
                  <input type="text" class="form-control card-uniform-akhwat-title" value="${escapeHtml(uniforms.akhwatTitle)}" placeholder="Cth: Model Kaos / Tunik Resmi Akhwat" style="padding: 6px 10px; font-size: 12px; font-weight: 600;">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" style="font-size: 11.5px; margin-bottom: 3px; font-weight: 700; color: #db2777;">
                    <i class="fa-solid fa-clipboard-list"></i> Catatan &amp; Spesifikasi Rompi Akhwat (Tampil di Kartu Akhwat)
                  </label>
                  ${getFormattingToolbarHTML('Pilih teks lalu format:')}
                  <textarea class="form-control card-uniform-akhwat-desc textarea-with-toolbar" rows="6" placeholder="Tuliskan spesifikasi model rompi/outer, keserasian, kerapian, keleluasaan bergerak untuk akhwat..." style="padding: 10px 12px; font-size: 13px; line-height: 1.5; min-height: 140px; resize: vertical;">${escapeHtml(uniforms.akhwatDesc)}</textarea>
                </div>

                <!-- Size Chart Akhwat Input -->
                <div class="form-group" style="margin: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 4px; gap: 6px;">
                    <label class="form-label" style="font-size: 11.5px; margin: 0; font-weight: 700; color: #db2777;">
                      <i class="fa-solid fa-ruler-combined"></i> Panduan Standar Ukuran Baju (Size Chart) Akhwat
                    </label>
                    <button type="button" class="btn btn-outline-secondary btn-xs" onclick="openUniformImageLightbox('https://cyqtyobzhqzmelmmpbdb.supabase.co/storage/v1/object/public/paskas%20bahagia/size-charts/size-chart-rompi-akhwat.png', 'Panduan Visual Size Chart Rompi Akhwat')" style="padding: 2px 8px; font-size: 10.5px; border-radius: 5px; background: #fdf2f8; border-color: #fbcfe8; color: #be185d; cursor: pointer;">
                      <i class="fa-regular fa-image"></i> Lihat Gambar Panduan Rompi
                    </button>
                  </div>
                  <div style="font-size: 10.5px; color: #64748b; margin-bottom: 4px;">Format 1 baris per ukuran: <code>S: LD 96cm / PB 64cm / LB 40cm</code></div>
                  <textarea class="form-control card-uniform-akhwat-size-chart" rows="7" placeholder="S: LD 96cm / PB 64cm / LB 40cm&#10;M: LD 100cm / PB 66cm / LB 42cm&#10;L: LD 104cm / PB 68cm / LB 44cm..." style="padding: 8px 10px; font-size: 12px; font-family: monospace; line-height: 1.5; resize: vertical; border-color: #fbcfe8;">${escapeHtml(uniforms.akhwatSizeChart)}</textarea>
                  <div style="font-size: 10.5px; color: #64748b; margin-top: 3px;"><i class="fa-solid fa-circle-info text-pink"></i> <b>Keterangan:</b> LD = Lingkar Dada &bull; PB = Panjang Badan &bull; LB = Lebar Bahu (Toleransi &plusmn;1-2cm)</div>
                </div>
              </div>
            </div>

            <!-- Opsional: Gambar Latar / Cover Belakang Kartu -->
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <label class="form-label" style="font-size: 11.5px; margin: 0; color: #475569;">Gambar Latar Belakang Kartu (Background Hero / Thumbnail Beranda):</label>
                <div style="font-size: 11px; color: #94a3b8;">Opsional, secara otomatis memakai foto seragam atau banner atribut.</div>
              </div>
              <div style="display: flex; gap: 6px; align-items: center; width: 100%; max-width: 380px;">
                <input type="text" class="form-control card-input-cover" value="${escapeHtml(card.coverImg || '')}" placeholder="URL foto latar kartu atau klik tombol Upload" style="padding: 5px 10px; font-size: 12px;" oninput="updateCardThumbPreview(this, ${idx})">
                <label class="btn btn-secondary btn-xs" style="cursor: pointer; padding: 5px 8px; font-size: 11px; margin: 0; white-space: nowrap;">
                  <i class="fa-solid fa-upload"></i> Upload
                  <input type="file" accept="image/*" style="display: none;" onchange="handleCardImageUpload(event, ${idx})">
                </label>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="settings-card-item-box" data-card-idx="${idx}">
        <div class="settings-card-box-header" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 240px;">
            <img src="${card.coverImg || card.thumbImg}" class="settings-card-preview-thumb" alt="${card.title}" onerror="this.src='images/rocket-convention-hall-card.jpg'">
            <div>
              <div class="settings-card-box-title" style="display: flex; align-items: center; gap: 8px;">
                <span class="settings-chip-badge" style="background: #f1f5f9; color: #334155; border: 1.5px solid #cbd5e1; font-weight: 800; font-size: 12px; padding: 2px 8px; border-radius: 6px;">
                  #${idx + 1}
                </span>
                <span>${escapeHtml(card.title)}</span>
              </div>
              <span style="font-size: 11.5px; color: #94a3b8;">${escapeHtml(card.category)}</span>
            </div>
          </div>
          ${orderControlsHTML}
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
          <label class="form-label" style="font-size: 12px; margin-bottom: 5px;">Narasi / Penjelasan Lengkap (Muncul Saat Kartu Dibuka)</label>
          ${getFormattingToolbarHTML()}
          <textarea class="form-control card-input-narration textarea-with-toolbar" rows="8" placeholder="Tuliskan narasi lengkap agenda, fasilitas, atau panduan acara..." style="padding: 12px 14px; font-size: 13.5px; line-height: 1.6; min-height: 200px; resize: vertical;">${escapeHtml(card.narration || '')}</textarea>
        </div>
      </div>
    `;
  }).join('');
}

async function handleUniformSettingsUpload(event, genderType, cardIdx) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    showToast('Ukuran file gambar maksimal 8MB.', 'warning');
    return;
  }

  showToast(`Mengunggah foto seragam ${genderType === 'ikhwan' ? 'Ikhwan' : 'Akhwat'} ke Supabase Storage...`, 'info');

  try {
    const res = await compressImageFile(file, 1600, 0.88);
    let finalUrl = res.dataUrl;
    if (window.dataService && typeof window.dataService.uploadAssetFile === 'function') {
      try {
        finalUrl = await window.dataService.uploadAssetFile(res.dataUrl, 'uniforms', `uniform-${genderType}`);
      } catch (upErr) {
        console.warn('Gagal upload seragam ke storage, memakai base64:', upErr);
      }
    }

    const key = genderType === 'ikhwan' ? 'uniform_ikhwan_image' : 'uniform_akhwat_image';
    const localKey = genderType === 'ikhwan' ? 'paskas_uniform_ikhwan_image' : 'paskas_uniform_akhwat_image';

    try {
      localStorage.setItem(localKey, finalUrl);
    } catch (err) {
      console.warn('Storage quota warning for uniform image:', err);
    }

    if (window.dataService) {
      if (typeof window.dataService.saveSettings === 'function') {
        try { await window.dataService.saveSettings({ [key]: finalUrl }); } catch (err) { }
      }
      if (typeof window.dataService.saveCloudSetting === 'function') {
        try { await window.dataService.saveCloudSetting(key, finalUrl); } catch (err) { }
      }
    }

    // Update settings thumbnail and input
    const thumbEl = document.getElementById(genderType === 'ikhwan' ? 'cfg_cardUniformIkhwanThumb' : 'cfg_cardUniformAkhwatThumb');
    if (thumbEl) thumbEl.src = finalUrl;
    const inputEl = document.getElementById(genderType === 'ikhwan' ? 'cfg_cardUniformIkhwanImg' : 'cfg_cardUniformAkhwatImg');
    if (inputEl) inputEl.value = finalUrl;

    // Also sync existing DOM elements elsewhere
    const storyImg = document.getElementById(genderType === 'ikhwan' ? 'storyUniformImgIkhwan' : 'storyUniformImgAkhwat');
    if (storyImg) storyImg.src = finalUrl;
    const cfgImg = document.getElementById(genderType === 'ikhwan' ? 'cfg_uniformIkhwanThumb' : 'cfg_uniformAkhwatThumb');
    if (cfgImg) cfgImg.src = finalUrl;

    showToast(`Foto baju ${genderType === 'ikhwan' ? 'Ikhwan' : 'Akhwat'} berhasil disimpan ke Supabase!`, 'success');
  } catch (err) {
    console.error('Gagal upload seragam:', err);
    showToast('Gagal memproses foto seragam.', 'error');
  }
}

function updateUniformThumbPreview(input, genderType) {
  const thumb = document.getElementById(genderType === 'ikhwan' ? 'cfg_cardUniformIkhwanThumb' : 'cfg_cardUniformAkhwatThumb');
  if (!thumb) return;
  const val = input.value.trim();
  if (val) {
    thumb.src = val;
    thumb.onerror = function() {
      this.onerror = null;
      this.src = genderType === 'ikhwan' ? 'images/seragam-ikhwan.jpg' : 'images/seragam-akhwat.jpg';
    };
  }
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

async function saveCardsFromSettings() {
  const saveBtn = document.querySelector('button[onclick="saveCardsFromSettings()"]');
  let origText = '';
  if (saveBtn) {
    origText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke Cloud...';
  }

  const cardElements = document.querySelectorAll('.settings-card-item-box');
  if (!cardElements.length) {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = origText; }
    return;
  }

  const total = cardElements.length;
  for (let idx = 0; idx < total; idx++) {
    const el = cardElements[idx];
    const isUniform = el.classList.contains('settings-card-uniform-mode') || 
                      (DASHBOARD_CARDS[idx] && (
                        DASHBOARD_CARDS[idx].id === 'card-4' ||
                        (DASHBOARD_CARDS[idx].title && DASHBOARD_CARDS[idx].title.toLowerCase().includes('seragam'))
                      ));

    const title = el.querySelector('.card-input-title')?.value.trim() || `Info ${idx + 1}`;
    const category = el.querySelector('.card-input-category')?.value.trim() || 'INFORMASI';
    const subtitle = el.querySelector('.card-input-subtitle')?.value.trim() || '';
    let cover = el.querySelector('.card-input-cover')?.value.trim() || '';
    let narration = el.querySelector('.card-input-narration')?.value.trim() || '';

    // Jika cover masih berupa base64, unggah langsung ke Supabase Storage (bucket 'paskas bahagia')
    if (cover && cover.startsWith('data:image/')) {
      if (window.dataService && typeof window.dataService.uploadAssetFile === 'function') {
        try {
          cover = await window.dataService.uploadAssetFile(cover, 'cards', `card-${idx + 1}`);
          const inCov = el.querySelector('.card-input-cover');
          if (inCov) inCov.value = cover;
        } catch (errCov) {
          console.warn('Gagal upload cover ke storage:', errCov);
        }
      }
    }

    if (isUniform) {
      let ikhwanImg = el.querySelector('.card-uniform-ikhwan-img')?.value.trim() || '';
      let akhwatImg = el.querySelector('.card-uniform-akhwat-img')?.value.trim() || '';
      const ikhwanTitle = el.querySelector('.card-uniform-ikhwan-title')?.value.trim() || 'Model Kaos Resmi Ikhwan';
      const akhwatTitle = el.querySelector('.card-uniform-akhwat-title')?.value.trim() || 'Model Kaos / Tunik Resmi Akhwat';
      const ikhwanDesc = el.querySelector('.card-uniform-ikhwan-desc')?.value.trim() || '';
      const akhwatDesc = el.querySelector('.card-uniform-akhwat-desc')?.value.trim() || '';
      const ikhwanSizeChart = el.querySelector('.card-uniform-ikhwan-size-chart')?.value.trim() || '';
      const akhwatSizeChart = el.querySelector('.card-uniform-akhwat-size-chart')?.value.trim() || '';

      // Upload seragam ke storage jika masih base64
      if (ikhwanImg && ikhwanImg.startsWith('data:image/')) {
        if (window.dataService && typeof window.dataService.uploadAssetFile === 'function') {
          try {
            ikhwanImg = await window.dataService.uploadAssetFile(ikhwanImg, 'uniforms', 'uniform-ikhwan');
            const inIkh = el.querySelector('.card-uniform-ikhwan-img');
            if (inIkh) inIkh.value = ikhwanImg;
          } catch (e) {}
        }
      }
      if (akhwatImg && akhwatImg.startsWith('data:image/')) {
        if (window.dataService && typeof window.dataService.uploadAssetFile === 'function') {
          try {
            akhwatImg = await window.dataService.uploadAssetFile(akhwatImg, 'uniforms', 'uniform-akhwat');
            const inAkh = el.querySelector('.card-uniform-akhwat-img');
            if (inAkh) inAkh.value = akhwatImg;
          } catch (e) {}
        }
      }

      if (ikhwanImg) localStorage.setItem('paskas_uniform_ikhwan_image', ikhwanImg);
      if (akhwatImg) localStorage.setItem('paskas_uniform_akhwat_image', akhwatImg);
      if (ikhwanTitle) localStorage.setItem('paskas_uniform_ikhwan_title', ikhwanTitle);
      if (akhwatTitle) localStorage.setItem('paskas_uniform_akhwat_title', akhwatTitle);
      if (ikhwanDesc) localStorage.setItem('paskas_uniform_ikhwan_desc', ikhwanDesc);
      if (akhwatDesc) localStorage.setItem('paskas_uniform_akhwat_desc', akhwatDesc);
      if (ikhwanSizeChart) localStorage.setItem('paskas_uniform_size_chart_ikhwan', ikhwanSizeChart);
      if (akhwatSizeChart) localStorage.setItem('paskas_uniform_size_chart_akhwat', akhwatSizeChart);

      if (window.dataService) {
        const uPayload = {
          uniform_ikhwan_image: ikhwanImg || undefined,
          uniform_akhwat_image: akhwatImg || undefined,
          uniform_title_ikhwan: ikhwanTitle,
          uniform_title_akhwat: akhwatTitle,
          uniform_desc_ikhwan: ikhwanDesc,
          uniform_desc_akhwat: akhwatDesc,
          uniform_size_chart_ikhwan: ikhwanSizeChart || undefined,
          uniform_size_chart_akhwat: akhwatSizeChart || undefined
        };
        if (typeof window.dataService.saveSettings === 'function') {
          try {
            await window.dataService.saveSettings(uPayload);
          } catch (errU) {
            console.warn('Gagal simpan spesifikasi seragam:', errU);
          }
        }
        if (typeof window.dataService.saveCloudSetting === 'function') {
          if (ikhwanSizeChart) {
            try { await window.dataService.saveCloudSetting('uniform_size_chart_ikhwan', ikhwanSizeChart); } catch (e) {}
          }
          if (akhwatSizeChart) {
            try { await window.dataService.saveCloudSetting('uniform_size_chart_akhwat', akhwatSizeChart); } catch (e) {}
          }
        }
      }

      // Prioritaskan cover kustom yang diinput user, jangan ditimpa seragam ikhwan bila sudah ada
      if (!cover) {
        cover = DASHBOARD_CARDS[idx]?.coverImg || ikhwanImg || 'images/seragam-ikhwan.jpg';
      }

      narration = `${ikhwanTitle}:\n${ikhwanDesc}\n\n${akhwatTitle}:\n${akhwatDesc}`;
    }

    if (!cover) {
      cover = DASHBOARD_CARDS[idx]?.coverImg || 'images/rocket-convention-hall.jpg';
    }

    // Auto-sanitize jika terinput link Google Maps
    cover = parseDirectImageUrl(cover);

    if (DASHBOARD_CARDS[idx]) {
      DASHBOARD_CARDS[idx].title = title;
      DASHBOARD_CARDS[idx].category = category;
      DASHBOARD_CARDS[idx].subtitle = subtitle;
      DASHBOARD_CARDS[idx].coverImg = cover || DASHBOARD_CARDS[idx].coverImg;
      DASHBOARD_CARDS[idx].thumbImg = cover || DASHBOARD_CARDS[idx].thumbImg;
      DASHBOARD_CARDS[idx].narration = narration;
      DASHBOARD_CARDS[idx].badge = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
  }

  // Pastikan tidak ada satupun cover kartu yang tertinggal sebagai Base64 sebelum disimpan
  for (let i = 0; i < DASHBOARD_CARDS.length; i++) {
    const c = DASHBOARD_CARDS[i];
    if (c.coverImg && c.coverImg.startsWith('data:image/')) {
      if (window.dataService && typeof window.dataService.uploadAssetFile === 'function') {
        try {
          c.coverImg = await window.dataService.uploadAssetFile(c.coverImg, 'cards', `card-${c.id || i + 1}`);
        } catch (e) {}
      }
    }
    if (c.thumbImg && c.thumbImg.startsWith('data:image/')) {
      c.thumbImg = c.coverImg;
    }
  }

  // Buat payload kartu yang ringkas dan bersih (tanpa HTML content lama) agar hemat kuota Supabase
  const cleanCardsPayload = DASHBOARD_CARDS.map(c => ({
    id: c.id,
    category: c.category || 'INFORMASI',
    title: c.title || '',
    subtitle: c.subtitle || '',
    badge: c.badge || '',
    coverImg: c.coverImg || '',
    thumbImg: c.thumbImg || c.coverImg || '',
    narration: c.narration || ''
  }));

  try {
    localStorage.setItem('paskas_custom_cards', JSON.stringify(cleanCardsPayload));
  } catch (e) {
    console.warn('LocalStorage limit reached for custom cards:', e);
  }

  let cloudSuccess = true;
  if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
    try {
      await window.dataService.saveCloudSetting('paskas_custom_cards', cleanCardsPayload);
    } catch (errCloud) {
      cloudSuccess = false;
      console.error('Gagal simpan kartu ke Supabase:', errCloud);
    }
  }

  // Refresh tampilan di dashboard
  currentCardIndex = 0;
  renderDashboardCards();

  // Update background hero dengan kartu pertama
  if (DASHBOARD_CARDS[0] && DASHBOARD_CARDS[0].coverImg) {
    crossfadeHeroBackground(DASHBOARD_CARDS[0].coverImg);
  }

  renderSettingsCardsManager();
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = origText;
  }
  if (cloudSuccess) {
    showToast('Alhamdulillah! Perubahan kartu informasi, seragam & narasi berhasil disimpan permanen ke Cloud Supabase!', 'success');
  } else {
    showToast('Tersimpan di browser lokal, namun sinkronisasi Cloud Supabase tertunda. Periksa koneksi internet.', 'warning');
  }
}

async function resetCardsToDefault() {
  if (confirm('Kembalikan semua kartu informasi ke pengaturan dan gambar bawaan awal?')) {
    DASHBOARD_CARDS = JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_CARDS));
    localStorage.removeItem('paskas_custom_cards');
    if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
      await window.dataService.saveCloudSetting('paskas_custom_cards', DASHBOARD_CARDS);
    }
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

  const activeLoc = REGISTRATION_CONTENT.location || (window.dataService ? window.dataService.getSettings().event_location : '') || '';
  if (locEl && activeLoc) locEl.textContent = activeLoc;
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

  const uniforms = getUniformSettings();
  const cfgIkhwan = document.getElementById('cfg_uniformIkhwanThumb');
  if (cfgIkhwan) cfgIkhwan.src = uniforms.ikhwanImg;
  const cfgAkhwat = document.getElementById('cfg_uniformAkhwatThumb');
  if (cfgAkhwat) cfgAkhwat.src = uniforms.akhwatImg;
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
    // Kompres ke resolusi optimal 900px agar tajam & sangat ringan disimpan ke Cloud Supabase
    const res = await compressImageFile(file, 900, 0.8);

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

    showToast(`Foto polaroid #${idx + 1} siap! Klik 'Simpan Lokasi, Narasi & Foto' untuk menyimpan permanen ke Cloud.`, 'success');
  } catch (err) {
    console.error('Gagal upload foto polaroid:', err);
    showToast('Gagal memproses file foto. Pastikan format file gambar valid.', 'error');
  }
}

async function saveRegistrationContent() {
  const saveBtn = document.querySelector('button[onclick="saveRegistrationContent()"]');
  let origText = '';
  if (saveBtn) {
    origText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke Cloud...';
  }

  try {
    const locationVal = (document.getElementById('cfg_regLocation')?.value || '').trim();
    const kicker = (document.getElementById('cfg_regKicker')?.value || '').trim();
    const title = (document.getElementById('cfg_regTitle')?.value || '').trim();
    const narration = (document.getElementById('cfg_regNarration')?.value || '').trim();

    // Ambil semua input foto yang dinamis dari DOM
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

    // 1. Simpan permanen ke Cloud Supabase dan TUNGGU sampai tuntas
    if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
      await window.dataService.saveCloudSetting('paskas_reg_content', REGISTRATION_CONTENT);
    }

    // 2. Simpan ke LocalStorage sebagai cadangan cepat
    try {
      localStorage.setItem('paskas_reg_content', JSON.stringify(REGISTRATION_CONTENT));
    } catch (lsErr) {
      console.warn('LocalStorage limit reached, data tetap aman di Cloud Supabase:', lsErr);
    }

    // 3. Sinkronkan juga event_location di pengaturan sistem
    if (window.dataService && typeof window.dataService.saveSettings === 'function') {
      await window.dataService.saveSettings({ event_location: REGISTRATION_CONTENT.location });
      const evLocInput = document.getElementById('cfg_eventLocation');
      if (evLocInput) evLocInput.value = REGISTRATION_CONTENT.location;
    }

    renderRegistrationPageContent();
    renderHangingPhotosSettingsManager();
    showToast('Alhamdulillah! Lokasi, narasi & foto polaroid berhasil disimpan permanen ke Cloud Supabase!', 'success');
  } catch (e) {
    console.error('Gagal menyimpan paskas_reg_content:', e);
    showToast('Gagal menyimpan ke Cloud Supabase: ' + (e.message || e), 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = origText;
    }
  }
}

async function resetRegistrationContent() {
  if (confirm('Kembalikan lokasi, narasi dan galeri foto polaroid registrasi ke setelan awal?')) {
    REGISTRATION_CONTENT = JSON.parse(JSON.stringify(DEFAULT_REGISTRATION_CONTENT));
    localStorage.removeItem('paskas_reg_content');
    if (window.dataService && typeof window.dataService.saveCloudSetting === 'function') {
      await window.dataService.saveCloudSetting('paskas_reg_content', REGISTRATION_CONTENT);
    }
    if (window.dataService && typeof window.dataService.saveSettings === 'function') {
      await window.dataService.saveSettings({ event_location: DEFAULT_REGISTRATION_CONTENT.location });
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

// ===================================================================
// AUTO-LOCK SESI ADMIN (15 Menit Inactivity Timeout)
// ===================================================================
let adminInactivityTimer = null;
const ADMIN_INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 menit

function resetAdminInactivityTimer() {
  if (adminInactivityTimer) clearTimeout(adminInactivityTimer);
  if (!isAdminLoggedIn) return;

  adminInactivityTimer = setTimeout(() => {
    if (isAdminLoggedIn) {
      lockAdminSession();
      showToast('Sesi administrator telah dikunci otomatis karena tidak ada aktivitas selama 15 menit.', 'warning');
    }
  }, ADMIN_INACTIVITY_LIMIT_MS);
}

function clearAdminInactivityTimer() {
  if (adminInactivityTimer) {
    clearTimeout(adminInactivityTimer);
    adminInactivityTimer = null;
  }
}

function initAdminActivityTracker() {
  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
  events.forEach(evt => {
    window.addEventListener(evt, () => {
      if (isAdminLoggedIn) resetAdminInactivityTimer();
    }, { passive: true });
  });
}

// ===================================================================
// PROTEKSI ANTI-INSPECT GUARD (Anti-F12, Anti-Right Click, Anti-DevTools)
// ===================================================================
function initAntiInspectGuard() {
  // 1. Blokir Klik Kanan (Context Menu)
  document.addEventListener('contextmenu', function(e) {
    // Jika admin terverifikasi sedang login, beri keleluasaan
    if (isAdminLoggedIn) return;

    e.preventDefault();
    showToast('Klik kanan dinonaktifkan demi kenyamanan & keamanan sistem.', 'info');
    return false;
  }, false);

  // 2. Blokir Shortcut DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
  document.addEventListener('keydown', function(e) {
    if (isAdminLoggedIn) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const key = e.key ? e.key.toLowerCase() : '';
    const code = e.keyCode || e.which;

    // F12
    if (key === 'f12' || code === 123) {
      e.preventDefault();
      e.stopPropagation();
      showToast('Akses Developer Tools (F12) dinonaktifkan.', 'warning');
      return false;
    }

    // Ctrl+Shift+I (Inspector) / Ctrl+Shift+J (Console) / Ctrl+Shift+C (Inspect Element)
    if (isCtrlOrCmd && isShift && (key === 'i' || key === 'j' || key === 'c' || code === 73 || code === 74 || code === 67)) {
      e.preventDefault();
      e.stopPropagation();
      showToast('Akses Developer Tools dinonaktifkan.', 'warning');
      return false;
    }

    // Ctrl+U (View Source)
    if (isCtrlOrCmd && (key === 'u' || code === 85)) {
      e.preventDefault();
      e.stopPropagation();
      showToast('Fitur View Source dinonaktifkan.', 'warning');
      return false;
    }

    // Ctrl+S (Save Page)
    if (isCtrlOrCmd && (key === 's' || code === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, false);

  // 3. Kebersihan Console Log di Lingkungan Produksi
  try {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      const banner = () => {
        console.clear();
        console.log('%cSTOP!', 'color: red; font-size: 32px; font-weight: bold;');
        console.log('%cArea ini adalah konsol peramban web resmi Registrasi PASKAS BAHAGIA. Seluruh aktivitas dan perubahan tidak sah dipantau sistem.', 'color: #38bdf8; font-size: 13px;');
      };
      banner();
    }
  } catch (err) {}
}

// Inisialisasi perlindungan otomatis saat skrip dimuat
initAdminActivityTracker();
initAntiInspectGuard();

// Export fungsi pembantu format teks narasi & pengatur urutan kartu
window.renderFormattedNarrationHTML = renderFormattedNarrationHTML;
window.applyTextFormatting = applyTextFormatting;
window.moveCardUp = moveCardUp;
window.moveCardDown = moveCardDown;
window.moveCardToPosition = moveCardToPosition;

