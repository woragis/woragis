import { ProjectProps } from '@/types/components.types'
import { projectModel } from './model'
import { ProjectView } from './view'

const Project = ({ project }: ProjectProps) => {
  const model = projectModel(project)

  return <ProjectView {...model} />
}

export default Project
