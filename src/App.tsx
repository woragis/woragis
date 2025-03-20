import Navbar from '@/components/Navbar'
import Project from './components/Project'
import { Global } from '@emotion/react'
import { styles } from './styles/global'

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <h1>Woragis</h1>
      <Project />
      <Global styles={styles} />
    </>
  )
}

export default App
