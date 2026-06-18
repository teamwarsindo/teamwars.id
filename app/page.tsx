import Image from "next/image"
import { cn } from "@/lib/utils"
import { Countdown } from "@/components/countdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { ShieldIcon, DiscordIcon, RulesIcon, FormIcon } from "@/components/icons"

// Launch target — replace with the real tournament date.
const LAUNCH_TARGET = new Date("2026-07-01T08:00:00+07:00").getTime()
const DISCORD_URL = "https://discord.gg/hTJJRevA43"

export default function Page() {
  return (
    // PERBAIKAN 1: Tambahkan `flex flex-col` di main agar layout dinamis aktif
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      
      {/* Ambient esports glow behind the header */}
      <div
        className="ambient-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        aria-hidden="true"
      />

      {/* Top bar */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <ShieldIcon className="h-4 w-4 text-primary" />
          Official Website
        </div>
        <ThemeToggle />
      </div>

      {/* PERBAIKAN 2: Ubah div pembungkus menjadi `flex flex-1 flex-col` dan hapus `pb-16` yang bikin bocor */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-4 pt-6 sm:px-6">
        
        {/* Header */}
        <header className="mb-6 flex flex-col items-center text-center">
          <div className="glow-border relative mb-6 h-[120px] w-[120px] overflow-hidden rounded-2xl">
            <Image
              src="/logo.webp"
              alt="Logo Team Wars Indonesia"
              fill
              priority
              className="scale-[1.01] object-cover" 
            />
          </div>
          <h1 className="glow-text text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            TEAM WARS INDONESIA
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Season 7 — Duel Links
          </p>
        </header>

        {/* Hero - Karena parent-nya sekarang flex, flex-1 di sini akan 100% bekerja! */}
        <section className="flex flex-1 flex-col items-center justify-center py-2 text-center">      
      
          {/* Countdown */}
          <div className="mt-4 w-full max-w-xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Battle Begins In
            </p>
            <Countdown target={LAUNCH_TARGET} />
          </div>

          {/* CTAs - Ditambahkan flex-wrap agar 3 tombol tidak rusak di layar nanggung */}
          <div className="mb-8 mt-6 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 w-full gap-2.5 bg-[#5865F2] px-6 text-base font-semibold text-white shadow-[0_0_30px_-6px_#5865F2] hover:bg-[#4752c4] sm:w-auto [&_svg:not([class*='size-'])]:size-5",
              )}
            >
              <DiscordIcon className="h-5 w-5" />
              Join the Discord
            </a>
            <a
              href="/rules"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 w-full gap-2.5 border-primary/40 bg-transparent px-6 text-base font-semibold text-foreground hover:bg-primary/10 hover:text-foreground sm:w-auto [&_svg:not([class*='size-'])]:size-5",
              )}
            >
              <RulesIcon className="h-5 w-5" />
              Rulebook TWI Season 7
            </a>
            <a
              href="#"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 w-full gap-2.5 border-primary/40 bg-transparent px-6 text-base font-semibold text-foreground hover:bg-primary/10 hover:text-foreground sm:w-auto [&_svg:not([class*='size-'])]:size-5",
              )}
            >
              <FormIcon className="h-5 w-5" />
              Team Registration
            </a>
          </div>
        </section>

        {/* Footer - Mesin mt-auto sekarang aktif mendorongnya ke paling bawah layar */}
        <footer className="mt-auto pb-2 pt-4 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Team Wars Indonesia. All rights reserved.
        </footer>
      </div>
    </main>
  )
}
