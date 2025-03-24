import { CertificationsInterface, Tags } from '@/types/components.types'
import { Tag } from './styles'

export const certificateModel = (
  certificate: CertificationsInterface,
  reverse: boolean,
  index: number
) => {
  const mapTags = (tags: Tags[]) => {
    return tags.map((tag) => {
      return <Tag className={tag}> {tag} </Tag>
    })
  }

  return { certificate, mapTags, index, reverse }
}
