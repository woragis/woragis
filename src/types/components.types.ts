import { JSX } from '@emotion/react/jsx-runtime'

export type Frameworks =
  | 'react'
  | 'nextjs'
  | 'firebase'
  | 'tailwind'
  | 'docker'
  | 'java'
  | 'spring-boot'
  | 'kubernetes'
  | 'git'
  | 'github'
  | 'github-actions'
  | 'ci/cd'
  | 'html'
  | 'css'
  | 'aws'
  | 'go'
  | 'postgres'
  | 'sql'
  | 'redis'
  | 'cache'
  | 'javascript'

export type Careers = 'backend' | 'frontend' | 'devops' | 'database'
export type ProjectType = 'clone'
export type Tags = Frameworks | Careers
export type ProjectTags = Frameworks | Careers | ProjectType | 'stripe'

export interface CertificationsInterface {
  key: string
  name: string
  imgSrc: string
  tags: Tags[]
  completed: boolean
}

export interface CertificateProps {
  certificate: CertificationsInterface
  reverse: boolean
  index: number
  top: number
}

export interface ProjectInterface {
  name: string
  href: string
  lastUpdated: string
  imgSrc: string
  tags: ProjectTags[]
  description: string
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
