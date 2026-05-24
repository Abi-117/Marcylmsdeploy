
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Award, Heart, Sparkles, Target } from "lucide-react";


function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-gold">Our story</div>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Built for the discipline of art.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Founded in 2014, Music & Speech Academy began as a small studio in Bandra and has grown into India's most refined LMS for performing arts education — serving 12,000+ learners across 24 cities and 11 countries.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            { i: Target, t: "Our mission", d: "Make world-class music and speech instruction accessible without diluting the rigor of mastery." },
            { i: Heart, t: "Our craft", d: "Every program is hand-crafted with senior mentors trained under Trinity and Berklee curricula." },
            { i: Sparkles, t: "Our promise", d: "Structured progression — no shortcuts. You earn your stage one verified milestone at a time." },
            { i: Award, t: "Our outcomes", d: "98% Trinity examination pass rate and over 600 graduates performing professionally." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border bg-card p-7">
              <b.i className="h-6 w-6 text-gold" />
              <div className="mt-4 font-display text-2xl">{b.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export default About;
