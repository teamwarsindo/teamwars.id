export type RosterRole = "Ketua" | "Wakil Ketua" | "Anggota"

export const ROSTER_ROLES: RosterRole[] = ["Ketua", "Wakil Ketua", "Anggota"]

export const MIN_PLAYERS = 5
export const MAX_PLAYERS = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const SUBMIT_URL =
  "https://script.google.com/macros/s/AKfycbyzyvztXxyLs2SxmcgkeBKftV1au9UOfegt868ShaIQiV63XWkYy_D18AVmNOz5yKIf/exec"

export const STORAGE_KEY = "twi-s7-duel-links-draft"

export const RULEBOOK_URL = "https://twindo.dev"

export interface Player {
  id: string
  role: RosterRole
  namaLengkap: string
  discord: string
  ign: string
  duelId: string
}

export interface UploadedFile {
  name: string
  size: number
  base64: string
}

export interface FormState {
  email: string
  namaTim: string
  hex: string
  players: Player[]
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim())
}

// Auto-format ID Duel Links to xxx-xxx-xxx (digits only)
export function formatDuelId(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9)
  const parts: string[] = []
  for (let i = 0; i < digits.length; i += 3) {
    parts.push(digits.slice(i, i + 3))
  }
  return parts.join("-")
}

export function isCompleteDuelId(value: string): boolean {
  return /^\d{3}-\d{3}-\d{3}$/.test(value)
}

// Collapse multiple consecutive whitespace into a single space and trim ends.
export function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

// ---- Discord username ----
// Sanitize in real-time: lowercase + only [a-z0-9_.], capped at 32 chars.
export function sanitizeDiscord(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .slice(0, 32)
}

// Returns an error message for a Discord username, or undefined if valid.
export function validateDiscord(value: string): string | undefined {
  const v = value.trim()
  if (!v) return undefined // emptiness handled by required check
  if (v.length < 2) return "Minimal 2 karakter."
  if (v.length > 32) return "Maksimal 32 karakter."
  if (v.includes("..")) return "Tidak boleh ada titik berurutan (..)."
  if (!/^[a-z0-9_.]+$/.test(v))
    return "Hanya huruf kecil, angka, garis bawah, dan titik."
  return undefined
}

// ---- Real name (Nama Lengkap) ----
// Allow only letters and spaces while typing, capped at 60 chars.
export function sanitizeRealName(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 60)
}

// Proper-case every word: "budi  santoso" -> "Budi Santoso".
export function toProperCase(value: string): string {
  return normalizeSpaces(value)
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ")
}

// Returns an error message for a real name, or undefined if valid.
export function validateRealName(value: string): string | undefined {
  const v = value.trim()
  if (!v) return undefined // emptiness handled by required check
  if (v.length > 60) return "Maksimal 60 karakter."
  if (normalizeSpaces(v).split(" ").length < 2)
    return "Nama tidak boleh hanya satu kata"
  return undefined
}

let idCounter = 0
export function createPlayer(role: RosterRole): Player {
  idCounter += 1
  return {
    id: `player-${Date.now()}-${idCounter}`,
    role,
    namaLengkap: "",
    discord: "",
    ign: "",
    duelId: "",
  }
}

export function defaultPlayers(): Player[] {
  return [
    createPlayer("Ketua"),
    createPlayer("Wakil Ketua"),
    createPlayer("Anggota"),
    createPlayer("Anggota"),
    createPlayer("Anggota"),
  ]
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function countRole(players: Player[], role: RosterRole): number {
  return players.filter((p) => p.role === role).length
}

/**
 * Assign a role to a player with auto-swap behavior:
 * "Ketua" and "Wakil Ketua" are unique roles. When a player is promoted to one
 * of them, any other player currently holding that role is downgraded to "Anggota"
 * so exactly one of each exists seamlessly.
 */
export function assignRole(
  players: Player[],
  targetId: string,
  nextRole: RosterRole,
): Player[] {
  const isUnique = nextRole === "Ketua" || nextRole === "Wakil Ketua"
  return players.map((p) => {
    if (p.id === targetId) return { ...p, role: nextRole }
    // Downgrade the previous holder of a unique role.
    if (isUnique && p.role === nextRole) return { ...p, role: "Anggota" }
    return p
  })
}

/**
 * Detect intra-team duplicates across discord, ign, and duelId.
 * Returns a set of "<playerId>-<field>" keys that should be flagged red.
 * Empty values are ignored.
 */
export function findDuplicateFields(players: Player[]): Set<string> {
  const flagged = new Set<string>()
  const fields: Array<keyof Pick<Player, "discord" | "ign" | "duelId">> = [
    "discord",
    "ign",
    "duelId",
  ]

  for (const field of fields) {
    const seen = new Map<string, string[]>() // normalized value -> playerIds
    for (const p of players) {
      const raw = p[field].trim().toLowerCase()
      if (!raw) continue
      const ids = seen.get(raw) ?? []
      ids.push(p.id)
      seen.set(raw, ids)
    }
    for (const ids of seen.values()) {
      if (ids.length > 1) {
        for (const id of ids) flagged.add(`${id}-${field}`)
      }
    }
  }
  return flagged
}
