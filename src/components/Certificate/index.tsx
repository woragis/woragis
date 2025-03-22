import { CertificateProps } from '@/types/components.types'
import { certificateModel } from './model'
import { CertificateView } from './view'

const Certificate = ({
  certificate,
  reverse,
  index,
  quantity,
}: CertificateProps) => {
  const model = certificateModel(certificate, reverse, index, quantity)

  return <CertificateView {...model} />
}

export default Certificate
