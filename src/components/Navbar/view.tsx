import { useRef, useState } from 'react'
import { navbarModel } from './model'
import { Burger, Link, Links, Logo, Nav } from './styles'
import MobileNav from '../MobileNav'

export const NavbarView = ({ links }: ReturnType<typeof navbarModel>) => {
  const linksComponent = links.map((link, index) => {
    return (
      <Link key={`nav-link-${index}`}>
        <a href={link.path}>{link.name}</a>
      </Link>
    )
  })

  const burgerRef = useRef<HTMLDivElement>(null)
  const [mobileNavOpened, setMobileNavOpened] = useState<boolean>(false)
  const handleBurgerClick = () => {
    if (burgerRef.current) {
      burgerRef.current.classList.toggle('active')
      setMobileNavOpened((p) => !p)
    }
  }
  const handleMobileNavClose = () => {
    handleBurgerClick()
  }
  return (
    <Nav>
      <Burger
        ref={burgerRef}
        onClick={handleBurgerClick}
      >
        <span></span>
        <span></span>
        <span></span>
      </Burger>
      <MobileNav
        isOpen={mobileNavOpened}
        handleClose={handleMobileNavClose}
        links={links}
      />
      <Logo>Jezreel</Logo>
      <Links id='nav-links'>{linksComponent}</Links>
    </Nav>
  )
}
