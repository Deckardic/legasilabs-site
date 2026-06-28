import { navItems } from '../../../shared/config'
import { ContactSection } from '../../../widgets/contact-section'
import { HeroSection } from '../../../widgets/hero-section'
import { ProcessSection } from '../../../widgets/process-section'
import { ProjectsSection } from '../../../widgets/projects-section'
import { ServicesSection } from '../../../widgets/services-section'
import { SiteHeader } from '../../../widgets/site-header'
import { TechnologiesSection } from '../../../widgets/technologies-section'

export function HomePage() {
  return (
    <div className="site-shell">
      <SiteHeader navItems={navItems} />

      <main id="top">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <ProjectsSection />
        <TechnologiesSection />
        <ContactSection />
      </main>
    </div>
  )
}
