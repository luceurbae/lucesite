import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, prefersReduced, scrollToId } from '../lib/gsap'
import FloatingResearchCards from './FloatingResearchCards'

const HeroObject = lazy(() => import('./HeroObject'))

export default function HeroSection() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      if (prefersReduced()) return
      gsap.set(q('.mask > span'), { yPercent: 115 })
      gsap.set(q('[data-h-fade]'), { opacity: 0, y: 24 })
      gsap.set(q('[data-hero-object]'), { opacity: 0, scale: 0.72 })
      gsap.set(q('[data-hero-glow]'), { opacity: 0, scale: 0.6 })
      gsap.set(q('[data-hero-card]'), { opacity: 0, y: 30, scale: 0.94 })
      gsap.set(q('[data-rail]'), { opacity: 0, scaleX: 0.3 })

      const tl = gsap.timeline({ delay: 0.55, defaults: { ease: 'power3.out' } })
      tl.to(q('[data-h-label]'), { opacity: 1, y: 0, duration: 0.8 }, 0)
        .to(q('.mask > span'), { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.12 }, 0.1)
        .to(q('[data-h-text]'), { opacity: 1, y: 0, duration: 0.9 }, 0.75)
        .to(q('[data-hero-glow]'), { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, 0.8)
        .to(q('[data-rail]'), { opacity: 1, scaleX: 1, duration: 1.4, ease: 'expo.out' }, 0.85)
        .to(q('[data-hero-object]'), { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.9)
        .to(q('[data-hero-card]'), { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.2 }, 1.35)
        .to(q('[data-h-cta]'), { opacity: 1, y: 0, duration: 0.8 }, 1.9)

      // ambient breathing of the glow
      gsap.to(q('[data-hero-glow-inner]'), { scale: 1.08, opacity: 0.85, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={root} className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:min-h-[max(100svh,760px)] lg:flex-row lg:items-center">
      {/* background lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_72%_46%,rgba(60,50,150,0.30),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#08090B] to-transparent" />
      </div>

      {/* LEFT */}
      <div className="relative z-10 px-6 pb-8 pt-32 sm:px-10 lg:w-[46%] lg:px-16 lg:pb-0 lg:pt-24">
        <div data-h-label className="label mb-7 flex items-center gap-3">
          <span className="h-px w-8 bg-white/30" />
          INDEPENDENT MARKET RESEARCH
        </div>
        <h1 className="display text-[clamp(2.5rem,4.7vw,5rem)] text-white [&_.mask]:whitespace-nowrap">
          <span className="mask"><span>We navigate</span></span>
          <span className="mask"><span>markets through</span></span>
          <span className="mask"><span className="bg-gradient-to-r from-white via-white to-[#9bb4ff] bg-clip-text text-transparent">research.</span></span>
        </h1>
        <p data-h-text className="mt-7 max-w-[30rem] text-[15px] leading-relaxed text-[#9999A3] sm:text-base">
          An independent trading community exploring financial markets through technical precision, fundamental understanding, and global research.
        </p>
        <div data-h-text className="mono mt-8 text-[12px] tracking-[0.2em] text-white/90">
          EQUITIES <span className="text-[#8455FF]">×</span> CFD <span className="text-[#E65BFF]">×</span> CRYPTO
        </div>
        <button
          data-h-cta
          onClick={() => scrollToId('about')}
          className="group mono mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 py-2.5 pl-5 pr-3 text-[11px] text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.04]"
        >
          DISCOVER LUCE
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-y-0.5">
            <ArrowDown size={13} />
          </span>
        </button>
      </div>

      {/* RIGHT */}
      <div className="relative h-[460px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[62%]">
        {/* glow behind object */}
        <div data-hero-glow className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 lg:left-[48%]">
          <div data-hero-glow-inner className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_40%,rgba(75,131,255,0.5),rgba(132,85,255,0.28)_40%,rgba(230,91,255,0.2)_62%,transparent_72%)] blur-[60px]" />
        </div>

        {/* light rail (echoes the reference's glowing floor line) */}
        <div data-rail className="pointer-events-none absolute -left-[10%] bottom-[16%] right-0 origin-left -rotate-[4deg] lg:bottom-[19%]">
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#4B83FF] to-[#E65BFF] shadow-[0_0_24px_4px_rgba(100,100,255,0.55)]" />
          <div className="mt-[3px] h-24 w-full bg-gradient-to-b from-[rgba(100,90,255,0.18)] to-transparent [mask-image:linear-gradient(to_right,transparent,black_30%)]" />
          <span className="absolute -top-3 right-[22%] h-3 w-3 rounded-[3px] bg-[#E65BFF]/90 shadow-[0_0_24px_6px_rgba(230,91,255,0.7)]" />
          <span className="absolute -top-2 right-[10%] h-2 w-2 rounded-[2px] bg-[#8455FF] shadow-[0_0_18px_5px_rgba(132,85,255,0.7)]" />
          <span className="absolute -top-3 left-[30%] h-2.5 w-2.5 rounded-[2px] bg-[#4B83FF] shadow-[0_0_20px_5px_rgba(75,131,255,0.75)]" />
        </div>

        <div data-hero-object className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-[52%] lg:left-[48%] lg:h-[88%] lg:w-[80%]">
          <Suspense fallback={null}>
            <HeroObject />
          </Suspense>
        </div>

        <FloatingResearchCards />
      </div>
    </section>
  )
}
