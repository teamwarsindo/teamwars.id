// ==========================================
// BACK-END: TEAM WARS INDONESIA SEASON 7
// ==========================================
// Konfigurasi ID Google
const SHEET_ID = "1HbfBnE02sJ1R5iwEgP5ooakqHeyXq-Kk9MGP3X78964";
const LOGO_FOLDER_ID = "1n9ObOT_lfGqn_AjpRwhnVXJztJ2KRzw6"; 
const BUKTI_FOLDER_ID = "1PfGUhStd7sw-lOtUbVKaVXYoZzXSKNCP"; 

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const db = SpreadsheetApp.openById(SHEET_ID);
    
    setupSheetsOtomatis(db);
    
    const sheetTim = db.getSheetByName("Data Tim");
    const sheetPeserta = db.getSheetByName("Peserta");
    
    // 1. Validasi Duplikat & Case-Sensitivity
    const pesertaData = sheetPeserta.getDataRange().getValues();
    for (let i = 1; i < pesertaData.length; i++) {
      if (pesertaData[i][1].toString().toLowerCase() === data.teamName.toLowerCase()) {
        return createResponse("error", "Nama Tim sudah terdaftar!");
      }
      for (let p of data.roster) {
        if (pesertaData[i][5].toString().toLowerCase() === p.ign.toLowerCase() || 
            pesertaData[i][6].toString() === p.duelLinksId) {
          return createResponse("error", `Pemain dengan IGN/ID (${p.ign}) sudah terdaftar!`);
        }
      }
    }

    // 2. Sanitasi Nama & Upload ke GDrive
    const safeTeamName = data.teamName.replace(/[^a-zA-Z0-9]/g, "_"); 
    const logoUrl = saveFileToDrive(data.logoBase64, `Logo_${safeTeamName}`, LOGO_FOLDER_ID);
    const buktiUrl = saveFileToDrive(data.buktiBase64, `Bukti_${safeTeamName}`, BUKTI_FOLDER_ID);
    const timestamp = new Date();

    // 3. Simpan ke Sheet
    sheetTim.appendRow([timestamp, data.teamName, data.hexCode, logoUrl, buktiUrl, data.email, data.roster.length, "Menunggu Verifikasi", ""]);
    data.roster.forEach(pemain => {
      sheetPeserta.appendRow([timestamp, data.teamName, pemain.role, pemain.namaAsli, pemain.discord, pemain.ign, pemain.duelLinksId, "Belum Terafiliasi"]);
    });

    // 4. Notifikasi Email ke Admin
    GmailApp.sendEmail(Session.getActiveUser().getEmail(), 
      `🚨 [Pendaftar Baru TWI S7] Tim ${data.teamName}`, 
      `Ada pendaftar baru! Tim ${data.teamName} dengan ${data.roster.length} pemain. Cek GSheet sekarang.`, 
      { name: "Sistem TWI" }
    );

    return createResponse("success", "Pendaftaran Berhasil!");

  } catch (error) {
    return createResponse("error", error.toString());
  }
}

// ==========================================
// TRIGGER OTOMATIS: KIRIM EMAIL ZOHO KE PESERTA
// ==========================================
function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== "Data Tim") return;
  
  const row = e.range.getRow();
  if (e.range.getColumn() === 8 && row > 1) { 
    if (e.value === "Terverifikasi" && sheet.getRange(row, 9).getValue() !== "Sudah") {
      const namaTim = sheet.getRange(row, 2).getValue();
      const emailPeserta = sheet.getRange(row, 6).getValue();
      
      const subject = `✅ Pendaftaran Terverifikasi: Selamat Datang di TWI Season 7!`;
      const body = `Halo Kapten Tim ${namaTim},\n\nPembayaran Anda telah kami terima dan diverifikasi. Selamat! Tim Anda resmi terdaftar sebagai peserta TWI Season 7.\n\nLANGKAH WAJIB:\nSilakan bergabung dengan Discord resmi kami:\n👉 https://discord.gg/hTJJRevA43\n\nJika butuh bantuan, DM Admin via Discord ke username: tsaqif.mtz\n\nSalam Esports,\nPanitia Team Wars Indonesia Season 7`;
      
      try {
        GmailApp.sendEmail(emailPeserta, subject, body, {
          from: "admin@twindo.dev",
          name: "Panitia TWI Season 7"
        });
        sheet.getRange(row, 9).setValue("Sudah");
      } catch (err) {
        sheet.getRange(row, 9).setValue("Gagal Kirim");
      }
    }
  }
}

// FUNGSI PENDUKUNG
function createResponse(status, message) {
  return ContentService.createTextOutput(JSON.stringify({ status, message })).setMimeType(ContentService.MimeType.JSON);
}
function saveFileToDrive(base64Data, fileName, folderId) {
  if (!base64Data) return "";
  const folder = DriveApp.getFolderById(folderId);
  const contentType = base64Data.substring(5, base64Data.indexOf(';'));
  const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
  return folder.createFile(Utilities.newBlob(bytes, contentType, fileName)).getUrl();
}
function setupSheetsOtomatis(db) {
  let sheetTim = db.getSheetByName("Data Tim");
  if (!sheetTim) {
    let s = db.getSheets()[0]; s.setName("Data Tim");
    s.appendRow(["Timestamp", "Nama Tim", "Hex Code", "Logo URL", "Bukti URL", "Email Perwakilan", "Jml Pemain", "Status Bayar", "Email Terkirim?"]);
    s.getRange("A1:I1").setFontWeight("bold").setBackground("#f3f4f6"); s.setFrozenRows(1);
  }
  let sheetPeserta = db.getSheetByName("Peserta");
  if (!sheetPeserta) {
    let p = db.insertSheet("Peserta");
    p.appendRow(["Timestamp", "Nama Tim", "Peran", "Nama Asli", "Discord", "IGN", "ID Duel Links", "Status Discord"]);
    p.getRange("A1:H1").setFontWeight("bold").setBackground("#f3f4f6"); p.setFrozenRows(1);
  }
}
