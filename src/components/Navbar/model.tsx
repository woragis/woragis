import { NavLinksInterface } from '@/types/components.types'

export const navbarModel = () => {
  const links: NavLinksInterface[] = [
    { name: 'about', path: '#about' },
    { name: 'projects', path: '#projects' },
    { name: 'certifications', path: '#certifications' },
  ]

  return { links }
}
