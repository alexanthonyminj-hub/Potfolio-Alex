import { motion } from "motion/react";
import { Search, Compass, Scissors, Wand2, MessageSquare, Send } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";

const steps = [
  { Icon: Search, title: "Discovery", desc: "Understand the brand, audience and goals." },
  { Icon: Compass, title: "Strategy", desc: "Define narrative, structure and visual direction." },
  { Icon: Scissors, title: "Editing & Production", desc: "Assemble footage with cinematic pacing." },
  { Icon: Wand2, title: "Motion Graphics", desc: "Layer animation, type and effects." },
  { Icon: MessageSquare, title: "Review & Revisions", desc: "Iterate with feedback rounds." },
  { Icon: Send, title: "Final Delivery", desc: "Export, optimize and ship across platforms." },
];

export function Process() {
  return (
    <section id="process" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Process"
          title={<>A workflow built for <span className="text-gradient">story</span></>}
          description="Six clear steps from blank timeline to final cut."
          align="center"
        />
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <TiltCard intensity={6} className="h-full">
                <div className="relative glass rounded-3xl p-6 h-full">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Step {String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center">
                      <s.Icon className="size-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}