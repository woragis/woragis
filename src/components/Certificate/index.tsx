import { CertificateProps } from '@/types/components.types'
import { certificateModel } from './model'
import { CertificateView } from './view'

const Certificate = ({ certificate }: CertificateProps) => {
  const model = certificateModel(certificate)

  return <CertificateView {...model} />
}

export default Certificate
