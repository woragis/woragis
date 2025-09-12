import {
  Navigation,
  Hero,
  About,
  Skills,
  Projects,
  Contact,
  Footer,
} from "@/components/home";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
