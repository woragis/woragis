import { navbarModel } from './model'
import { NavbarView } from './view'

const Navbar = () => {
  const model = navbarModel()

  return <NavbarView {...model} />
}

export default Navbar
