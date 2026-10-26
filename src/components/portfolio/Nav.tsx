import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { TiltCard } from "./TiltCard";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "glass rounded-full mx-4 md:mx-auto px-6 py-3" : ""
        }`}
      >
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="size-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground">
            A
          </span>
          <span className="hidden sm:inline">Alex Minj</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-foreground transition-colors story-link"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden md:inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-primary)] px-5 py-2 text-sm font-medium text-primary-foreground glow-primary hover-scale"
        >
          Let's Talk
        </a>
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <TiltCard intensity={6} glare={0.15} depth={8} className="md:hidden mx-4 mt-2 animate-fade-in">
        <div className="glass rounded-2xl p-4">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground py-2"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-primary)] px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Let's Talk
            </a>
          </div>
        </div>
        </TiltCard>
      )}
    </header>
  );
}