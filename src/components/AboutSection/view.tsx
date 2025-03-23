import { SiMinutemailer } from 'react-icons/si'
import { Button } from '../ui/Button'
import { Section, Title } from '../ui/Section'
import { aboutSectionModel } from './model'
import {
  AboutMe,
  AboutPargraph,
  AboutPicture,
  Highlight,
  PictureContainer,
  Side,
} from './styles'

export const AboutSectionView = ({}: ReturnType<typeof aboutSectionModel>) => {
  return (
    <Section id='about'>
      <Title>About</Title>
      <AboutMe>
        <Side>
          <AboutPargraph>
            {/* Hello! My name is Jezreel. I am an actual pashionate developer. I
            love coding and building stuff. I like to develop web apps, since
            the frontend, backend until until the devops, ci/cd and AWS. I like
            to use docker and kubernetes. */}
            I'm a versatile developer with expertise in
            <Highlight> frontend (React, Next.js)</Highlight>,
            <Highlight> backend (Next.js)</Highlight>, and
            <Highlight> DevOps (AWS, Docker, Kubernetes)</Highlight>. I enjoy
            building{' '}
            <Highlight>scalable, high-performance applications</Highlight>,
            focusing on both user experience and backend efficiency. My
            experience spans from <Highlight>modern web development</Highlight>{' '}
            to <Highlight> cloud infrastructure</Highlight>, ensuring robust and
            optimized solutions. Beyond coding, I'm committed to{' '}
            <Highlight>continuous learning</Highlight>, currently studying{' '}
            <Highlight>Japanese and German</Highlight>, with plans to learn{' '}
            <Highlight>Russian</Highlight> as well. I also have a strong
            interest in <Highlight>fitness, music, and reading</Highlight>. I'm
            actively seeking opportunities where I can apply my skills and grow
            as a developer.
          </AboutPargraph>
          <Button>
            Talk to Me <SiMinutemailer />{' '}
          </Button>
        </Side>
        <PictureContainer>
          <AboutPicture
            src=''
            alt='about image'
          />
        </PictureContainer>
      </AboutMe>
    </Section>
  )
}
