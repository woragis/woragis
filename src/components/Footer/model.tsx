import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { BiLogoGmail } from 'react-icons/bi'
import { SocialLinksInterface } from '@/types/components.types'

export const footerModel = () => {
  const socialLinks: SocialLinksInterface[] = [
    {
      name: 'Email me',
      path: 'mailto:jezreel.veloso@gmail.com',
      icon: <BiLogoGmail />,
    },
    { name: 'github', path: 'https://github.com/woragis', icon: <FaGithub /> },
    {
      name: 'linkedin',
      path: 'https://linkedin.com/in/jezreel-andrade',
      icon: <FaLinkedin />,
    },
    // {
    //   name: 'instagram',
    //   path: 'https://instagram.com/y.jezreel.andrade',
    //   icon: <FaInstagram />,
    // },
  ]

  return { socialLinks }
}
