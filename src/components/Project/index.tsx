import { projectModel } from './model'
import { ProjectInterface, ProjectView } from './view'

const Project = ({ project }: { project: ProjectInterface }) => {
  const model = projectModel(project)

  return <ProjectView {...model} />
}

export default Project
