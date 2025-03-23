import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const showCardAnimation = keyframes`
50% {
  transform: translateY(-18rem);
}

100% {
  transform: translateY(-8rem);
  opacity: 1;
}

`

const removeOverflowAnimation = keyframes`
to {
  overflow: initial;
}
`

const showOverflowAnimation = keyframes`
0% {
  overflow: initial;
  pointer-events: none;
}
50% {
  overflow: hidden;
}
`
const removeCardAnimation = keyframes`
0% {
  transform: translateY(-14rem);
}

50% {
  transform: translateY(-18rem);
}

100% {
  transform: translateY(0.5rem);
  opacity: 0;
}

`

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
  background-image: radial-gradient(white, var(--bg-primary) 43%);
  background-color: rgba(0, 0, 0, 0.9);
  color: var(--text-primary);
  gap: 15px;
  transition: 200ms;
  transition: padding 500ms;
  position: relative;
  cursor: pointer;

  &:not(:hover) {
    animation: ${showOverflowAnimation} 2s forwards;
    #hidden-data {
      animation: ${removeCardAnimation} 1s forwards;
    }
  }
  &:hover {
    padding: 0;
    animation: ${removeOverflowAnimation} 2s forwards;
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
      animation: ${showCardAnimation} 1s forwards;
      opacity: 1;
      transition: opacity 300ms;
    }
  }
`

export const DisplayedData = styled.article`
  position: absolute;
  bottom: 20px;
  height: 50px;
  transition: 200ms;
  text-align: left;
`

export const HiddenData = styled.article`
  transition: 400ms ease-in-out;
  position: absolute;
  bottom: -14rem;
  height: 14rem;
  opacity: 0;
  margin-inline: auto;
  left: 0;
  right: 0;
  z-index: 1;
  width: 400px;
  background-color: var(--accent-secondary);
  color: var(--text-tertiary);
  padding: 1.5rem 2rem;
  border-radius: 1rem;

  a {
    color: var(--text-tertiary);
    opacity: 0.6;
  }

  @media (max-width: 1000px) {
    text-align: center;
    padding-inline: 0;
  }
`

export const ProjectScreenshot = styled.img`
  width: 100%;
  height: 220px;
  position: sticky;
  top: 0;
  border-radius: 20px;
  transition: all 500ms;
  background-color: var(--text-muted);
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

export const ProjectDescription = styled.p`
  color: var(--text-muted);
`
