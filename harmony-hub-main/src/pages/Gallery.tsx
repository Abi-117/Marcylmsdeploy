
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const items = [
  { t: "Spring Recital 2025", c: "Auditorium" },
  { t: "Trinity Showcase", c: "Examination Hall" },
  { t: "Speech Finals", c: "TEDx Stage" },
  { t: "Drum Battle", c: "Studio B" },
  { t: "Vocal Ensemble", c: "Open Air" },
  { t: "Piano Soirée", c: "Lounge" },
  { t: "Guitar Night", c: "Cafe" },
  { t: "Annual Gala", c: "Royal Opera House" },
];


function Gallery() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-gold">Gallery</div>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Moments from the stage.</h1>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${i % 3 === 0 ? "from-foreground to-foreground/70" : i % 3 === 1 ? "from-gold-soft to-accent" : "from-secondary to-muted"} ${i % 4 === 0 ? "row-span-2 aspect-[3/5]" : "aspect-square"}`}>
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-sm">
                <div className={`font-display ${i % 3 === 0 ? "text-background" : "text-foreground"}`}>{it.t}</div>
                <div className={`text-xs ${i % 3 === 0 ? "text-background/60" : "text-muted-foreground"}`}>{it.c}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export default Gallery;
