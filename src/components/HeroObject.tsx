import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Liquid-chrome market sculpture. A displaced, mirror-metal sphere lit only by a
 * procedural studio environment (blue / violet / magenta softboxes), orbited by
 * thin light rings and a drift of luminous particles.
 */
export default function HeroObject() {
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mount.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768
    const fine = window.matchMedia('(pointer: fine)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // CSS glow behind the canvas remains as fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 0, 7.2)

    /* ---------- procedural environment ---------- */
    const envScene = new THREE.Scene()
    envScene.background = new THREE.Color(0x14143a)
    const panel = (hex: number, w: number, h: number, pos: [number, number, number], k: number) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), side: THREE.DoubleSide }),
      )
      m.position.set(...pos)
      m.lookAt(0, 0, 0)
      envScene.add(m)
    }
    panel(0x4b83ff, 7, 9, [-7, 1.5, 2], 5)
    panel(0xe65bff, 6, 7, [7, -3, 3], 5)
    panel(0x8455ff, 9, 4, [0, 7, -2], 3.5)
    panel(0xffffff, 1.1, 8, [4, 3, 7], 9)
    panel(0xffffff, 0.8, 6, [-5, -3, 6], 6)
    panel(0x4b83ff, 5, 2, [0, -7, 2], 2.5)
    panel(0x7a62ff, 16, 11, [0, 0.5, 11], 1.1) // soft fill behind the camera so the face never reads flat black
    panel(0xe65bff, 6, 5, [-3, -4, 9], 1.6)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envRT = pmrem.fromScene(envScene, 0.075)
    scene.environment = envRT.texture
    envScene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      }
    })

    /* ---------- sculpture ---------- */
    let geo: THREE.BufferGeometry = new THREE.SphereGeometry(1.35, small ? 80 : 112, small ? 60 : 84)
    geo.deleteAttribute('normal')
    geo.deleteAttribute('uv')
    geo = mergeVertices(geo, 1e-4)
    const base = (geo.attributes.position.array as Float32Array).slice()
    const pos = geo.attributes.position as THREE.BufferAttribute

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2c,
      metalness: 1,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.6,
      iridescenceIOR: 1.6,
      envMapIntensity: 2,
    })
    const mesh = new THREE.Mesh(geo, mat)
    const group = new THREE.Group()
    group.add(mesh)
    scene.add(group)

    const displace = (t: number) => {
      const a = pos.array as Float32Array
      for (let i = 0; i < a.length; i += 3) {
        const x = base[i], y = base[i + 1], z = base[i + 2]
        const n =
          Math.sin(x * 1.9 + t * 0.55) * Math.sin(y * 2.1 - t * 0.42) * Math.sin(z * 1.7 + t * 0.35) * 0.62 +
          Math.sin(x * 3.6 - t * 0.7 + y * 1.3) * Math.sin(z * 3.1 + t * 0.5) * 0.24
        const s = 1 + n * 0.12
        a[i] = x * s
        a[i + 1] = y * s
        a[i + 2] = z * s
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
    }

    /* ---------- light rings ---------- */
    const ringMat = (hex: number, o: number) =>
      new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false })
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.006, 8, 220), ringMat(0x9bb7ff, 0.55))
    ring1.rotation.set(1.25, 0.2, 0.3)
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.004, 8, 220), ringMat(0xe65bff, 0.4))
    ring2.rotation.set(0.5, -0.5, 1.1)
    scene.add(ring1, ring2)

    /* ---------- particles ---------- */
    const N = small ? 90 : 220
    const pg = new THREE.BufferGeometry()
    const pp = new Float32Array(N * 3)
    const pc = new Float32Array(N * 3)
    const cols = [new THREE.Color(0x4b83ff), new THREE.Color(0x8455ff), new THREE.Color(0xe65bff), new THREE.Color(0xffffff)]
    for (let i = 0; i < N; i++) {
      const r = 2.2 + Math.random() * 2.6
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pp[i * 3] = r * Math.sin(ph) * Math.cos(th)
      pp[i * 3 + 1] = r * Math.cos(ph) * 0.7
      pp[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
      const c = cols[Math.floor(Math.random() * cols.length)]
      pc[i * 3] = c.r; pc[i * 3 + 1] = c.g; pc[i * 3 + 2] = c.b
    }
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    pg.setAttribute('color', new THREE.BufferAttribute(pc, 3))
    const pm = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })
    const points = new THREE.Points(pg, pm)
    scene.add(points)

    /* ---------- sizing ---------- */
    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.position.z = w / h < 0.9 ? 8.6 : 7.2
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw(0)
    })
    ro.observe(el)

    /* ---------- pointer ---------- */
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (fine && !reduced) window.addEventListener('pointermove', onMove, { passive: true })

    /* ---------- loop ---------- */
    const clock = new THREE.Clock()
    let raf = 0
    let visible = true
    let t = 0

    const draw = (dt: number) => {
      t += dt
      if (!small || Math.floor(t * 30) !== Math.floor((t - dt) * 30)) displace(t)
      cur.x += (target.x - cur.x) * 0.045
      cur.y += (target.y - cur.y) * 0.045
      group.rotation.y = t * 0.12 + cur.x * 0.45
      group.rotation.x = Math.sin(t * 0.2) * 0.08 + cur.y * 0.25
      group.position.y = Math.sin(t * 0.6) * 0.1
      ring1.rotation.z += dt * 0.08
      ring2.rotation.x += dt * 0.05
      ring1.position.y = group.position.y
      ring2.position.y = group.position.y
      points.rotation.y = t * 0.03 + cur.x * 0.1
      points.rotation.x = cur.y * 0.05
      renderer.render(scene, camera)
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      draw(Math.min(clock.getDelta(), 0.05))
    }

    if (reduced) {
      draw(2.2)
    } else {
      loop()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) clock.getDelta()
    })
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      geo.dispose(); mat.dispose(); pg.dispose(); pm.dispose()
      ring1.geometry.dispose(); ring2.geometry.dispose()
      ;(ring1.material as THREE.Material).dispose(); (ring2.material as THREE.Material).dispose()
      envRT.dispose(); pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mount} className="h-full w-full" aria-hidden="true" />
}
