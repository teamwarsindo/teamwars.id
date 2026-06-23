import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LAUNCH_TARGET } from '@/lib/config'

export function middleware(request: NextRequest) {
  const now = Date.now();
  const { pathname } = request.nextUrl;

  // Buka otomatis jika berjalan di Localhost (agar Anda tidak repot saat coding)
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Jika pendaftaran BELUM BUKA
  if (now < LAUNCH_TARGET) {
    
    // Targetkan hanya halaman registrasi dan API
    if (pathname.startsWith('/registration') || pathname.startsWith('/api/submit')) {
      
      // Mengambil header otorisasi dari browser
      const basicAuth = request.headers.get('authorization');

      if (basicAuth) {
        // Memecah format "Basic base64string"
        const authValue = basicAuth.split(' ')[1];
        
        // Menerjemahkan Base64 kembali ke teks biasa
        const [user, pwd] = atob(authValue).split(':');

        // 🔐 KREDENSIAL ADMIN (Silakan ganti jika perlu)
        const validUser = 'admin';
        const validPwd = 'xR7vM2kP9zQ4wL5T';

        // Jika username dan password cocok, biarkan lewat!
        if (user === validUser && pwd === validPwd) {
          return NextResponse.next();
        }
      }

      // Jika tidak ada header atau password salah, paksa browser memunculkan pop-up login
      return new NextResponse('Akses Ditolak: Anda memerlukan kredensial admin untuk masuk sebelum waktu rilis.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Area Terbatas Panitia"',
        },
      });
    }
  }

  // Jika waktu sudah melewati LAUNCH_TARGET, semua orang bebas lewat
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/registration', 
    '/registration/:path*', 
    '/api/submit/:path*'
  ],
}
