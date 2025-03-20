import { Global } from '@emotion/react'
import { styles } from './styles/global'

import Navbar from '@/components/Navbar'
import Project from '@/components/Project'
import HeroSection from '@/components/HeroSection'

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <HeroSection />
      </main>
      <h1>Woragis</h1>
      <Project />
      <Global styles={styles} />
    </>
  )
}

export default App
