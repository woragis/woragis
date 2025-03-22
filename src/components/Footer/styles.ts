import styled from '@emotion/styled'
import { motion } from 'framer-motion'

export const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 12rem;
  padding-inline: 2rem;
  padding-block: 2rem;
  padding-bottom: 5rem;
  background-color: var(--bg-tertiary);
  color: var(--text-muted);
`

export const Socials = styled.ul`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: row;
  font-size: 1.6rem;
  gap: 30px;
`

export const Social = styled(motion.li)`
  list-style-type: none;
  font-size: 28px;
  transition: all 300ms ease-in-out;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  a {
    color: var(--text-muted);
    transition: 300ms;
    text-decoration: none;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }

  &:hover {
    a {
      color: var(--text-primary);
    }
  }
`

export const Copy = styled.span`
  display: block;
  position: absolute;
  bottom: 0;
  padding-block: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  background-color: var(--bg-primary);
`
