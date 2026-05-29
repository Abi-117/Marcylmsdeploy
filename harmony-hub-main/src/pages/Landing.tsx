import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Award,
  CheckCircle2,
  Music2,
  Mic2,
  Sparkles,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  SiteHeader,
  SiteFooter,
} from "@/components/SiteChrome";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

// ======================================================
// LANDING
// ======================================================

function Landing() {

  return (

    <div className="min-h-screen bg-background">

      <SiteHeader />

      <Hero />

      <Marquee />

      <Programs />

      <Stats />

      <Testimonials />

      <CTA />

      <SiteFooter />

    </div>

  );

}

// ======================================================
// HERO
// ======================================================

function Hero() {

  return (

    <section className="relative overflow-hidden">

      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-28">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-3xl text-center"
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft/40 px-3 py-1 text-xs font-medium text-gold-foreground">

            <Sparkles className="h-3.5 w-3.5 text-gold" />

            Trinity College London & RockSchool UK Syllabus

          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

            Where every note &
            <br />

            <span className="text-gradient-gold italic">

              every voice

            </span>

            {" "}finds its stage.

          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">

            India's most refined music & speech academy.

          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">

            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >

              <Link to="/signup">

                Book Now

                <ArrowRight className="ml-1 h-4 w-4" />

              </Link>

            </Button>

          </div>

        </motion.div>

      </div>

    </section>

  );

}

// ======================================================
// MARQUEE
// ======================================================

function Marquee() {

  return (

    <div className="border-y border-border bg-muted/30">

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-sm text-muted-foreground">

        <span className="text-xs uppercase tracking-widest">

          In partnership with

        </span>

        <span className="font-display text-base">

          Trinity College London

        </span>

        <span className="font-display text-base">

          RockSchool Awards

        </span>

      </div>

    </div>

  );

}

// ======================================================
// PROGRAMS
// ======================================================
function Programs() {

  const [courses, setCourses] =
    useState<any[]>([]);

  const [selectedCourse, setSelectedCourse] =
    useState<string | null>(null);

  // =========================
  // FETCH COURSES
  // =========================

  useEffect(() => {

    fetchCourses();

  }, []);

  const fetchCourses =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/courses`
          );

        setCourses(
          res.data || []
        );

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // ICON HELPER
  // =========================

  const getIcon =
    (category: string) => {

      switch (category) {

        case "Western Music":
          return "🎸";

        case "Performance Arts":
          return "🎭";

        default:
          return "🎵";

      }

    };

  // =========================
  // GROUP COURSES
  // =========================

  const groupedCourses =
    courses.reduce(
      (acc: any, course: any) => {

        if (!acc[course.name]) {

          acc[course.name] = [];

        }

        acc[course.name].push(course);

        return acc;

      },
      {}
    );

  return (

    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

      {/* HEADER */}

      <div className="mb-12">

        <div className="text-xs font-semibold uppercase tracking-wider text-gold">

          Programs

        </div>

        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">

          Curated for every artist within.

        </h2>

      </div>

      {/* MAIN COURSE CARDS */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {Object.keys(groupedCourses).map(
          (courseName, i) => {

            const firstCourse =
              groupedCourses[courseName][0];

            return (

              <motion.div
                key={courseName}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: i * 0.05,
                }}
              >

                <Card
                  onClick={() =>
                    setSelectedCourse(
                      selectedCourse === courseName
                        ? null
                        : courseName
                    )
                  }
                  className="group cursor-pointer overflow-hidden border-border/60 transition-all hover:border-gold/40 hover:shadow-xl"
                >

                  <CardContent className="p-6">

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div className="text-5xl">

                        {getIcon(
                          firstCourse.category
                        )}

                      </div>

                      <span className="rounded-full border border-border bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">

                        {
                          firstCourse.category
                        }

                      </span>

                    </div>

                    {/* TITLE */}

                    <div className="mt-5 font-display text-2xl font-semibold">

                      {courseName}

                    </div>

                    {/* DESCRIPTION */}

                    <p className="mt-2 text-sm text-muted-foreground">

                      {
                        firstCourse.description
                      }

                    </p>

                    {/* TOTAL LEVELS */}

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">

                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">

                        <Users className="h-4 w-4" />

                        {
                          groupedCourses[
                            courseName
                          ].length
                        }{" "}
                        Levels

                      </span>

                      <span className="text-sm font-medium text-gold">

                        Click to View

                      </span>

                    </div>

                  </CardContent>

                </Card>

                {/* LEVELS */}

              {/* LEVELS */}

{selectedCourse === courseName && (

  <motion.div
    initial={{
      opacity: 0,
      y: 10,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    className="mt-5 overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-black via-zinc-900 to-black shadow-2xl"
  >

    {/* HEADER */}

    <div className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur">

      <div className="flex items-center justify-between">

        <div>

          <div className="text-xs uppercase tracking-[0.3em] text-gold">

            Course Levels

          </div>

          <div className="mt-1 text-2xl font-bold text-white">

            {courseName}

          </div>

        </div>

        <div className="text-5xl">

          {getIcon(firstCourse.category)}

        </div>

      </div>

    </div>

    {/* LEVEL LIST */}

    <div className="space-y-4 p-5">

      {groupedCourses[courseName].map(
        (c: any, index: number) => (

          <motion.div
            key={c._id}
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:scale-[1.02] hover:border-gold/40 hover:bg-gold/10"
          >

            {/* GLOW */}

            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-center justify-between">

              {/* LEFT */}

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-lg font-bold text-black shadow-lg">

                    {index + 1}

                  </div>

                  <div>

                    <div className="text-xl font-semibold text-white">

                      {c.grade}

                    </div>

                    <div className="mt-1 text-sm text-zinc-400">

                      {c.mainLevel}

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT */}

              <div className="text-right">

                <div className="text-3xl font-bold text-gold">

                  ₹
                  {Number(
                    c.fee
                  ).toLocaleString()}

                </div>

                <div className="mt-1 text-xs uppercase tracking-wider text-zinc-400">

                  Monthly Fee

                </div>

              </div>

            </div>

          </motion.div>

        )
      )}

    </div>

  </motion.div>

)}

              </motion.div>

            );

          }
        )}

      </div>

    </section>

  );

}
// ======================================================
// STATS
// ======================================================

function Stats() {

  const stats = [

    {
      v: "100+",
      l: "Students Trained",
    },

    {
      v: "4.9★",
      l: "Average rating",
    },

    {
      v: "100%",
      l: "Success Rate",
    },

    {
      v: "20+",
      l: "Years Experience",
    },

  ];

  return (

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

        {stats.map((s) => (

          <div
            key={s.l}
            className="text-center"
          >

            <div className="font-display text-5xl font-semibold text-gradient-gold">

              {s.v}

            </div>

            <div className="mt-2 text-sm text-muted-foreground">

              {s.l}

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

// ======================================================
// TESTIMONIALS
// ======================================================

function Testimonials() {

  const quotes = [

    {
      n: "Ananya R.",
      r: "Piano · Trinity Grade 5",
      q: "The structured progression made me actually finish.",
    },

    {
      n: "Kabir M.",
      r: "Public Speaking",
      q: "The mentors are world-class.",
    },

    {
      n: "Saanvi J.",
      r: "Violin · Advanced",
      q: "Perfect online + offline blend.",
    },

  ];

  return (

    <section className="border-t border-border bg-muted/30">

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">

        <div className="mb-12">

          <div className="text-xs font-semibold uppercase tracking-wider text-gold">

            Testimonials

          </div>

          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">

            Loved by learners.

          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {quotes.map((q) => (

            <Card
              key={q.n}
              className="border-border/60 bg-card"
            >

              <CardContent className="p-7">

                <div className="flex gap-1 text-gold">

                  {Array.from({
                    length: 5,
                  }).map((_, i) => (

                    <Star
                      key={i}
                      className="h-4 w-4 fill-current"
                    />

                  ))}

                </div>

                <p className="mt-4 font-display text-lg leading-snug">

                  "{q.q}"

                </p>

                <div className="mt-6 border-t border-border pt-4">

                  <div className="font-medium">

                    {q.n}

                  </div>

                  <div className="text-xs text-muted-foreground">

                    {q.r}

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    </section>

  );

}

// ======================================================
// CTA
// ======================================================

function CTA() {

  return (

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

      <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 text-background sm:p-16">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-2">

          <div>

            <Mic2 className="h-7 w-7 text-gold" />

            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight">

              Your first lesson is on us.

            </h2>

            <p className="mt-3 max-w-md text-background/70">

              Join thousands of students today.

            </p>

          </div>

          <div className="flex justify-end">

            <Button
              asChild
              size="lg"
              className="bg-gold text-black hover:bg-gold/90"
            >

              <Link to="/signup">

                Start Now

                <ArrowRight className="ml-1 h-4 w-4" />

              </Link>

            </Button>

          </div>

        </div>

      </div>

    </section>

  );

}

export default Landing;

