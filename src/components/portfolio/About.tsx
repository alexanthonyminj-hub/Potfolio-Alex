import { motion } from "motion/react";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";

export function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            eyebrow="About"
            title={
              <>
                Visual storyteller with a <span className="text-gradient">cinematic eye</span>
              </>
            }
          />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Alex Anthony Minj is a creative professional with more than four years of
            experience in video editing, motion graphics, and graphic design. He has
            worked on explainer videos, motion graphics content, podcast editing,
            YouTube videos, reels, and social media campaigns for various brands and
            organizations.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Passionate about storytelling through visuals, Alex combines technical
            expertise and creativity to craft engaging content that captures attention
            and delivers impactful messages.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <TiltCard intensity={7} depth={8} className="h-full">
            <div className="glass rounded-2xl p-5 h-full">
              <MapPin className="size-5 text-primary" />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Based in</div>
              <div className="font-medium">Ranchi, Jharkhand · India</div>
            </div>
            </TiltCard>
            <TiltCard intensity={7} depth={8} className="h-full">
            <div className="glass rounded-2xl p-5 h-full">
              <Sparkles className="size-5 text-secondary" />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Title</div>
              <div className="font-medium">Video Editor · Motion · Design</div>
            </div>
            </TiltCard>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <TiltCard intensity={6} depth={8}>
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center">
                <GraduationCap className="size-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Education</div>
                <div className="font-display font-semibold">Mass Communication & Video Production</div>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                {
                  year: "Bachelor's Degree",
                  title: "Mass Communication & Video Production",
                  place: "Gossner College, Ranchi",
                },
                {
                  year: "4+ Years",
                  title: "Professional Practice",
                  place: "Freelance & Studio Collaborations",
                },
              ].map((it) => (
                <div
                  key={it.title}
                  className="relative pl-6 border-l border-border/60"
                >
                  <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary glow-primary" />
                  <div className="text-xs uppercase tracking-widest text-primary">{it.year}</div>
                  <div className="font-medium mt-1">{it.title}</div>
                  <div className="text-sm text-muted-foreground">{it.place}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {["Premiere", "After Effects", "Photoshop"].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-border/60 px-3 py-2 text-center text-xs text-muted-foreground"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}