import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Service } from '../../../shared/config'
import { useReducedMotion } from '../../../shared/lib'
import { DecoderText } from '../../../shared/ui/decoder-text'

type ServicesRoadmapProps = {
  services: Service[]
}

type StepStyle = CSSProperties & {
  '--step-index': number
}

export function ServicesRoadmap({ services }: ServicesRoadmapProps) {
  const reducedMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const roadmapRef = useRef<HTMLDivElement>(null)
  const walkerRef = useRef<HTMLDivElement>(null)
  const previousProgressRef = useRef(0)
  const previousScrollYRef = useRef(0)
  const previousTimeRef = useRef(0)
  const smoothedScrollSpeedRef = useRef(0)
  const frameRef = useRef(0)
  const stopMovingTimeoutRef = useRef(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const roadmap = roadmapRef.current
    if (!roadmap) return

    if (reducedMotion || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.18 },
    )

    observer.observe(roadmap)
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    const roadmap = roadmapRef.current
    const walker = walkerRef.current
    const viewport = viewportRef.current
    if (!roadmap || !walker || !viewport || reducedMotion) return
    const getNow = () => window.performance?.now?.() ?? Date.now()
    const requestFrame =
      window.requestAnimationFrame?.bind(window) ?? ((callback: FrameRequestCallback) => window.setTimeout(() => callback(getNow()), 16))
    const cancelFrame = window.cancelAnimationFrame?.bind(window) ?? window.clearTimeout.bind(window)

    const updateWalker = () => {
      cancelFrame(frameRef.current)
      frameRef.current = requestFrame(() => {
        const section = roadmap.closest<HTMLElement>('.services-section')
        if (!section) return

        const start = section.offsetTop
        const end = section.offsetTop + Math.max(section.offsetHeight - window.innerHeight, 1)
        const progress = Math.min(Math.max((window.scrollY - start) / Math.max(end - start, 1), 0), 1)
        const maxX = Math.max(0, roadmap.scrollWidth - walker.offsetWidth)
        const maxScrollLeft = Math.max(0, roadmap.scrollWidth - viewport.clientWidth)
        const now = getNow()
        const deltaScroll = Math.abs(window.scrollY - previousScrollYRef.current)
        const deltaTime = Math.max(now - previousTimeRef.current, 16)
        const scrollSpeed = deltaScroll / deltaTime
        smoothedScrollSpeedRef.current = smoothedScrollSpeedRef.current * 0.78 + scrollSpeed * 0.22
        const trackProgress = progress === 1 ? 1 : Math.pow(progress, 1.15)
        const walkDuration = Math.round(Math.min(Math.max(720 / (1 + smoothedScrollSpeedRef.current * 1.25), 260), 760))
        const isMoving = Math.abs(progress - previousProgressRef.current) > 0.001

        roadmap.style.setProperty('--walker-x', `${Math.round(maxX * progress)}px`)
        walker.style.setProperty('--walk-duration', `${walkDuration}ms`)
        viewport.scrollLeft = maxScrollLeft * trackProgress
        walker.classList.toggle('is-reverse', progress < previousProgressRef.current)
        walker.classList.toggle('is-moving', isMoving)
        window.clearTimeout(stopMovingTimeoutRef.current)
        if (isMoving) {
          stopMovingTimeoutRef.current = window.setTimeout(() => walker.classList.remove('is-moving'), 260)
        }
        previousProgressRef.current = progress
        previousScrollYRef.current = window.scrollY
        previousTimeRef.current = now
      })
    }

    updateWalker()
    if (typeof window.addEventListener !== 'function') {
      let isPolling = true
      let pollingTimeoutId = 0
      const pollWalker = () => {
        if (!isPolling) return
        updateWalker()
        pollingTimeoutId = window.setTimeout(pollWalker, 120)
      }

      pollingTimeoutId = window.setTimeout(pollWalker, 120)
      return () => {
        isPolling = false
        window.clearTimeout(pollingTimeoutId)
        cancelFrame(frameRef.current)
        window.clearTimeout(stopMovingTimeoutRef.current)
      }
    }

    window.addEventListener('scroll', updateWalker, { passive: true })
    window.addEventListener('resize', updateWalker)

    return () => {
      cancelFrame(frameRef.current)
      window.clearTimeout(stopMovingTimeoutRef.current)
      window.removeEventListener('scroll', updateWalker)
      window.removeEventListener('resize', updateWalker)
    }
  }, [reducedMotion])

  const shouldShowRoadmap = isVisible || reducedMotion || typeof IntersectionObserver === 'undefined'

  return (
    <div
      ref={viewportRef}
      className="services-roadmap-viewport"
      data-testid="services-roadmap-viewport"
      data-motion="services-viewport"
      data-layout="centered-sticky"
      data-motion-mode={reducedMotion ? 'static' : 'scroll'}
    >
      <div
        ref={roadmapRef}
        className={`services-roadmap${shouldShowRoadmap ? ' is-roadmap-visible' : ''}`}
        data-testid="services-roadmap"
        data-motion="services-roadmap"
        data-track-scroll="slower-than-walker"
        aria-label="Roadmap услуг ЛЕГАСИЛАБС"
      >
        <div
          className="services-roadmap__line"
          data-testid="services-roadmap-line"
          data-motion="services-line"
          data-path-style="pixel"
          aria-hidden="true"
        />
        <div
          ref={walkerRef}
          className="services-walker"
          data-testid="services-walker"
          data-motion="services-walker"
          data-walker-style="pixel"
          aria-hidden="true"
        >
          <span className="services-walker__sprite" />
        </div>
        {services.map((service, index) => (
          <article
            className="service-step"
            key={service.id}
            data-testid="service-roadmap-step"
            data-motion="service-step"
            data-card-size="wide"
            data-frame-style="pixel-corners"
            style={{ '--step-index': index } as StepStyle}
          >
            <h3 aria-label={service.title}>
              <DecoderText text={service.title} decodeOnView testId="block-decoder-word" motion="block-title-word" />
            </h3>
            <p>{service.description}</p>
            <code>{service.codeLabel}</code>
          </article>
        ))}
      </div>
    </div>
  )
}
