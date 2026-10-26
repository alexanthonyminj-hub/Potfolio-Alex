import { useState } from "react";
import { motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";
import { Button } from "@/components/ui/button";
import { submitContactRequest } from "@/lib/contact.functions";

export function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [submissionState, setSubmissionState] = useState<"idle" | "sent" | "saved" | "error">("idle");
  const submitContact = useServerFn(submitContactRequest);

  return (
    <section id="contact" className="relative py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,oklch(0.65_0.22_265/0.18),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Contact"
          title={<>Let's create something <span className="text-gradient">amazing together</span></>}
          description="Available for freelance projects, long-term collaborations, and creative partnerships."
          align="center"
        />
        <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {[
              { Icon: Mail, label: "Email", value: "alexanthonyminj@gmail.com", href: "mailto:alexanthonyminj@gmail.com" },
              { Icon: Phone, label: "Phone", value: "+91 6201 001 621", href: "tel:+916201001621" },
              { Icon: MapPin, label: "Location", value: "Ranchi, Jharkhand, India", href: undefined as string | undefined },
            ].map((c) => (
              <TiltCard key={c.label} intensity={7} depth={8}>
              <a
                href={c.href}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors"
              >
                <div className="size-12 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center">
                  <c.Icon className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="font-medium">{c.value}</div>
                </div>
              </a>
              </TiltCard>
            ))}
            <TiltCard intensity={7} depth={8}>
            <div className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-secondary">Currently</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm">Booking projects for next month</span>
              </div>
            </div>
            </TiltCard>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={async (e) => {
              e.preventDefault();
              if (isSending) return;

              const form = e.currentTarget;
              const formData = new FormData(form);
              setIsSending(true);
              setSubmissionState("idle");

              try {
                const result = await submitContact({
                  data: {
                    name: String(formData.get("name") ?? ""),
                    email: String(formData.get("email") ?? ""),
                    subject: String(formData.get("subject") ?? ""),
                    message: String(formData.get("message") ?? ""),
                    website: String(formData.get("website") ?? ""),
                  },
                });

                form.reset();
                setSubmissionState(result.emailSent ? "sent" : "saved");
              } catch {
                setSubmissionState("error");
              } finally {
                setIsSending(false);
              }
            }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field empty</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" placeholder="Your name" required maxLength={120} />
              <Field label="Email" name="email" type="email" placeholder="you@email.com" required maxLength={254} />
            </div>
            <div className="mt-4">
              <Field label="Subject" name="subject" placeholder="Project type / topic" required maxLength={200} />
            </div>
            <div className="mt-4">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                maxLength={5000}
                placeholder="Tell me about your project..."
                className="mt-2 w-full rounded-2xl bg-background/40 border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/60 transition-colors resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={isSending}
              className="mt-6 h-auto w-full rounded-full bg-[image:var(--gradient-primary)] px-6 py-3.5 text-sm font-medium text-primary-foreground glow-primary hover-scale"
            >
              <Send className="size-4" /> {isSending ? "Sending..." : "Send Message"}
            </Button>
            <p className="mt-4 min-h-5 text-center text-sm text-muted-foreground" role="status" aria-live="polite">
              {submissionState === "sent" && "Thanks — your message has been sent successfully!"}
              {submissionState === "saved" && "Thanks — your message has been received! I'll get back to you soon."}
              {submissionState === "error" && "We couldn't send your request. Please try again or email alexanthonyminj@gmail.com."}
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-2xl bg-background/40 border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/60 transition-colors"
      />
    </label>
  );
}