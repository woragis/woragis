import { certificateModel } from './model'

export const CertificateView = ({
  certificate,
  mapTags,
}: ReturnType<typeof certificateModel>) => {
  const tags = mapTags(certificate.tags)

  return (
    <li>
      <h3>{certificate.name}</h3>
      <img
        src={certificate.imgSrc}
        alt={certificate.key}
      />
      <p>Tags: {tags}</p>
      <p>{certificate.completed ? 'Completed' : 'To do'}</p>
    </li>
  )
}
