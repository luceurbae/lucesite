import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { gsap, prefersReduced, scrollToId } from '../lib/gsap'

const links: [string, string][] = [
  ['ABOUT', 'about'],
  ['RESEARCH', 'research'],
  ['MARKETS', 'markets'],
  ['PHILOSOPHY', 'philosophy'],
]

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-[18px] w-[18px] place-items-center rounded-full border border-white/80">
        <span className="h-[7px] w-[7px] rounded-full bg-white shadow-[0_0_10px_2px_rgba(132,85,255,0.9)]" />
      </span>
      <span className="text-[15px] font-medium tracking-[0.14em] text-white">LUCE</span>
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReduced() || !wrap.current) return
    const tween = gsap.fromTo(
      wrap.current,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.45 },
    )
    return () => {
      tween.kill()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = panel.current
    if (!el) return
    if (prefersReduced()) {
      el.style.display = open ? 'block' : 'none'
      return
    }
    if (open) {
      el.style.display = 'block'
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.55, ease: 'expo.out' })
      gsap.fromTo(el.querySelectorAll('a,button'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.1, ease: 'power3.out' })
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: 'power3.in', onComplete: () => { el.style.display = 'none' } })
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    setTimeout(() => scrollToId(id), open ? 60 : 0)
  }

  const glass = scrolled || open
    ? 'bg-[rgba(12,13,16,0.72)] backdrop-blur-xl'
    : 'bg-[rgba(16,17,20,0.35)] backdrop-blur-md'

  return (
    <div className="sticky top-0 z-50 h-0">
      <div ref={wrap} className="absolute inset-x-0 top-4 flex justify-center px-4 md:top-6 md:px-8">
        <div className="w-full max-w-[1180px]">
          {/* Desktop */}
          <nav className="hidden items-center gap-3 md:flex" aria-label="Primary">
            <button
              onClick={() => scrollToId('top')}
              className={`flex h-12 items-center rounded-full border border-white/10 px-6 transition-colors duration-500 hover:border-white/25 ${glass}`}
              aria-label="LUCE — back to top"
            >
              <Logo />
            </button>
            <div className={`flex h-12 flex-1 items-center justify-center gap-1 rounded-full border border-white/10 px-3 transition-colors duration-500 ${glass}`}>
              {links.map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className="mono rounded-full px-5 py-2 text-[11px] text-[#9999A3] transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => go('private')}
              className={`group mono flex h-12 items-center gap-2 rounded-full border border-white/15 px-6 text-[11px] text-white transition-all duration-300 hover:bg-white hover:text-black ${glass}`}
            >
              PRIVATE ACCESS
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </nav>

          {/* Mobile */}
          <div className={`rounded-[26px] border border-white/10 transition-colors duration-500 md:hidden ${glass}`}>
            <div className="flex h-12 items-center justify-between pl-5 pr-2">
              <Logo />
              <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white"
              >
                {open ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
            <div ref={panel} className="hidden overflow-hidden" style={{ height: 0 }}>
              <div className="flex flex-col gap-1 px-3 pb-4 pt-1">
                {links.map(([label, id]) => (
                  <button key={id} onClick={() => go(id)} className="mono rounded-2xl px-4 py-3 text-left text-[12px] text-[#c9c9d1] hover:bg-white/5">
                    {label}
                  </button>
                ))}
                <button onClick={() => go('private')} className="mono mt-2 flex items-center justify-between rounded-2xl border border-white/15 px-4 py-3 text-[12px] text-white">
                  PRIVATE ACCESS <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
