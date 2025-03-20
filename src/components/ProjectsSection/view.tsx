import Project from '../Project'
import { projectsSectionModel } from './model'
import { Projects } from './styles'

export const ProjectsSectionView = ({
  projects,
}: ReturnType<typeof projectsSectionModel>) => {
  const projectsComponent = projects.map(() => {
    return <Project />
  })

  return (
    <div>
      <h1>Projects</h1>
      <hr />
      <Projects>{projectsComponent}</Projects>
    </div>
  )
}
