import { useRef } from 'react'
import { useScrollReveals } from '../lib/gsap'

const rows: [string, string, boolean][] = [
  ['ACCESS', 'PRIVATE', true],
  ['PUBLIC', 'CLOSED', false],
  ['STATUS', 'DEVELOPING', false],
]

export default function PrivateStatus() {
  const root = useRef<HTMLElement>(null)
  useScrollReveals(root)

  return (
    <section id="private" ref={root} className="relative overflow-hidden bg-[#08090B] px-6 py-28 sm:px-10 md:py-40 lg:px-16">
      <div className="pointer-events-none absolute left-[18%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(75,131,255,0.14),transparent_65%)] blur-2xl" />

      <div className="relative grid items-center gap-14 lg:grid-cols-12">
        <div data-fade className="lg:col-span-5">
          <div className="glass relative max-w-md rounded-2xl p-6 shadow-[0_30px_80px_-30px_rgba(75,131,255,0.35)]">
            <div className="mono flex items-center justify-between text-[10.5px] text-[#9999A3]">
              <span>LUCE / COMMUNITY STATUS</span>
              <span className="dot-pulse h-2 w-2 rounded-full bg-[#4B83FF] shadow-[0_0_12px_3px_rgba(75,131,255,0.8)]" aria-hidden="true" />
            </div>
            <div className="mt-6 space-y-0 border-t border-white/10">
              {rows.map(([k, v, on]) => (
                <div key={k} className="mono flex items-center justify-between border-b border-white/10 py-3.5 text-[12px]">
                  <span className="text-[#9999A3]">{k}</span>
                  <span className="flex items-center gap-2 text-white">
                    <span className="text-white/30">:</span> {v}
                    {on && <span className="h-1.5 w-1.5 rounded-full bg-[#8455FF] shadow-[0_0_8px_2px_rgba(132,85,255,0.9)]" />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-10">
          <div data-fade className="label mb-8 flex items-center gap-3">
            <span className="text-[#4B83FF]">07</span> / PRIVATE COMMUNITY
          </div>
          <h2 data-mask className="display text-[clamp(2.6rem,6.4vw,6rem)] text-white">
            <span className="mask"><span>Not open.</span></span>
            <span className="mask"><span className="text-[#9999A3]">Not yet.</span></span>
          </h2>
          <div data-stagger className="mt-10 max-w-lg space-y-5 text-[15px] leading-relaxed text-[#9999A3] sm:text-base">
            <p className="text-white/90">LUCE is currently a private community.</p>
            <p>We are developing our research environment, shaping our culture, and building a space for independent market perspectives.</p>
            <p>For now, access remains private.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
