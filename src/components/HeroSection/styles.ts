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
