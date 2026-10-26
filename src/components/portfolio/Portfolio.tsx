import { motion } from "motion/react";
import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { SectionHeader } from "./Section";
import { TiltCard } from "./TiltCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export type Project = {
  title: string;
  sub: string;
  cat: string;
  gradient: string;
  tag: string;
  videoUrl?: string;
  thumbnail?: string;
};

const categories = [
  "All",
  "Video Editing",
  "Motion Graphics",
  "Podcasts",
  "Explainer Videos",
  "Reels",
  "Social Media",
];

export const projects: Project[] = [
  {
    title: "CyberPeace Foundation",
    sub: "YouTube Content · Awareness",
    cat: "Video Editing",
    gradient: "from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]",
    tag: "Featured",
    videoUrl: "https://drive.google.com/file/d/1drrrkuP1rR5CU1SrNkCzBJUgy9CRpFDf/view?usp=drive_link",
    thumbnail: "", // Paste image link or local path e.g. "/thumbnails/cyberpeace.jpg"
  },
  {
    title: "Cybersecurity Awareness",
    sub: "Explainer · Motion Graphics",
    cat: "Explainer Videos",
    gradient: "from-[#8B5CF6] via-[#A855F7] to-[#EC4899]",
    tag: "Series",
    videoUrl: "https://drive.google.com/file/d/1RzZY4bHQNJRSpP7VQogq06Nsb_vwRgIr/view?usp=drive_link",
    thumbnail: "",
  },
  {
    title: "Digicrow Podcast",
    sub: "Multi-cam · Post-production",
    cat: "Podcasts",
    gradient: "from-[#0EA5E9] via-[#3B82F6] to-[#1E40AF]",
    tag: "Podcast",
    videoUrl: "https://www.youtube.com/watch?v=fs8qKtkJhxo&t=171s",
    thumbnail: "",
  },
  {
    title: "Brand Reels",
    sub: "Short-form · Social Media",
    cat: "Reels",
    gradient: "from-[#F472B6] via-[#8B5CF6] to-[#3B82F6]",
    tag: "Reels",
    videoUrl: "https://drive.google.com/file/d/1YG7tn3YGC5KoX2lmUBzpaPtHYFRZnvPo/view",
    thumbnail: "",
  },
  {
    title: "Motion ID Pack",
    sub: "Logo Animation · Idents",
    cat: "Motion Graphics",
    gradient: "from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6]",
    tag: "Branding",
    videoUrl: "https://drive.google.com/file/d/1zQl-hoRwk7DOaZdHmxiIiQFC8Vv7nlAs/view?usp=sharing",
    thumbnail: "",
  },
  {
    title: "Campaign Cuts",
    sub: "Social Spots · Awareness",
    cat: "Social Media",
    gradient: "from-[#F59E0B] via-[#EF4444] to-[#8B5CF6]",
    tag: "Campaign",
    videoUrl: "https://drive.google.com/file/d/1id8BbGG0qvymm2WdEoVzssiSgXHvKHXd/view",
    thumbnail: "",
  },
];

function getEmbedUrl(url: string): { type: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Google Drive Links (e.g. https://drive.google.com/file/d/ID/view)
  const gdriveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: "iframe",
      src: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
    };
  }

  // 2. YouTube Links (handles watch?v=, watch?si=...&v=, shorts/, embed/, youtu.be/)
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) {
        return {
          type: "iframe",
          src: `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`,
        };
      }
      const shortsMatch = parsed.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch && shortsMatch[1]) {
        return {
          type: "iframe",
          src: `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`,
        };
      }
    }
    if (host.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\/+/, "").split("/")[0]?.split("?")[0];
      if (id && id.length === 11) {
        return {
          type: "iframe",
          src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
        };
      }
    }
  } catch {
    // fallback to regex if URL parsing fails
  }

  const ytFallback = trimmed.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (ytFallback && ytFallback[1]) {
    return {
      type: "iframe",
      src: `https://www.youtube.com/embed/${ytFallback[1]}?autoplay=1&rel=0`,
    };
  }

  // 3. Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // 4. Direct video file (mp4, webm, etc.)
  return {
    type: "video",
    src: trimmed,
  };
}

export function Portfolio() {
  const [active, setActive] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const filtered = active === "All" ? projects : projects.filter((p) => p.cat === active);

  return (
    <section id="portfolio" className="relative py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_right,oklch(0.62_0.24_300/0.12),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            eyebrow="Selected Work"
            title={<>Frames from the <span className="text-gradient">cutting room</span></>}
            description="A handful of recent projects across editing, motion design and podcasts."
          />
          <TiltCard intensity={5} glare={0.12} depth={8}>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <TiltCard key={c} intensity={10} glare={0} depth={8}>
                  <button
                    onClick={() => setActive(c)}
                    className={`text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                      active === c
                        ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                </TiltCard>
              ))}
            </div>
          </TiltCard>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <TiltCard intensity={9} depth={8}>
                <div
                  onClick={() => setSelectedProject(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(p);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60 bg-black/40"
                >
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-90 transition-transform duration-700 ease-out group-hover:scale-105`} />
                  )}
                  <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/20 transition-colors pointer-events-none" />
                  <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">{p.tag}</div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="size-16 rounded-full glass grid place-items-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-xl">
                      <Play className="size-7 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div className="text-xs uppercase tracking-widest text-white/70">{p.cat}</div>
                    <h3 className="mt-1 text-xl font-display font-semibold text-white">{p.title}</h3>
                    <div className="text-sm text-white/80">{p.sub}</div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-border/40 bg-background/95 backdrop-blur-2xl sm:rounded-2xl shadow-2xl">
          <DialogHeader className="p-6 pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold">
                {selectedProject?.cat} • {selectedProject?.tag}
              </div>
              {selectedProject?.videoUrl && (
                <a
                  href={selectedProject.videoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors pr-6"
                >
                  <span>Open Link</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
            <DialogTitle className="text-2xl font-display font-bold text-foreground">
              {selectedProject?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {selectedProject?.sub}
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video w-full bg-black/95">
            {selectedProject?.videoUrl ? (
              (() => {
                const embed = getEmbedUrl(selectedProject.videoUrl);
                if (embed?.type === "iframe") {
                  return (
                    <iframe
                      src={embed.src}
                      title={selectedProject.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video
                    src={embed?.src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                );
              })()
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Play className="mb-3 size-12 opacity-30" />
                <p className="text-sm font-medium">Video preview coming soon!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
