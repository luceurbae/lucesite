import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReduced, ScrollTrigger, useScrollReveals } from '../lib/gsap'

export default function AboutSection() {
  const root = useRef<HTMLElement>(null)
  useScrollReveals(root)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      if (prefersReduced()) return
      gsap.to('[data-orb]', { y: -22, x: 10, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('[data-orb-halo]', { scale: 1.15, opacity: 0.9, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('[data-about-glow]', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-[#08090B] px-6 py-28 sm:px-10 md:py-40 lg:px-16">
      <div data-about-glow className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(132,85,255,0.22),transparent_65%)] blur-2xl" />

      <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div data-fade className="label mb-8 flex items-center gap-3">
            <span className="text-[#4B83FF]">01</span> / ABOUT LUCE
          </div>
          <h2 data-mask className="display text-[clamp(2.4rem,6vw,5.6rem)] text-white">
            <span className="mask"><span>Beyond the</span></span>
            <span className="mask"><span>chart. Beyond</span></span>
            <span className="mask"><span className="text-[#9999A3]">the noise.</span></span>
          </h2>

          <div data-stagger className="mono mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[11px] text-white/80">
            <span><span className="text-[#4B83FF]">/</span> INDEPENDENT</span>
            <span><span className="text-[#8455FF]">/</span> RESEARCH-DRIVEN</span>
            <span><span className="text-[#E65BFF]">/</span> GLOBAL PERSPECTIVE</span>
          </div>
        </div>

        <div className="relative lg:col-span-5 lg:pt-24">
          {/* floating light sphere */}
          <div data-orb className="pointer-events-none absolute -top-6 right-2 h-16 w-16 sm:right-10 lg:-top-4 lg:right-0">
            <div data-orb-halo className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(230,91,255,0.5),rgba(75,131,255,0.2)_50%,transparent_70%)] blur-xl" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#fff,#9bb4ff_22%,#8455ff_55%,#1b1040_100%)] shadow-[0_0_50px_8px_rgba(132,85,255,0.55)]" />
          </div>

          <div data-stagger className="relative space-y-6 text-[15px] leading-[1.75] text-[#9999A3] sm:text-base">
            <p className="text-[clamp(1.2rem,1.9vw,1.6rem)] font-light leading-snug tracking-tight text-white">
              LUCE is an independent trading and market research community.
            </p>
            <p>
              We believe markets should be approached with curiosity, discipline, and critical thinking. Every movement has a context. Every thesis should be questioned. Every decision should be understood.
            </p>
            <p className="text-white/90">We explore the markets together, but conviction is built individually.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
