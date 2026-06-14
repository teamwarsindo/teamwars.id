import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

// 1. Mesin Pembersih Spasi (Global Trim)
export const trimSpaces = (value) => {
  return value.replace(/\s+/g, " ").trim();
};

// 2. Mesin Format Nama Lengkap (Proper Case, No Symbol, Max 60)
export const formatRealName = (value) => {
  // Hanya izinkan huruf dan spasi, potong maksimal 60 karakter
  let cleaned = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 60);
  // Buat huruf pertama tiap kata jadi kapital (Proper Case)
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
};

// 3. Mesin Format Discord (Lowercase, _ dan . saja)
export const formatDiscord = (value) => {
  // Paksa huruf kecil dan buang karakter selain huruf, angka, _, dan .
  return value.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 32);
};

// 4. Mesin Format Hex Code
export const formatHex = (value) => {
  return value.toUpperCase();
};
