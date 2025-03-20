import { CertificationsInterface } from '@/types/components.types'

export const certificateModel = (certificate: CertificationsInterface) => {
  const mapTags = (tags: string[]) => {
    return tags.map((tag) => {
      return <span> {tag} </span>
    })
  }

  return { certificate, mapTags }
}
