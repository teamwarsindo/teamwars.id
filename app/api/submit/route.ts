// app/api/submit/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';
import { kv } from '@vercel/kv';
import { EMAIL_CONFIG } from '@/lib/config';

// Import template yang sudah kita pisahkan
import { 
  getPesertaTemplate, 
  getFinanceTemplate, 
  getCreativeTemplate, 
  getAdminTemplate 
} from '@/lib/email-templates'; 

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmailSafe(params: any) {
  try {
    await resend.emails.send(params);
  } catch (error) {
    console.error(`Gagal kirim email ke ${params.to}:`, error);
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const data = await request.json();
    const { email, namaTim, warna, logoTim, buktiTransfer, players } = data; 

    if (!namaTim) {
      return NextResponse.json({ success: false, message: "Nama tim tidak boleh kosong." }, { status: 400 });
    }

    const teamSlug = namaTim.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const kvKey = `teams:${teamSlug}`;

    const exists = await kv.exists(kvKey);
    if (exists) {
      return NextResponse.json({ success: false, message: "Nama tim sudah terdaftar!" }, { status: 409 });
    }

    await kv.hset(kvKey, {
      namaTim: namaTim.trim(),
      warna: warna,
      email: email.trim(),
      logoTim: JSON.stringify(logoTim),
      buktiTransfer: JSON.stringify(buktiTransfer),
      players: JSON.stringify(players),
      createdAt: new Date().toISOString(),
      statusVerifikasi: "Pending"
    });
    await kv.sadd("global:teams", teamSlug);

    const ketua = players.find((p: any) => p.role === "Ketua") || { namaLengkap: "-", discord: "-", idDuelLinks: "-" };
    const wakil = players.find((p: any) => p.role === "Wakil Ketua") || { namaLengkap: "-", discord: "-", idDuelLinks: "-" };

    // Kumpulkan semua data untuk dilempar ke template
    const templateData = { namaTim, email, warna, ketua, wakil, logoTim, buktiTransfer, players, kvKey };

    context.waitUntil((async () => {
      if (email) {
        await sendEmailSafe({
          from: EMAIL_CONFIG.sender,
          to: email,
          subject: `Pendaftaran Berhasil: Tim ${namaTim}`,
          html: getPesertaTemplate(templateData), // <-- Panggil fungsi di sini
        });
      }

      await sendEmailSafe({
        from: EMAIL_CONFIG.sender,
        to: EMAIL_CONFIG.to.finance,
        subject: `[Verifikasi Pembayaran] Tim ${namaTim}`,
        html: getFinanceTemplate(templateData), // <-- Panggil fungsi di sini
      });

      await sendEmailSafe({
        from: EMAIL_CONFIG.sender,
        to: EMAIL_CONFIG.to.creative,
        subject: `[Aset Logo] Tim ${namaTim}`,
        html: getCreativeTemplate(templateData), // <-- Panggil fungsi di sini
      });

      await sendEmailSafe({
        from: EMAIL_CONFIG.sender,
        to: EMAIL_CONFIG.to.admin,
        subject: `[Registrasi Baru] Data Lengkap Tim ${namaTim}`,
        html: getAdminTemplate(templateData), // <-- Panggil fungsi di sini
      });
    })());

    return NextResponse.json({ success: true, message: "Pendaftaran berhasil diproses!" });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
