import { CertifationsInterface } from '.'

export const certificateModel = (certificate: CertifationsInterface) => {
  const mapTags = (tags: string[]) => {
    return tags.map((tag) => {
      return <span> {tag} </span>
    })
  }

  return { certificate, mapTags }
}
