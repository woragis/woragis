import { FaExternalLinkAlt } from 'react-icons/fa'
import { projectModel } from './model'
import {
  Project,
  HiddenData,
  ProjectLink,
  ProjectScreenshot,
  ProjectTitle,
  DisplayedData,
  ProjectDescription,
} from './styles'

export const ProjectView = ({ project }: ReturnType<typeof projectModel>) => {
  return (
    <Project>
      <ProjectScreenshot
        src={project.imgSrc}
        alt={project.name}
      />
      <DisplayedData id='normal-data'>
        <ProjectTitle>{project.name}</ProjectTitle>
        <ProjectDescription>{project.description}</ProjectDescription>
      </DisplayedData>
      <HiddenData id='hidden-data'>
        <ProjectTitle>{project.name}</ProjectTitle>
        <ProjectLink href={project.href}>
          Link <FaExternalLinkAlt />
        </ProjectLink>
      </HiddenData>
    </Project>
  )
}
