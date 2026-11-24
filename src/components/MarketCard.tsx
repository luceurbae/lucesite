import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, prefersReduced, isCoarse } from '../lib/gsap'

type Props = {
  index: string
  kicker: string
  title: string
  desc: string
  topics: string[]
  visual: React.ReactNode
  accent: string // rgb triplet e.g. "75,131,255"
  className?: string
  visualHeight?: string
}

/**
 * Asymmetric research card. Hover: lift + tilt, spotlight follows the cursor,
 * border brightens, abstract visual layers shift at different depths.
 */
export default function MarketCard({ index, kicker, title, desc, topics, visual, accent, className = '', visualHeight = 'h-[260px]' }: Props) {
  const card = useRef<HTMLElement>(null)
  const lift = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = card.current
    const inner = lift.current
    if (!el || !inner) return
    const ctx = gsap.context(() => {
      if (prefersReduced()) return

      // entrance
      gsap.from(el, {
        opacity: 0,
        y: 70,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })

      // layers that both drift ambiently and respond to the cursor get a nested group,
      // so the two tweens never fight over the same transform.
      el.querySelectorAll<SVGElement>('[data-float][data-depth]').forEach((n) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        while (n.firstChild) g.appendChild(n.firstChild)
        n.appendChild(g)
        n.removeAttribute('data-float')
        g.setAttribute('data-float', '')
      })

      // ambient motion of the abstract visual
      el.querySelectorAll<SVGElement>('[data-float]').forEach((n, i) => {
        gsap.to(n, { y: i % 2 ? 7 : -8, duration: 3 + (i % 4) * 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 })
      })
      el.querySelectorAll<SVGElement>('[data-pulse]').forEach((n, i) => {
        gsap.fromTo(
          n,
          { scale: 0.6, opacity: 0.7, transformOrigin: '50% 50%' },
          { scale: 2.1, opacity: 0, duration: 2.6, ease: 'power1.out', repeat: -1, delay: i * 0.35 },
        )
      })

      if (isCoarse()) return
      const depthEls = el.querySelectorAll<SVGElement>('[data-depth]')
      const setRX = gsap.quickTo(inner, 'rotationX', { duration: 0.7, ease: 'power3.out' })
      const setRY = gsap.quickTo(inner, 'rotationY', { duration: 0.7, ease: 'power3.out' })
      gsap.set(inner, { transformPerspective: 1100, transformOrigin: '50% 50%' })

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
        setRY((px - 0.5) * 7)
        setRX(-(py - 0.5) * 7)
        depthEls.forEach((d) => {
          const k = Number(d.dataset.depth)
          gsap.to(d, { x: (px - 0.5) * k * 34, y: (py - 0.5) * k * 26, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
        })
      }
      const enter = () => gsap.to(inner, { y: -8, duration: 0.6, ease: 'power3.out' })
      const leave = () => {
        gsap.to(inner, { y: 0, rotationX: 0, rotationY: 0, duration: 0.9, ease: 'expo.out' })
        gsap.to(depthEls, { x: 0, y: 0, duration: 1, ease: 'expo.out', overwrite: 'auto' })
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerenter', enter)
      el.addEventListener('pointerleave', leave)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <article ref={card} className={`group relative ${className}`} style={{ ['--accent' as string]: accent }}>
      <div
        ref={lift}
        className="relative h-full overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(160deg,#141519_0%,#0d0e11_70%)] p-6 transition-[border-color,box-shadow] duration-500 group-hover:border-white/30 sm:p-8"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        {/* cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(520px circle at var(--mx,50%) var(--my,40%), rgba(${accent},0.20), transparent 60%)` }}
        />
        {/* resting glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `rgba(${accent},0.16)`, opacity: 0.55 }}
        />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="mono text-[11px] text-white/40">{index}</div>
            <div className="label mt-2">{kicker}</div>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-500 group-hover:border-white/50 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className={`relative my-4 ${visualHeight}`}>{visual}</div>

        <h3 className="display relative text-[clamp(2rem,3.4vw,3.2rem)] text-white">{title}</h3>
        <p className="relative mt-3 max-w-[34rem] text-[14.5px] leading-relaxed text-[#9999A3]">{desc}</p>
        <ul className="relative mt-6 flex flex-wrap gap-2">
          {topics.map((t) => (
            <li key={t} className="mono rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10px] text-[#b4b4bd] transition-colors duration-300 group-hover:border-white/20">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
