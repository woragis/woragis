import styled from '@emotion/styled'

export const Hero = styled.section`
  height: calc(100vh - 5rem);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row-reverse;
  background-color: var(--bg-primary);
  color: var(--text-primary);

  @media (max-width: 800px) {
    & {
      padding-top: 260px;
      flex-direction: column;
      height: max-content;
    }
  }
`

export const Side = styled.aside`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 50%;
  font-family: 'JetBrains Mono', monospace;

  /* @media (max-width: 768px) {
    min-width: 100%;
    height: 50%;
  } */
  @media (max-width: 800px) {
    & {
      width: 100%;
      padding: 2rem 5rem;
    }
  }
`

export const MyPicture = styled.img`
  width: 430px;
  position: relative;
  border-radius: 50%;

  @media (max-width: 1200px) {
    & {
      width: 50%;
    }
  }

  @media (max-width: 800px) {
    & {
      border-radius: 20px;
      position: absolute;
      right: 50px;
      top: 120px;
      width: 240px;
    }
  }
`

export const Presentation = styled.div`
  display: grid;
  grid-template-rows: 1fr 12rem;
  font-family: 'Roboto Mono', monospace;
  text-align: left;
  width: inherit;
  font-size: 2.8rem;
  @media (max-width: 800px) {
    font-size: 1.8rem;
  }
`

export const Greet = styled.span`
  font-size: 3.8rem;
  @media (max-width: 800px) {
    font-size: 2.8rem;
  }
`

export const Name = styled.span`
  font-family: 'JetBrains Mono', monospace;
  /* font-family: 'Roboto Mono', monospace; */
  font-weight: 800;
  font-size: 4rem;
  height: calc(3rem * 2);
  width: 34rem;
  text-align: left;

  @media (max-width: 800px) {
    & {
      width: 100%;
      font-size: 1.9rem;
    }
  }
`
