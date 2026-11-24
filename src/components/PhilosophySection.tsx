import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

const statements = ['QUESTION EVERYTHING.', 'DO YOUR OWN RESEARCH.', 'THINK INDEPENDENTLY.', 'OWN YOUR DECISIONS.']

export default function PhilosophySection() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    const q = gsap.utils.selector(el)

    // Desktop: pinned, scrubbed choreography (native scroll — no hijacking, just a held frame).
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.set(q('[data-p-line1] > span'), { yPercent: 115 })
      gsap.set(q('[data-p-line2] > span'), { yPercent: 115 })
      gsap.set(q('[data-p-copy] p'), { opacity: 0, y: 24 })
      gsap.set(q('[data-p-state]'), { opacity: 0, x: -24 })
      gsap.set(q('[data-p-glow-a],[data-p-glow-b]'), { opacity: 0.25, scale: 0.8 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=210%', pin: true, scrub: 0.7, anticipatePin: 1 },
      })
      tl.to(q('[data-p-line1] > span'), { yPercent: 0, duration: 1 })
        .to(q('[data-p-glow-a]'), { opacity: 0.7, scale: 1, duration: 1.2 }, 0)
        .to(q('[data-p-line1]'), { opacity: 0.55, duration: 0.6 }, '+=0.3')
        .to(q('[data-p-line2] > span'), { yPercent: 0, duration: 1.2, stagger: 0.18 }, '<')
        .to(q('[data-p-glow-b]'), { opacity: 0.85, scale: 1.15, duration: 1.4 }, '<')
        .to(q('[data-p-copy] p'), { opacity: 1, y: 0, duration: 0.8, stagger: 0.35 }, '+=0.3')
      statements.forEach((_, i) => {
        tl.to(q(`[data-p-state="${i}"]`), { opacity: 1, x: 0, duration: 0.6 }, i === 0 ? '+=0.2' : '+=0.25')
      })
      tl.to({}, { duration: 0.6 }) // hold the final frame
    })

    // Mobile: simple, un-pinned scroll reveals.
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      q('[data-p-line1], [data-p-line2]').forEach((n) => {
        gsap.from(n.querySelectorAll('span'), { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: n, start: 'top 88%', once: true } })
      })
      gsap.from(q('[data-p-copy] p'), { opacity: 0, y: 24, stagger: 0.2, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '[data-p-copy]', start: 'top 85%', once: true } })
      gsap.from(q('[data-p-state]'), { opacity: 0, x: -20, stagger: 0.15, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '[data-p-states]', start: 'top 88%', once: true } })
    })

    // ambient drift, any motion-ok device
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(q('[data-p-ring]'), { rotation: 360, duration: 90, ease: 'none', repeat: -1 })
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="philosophy" ref={root} className="relative isolate overflow-hidden bg-black">
      {/* ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div data-p-glow-a className="absolute -left-[10%] top-[8%] h-[60vmax] w-[60vmax] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgba(75,131,255,0.35),transparent_65%)] blur-3xl" />
        <div data-p-glow-b className="absolute -right-[12%] bottom-[-10%] h-[60vmax] w-[60vmax] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgba(230,91,255,0.32),transparent_65%)] blur-3xl" />
        <svg data-p-ring viewBox="0 0 800 800" className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]" fill="none">
          <circle cx="400" cy="400" r="395" stroke="white" strokeDasharray="2 10" />
          <circle cx="400" cy="400" r="300" stroke="white" />
          <circle cx="400" cy="400" r="210" stroke="white" strokeDasharray="1 6" />
          <circle cx="700" cy="400" r="5" fill="#E65BFF" />
          <circle cx="400" cy="100" r="4" fill="#4B83FF" />
        </svg>
      </div>

      <div className="relative flex min-h-[100svh] flex-col justify-center px-6 py-24 sm:px-10 md:py-10 lg:px-16">
        <div className="label mb-6 flex items-center gap-3 md:mb-8">
          <span className="text-[#4B83FF]">06</span> / PHILOSOPHY
        </div>

        <div data-p-line1 className="mask">
          <span className="display text-[clamp(1.7rem,5.2vw,5.4rem)] text-white">TRUST YOUR SELF.</span>
        </div>

        <h2 className="display mt-2 text-[clamp(2.6rem,min(12vw,25vh),14rem)] leading-[0.9]" aria-label="Don't trust us!">
          <span data-p-line2 className="mask"><span className="text-white">DON'T TRUST</span></span>
          <span data-p-line2 className="mask"><span className="bg-gradient-to-r from-white via-[#9bb4ff] to-[#E65BFF] bg-clip-text text-transparent">US!</span></span>
        </h2>

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end">
          <div data-p-copy className="space-y-3 text-[14.5px] leading-relaxed text-[#9999A3] sm:text-base lg:col-span-6">
            <p className="text-white/90">We share research. We share perspectives. We challenge ideas.</p>
            <p>But your decisions should never come from blind trust.</p>
            <p>Question our analysis. Challenge your assumptions. Conduct your own research.</p>
            <p className="text-white">Build your own conviction.</p>
          </div>

          <ul data-p-states className="mono grid grid-cols-1 gap-x-6 gap-y-2 text-[12px] text-white sm:grid-cols-2 lg:col-span-6">
            {statements.map((s, i) => (
              <li key={s} data-p-state={i} className="flex items-center gap-3 border-b border-white/10 py-2.5">
                <span className="text-[10px] text-[#8455FF]">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
