import { motion } from "motion/react";
import { Film, Wand2, PenTool, Palette, AudioLines, Share2 } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";

const skills = [
  { name: "Video Editing", level: 95, Icon: Film },
  { name: "Motion Graphics", level: 92, Icon: Wand2 },
  { name: "Graphic Design", level: 88, Icon: PenTool },
  { name: "Color Grading", level: 85, Icon: Palette },
  { name: "Sound Design", level: 80, Icon: AudioLines },
  { name: "Social Content", level: 90, Icon: Share2 },
];

const software = [
  { name: "Adobe Premiere Pro", short: "Pr", color: "from-[#9999FF] to-[#5B5BD6]" },
  { name: "Adobe After Effects", short: "Ae", color: "from-[#D291FF] to-[#7B2BFF]" },
  { name: "Adobe Photoshop", short: "Ps", color: "from-[#31A8FF] to-[#001E36]" },
  { name: "Adobe Illustrator", short: "Ai", color: "from-[#FF9A00] to-[#330000]" },
];

export function Skills() {
  return (
    <section id="skills" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Skills"
          title={<>Tools of the <span className="text-gradient">craft</span></>}
          description="Core creative skills paired with the software stack that powers every delivery."
        />

        <div className="mt-16 grid lg:grid-cols-2 gap-10">
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <TiltCard intensity={6} className="h-full">
                  <div className="group glass rounded-2xl p-5 hover:border-primary/40 transition-colors h-full">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center">
                        <s.Icon className="size-5 text-primary-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.level}%</span>
                    </div>
                    <div className="mt-4 font-medium">{s.name}</div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="h-full bg-[image:var(--gradient-primary)]"
                      />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-4">Software</div>
            <div className="grid grid-cols-2 gap-4">
              {software.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <TiltCard intensity={8} className="h-full">
                    <div className="glass rounded-2xl p-6 flex items-center gap-4 h-full">
                      <div
                        className={`size-14 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center font-display font-bold text-white text-xl shadow-lg`}
                      >
                        {s.short}
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">Expert</div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-secondary">Also fluent in</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["DaVinci Resolve", "Figma", "CapCut", "Audition", "Lightroom", "Canva"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}