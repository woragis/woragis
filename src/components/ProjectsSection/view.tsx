import { projectsSectionModel } from './model'
import { Projects } from './styles'

import { Section, Title } from '../ui/Section'
import Project from '../Project'

export const ProjectsSectionView = ({
  projects,
}: ReturnType<typeof projectsSectionModel>) => {
  const projectsComponent = projects.map((project) => {
    return <Project project={project} />
  })

  return (
    <Section id='projects'>
      <Title>Projects</Title>
      <Projects>{projectsComponent}</Projects>
    </Section>
  )
}
