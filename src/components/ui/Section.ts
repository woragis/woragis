import styled from '@emotion/styled'

export const Section = styled.section`
  width: 100%;
  overflow-x: hidden;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding-block: 40px 80px;

  @media (max-width: 1024px) {
    & {
      grid-template-columns: 1fr;
      text-align: center;
      padding: 2rem;
    }
  }
  @media (max-width: 800px) {
    padding-inline: 0;
  }
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

  @media (max-width: 800px) {
    width: 100%;
  }
`
