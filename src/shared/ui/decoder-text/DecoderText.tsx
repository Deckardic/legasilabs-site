import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

const DECODER_SYMBOLS = '01{}[]<>#λΣπ∆∑∞≈≠+-*/%$'
const DEFAULT_DECODER_DURATION = 420
const DEFAULT_DECODER_STAGGER = 45

type DecoderTextProps = {
  text: string
  index?: number
  className?: string
  decodeOnView?: boolean
  testId?: string
  motion?: string
  durationMs?: number
}

function scrambleText(text: string, progress: number) {
  return text
    .split('')
    .map((char, charIndex) => {
      if (char === ' ') return char
      const revealPoint = charIndex / Math.max(text.length - 1, 1)
      if (progress >= revealPoint) return char
      return DECODER_SYMBOLS[(charIndex * 7 + Math.floor(progress * 60)) % DECODER_SYMBOLS.length]
    })
    .join('')
}

function isElementInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const topInset = viewportHeight * 0.06
  const bottomInset = viewportHeight * 0.1

  return rect.bottom > topInset && rect.top < viewportHeight - bottomInset
}

export function DecoderText({
  text,
  index = 0,
  className,
  decodeOnView = false,
  testId = 'decoder-word',
  motion = 'hero-word',
  durationMs = DEFAULT_DECODER_DURATION,
}: DecoderTextProps) {
  const reducedMotion = useReducedMotion()
  const isStaticText = import.meta.env.MODE === 'test' || reducedMotion
  const initialText = useMemo(() => (isStaticText ? text : scrambleText(text, 0)), [isStaticText, text])
  const [displayText, setDisplayText] = useState(initialText)
  const elementRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef(isStaticText || !decodeOnView ? 1 : 0)
  const targetProgressRef = useRef<number | null>(null)
  const frameRef = useRef(0)
  const timeoutRef = useRef(0)

  useEffect(() => {
    if (isStaticText) return

    const element = elementRef.current
    if (!element) return

    const getNow = () => window.performance?.now?.() ?? Date.now()
    const requestFrame =
      window.requestAnimationFrame?.bind(window) ?? ((callback: FrameRequestCallback) => window.setTimeout(() => callback(getNow()), 16))
    const cancelFrame = window.cancelAnimationFrame?.bind(window) ?? window.clearTimeout.bind(window)
    targetProgressRef.current = null

    const animateTo = (shouldDecode: boolean) => {
      const toProgress = shouldDecode ? 1 : 0
      if (targetProgressRef.current === toProgress) return
      targetProgressRef.current = toProgress
      const startDelay = shouldDecode ? index * DEFAULT_DECODER_STAGGER : 0

      cancelFrame(frameRef.current)
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        const startedAt = getNow()
        const fromProgress = progressRef.current
        const distance = Math.abs(toProgress - fromProgress)
        const animationDuration = Math.max(140, durationMs * distance)

        if (distance === 0) {
          setDisplayText(toProgress === 1 ? text : scrambleText(text, 0))
          return
        }
        const tick = (now: number) => {
          const elapsedProgress = Math.min((now - startedAt) / animationDuration, 1)
          const progress = fromProgress + (toProgress - fromProgress) * elapsedProgress
          progressRef.current = progress
          setDisplayText(scrambleText(text, progress))

          if (elapsedProgress >= 1) {
            progressRef.current = toProgress
            setDisplayText(text)
            if (toProgress === 0) setDisplayText(scrambleText(text, 0))
            return
          }

          frameRef.current = requestFrame(tick)
        }

        frameRef.current = requestFrame(tick)
      }, startDelay)
    }

    if (!decodeOnView) {
      animateTo(true)
    } else if (typeof window.IntersectionObserver === 'function') {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          animateTo(entry.isIntersecting)
        },
        { rootMargin: '-6% 0px -10% 0px', threshold: 0.12 },
      )

      observer.observe(element)
      return () => {
        observer.disconnect()
        window.clearTimeout(timeoutRef.current)
        cancelFrame(frameRef.current)
      }
    } else {
      const updateVisibility = () => animateTo(isElementInViewport(element))

      updateVisibility()
      if (typeof window.addEventListener === 'function') {
        window.addEventListener('scroll', updateVisibility, { passive: true })
        window.addEventListener('resize', updateVisibility)
        return () => {
          window.removeEventListener('scroll', updateVisibility)
          window.removeEventListener('resize', updateVisibility)
          window.clearTimeout(timeoutRef.current)
          cancelFrame(frameRef.current)
        }
      }

      let isPolling = true
      let pollingTimeoutId = 0
      const pollVisibility = () => {
        if (!isPolling) return
        updateVisibility()
        pollingTimeoutId = window.setTimeout(pollVisibility, 120)
      }

      pollingTimeoutId = window.setTimeout(pollVisibility, 120)
      return () => {
        isPolling = false
        window.clearTimeout(pollingTimeoutId)
        window.clearTimeout(timeoutRef.current)
        cancelFrame(frameRef.current)
      }
    }

    return () => {
      window.clearTimeout(timeoutRef.current)
      cancelFrame(frameRef.current)
    }
  }, [decodeOnView, durationMs, index, isStaticText, text])

  return (
    <span
      ref={elementRef}
      aria-hidden="true"
      className={className}
      data-decoder-source={text}
      data-decoder-duration={durationMs}
      data-decode-on-view={decodeOnView ? 'true' : undefined}
      data-decoder-repeat={decodeOnView ? 'scroll' : undefined}
      data-decoder-exit={decodeOnView ? 'scramble' : undefined}
      data-decoder-visibility={decodeOnView ? 'observer-or-scroll' : undefined}
      data-motion={motion}
      data-testid={testId}
    >
      {isStaticText ? text : displayText}
    </span>
  )
}
