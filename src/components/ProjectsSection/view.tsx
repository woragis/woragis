import { projectsSectionModel } from './model'
import { Projects } from './styles'

import Project from '../Project'

export const ProjectsSectionView = ({
  projects,
}: ReturnType<typeof projectsSectionModel>) => {
  const projectsComponent = projects.map((project) => {
    return <Project project={project} />
  })

  return (
    <section id='projects'>
      <h1>Projects</h1>
      <hr />
      <Projects>{projectsComponent}</Projects>
    </section>
  )
}
