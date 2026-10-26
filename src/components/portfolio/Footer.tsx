export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Alex Anthony Minj. Crafted with motion & care.</div>
        <div className="flex items-center gap-6">
          <a href="#portfolio" className="hover:text-foreground transition-colors">Work</a>
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}