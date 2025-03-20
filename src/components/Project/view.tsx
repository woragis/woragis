import { projectModel } from './model'
import { Project, ProjectLink, ProjectScreenshot, ProjectTitle } from './styles'

export const ProjectView = ({ project }: ReturnType<typeof projectModel>) => {
  return (
    <Project>
      <ProjectScreenshot
        src={project.imgSrc}
        alt={project.name}
      />
      <ProjectTitle>{project.name}</ProjectTitle>
      <ProjectLink href={project.href}>Link</ProjectLink>
    </Project>
  )
}
