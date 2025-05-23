import { useRef, useState } from 'react'
import { navbarModel } from './model'
import { Burger, Link, Links, Logo, Nav } from './styles'
import MobileNav from '../MobileNav'
import { useMotionValueEvent, useScroll } from 'framer-motion'

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
      mobileNavOpened
        ? burgerRef.current.classList.remove('active')
        : burgerRef.current.classList.add('active')
      setMobileNavOpened((p) => !p)
    }
  }
  const handleMobileNavClose = () => {
    handleBurgerClick()
  }
  const [navHidden, setNavHidden] = useState<boolean>(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0
    if (previous < latest && latest > 150) {
      setNavHidden(true)
    } else {
      setNavHidden(false)
    }
  })
  return (
    <Nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={navHidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'linear' }}
    >
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
      <Logo href='#'>
        <svg
          viewBox='0 0 512 512'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g
            id='SVGRepo_bgCarrier'
            stroke-width='0'
          ></g>
          <g
            id='SVGRepo_tracerCarrier'
            stroke-linecap='round'
            stroke-linejoin='round'
          ></g>
          <g id='SVGRepo_iconCarrier'>
            {' '}
            <g id='Hacker_anonymous'>
              {' '}
              <path d='M475.3571,413.24a69.9,69.9,0,0,0-39.8845-57.4407l-39.9287-18.7987,21.5791-44.5621a89.4527,89.4527,0,0,0,.0025-77.9684L359.7988,96.0682C317.7933,9.3105,194.2088,9.31,152.2019,96.0666L94.87,214.4745a89.445,89.445,0,0,0,.0049,77.9692l21.581,44.5569L76.5256,355.8a69.898,69.898,0,0,0-39.8831,57.439l-3.612,43.3773a22.5157,22.5157,0,0,0,22.4381,24.3842H456.5337A22.5134,22.5134,0,0,0,478.97,456.6187ZM364,260.1205a107.9746,107.9746,0,0,1-98.1035,107.5V341.1249a9.8965,9.8965,0,0,0-19.793,0v26.4957A107.9746,107.9746,0,0,1,148,260.1205V203.44a28.8192,28.8192,0,0,1,28.8193-28.8193H335.1806A28.8193,28.8193,0,0,1,364,203.44Z'></path>{' '}
              <path d='M321.8213,275.9979a9.91,9.91,0,0,0-12.3135,6.6709,13.5776,13.5776,0,0,1-26.0156,0,9.9026,9.9026,0,1,0-18.9844,5.6426,33.3877,33.3877,0,0,0,63.9844,0A9.9125,9.9125,0,0,0,321.8213,275.9979Z'></path>{' '}
              <path d='M240.8213,275.9979a9.8908,9.8908,0,0,0-12.3135,6.6709,13.5776,13.5776,0,0,1-26.0156,0,9.9026,9.9026,0,1,0-18.9844,5.6426,33.3877,33.3877,0,0,0,63.9844,0A9.9125,9.9125,0,0,0,240.8213,275.9979Z'></path>{' '}
              <path d='M319,227.4384H283a9.8965,9.8965,0,1,0,0,19.7929h36a9.8965,9.8965,0,1,0,0-19.7929Z'></path>{' '}
              <path d='M193,247.2313h36a9.8965,9.8965,0,1,0,0-19.7929H193a9.8965,9.8965,0,1,0,0,19.7929Z'></path>{' '}
            </g>{' '}
          </g>
        </svg>
      </Logo>
      <Links id='nav-links'>{linksComponent}</Links>
    </Nav>
  )
}
