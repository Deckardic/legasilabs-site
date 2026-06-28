import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ProcessStep } from '../../../shared/config'
import { DecoderText } from '../../../shared/ui/decoder-text'

type ProcessStoryProps = {
  steps: ProcessStep[]
}

type BeatStyle = CSSProperties & {
  '--beat-index': number
  '--beat-y': string
}

type ProcessStyle = CSSProperties & {
  '--process-progress': number
  '--process-line-offset': number
  '--process-camera-y': string
  '--process-traveler-x': string
  '--process-traveler-y': string
}

type RoutePoint = {
  x: number
  y: number
}

const routePoints: RoutePoint[] = [
  { x: 57, y: 5 },
  { x: 36, y: 28 },
  { x: 64, y: 50 },
  { x: 32, y: 72 },
  { x: 57, y: 94 },
]

const getStepThreshold = (index: number, total: number) => Math.min(index / Math.max(total - 1, 1), 0.95)

const getRoutePosition = (progress: number) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1)
  const segmentProgress = clampedProgress * (routePoints.length - 1)
  const startIndex = Math.min(Math.floor(segmentProgress), routePoints.length - 2)
  const localProgress = segmentProgress - startIndex
  const start = routePoints[startIndex]
  const end = routePoints[startIndex + 1]

  return {
    x: start.x + (end.x - start.x) * localProgress,
    y: start.y + (end.y - start.y) * localProgress,
  }
}

export function ProcessStory({ steps }: ProcessStoryProps) {
  const storyRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [cameraOffset, setCameraOffset] = useState(0)
  const travelerPosition = getRoutePosition(progress)
  const activeIndex = Math.min(
    steps.length - 1,
    Math.max(
      0,
      steps.reduce((activeStep, _, index) => (progress >= getStepThreshold(index, steps.length) ? index : activeStep), 0),
    ),
  )

  useEffect(() => {
    const story = storyRef.current
    if (!story || import.meta.env.MODE === 'test') return

    const updateProgress = () => {
      const section = story.closest<HTMLElement>('.process-section')
      if (!section) return

      const intro = story.querySelector<HTMLElement>('.process-story__intro')
      const introTravel = (intro?.offsetHeight ?? 0) * 0.54
      const projectHandoff = Math.min(window.innerHeight * 0.48, 480)
      const progressStart = section.offsetTop + introTravel
      const travel = Math.max(section.offsetHeight - projectHandoff - introTravel, 1)
      setProgress(Math.min(Math.max((window.scrollY - progressStart) / travel, 0), 1))
    }

    updateProgress()
    const frameId = window.requestAnimationFrame(updateProgress)

    if (typeof window.addEventListener === 'function') {
      window.addEventListener('scroll', updateProgress, { passive: true })
      window.addEventListener('resize', updateProgress)
      return () => {
        window.cancelAnimationFrame(frameId)
        window.removeEventListener('scroll', updateProgress)
        window.removeEventListener('resize', updateProgress)
      }
    }

    let isPolling = true
    let timeoutId = 0
    const pollProgress = () => {
      if (!isPolling) return
      updateProgress()
      timeoutId = window.setTimeout(pollProgress, 80)
    }

    timeoutId = window.setTimeout(pollProgress, 80)
    return () => {
      isPolling = false
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [steps.length])

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return

    const updateCameraOffset = () => {
      const body = bodyRef.current
      const route = routeRef.current
      if (!body || !route) return

      setCameraOffset(body.clientHeight * 0.5 - route.offsetHeight * (travelerPosition.y / 100))
    }

    updateCameraOffset()
    window.addEventListener('resize', updateCameraOffset)
    return () => window.removeEventListener('resize', updateCameraOffset)
  }, [travelerPosition.y])

  return (
    <div
      ref={storyRef}
      className="process-story"
      data-testid="process-story"
      data-motion="process-story"
      data-layout="content-core"
      data-layout-style="rabbit-inspired"
      style={
        {
          '--process-progress': progress,
          '--process-line-offset': 1 - progress,
          '--process-camera-y': `${cameraOffset}px`,
          '--process-traveler-x': `${travelerPosition.x}%`,
          '--process-traveler-y': `${travelerPosition.y}%`,
        } as ProcessStyle
      }
    >
      <div className="process-story__intro" data-motion="process-intro">
        <h2 id="process-title" className="process-story__title" aria-label="Процесс">
          <span>
            <DecoderText text="Процесс" decodeOnView testId="section-decoder-word" motion="section-title-word" />
          </span>{' '}
          <span>в ядре системы</span>
        </h2>
        <p className="process-story__lead">Работаем как инженерная команда: сначала расшифровываем, потом моделируем и проверяем.</p>
      </div>

      <div ref={bodyRef} className="process-story__body" data-camera="follow-point" aria-label="Этапы процесса">
        <div ref={routeRef} className="process-route" data-testid="process-route" data-motion="process-camera-track">
          <div
            className="process-rail"
            data-testid="process-rail"
            data-motion="process-rail"
            data-dot-count={steps.length}
            data-line-animation="scroll-draw"
            data-step-order="top-down"
            data-points-initial-state="solid"
            aria-hidden="true"
          >
            <svg className="process-rail__curve" viewBox="0 0 260 1500" preserveAspectRatio="none" focusable="false" aria-hidden="true">
              <path
                className="process-rail__curve-base"
                pathLength="1"
                d="M148 80 C148 210 100 250 94 410 C90 560 180 560 166 730 C154 870 78 900 82 1050 C86 1210 148 1230 148 1410"
              />
              <path
                className="process-rail__curve-progress"
                pathLength="1"
                d="M148 80 C148 210 100 250 94 410 C90 560 180 560 166 730 C154 870 78 900 82 1050 C86 1210 148 1230 148 1410"
              />
            </svg>
            {steps.map((step, index) => (
              <span
                className={`process-rail__dot${progress >= getStepThreshold(index, steps.length) ? ' is-reached' : ''}`}
                key={step.id}
                style={{ left: `${routePoints[index].x}%`, top: `${routePoints[index].y}%` }}
              />
            ))}
            <span className="process-rail__traveler" data-testid="process-traveler" />
          </div>

          <div className="process-beats" aria-label="Навигация по этапам процесса">
            {steps.map((step, index) => (
              <article
                className={`process-beat process-beat--${index % 2 === 0 ? 'right' : 'left'}${progress >= getStepThreshold(index, steps.length) ? ' is-reached' : ''}${index === activeIndex ? ' is-active' : ''}`}
                key={step.id}
                data-testid="process-beat"
                data-motion="process-beat"
                data-process-step={step.id}
                data-beat-style="large-stat"
                data-content-reveal="static"
                style={{ '--beat-index': index, '--beat-y': `${routePoints[index].y}%` } as BeatStyle}
              >
                <span className="process-beat__index">{step.id}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
