import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inisialisasi Resend menggunakan API Key dari .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. KIRIM DATA KE GOOGLE APPS SCRIPT DULU
    const scriptUrl = process.env.APPSCRIPT_URL;
    if (!scriptUrl) throw new Error("APPSCRIPT_URL is not defined");

    const appScriptResponse = await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!appScriptResponse.ok) {
      throw new Error("Gagal menyimpan data ke Google Sheets");
    }

    // 2. JIKA BERHASIL KE SHEETS, KIRIM EMAIL VIA RESEND
    // Pastikan data form memiliki 'email' dan 'namaTim'
    const { email, namaTim } = data; 

    if (email) {
      await resend.emails.send({
        from: 'Team Wars Indonesia <regist@teamwars.web.id>', // Gunakan email/domain yang sudah kamu verifikasi di Resend
        to: email, // Email peserta yang didapat dari form
        subject: `Pendaftaran Berhasil: Tim ${namaTim}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Halo, Tim ${namaTim}! 🎉</h2>
            <p>Terima kasih telah mendaftar di TWI Season 7 - Duel Links.</p>
            <p>Data pendaftaran dan bukti transfer Anda telah kami terima dan akan segera diproses oleh panitia.</p>
            <br/>
            <p><strong>Apa selanjutnya?</strong></p>
            <ul>
              <li>Pastikan seluruh anggota tim telah bergabung di server Discord kami.</li>
              <li>Tunggu informasi selanjutnya.</li>
            </ul>
            <br/>
            <p>Salam hangat,<br/>Panitia TWI Season 7</p>
          </div>
        `,
      });
    }

    // 3. KEMBALIKAN RESPONSE SUKSES KE FRONTEND
    return NextResponse.json({ success: true, message: "Pendaftaran dan Email berhasil!" });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
