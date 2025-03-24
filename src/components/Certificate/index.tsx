import { CertificateProps } from '@/types/components.types'
import { certificateModel } from './model'
import { CertificateView } from './view'

const Certificate = ({ certificate, reverse, index }: CertificateProps) => {
  const model = certificateModel(certificate, reverse, index)

  return <CertificateView {...model} />
}

export default Certificate
