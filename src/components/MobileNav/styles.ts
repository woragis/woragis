import styled from '@emotion/styled'
import { motion } from 'framer-motion'

export const Nav = styled(motion.nav)`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
`

export const Links = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 80px auto;
  gap: 50px;
`

export const Link = styled(motion.li)`
  list-style-type: none;
  text-transform: capitalize;
  font-size: 26px;
  font-weight: 600;
  a {
    color: var(--text-secondary);
    text-decoration: none;
    &:active {
      color: var(--text-primary);
    }
  }
`
