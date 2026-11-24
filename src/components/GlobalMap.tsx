import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReduced, ScrollTrigger, useScrollReveals } from '../lib/gsap'

type Place = { name: string; lat: number; lon: number; hub?: boolean }

const PLACES: Place[] = [
  { name: 'INDONESIA', lat: -2, lon: 118, hub: true },
  { name: 'UNITED STATES', lat: 39, lon: -98 },
  { name: 'EUROPE', lat: 50, lon: 10 },
  { name: 'JAPAN', lat: 36, lon: 138 },
  { name: 'HONG KONG', lat: 22.3, lon: 114.2 },
]
// connections between PLACES indices
const LINKS: [number, number][] = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [2, 3]]

const d2r = Math.PI / 180
const vec = (lat: number, lon: number): [number, number, number] => {
  const p = lat * d2r, l = lon * d2r
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)]
}
const slerp = (a: number[], b: number[], t: number): [number, number, number] => {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const om = Math.acos(dot)
  const s = Math.sin(om) || 1
  const k1 = Math.sin((1 - t) * om) / s
  const k2 = Math.sin(t * om) / s
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2]
}

// Abstract "continent-like" density field — a conceptual globe, not a map.
const landish = (lat: number, lon: number) =>
  Math.sin(lat * 0.09 + lon * 0.045) + Math.sin(lon * 0.07 - lat * 0.05 + 1.3) * 0.8 + Math.sin(lat * 0.2 + 2) * Math.sin(lon * 0.11) * 0.7

function buildDots(count: number) {
  const out: { v: [number, number, number]; on: boolean }[] = []
  const g = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = g * i
    const v: [number, number, number] = [Math.cos(th) * r, y, Math.sin(th) * r]
    const lat = Math.asin(y) / d2r
    const lon = Math.atan2(v[0], v[2]) / d2r
    out.push({ v, on: landish(lat, lon) > 0.55 })
  }
  return out
}

export default function GlobalMap() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  useScrollReveals(root)

  useLayoutEffect(() => {
    const cv = canvas.current
    const box = wrap.current
    const section = root.current
    if (!cv || !box || !section) return
    const ctx2d = cv.getContext('2d')
    if (!ctx2d) return

    const reduced = prefersReduced()
    const small = window.innerWidth < 768
    const dots = buildDots(small ? 900 : 1700)
    const pv = PLACES.map((p) => vec(p.lat, p.lon))

    const state = {
      rot: -118 * d2r, // start facing Indonesia
      speed: reduced ? 0 : 0.045, // rad / s
      nodes: PLACES.map(() => (reduced ? 1 : 0)),
      lines: LINKS.map(() => (reduced ? 1 : 0)),
      active: true,
      dragging: false,
      tilt: 0.38,
      w: 0, h: 0, dpr: 1,
    }

    const resize = () => {
      const r = box.getBoundingClientRect()
      state.dpr = Math.min(window.devicePixelRatio || 1, 2)
      state.w = r.width
      state.h = r.height
      cv.width = Math.round(r.width * state.dpr)
      cv.height = Math.round(r.height * state.dpr)
    }
    resize()
    const ro = new ResizeObserver(() => { resize(); render() })
    ro.observe(box)

    const project = (v: number[], R: number, cx: number, cy: number, scale = 1) => {
      const cr = Math.cos(state.rot), sr = Math.sin(state.rot)
      const x1 = v[0] * cr + v[2] * sr
      const z1 = -v[0] * sr + v[2] * cr
      const ct = Math.cos(state.tilt), st = Math.sin(state.tilt)
      const y2 = v[1] * ct - z1 * st
      const z2 = v[1] * st + z1 * ct
      return { x: cx + x1 * R * scale, y: cy - y2 * R * scale, z: z2 }
    }

    function render() {
      const { w, h, dpr } = state
      const g = ctx2d!
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, w, h)
      const cx = w / 2, cy = h / 2
      const R = Math.min(w, h) * 0.38

      // sphere body
      const body = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R)
      body.addColorStop(0, 'rgba(40,52,110,0.55)')
      body.addColorStop(0.6, 'rgba(12,14,30,0.85)')
      body.addColorStop(1, 'rgba(6,7,14,0.95)')
      g.fillStyle = body
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill()
      g.strokeStyle = 'rgba(120,150,255,0.35)'
      g.lineWidth = 1
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke()

      // dots
      for (const d of dots) {
        const p = project(d.v, R, cx, cy)
        if (p.z <= 0) continue
        const a = (d.on ? 0.85 : 0.2) * (0.25 + p.z * 0.75)
        g.fillStyle = d.on ? `rgba(155,184,255,${a})` : `rgba(110,125,190,${a})`
        const s = (d.on ? 1.35 : 0.9) * (small ? 0.9 : 1)
        g.fillRect(p.x - s / 2, p.y - s / 2, s, s)
      }

      // orbit ring = "global markets"
      g.save()
      g.strokeStyle = 'rgba(230,91,255,0.35)'
      g.setLineDash([2, 6])
      g.lineWidth = 1
      g.beginPath()
      g.ellipse(cx, cy, R * 1.28, R * 0.34, -0.38, 0, Math.PI * 2)
      g.stroke()
      g.restore()
      const oa = state.rot * 0.6
      const ox = cx + Math.cos(oa) * R * 1.28 * Math.cos(-0.38) - Math.sin(oa) * R * 0.34 * Math.sin(-0.38)
      const oy = cy + Math.cos(oa) * R * 1.28 * Math.sin(-0.38) + Math.sin(oa) * R * 0.34 * Math.cos(-0.38)
      g.fillStyle = '#E65BFF'
      g.shadowColor = '#E65BFF'; g.shadowBlur = 14
      g.beginPath(); g.arc(ox, oy, 2.6, 0, Math.PI * 2); g.fill()
      g.shadowBlur = 0
      g.font = '500 9px "JetBrains Mono", monospace'
      g.fillStyle = 'rgba(230,91,255,0.85)'
      g.fillText('GLOBAL MARKETS', ox + 8, oy - 8)

      // arcs
      LINKS.forEach(([a, b], li) => {
        const prog = state.lines[li]
        if (prog <= 0.001) return
        const steps = 48
        const last = Math.floor(steps * prog)
        let prev: { x: number; y: number; z: number } | null = null
        for (let i = 0; i <= last; i++) {
          const t = i / steps
          const v = slerp(pv[a], pv[b], t)
          const lift = 1 + 0.2 * Math.sin(Math.PI * t)
          const p = project([v[0] * lift, v[1] * lift, v[2] * lift], R, cx, cy)
          if (prev && (p.z > -0.05 || prev.z > -0.05)) {
            const alpha = Math.max(0, Math.min(1, 0.25 + p.z)) * 0.9
            g.strokeStyle = `rgba(${a === 0 ? '120,160,255' : '190,120,255'},${alpha})`
            g.lineWidth = 1.2
            g.beginPath(); g.moveTo(prev.x, prev.y); g.lineTo(p.x, p.y); g.stroke()
          }
          prev = p
        }
        // travelling pulse on a finished arc
        if (prog >= 1 && !reduced) {
          const tt = ((performance.now() / 3200) + li * 0.17) % 1
          const v = slerp(pv[a], pv[b], tt)
          const lift = 1 + 0.2 * Math.sin(Math.PI * tt)
          const p = project([v[0] * lift, v[1] * lift, v[2] * lift], R, cx, cy)
          if (p.z > 0) {
            g.fillStyle = '#fff'; g.shadowColor = '#9bb4ff'; g.shadowBlur = 10
            g.beginPath(); g.arc(p.x, p.y, 1.8, 0, Math.PI * 2); g.fill()
            g.shadowBlur = 0
          }
        }
      })

      // nodes
      PLACES.forEach((pl, i) => {
        const k = state.nodes[i]
        if (k <= 0.001) return
        const p = project(pv[i], R, cx, cy)
        if (p.z < 0.02) return
        const col = pl.hub ? '#E65BFF' : '#7da2ff'
        const halo = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20 * k)
        halo.addColorStop(0, pl.hub ? 'rgba(230,91,255,0.55)' : 'rgba(75,131,255,0.5)')
        halo.addColorStop(1, 'rgba(0,0,0,0)')
        g.fillStyle = halo
        g.beginPath(); g.arc(p.x, p.y, 20 * k, 0, Math.PI * 2); g.fill()
        g.fillStyle = col
        g.beginPath(); g.arc(p.x, p.y, (pl.hub ? 3.6 : 2.8) * k, 0, Math.PI * 2); g.fill()
        g.fillStyle = '#fff'
        g.beginPath(); g.arc(p.x, p.y, 1.2 * k, 0, Math.PI * 2); g.fill()
        if (!small || pl.hub) {
          g.font = '500 9px "JetBrains Mono", monospace'
          g.fillStyle = `rgba(245,245,245,${0.85 * k * Math.min(1, p.z * 3)})`
          g.fillText(pl.name, p.x + 9, p.y + 3)
        }
      })
    }

    /* ---------- GSAP: appearance, rotation, parallax ---------- */
    const gctx = gsap.context(() => {
      if (!reduced) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 60%', once: true } })
        PLACES.forEach((_, i) => {
          tl.to(state.nodes, { [i]: 1, duration: 0.8, ease: 'back.out(2.2)' }, 0.2 + i * 0.18)
        })
        LINKS.forEach((_, i) => {
          tl.to(state.lines, { [i]: 1, duration: 1.4, ease: 'power2.inOut' }, 0.9 + i * 0.22)
        })
        gsap.fromTo(box, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: box, start: 'top 88%', once: true } })
        gsap.to('[data-globe-glow]', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } })
        gsap.to(box, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } })
      }
    }, section)

    /* ---------- loop (gsap ticker) ---------- */
    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!state.active || document.hidden) return
      if (!state.dragging) state.rot += state.speed * dt
      render()
    }
    if (!reduced) gsap.ticker.add(tick)
    else render()

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => { state.active = self.isActive },
    })

    /* ---------- drag to rotate ---------- */
    let lastX = 0
    const down = (e: PointerEvent) => {
      state.dragging = true
      lastX = e.clientX
      cv.setPointerCapture(e.pointerId)
      cv.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (!state.dragging) return
      state.rot += (e.clientX - lastX) * 0.006
      lastX = e.clientX
      if (reduced) render()
    }
    const up = () => {
      state.dragging = false
      cv.style.cursor = 'grab'
    }
    cv.addEventListener('pointerdown', down)
    cv.addEventListener('pointermove', move)
    cv.addEventListener('pointerup', up)
    cv.addEventListener('pointercancel', up)

    return () => {
      gsap.ticker.remove(tick)
      st.kill()
      gctx.revert()
      ro.disconnect()
      cv.removeEventListener('pointerdown', down)
      cv.removeEventListener('pointermove', move)
      cv.removeEventListener('pointerup', up)
      cv.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <section id="global" ref={root} className="relative overflow-hidden bg-black px-6 py-28 sm:px-10 md:py-40 lg:px-16">
      <div data-globe-glow className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(75,131,255,0.18),rgba(132,85,255,0.08)_45%,transparent_70%)] blur-2xl lg:left-[68%]" />

      <div className="relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div data-fade className="label mb-8 flex items-center gap-3">
            <span className="text-[#4B83FF]">04</span> / GLOBAL RESEARCH
          </div>
          <h2 data-mask className="display text-[clamp(2.4rem,5.6vw,5.2rem)] text-white">
            <span className="mask"><span>Research has</span></span>
            <span className="mask"><span className="text-[#9999A3]">no borders.</span></span>
          </h2>
          <p data-fade className="mt-8 max-w-md text-[15px] leading-relaxed text-[#9999A3] sm:text-base">
            Our research doesn't stop at one market or one source. We connect local and international developments to understand the bigger picture.
          </p>
          <ul data-stagger className="mono mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-[11px] text-white/80">
            {['INDONESIA', 'UNITED STATES', 'EUROPE', 'JAPAN', 'HONG KONG', 'GLOBAL MARKETS'].map((n, i) => (
              <li key={n} className="flex items-center gap-2.5 border-b border-white/10 pb-2">
                <span className={`h-1.5 w-1.5 rounded-full ${i === 0 || i === 5 ? 'bg-[#E65BFF] shadow-[0_0_8px_2px_rgba(230,91,255,0.7)]' : 'bg-[#4B83FF] shadow-[0_0_8px_2px_rgba(75,131,255,0.7)]'}`} />
                {n}
              </li>
            ))}
          </ul>
          <p data-fade className="mono mt-6 text-[9px] tracking-[0.16em] text-white/30">CONCEPTUAL VISUALISATION — NOT LIVE DATA</p>
        </div>

        <div className="lg:col-span-7">
          <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[680px]">
            <canvas ref={canvas} className="h-full w-full touch-pan-y cursor-grab" aria-label="Conceptual rotating globe linking Indonesia, the United States, Europe, Japan and Hong Kong" role="img" />
          </div>
        </div>
      </div>
    </section>
  )
}
