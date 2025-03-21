import { FaExternalLinkAlt } from 'react-icons/fa'
import { certificateModel } from './model'
import { Certificate, CertificateImg, Subtitle, Title } from './styles'

export const CertificateView = ({
  certificate,
  mapTags,
}: ReturnType<typeof certificateModel>) => {
  const tags = mapTags(certificate.tags)

  return (
    <Certificate>
      <CertificateImg>
        <img
          src={certificate.imgSrc}
          alt={certificate.key}
        />
        <a href={certificate.key}>
          Open <FaExternalLinkAlt />
        </a>
      </CertificateImg>
      <div>
        <Title>{certificate.name}</Title>
        <Subtitle>Tags: {tags}</Subtitle>
        <Subtitle>{certificate.completed ? 'Completed' : 'To do'}</Subtitle>
      </div>
    </Certificate>
  )
}
