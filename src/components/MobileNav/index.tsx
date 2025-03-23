import { AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Link, Links, Nav } from './styles'
import { NavLinksInterface } from '@/types/components.types'

interface MobileNavProps {
  isOpen: boolean
  handleClose: () => void
  links: NavLinksInterface[]
}
const MobileNav = (props: MobileNavProps) => {
  const linksComponent = props.links.map((link, index) => {
    return (
      <Link
        initial={{ opacity: 0, y: -50 + index * -10 }}
        exit={{ opacity: 0, y: -50 + index * -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <a href={link.path}>{link.name}</a>
      </Link>
    )
  })
  return createPortal(
    <AnimatePresence>
      {props.isOpen && (
        <Nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={props.handleClose}
        >
          <Links>{linksComponent}</Links>
        </Nav>
      )}
    </AnimatePresence>,
    document.getElementById('nav')!
  )
}

export default MobileNav
