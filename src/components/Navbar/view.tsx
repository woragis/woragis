import { navbarModel } from './model'
import { Link, Links, Logo, Nav } from './styles'

export const NavbarView = ({ links }: ReturnType<typeof navbarModel>) => {
  const linksComponent = links.map((link, index) => {
    return (
      <Link key={`nav-link-${index}`}>
        <a href={link.path}>{link.name}</a>
      </Link>
    )
  })

  return (
    <Nav>
      <Logo>Jezreel</Logo>
      <Links id='nav-links'>{linksComponent}</Links>
    </Nav>
  )
}
