import { ArrowDown } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { hero } from '../../../shared/config'
import { Button } from '../../../shared/ui/button'
import { DigitalFallback } from '../../../shared/ui/digital-object-scene/DigitalFallback'

const DigitalObjectScene = lazy(() =>
  import('../../../shared/ui/digital-object-scene/DigitalObjectScene').then((module) => ({
    default: module.DigitalObjectScene,
  })),
)

export function HeroSection() {
  const titleWords = hero.title.split(' ')

  return (
    <section className="hero-section poster-section" aria-labelledby="hero-title">
      <div className="hero-grid" data-parallax-root>
        <div className="hero-copy">
          <h1 id="hero-title" aria-label={hero.title}>
            {titleWords.map((word) => (
              <span key={word} aria-hidden="true">
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <div className="hero-actions">
            <Button href="#contact" variant="accent">
              {hero.primaryCta}
            </Button>
          </div>
        </div>
        <Suspense fallback={<DigitalFallback variant="hero" />}>
          <DigitalObjectScene variant="hero" />
        </Suspense>
        <a className="scroll-cue" href="#services" aria-label="Перейти к разделу Услуги">
          <ArrowDown size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
