"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { FileDropzone } from "@/components/file-dropzone"
import { ReviewModal } from "@/components/review-modal"
import { TrashIcon, PlusIcon, AlertIcon, CheckIcon } from "@/components/icons"
import {
  ROSTER_ROLES,
  MIN_PLAYERS,
  MAX_PLAYERS,
  SUBMIT_URL,
  STORAGE_KEY,
  RULEBOOK_URL,
  type Player,
  type RosterRole,
  type UploadedFile,
  type FormState,
  isValidEmail,
  isValidHex,
  formatDuelId,
  isCompleteDuelId,
  createPlayer,
  defaultPlayers,
  countRole,
  assignRole,
  findDuplicateFields,
} from "@/lib/registration"

const inputBase =
  "w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1 text-xs font-medium text-destructive">{msg}</p>
}

export function RegistrationForm() {
  const [email, setEmail] = useState("")
  const [namaTim, setNamaTim] = useState("")
  const [hex, setHex] = useState("#3b82f6")
  const [players, setPlayers] = useState<Player[]>(defaultPlayers)
  const [logo, setLogo] = useState<UploadedFile | null>(null)
  const [bukti, setBukti] = useState<UploadedFile | null>(null)
  const [agreed, setAgreed] = useState(false)

  // Per-field touched tracking — a field only shows errors after it loses focus
  // (onBlur) or after a submit attempt. Prevents premature errors on page load.
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const restored = useRef(false)

  function markTouched(key: string) {
    setTouchedFields((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  }

  // Restore draft (text inputs only) from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Partial<FormState>
        if (typeof data.email === "string") setEmail(data.email)
        if (typeof data.namaTim === "string") setNamaTim(data.namaTim)
        if (typeof data.hex === "string") setHex(data.hex)
        if (Array.isArray(data.players) && data.players.length >= MIN_PLAYERS) {
          setPlayers(data.players)
        }
      }
    } catch {
      // ignore corrupt draft
    }
    restored.current = true
  }, [])

  // Auto-save draft in real-time.
  // CRITICAL: only text inputs are persisted. logoBase64 / buktiBase64 are
  // EXCLUDED to avoid localStorage QuotaExceededError crashes.
  useEffect(() => {
    if (!restored.current) return
    const draft: FormState = { email, namaTim, hex, players }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // storage full / unavailable — ignore
    }
  }, [email, namaTim, hex, players])

  // ---- Player mutations ----
  function updatePlayer(id: string, patch: Partial<Player>) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function changeRole(id: string, role: RosterRole) {
    // Auto-swap: promoting to a unique role downgrades the previous holder.
    setPlayers((prev) => assignRole(prev, id, role))
  }

  function addPlayer() {
    setPlayers((prev) =>
      prev.length >= MAX_PLAYERS ? prev : [...prev, createPlayer("Anggota")],
    )
  }

  function removePlayer(id: string) {
    setPlayers((prev) =>
      prev.length <= MIN_PLAYERS ? prev : prev.filter((p) => p.id !== id),
    )
  }

  // ---- Validation ----
  const ketuaCount = countRole(players, "Ketua")
  const wakilCount = countRole(players, "Wakil Ketua")
  const rosterRuleOk = ketuaCount === 1 && wakilCount === 1

  const duplicateFields = useMemo(() => findDuplicateFields(players), [players])

  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {}
    if (!email.trim()) errs.email = "Kolom ini wajib diisi."
    else if (!isValidEmail(email)) errs.email = "Format email tidak valid."
    if (!namaTim.trim()) errs.namaTim = "Kolom ini wajib diisi."
    if (!isValidHex(hex)) errs.hex = "Format hex tidak valid (#RRGGBB)."
    if (!logo) errs.logo = "Logo tim wajib diunggah."
    if (!bukti) errs.bukti = "Bukti transfer wajib diunggah."

    players.forEach((p) => {
      if (!p.namaLengkap.trim()) errs[`${p.id}-namaLengkap`] = "Kolom ini wajib diisi."
      if (!p.discord.trim()) errs[`${p.id}-discord`] = "Kolom ini wajib diisi."
      if (!p.ign.trim()) errs[`${p.id}-ign`] = "Kolom ini wajib diisi."
      if (!p.duelId.trim()) errs[`${p.id}-duelId`] = "Kolom ini wajib diisi."
      else if (!isCompleteDuelId(p.duelId))
        errs[`${p.id}-duelId`] = "ID harus berformat xxx-xxx-xxx."
    })

    // Intra-team duplicates take priority on the affected fields.
    duplicateFields.forEach((key) => {
      errs[key] = "Data ganda dalam tim"
    })
    return errs
  }, [email, namaTim, hex, logo, bukti, players, duplicateFields])

  const hasFieldErrors = Object.keys(fieldErrors).length > 0
  const canSubmit = !hasFieldErrors && rosterRuleOk && agreed

  // An error is visible if the field has been touched OR a submit was attempted.
  // Duplicate errors always show immediately (they signal a real data conflict).
  function err(key: string) {
    const e = fieldErrors[key]
    if (!e) return undefined
    if (duplicateFields.has(key)) return e
    if (submitAttempted || touchedFields[key]) return e
    return undefined
  }

  function handleReviewClick() {
    setSubmitAttempted(true)
    if (!canSubmit) {
      document
        .getElementById("registration-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    setServerError(null)
    setModalOpen(true)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setServerError(null)

    const payload = {
      event: "Team Wars Indonesia Season 7 - Duel Links",
      email: email.trim(),
      namaTim: namaTim.trim(),
      warna: hex,
      logoTim: logo?.base64 ?? "",
      buktiTransfer: bukti?.base64 ?? "",
      players: players.map((p, i) => ({
        nomor: i + 1,
        role: p.role,
        namaLengkap: p.namaLengkap.trim(),
        discord: p.discord.trim(),
        ign: p.ign.trim(),
        idDuelLinks: p.duelId,
      })),
      submittedAt: new Date().toISOString(),
    }

    try {
      // Standard POST — NO mode:"no-cors", so we can read the JSON response.
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      })
      const result = (await res.json()) as { status: string; message?: string }

      if (result.status === "error") {
        setSubmitting(false)
        setServerError(
          result.message || "Terjadi kesalahan pada server. Silakan coba lagi.",
        )
        return
      }

      // Success — clear the draft ONLY now.
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      setSubmitting(false)
      setModalOpen(false)
      setSuccess(true)
    } catch {
      setSubmitting(false)
      setServerError(
        "Gagal terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.",
      )
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="glow-border mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <CheckIcon className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Pendaftaran Berhasil!</h2>
        <p className="mt-2 max-w-md text-pretty text-muted-foreground">
          Tim <span className="font-semibold text-foreground">{namaTim}</span> telah
          berhasil didaftarkan untuk Team Wars Indonesia Season 7. Konfirmasi lebih
          lanjut akan dikirimkan ke email Anda.
        </p>
      </div>
    )
  }

  return (
    <>
      <form
        id="registration-form"
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-6"
      >
        {/* Section 1 — Identitas Tim */}
        <section className="glass glow-border rounded-2xl border p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <h2 className="text-base font-semibold text-foreground">Identitas Tim</h2>
              <p className="text-sm text-muted-foreground">Informasi dasar tim Anda.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email Aktif Perwakilan
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                placeholder="nama@email.com"
                className={`${inputBase} ${
                  err("email") ? "border-destructive" : "border-border"
                }`}
              />
              <ErrorText msg={err("email")} />
            </div>

            <div>
              <label
                htmlFor="namaTim"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Nama Tim
              </label>
              <input
                id="namaTim"
                type="text"
                value={namaTim}
                onChange={(e) =>
                  // Strict alphanumeric — strip symbols/special chars in real-time.
                  setNamaTim(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
                }
                onBlur={() => markTouched("namaTim")}
                placeholder="Contoh: Blue Eyes Legion"
                className={`${inputBase} ${
                  err("namaTim") ? "border-destructive" : "border-border"
                }`}
              />
              <ErrorText msg={err("namaTim")} />
            </div>

            <div>
              <label
                htmlFor="hexText"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Warna Identitas Tim (Hex)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label="Pilih warna tim"
                  value={isValidHex(hex) ? hex : "#000000"}
                  onChange={(e) => setHex(e.target.value)}
                  className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
                />
                <input
                  id="hexText"
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    // Allow only hex digits, force a single leading #, cap at #RRGGBB.
                    const v = e.target.value.replace(/[^0-9a-fA-F]/g, "")
                    setHex(`#${v.slice(0, 6)}`)
                  }}
                  onBlur={() => markTouched("hex")}
                  placeholder="#3b82f6"
                  className={`${inputBase} font-mono ${
                    err("hex") ? "border-destructive" : "border-border"
                  }`}
                />
              </div>
              <ErrorText msg={err("hex")} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FileDropzone
                id="logo"
                label="Logo Tim"
                value={logo}
                onChange={(f) => {
                  setLogo(f)
                  markTouched("logo")
                }}
                error={err("logo")}
              />
              <FileDropzone
                id="bukti"
                label="Bukti Transfer"
                value={bukti}
                onChange={(f) => {
                  setBukti(f)
                  markTouched("bukti")
                }}
                error={err("bukti")}
              />
            </div>
          </div>
        </section>

        {/* Section 2 — Roster */}
        <section className="glass glow-border rounded-2xl border p-5 sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-primary" aria-hidden="true" />
              <div>
                <h2 className="text-base font-semibold text-foreground">Roster Pemain</h2>
                <p className="text-sm text-muted-foreground">
                  Minimal {MIN_PLAYERS}, maksimal {MAX_PLAYERS} pemain.
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {players.length}/{MAX_PLAYERS}
            </span>
          </div>

          {/* Roster composition rule banner — shown in real-time when invalid */}
          {!rosterRuleOk && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive"
            >
              <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">Komposisi roster tidak valid</p>
                <p>
                  Roster wajib memiliki tepat 1 &quot;Ketua&quot; dan 1 &quot;Wakil
                  Ketua&quot;. Saat ini: {ketuaCount} Ketua, {wakilCount} Wakil Ketua.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {players.map((p, index) => {
              const canDelete = players.length > MIN_PLAYERS
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-background/40 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <select
                        aria-label={`Peran pemain ${index + 1}`}
                        value={p.role}
                        onChange={(e) =>
                          changeRole(p.id, e.target.value as RosterRole)
                        }
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-primary"
                      >
                        {ROSTER_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePlayer(p.id)}
                      disabled={!canDelete}
                      aria-label={`Hapus pemain ${index + 1}`}
                      title={
                        canDelete
                          ? "Hapus pemain"
                          : `Minimal ${MIN_PLAYERS} pemain diperlukan`
                      }
                      className="rounded-lg p-2 text-muted-foreground transition-colors enabled:hover:bg-destructive/10 enabled:hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        value={p.namaLengkap}
                        onChange={(e) =>
                          updatePlayer(p.id, { namaLengkap: e.target.value })
                        }
                        onBlur={() => markTouched(`${p.id}-namaLengkap`)}
                        placeholder="Nama Lengkap"
                        className={`${inputBase} ${
                          err(`${p.id}-namaLengkap`)
                            ? "border-destructive"
                            : "border-border"
                        }`}
                      />
                      <ErrorText msg={err(`${p.id}-namaLengkap`)} />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={p.discord}
                        onChange={(e) => updatePlayer(p.id, { discord: e.target.value })}
                        onBlur={() => markTouched(`${p.id}-discord`)}
                        placeholder="Discord Username"
                        className={`${inputBase} ${
                          err(`${p.id}-discord`)
                            ? "border-destructive"
                            : "border-border"
                        }`}
                      />
                      <ErrorText msg={err(`${p.id}-discord`)} />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={p.ign}
                        onChange={(e) => updatePlayer(p.id, { ign: e.target.value })}
                        onBlur={() => markTouched(`${p.id}-ign`)}
                        placeholder="In-Game Name (IGN)"
                        className={`${inputBase} ${
                          err(`${p.id}-ign`) ? "border-destructive" : "border-border"
                        }`}
                      />
                      <ErrorText msg={err(`${p.id}-ign`)} />
                    </div>
                    <div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={p.duelId}
                        onChange={(e) =>
                          updatePlayer(p.id, { duelId: formatDuelId(e.target.value) })
                        }
                        onBlur={() => markTouched(`${p.id}-duelId`)}
                        placeholder="ID Duel Links (xxx-xxx-xxx)"
                        className={`${inputBase} font-mono ${
                          err(`${p.id}-duelId`)
                            ? "border-destructive"
                            : "border-border"
                        }`}
                      />
                      <ErrorText msg={err(`${p.id}-duelId`)} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={addPlayer}
            disabled={players.length >= MAX_PLAYERS}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-foreground transition-colors enabled:hover:border-primary/60 enabled:hover:bg-primary/5 enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon className="h-4 w-4" />
            Tambah Pemain
          </button>
        </section>

        {/* Footer */}
        <section className="glass glow-border rounded-2xl border p-5 sm:p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-sm text-muted-foreground">
              Saya menyatakan telah membaca dan menyetujui seluruh{" "}
              <a
                href={RULEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
              >
                Rulebook TWI Season 7
              </a>{" "}
              turnamen Team Wars Indonesia.
            </span>
          </label>
          {submitAttempted && !agreed && (
            <p className="mt-2 text-xs font-medium text-destructive">
              Anda harus menyetujui Rulebook sebelum melanjutkan.
            </p>
          )}

          <button
            type="button"
            onClick={handleReviewClick}
            disabled={!canSubmit}
            className="glow-border mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            Review Data
          </button>

          {!canSubmit && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Lengkapi seluruh kolom dengan benar (email, hex, 1 Ketua, 1 Wakil Ketua,
              tanpa data ganda, dan setujui Rulebook) untuk melanjutkan.
            </p>
          )}
        </section>
      </form>

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        form={{ email, namaTim, hex, players }}
        logo={logo}
        bukti={bukti}
        submitting={submitting}
        serverError={serverError}
        onConfirm={handleSubmit}
      />
    </>
  )
}
