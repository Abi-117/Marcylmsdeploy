
import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { events } from "@/mock-data";
import { format } from "date-fns";
import { Plus, MapPin } from "lucide-react";


function AdminEvents() {
  return (
    <div>
      <PageHeader title="Events & recitals" actions={
        <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90"><Plus className="mr-1.5 h-3.5 w-3.5" />Create event</Button>
      } />
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-gold">{format(new Date(e.date), "EEE, dd MMM · h:mm a")}</div>
              <div className="mt-2 font-display text-xl">{e.title}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{e.venue}</div>
              <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Registrations</span><span className="font-medium">{e.registered}/{e.spots}</span></div>
                <Progress value={(e.registered / e.spots) * 100} className="mt-1.5 h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminEvents;
