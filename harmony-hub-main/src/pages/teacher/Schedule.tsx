
import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { classes } from "@/mock-data";
import { format } from "date-fns";

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const hours = ["8 AM","10 AM","12 PM","2 PM","4 PM","6 PM","8 PM"];


function TeacherSchedule() {
  return (
    <div>
      <PageHeader title="Weekly schedule" subtitle="Your batches at a glance" />
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="grid min-w-[900px] grid-cols-[80px_repeat(7,1fr)]">
            <div className="border-b border-r border-border bg-muted/30 p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"></div>
            {days.map((d) => <div key={d} className="border-b border-r border-border bg-muted/30 p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>)}
            {hours.map((h, hi) => (
              <>
                <div key={h} className="border-b border-r border-border p-3 text-xs text-muted-foreground">{h}</div>
                {days.map((d, di) => {
                  const cls = classes[(hi*7+di) % classes.length];
                  const show = (hi + di) % 3 === 0;
                  return (
                    <div key={`${h}-${d}`} className="border-b border-r border-border p-2 min-h-[70px]">
                      {show && (
                        <div className="rounded-md bg-gold-soft border border-gold/30 p-2 text-[11px]">
                          <div className="font-medium truncate">{cls.title}</div>
                          <div className="text-muted-foreground truncate">{cls.batchName}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TeacherSchedule;
