"use client"

import { useRef, useState, type DragEvent } from "react"
import { UploadIcon, CloseIcon } from "@/components/icons"
import { MAX_FILE_SIZE, type UploadedFile } from "@/lib/registration"

interface FileDropzoneProps {
  id: string
  label: string
  hint?: string
  value: UploadedFile | null
  onChange: (file: UploadedFile | null) => void
  error?: string
  teamName?: string // 🟢 PROPERTI BARU: Untuk nama file dinamis
}

export function FileDropzone({ id, label, hint, value, onChange, error, teamName = "twi-team" }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setLocalError(null)

    if (!file.type.startsWith("image/")) {
      setLocalError("File harus berupa gambar.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      const allowedSizeMb = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
      setLocalError(`Ukuran file asli melebihi batas ${allowedSizeMb}MB.`)
      return
    }

    try {
      setIsUploading(true)
      
      // 1. Penamaan File Cerdas & Penanganan "Sering Ganti File"
      // Kita tambahkan timestamp (waktu saat ini) di belakang nama agar unik.
      // Jika user ganti file 3x, Cloudinary akan mengunggah 3 file berbeda tanpa bentrok cache.
      const cleanTeamName = teamName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") || "twi";
      const extension = file.type.split('/')[1] || 'png';
      const timestamp = new Date().getTime();
      const customFileName = `${cleanTeamName}-${timestamp}.${extension}`;
      
      const renamedFile = new File([file], customFileName, { type: file.type });
      const folderPath = id === "logo" ? "logo" : "bukti_transfer";

      // 2. Upload Langsung pakai FormData (Bypass Base64, super ringan & cepat!)
      const formData = new FormData()
      formData.append("file", renamedFile) 
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "preset_twis7")
      formData.append("folder", folderPath)

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) {
        throw new Error("Cloud Name belum diatur.")
      }

      // 3. Tembak ke Cloudinary
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Gagal mengunggah ke server gambar.")
      
      const data = await res.json()

      // 4. Hack Cerdas: Kita simpan URL Cloudinary ke dalam properti 'base64'
      // Agar Typescript tidak error dan tag <img> preview tetap menyala
      onChange({ 
        name: file.name, 
        size: file.size, 
        base64: data.secure_url 
      })

      setIsUploading(false)

    } catch (err: any) {
      setLocalError(err.message || "Gagal memproses gambar.")
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    if (!isUploading) handleFile(e.dataTransfer.files?.[0])
  }

  const shownError = error ?? localError

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>

      {value ? (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-background/50 p-3 shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200">
          <img src={value.base64} alt={`Pratinjau ${label}`} className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{value.name}</p>
            <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              ✓ Berhasil diunggah ({(value.size / 1024).toFixed(0)} KB)
            </p>
          </div>
          <button type="button" onClick={() => { onChange(null); setLocalError(null); if (inputRef.current) inputRef.current.value = "" }} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); if (!isUploading) setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all duration-200 ${
            dragging ? "border-primary bg-primary/10 scale-[1.02]" : 
            shownError ? "border-destructive bg-destructive/5" : 
            isUploading ? "border-primary/50 bg-primary/5 opacity-80 cursor-wait" : 
            "border-border bg-background/40 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          {isUploading ? (
             <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
             <UploadIcon className="h-6 w-6 text-muted-foreground" />
          )}
          
          <p className="text-sm font-medium text-foreground">
            {isUploading ? (
              <span className="text-primary font-bold animate-pulse">Mengunggah ke awan... ⏳</span>
            ) : (
              "Seret & lepas atau klik untuk unggah"
            )}
          </p>
          <p className="text-xs text-muted-foreground">{hint ?? "PNG / JPG, maks 10MB"}</p>
        </div>
      )}
      <input ref={inputRef} id={id} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      {shownError && <p className="mt-1 text-xs font-medium text-destructive">{shownError}</p>}
    </div>
  )
}
