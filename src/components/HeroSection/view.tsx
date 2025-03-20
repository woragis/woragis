import { useEffect, useRef } from 'react'
import { Greet, Hero, MyPicture, Name, Presentation, Side } from './styles'
import { heroSectionModel } from './model'

export const HeroSectionView = ({
  cycleTexts,
  texts,
}: ReturnType<typeof heroSectionModel>) => {
  const namesDiv = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (namesDiv.current) cycleTexts(namesDiv.current, texts)
  }, [])

  return (
    <Hero>
      <Side>
        <MyPicture src='https://avatars.githubusercontent.com/u/79119700?v=4' />
      </Side>
      <Side>
        <Presentation>
          <p>
            <Greet>Hello!</Greet> My name is:
          </p>
          <Name ref={namesDiv}></Name>
        </Presentation>
      </Side>
    </Hero>
  )
}
