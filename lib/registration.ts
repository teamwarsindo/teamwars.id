export type RosterRole = "Ketua" | "Wakil Ketua" | "Anggota"
export const ROSTER_ROLES: RosterRole[] = ["Ketua", "Wakil Ketua", "Anggota"]

export const MIN_PLAYERS = 5
export const MAX_PLAYERS = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 
export const STORAGE_KEY = "twi-s7-duel-links-draft"

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

// Mesin Kompresi Gambar Cerdas (Dipertahankan karena ini fitur brilian)
export function compressImage(file: File, maxWidth = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)
        
        resolve(canvas.toDataURL("image/jpeg", 0.80))
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

export function createPlayer(role: RosterRole): Player {
  return { 
    id: crypto.randomUUID(), 
    role, 
    namaLengkap: "", 
    discord: "", 
    ign: "", 
    duelId: "" 
  }
}

export function defaultPlayers(): Player[] {
  return [
    createPlayer("Ketua"), 
    createPlayer("Wakil Ketua"), 
    createPlayer("Anggota"), 
    createPlayer("Anggota"), 
    createPlayer("Anggota")
  ]
}

export function countRole(players: Player[], role: RosterRole): number {
  return players.filter((p) => p.role === role).length
}

export function assignRole(players: Player[], targetId: string, nextRole: RosterRole): Player[] {
  const isUnique = nextRole === "Ketua" || nextRole === "Wakil Ketua"
  return players.map((p) => {
    if (p.id === targetId) return { ...p, role: nextRole }
    if (isUnique && p.role === nextRole) return { ...p, role: "Anggota" }
    return p
  })
}

// Deteksi Ganda di Roster
export function findDuplicateFields(players: Player[]): Set<string> {
  const flagged = new Set<string>()
  const fields: Array<keyof Pick<Player, "discord" | "ign" | "duelId">> = ["discord", "ign", "duelId"]

  for (const field of fields) {
    const seen = new Map<string, string[]>()
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
