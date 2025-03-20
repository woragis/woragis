import { footerModel } from './model'
import { FooterView } from './view'

const Footer = () => {
  const model = footerModel()

  return <FooterView {...model} />
}

export default Footer
