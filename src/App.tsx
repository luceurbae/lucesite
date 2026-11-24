import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReduced, ScrollTrigger } from './lib/gsap'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Ticker from './components/Ticker'
import AboutSection from './components/AboutSection'
import MarketsSection from './components/MarketsSection'
import ResearchSection from './components/ResearchSection'
import GlobalMap from './components/GlobalMap'
import CommunityGrid from './components/CommunityGrid'
import PhilosophySection from './components/PhilosophySection'
import PrivateStatus from './components/PrivateStatus'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

export default function App() {
  const frame = useRef<HTMLDivElement>(null)

  // 1 — the dark frame fades into view
  useLayoutEffect(() => {
    if (prefersReduced() || !frame.current) return
    const tw = gsap.fromTo(frame.current, { opacity: 0, y: 24 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      // a lingering transform would become the containing block for the pinned (position: fixed) philosophy section
      clearProps: 'transform',
      onComplete: () => ScrollTrigger.refresh(),
    })
    return () => {
      tw.kill()
    }
  }, [])

  // keep trigger positions honest once fonts and the lazy 3D chunk settle
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    const t = setTimeout(refresh, 1200)
    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="page">
      <CustomCursor />
      <div ref={frame} className="frame">
        <Navbar />
        <main>
          <HeroSection />
          <Ticker />
          <AboutSection />
          <MarketsSection />
          <ResearchSection />
          <GlobalMap />
          <CommunityGrid />
          <PhilosophySection />
          <PrivateStatus />
        </main>
        <Footer />
      </div>
    </div>
  )
}
