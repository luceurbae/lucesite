import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isCoarse = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
}

/**
 * Generic scroll reveals.
 *  [data-mask]  -> children `.mask > span` slide up out of a clip
 *  [data-fade]  -> fade + translate (optional data-delay)
 *  [data-stagger] -> its direct children fade + translate in sequence
 */
export function useScrollReveals(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const ctx = gsap.context(() => {
      if (prefersReduced()) return
      root.querySelectorAll<HTMLElement>('[data-mask]').forEach((el) => {
        gsap.from(el.querySelectorAll('.mask > span'), {
          yPercent: 115,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })
      root.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: 'power3.out',
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
      root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [ref])
}
