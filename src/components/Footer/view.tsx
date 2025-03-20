import { footerModel } from './model'
import {
  BasicInformation,
  QuickLinks,
  Footer,
  FooterNav,
  Social,
  Socials,
  Copy,
  MyPicture,
  ButtonCTA,
} from './styles'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6'
import { BiLogoGmail } from 'react-icons/bi'

export const FooterView = ({}: ReturnType<typeof footerModel>) => {
  const socialLinks = [
    {
      name: 'jezreel.veloso',
      path: 'mailto:jezreel.veloso@gmail.com',
      icon: <BiLogoGmail />,
    },
    { name: 'github', path: 'https://github.com/woragis', icon: <FaGithub /> },
    {
      name: 'linkedin',
      path: 'https://linkedin.com/in/jezreel-andrade',
      icon: <FaLinkedin />,
    },
    {
      name: 'instagram',
      path: 'https://instagram.com/y.jezreel.andrade',
      icon: <FaInstagram />,
    },
  ]

  const socialComponent = socialLinks.map((social) => {
    return (
      <Social>
        <a
          href={social.path}
          target='_black'
        >
          {social.icon} {social.name}
        </a>
      </Social>
    )
  })

  return (
    <Footer>
      <BasicInformation>
        <MyPicture src='https://avatars.githubusercontent.com/u/79119700?v=4' />
        <h1>Jezreel de Andrade</h1>
        <p>The best programmer</p>
        <ButtonCTA>Talk to me</ButtonCTA>
      </BasicInformation>
      <QuickLinks></QuickLinks>
      <FooterNav></FooterNav>
      <Socials>{socialComponent}</Socials>
      <Copy>&copy; 2025 Jezreel de Andrade. All Rights Reserved.</Copy>
    </Footer>
  )
}
