import { lazy, Suspense } from 'react'
import { ContactForm } from '../../../features/contact-form'
import { contacts } from '../../../shared/config'
import { DigitalFallback } from '../../../shared/ui/digital-object-scene/DigitalFallback'
import { SectionTitle } from '../../../shared/ui/section-title'

const DigitalObjectScene = lazy(() =>
  import('../../../shared/ui/digital-object-scene/DigitalObjectScene').then((module) => ({
    default: module.DigitalObjectScene,
  })),
)

export function ContactSection() {
  return (
    <section className="contact-section section" id="contact" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div>
          <SectionTitle
            id="contact-title"
            title="Контакты"
            intro="Обсудим ваш проект. Опишите задачу, а мы предложим архитектуру первого шага."
          />
          <div className="contact-links">
            <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
            <a href={`https://t.me/${contacts.telegram.replace('@', '')}`}>{contacts.telegram}</a>
            <a id="privacy-placeholder" href={contacts.policyHref}>
              {contacts.policyLabel}
            </a>
          </div>
          <Suspense fallback={<DigitalFallback variant="contact" />}>
            <DigitalObjectScene variant="contact" />
          </Suspense>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
