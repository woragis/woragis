import { Global } from '@emotion/react'
import { styles } from './styles/global'

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import ProjectsSection from './components/ProjectsSection'
import CertificationSection from './components/CertificationSection'

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <HeroSection />
        <ProjectsSection />
        <CertificationSection />
      </main>
      <Footer />
      <Global styles={styles} />
    </>
  )
}

export default App
