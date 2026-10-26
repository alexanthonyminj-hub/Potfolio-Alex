import { motion } from "motion/react";
import { Film, Sparkles, Mic, Youtube, Smartphone, PlaySquare, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";

const services = [
  { Icon: Film, title: "Video Editing", desc: "Corporate videos, YouTube content & promotional edits with cinematic pacing." },
  { Icon: Sparkles, title: "Motion Graphics & Animation", desc: "Logo animation, explainer animations and crisp infographic motion." },
  { Icon: Mic, title: "Podcast Editing", desc: "Audio cleanup, multi-camera editing & visual podcast production." },
  { Icon: Youtube, title: "YouTube Content Editing", desc: "Long-form content, retention-focused editing and thumbnail support." },
  { Icon: Smartphone, title: "Reels & Short-Form", desc: "Instagram Reels, YouTube Shorts and viral-optimized social content." },
  { Icon: PlaySquare, title: "Corporate Explainers", desc: "Educational content, product demos and awareness campaigns." },
];

export function Services() {
  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Services"
          title={<>What I can <span className="text-gradient">build for you</span></>}
          description="A focused set of services covering everything from raw footage to a finished, story-driven asset."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <TiltCard intensity={7} className="h-full">
                <a
                  href="#contact"
                  className="group relative block glass rounded-3xl p-6 overflow-hidden hover:border-primary/40 transition-all h-full"
                >
                  <div className="absolute -top-20 -right-20 size-40 rounded-full bg-[image:var(--gradient-primary)] opacity-0 blur-3xl group-hover:opacity-30 transition-opacity" />
                  <div className="flex items-start justify-between">
                    <div className="size-12 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center">
                      <s.Icon className="size-6 text-primary-foreground" />
                    </div>
                    <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="mt-6 text-xl font-display font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  <div className="mt-5 text-xs uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Start a project →
                  </div>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}