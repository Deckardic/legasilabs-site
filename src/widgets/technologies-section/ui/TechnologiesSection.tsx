import { technologies } from '../../../shared/config'
import { SectionTitle } from '../../../shared/ui/section-title'

export function TechnologiesSection() {
  return (
    <section className="tech-section section" id="technologies" aria-labelledby="technologies-title">
      <SectionTitle
        id="technologies-title"
        title="Технологии"
        intro="Не логотипная свалка, а рабочий стек для интерфейсов, данных, API и автоматизации."
      />
      <div className="tech-field" aria-label="Технологии ЛЕГАСИЛАБС">
        {technologies.map((row, index) => (
          <div className="tech-row" key={row.join('-')} data-motion="tech-row">
            {[0, 1, 2, 3].map((copyIndex) => (
              <div className="tech-row__track" key={copyIndex} aria-hidden={copyIndex > 0}>
                {row.map((item) => (
                  <span
                    key={`${item}-${copyIndex}`}
                    className={(index === 0 && item === 'React') || (index === 2 && item === 'Analytics') ? 'is-accent' : ''}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
