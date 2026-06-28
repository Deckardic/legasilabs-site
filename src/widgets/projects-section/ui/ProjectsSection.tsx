import { ProjectCard } from '../../../entities/project'
import { projects } from '../../../shared/config'
import { SectionTitle } from '../../../shared/ui/section-title'

export function ProjectsSection() {
  return (
    <section className="projects-section section" id="projects" aria-labelledby="projects-title">
      <SectionTitle
        id="projects-title"
        title="Проекты"
        intro="Первый публичный продуктовый контур ЛЕГАСИЛАБС и направления, которые можно развивать дальше."
      />
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
