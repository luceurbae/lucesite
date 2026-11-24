import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReduced, scrollToId, useScrollReveals } from '../lib/gsap'

const nav: [string, string][] = [
  ['ABOUT', 'about'],
  ['RESEARCH', 'research'],
  ['MARKETS', 'markets'],
  ['PHILOSOPHY', 'philosophy'],
]

export default function Footer() {
  const root = useRef<HTMLElement>(null)
  useScrollReveals(root)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      if (prefersReduced()) return
      gsap.to('[data-f-glow]', { x: 40, y: -20, scale: 1.1, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.from('[data-f-logo]', {
        yPercent: 22, opacity: 0, duration: 1.6, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 55%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={root} className="relative overflow-hidden bg-[#050505] px-6 pb-8 pt-28 sm:px-10 md:pt-40 lg:px-16">
      {/* ambient light */}
      <div className="pointer-events-none absolute inset-0">
        <div data-f-glow className="absolute left-1/2 top-[38%] h-[520px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(75,131,255,0.22),rgba(132,85,255,0.16)_45%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(230,91,255,0.18),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative">
        <h2 data-mask className="display max-w-[16ch] text-[clamp(2.2rem,6.6vw,6.8rem)] text-white">
          <span className="mask"><span>TRUST YOUR SELF,</span></span>
          <span className="mask"><span className="bg-gradient-to-r from-white via-[#b9c9ff] to-[#E65BFF] bg-clip-text text-transparent">DON'T TRUST US!</span></span>
        </h2>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2">
          <div data-fade className="mono space-y-2 text-[12px] text-[#9999A3]">
            <div>INDEPENDENT THINKING.</div>
            <div>GLOBAL RESEARCH.</div>
            <div>MARKET PERSPECTIVE.</div>
          </div>
          <nav data-fade aria-label="Footer" className="mono flex flex-wrap gap-x-8 gap-y-3 text-[12px] md:justify-end">
            {nav.map(([label, id]) => (
              <button key={id} onClick={() => scrollToId(id)} className="text-white/80 transition-colors duration-300 hover:text-[#E65BFF]">
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div data-f-logo className="select-none overflow-hidden pt-10 text-center md:pt-16" aria-hidden="true">
          <div className="display bg-gradient-to-b from-white via-white/70 to-transparent bg-clip-text text-[clamp(7rem,30vw,32rem)] leading-[0.85] text-transparent">
            LUCE.
          </div>
        </div>

        <div className="mono -mt-2 flex flex-col gap-2 border-t border-white/10 pt-6 text-[10px] text-[#6d6d78] md:flex-row md:items-center md:justify-between">
          <span>LUCE / INDEPENDENT TRADING & RESEARCH COMMUNITY</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#4B83FF] shadow-[0_0_8px_2px_rgba(75,131,255,0.8)]" />PRIVATE COMMUNITY</span>
          <span>© LUCE 2026</span>
        </div>
      </div>
    </footer>
  )
}
