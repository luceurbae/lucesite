import { useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/gsap'

/** Soft follower ring — desktop with a fine pointer only. */
export default function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches || prefersReduced() || window.innerWidth < 1024) {
      el.style.display = 'none'
      return
    }
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY)
      gsap.to(el, { opacity: 1, duration: 0.3, overwrite: 'auto' })
      const hot = (e.target as HTMLElement)?.closest?.('a,button,[role="button"],canvas')
      gsap.to(el, { scale: hot ? 1.9 : 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
    }
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 })
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-white/70 mix-blend-difference"
    />
  )
}
