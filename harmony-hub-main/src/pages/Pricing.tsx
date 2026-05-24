import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tiers = [
  { name: "Foundation", price: 3500, blurb: "Begin your structured journey.", features: ["8 group classes/month", "1 mentor 1:1 review", "Mobile + web access", "Practice tracker"] },
  { name: "Intermediate", price: 5500, blurb: "Refine craft, performance & theory.", popular: true, features: ["8 group + 2 solo classes", "Recital eligibility", "Recording studio access", "Trinity prep modules"] },
  { name: "Advanced", price: 7500, blurb: "Master performance and examinations.", features: ["Unlimited solo coaching", "Trinity examination support", "Stage performance slots", "Audition portfolio"] },
];


function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Pricing</div>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Pay only for the stage you've earned.</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Intermediate unlocks after Foundation completion. Advanced unlocks after Intermediate.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.name} className={`relative overflow-hidden ${t.popular ? "border-gold/60 shadow-gold" : "border-border/60"}`}>
              {t.popular && <div className="absolute right-4 top-4 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">Most popular</div>}
              <CardContent className="p-7">
                <div className="font-display text-2xl">{t.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-semibold">₹{t.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <Button asChild className={`mt-6 w-full ${t.popular ? "bg-gold text-gold-foreground hover:bg-gold/90" : "bg-foreground text-background hover:bg-foreground/90"}`}>
                  <Link to="/signup">Get started</Link>
                </Button>
                <ul className="mt-7 space-y-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 text-gold" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export default Pricing;
