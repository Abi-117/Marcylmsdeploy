
import { format } from "date-fns";
import { MapPin, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { events } from "@/mock-data";


function Events() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-gold">Events & recitals</div>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">The stage awaits.</h1>
        <div className="mt-10 space-y-5">
          {events.map((e) => {
            const pct = Math.round((e.registered / e.spots) * 100);
            return (
              <Card key={e.id} className="overflow-hidden border-border/60">
                <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr,auto] md:p-8">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-gold">{format(new Date(e.date), "EEE, dd MMM yyyy · h:mm a")}</div>
                    <h3 className="mt-2 font-display text-2xl">{e.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.venue}</span>
                      <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{e.registered}/{e.spots} registered</span>
                    </div>
                    <Progress value={pct} className="mt-3 h-1.5" />
                  </div>
                  <div className="flex flex-col justify-end gap-2">
                    <Button className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">Register</Button>
                    <Button variant="outline">Details</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export default Events;
