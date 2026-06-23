// Nama file: app/page.tsx
// PERHATIKAN: Tidak ada "use client" di sini!

import type { Metadata } from 'next'
import PageClient from './page-client' // Mengimpor UI dari file sebelah

// 1. Atur metadata di sini (Server Side)
export const metadata: Metadata = {
  title: 'Team Wars Indonesia',
  description: 'Official Registration - Daftarkan tim Anda sekarang.',
  openGraph: {
    title: 'Team Wars Indonesia',
    description: 'Official Registration - Daftarkan tim Anda sekarang.',
  },
}

// 2. Render komponen Client Anda
export default function Page() {
  return <PageClient />
}
