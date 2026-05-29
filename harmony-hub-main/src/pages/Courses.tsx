import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  ArrowRight,
  Music,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  SiteHeader,
  SiteFooter,
} from "@/components/SiteChrome";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

function Courses() {

  const [courses, setCourses] =
    useState<any[]>([]);

  // ====================================
  // FETCH COURSES
  // ====================================

  const fetchCourses = async () => {

    try {

      const response =
        await fetch(
          "https://marcylmsdeploy-2.onrender.com/api/courses"
        );

      const result =
        await response.json();

      // GROUP SAME COURSE
      const groupedCourses =
        Object.values(

          result.reduce(
            (acc: any, course: any) => {

              if (!acc[course.name]) {

                acc[course.name] = {

                  id: course._id,

                  name: course.name,

                  category:
                    course.category,

                  description:
                    course.description,

                  fee: course.fee,

                  students:
                    course.students || 0,

                  icon: "🎵",

                  levels: [],
                };

              }

              // ADD LEVELS
              if (
                !acc[
                  course.name
                ].levels.includes(
                  course.mainLevel
                )
              ) {

                acc[
                  course.name
                ].levels.push(
                  course.mainLevel
                );

              }

              return acc;

            },

            {}
          )
        );

      setCourses(
        groupedCourses as any[]
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchCourses();

  }, []);

  return (

    <div className="min-h-screen bg-background">

      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="max-w-2xl">

          <div className="text-xs font-semibold uppercase tracking-wider text-gold">

            Programs

          </div>

          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">

            Find your instrument.

          </h1>

          <p className="mt-4 text-muted-foreground">

            Each course offers a structured
            Foundation → Intermediate →
            Advanced progression with
            certified mentors.

          </p>

        </div>

        {/* COURSES */}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {courses.map(
            (c: any, i: number) => (

              <motion.div
                key={c.id}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: i * 0.04,
                }}
              >

                <Card className="group h-full overflow-hidden border-border/60 transition-all hover:shadow-luxe hover:border-gold/40">

                  <CardContent className="p-6">

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft">

                        <Music className="h-7 w-7 text-gold-foreground" />

                      </div>

                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">

                        {c.category}

                      </span>

                    </div>

                    {/* TITLE */}

                    <div className="mt-5 font-display text-xl font-semibold">

                      {c.name}

                    </div>

                    {/* DESCRIPTION */}

                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">

                      {c.description}

                    </p>

                    {/* LEVELS */}

                    <div className="mt-4 flex flex-wrap gap-1.5">

                      {c.levels.map(
                        (l: string) => (

                          <span
                            key={l}
                            className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-medium text-gold-foreground"
                          >

                            {l}

                          </span>

                        )
                      )}

                    </div>

                    {/* FOOTER */}

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">

                      <span className="inline-flex items-center gap-1">

                        <Users className="h-3.5 w-3.5" />

                        {c.students}

                      </span>

                      <span className="font-medium text-foreground">

                        ₹
                        {Number(
                          c.fee
                        ).toLocaleString()}
                        /mo

                      </span>

                    </div>

                    {/* BUTTON */}

                    <Button
                      asChild
                      size="sm"
                      className="mt-5 w-full bg-foreground text-background hover:bg-foreground/90"
                    >

                      <Link to="/signup">

                        Enroll

                        <ArrowRight className="ml-1 h-3.5 w-3.5" />

                      </Link>

                    </Button>

                  </CardContent>

                </Card>

              </motion.div>

            )
          )}

        </div>

      </section>

      <SiteFooter />

    </div>

  );

}

export default Courses;