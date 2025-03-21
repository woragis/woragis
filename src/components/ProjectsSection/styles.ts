import styled from '@emotion/styled'

export const Section = styled.section`
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding-block: 40px 80px;
`

export const Title = styled.h2`
  text-align: center;
  font-size: 3rem;
  margin: 0 auto 60px;
  width: min-content;
  position: relative;
  width: 600px;
  padding-bottom: 30px;
  border-bottom: 2px solid var(--text-primary);
`

export const Projects = styled.ul`
  padding-inline: 50px;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1320px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 1200px;
    margin-inline: auto;
  }

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    max-width: 550px;
    margin-inline: auto;
  }
  @media (max-width: 480px) {
    padding: 0;
  }
`
