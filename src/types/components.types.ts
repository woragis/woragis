import { JSX } from '@emotion/react/jsx-runtime'

export interface CertifationsInterface {
  key: string
  name: string
  imgSrc: string
  tags: string[]
  completed: boolean
}
export interface CertificateProps {
  certificate: CertifationsInterface
}

export interface ProjectInterface {
  name: string
  href: string
  lastUpdated: string
  imgSrc: string
  tags: string[]
}
export interface ProjectProps {
  project: ProjectInterface
}

export interface SocialLinksInterface {
  name: string
  path: string
  icon: JSX.Element
}

export interface NavLinksInterface {
  name: string
  path: string
}
