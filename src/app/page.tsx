import {
  Hero,
  About,
  Skills,
  Education,
  Projects,
  Experience,
  Testimonials,
  Blog,
  GitHubStats,
  Contact,
} from "@/components/pages/home";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
  return (
    <ClientOnly>
      <Hero />
      <About />
      <Skills />
      <Education />
      <Experience />
      <Projects />
      <Testimonials />
      <Blog />
      {/* <GitHubStats /> */}
      <Contact />
    </ClientOnly>
  );
}
