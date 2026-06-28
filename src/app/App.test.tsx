import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('ЛЕГАСИЛАБС site', () => {
  it('renders the required one-page sections and approved offer', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /превращаем сложность в цифровые системы/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /основная навигация/i })).toBeInTheDocument()

    for (const section of ['Услуги', 'Процесс', 'Проекты', 'Технологии', 'Контакты']) {
      expect(screen.getByRole('heading', { name: section })).toBeInTheDocument()
    }
    expect(screen.queryByRole('heading', { name: 'О нас' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Экспертиза' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'О нас' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Экспертиза' })).not.toBeInTheDocument()

    expect(screen.getByText(/AgroPlanner/i)).toBeInTheDocument()
    expect(screen.getAllByText(/React/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/PostgreSQL/i).length).toBeGreaterThan(0)
  })

  it('keeps only the cipher key on the right side of the hero', async () => {
    render(<App />)

    expect(await screen.findByTestId('hero-digital-right')).toBeInTheDocument()
    expect(await screen.findByTestId('symbol-cipher-key')).toHaveAttribute('data-key-style', 'ascii-orbit')
    expect(screen.queryByTestId('hero-digital-left')).not.toBeInTheDocument()
    expect(screen.queryByTestId('symbol-module-orb')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /смотреть возможности/i })).not.toBeInTheDocument()
  })

  it('keeps hero headline static without decoder symbol animation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: /превращаем сложность в цифровые системы/i })).toBeInTheDocument()
    expect(screen.queryByTestId('hero-decoder-word')).not.toBeInTheDocument()
  })

  it('hides the header on scroll down and shows it on scroll up', async () => {
    let scrollY = 0
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => scrollY,
    })

    render(<App />)

    const header = screen.getByRole('banner')
    expect(header).not.toHaveClass('site-header--hidden')

    scrollY = 240
    fireEvent.scroll(window)

    await waitFor(() => expect(header).toHaveClass('site-header--hidden'))

    scrollY = 120
    fireEvent.scroll(window)

    await waitFor(() => expect(header).not.toHaveClass('site-header--hidden'))
  })

  it('adds decoder text to lower section titles for scroll reveal', () => {
    render(<App />)

    const sectionWords = screen.getAllByTestId('section-decoder-word')
    expect(sectionWords.length).toBeGreaterThanOrEqual(5)
    expect(sectionWords.every((word) => word.getAttribute('data-decode-on-view') === 'true')).toBe(true)
    expect(sectionWords.every((word) => word.getAttribute('data-decoder-repeat') === 'scroll')).toBe(true)
    expect(sectionWords.every((word) => word.getAttribute('data-decoder-exit') === 'scramble')).toBe(true)
    expect(sectionWords.every((word) => word.getAttribute('data-decoder-visibility') === 'observer-or-scroll')).toBe(true)
    expect(sectionWords.every((word) => word.getAttribute('data-decoder-duration') === '420')).toBe(true)
    expect(sectionWords.map((word) => word.getAttribute('data-decoder-source'))).toEqual(
      expect.arrayContaining(['Услуги', 'Процесс', 'Проекты', 'Технологии', 'Контакты']),
    )
    expect(sectionWords.map((word) => word.getAttribute('data-decoder-source'))).not.toEqual(expect.arrayContaining(['О', 'нас', 'Экспертиза']))
  })

  it('renders technology rows as seamless duplicated marquees', () => {
    render(<App />)

    const rows = document.querySelectorAll('.tech-row')
    expect(rows).toHaveLength(3)
    expect([...rows].map((row) => row.querySelectorAll('.tech-row__track').length)).toEqual([4, 4, 4])
  })

  it('adds decoder text to lower cards while process nodes stay static', () => {
    render(<App />)

    const blockWords = screen.getAllByTestId('block-decoder-word')
    expect(blockWords.length).toBeGreaterThanOrEqual(6)
    expect(blockWords.every((word) => word.getAttribute('data-decode-on-view') === 'true')).toBe(true)
    expect(blockWords.every((word) => word.getAttribute('data-decoder-repeat') === 'scroll')).toBe(true)
    expect(blockWords.every((word) => word.getAttribute('data-decoder-exit') === 'scramble')).toBe(true)
    expect(blockWords.every((word) => word.getAttribute('data-decoder-visibility') === 'observer-or-scroll')).toBe(true)
    expect(blockWords.every((word) => word.getAttribute('data-decoder-duration') === '420')).toBe(true)
    expect(blockWords.map((word) => word.getAttribute('data-decoder-source'))).toEqual(
      expect.arrayContaining(['Web-разработка', 'AgroPlanner']),
    )
    expect(blockWords.map((word) => word.getAttribute('data-decoder-source'))).not.toContain('Decode')
    expect(blockWords.map((word) => word.getAttribute('data-decoder-source'))).not.toContain('Engineering')
  })

  it('renders services as an animated horizontal roadmap instead of square cards', () => {
    render(<App />)

    const stage = screen.getByTestId('services-stage')
    expect(stage).toHaveAttribute('data-scroll-travel', 'slow')

    const viewport = screen.getByTestId('services-roadmap-viewport')
    expect(viewport).toHaveAttribute('data-motion', 'services-viewport')
    expect(viewport).toHaveAttribute('data-layout', 'centered-sticky')
    expect(viewport).toHaveAttribute('data-motion-mode', 'scroll')

    const roadmap = screen.getByTestId('services-roadmap')
    expect(roadmap).toHaveAttribute('data-motion', 'services-roadmap')
    const line = screen.getByTestId('services-roadmap-line')
    expect(line).toHaveAttribute('data-motion', 'services-line')
    expect(line).toHaveAttribute('data-path-style', 'pixel')
    const walker = screen.getByTestId('services-walker')
    expect(walker).toHaveAttribute('data-motion', 'services-walker')
    expect(walker).toHaveAttribute('data-walker-style', 'pixel')
    expect(walker.querySelector('.services-walker__sprite')).toBeInTheDocument()
    expect(walker.querySelector('.services-walker__head')).not.toBeInTheDocument()
    expect(roadmap).toHaveAttribute('data-track-scroll', 'slower-than-walker')

    const steps = screen.getAllByTestId('service-roadmap-step')
    expect(steps).toHaveLength(6)
    expect(steps.every((step) => step.getAttribute('data-motion') === 'service-step')).toBe(true)
    expect(steps.every((step) => step.getAttribute('data-card-size') === 'wide')).toBe(true)
    expect(steps.every((step) => step.getAttribute('data-frame-style') === 'pixel-corners')).toBe(true)
    expect(roadmap.querySelector('.service-step__marker')).not.toBeInTheDocument()
    expect(roadmap.querySelector('.service-card')).not.toBeInTheDocument()
    expect(roadmap).not.toHaveTextContent(/S_0[1-6]/)
  })

  it('renders process as a sticky content-core story instead of static cards', () => {
    render(<App />)

    const story = screen.getByTestId('process-story')
    expect(story).toHaveAttribute('data-motion', 'process-story')
    expect(story).toHaveAttribute('data-layout', 'content-core')
    expect(story).toHaveAttribute('data-layout-style', 'rabbit-inspired')
    expect(story).toHaveTextContent(/процесс в ядре системы/i)

    const rail = screen.getByTestId('process-rail')
    expect(rail).toHaveAttribute('data-motion', 'process-rail')
    expect(rail).toHaveAttribute('data-dot-count', '5')
    expect(rail).toHaveAttribute('data-line-animation', 'scroll-draw')
    expect(rail).toHaveAttribute('data-step-order', 'top-down')
    expect(rail).toHaveAttribute('data-points-initial-state', 'solid')
    expect(screen.getByTestId('process-route')).toHaveAttribute('data-motion', 'process-camera-track')
    expect(screen.getByTestId('process-traveler')).toBeInTheDocument()

    const beats = screen.getAllByTestId('process-beat')
    expect(beats).toHaveLength(5)
    expect(beats.every((beat) => beat.getAttribute('data-motion') === 'process-beat')).toBe(true)
    expect(beats.every((beat) => beat.getAttribute('data-beat-style') === 'large-stat')).toBe(true)
    expect(beats.every((beat) => beat.getAttribute('data-content-reveal') === 'static')).toBe(true)
    expect(beats.map((beat) => beat.getAttribute('data-process-step'))).toEqual(['01', '02', '03', '04', '05'])
    expect(beats.map((beat) => beat.querySelector('h3')?.textContent)).toEqual(['Разбор', 'Модель', 'Разработка', 'Проверка', 'Рост'])
    expect(story).not.toHaveTextContent(/0x04 \/ маршрут/i)
    expect(story).not.toHaveTextContent(/\b(Decode|Model|Build|Verify|Scale|route|backend)\b/i)
    expect(story.querySelector('.process-active-step')).not.toBeInTheDocument()
    expect(story.querySelector('.process-node')).not.toBeInTheDocument()
  })

  it('does not render section eyebrow labels', () => {
    const { container } = render(<App />)

    expect(container).not.toHaveTextContent(/0x0[1-9]\s*\//i)
    expect(container).not.toHaveTextContent(/Ciphering systems|modules|showcase|stack|launch/i)
  })

  it('opens and closes the expressive mobile menu', async () => {
    const user = userEvent.setup()
    render(<App />)

    const openButton = screen.getByRole('button', { name: /открыть меню/i })
    await user.click(openButton)

    expect(screen.getByRole('dialog', { name: /мобильное меню/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /контакты/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /закрыть меню/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /мобильное меню/i })).not.toBeInTheDocument()
    })
  })

  it('validates and submits the demo contact form', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /отправить заявку/i }))

    expect(await screen.findByText(/укажите имя/i)).toBeInTheDocument()
    expect(screen.getByText(/укажите email или telegram/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/имя/i), 'Дмитрий')
    await user.type(screen.getByLabelText(/компания/i), 'ЛЕГАСИЛАБС')
    await user.type(screen.getByLabelText(/email или telegram/i), '@legasilabs')
    await user.type(screen.getByLabelText(/описание задачи/i), 'Нужна платформа для автоматизации процессов')
    await user.click(screen.getByRole('button', { name: /отправить заявку/i }))

    expect(await screen.findByText(/заявка подготовлена/i)).toBeInTheDocument()
  })

  it('shows failed demo submit state without transmitting data', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/имя/i), 'Ошибка')
    await user.type(screen.getByLabelText(/компания/i), 'Тест')
    await user.type(screen.getByLabelText(/email или telegram/i), 'fail@example.com')
    await user.type(screen.getByLabelText(/описание задачи/i), 'Проверяем сценарий ошибки формы')
    await user.click(screen.getByRole('button', { name: /отправить заявку/i }))

    expect(await screen.findByText(/демо-отправка не выполнена/i)).toBeInTheDocument()
  })
})
