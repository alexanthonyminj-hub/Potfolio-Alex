import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Experience } from "@/components/portfolio/Experience";
import { Skills } from "@/components/portfolio/Skills";
import { Services } from "@/components/portfolio/Services";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Process } from "@/components/portfolio/Process";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Contact } from "@/components/portfolio/Contact";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alex Anthony Minj — Video Editor & Motion Graphics Artist" },
      { name: "description", content: "Portfolio of Alex Anthony Minj — Video Editor, Motion Graphics Artist & Graphic Designer crafting cinematic stories for brands." },
      { property: "og:title", content: "Alex Anthony Minj — Video Editor & Motion Graphics Artist" },
      { property: "og:description", content: "Cinematic video editing, motion graphics & brand storytelling — 4+ years crafting premium visual content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
