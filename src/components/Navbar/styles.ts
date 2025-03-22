import styled from '@emotion/styled'

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  padding-inline: 50px;
  background-color: var(--bg-secondary);

  a,
  span {
    color: var(--text-secondary);
  }
`

export const Logo = styled.span`
  text-transform: uppercase;
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
