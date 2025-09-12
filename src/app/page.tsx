import {
  Navigation,
  Hero,
  About,
  Skills,
  Projects,
  Contact,
  Footer,
} from "@/components/home";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
  return (
    <ClientOnly>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ClientOnly>
  );
}
