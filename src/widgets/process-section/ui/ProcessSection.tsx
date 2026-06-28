import { ProcessStory } from '../../../entities/process'
import { processSteps } from '../../../shared/config'

export function ProcessSection() {
  return (
    <section className="process-section section" id="process" aria-labelledby="process-title">
      <ProcessStory steps={processSteps} />
    </section>
  )
}
