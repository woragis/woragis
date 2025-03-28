import { ProjectInterface } from '@/types/components.types'
import pokedexScreenShot from '@/assets/projects/pokedex-screenshot.png'

export const projectsSectionModel = () => {
  const projects: ProjectInterface[] = [
    {
      name: 'E-commerce',
      href: 'https://woragis.github.io/e-commerce',
      imgSrc: '',
      tags: ['spring-boot', 'java', 'react'],
      lastUpdated: '',
      description: 'Project I built with NextJs, and used stripe',
    },
    {
      name: 'Reservatorio de Dopamina',
      href: 'https://woragis.github.io/rd-clone',
      imgSrc: '',
      tags: ['clone', 'nextjs', 'stripe'],
      lastUpdated: '',
      description: 'Project based on a platform of neuroscience studying',
    },
    {
      name: 'Landing Page',
      href: 'https://woragis.github.io/landing-page',
      imgSrc: '',
      tags: ['html', 'css', 'javascript'],
      lastUpdated: '',
      description: 'Useful to use as a marketing page',
    },
    {
      name: 'Pokedex',
      href: 'https://pokedex-woragis.vercel.app/',
      imgSrc: pokedexScreenShot,
      tags: ['nextjs', 'scss', 'firebase'],
      lastUpdated: '',
      description: 'Pokedex project',
    },
  ]

  return { projects }
}
