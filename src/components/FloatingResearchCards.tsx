import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/gsap'

type CardProps = {
  kicker: string
  title: string
  sub: string
  className: string
  visual: React.ReactNode
  floatY: number
  floatDur: number
}

function ResearchCard({ kicker, title, sub, className, visual, floatY, floatDur }: CardProps) {
  const inner = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (prefersReduced() || !inner.current) return
    const tw = gsap.to(inner.current, {
      y: floatY,
      rotation: floatY > 0 ? 0.6 : -0.6,
      duration: floatDur,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 1.5,
    })
    return () => {
      tw.kill()
    }
  }, [floatY, floatDur])

  return (
    <div data-hero-card className={`absolute ${className}`}>
      <div
        ref={inner}
        className="glass w-[168px] rounded-xl p-3 shadow-[0_20px_60px_-20px_rgba(75,131,255,0.35)] sm:w-[188px] sm:p-3.5"
      >
        <div className="mono flex items-center justify-between text-[8.5px] text-[#9999A3] sm:text-[9px]">
          <span>{kicker}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#4B83FF] shadow-[0_0_8px_2px_rgba(75,131,255,0.8)]" />
        </div>
        <div className="mt-3 h-[34px]">{visual}</div>
        <div className="mt-2.5 text-[13px] font-medium tracking-tight text-white sm:text-[14px]">{title}</div>
        <div className="mono mt-1 text-[8.5px] text-[#9999A3] sm:text-[9px]">{sub}</div>
      </div>
    </div>
  )
}

const stroke = 'url(#hc-g)'

const defs = (
  <defs>
    <linearGradient id="hc-g" x1="0" x2="1">
      <stop offset="0" stopColor="#4B83FF" />
      <stop offset="1" stopColor="#E65BFF" />
    </linearGradient>
  </defs>
)

const VisEquity = (
  <svg viewBox="0 0 160 34" className="h-full w-full" fill="none">
    {defs}
    <path d="M0 26 C14 24 20 14 34 17 S58 28 72 18 S98 6 112 12 S140 14 160 4" stroke={stroke} strokeWidth="1.4" />
    <path d="M0 26 C14 24 20 14 34 17 S58 28 72 18 S98 6 112 12 S140 14 160 4 V34 H0Z" fill="url(#hc-g)" opacity="0.08" />
  </svg>
)

const VisStructure = (
  <svg viewBox="0 0 160 34" className="h-full w-full" fill="none">
    {defs}
    <path d="M0 28 L24 18 L40 24 L68 8 L84 16 L112 4 L128 12 L160 2" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M0 30 H160" stroke="rgba(255,255,255,0.12)" strokeDasharray="2 3" />
    <rect x="84" y="14" width="26" height="6" fill="#8455FF" opacity="0.25" />
  </svg>
)

const VisMacro = (
  <svg viewBox="0 0 160 34" className="h-full w-full" fill="none">
    {defs}
    {[8, 20, 14, 26, 18, 30, 22, 28].map((h, i) => (
      <rect key={i} x={i * 20 + 4} y={34 - h} width="10" height={h} rx="1.5" fill={i === 5 ? 'url(#hc-g)' : 'rgba(255,255,255,0.14)'} />
    ))}
  </svg>
)

export default function FloatingResearchCards() {
  return (
    <>
      <ResearchCard
        kicker="MARKET RESEARCH"
        title="US EQUITIES"
        sub="FUNDAMENTAL / TECHNICAL"
        visual={VisEquity}
        floatY={-9}
        floatDur={4.6}
        className="left-[2%] top-[6%] sm:left-[6%] sm:top-[8%]"
      />
      <ResearchCard
        kicker="MARKET STRUCTURE"
        title="LIQUIDITY"
        sub="ICT FRAMEWORK"
        visual={VisStructure}
        floatY={10}
        floatDur={5.4}
        className="bottom-[4%] right-[2%] sm:bottom-[10%] sm:left-[34%] sm:right-auto"
      />
      <ResearchCard
        kicker="GLOBAL OUTLOOK"
        title="MACRO"
        sub="MARKET CATALYSTS"
        visual={VisMacro}
        floatY={-8}
        floatDur={5}
        className="right-0 top-[38%] hidden lg:block"
      />
    </>
  )
}
