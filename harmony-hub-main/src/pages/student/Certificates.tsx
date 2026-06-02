import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Award, Trophy, Calendar, ExternalLink, GraduationCap } from "lucide-react";

import { useAuth } from "@/store/auth";

const API = "https://marcylmsdeploy-2.onrender.com/api";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function StudentCertificates() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const user = auth.user;

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const studentId = user?._id || user?.id;
      if (!studentId) return;

      const res = await axios.get(`${API}/certificates/student/${studentId}`);
      setCerts(res.data.certs || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      {/* ---------------- HEADER ---------------- */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground shadow-lg"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-sm opacity-90">Your Achievements 🏆</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">My Certificates</h1>
            {!loading && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Award className="h-3.5 w-3.5" />
                {certs.length} earned
              </div>
            )}
          </div>
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur sm:flex">
            <Trophy className="h-7 w-7" />
          </div>
        </div>
      </motion.div>

      {/* ---------------- LOADING ---------------- */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : certs.length === 0 ? (
        /* ---------------- EMPTY ---------------- */
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Award className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">No Certificates Yet</p>
          <p className="text-sm text-muted-foreground">
            Complete a course to earn your first certificate.
          </p>
        </div>
      ) : (
        /* ---------------- GRID ---------------- */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert: any, i: number) => (
            <motion.div
              key={cert._id || cert.id || i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.06 * i }}
            >
              <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/50" />
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    {cert.level && (
                      <Badge variant="secondary" className="capitalize">
                        {cert.level}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold leading-tight">{cert.course}</h3>
                    {cert.completionDate && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {cert.completionDate}
                      </p>
                    )}
                  </div>

                  {cert.certificateUrl || cert.url || cert.link ? (
                    <Button asChild size="sm" className="w-full gap-2">
                      <a
                        href={cert.certificateUrl || cert.url || cert.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Certificate
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full gap-2" disabled>
                      View Certificate
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
