import { certificationSectionModel } from './model'
import { CertificationSectionView } from './view'

const CertificationSection = () => {
  const model = certificationSectionModel()

  return <CertificationSectionView {...model} />
}

export default CertificationSection
