import Certificate from '../Certificate'
import { Section, Title } from '../ui/Section'
import { certificationSectionModel } from './model'
import { Certificates, CertificationsWrapper } from './styles'

export const CertificationSectionView = ({
  myCertifications,
}: ReturnType<typeof certificationSectionModel>) => {
  const myCertificationsComponent = myCertifications.map(
    (certificate, index) => {
      return (
        <Certificate
          key={certificate.key}
          certificate={certificate}
          index={index}
          reverse={index % 2 === 0}
          quantity={myCertifications.length / 2}
        />
      )
    }
  )

  return (
    <Section>
      <CertificationsWrapper id='certifications'>
        <Title>My Certifications</Title>
        <Certificates
          reverse={true}
          rows={1}
          quantity={myCertifications.length}
        >
          {myCertificationsComponent}
        </Certificates>
        {/* <ul>
        <em>Extra curricular certificates</em>
        <li>Curso de Piano e Teclado: Academia da Musica Online</li>
        <li>Curso de Piano completo para Iniciantes</li>
        <li>Curso de Piano Nivel Intermediario</li>
        <li>Teoria da Musica do Basico ao Avancado</li>
      </ul>
      <ul>
        <em>Not yet extra curicular certificates</em>
        <li>Guitar Extreme</li>
        <li>Violao do Zero ao Samba</li>
        <li>Guitarra do Blues ao Jazz</li>
        <li>101 Exercicios de Piano e Teclado</li>
        <li>Teoria da Musica do Intermediario ao Avancado</li>
        <li>Harmonia da Musica do Bascio ao Avancado</li>
      </ul> */}
      </CertificationsWrapper>
    </Section>
  )
}
