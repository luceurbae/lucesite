import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/gsap'

const phrases: { t: string; kind: 'hero' | 'white' | 'mute' | 'accent' }[] = [
  { t: "TRUST YOUR SELF, DON'T TRUST US!", kind: 'hero' },
  { t: 'INDEPENDENT THINKING', kind: 'mute' },
  { t: 'RESEARCH EVERYTHING', kind: 'white' },
  { t: 'NO BLIND FOLLOWING', kind: 'mute' },
  { t: 'SEE THE MARKET DIFFERENTLY', kind: 'accent' },
  { t: 'TECHNICAL × FUNDAMENTAL', kind: 'mute' },
  { t: 'GLOBAL RESEARCH', kind: 'white' },
  { t: 'THINK BEFORE YOU TRADE', kind: 'mute' },
]
const seps = ['✳', '+', '/', '—']

const style = {
  hero: 'text-white',
  white: 'text-white/90',
  mute: 'text-[#6d6d78]',
  accent: 'bg-gradient-to-r from-[#4B83FF] via-[#8455FF] to-[#E65BFF] bg-clip-text text-transparent',
} as const

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {phrases.map((p, i) => (
        <div key={i} className="flex shrink-0 items-center">
          <span className={`whitespace-nowrap px-7 text-[clamp(1.15rem,2.4vw,2rem)] font-medium tracking-[-0.02em] ${style[p.kind]}`}>{p.t}</span>
          <span className="px-1 text-[1.1rem] text-[#8455FF]/80">{seps[i % seps.length]}</span>
        </div>
      ))}
    </div>
  )
}

export default function Ticker() {
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = track.current
    if (!el || prefersReduced()) return
    // The track holds two identical halves; sliding by exactly -50% loops with no visible reset.
    const tween = gsap.to(el, { xPercent: -50, ease: 'none', duration: 70, repeat: -1 })
    const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6, ease: 'power2.out', overwrite: true })
    const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.8, ease: 'power2.out', overwrite: true })
    const wrap = el.parentElement!
    wrap.addEventListener('pointerenter', slow)
    wrap.addEventListener('pointerleave', fast)
    return () => {
      wrap.removeEventListener('pointerenter', slow)
      wrap.removeEventListener('pointerleave', fast)
      tween.kill()
    }
  }, [])

  return (
    <section aria-label="LUCE principles" className="relative border-y border-white/10 bg-[#101114] py-5 md:py-6">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div ref={track} className="flex w-max will-change-transform">
          <div className="flex shrink-0"><Group /><Group /></div>
          <div className="flex shrink-0"><Group hidden /><Group hidden /></div>
        </div>
      </div>
    </section>
  )
}
