import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { NavItem } from '../../../shared/config'

type SiteHeaderProps = {
  navItems: NavItem[]
}

export function SiteHeader({ navItems }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const scrollFrameRef = useRef<number | null>(null)

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [isMenuOpen])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    if (typeof window.addEventListener !== 'function') return undefined

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (typeof window.addEventListener !== 'function') return undefined

    lastScrollYRef.current = Math.max(window.scrollY || window.pageYOffset || 0, 0)

    function updateHeaderVisibility() {
      const currentScrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0)
      const scrollDelta = currentScrollY - lastScrollYRef.current

      if (currentScrollY < 32) {
        setIsHeaderHidden(false)
      } else if (Math.abs(scrollDelta) > 6) {
        setIsHeaderHidden(scrollDelta > 0)
      }

      lastScrollYRef.current = currentScrollY
      scrollFrameRef.current = null
    }

    function onScroll() {
      if (scrollFrameRef.current !== null) return
      scrollFrameRef.current = window.requestAnimationFrame(updateHeaderVisibility)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
    }
  }, [])

  return (
    <>
      <header className={`site-header${isHeaderHidden && !isMenuOpen ? ' site-header--hidden' : ''}`}>
        <a className="brand" href="#top" aria-label="Главная ЛЕГАСИЛАБС">
          <span>ЛЕГАСИЛАБС</span>
        </a>

        <nav className="desktop-nav" aria-label="Основная навигация" aria-hidden={isMenuOpen}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="menu-button"
            type="button"
            aria-label="Открыть меню"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Мобильное меню">
          <div className="mobile-menu__top">
            <span>ЛЕГАСИЛАБС / меню</span>
            <button
              className="menu-button menu-button--invert"
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <nav className="mobile-menu__nav" aria-label="Мобильная навигация">
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mobile-menu__object" aria-hidden="true" />
        </div>
      ) : null}
    </>
  )
}
