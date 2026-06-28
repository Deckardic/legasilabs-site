import type { Project } from '../../../shared/config'
import { DecoderText } from '../../../shared/ui/decoder-text'

type ProjectCardProps = {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="project-card" data-motion="project-card">
      <div className="project-card__orbit" aria-hidden="true" />
      <div className="project-card__head">
        <span className="tech-label">{project.id}</span>
        <span className="project-card__index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 aria-label={project.title}>
        <DecoderText text={project.title} decodeOnView testId="block-decoder-word" motion="block-title-word" />
      </h3>
      <p className="project-card__type">{project.type}</p>
      <dl>
        <div>
          <dt>Задача</dt>
          <dd>{project.task}</dd>
        </div>
        <div>
          <dt>Результат</dt>
          <dd>{project.result}</dd>
        </div>
      </dl>
      <ul aria-label={`Технологии проекта ${project.title}`}>
        {project.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a className="project-card__link" href="#contact">
        Смотреть подробнее
      </a>
    </article>
  )
}
