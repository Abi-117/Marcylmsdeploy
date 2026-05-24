
import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";

const certs = [
  { t: "Foundation Completion", c: "Piano · Trinity Track", d: "Earned · Aug 2025", earned: true },
  { t: "Recital Performer", c: "Spring Recital 2025", d: "Earned · Jun 2025", earned: true },
  { t: "Intermediate Completion", c: "Piano", d: "Locked", earned: false },
  { t: "Trinity Grade 3", c: "Piano", d: "Locked", earned: false },
];


function Certificates() {
  return (
    <div>
      <PageHeader title="Certificates" subtitle="Your earned milestones" />
      <div className="grid gap-5 sm:grid-cols-2">
        {certs.map((c) => (
          <Card key={c.t} className={c.earned ? "border-gold/40" : "opacity-70"}>
            <CardContent className="p-7">
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.earned ? "gradient-gold text-gold-foreground shadow-gold" : "bg-muted text-muted-foreground"}`}>
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl">{c.t}</div>
                  <div className="text-xs text-muted-foreground">{c.c}</div>
                  <div className="mt-1 text-xs text-gold">{c.d}</div>
                </div>
              </div>
              {c.earned && <Button variant="outline" size="sm" className="mt-5 w-full"><Download className="mr-1.5 h-3.5 w-3.5" />Download PDF</Button>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Certificates;
