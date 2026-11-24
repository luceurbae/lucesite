import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReduced, useScrollReveals } from '../lib/gsap'
import { CANDLES } from '../lib/candles'

/* ---------- Fundamental: floating research collage ---------- */

function FundamentalVisual() {
  const frag = (label: string, cls: string, depth: number, body: React.ReactNode) => (
    <div data-collage={depth} className={`glass absolute rounded-xl p-3 ${cls}`}>
      <div className="mono text-[8.5px] text-[#9999A3]">{label}</div>
      {body}
    </div>
  )
  const spark = (d: string) => (
    <svg viewBox="0 0 100 26" className="mt-2 h-6 w-full" fill="none">
      <path d={d} stroke="#4B83FF" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
  return (
    <div className="relative h-full w-full">
      {frag('INFLATION', 'left-[3%] top-[8%] w-[34%] -rotate-3', 1, spark('M0 20 C15 22 25 8 40 12 S65 20 80 8 S95 6 100 4'))}
      {frag('POLICY RATE', 'left-[40%] top-[2%] w-[28%] rotate-2', 1.6, spark('M0 22 H30 V14 H55 V14 H70 V6 H100'))}
      {frag('EMPLOYMENT', 'right-[2%] top-[14%] w-[26%] rotate-3', 1.2, (
        <div className="mt-2 flex h-6 items-end gap-1">
          {[10, 16, 12, 20, 14, 22].map((h, i) => <span key={i} className="w-full rounded-[2px] bg-white/20" style={{ height: h }} />)}
        </div>
      ))}
      {/* newspaper fragment */}
      <div data-collage="0.8" className="absolute bottom-[4%] left-[6%] w-[44%] -rotate-2 rounded-md bg-[#e9e6df] p-3 text-[#16161a] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]">
        <div className="border-b border-black/25 pb-1 text-[11px] font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>The Macro Brief</div>
        <div className="mt-2 space-y-1">
          {[100, 92, 96, 70, 88, 60].map((w, i) => <div key={i} className="h-[3px] rounded bg-black/25" style={{ width: `${w}%` }} />)}
        </div>
      </div>
      {frag('GDP', 'bottom-[12%] left-[54%] w-[22%] rotate-1', 1.8, (
        <div className="mt-2 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full border-2 border-[#8455FF] border-t-transparent" />
          <span className="mono text-[8px] text-white/50">CYCLE</span>
        </div>
      ))}
      {frag('GEOPOLITICS', 'bottom-[2%] right-[1%] w-[24%] -rotate-2', 1.1, (
        <div className="mt-2 grid grid-cols-6 gap-[3px]">
          {Array.from({ length: 18 }).map((_, i) => <span key={i} className={`h-1.5 rounded-[1px] ${[2, 5, 9, 13].includes(i) ? 'bg-[#E65BFF]/80' : 'bg-white/15'}`} />)}
        </div>
      ))}
    </div>
  )
}

/* ---------- Technical: illustrative chart ---------- */

function TechnicalVisual() {
  const W = 560, H = 300, padL = 14, padR = 74
  const step = (W - padL - padR) / CANDLES.length
  const X = (i: number) => padL + i * step + step / 2
  const Y = (p: number) => 280 - (p - 25) * (258 / 52)
  const structure = [
    [7, 35], [10, 55], [12, 54], [14, 62], [18, 49], [21, 67], [23, 71],
  ].map(([i, p]) => `${X(i)},${Y(p)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" role="img" aria-label="Illustrative market structure chart — not a trade signal">
      <defs>
        <linearGradient id="tv-up" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#4B83FF" /></linearGradient>
        <linearGradient id="tv-prem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E65BFF" stopOpacity="0.1" /><stop offset="1" stopColor="#E65BFF" stopOpacity="0" /></linearGradient>
        <linearGradient id="tv-disc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#4B83FF" stopOpacity="0.12" /><stop offset="1" stopColor="#4B83FF" stopOpacity="0" /></linearGradient>
      </defs>
      {/* premium / discount */}
      <rect x="0" y={Y(72)} width={W - padR} height={Y(52.5) - Y(72)} fill="url(#tv-prem)" />
      <rect x="0" y={Y(52.5)} width={W - padR} height={Y(33) - Y(52.5)} fill="url(#tv-disc)" />
      {[0.2, 0.4, 0.6, 0.8].map((k) => <line key={k} x1="0" x2={W} y1={H * k} y2={H * k} stroke="rgba(255,255,255,0.04)" />)}
      <line x1="0" x2={W - padR} y1={Y(52.5)} y2={Y(52.5)} stroke="rgba(255,255,255,0.28)" strokeDasharray="2 4" />
      <text x={W - padR + 6} y={Y(52.5) + 3} fontSize="8" fill="rgba(255,255,255,0.45)" fontFamily="JetBrains Mono, monospace" letterSpacing="1">EQ 50%</text>
      <text x={W - padR + 6} y={Y(65)} fontSize="8" fill="rgba(230,91,255,0.7)" fontFamily="JetBrains Mono, monospace" letterSpacing="1">PREMIUM</text>
      <text x={W - padR + 6} y={Y(42)} fontSize="8" fill="rgba(75,131,255,0.8)" fontFamily="JetBrains Mono, monospace" letterSpacing="1">DISCOUNT</text>

      {/* liquidity */}
      <g data-liq>
        <line x1="0" x2={W - padR} y1={Y(72)} y2={Y(72)} stroke="#E65BFF" strokeOpacity="0.8" strokeDasharray="4 5" style={{ filter: 'drop-shadow(0 0 4px rgba(230,91,255,0.9))' }} />
        <line x1="0" x2={W - padR} y1={Y(33)} y2={Y(33)} stroke="#4B83FF" strokeOpacity="0.8" strokeDasharray="4 5" style={{ filter: 'drop-shadow(0 0 4px rgba(75,131,255,0.9))' }} />
        <text x={W - padR + 6} y={Y(72) + 3} fontSize="8" fill="#E65BFF" fontFamily="JetBrains Mono, monospace" letterSpacing="1">BSL</text>
        <text x={W - padR + 6} y={Y(33) + 3} fontSize="8" fill="#4B83FF" fontFamily="JetBrains Mono, monospace" letterSpacing="1">SSL</text>
      </g>

      {/* FVG + OB zones */}
      <g data-zone>
        <rect x={X(9)} y={Y(50)} width={X(21) - X(9)} height={Y(43) - Y(50)} fill="#8455FF" fillOpacity="0.22" stroke="#8455FF" strokeOpacity="0.7" />
        <text x={X(9) + 4} y={Y(50) + 11} fontSize="8" fill="#c9b6ff" fontFamily="JetBrains Mono, monospace" letterSpacing="1">FVG</text>
        <rect x={X(7) - step * 0.5} y={Y(40)} width={X(14) - X(7)} height={Y(35) - Y(40)} fill="#4B83FF" fillOpacity="0.16" stroke="#4B83FF" strokeOpacity="0.6" />
        <text x={X(7) - step * 0.5 + 3} y={Y(40) - 4} fontSize="8" fill="#9bb4ff" fontFamily="JetBrains Mono, monospace" letterSpacing="1">OB</text>
      </g>

      {/* candles */}
      {CANDLES.map(([o, h, l, c], i) => {
        const up = c >= o
        return (
          <g key={i} data-candle style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
            <line x1={X(i)} x2={X(i)} y1={Y(h)} y2={Y(l)} stroke={up ? '#dfe6ff' : '#8455FF'} strokeWidth="1" />
            <rect x={X(i) - step * 0.3} width={step * 0.6} y={Y(Math.max(o, c))} height={Math.max(2, Math.abs(Y(o) - Y(c)))} rx="1.2" fill={up ? 'url(#tv-up)' : 'rgba(132,85,255,0.4)'} stroke={up ? 'none' : '#8455FF'} strokeWidth="0.7" />
          </g>
        )
      })}

      {/* structure */}
      <polyline data-structure points={structure} stroke="#fff" strokeOpacity="0.85" strokeWidth="1.3" strokeLinejoin="round" strokeDasharray="1" pathLength={1} style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.6))' }} />
      <g data-zone>
        <line x1={X(2)} x2={X(10)} y1={Y(47)} y2={Y(47)} stroke="#fff" strokeOpacity="0.5" strokeDasharray="2 3" />
        <text x={X(5)} y={Y(47) - 4} fontSize="8" fill="#fff" fillOpacity="0.8" fontFamily="JetBrains Mono, monospace" letterSpacing="1">BOS</text>
        <text x={X(8) - 8} y={Y(31) + 12} fontSize="8" fill="#fff" fillOpacity="0.8" fontFamily="JetBrains Mono, monospace" letterSpacing="1">SWEEP</text>
      </g>
    </svg>
  )
}

/* ---------- panels ---------- */

function Panel({ n, label, title, desc, items, visual, glow, notice }: {
  n: string; label: string; title: React.ReactNode; desc: string; items: string[]; visual: React.ReactNode; glow: string; notice?: string
}) {
  return (
    <article data-panel className="relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(170deg,#141519,#0b0c0f_75%)] p-6 sm:p-9">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl" style={{ background: glow }} />
      <div className="relative">
        <div className="label"><span className="text-white">{n}</span> / {label}</div>
        <h3 className="display mt-6 text-[clamp(2.2rem,4vw,3.8rem)] text-white">{title}</h3>
        <p className="mt-5 max-w-[34rem] text-[14.5px] leading-relaxed text-[#9999A3]">{desc}</p>
      </div>

      <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0b0d]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="relative h-full w-full p-3 sm:p-4">{visual}</div>
        {notice && <div className="mono absolute bottom-2 left-3 text-[8px] tracking-[0.16em] text-white/35">{notice}</div>}
      </div>

      <ul className="relative mt-7 flex flex-wrap gap-2">
        {items.map((t) => (
          <li key={t} className="mono rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-[#b4b4bd] transition-colors duration-300 hover:border-white/30 hover:text-white">{t}</li>
        ))}
      </ul>
    </article>
  )
}

export default function ResearchSection() {
  const root = useRef<HTMLElement>(null)
  useScrollReveals(root)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      if (prefersReduced()) return

      gsap.from('[data-panel]', {
        opacity: 0, y: 70, duration: 1.1, ease: 'expo.out', stagger: 0.15,
        scrollTrigger: { trigger: '[data-panels]', start: 'top 82%', once: true },
      })

      // collage: slow independent drift
      el.querySelectorAll<HTMLElement>('[data-collage]').forEach((n, i) => {
        gsap.to(n, { y: i % 2 ? 8 : -9, duration: 3.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })

      // chart: candles grow, structure draws, zones fade in
      const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-chart]', start: 'top 75%', once: true } })
      tl.from('[data-candle]', { scaleY: 0, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.04 })
        .from('[data-structure]', { strokeDashoffset: 1, duration: 1.4, ease: 'power2.inOut' }, 0.5)
        .from('[data-zone]', { opacity: 0, duration: 0.9, stagger: 0.2 }, 0.9)
        .from('[data-liq]', { opacity: 0, duration: 0.9 }, 0.9)
      gsap.to('[data-liq]', { opacity: 0.55, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3 })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="research" ref={root} className="relative bg-[#08090B] px-6 pb-28 pt-8 sm:px-10 md:pb-40 lg:px-16">
      <div className="mb-14 md:mb-20">
        <div data-fade className="label mb-8 flex items-center gap-3">
          <span className="text-[#4B83FF]">03</span> / RESEARCH APPROACH
        </div>
        <h2 data-mask className="display text-[clamp(2.4rem,5.6vw,5.2rem)] text-white">
          <span className="mask"><span>We study the</span></span>
          <span className="mask"><span>market from</span></span>
          <span className="mask"><span className="text-[#9999A3]">two perspectives.</span></span>
        </h2>
      </div>

      <div data-panels className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Panel
          n="01" label="FUNDAMENTAL"
          title={<>Understand<br />the why.</>}
          desc="We investigate the forces behind the market—economic data, corporate fundamentals, central bank policy, geopolitics, financial conditions, institutional developments, and market narratives."
          items={['Inflation', 'Interest rates', 'Federal Reserve', 'Central banks', 'Employment', 'GDP', 'Earnings', 'Financial statements', 'Geopolitics', 'Economic cycles', 'Institutional developments', 'Global news']}
          glow="rgba(75,131,255,0.16)"
          visual={<FundamentalVisual />}
        />
        <div className="lg:mt-20">
          <Panel
            n="02" label="TECHNICAL"
            title={<>Understand<br />the where.</>}
            desc="We analyze price action, market structure, liquidity, and institutional trading concepts to develop structured market scenarios."
            items={['ICT concepts', 'Smart Money Concepts', 'Liquidity', 'Fair Value Gaps', 'Order Blocks', 'Market Structure Shift', 'Break of Structure', 'Premium & Discount', 'Multi-timeframe analysis', 'Price action', 'Risk management']}
            glow="rgba(132,85,255,0.2)"
            notice="ILLUSTRATIVE ONLY — NOT A TRADE SIGNAL"
            visual={<div data-chart className="h-full w-full"><TechnicalVisual /></div>}
          />
        </div>
      </div>
    </section>
  )
}
