/**
 * ===================================================================
 * GOOGLE APPS SCRIPT - PASKAS BAHAGIA EMAIL SENDER
 * ===================================================================
 * Script ini digunakan untuk mengirim email tiket resmi secara otomatis
 * dari akun Gmail panitia (misal: paskasbahagia@gmail.com) tanpa biaya.
 *
 * CARA MEMASANG / UPDATE DI GOOGLE APPS SCRIPT:
 * 1. Buka https://script.google.com
 * 2. Buka proyek Anda (atau klik "+ Proyek baru")
 * 3. Hapus semua teks di Code.gs, lalu tempel (paste) seluruh isi kode di bawah ini.
 * 4. Klik ikon Simpan (Disket) atau tekan Ctrl + S.
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas -> pilih "Kelola penerapan" (Manage deployments).
 * 6. Klik ikon Pensil (Edit).
 * 7. Di bagian "Versi", pilih "Versi baru" (New version).
 * 8. Pastikan:
 *    - Jalankan sebagai (Execute as): "Saya" (email Anda)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone)
 * 9. Klik "Terapkan" (Deploy).
 * 10. Jika muncul permintaan izin ("Authorization Required"), klik "Tinjau Izin" -> 
 *     pilih email Anda -> klik "Advanced" -> klik "Go to Untitled project (unsafe)" -> klik "Allow".
 * 11. Selesai! URL Web App Anda sudah aktif dan terhubung selamanya.
 */

function doPost(e) {
  try {
    var raw = e && e.postData ? e.postData.contents : "";
    var data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var toEmail = data.to_email || data.email || data.destEmail;
    var toName = data.to_name || data.name || "Peserta";
    var subject = data.subject || "[E-TIKET RESMI] Silaturahmi Akbar Paskas Bahagia";
    var plainMessage = data.message || data.body || "Alhamdulillah pendaftaran Anda telah berhasil kami terima.";
    var regCode = data.registration_code || "-";

    if (!toEmail) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Email tujuan tidak ditemukan."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Format Email HTML Mewah & Rapi
    var htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #183a27, #0f2519); padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px; color: #fbbf24;">KUMPUL KELUARGA PASKAS BAHAGIA</h2>
          <p style="margin: 6px 0 0; font-size: 13px; color: #cbd5e1;">Bukti Registrasi & E-Tiket Boarding Pass Resmi</p>
        </div>
        
        <div style="padding: 24px;">
          <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Nomor Registrasi Resmi</span>
            <div style="font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 0.5px;">${regCode}</div>
          </div>

          <p style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line; margin: 0 0 20px;">
            ${plainMessage}
          </p>

          <div style="background: #fffbeb; border: 1px dashed #f59e0b; padding: 14px 16px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; font-size: 12.5px; color: #92400e; font-weight: 600;">
              Simpan bukti registrasi ini atau unduh E-Tiket Anda untuk ditunjukkan kepada panitia saat kedatangan di lokasi acara.
            </p>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Silaturahmi Akbar Pasukan Amal Sholeh (PASKAS) &bull; Yogyakarta 2026
        </div>
      </div>
    `;

    // Eksekusi pengiriman email via kuota resmi Gmail
    MailApp.sendEmail({
      to: toEmail,
      subject: subject,
      body: plainMessage,
      htmlBody: htmlBody,
      name: "Paskas Bahagia"
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Email berhasil dikirim ke " + toEmail
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Layanan Email Paskas Bahagia Berjalan Normal"
  })).setMimeType(ContentService.MimeType.JSON);
}
