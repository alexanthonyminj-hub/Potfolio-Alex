import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
        <span className="size-1.5 rounded-full bg-primary" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-muted-foreground text-lg">{description}</p>
      )}
    </div>
  );
}