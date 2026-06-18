import Image from "next/image"
import { cn } from "@/lib/utils"
import { Countdown } from "@/components/countdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { ShieldIcon, DiscordIcon, RulesIcon, FormIcon } from "@/components/icons"

// Launch target — silakan ganti dengan tanggal asli turnamen.
const LAUNCH_TARGET = new Date("2026-07-01T08:00:00+07:00").getTime()

const DISCORD_URL = "https://discord.gg/hTJJRevA43"

export default function Page() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      
      {/* Ambient esports glow behind the header */}
      <div
        className="ambient-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        aria-hidden="true"
      />

      {/* Top bar */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <ShieldIcon className="h-4 w-4 text-primary" />
          Official Website
        </div>
        <ThemeToggle />
      </div>

      {/* Main Content Wrapper — Mengunci elemen di tengah tanpa memicu scroll bocor di HP */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 pb-4 pt-4 sm:px-6">
        
        {/* HEADER: Ukuran logo dan jarak dikondisikan agar pas di HP, membesar proporsional di PC */}
        <header className="mb-4 flex flex-col items-center text-center lg:mb-10">
          <div className="glow-border relative mb-4 h-20 w-20 overflow-hidden rounded-2xl sm:h-28 sm:w-28 lg:mb-8 lg:h-44 lg:w-44">
            <Image
              src="/logo.webp"
              alt="Logo Team Wars Indonesia"
              fill
              priority
              className="scale-[1.01] object-cover" 
            />
          </div>
          {/* Fluid Typography: Ukuran font judul otomatis mengikuti lebar layar PC */}
          <h1 className="glow-text text-balance text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-[clamp(3.5rem,5vw,5.5rem)] lg:leading-[1.1]">
            TEAM WARS INDONESIA
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:py-1.5 sm:text-sm lg:mt-6">
            Season 7 — Duel Links
          </p>
        </header>

        {/* SECTION KONTEN: Countdown & Tombol */}
        <section className="flex w-full flex-col items-center text-center">      
          
          {/* Area Countdown */}
          <div className="w-full max-w-3xl">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:mb-4 sm:text-xs">
              Battle Begins In
            </p>
            <Countdown target={LAUNCH_TARGET} />
          </div>

          {/* Area Tombol: Numpuk vertikal di HP (flex-col), Berbaris horizontal di PC (lg:flex-row) */}
          <div className="mt-6 flex w-full max-w-4xl flex-col items-center gap-2.5 lg:mt-10 lg:flex-row lg:justify-center">
            
            {/* 1. TOMBOL DISCORD (Solid Blue & Shadow Glow) */}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 w-full gap-2 bg-[#5865F2] px-6 text-sm font-bold text-white shadow-[0_0_30px_-6px_#5865F2] hover:bg-[#4752c4] lg:h-12 lg:w-auto lg:text-base lg:gap-2.5 [&_svg:not([class*='size-'])]:size-4 lg:[&_svg:not([class*='size-'])]:size-5",
              )}
            >
              <DiscordIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              Join the Discord
            </a>

            {/* 2. TOMBOL RULEBOOK (Outline Transparan) */}
            <a
              href="/rules"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 w-full gap-2 border-primary/40 bg-transparent px-6 text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-foreground lg:h-12 lg:w-auto lg:text-base lg:gap-2.5 [&_svg:not([class*='size-'])]:size-4 lg:[&_svg:not([class*='size-'])]:size-5",
              )}
            >
              <RulesIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              Check Rulebook
            </a>

            {/* 3. TOMBOL REGISTRASI (Outline Transparan) */}
            <a
              href="#"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 w-full gap-2 border-primary/40 bg-transparent px-6 text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-foreground lg:h-12 lg:w-auto lg:text-base lg:gap-2.5 [&_svg:not([class*='size-'])]:size-4 lg:[&_svg:not([class*='size-'])]:size-5",
              )}
            >
              <FormIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              Team Registration
            </a>

          </div>
        </section>

        {/* FOOTER: mt-8 menjamin ruang napas pas di HP, sm:mt-16 melar di PC */}
        <footer className="mt-8 text-center text-[10px] text-muted-foreground sm:mt-16 sm:text-xs">
          © {new Date().getFullYear()} Team Wars Indonesia. All rights reserved.
        </footer>

      </div>
    </main>
  )
}
