import styled from '@emotion/styled'

export const Project = styled.li`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 20px 20px 80px;
  width: 100%;
  height: 300px;
  min-width: 400px;
  border-radius: 20px;
  background-color: beige;
  gap: 15px;
  transition: 200ms;
  transition: padding 500ms;
  position: relative;
  cursor: pointer;

  &:hover {
    padding: 0;
    img {
      top: -20px;
      height: 100%;
    }
    #normal-data {
      bottom: -100%;
      h3,
      a {
        display: none;
      }
    }
    #hidden-data {
      bottom: 0;
    }
  }
`

export const DisplayedData = styled.div`
  position: absolute;
  bottom: 20px;
  height: 50px;
  transition: 200ms;
`

export const HiddenData = styled.div`
  transition: 400ms ease-in-out;
  position: absolute;
  bottom: -100%;
  left: 0;
  padding-left: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
`

export const ProjectScreenshot = styled.img`
  width: 100%;
  height: 220px;
  position: sticky;
  top: 0;
  border-radius: 10px;
  background-color: white;
  transition: all 500ms;
`

export const ProjectTitle = styled.h3`
  font-size: 2rem;
  transition: 200ms;
`

export const ProjectLink = styled.a`
  text-decoration: none;
  transition: 200ms;

  &:hover {
    text-decoration: underline;
  }
`
