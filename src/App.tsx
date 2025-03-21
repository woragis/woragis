import { Global } from '@emotion/react'
import { styles } from './styles/global'

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import ProjectsSection from './components/ProjectsSection'
import CertificationSection from './components/CertificationSection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <CertificationSection />
        <ContactSection />
      </main>
      <Footer />
      <Global styles={styles} />
    </>
  )
}

export default App
