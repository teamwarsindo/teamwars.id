export const getPesertaTemplate = ({ namaTim, warna, ketua, wakil, logoTim, buktiTransfer, players }: any) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: ${warna || '#1e293b'}; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Pendaftaran TWI Season 7 Berhasil!</h1>
    </div>
    <div style="padding: 30px; color: #334155;">
      <p style="font-size: 16px; margin-top: 0;">Halo, <strong>Tim ${namaTim}</strong>! 🎉</p>
      <p style="font-size: 15px; line-height: 1.6;">Terima kasih telah mendaftar di <strong>Teamwars Indonesia Season 7</strong>. Sistem kami telah menerima formulir pendaftaran Anda. Berikut adalah ringkasan data yang Anda berikan:</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Ringkasan Tim</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; width: 40%;"><strong>Nama Tim</strong></td><td>: <span style="color: ${warna || '#000'}; font-weight: bold;">${namaTim}</span></td></tr>
          <tr><td style="padding: 8px 0;"><strong>Ketua (Discord)</strong></td><td>: ${ketua.namaLengkap} (${ketua.discord})</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Wakil (Discord)</strong></td><td>: ${wakil.namaLengkap} (${wakil.discord})</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Kode Warna</strong></td><td>: <span style="background-color: ${warna || '#ccc'}; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${warna || '-'}</span></td></tr>
        </table>

        <div style="margin-top: 20px; display: flex; gap: 15px;">
          <div style="flex: 1; text-align: center; background: #fff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px;">
            <p style="font-size: 12px; font-weight: bold; margin-top: 0; color: #64748b;">Logo Tim</p>
            <img src="${logoTim?.compressed}" alt="Logo Tim" style="max-width: 100%; height: auto; max-height: 100px; object-fit: contain;" />
          </div>
          <div style="flex: 1; text-align: center; background: #fff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px;">
            <p style="font-size: 12px; font-weight: bold; margin-top: 0; color: #64748b;">Bukti Transfer</p>
            <img src="${buktiTransfer?.compressed}" alt="Bukti Transfer" style="max-width: 100%; height: auto; max-height: 100px; object-fit: contain;" />
          </div>
        </div>
      </div>

      <h3 style="color: #0f172a; margin-bottom: 10px;">Daftar Roster</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="background-color: #e2e8f0; color: #475569;">
            <th style="padding: 10px; border: 1px solid #cbd5e1;">Role</th>
            <th style="padding: 10px; border: 1px solid #cbd5e1;">Nama</th>
            <th style="padding: 10px; border: 1px solid #cbd5e1;">IGN</th>
          </tr>
        </thead>
        <tbody>
          ${players.map((p: any) => `
            <tr>
              <td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-weight: bold;">${p.role}</td>
              <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${p.namaLengkap}</td>
              <td style="padding: 8px 10px; border: 1px solid #cbd5e1;">${p.ign}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="font-size: 14px; margin-top: 25px; line-height: 1.6;">Tim Admin & Finance kami akan segera memverifikasi dokumen Anda. Harap pastikan akun Discord yang terdaftar tetap aktif untuk koordinasi.</p>
    </div>
    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">Maju terus dan persiapkan strategi terbaik tim Anda!</p>
      <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">&copy; 2026 Teamwars Indonesia. All rights reserved.</p>
    </div>
  </div>
`;

export const getFinanceTemplate = ({ namaTim, ketua, buktiTransfer }: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #10b981; padding: 20px; text-align: center;">
      <h2 style="color: white; margin: 0;">💰 Cek Pembayaran Baru</h2>
    </div>
    <div style="padding: 25px; background-color: #f8fafc;">
      <p style="margin-top: 0;">Tim <strong>${namaTim}</strong> baru saja melakukan pendaftaran. Mohon segera periksa mutasi rekening.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border: 1px solid #e2e8f0;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; width: 120px;"><strong>Nama Tim</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${namaTim}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Ketua</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${ketua.namaLengkap} (${ketua.discord})</td></tr>
      </table>
      <div style="text-align: center; margin-top: 25px;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 10px;">Klik tombol di bawah untuk melihat bukti transfer resolusi penuh:</p>
        <a href="${buktiTransfer?.original}" target="_blank" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Lihat Bukti Transfer (Original)</a>
      </div>
    </div>
  </div>
`;

export const getCreativeTemplate = ({ namaTim, warna, logoTim }: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #8b5cf6; padding: 20px; text-align: center;">
      <h2 style="color: white; margin: 0;">🎨 Aset Logo Tim Baru</h2>
    </div>
    <div style="padding: 25px; background-color: #f8fafc;">
      <p style="margin-top: 0;">Tim <strong>${namaTim}</strong> telah mendaftar. Berikut adalah aset identitas mereka untuk kebutuhan broadcast/grafis.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border: 1px solid #e2e8f0;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; width: 120px;"><strong>Nama Tim</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${namaTim}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Kode Warna</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><span style="display:inline-block; width:15px; height:15px; background:${warna}; vertical-align:middle; margin-right:5px; border:1px solid #cbd5e1;"></span> <code>${warna}</code></td></tr>
      </table>
      <div style="text-align: center; margin-top: 25px;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 10px;">Klik tombol di bawah untuk mendownload logo mentah resolusi penuh:</p>
        <a href="${logoTim?.original}" target="_blank" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Download Logo (Original)</a>
      </div>
    </div>
  </div>
`;

export const getAdminTemplate = ({ namaTim, email, warna, ketua, kvKey, players }: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #333;">
    <div style="background-color: #ef4444; padding: 15px 20px; border-radius: 6px 6px 0 0;">
      <h2 style="color: white; margin: 0;">🚨 Pendaftar Baru: ${namaTim}</h2>
    </div>
    <div style="border: 1px solid #ddd; padding: 20px; border-top: none; border-radius: 0 0 6px 6px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee; width: 150px; color: #666;">Nama Tim</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${namaTim}</strong></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Email Kontak</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Ketua</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${ketua.namaLengkap} <code>(${ketua.discord})</code></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Kode Warna</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="display:inline-block; width:15px; height:15px; background:${warna}; vertical-align:middle; margin-right:5px; border:1px solid #000;"></span> <code>${warna}</code></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">KV Key</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><code style="background:#f4f4f5; padding:3px 6px; border-radius:4px;">${kvKey}</code></td></tr>
      </table>
      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Roster Lengkap</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead style="background-color: #f8fafc;">
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd;">No</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Role</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Nama & Discord</th>
            <th style="padding: 10px; border: 1px solid #ddd;">IGN & ID</th>
          </tr>
        </thead>
        <tbody>
          ${players.map((p: any, i: number) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${i + 1}</td>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>${p.role}</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${p.namaLengkap}<br/><code style="color:#2563eb;">${p.discord}</code></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${p.ign}<br/><code style="color:#059669;">${p.idDuelLinks}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
`;
