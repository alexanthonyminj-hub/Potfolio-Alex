import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, forwardRef, useState } from "react";

type TiltCardProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** Max tilt in degrees. Default 8. */
  intensity?: number;
  /** Glare highlight strength (0 disables). Default 0.18 */
  glare?: number;
  /** Inner content translateZ for depth. Default 8 (kept small to keep text crisp). */
  depth?: number;
};

/**
 * Reusable mouse-follow 3D parallax tilt card. Wraps children in a
 * perspective container with springy rotateX/Y, subtle inner depth and a
 * moving glare highlight. Resets smoothly on mouse leave.
 */
export const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(function TiltCard(
  { intensity = 8, glare = 0.18, depth = 8, className = "", style, children, onClick },
  _ref,
) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [canTrackPointer, setCanTrackPointer] = useState(false);
  const reduceMotion = useReducedMotion();
  const enablePointerEffects = canTrackPointer && !reduceMotion;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 140, damping: 16, mass: 0.35 };
  const sx = useSpring(mx, cfg);
  const sy = useSpring(my, cfg);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity * 0.7, -intensity * 0.7]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["15%", "85%"]);
  const safeDepth = Math.min(depth, 10);
  const glareBg = useTransform(
    [glareX, glareY] as never,
    ([x, y]: [string, string]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,${glare}), transparent 55%)`,
  );
  const waveBg = useTransform(
    [glareX, glareY] as never,
    ([x, y]: [string, string]) =>
      `radial-gradient(circle at ${x} ${y}, color-mix(in oklab, var(--primary) 38%, transparent) 0%, color-mix(in oklab, var(--secondary) 26%, transparent) 18%, transparent 44%), radial-gradient(circle at ${x} ${y}, transparent 25%, color-mix(in oklab, var(--primary) 20%, transparent) 33%, transparent 51%)`,
  );

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanTrackPointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enablePointerEffects) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    setHovered(false);
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={enablePointerEffects ? onMove : undefined}
      onMouseEnter={enablePointerEffects ? () => setHovered(true) : undefined}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`relative [perspective:1000px] ${className}`}
      style={{
        ...style,
        rotateX: enablePointerEffects ? rotateX : 0,
        rotateY: enablePointerEffects ? rotateY : 0,
        transformStyle: enablePointerEffects ? "preserve-3d" : "flat",
        willChange: enablePointerEffects ? "transform" : "auto",
        backfaceVisibility: "hidden",
      }}
    >
      {enablePointerEffects && glare > 0 && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
      {enablePointerEffects && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{ background: waveBg }}
        />
      )}
      <div
        style={{
          transform: enablePointerEffects ? `translateZ(${safeDepth}px)` : undefined,
          backfaceVisibility: "hidden",
        }}
        className="relative z-10 h-full w-full"
      >
        {children}
      </div>
    </motion.div>
  );
});