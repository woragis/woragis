import { ProjectInterface } from '@/types/components.types'

export const projectsSectionModel = () => {
  const projects: ProjectInterface[] = [
    {
      name: 'E-commerce',
      href: 'https://woragis.github.io/e-commerce',
      imgSrc: '',
      tags: ['spring-boot', 'java', 'react'],
      lastUpdated: '',
    },
    {
      name: 'Reservatorio de Dopamina',
      href: 'https://woragis.github.io/rd-clone',
      imgSrc: '',
      tags: ['clone', 'nextjs', 'stripe'],
      lastUpdated: '',
    },
    {
      name: 'Landing Page',
      href: 'https://woragis.github.io/landing-page',
      imgSrc: '',
      tags: ['html', 'css', 'javascript'],
      lastUpdated: '',
    },
  ]

  return { projects }
}
