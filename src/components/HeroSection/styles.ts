import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

export const Hero = styled.section`
  height: calc(100vh - 5rem);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: row-reverse;
`

export const Side = styled.aside`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 50%;

  @media (max-width: 768px) {
    min-width: 100%;
    height: 50%;
  }
`

interface TypewriterPProps {
  length: number
  delay: string
  duration: string
}

const typing = keyframes`
from {
    width: 0;
}
to {
    width: 100%;
}
`

const blink = keyframes`
50% {
    border-color: transparent;
}
`

const TypewriterP = styled.p<TypewriterPProps>`
  max-width: min-content;
  font-family: monospace;
  font-size: 1.5rem;
  margin-inline: auto;
  overflow: hidden;

  /* Keeps on a single line */
  white-space: nowrap;

  /* The cursor */
  border-right: 1px solid;

  animation: ${typing} ${(_) => _.duration} steps(${(_) => _.length}) forwards,
    ${blink} 1s step-end infinite;
`

const temporaryTyping = keyframes`
0% {
    width: 0%;
}
50% {
    width: 100%;
}
100% {
    width: 0%;
}
`

const TemporaryName = styled.p<TypewriterPProps>`
  width: 0%;
  max-width: min-content;
  font-family: monospace;
  font-size: 1.5rem;
  overflow: hidden;

  /* Keeps on a single line */
  white-space: nowrap;

  /* The cursor */
  border-right: 1px solid;

  animation: ${temporaryTyping} ${(_) => _.duration} steps(${(_) => _.length})
      forwards ${(_) => _.delay},
    ${blink} 1s step-end infinite;
`

export const MyPicture = styled.img`
  width: 430px;
  position: relative;
  border-radius: 50%;
`

export const Presentation = styled.div`
  display: grid;
  grid-template-rows: 1fr 12rem;
  font-family: 'Roboto Mono', monospace;
  text-align: left;
  width: inherit;
  font-size: 2.6rem;
`

export const Greet = styled.span`
  font-size: 3.8rem;
`

export const Name = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-family: 'Roboto Mono', monospace;
  font-weight: 800;
  font-size: 4rem;
  height: calc(3rem * 2);
  width: 34rem;
  text-align: left;
`
