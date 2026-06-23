import { RulebookNav } from '@/components/rulebook-nav'
import { RulebookHero } from '@/components/rulebook-hero'
import { RuleCard } from '@/components/rule-card'
import { BackToTop } from '@/components/back-to-top'
import { ruleCategories } from '@/lib/rules-data'

export default function RulebookPage() {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <RulebookNav />

      <main className="mx-auto max-w-3xl px-4 pb-24">
        <RulebookHero />

        <div className="mt-8 flex flex-col gap-6">
          {ruleCategories.map((category) => (
            <RuleCard key={category.id} category={category} />
          ))}
        </div>

        <footer className="mt-12 border-t border-blue-500/10 pt-6 text-center text-xs text-slate-500">
          Team Wars Indonesia · Season 7 — Duel Links · Official Rulebook
        </footer>
      </main>

      <BackToTop />
    </div>
  )
}
