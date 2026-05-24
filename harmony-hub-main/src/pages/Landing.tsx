import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, CheckCircle2, Music2, Mic2, Sparkles, Star, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/mock-data";
import { useEffect, useState } from "react";


function Landing() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {

  fetch(
    "https://marcylmsdeploy.onrender.com/api/courses"
  )
    .then((res) => res.json())
    .then((data) => setCourses(data));

}, []);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Programs />
      <Pathway />
      <Stats />
      <Testimonials />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft/40 px-3 py-1 text-xs font-medium text-gold-foreground">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Trinity College London certified pathway
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Where every note &<br />
            <span className="text-gradient-gold italic">every voice</span> finds its stage.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            India's most refined music & speech academy. Structured progression, certified mentors, and a luxury online + offline experience.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
              <Link to="/signup">Book a free trial <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/courses">Explore programs</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            {["12,000+ learners", "Certified mentors", "Online & offline", "Trinity examinations"].map((t) => (
              <div key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-gold" /> {t}</div>
            ))}
          </div>
        </motion.div>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto mt-16 max-w-5xl">
          <div className="glass shadow-luxe rounded-3xl p-2">
            <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-8 text-background sm:p-12">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { k: "Foundation", v: "Begin your journey", icon: Music2 },
                  { k: "Intermediate", v: "Refine your craft", icon: Star },
                  { k: "Advanced", v: "Perform on stage", icon: Award },
                ].map((s, i) => (
                  <div key={s.k} className="rounded-xl border border-gold/20 bg-background/5 p-5">
                    <s.icon className="h-5 w-5 text-gold" />
                    <div className="mt-4 text-xs uppercase tracking-wider text-gold">Stage {i + 1}</div>
                    <div className="mt-1 font-display text-2xl">{s.k}</div>
                    <div className="mt-1 text-sm text-background/70">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Trinity College London", "Royal Schools", "ABRSM", "Toastmasters", "Berklee Online", "Rockschool"];
  return (
    <div className="border-y border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-sm text-muted-foreground">
        <span className="text-xs uppercase tracking-widest">In partnership with</span>
        {items.map((i) => <span key={i} className="font-display text-base">{i}</span>)}
      </div>
    </div>
  );
}

function Programs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Programs</div>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">Curated for every artist within.</h2>
        </div>
        <Button asChild variant="outline"><Link to="/courses">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 6).map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Card className="group h-full overflow-hidden border-border/60 transition-all hover:shadow-luxe hover:border-gold/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{c.icon}</div>
                  <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{c.category}</span>
                </div>
                <div className="mt-5 font-display text-xl font-semibold">{c.name}</div>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.students} learners</span>
                  <span className="font-medium text-foreground">₹{c.fee.toLocaleString()}/mo</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Pathway() {
  const steps = [
    { t: "Foundation", d: "Build technique, theory, and confidence. 3–6 month structured curriculum." },
    { t: "Intermediate", d: "Refine artistry, ear training, and stage performance. Unlocks after Foundation." },
    { t: "Advanced", d: "Trinity-grade repertoire, public recitals, and audition preparation." },
  ];
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Pathway</div>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">A progression worth earning.</h2>
          <p className="mt-4 text-base text-background/70">Every learner begins in Foundation. Each next stage unlocks only when your mentor verifies your readiness — no shortcuts, just craft.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border border-gold/20 bg-background/5 p-7">
              <div className="font-display text-6xl text-gold/40">0{i + 1}</div>
              <div className="mt-3 font-display text-2xl">{s.t}</div>
              <p className="mt-2 text-sm text-background/70">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "12K+", l: "Active learners" },
    { v: "98%", l: "Trinity pass rate" },
    { v: "85+", l: "Certified mentors" },
    { v: "4.9★", l: "Average rating" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-5xl font-semibold text-gradient-gold">{s.v}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { n: "Ananya R.", r: "Piano · Trinity Grade 5", q: "The structured progression made me actually finish — I cleared Grade 5 in 14 months." },
    { n: "Kabir M.", r: "Public Speaking", q: "From shaking on stage to anchoring my college fest. The mentors are world-class." },
    { n: "Saanvi J.", r: "Violin · Advanced", q: "The online + offline blend is perfect. I never miss a class, even when travelling." },
  ];
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Testimonials</div>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">Loved by learners.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <Card key={q.n} className="border-border/60 bg-card">
              <CardContent className="p-7">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 font-display text-lg leading-snug">"{q.q}"</p>
                <div className="mt-6 border-t border-border pt-4">
                  <div className="font-medium">{q.n}</div>
                  <div className="text-xs text-muted-foreground">{q.r}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 text-background sm:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <Mic2 className="h-7 w-7 text-gold" />
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight">Your first lesson is on us.</h2>
            <p className="mt-3 max-w-md text-background/70">Book a free 30-minute trial with a senior mentor. No card needed.</p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/signup">Start trial <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-background/20 bg-transparent text-background hover:bg-background/10">
              <Link to="/contact">Talk to advisor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
