import { projectsSectionModel } from './model'
import { ProjectsSectionView } from './view'

const ProjectsSection = () => {
  const model = projectsSectionModel()

  return <ProjectsSectionView {...model} />
}

export default ProjectsSection
