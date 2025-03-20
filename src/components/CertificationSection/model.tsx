import { CertificationsInterface } from '@/types/components.types'

export const certificationSectionModel = () => {
  const myCertifications: CertificationsInterface[] = [
    {
      key: 'docker',
      name: 'Docker and Kubernetes: The Complete Guide',
      imgSrc: '',
      tags: ['docker', 'devops', 'kubernetes'],
      completed: true,
    },
    {
      key: 'git',
      name: 'The Git & Github Bootcamp',
      imgSrc: '',
      tags: ['git', 'github'],
      completed: true,
    },
    {
      key: 'github-actions',
      name: 'Github Actions - The Complete Guide',
      imgSrc: '',
      tags: ['github', 'github-actions', 'ci/cd'],
      completed: true,
    },
    {
      key: 'tailwindcss',
      name: 'Tailwind CSS From Scratch | Learn By Building Projects',
      imgSrc: '',
      tags: ['html', 'css', 'tailwind'],
      completed: true,
    },
    {
      key: 'nextjs',
      name: 'Next.js 15 & React - The Complete Guide',
      imgSrc: '',
      tags: ['react', 'nextjs', 'backend'],
      completed: false,
    },
    {
      key: 'aws',
      name: 'AWS, na pratica!',
      imgSrc: '',
      tags: ['aws'],
      completed: false,
    },
    { key: 'kubernetes', name: '', imgSrc: '', tags: [], completed: false },
    {
      key: 'backend-fundamentals',
      name: 'Fundamentals of Backend Engineering',
      imgSrc: '',
      tags: ['backend'],
      completed: false,
    },
    {
      key: 'database-fundamentals',
      name: 'Fundamentals of Database Engineering',
      imgSrc: '',
      tags: ['database'],
      completed: false,
    },
    { key: 'devops', name: '', imgSrc: '', tags: [], completed: false },
    {
      key: 'java',
      name: 'Java Masterclass 2025: 130+ Hours of Expert Lessons',
      imgSrc: '',
      tags: ['java'],
      completed: false,
    },
    {
      key: 'spring-boot',
      name: 'Spring Boot 3, Spring Framework 6: Beginner to Guru',
      imgSrc: '',
      tags: ['java', 'spring-boot', 'backend'],
      completed: false,
    },
    { key: 'rust', name: '', imgSrc: '', tags: [], completed: false },
    {
      key: 'go',
      name: 'Go - The Complete Guide',
      imgSrc: '',
      tags: ['go', 'backend'],
      completed: false,
    },
    {
      key: 'sql',
      name: "SQL and PostgreSQL: The Complete Developer's Guide",
      imgSrc: '',
      tags: ['postgres', 'sql', 'database'],
      completed: false,
    },
    {
      key: 'redis',
      name: "Redis: The Complete Developer's Guide",
      imgSrc: '',
      tags: ['redis', 'cache'],
      completed: false,
    },
  ]

  return { myCertifications }
}
