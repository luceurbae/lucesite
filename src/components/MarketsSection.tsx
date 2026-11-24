import { useRef } from 'react'
import { useScrollReveals } from '../lib/gsap'
import { CANDLES } from '../lib/candles'
import MarketCard from './MarketCard'

/* ---------- abstract visuals ---------- */

function EquitiesVisual() {
  const chips = [
    { t: 'EPS', x: 36, y: 40, d: 1.3 },
    { t: 'P/E', x: 300, y: 28, d: 1.6 },
    { t: 'FCF', x: 316, y: 150, d: 0.9 },
    { t: '10-K', x: 24, y: 168, d: 1.1 },
  ]
  return (
    <svg viewBox="0 0 400 230" className="h-full w-full" fill="none" role="img" aria-label="Abstract equities research visual">
      <defs>
        <linearGradient id="eq-line" x1="0" x2="1"><stop offset="0" stopColor="#4B83FF" /><stop offset="1" stopColor="#9bb4ff" /></linearGradient>
        <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4B83FF" stopOpacity="0.35" /><stop offset="1" stopColor="#4B83FF" stopOpacity="0" /></linearGradient>
      </defs>
      <g data-depth="0.4">
        <path d="M70 190 C110 170 130 150 160 158 S215 120 245 100 S300 70 336 40 V215 H70Z" fill="url(#eq-fill)" />
        <path d="M70 190 C110 170 130 150 160 158 S215 120 245 100 S300 70 336 40" stroke="url(#eq-line)" strokeWidth="2" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(75,131,255,0.9))' }} />
        <circle cx="336" cy="40" r="4" fill="#fff" />
        <circle data-pulse cx="336" cy="40" r="5" stroke="#4B83FF" />
      </g>
      <g data-depth="1.2" data-float>
        <g transform="rotate(-7 190 110)">
          <rect x="120" y="42" width="116" height="144" rx="9" fill="#101216" stroke="rgba(255,255,255,0.16)" />
          <rect x="134" y="58" width="48" height="5" rx="2.5" fill="rgba(255,255,255,0.55)" />
          {[78, 90, 102, 114].map((y, i) => (
            <rect key={y} x="134" y={y} width={88 - i * 12} height="3.5" rx="1.75" fill="rgba(255,255,255,0.14)" />
          ))}
          <rect x="134" y="132" width="88" height="40" rx="5" fill="rgba(75,131,255,0.1)" stroke="rgba(75,131,255,0.35)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={142 + i * 15} y={166 - (8 + ((i * 7) % 20))} width="8" height={8 + ((i * 7) % 20)} rx="1.5" fill={i === 4 ? '#4B83FF' : 'rgba(255,255,255,0.25)'} />
          ))}
        </g>
      </g>
      {chips.map((c) => (
        <g key={c.t} data-depth={c.d} data-float>
          <rect x={c.x} y={c.y} width="46" height="22" rx="11" fill="rgba(20,21,26,0.8)" stroke="rgba(255,255,255,0.18)" />
          <text x={c.x + 23} y={c.y + 14.5} textAnchor="middle" fontSize="9.5" fill="#cfd6ff" fontFamily="JetBrains Mono, monospace" letterSpacing="1">{c.t}</text>
        </g>
      ))}
    </svg>
  )
}

function CfdVisual() {
  const W = 400, H = 230, pad = 14, step = (W - pad * 2) / CANDLES.length
  const y = (p: number) => H - 24 - (p - 25) * (172 / 50)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" role="img" aria-label="Abstract price geometry">
      <defs>
        <linearGradient id="cfd-up" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#8455FF" /></linearGradient>
        <linearGradient id="cfd-curve" x1="0" x2="1"><stop offset="0" stopColor="#8455FF" stopOpacity="0" /><stop offset="0.5" stopColor="#E65BFF" /><stop offset="1" stopColor="#8455FF" stopOpacity="0.3" /></linearGradient>
      </defs>
      <g data-depth="0.5">
        {[0.25, 0.5, 0.75].map((k) => (
          <line key={k} x1="0" x2={W} y1={H * k} y2={H * k} stroke="rgba(255,255,255,0.05)" />
        ))}
        <line x1="0" x2={W} y1={y(72)} y2={y(72)} stroke="#E65BFF" strokeOpacity="0.55" strokeDasharray="3 5" />
        <line x1="0" x2={W} y1={y(33)} y2={y(33)} stroke="#4B83FF" strokeOpacity="0.55" strokeDasharray="3 5" />
        <text x={W - 6} y={y(72) - 5} textAnchor="end" fontSize="8" fill="#E65BFF" fontFamily="JetBrains Mono, monospace" letterSpacing="1.2">LIQUIDITY</text>
        <text x={W - 6} y={y(33) + 12} textAnchor="end" fontSize="8" fill="#4B83FF" fontFamily="JetBrains Mono, monospace" letterSpacing="1.2">LIQUIDITY</text>
      </g>
      <g data-depth="1.1">
        {CANDLES.map(([o, h, l, c], i) => {
          const x = pad + i * step + step / 2
          const up = c >= o
          return (
            <g key={i} opacity={0.35 + (i / CANDLES.length) * 0.65}>
              <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke={up ? '#cfd6ff' : '#8455FF'} strokeWidth="1" />
              <rect x={x - step * 0.3} width={step * 0.6} y={y(Math.max(o, c))} height={Math.max(2, Math.abs(y(o) - y(c)))} rx="1.2" fill={up ? 'url(#cfd-up)' : 'rgba(132,85,255,0.35)'} stroke={up ? 'none' : '#8455FF'} strokeWidth="0.6" />
            </g>
          )
        })}
      </g>
      <g data-depth="1.8" data-float>
        <path d="M10 190 C70 170 120 190 170 140 S260 120 300 80 S360 40 392 30" stroke="url(#cfd-curve)" strokeWidth="2" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(230,91,255,0.9))' }} />
      </g>
    </svg>
  )
}

function CryptoVisual() {
  const cx = 200, cy = 115
  const ring = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 - Math.PI / 2
    const r = 72 + (i % 3) * 14
    return { x: cx + Math.cos(a) * r * 1.35, y: cy + Math.sin(a) * r * 0.78 }
  })
  const frag = [
    { x: 40, y: 50, r: 18, s: 14 },
    { x: 338, y: 40, r: -24, s: 11 },
    { x: 352, y: 168, r: 30, s: 16 },
    { x: 54, y: 178, r: -12, s: 10 },
  ]
  return (
    <svg viewBox="0 0 400 230" className="h-full w-full" fill="none" role="img" aria-label="Abstract blockchain structure">
      <defs>
        <radialGradient id="cr-core" cx="35%" cy="30%"><stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor="#E65BFF" /><stop offset="1" stopColor="#3a1670" /></radialGradient>
      </defs>
      <g data-depth="0.6">
        {ring.map((n, i) => (
          <g key={i}>
            <line x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="rgba(230,91,255,0.28)" />
            <line x1={n.x} y1={n.y} x2={ring[(i + 1) % ring.length].x} y2={ring[(i + 1) % ring.length].y} stroke="rgba(255,255,255,0.12)" />
          </g>
        ))}
      </g>
      <g data-depth="1.3">
        {ring.map((n, i) => (
          <g key={i} data-float>
            <circle cx={n.x} cy={n.y} r={i % 3 === 0 ? 5 : 3.2} fill={i % 2 ? '#8455FF' : '#E65BFF'} style={{ filter: 'drop-shadow(0 0 6px rgba(230,91,255,0.9))' }} />
          </g>
        ))}
      </g>
      <g data-depth="0.9">
        <circle cx={cx} cy={cy} r="34" fill="url(#cr-core)" style={{ filter: 'drop-shadow(0 0 22px rgba(230,91,255,0.7))' }} />
        <circle data-pulse cx={cx} cy={cy} r="34" stroke="#E65BFF" />
        <ellipse cx={cx} cy={cy} rx="52" ry="14" stroke="rgba(255,255,255,0.35)" transform={`rotate(-20 ${cx} ${cy})`} />
      </g>
      {frag.map((f, i) => (
        <g key={i} data-depth={1.6 + i * 0.2} data-float>
          <rect x={f.x} y={f.y} width={f.s} height={f.s} rx="2" transform={`rotate(${f.r} ${f.x + f.s / 2} ${f.y + f.s / 2})`} fill="rgba(132,85,255,0.25)" stroke="rgba(230,91,255,0.7)" />
        </g>
      ))}
    </svg>
  )
}

/* ---------- section ---------- */

export default function MarketsSection() {
  const root = useRef<HTMLElement>(null)
  useScrollReveals(root)

  return (
    <section id="markets" ref={root} className="relative bg-[#08090B] px-6 py-28 sm:px-10 md:py-36 lg:px-16">
      <div className="mb-16 grid gap-6 md:mb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div data-fade className="label mb-8 flex items-center gap-3">
            <span className="text-[#4B83FF]">02</span> / MARKETS WE EXPLORE
          </div>
          <h2 data-mask className="display text-[clamp(2.4rem,5.6vw,5.2rem)] text-white">
            <span className="mask"><span>Three markets.</span></span>
            <span className="mask"><span className="text-[#9999A3]">One research mindset.</span></span>
          </h2>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <MarketCard
          className="lg:col-span-7"
          index="01 — EQUITIES"
          kicker="GLOBAL STOCK MARKETS"
          title="Equities."
          desc="We research publicly traded companies, financial statements, earnings, valuations, catalysts, sectors, and emerging opportunities."
          topics={['Stock research', 'Company fundamentals', 'Earnings', 'Valuation', 'Sector rotation', 'Financial statements', 'Catalysts']}
          accent="75,131,255"
          visual={<EquitiesVisual />}
        />
        <MarketCard
          className="lg:col-span-5 lg:mt-28"
          index="02 — CFD"
          kicker="GLOBAL MACRO & PRICE MARKETS"
          title="CFD Markets."
          desc="We study global market movements through macroeconomic conditions, technical analysis, price action, liquidity, and risk."
          topics={['Forex', 'Gold', 'Indices', 'Commodities', 'Macroeconomics', 'Volatility', 'Trading setups']}
          accent="132,85,255"
          visual={<CfdVisual />}
        />
        <MarketCard
          className="lg:col-span-6 lg:col-start-4 lg:-mt-6"
          index="03 — CRYPTO"
          kicker="DIGITAL ASSET ECOSYSTEM"
          title="Digital Assets."
          desc="We explore cryptocurrency markets, narratives, on-chain developments, liquidity, blockchain ecosystems, and emerging trends."
          topics={['Bitcoin', 'Ethereum', 'Altcoins', 'On-chain', 'Narratives', 'Liquidity', 'Ecosystems']}
          accent="230,91,255"
          visual={<CryptoVisual />}
        />
      </div>
    </section>
  )
}
