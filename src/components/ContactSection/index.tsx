import { contactSectionModel } from './model'
import { ContactSectionView } from './view'

const ContactSection = () => {
  const model = contactSectionModel()

  return <ContactSectionView {...model} />
}

export default ContactSection
