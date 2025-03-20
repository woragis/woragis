import { heroSectionModel } from './model'
import { HeroSectionView } from './view'

const HeroSection = () => {
  const model = heroSectionModel()

  return <HeroSectionView {...model} />
}

export default HeroSection
