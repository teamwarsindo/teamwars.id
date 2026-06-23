import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Tentukan Waktu Buka Registrasi (SERVER-SIDE TRUTH)
// Format ISO 8601 dengan zona waktu (+07:00 untuk WIB)
// Sesuaikan dengan waktu asli turnamen Anda
const LAUNCH_TARGET_MS = new Date("2026-07-01T12:00:00+07:00").getTime();

export function middleware(request: NextRequest) {
  const now = Date.now();
  const { pathname } = request.nextUrl;

  // Jika waktu saat ini MASA BELUM BUKA
  if (now < LAUNCH_TARGET_MS) {
    
    // A. Proteksi Halaman UI (Mencegah tembak URL /register langsung)
    if (pathname.startsWith('/register')) {
      // Tendang (redirect) balik ke halaman utama (landing page)
      // Tambahkan parameter ?error=not_open agar UI landing page bisa menampilkan Toast/Alert
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'not_open');
      
      return NextResponse.redirect(url);
    }

    // B. Proteksi Endpoint API (Mencegah Postman/Insomnia/Script Kiddies)
    if (pathname.startsWith('/api/submit')) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Akses Ditolak: Registrasi belum dibuka atau masa pendaftaran telah berakhir.' 
        },
        { status: 403 }
      );
    }
  }

  // Jika sudah waktunya, biarkan user lewat
  return NextResponse.next();
}

// 2. Tentukan Rute Mana Saja yang Dijaga oleh Satpam Middleware Ini
// Tujuannya agar tidak membebani performa untuk route yang tidak perlu (seperti gambar, css, dll)
export const config = {
  matcher: [
    '/register/:path*', // Menjaga /register dan sub-routenya
    '/api/submit/:path*' // Menjaga API submit
  ],
}
