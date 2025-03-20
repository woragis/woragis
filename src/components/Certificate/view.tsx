import { FaExternalLinkAlt } from 'react-icons/fa'
import { certificateModel } from './model'
import { Certificate, CertificateImg } from './styles'

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
        <h3>{certificate.name}</h3>
        <p>Tags: {tags}</p>
        <p>{certificate.completed ? 'Completed' : 'To do'}</p>
      </div>
    </Certificate>
  )
}
