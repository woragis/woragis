import { Hero, About, Skills, Projects, Contact } from "@/components/home";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
  return (
    <ClientOnly>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </ClientOnly>
  );
}
