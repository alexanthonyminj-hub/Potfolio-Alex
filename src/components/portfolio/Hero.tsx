import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Download, Play, Github, Linkedin, Mail, Instagram, Sparkles, Star, Wand2 } from "lucide-react";
import portrait from "@/assets/alex-portrait.webp";
import heroBg from "@/assets/hero-bg.jpg";
import toolPremiere from "@/assets/tool-premiere.png";
import toolAfterEffects from "@/assets/tool-aftereffects.png";
import toolPhotoshop from "@/assets/tool-photoshop.png";
import toolDavinci from "@/assets/tool-davinci.png";
import toolIllustrator from "@/assets/tool-illustrator.png";

const stats = [
  { value: "4+", label: "Years Experience" },
  { value: "50+", label: "Brand Collaborations" },
  { value: "100+", label: "Projects Delivered" },
  { value: "∞", label: "Frames in Motion" },
];

const tools = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Photoshop",
  "Illustrator",
  "Figma",
  "Cinema 4D",
  "Audition",
];

type FloatingLogo = {
  src: string;
  alt: string;
  className: string; // position + size
  depth: number;     // parallax strength (px range)
  delay: number;
  duration: number;
  rotate: number;
};

const floatingLogos: FloatingLogo[] = [
  {
    src: toolPremiere,
    alt: "Adobe Premiere Pro",
    className: "-top-8 -left-10 size-20",
    depth: 42,
    delay: 0,
    duration: 5.5,
    rotate: -8,
  },
  {
    src: toolAfterEffects,
    alt: "Adobe After Effects",
    className: "-top-6 -right-10 size-24",
    depth: 55,
    delay: 0.4,
    duration: 6.2,
    rotate: 10,
  },
  {
    src: toolPhotoshop,
    alt: "Adobe Photoshop",
    className: "top-1/2 -right-14 size-20",
    depth: 32,
    delay: 1,
    duration: 5,
    rotate: -6,
  },
  {
    src: toolDavinci,
    alt: "DaVinci Resolve",
    className: "bottom-8 -right-8 size-16",
    depth: 48,
    delay: 1.6,
    duration: 6.8,
    rotate: 14,
  },
  {
    src: toolIllustrator,
    alt: "Adobe Illustrator",
    className: "top-1/3 -left-14 size-20",
    depth: 38,
    delay: 0.8,
    duration: 5.8,
    rotate: 8,
  },
];

function FloatingToolLogo({
  logo,
  sx,
  sy,
  active,
}: {
  logo: FloatingLogo;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  active: boolean;
}) {
  const tx = useTransform(sx, [-0.5, 0.5], [-logo.depth, logo.depth]);
  const ty = useTransform(sy, [-0.5, 0.5], [-logo.depth * 0.7, logo.depth * 0.7]);
  return (
    <motion.div
      className={`absolute ${logo.className} pointer-events-none z-20 will-change-transform`}
      style={{ x: tx, y: ty }}
    >
      <motion.img
        src={logo.src}
        alt={logo.alt}
        width={512}
        height={512}
        loading="lazy"
        className="size-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]"
        initial={{ opacity: 0, scale: 0.6, rotate: logo.rotate }}
        animate={active ? {
          opacity: 1,
          scale: 1,
          y: [0, -12, 0],
          rotate: [logo.rotate - 3, logo.rotate + 3, logo.rotate - 3],
        } : { opacity: 1, scale: 1, y: 0, rotate: logo.rotate }}
        transition={{
          opacity: { duration: 0.6, delay: logo.delay },
          scale: { duration: 0.6, delay: logo.delay, type: "spring", stiffness: 180 },
          y: { duration: logo.duration, delay: logo.delay, repeat: active ? Infinity : 0, ease: "easeInOut" },
          rotate: { duration: logo.duration * 1.4, delay: logo.delay, repeat: active ? Infinity : 0, ease: "easeInOut" },
        }}
      />
    </motion.div>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  // Mouse-follow parallax for the portrait
  const portraitRef = useRef<HTMLDivElement>(null);
  const [canTrackPointer, setCanTrackPointer] = useState(false);
  const reduceMotion = useReducedMotion();
  const isHeroInView = useInView(heroRef, { margin: "200px 0px" });
  const enablePointerEffects = canTrackPointer && !reduceMotion;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 120, damping: 15, mass: 0.4 };
  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);
  // Tilt (deg) — invert Y so cursor "pulls" the card toward it
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  // Subtle inner-layer offsets for depth
  const imgTx = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const imgTy = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["20%", "80%"]);
  const portraitGlare = useTransform(
    [glareX, glareY] as any,
    ([x, y]: any) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 45%)`,
  );

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanTrackPointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enablePointerEffects) return;
    const el = portraitRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section ref={heroRef} id="home" className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1280}
          className="absolute inset-0 size-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-grid opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.62_0.22_265/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.62_0.24_300/0.18),transparent_55%)]" />
        {/* Soft animated blobs */}
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-32 size-[480px] rounded-full blur-3xl opacity-40"
          style={{ background: "var(--gradient-primary)" }}
          animate={isHeroInView && !reduceMotion ? { x: [0, 40, 0], y: [0, 20, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 14, repeat: isHeroInView ? Infinity : 0, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-1/3 -right-40 size-[520px] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.62 0.24 300 / 0.7), transparent 60%)" }}
          animate={isHeroInView && !reduceMotion ? { x: [0, -30, 0], y: [0, -25, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 16, repeat: isHeroInView ? Infinity : 0, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      {/* Floating shapes */}
      <motion.div
        aria-hidden
        className="absolute top-32 left-10 size-24 rounded-2xl border border-primary/30 animate-float-slow"
        style={{ boxShadow: "var(--shadow-glow)" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-40 right-16 size-32 rounded-full border border-secondary/30 animate-float-slow"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Available for freelance projects
            <span className="mx-1 h-3 w-px bg-foreground/15" />
            <span className="inline-flex items-center gap-1 text-foreground/80">
              <Star className="size-3 fill-primary text-primary" /> 5.0 client rating
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight"
          >
            Crafting stories through{" "}
            <span className="relative inline-block">
              <span className="text-gradient">motion, design</span>
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full text-primary/60"
                fill="none"
              >
                <path
                  d="M2 8 C 80 -2, 160 14, 298 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            &amp; creativity.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Professional Video Editor, Motion Graphics Artist, and Graphic Designer
            specializing in explainer videos, podcasts, social media content, and brand storytelling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#portfolio"
              className="group relative inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground glow-primary hover-scale overflow-hidden"
            >
              <Play className="size-4 fill-current" /> View Portfolio
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">100+</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground hover-scale"
            >
              <Download className="size-4" /> Download Resume
            </a>
            <div className="flex items-center gap-2 ml-2">
              {[
                { Icon: Mail, href: "mailto:alexanthonyminj@gmail.com" },
                { Icon: Linkedin, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Github, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="size-10 grid place-items-center rounded-full glass hover:text-primary transition-colors"
                  aria-label="social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-8 rounded-full border-2 border-background"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.65 0.22 ${220 + i * 25}), oklch(0.62 0.24 ${280 + i * 10}))`,
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">50+ brands</span> &amp;
              creators worldwide
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group glass rounded-2xl p-4 relative overflow-hidden"
              >
                <div
                  className="absolute -top-8 -right-8 size-20 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"
                  style={{ background: i % 2 === 0 ? "var(--primary)" : "var(--secondary)" }}
                />
                <div className="relative text-3xl font-display font-bold text-gradient">{s.value}</div>
                <div className="relative mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Portrait card */}
        <motion.div
          ref={portraitRef}
          onMouseMove={enablePointerEffects ? handleMove : undefined}
          onMouseLeave={handleLeave}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md [perspective:1200px]"
        >
          <motion.div
            className="absolute -inset-6 bg-[image:var(--gradient-primary)] blur-3xl opacity-25 rounded-full"
            animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.32, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div aria-hidden className="absolute inset-x-6 top-10 bottom-0 rounded-full bg-foreground/90" />
          {/* Decorative rotating ring */}
          <motion.div
            aria-hidden
            className="absolute -inset-2 rounded-[2rem] border border-dashed border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="relative glass rounded-3xl p-3 will-change-transform"
            style={{
              rotateX: enablePointerEffects ? rotateX : 0,
              rotateY: enablePointerEffects ? rotateY : 0,
              transformStyle: enablePointerEffects ? "preserve-3d" : "flat",
            }}
          >
            <div
              className="relative rounded-2xl overflow-hidden aspect-[4/5]"
              style={{ transform: "translateZ(0)" }}
            >
              {/* Studio backdrop behind the 3D subject */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(ellipse at 50% 100%, color-mix(in oklab, var(--secondary) 25%, transparent), transparent 65%), linear-gradient(180deg, oklch(0.22 0.03 265), oklch(0.12 0.02 265))",
                }}
              />
              <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
              <motion.img
                src={portrait}
                alt="Alex Anthony Minj"
                width={1024}
                height={1280}
                style={{
                  x: enablePointerEffects ? imgTx : 0,
                  y: enablePointerEffects ? imgTy : 0,
                  transform: enablePointerEffects ? "translateZ(60px)" : "none",
                }}
                className="relative size-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] will-change-transform"
              />
              {/* Glare */}
              {enablePointerEffects && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-60"
                  style={{ background: portraitGlare }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              {/* corner brackets */}
              <div className="absolute top-3 left-3 size-6 border-t-2 border-l-2 border-primary/70 rounded-tl-lg" />
              <div className="absolute top-3 right-3 size-6 border-t-2 border-r-2 border-secondary/70 rounded-tr-lg" />
              {/* status chip */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                Rec
              </div>
              {/* timeline overlay */}
              <div className="absolute left-3 right-3 bottom-3 glass rounded-xl p-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Scene 04 · Color</span>
                  <span>01:42 / 03:18</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-[image:var(--gradient-primary)]"
                    initial={{ width: "10%" }}
                    animate={isHeroInView && !reduceMotion ? { width: ["10%", "70%", "10%"] } : { width: "45%" }}
                    transition={{ duration: 8, repeat: isHeroInView ? Infinity : 0, ease: "easeInOut" }}
                  />
                </div>
                <div className="mt-2 grid grid-cols-12 gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-4 rounded-sm"
                      animate={isHeroInView && !reduceMotion ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.8 }}
                      transition={{ duration: 2, repeat: isHeroInView ? Infinity : 0, delay: i * 0.1 }}
                      style={{
                        background:
                          i < 6
                            ? "color-mix(in oklab, var(--primary) 70%, transparent)"
                            : i < 9
                            ? "color-mix(in oklab, var(--secondary) 70%, transparent)"
                            : "color-mix(in oklab, var(--foreground) 12%, transparent)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          {/* Floating 3D tool logos with individual parallax */}
          {floatingLogos.map((logo) => (
            <FloatingToolLogo
              key={logo.alt}
              logo={logo}
              sx={enablePointerEffects ? sx : mx}
              sy={enablePointerEffects ? sy : my}
              active={isHeroInView && !reduceMotion}
            />
          ))}
          {/* floating badges */}
          <motion.div
            className="absolute -right-4 bottom-24 glass rounded-2xl px-3 py-2 text-xs flex items-center gap-2"
            animate={isHeroInView && !reduceMotion ? { y: [0, 10, 0] } : { y: 0 }}
            transition={{ duration: 5, repeat: isHeroInView ? Infinity : 0 }}
          >
            <div className="size-8 grid place-items-center rounded-xl bg-secondary/15 text-secondary">
              <Wand2 className="size-4" />
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Render</div>
              <div className="font-medium text-gradient">4K · ProRes</div>
            </div>
          </motion.div>
          <motion.div
            className="absolute -left-4 bottom-10 glass rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest inline-flex items-center gap-1.5"
            animate={isHeroInView && !reduceMotion ? { y: [0, -6, 0] } : { y: 0 }}
            transition={{ duration: 3.5, repeat: isHeroInView ? Infinity : 0 }}
          >
            <Sparkles className="size-3 text-primary" /> Motion crafted
          </motion.div>
        </motion.div>
      </div>

      {/* Tools marquee */}
      <div className="relative mt-20 mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
          <span className="h-px flex-1 bg-foreground/10" />
          Crafted with
          <span className="h-px flex-1 bg-foreground/10" />
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex gap-3 whitespace-nowrap"
            animate={isHeroInView && !reduceMotion ? { x: ["0%", "-50%"] } : { x: "0%" }}
            transition={{ duration: 30, repeat: isHeroInView ? Infinity : 0, ease: "linear" }}
          >
            {[...tools, ...tools, ...tools].map((t, i) => (
              <span
                key={i}
                className="glass rounded-full px-4 py-2 text-xs font-medium text-foreground/80"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mt-14 flex justify-center">
        <a
          href="#about"
          className="inline-flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"
        >
          Scroll
          <ArrowDown className="size-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}