import {
  Hero,
  About,
  Skills,
  Projects,
  Experience,
  Testimonials,
  Blog,
  Certifications,
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
      <Experience />
      <Projects />
      <Testimonials />
      <Blog />
      <Certifications />
      <GitHubStats />
      <Contact />
    </ClientOnly>
  );
}
