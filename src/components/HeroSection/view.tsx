import { useEffect, useRef } from 'react'
import { Hero, Names, Side, TemporaryName, TypewriterP } from './styles'
import { heroSectionModel } from './model'

export const HeroSectionView = ({
  textTypingEffect,
  textDeletionEffect,
  texts,
}: ReturnType<typeof heroSectionModel>) => {
  const namesDiv = useRef<HTMLParagraphElement>(null)

  const namesEffect = async () => {
    if (namesDiv.current) {
      textTypingEffect(namesDiv.current, texts[0]).then(() => {
        // if (namesDiv.current) textDeletionEffect(namesDiv.current)
      })
    }
  }
  useEffect(() => {
    // Type my name

    // Type 'or'
    // Type woragis
    // Delete everything
    // restart animation
    namesEffect()
  }, [])

  return (
    <Hero>
      <Side>
        <span>div</span>
        <p>picture of me</p>
        <p ref={namesDiv}></p>
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
