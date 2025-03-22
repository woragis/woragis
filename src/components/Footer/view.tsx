import { AnimatePresence, motion } from 'framer-motion'
import { footerModel } from './model'
import { Footer, Social, Socials, Copy } from './styles'
import { useState } from 'react'

export const FooterView = ({ socialLinks }: ReturnType<typeof footerModel>) => {
  const socialComponent = socialLinks.map((social) => {
    const [hover, setHover] = useState<boolean>(false)
    return (
      <Social
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <a
          href={social.path}
          target='_black'
        >
          {social.icon}
          <AnimatePresence>
            {hover && (
              <motion.span
                initial={{
                  opacity: 0,
                  position: 'absolute',
                  x: '-24%',
                  textTransform: 'capitalize',
                  fontSize: 18,
                  fontWeight: 700,
                }}
                animate={{ opacity: 1, y: 30, x: '-24%' }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {social.name}
              </motion.span>
            )}
          </AnimatePresence>
        </a>
      </Social>
    )
  })

  return (
    <Footer>
      <Socials>{socialComponent}</Socials>
      <Copy>&copy; 2025 Jezreel de Andrade. All Rights Reserved.</Copy>
    </Footer>
  )
}
