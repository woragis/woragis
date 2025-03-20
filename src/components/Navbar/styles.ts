import styled from '@emotion/styled'

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  padding-inline: 50px;
`

export const Logo = styled.span`
  text-transform: uppercase;
`

export const Links = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`

export const Link = styled.li`
  list-style-type: none;
  width: 70px;

  a {
    text-transform: capitalize;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`
