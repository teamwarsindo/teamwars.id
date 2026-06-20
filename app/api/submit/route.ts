import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Terima data dari browser pengunjung
    const payload = await request.json();

    // 2. Server Vercel yang mengirimkan data ke Google (URL aman dari publik)
    const googleRes = await fetch(process.env.APPSCRIPT_URL as string, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const result = await googleRes.json();

    // 3. Kembalikan status sukses/gagal ke browser pengunjung
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Gagal terhubung ke sistem." },
      { status: 500 }
    );
  }
}
