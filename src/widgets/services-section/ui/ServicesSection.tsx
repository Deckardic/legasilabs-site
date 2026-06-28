import { ServicesRoadmap } from '../../../entities/service'
import { services } from '../../../shared/config'
import { SectionTitle } from '../../../shared/ui/section-title'

export function ServicesSection() {
  return (
    <section className="services-section section" id="services" aria-labelledby="services-title">
      <div className="services-stage" data-testid="services-stage" data-scroll-travel="slow">
        <SectionTitle
          id="services-title"
          title="Услуги"
          intro="Шесть продуктовых модулей, из которых собирается рабочая цифровая система."
        />
        <ServicesRoadmap services={services} />
      </div>
    </section>
  )
}
