import { useEffect, useState } from "react";

import {
  PageHeader,
  LevelBadge,
} from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";

import {
  Plus,
  Clock,
  User,
} from "lucide-react";

type Batch = {
  _id: string;

  name: string;

  course: string;

  mode: string;

  level: string;

  schedule: string;

  teacher: string;

  capacity: number;

  enrolledStudents: string[];

  waitlistStudents: string[];
};

function AdminBatches() {

  const [batches, setBatches] = useState<Batch[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH BATCHES
  // =========================

  const fetchBatches = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/batches"
      );

      const data = await response.json();

      setBatches(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchBatches();

  }, []);

  return (
    <div>

      <PageHeader
        title="Batches"
        subtitle="Manage cohort schedules and capacity"
        actions={
          <Button
            size="sm"
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New batch
          </Button>
        }
      />

      {/* LOADING */}

      {loading ? (

        <div className="mt-10 text-center text-muted-foreground">
          Loading batches...
        </div>

      ) : batches.length === 0 ? (

        <div className="mt-10 text-center text-muted-foreground">
          No batches found
        </div>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {batches.map((b) => {

            const enrolledCount =
              b.enrolledStudents?.length || 0;

            const waitlistCount =
              b.waitlistStudents?.length || 0;

            const pct = Math.round(
              (enrolledCount / b.capacity) * 100
            );

            return (

              <Card
                key={b._id}
                className="border-border/60 transition-all hover:shadow-luxe"
              >

                <CardContent className="p-6">

                  {/* TOP */}

                  <div className="flex items-start justify-between">

                    <div>

                      <div className="font-display text-lg">
                        {b.name}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {b.course}
                      </div>

                    </div>

                    <Badge
                      variant="outline"
                      className={
                        b.mode === "Online"
                          ? "bg-gold-soft border-gold/30"
                          : ""
                      }
                    >
                      {b.mode}
                    </Badge>

                  </div>

                  {/* LEVEL */}

                  <div className="mt-4 flex items-center gap-2">

                    <LevelBadge level={b.level} />

                  </div>

                  {/* SCHEDULE */}

                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">

                    <div className="flex items-center gap-2">

                      <Clock className="h-3.5 w-3.5" />

                      {b.schedule}

                    </div>

                    <div className="flex items-center gap-2">

                      <User className="h-3.5 w-3.5" />

                      {b.teacher}

                    </div>

                  </div>

                  {/* CAPACITY */}

                  <div className="mt-5">

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-muted-foreground">
                        Capacity
                      </span>

                      <span className="font-medium">
                        {enrolledCount}/{b.capacity}
                      </span>

                    </div>

                    <Progress
                      value={pct}
                      className="mt-1.5 h-1.5"
                    />

                    {waitlistCount > 0 && (

                      <div className="mt-2 text-[11px] text-gold">

                        +{waitlistCount} on waitlist

                      </div>

                    )}

                  </div>

                </CardContent>

              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminBatches;