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

export const FooterView = ({ socialLinks }: ReturnType<typeof footerModel>) => {
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
