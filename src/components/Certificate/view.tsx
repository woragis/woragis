import { FaExternalLinkAlt } from 'react-icons/fa'
import { certificateModel } from './model'
import {
  Certificate,
  CertificateImg,
  Completed,
  Subtitle,
  Title,
} from './styles'

export const CertificateView = ({
  certificate,
  mapTags,
  reverse,
  index,
  top,
}: ReturnType<typeof certificateModel>) => {
  const tags = mapTags(certificate.tags)
  console.log('certificate: ', certificate.name, 'top: ', top)

  return (
    <Certificate
      className='certificate'
      index={index}
      reverse={reverse}
      top={top}
    >
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
        <Completed completed={certificate.completed} />
      </div>
    </Certificate>
  )
}
