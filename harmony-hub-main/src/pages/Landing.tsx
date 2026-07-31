import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const API = "https://marcylmsdeploy-2.onrender.com/api";

// Add this once in your index.html <head> OR in your global CSS:
// <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

// ======================================================
// LANDING
// ======================================================
function Landing() {
  return (
    <div
      className="bg-white text-black min-h-screen overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
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
// HERO — White / Gold / Black with handwritten accents
// ======================================================
function Hero() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center">
      {/* Soft gold ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-[0.15] blur-3xl" />

      {/* Faint gold grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating gold orbs */}
      <div className="absolute top-32 right-24 w-32 h-32 rounded-full bg-[#D4AF37] opacity-10 blur-2xl animate-pulse" />
      <div
        className="absolute bottom-32 left-24 w-40 h-40 rounded-full bg-[#D4AF37] opacity-[0.08] blur-3xl animate-pulse"
        style={{ animationDelay: "1.2s" }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#D4AF37]/10 via-white to-[#D4AF37]/10 text-[#8B6914] text-xs md:text-sm uppercase tracking-[0.25em] font-semibold shadow-[0_5px_30px_rgba(212,175,55,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          Trinity College London & RockSchool UK
        </motion.span>

        {/* Handwritten kicker */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-3xl md:text-4xl text-[#D4AF37]"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          welcome to our world ✨
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-black"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Where every note &
          <br />
          <span
            className=" bg-gradient-to-r from-[#D4AF37] via-[#B8941F] to-[#8B6914] bg-clip-text text-transparent"
            style={{ fontWeight: 700 }}
          >
            every voice
          </span>
          <br />
          finds its stage.
        </motion.h1>

        {/* Divider */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-lg md:text-xl text-black/60 max-w-2xl mx-auto leading-relaxed"
        >
          India's most refined music & performance academy — crafted for future
          artists, speakers and performers.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/login">
            <Button className="group bg-gradient-to-r from-[#D4AF37] via-[#B8941F] to-[#8B6914] hover:from-[#B8941F] hover:to-[#8B6914] text-white rounded-full px-10 py-7 text-base font-bold shadow-[0_10px_40px_-10px_rgba(212,175,55,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(212,175,55,0.8)] transition-all duration-300">
              Book Now            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
        </motion.div>

        {/* Trust
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-black/50"
        >
          {["Globally Certified", "Master Instructors", "Since 2010"].map(
            (t) => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>{t}</span>
              </div>
            )
          )}
        </motion.div> */}
      </div>
    </section>
  );
}

// ======================================================
// MARQUEE
// ======================================================
function Marquee() {
  return (
    <section className="relative bg-black border-y border-[#D4AF37]/30 py-6 mt-5 overflow-hidden">
      <div className="relative flex items-center justify-center flex-wrap gap-6 md:gap-12 text-[#D4AF37] text-sm md:text-base tracking-widest uppercase font-semibold px-4">
        <span className="opacity-70">In partnership with</span>
        <span>Trinity College London</span>
        <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
        <span>RockSchool Awards</span>
      </div>
    </section>
  );
}

// ======================================================
// PROGRAMS
// ======================================================
function Programs() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

const [selectedMode, setSelectedMode] = useState<{
  [key: string]: string;
}>({});

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

  const groupedCourses = courses.reduce((acc: any, course: any) => {
    if (!acc[course.name]) acc[course.name] = [];
    acc[course.name].push(course);
    return acc;
  }, {});

  return (
    <section className="relative bg-white py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-[0.07] blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p
            className="text-3xl text-[#D4AF37] mb-2"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            explore our
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-black"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Curated{" "}
            <span
              className="bg-gradient-to-r from-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent"
            >
              Programs
            </span>
          </h2>
          <p className="mt-5 text-black/60 text-lg max-w-2xl mx-auto">
            Click on any program to explore curated levels and refined pricing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(groupedCourses).map((courseName) => {
            const firstCourse = groupedCourses[courseName][0];
            const isOpen = selectedCourse === courseName;

            return (
              <div key={courseName} className="space-y-4">
                <div
                  onClick={() => setSelectedCourse(isOpen ? null : courseName)}
                  className={`group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 p-7 ${
                    isOpen
                      ? "border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-white shadow-[0_20px_60px_-15px_rgba(212,175,55,0.4)]"
                      : "border-black/10 bg-white hover:border-[#D4AF37] hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B6914] font-semibold px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                      {firstCourse.category}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>

                  <h3
                    className="text-2xl font-bold text-black mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {courseName}
                  </h3>
                  <p className="text-black/60 text-sm leading-relaxed line-clamp-2 mb-6">
                    {firstCourse.description}
                  </p>

                  <div className="flex items-center justify-between pt-5 border-t border-black/10">
                    <span className="flex items-center gap-2 text-sm text-[#8B6914] font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      {groupedCourses[courseName].length} Levels
                    </span>
                    <span className="flex items-center gap-1 text-xs uppercase tracking-wider text-black/50">
                      {isOpen ? "Close" : "View"}
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border-2 border-[#D4AF37]/40 bg-black p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                        Course Levels
                      </span>
                      <span
                        className="text-sm text-white italic"
                        style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem" }}
                      >
                        {courseName}
                      </span>
                    </div>

                    {["Individual", "Group"].map((mode) => {
  const modeCourses = groupedCourses[courseName].filter(
    (c: any) => c.classMode === mode
  );

  if (modeCourses.length === 0) return null;

  const open = selectedMode[courseName] === mode;

  return (
    <div key={mode} className="mb-4">

      <button
        onClick={() =>
          setSelectedMode((prev) => ({
            ...prev,
            [courseName]: open ? "" : mode,
          }))
        }
        className="flex w-full items-center justify-between rounded-xl border border-[#D4AF37]/30 bg-white/5 px-4 py-3 hover:border-[#D4AF37]"
      >
        <span className="font-semibold text-[#D4AF37]">
          {mode}
        </span>

        {open ? (
          <ChevronUp className="h-5 w-5 text-[#D4AF37]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#D4AF37]" />
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-3">

          {modeCourses.map((c: any, idx: number) => (
            <div
              key={c._id}
              className="flex items-center justify-between rounded-xl border border-[#D4AF37]/20 bg-white/5 p-4"
            >
              <div>
                <div className="font-semibold text-[#D4AF37]">
                  {c.grade}
                </div>

                <div className="text-xs text-white/60">
                  {c.mainLevel}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  ₹{Number(c.fee).toLocaleString()}
                </div>

                <div className="text-[10px] uppercase text-white/50">
                  Monthly
                </div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
})}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// STATS
// ======================================================
function Stats() {
  const stats = [
    { v: "100+", l: "Students Trained" },
    { v: "4.9", l: "Average Rating" },
    { v: "100%", l: "Success Rate" },
    { v: "20+", l: "Years Experience" },
  ];

  return (
    <section className="relative bg-black py-20 border-y-2 border-[#D4AF37]/40 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-[0.08]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div
                className="text-5xl md:text-7xl font-bold bg-gradient-to-b from-[#F5E6A8] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent"
              
              >
                {s.v}
              </div>
              <div className="mt-3 text-xs md:text-sm uppercase tracking-[0.2em] text-white/70">
                {s.l}
              </div>
            </div>
          ))}
        </div>
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
      q: "The structured progression made me actually finish. Refined and rigorous.",
    },
    {
      n: "Kabir M.",
      r: "Public Speaking",
      q: "The mentors are world-class. I overcame my stage fear in just a few weeks.",
    },
    {
      n: "Saanvi J.",
      r: "Violin · Advanced",
      q: "Perfect blend of online and offline. Highly recommend for serious learners.",
    },
  ];

  return (
    <section className="relative bg-white py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p
            className="text-3xl text-[#D4AF37] mb-2"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            our happy learners
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-black"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Loved by{" "}
            <span
              className="bg-gradient-to-r from-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent"
             
            >
              true learners
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <Card
              key={q.n}
              className="bg-white border-2 border-black/10 rounded-2xl hover:border-[#D4AF37] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.4)]"
            >
              <CardContent className="p-8">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"
                    />
                  ))}
                </div>
                <p
                  className="text-black/80 leading-relaxed mb-6 text-lg"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  "{q.q}"
                </p>
                <div className="pt-5 border-t border-black/10">
                  <div className="text-black font-bold">{q.n}</div>
                  <div className="text-[#8B6914] text-xs uppercase tracking-wider mt-1 font-semibold">
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
    <section className="relative bg-white py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 bg-gradient-to-br from-white via-[#D4AF37]/5 to-white p-12 md:p-20 text-center shadow-[0_30px_80px_-20px_rgba(212,175,55,0.3)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#D4AF37] opacity-10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-6xl font-bold tracking-tight text-black"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your first lesson is{" "}
              <span
                className="italic bg-gradient-to-r from-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                on us
              </span>
            </h2>
            <p className="mt-6 text-black/70 text-lg max-w-xl mx-auto">
              Join an academy trusted by serious learners.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button className="group bg-gradient-to-r from-[#D4AF37] via-[#B8941F] to-[#8B6914] hover:from-[#B8941F] hover:to-[#8B6914] text-white rounded-full px-10 py-7 text-base font-bold shadow-[0_10px_40px_-10px_rgba(212,175,55,0.6)] transition-all">
                  Start Learning Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
