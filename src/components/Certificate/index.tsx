import { certificateModel } from './model'
import { CertificateView } from './view'

export interface CertifationsInterface {
  key: string
  name: string
  imgSrc: string
  tags: string[]
  completed: boolean
}

const Certificate = ({
  certificate,
}: {
  certificate: CertifationsInterface
}) => {
  const model = certificateModel(certificate)

  return <CertificateView {...model} />
}

export default Certificate
