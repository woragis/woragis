import { aboutSectionModel } from './model'
import { AboutSectionView } from './view'

const AboutSection = () => {
  const model = aboutSectionModel()

  return <AboutSectionView {...model} />
}

export default AboutSection
