import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";

const items = [
  {
    role: "Freelance Video Editor",
    org: "Independent",
    period: "2021 — Present",
    points: [
      "Editing videos for clients across multiple industries",
      "Producing reels, podcasts, explainer videos and branded content",
      "Motion graphics integration and social media production",
    ],
  },
  {
    role: "Consultant",
    org: "CyberPeace Foundation",
    period: "2025 — 2026",
    points: [
      "Developed cybersecurity awareness content",
      "Created motion graphics and explainer videos",
      "Produced educational and awareness campaigns",
      "Content for large-scale digital outreach",
    ],
  },
  {
    role: "Freelance Collaboration",
    org: "Aircraft Productions",
    period: "2021 — 2023",
    points: [
      "Professional video editing on production projects",
      "Assisted in post-production workflows",
      "Created engaging visual content",
    ],
  },
  {
    role: "Media Collaborations",
    org: "Prabhat Khabar · Dainik Jagran",
    period: "Ongoing",
    points: [
      "Content and production-related projects",
      "Associated through CyberPeace Foundation",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_left,oklch(0.65_0.22_265/0.12),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Experience"
          title={<>Career <span className="text-gradient">timeline</span></>}
          description="Selected collaborations and roles across freelance, foundation and media work."
        />

        <div className="mt-16 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-transparent" />
          <div className="space-y-12">
            {items.map((it, i) => (
              <motion.div
                key={it.role + it.org}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${
                  i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <span className="absolute left-4 md:left-1/2 -translate-x-1/2 top-3 size-4 rounded-full bg-[image:var(--gradient-primary)] ring-4 ring-background glow-primary" />
                <div className={i % 2 === 0 ? "md:text-right md:pr-10" : "md:pl-10"}>
                  <div className="text-xs uppercase tracking-widest text-primary">{it.period}</div>
                  <h3 className="mt-2 text-2xl font-display font-semibold">{it.role}</h3>
                  <div className="text-muted-foreground inline-flex items-center gap-2 mt-1">
                    <Briefcase className="size-4" /> {it.org}
                  </div>
                </div>
                <div className={i % 2 === 0 ? "md:pl-10 mt-4 md:mt-0" : "md:pr-10 mt-4 md:mt-0 md:text-right"}>
                  <TiltCard intensity={7} depth={8}>
                  <div className="glass rounded-2xl p-5">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {it.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-1.5 size-1.5 rounded-full bg-secondary shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  </TiltCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}