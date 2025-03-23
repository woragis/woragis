import styled from '@emotion/styled'

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  padding-inline: 50px;
  background-color: var(--bg-secondary);
  position: relative;

  a,
  span {
    color: var(--text-secondary);
  }
`

export const Logo = styled.a`
  height: 100%;
  padding: 5px;
  svg {
    font-size: 23px;
    transition: all 300ms;
    height: 100%;
    fill: var(--text-secondary);
  }
  &:hover {
    svg {
      fill: var(--text-primary);
    }
  }
`

export const Links = styled.ul`
  display: grid;
  justify-items: center;
  align-content: center;
  grid-template-columns: repeat(4, 1fr);
  width: max-content;
  gap: 30px;

  @media (max-width: 1000px) {
    display: none;
  }
`

export const Link = styled.li`
  list-style-type: none;
  width: min-content;
  text-align: center;
  font-size: 19px;
  position: relative;

  a {
    text-transform: capitalize;
    text-decoration: none;
  }

  &::before {
    content: '';
    background-color: var(--text-primary);
    height: 2px;
    width: 0;
    transition: 300ms;
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
  }
  &:hover {
    a {
      color: var(--text-primary);
    }
    &::before {
      width: 100%;
    }
  }
`

export const Burger = styled.div`
  position: absolute;
  right: 24px;
  top: 20px;
  width: 30px;
  aspect-ratio: 1 / 1;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  padding: 0px;
  cursor: pointer;
  height: min-content;
  z-index: 1;

  span {
    display: inline-block;
    background-color: white;
    height: 4px;
    width: 100%;
    z-index: 10;
    border-radius: 15px;
    transition: 200ms;
  }

  &.active {
    span:nth-child(1) {
      transform: rotateZ(45deg) translate(8px, 8px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotateZ(-45deg) translate(7px, -6px);
    }
  }

  @media (min-width: 1001px) {
    display: none;
  }
`
