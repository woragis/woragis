import { Global } from '@emotion/react'
import { styles } from './styles/global'

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <HeroSection />
      </main>
      <Footer />
      <Global styles={styles} />
    </>
  )
}

export default App
