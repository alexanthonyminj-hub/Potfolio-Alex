import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";

const items = [
  { quote: "A rare blend of cinematic taste and tight execution. Our explainer landed exactly the way we'd imagined.", name: "Future Client", role: "Brand · TBD" },
  { quote: "Motion that actually serves the message — never decorative. Looking forward to collaborating again.", name: "Future Client", role: "Studio · TBD" },
  { quote: "Reliable, fast and visually sharp. Our reels saw a massive bump in engagement.", name: "Future Client", role: "Marketing · TBD" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Testimonials"
          title={<>Kind words, <span className="text-gradient">coming soon</span></>}
          description="A space reserved for partners and clients I'll work with next."
          align="center"
        />
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard intensity={7} className="h-full">
                <div className="glass rounded-3xl p-6 h-full">
                  <Quote className="size-6 text-primary" />
                  <p className="mt-4 text-foreground/90 leading-relaxed">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-[image:var(--gradient-primary)]" />
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}