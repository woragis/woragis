import styled from '@emotion/styled'

export const AboutMe = styled.article`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  height: 600px;
  padding: 3rem 6rem;
  @media (max-width: 1024px) {
    & {
      grid-template-columns: 1fr;
      text-align: center;
      padding: 2rem;
    }
  }
`

export const Side = styled.aside`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`

export const AboutPargraph = styled.p`
  max-width: 600px;
  display: inline-block;
  margin-inline: auto;
  font-size: 1.2rem;
  line-height: 1.8rem;
`

export const Highlight = styled.span`
  font-size: 14px;
  color: var(--accent-secondary);
  cursor: pointer;

  &:hover {
    color: var(--accent-primary);
  }
`

export const PictureContainer = styled.figure`
  display: flex;
  justify-content: center;
  @media (max-width: 1024px) {
    & {
      margin-top: 2rem;
    }
  }
`
export const AboutPicture = styled.img`
  width: 75%;
  max-width: 350px;
  border-radius: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`
