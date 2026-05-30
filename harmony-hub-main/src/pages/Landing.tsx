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
  Smile,
  Heart,
  Music,
  Tv
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 text-slate-800 overflow-x-hidden selection:bg-pink-200">
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
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-b from-yellow-50/60 via-purple-50/40 to-transparent">
      {/* Playful Animated Floating Blobs for Kids */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-[10%] top-10 h-[350px] w-[350px] rounded-full bg-pink-200/40 blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
          rotate: [0, -15, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute right-[10%] top-20 h-[400px] w-[400px] rounded-full bg-yellow-200/40 blur-[90px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-1/2 bottom-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-200/30 blur-[100px] pointer-events-none"
      />

      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Fun, Colorful Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-purple-200 bg-white px-4 py-1.5 text-xs sm:text-sm font-bold text-purple-600 shadow-sm transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Trinity College London & RockSchool UK Syllabus 🚀</span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Where every note &
            <br />
            <span className="relative inline-block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 italic px-2">
              every voice
              <span className="absolute left-0 bottom-1 w-full h-2 bg-yellow-300/60 -z-10 rounded-full transform -rotate-1"></span>
            </span>{" "}
            finds its stage. 🎉
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl font-medium text-slate-600/90 leading-relaxed">
            India's most refined music & speech academy, made super fun for young creators! ✨
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 px-8 py-6 text-base font-bold text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <Link to="/signup" className="flex items-center gap-2">
                <span>Book Your Free Class Now 🎒</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
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
    <div className="border-y-2 border-dashed border-purple-100 bg-white/80 backdrop-blur-sm py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-3 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          🤝 In partnership with
        </span>
        <span className="font-display text-base sm:text-lg font-bold text-indigo-600 flex items-center gap-1.5">
          🎵 Trinity College London
        </span>
        <span className="font-display text-base sm:text-lg font-bold text-pink-600 flex items-center gap-1.5">
          🎸 RockSchool Awards
        </span>
      </div>
    </div>
  );
}

// ======================================================
// PROGRAMS
// ======================================================

function Programs() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "Western Music":
        return "🎸";
      case "Performance Arts":
        return "🎭";
      default:
        return "🎵";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Western Music":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Performance Arts":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
    }
  };

  const groupedCourses = courses.reduce((acc: any, course: any) => {
    if (!acc[course.name]) {
      acc[course.name] = [];
    }
    acc[course.name].push(course);
    return acc;
  }, {});

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative">
      {/* Background Decorative Shapes */}
      <div className="absolute right-5 top-10 text-4xl opacity-20 pointer-events-none select-none animate-bounce">🎈</div>
      <div className="absolute left-5 bottom-10 text-4xl opacity-20 pointer-events-none select-none animate-spin" style={{ animationDuration: '10s' }}>🎨</div>

      {/* HEADER */}
      <div className="mb-14 text-center md:text-left">
        <div className="inline-block rounded-full bg-pink-100 px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-pink-600 shadow-sm">
          🌟 Programs
        </div>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Curated for every young artist within. ✨
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-500 font-medium">
          Click on any program to see exciting levels and friendly pricing!
        </p>
      </div>

      {/* MAIN COURSE CARDS */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Object.keys(groupedCourses).map((courseName, i) => {
          const firstCourse = groupedCourses[courseName][0];

          return (
            <motion.div
              key={courseName}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Card
                onClick={() =>
                  setSelectedCourse(
                    selectedCourse === courseName ? null : courseName
                  )
                }
                className={`group cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl bg-white ${
                  selectedCourse === courseName 
                    ? "border-purple-500 ring-4 ring-purple-100 shadow-md" 
                    : "border-purple-100 shadow-sm hover:border-purple-300"
                }`}
              >
                <CardContent className="p-6 sm:p-7">
                  {/* TOP ICON & BADGE */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-5xl p-3 bg-slate-50 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-yellow-50">
                      {getIcon(firstCourse.category)}
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getCategoryColor(firstCourse.category)}`}>
                      {firstCourse.category}
                    </span>
                  </div>

                  {/* TITLE */}
                  <div className="mt-6 font-display text-2xl font-extrabold text-slate-900 transition-all duration-300 group-hover:text-purple-600">
                    {courseName}
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {firstCourse.description}
                  </p>

                  {/* CARD FOOTER */}
                  <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500">
                      <Users className="h-4 w-4 text-purple-500" />
                      {groupedCourses[courseName].length} Levels
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-purple-600 transition-all duration-300 group-hover:translate-x-1">
                      Click to View
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* LEVELS (Original Black/Zinc Dark Theme Style Code) */}
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
        })}
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
      v: "100+ ⭐",
      l: "Students Trained",
      bg: "from-pink-100 to-pink-50 text-pink-600 border-pink-200"
    },
    {
      v: "4.9 ★",
      l: "Average Rating",
      bg: "from-yellow-100 to-yellow-50 text-amber-600 border-yellow-200"
    },
    {
      v: "100% 🎯",
      l: "Success Rate",
      bg: "from-indigo-100 to-indigo-50 text-indigo-600 border-indigo-200"
    },
    {
      v: "20+ 🚀",
      l: "Years Experience",
      bg: "from-purple-100 to-purple-50 text-purple-600 border-purple-200"
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <motion.div
            key={s.l}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className={`p-6 text-center rounded-3xl bg-gradient-to-b border-2 shadow-sm transition-all duration-300 ${s.bg}`}
          >
            <div className="font-display text-3xl sm:text-4xl font-black tracking-tight">
              {s.v}
            </div>
            <div className="mt-2 text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wide">
              {s.l}
            </div>
          </motion.div>
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
      n: "Ananya R. 👩‍🎓",
      r: "Piano · Trinity Grade 5",
      q: "The structured progression made me actually finish. Super interactive classes!",
    },
    {
      n: "Kabir M. 👨‍🎓",
      r: "Public Speaking",
      q: "The mentors are world-class. I overcame my stage fear in just a few weeks!",
    },
    {
      n: "Saanvi J. 👩‍🎓",
      r: "Violin · Advanced",
      q: "Perfect online + offline blend. Highly recommend for serious yet fun learning.",
    },
  ];

  return (
    <section className="border-t-2 border-purple-100 bg-white/60 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 text-7xl opacity-5 pointer-events-none select-none">✨</div>
      
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
            ❤️ Testimonials
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Loved by super learners & parents!
          </h2>
        </div>

        {/* TESTIMONIAL CARDS */}
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <Card
              key={q.n}
              className="border-2 border-purple-100 bg-white/90 shadow-sm rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full">
                <div>
                  {/* Stars Row */}
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-current animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>

                  <p className="mt-4 font-medium text-base text-slate-700 leading-relaxed italic">
                    "{q.q}"
                  </p>
                </div>

                <div className="mt-6 border-t-2 border-dashed border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {q.n}
                    </div>
                    <div className="text-xs font-bold text-slate-400 mt-0.5">
                      {q.r}
                    </div>
                  </div>
                  <div className="text-2xl bg-indigo-50 p-2 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity">💬</div>
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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-950 p-8 text-white sm:p-16 shadow-2xl">
        {/* Playful Glowing Circles */}
        <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-yellow-400 mb-4 animate-bounce">
              <Mic2 className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Your first exciting lesson is on us! 🎁
            </h2>
            <p className="mt-4 text-base sm:text-lg text-purple-200 font-medium">
              Join thousands of happy students today. No credit card required!
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 px-8 py-7 text-base font-black text-slate-900 shadow-xl shadow-yellow-950/20 hover:from-yellow-300 hover:to-amber-300 transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <Link to="/signup" className="flex items-center justify-center gap-2">
                <span>Start Learning Now 🚀</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;