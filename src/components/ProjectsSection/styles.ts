import styled from '@emotion/styled'

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
