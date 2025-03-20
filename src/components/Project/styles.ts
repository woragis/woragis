import styled from '@emotion/styled'

export const Project = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 20px 20px 30px;
  width: 100%;
  min-width: 400px;
  border: 1px solid red;
  border-radius: 20px;
  background-color: beige;
  gap: 15px;
`

export const ProjectScreenshot = styled.img`
  width: 100%;
  height: 220px;
  border-radius: 10px;
  background-color: black;
`

export const ProjectTitle = styled.h3`
  font-size: 2rem;
`

export const ProjectLink = styled.a`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
