/**
 * ===================================================================
 * GOOGLE APPS SCRIPT - PASKAS BAHAGIA EMAIL SENDER & CLOUD DRIVE
 * ===================================================================
 * Script ini digunakan untuk:
 * 1. Mengirim email tiket resmi otomatis dari akun panitia, lengkap dengan
 *    gambar E-Tiket Boarding Pass (HD) terlampir dan inline di pesan email.
 * 2. Menyimpan Pas Foto peserta secara otomatis ke Google Drive Cloud
 *    Folder Resmi Panitia (Folder ID: 1w7EiZOVPhktP6EW-kjdaASG6en1BpLyd).
 *
 * CARA MEMASANG / UPDATE DI GOOGLE APPS SCRIPT:
 * 1. Buka https://script.google.com
 * 2. Buka proyek Anda (Paskas Bahagia)
 * 3. Hapus semua teks di Code.gs, lalu tempel (paste) seluruh isi kode ini.
 * 4. Klik ikon Simpan (Disket) atau tekan Ctrl + S.
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas -> pilih "Kelola penerapan" (Manage deployments).
 * 6. Klik ikon Pensil (Edit) pada deployment aktif.
 * 7. Di bagian "Versi", pilih "Versi baru" (New version).
 * 8. Pastikan:
 *    - Jalankan sebagai (Execute as): "Saya" (email Anda)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone)
 * 9. Klik "Terapkan" (Deploy).
 * 10. Selesai!
 */

var DRIVE_PHOTO_FOLDER_ID = "1w7EiZOVPhktP6EW-kjdaASG6en1BpLyd";

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

    var action = (data.action || "").toLowerCase();
    var toEmail = data.to_email || data.email || data.destEmail;
    var toName = data.to_name || data.name || "Peserta";
    var subject = data.subject || "[E-TIKET RESMI] Silaturahmi Akbar Paskas Bahagia";
    var plainMessage = data.message || data.body || "Alhamdulillah pendaftaran Anda telah berhasil kami terima.";
    var regCode = data.registration_code || "-";

    // 1. PENYIMPANAN PAS FOTO KE GOOGLE DRIVE CLOUD
    var photoDriveUrl = "";
    var rawPhoto = data.photo_base64 || data.photo_data || "";
    if (rawPhoto && typeof rawPhoto === "string") {
      try {
        var cleanPhotoBase64 = rawPhoto.replace(/^data:image\/[a-z]+;base64,/, "");
        var photoBlob = Utilities.newBlob(Utilities.base64Decode(cleanPhotoBase64), "image/jpeg", "Foto_" + regCode + "_" + toName.replace(/[^a-zA-Z0-9]/g, "_") + ".jpg");
        var folder = DriveApp.getFolderById(DRIVE_PHOTO_FOLDER_ID);
        var file = folder.createFile(photoBlob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        photoDriveUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
      } catch (driveErr) {
        // Fallback jika id folder tidak ditemukan, simpan ke root Drive panitia
        try {
          var cleanPhotoBase64 = rawPhoto.replace(/^data:image\/[a-z]+;base64,/, "");
          var photoBlob = Utilities.newBlob(Utilities.base64Decode(cleanPhotoBase64), "image/jpeg", "Foto_" + regCode + "_" + toName.replace(/[^a-zA-Z0-9]/g, "_") + ".jpg");
          var file = DriveApp.createFile(photoBlob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          photoDriveUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
        } catch (subDriveErr) {
          photoDriveUrl = "";
        }
      }
    }

    // Jika pemanggilan khusus hanya untuk upload foto ke Drive
    if (action === "upload_photo") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        photo_url: photoDriveUrl,
        message: "Pas foto berhasil diunggah dan disimpan ke Google Drive panitia."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. VALIDASI TUJUAN EMAIL
    if (!toEmail) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Email tujuan tidak ditemukan."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Ekstrak & Buat File Blob Gambar Tiket jika dikirimkan oleh web
    var imageBlob = null;
    var rawImg = data.image_base64 || data.ticket_image || "";
    if (rawImg && typeof rawImg === "string") {
      try {
        var cleanBase64 = rawImg.replace(/^data:image\/[a-z]+;base64,/, "");
        imageBlob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), "image/png", "E-Tiket_" + regCode + ".png");
      } catch (blobErr) {
        imageBlob = null;
      }
    }

    // Bagian tampilan gambar tiket di dalam badan email
    var imageHtmlSection = "";
    if (imageBlob) {
      imageHtmlSection = `
        <div style="text-align: center; margin: 24px 0 16px;">
          <p style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px;">KARTU E-TIKET BOARDING PASS ANDA:</p>
          <img src="cid:ticketCardImage" style="max-width: 100%; height: auto; border-radius: 10px; border: 1px solid #cbd5e1; box-shadow: 0 6px 18px rgba(0,0,0,0.15); display: inline-block;" alt="E-Tiket Boarding Pass Paskas" />
          <p style="font-size: 12px; color: #64748b; margin: 8px 0 0;">(Gambar tiket resmi juga kami lampirkan di bawah pesan ini agar mudah disimpan)</p>
        </div>
      `;
    }

    // Format Email HTML Mewah & Rapi
    var htmlBody = `
      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
        <!-- Kop Email -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 28px; text-align: center; border-bottom: 3px solid #f59e0b;">
          <div style="display: inline-block; padding: 6px 14px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 20px; font-size: 12px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
            MUNZALAN AIRLINES &bull; KUMPUL KELUARGA
          </div>
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">
            SILATURAHMI AKBAR PASKAS BAHAGIA
          </h1>
          <p style="color: #94a3b8; font-size: 13.5px; margin: 0;">
            Surat Tanda Masuk Resmi & E-Tiket Boarding Pass Jamaah
          </p>
        </div>

        <!-- Badan Pesan -->
        <div style="padding: 32px 28px 24px; color: #334155; line-height: 1.65; font-size: 14.5px;">
          <p style="margin-top: 0;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
          <p>Yth. Saudaraku <strong>${toName}</strong>,</p>
          <p style="color: #475569;">
            ${plainMessage.replace(/\n/g, '<br>')}
          </p>

          ${imageHtmlSection}

          <div style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 24px 0 16px;">
            <p style="margin: 0; font-size: 13px; color: #475569;">
              <strong>Pemberitahuan:</strong> Kartu Boarding Pass di atas merupakan bukti kepesertaan resmi. Mohon simpan file gambar yang kami lampirkan untuk kemudahan registrasi ulang di lokasi silaturahmi.
            </p>
          </div>

          <p style="margin-bottom: 0;">Jazakumullah Khairan Katsiran,<br>
          <strong style="color: #0f172a;">Panitia Kumpul Keluarga Paskas Bahagia</strong></p>
        </div>

        <!-- Footer Email -->
        <div style="background: #f1f5f9; padding: 18px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Email ini dikirimkan secara otomatis oleh Sistem Registrasi Paskas Bahagia.<br>
          &copy; 2026 Panitia Silaturahmi Akbar Paskas Bahagia. Seluruh Hak Cipta Dilindungi.
        </div>
      </div>
    `;

    var emailOptions = {
      to: toEmail,
      subject: subject,
      body: plainMessage + "\n\n(E-Tiket resmi dilampirkan pada email ini)",
      htmlBody: htmlBody
    };

    if (imageBlob) {
      emailOptions.attachments = [imageBlob];
      emailOptions.inlineImages = {
        ticketCardImage: imageBlob
      };
    }

    MailApp.sendEmail(emailOptions);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      has_image: !!imageBlob,
      photo_drive_url: photoDriveUrl,
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
  var user = "";
  var quota = -1;
  try {
    user = Session.getEffectiveUser().getEmail();
    quota = MailApp.getRemainingDailyQuota();
  } catch (err) {}

  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    sender: user,
    remaining_quota: quota,
    message: "Layanan Email & Cloud Photo Drive Paskas Bahagia Berjalan Normal"
  })).setMimeType(ContentService.MimeType.JSON);
}
