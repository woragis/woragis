import { NavLinksInterface } from '@/types/components.types'

export const navbarModel = () => {
  const links: NavLinksInterface[] = [
    { name: 'projects', path: '#projects' },
    { name: 'about', path: '#about' },
    { name: 'certifications', path: '#certifications' },
  ]

  return { links }
}
