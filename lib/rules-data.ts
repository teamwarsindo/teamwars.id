export type RuleItem = {
  id: string
  title: string
  content: string
}

export type RuleCategory = {
  /** anchor id used for jump navigation */
  id: string
  /** short label shown in the sticky nav pill */
  navLabel: string
  /** full card heading, e.g. "A. Peraturan Pendaftaran & Struktur Tim" */
  heading: string
  items: RuleItem[]
}

export const ruleCategories: RuleCategory[] = [
  {
    id: 'registration',
    navLabel: 'Registration',
    heading: 'A. Peraturan Pendaftaran & Struktur Tim',
    items: [
      {
        id: 'syarat-sah-pendaftaran',
        title: '1. Syarat Sah Pendaftaran',
        content:
          'Tim wajib mendaftar via tautan resmi dan melunasi biaya.',
      },
      {
        id: 'komposisi-tim',
        title: '2. Komposisi Tim',
        content:
          'Setiap tim terdiri dari minimal 5 anggota dan maksimal 10 anggota. Wajib memiliki 1 ketua dan 1 wakil.',
      },
    ],
  },
  {
    id: 'format',
    navLabel: 'Format',
    heading: 'B. Format Turnamen & Sistem Poin',
    items: [
      {
        id: 'sistem-klasemen',
        title: '1. Sistem Klasemen',
        content: 'Menggunakan format round robin / swiss system.',
      },
      {
        id: 'perhitungan-poin',
        title: '2. Perhitungan Poin',
        content: 'Menang match = 3 poin. Kalah = 0 poin.',
      },
    ],
  },
  {
    id: 'in-game-rules',
    navLabel: 'In-Game Rules',
    heading: 'F. Aturan Pertandingan (In-Game Rules)',
    items: [
      {
        id: 'waktu-kontrol',
        title: '1. Waktu Kontrol',
        content: '15 Menit per match per tim.',
      },
      {
        id: 'aturan-mixed-deck',
        title: '2. Aturan Mixed Deck',
        content: 'Batas akumulasi archetype adalah 5x penggunaan.',
      },
    ],
  },
]

/** Extra nav targets shown as pills even without a full card on this page. */
export const navItems = [
  { id: 'registration', label: 'Registration' },
  { id: 'format', label: 'Format' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'in-game-rules', label: 'In-Game Rules' },
  { id: 'penalties', label: 'Penalties' },
]
