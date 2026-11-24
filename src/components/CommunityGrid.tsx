import { useRef } from 'react'
import {
  Compass, Building2, Landmark, ChartCandlestick, Layers, Bitcoin, Lightbulb,
  Newspaper, ClipboardCheck, ShieldCheck, Globe, MessagesSquare,
} from 'lucide-react'
import { useScrollReveals } from '../lib/gsap'

const items = [
  { icon: Compass, label: 'MARKET OUTLOOK', desc: 'Where the week is pointing.', more: 'Framing the weeks ahead — what matters, what doesn\'t, and why.' },
  { icon: Building2, label: 'STOCK RESEARCH', desc: 'Companies, read closely.', more: 'Business models, filings, earnings and valuation, dissected together.' },
  { icon: Landmark, label: 'MACROECONOMICS', desc: 'The forces behind price.', more: 'Rates, inflation, employment and policy — and how they ripple outward.' },
  { icon: ChartCandlestick, label: 'TECHNICAL BREAKDOWN', desc: 'Structure on the chart.', more: 'Multi-timeframe reads of price action, structure and key levels.' },
  { icon: Layers, label: 'ICT CONCEPTS', desc: 'Liquidity, gaps, blocks.', more: 'Studying and stress-testing ICT and Smart Money frameworks.' },
  { icon: Bitcoin, label: 'CRYPTO NARRATIVES', desc: 'Stories that move capital.', more: 'On-chain developments, ecosystems and the narratives shaping them.' },
  { icon: Lightbulb, label: 'TRADE IDEAS', desc: 'Theses, not tips.', more: 'Ideas are shared with their reasoning — to be challenged, never copied.' },
  { icon: Newspaper, label: 'NEWS & CATALYSTS', desc: 'Signal over headlines.', more: 'What the news actually changes, and what is just noise.' },
  { icon: ClipboardCheck, label: 'TRADE REVIEWS', desc: 'Learning in hindsight.', more: 'Honest post-mortems on process, not just outcomes.' },
  { icon: ShieldCheck, label: 'RISK MANAGEMENT', desc: 'Survive first.', more: 'Sizing, exposure and discipline — the unglamorous edge.' },
  { icon: Globe, label: 'GLOBAL EVENTS', desc: 'The wider frame.', more: 'Geopolitics and international developments, local to global.' },
  { icon: MessagesSquare, label: 'INDEPENDENT OPINIONS', desc: 'Disagree productively.', more: 'Every member\'s view is welcome; consensus is not the goal.' },
]

export default function CommunityGrid() {
  const root = useRef<HTMLElement>(null)
  useScrollReveals(root)

  return (
    <section ref={root} id="community" className="relative bg-[#101114] px-6 py-28 sm:px-10 md:py-40 lg:px-16">
      <div className="mb-14 md:mb-20">
        <div data-fade className="label mb-8 flex items-center gap-3">
          <span className="text-[#4B83FF]">05</span> / INSIDE THE COMMUNITY
        </div>
        <h2 data-mask className="display text-[clamp(2.4rem,5.6vw,5.2rem)] text-white">
          <span className="mask"><span>Ideas move.</span></span>
          <span className="mask"><span className="text-[#9999A3]">Research evolves.</span></span>
        </h2>
      </div>

      <ul data-stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:pb-12">
        {items.map(({ icon: Icon, label, desc, more }, i) => (
          <li key={label} className={i % 4 === 1 || i % 4 === 3 ? 'lg:mt-12' : ''}>
            <button
              type="button"
              className="group relative block h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#17181C] p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/25 focus-visible:-translate-y-1 focus-visible:border-white/40 focus-visible:outline-none"
            >
              <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(132,85,255,0.35),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <div className="relative flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 transition-all duration-500 group-hover:border-[#8455FF]/60 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(132,85,255,0.5)]">
                  <Icon size={17} strokeWidth={1.5} />
                </span>
                <span className="mono text-[10px] text-white/30">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="mono relative mt-7 text-[11px] text-white">{label}</div>
              <div className="relative mt-1.5 text-[13.5px] text-[#9999A3]">{desc}</div>
              {/* hover reveal — expands in place */}
              <div className="relative grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="mt-3 border-t border-white/10 pt-3 text-[12.5px] leading-relaxed text-[#c5c5cd]">{more}</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
