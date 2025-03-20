import { Hero, Names, Side, TemporaryName, TypewriterP } from './styles'

export const HeroSectionView = () => {
  return (
    <Hero>
      <Side>
        <span>div</span>
        <p>picture of me</p>
      </Side>
      <Side>
        <Names>
          <TypewriterP
            length={18}
            delay='0s'
            duration='3s'
          >
            Jezreel de Andrade
          </TypewriterP>
          <TemporaryName
            length={7}
            duration='2s'
            delay='3s'
          >
            woragis
          </TemporaryName>
        </Names>
        <p>Little paragraph telling my motivation and why i like coding</p>
      </Side>
    </Hero>
  )
}
