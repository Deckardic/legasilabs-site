export type NavItem = {
  label: string
  href: string
}

export type Service = {
  id: string
  title: string
  description: string
  codeLabel: string
}

export type ProcessStep = {
  id: string
  title: string
  description: string
}

export type Project = {
  id: string
  title: string
  type: string
  task: string
  result: string
  stack: string[]
}

export type Expertise = {
  title: string
  description: string
  codeLabel: string
}

export const navItems: NavItem[] = [
  { label: 'Услуги', href: '#services' },
  { label: 'Процесс', href: '#process' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Технологии', href: '#technologies' },
  { label: 'Контакты', href: '#contact' },
]

export const hero = {
  title: 'Превращаем сложность в цифровые системы',
  subtitle: 'Проектируем и разрабатываем IT-продукты, платформы и автоматизацию для бизнеса.',
  primaryCta: 'Обсудить проект',
}

export const aboutFacts = [
  {
    value: 'Cipher',
    label: 'шифр, ключ, алгоритм',
    text: 'ЛЕГАСИЛАБС собирает сложные вводные в ясную цифровую архитектуру.',
  },
  {
    value: '03',
    label: 'слоя продукта',
    text: 'Интерфейсы, данные и бизнес-логика проектируются вместе, чтобы система не распалась на случайные части.',
  },
  {
    value: '01',
    label: 'рабочая система',
    text: 'В каждом проекте ищем не еще один экран, а продуктовый модуль, который можно развивать.',
  },
]

export const services: Service[] = [
  {
    id: 'S_01',
    title: 'Web-разработка',
    description: 'Собираем быстрые интерфейсы, личные кабинеты, промо-сайты и рабочие web-системы.',
    codeLabel: 'interface + logic + data -> product',
  },
  {
    id: 'S_02',
    title: 'Backend и API',
    description: 'Проектируем устойчивые серверные контуры, интеграции и API для роста продукта.',
    codeLabel: 'request -> service -> response',
  },
  {
    id: 'S_03',
    title: 'Автоматизация',
    description: 'Превращаем ручные операции и хаотичные таблицы в понятные цифровые процессы.',
    codeLabel: 'manual.flow -> system.flow',
  },
  {
    id: 'S_04',
    title: 'Data и аналитика',
    description: 'Выводим данные в панели, отчеты и модели, которые помогают принимать решения.',
    codeLabel: 'signals -> metrics -> insight',
  },
  {
    id: 'S_05',
    title: 'UI/UX интерфейсы',
    description: 'Проектируем интерфейсы для сложных сценариев без визуального и логического шума.',
    codeLabel: 'scenario -> prototype -> screen',
  },
  {
    id: 'S_06',
    title: 'Продуктовая разработка',
    description: 'Ведем продукт от первой архитектуры до проверяемого релиза и дальнейшего масштаба.',
    codeLabel: 'idea -> release -> scale',
  },
]

export const processSteps: ProcessStep[] = [
  {
    id: '01',
    title: 'Разбор',
    description: 'Разбираем задачу, ограничения, пользователей, данные и реальные точки боли.',
  },
  {
    id: '02',
    title: 'Модель',
    description: 'Проектируем структуру продукта: интерфейсы, роли, сущности, API и сценарии.',
  },
  {
    id: '03',
    title: 'Разработка',
    description: 'Разрабатываем интерфейс, серверную часть, интеграции и продуктовую механику короткими итерациями.',
  },
  {
    id: '04',
    title: 'Проверка',
    description: 'Проверяем логику тестами, сценариями, данными и ручной продуктовой приемкой.',
  },
  {
    id: '05',
    title: 'Рост',
    description: 'Развиваем систему: новые модули, производительность, аналитика, автоматизация.',
  },
]

export const projects: Project[] = [
  {
    id: 'P_01',
    title: 'AgroPlanner',
    type: 'Цифровая платформа для агробизнеса',
    task: 'Собрать планирование, аналитику, учет и автоматизацию сельхозпроцессов в единую систему.',
    result: 'Frontend, backend, API, PostgreSQL, AI/analytics и рабочие сценарии управления хозяйством.',
    stack: ['React', 'TypeScript', 'Go', 'PostgreSQL', 'API', 'AI'],
  },
  {
    id: 'P_02',
    title: 'Process Core',
    type: 'Автоматизация бизнес-логики',
    task: 'Описать сложный операционный процесс как последовательность понятных цифровых модулей.',
    result: 'Схема ролей, статусов, данных и интерфейсов для первого запуска.',
    stack: ['Backend', 'Workflow', 'Analytics'],
  },
  {
    id: 'P_03',
    title: 'Interface Lab',
    type: 'UI/UX для внутренних систем',
    task: 'Снизить когнитивную нагрузку в рабочих интерфейсах с большим количеством данных.',
    result: 'Дизайн-система, прототипы и компоненты для повторяемых сценариев.',
    stack: ['Design Systems', 'React', 'UX'],
  },
]

export const technologies = [
  ['React', 'TypeScript', 'Vite', 'Design Systems', 'GSAP'],
  ['Go', 'API', 'PostgreSQL', 'Docker', 'Automation'],
  ['AI', 'Analytics', 'Backend', 'Interfaces', 'Product'],
]

export const expertise: Expertise[] = [
  {
    title: 'Engineering',
    description: 'Архитектура, frontend, backend, интеграции и надежная сборка продукта.',
    codeLabel: 'build.systems',
  },
  {
    title: 'Product',
    description: 'Формулируем первый шаг, сценарии, приоритеты и результат, который можно проверить.',
    codeLabel: 'define.value',
  },
  {
    title: 'UI/UX',
    description: 'Проектируем интерфейсы для сложной логики так, чтобы ими хотелось пользоваться.',
    codeLabel: 'shape.interface',
  },
  {
    title: 'Data',
    description: 'Помогаем данным стать отчетами, метриками, аналитикой и практическими решениями.',
    codeLabel: 'decode.signals',
  },
  {
    title: 'QA',
    description: 'Проверяем критические сценарии, форму, адаптив и устойчивость пользовательских потоков.',
    codeLabel: 'verify.logic',
  },
  {
    title: 'DevOps',
    description: 'Настраиваем сборку, окружения и инфраструктурную основу для роста продукта.',
    codeLabel: 'ship.reliably',
  },
]

export const contacts = {
  email: 'hello@legasilabs.example',
  telegram: '@legasilabs_placeholder',
  policyHref: '#privacy-placeholder',
  policyLabel: 'Политика обработки персональных данных',
}
