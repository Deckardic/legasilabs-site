import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../shared/lib'

export function useSiteMotion() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (typeof window.addEventListener !== 'function') {
      document.documentElement.classList.add('no-motion-events')
      return () => document.documentElement.classList.remove('no-motion-events')
    }

    if (reducedMotion || import.meta.env.MODE === 'test') return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      gsap.from('[data-motion="hero-word"]', {
        yPercent: 80,
        opacity: 0,
        duration: 0.7,
        ease: 'power4.out',
        stagger: 0.08,
      })

      gsap.utils.toArray<HTMLElement>('[data-motion="section-title-word"], [data-motion="block-title-word"]').forEach((element) => {
        gsap.from(element, {
          yPercent: 80,
          opacity: 0,
          duration: 0.36,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element.closest('.section-title') ?? element,
            start: 'top 82%',
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-motion="services-line"]').forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line.closest('.services-roadmap') ?? line,
              start: 'top 78%',
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-motion="service-step"]').forEach((element, index) => {
        gsap.from(element, {
          x: 42,
          y: index % 2 ? 24 : -24,
          opacity: 0,
          duration: 0.58,
          delay: index * 0.04,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element.closest('.services-roadmap') ?? element,
            start: 'top 78%',
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-motion="title"], [data-motion="project-card"], [data-motion="expertise"]').forEach(
        (element) => {
          gsap.from(element, {
            y: 46,
            opacity: 0,
            duration: 0.7,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
            },
          })
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-motion="process-node"]').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0.38, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 70%',
              end: 'bottom 45%',
              toggleClass: { targets: element, className: 'is-active' },
            },
          },
        )
      })
    })

    return () => {
      context.revert()
    }
  }, [reducedMotion])
}
