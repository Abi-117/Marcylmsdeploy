
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Users, KeyRound, Sparkles } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [student, setStudent] = useState({
    email: "",
    password: "",
  });

  const [teacher, setTeacher] = useState({
    email: "",
    password: "",
  });

  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });

  const studentLogin = async () => {
    try {
      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: student.email,
            password: student.password,
            role: "student",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      login(data.user);
      alert("Student Login Success");
      navigate("/student");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const teacherLogin = async () => {
    try {
      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: teacher.email,
            password: teacher.password,
            role: "teacher",
          }),
        }
      );

      const data = await response.json();

console.log("LOGIN DATA:", data);

if (!response.ok) {
  alert(data.message);
  return;
}

localStorage.setItem("token", data.token);

localStorage.setItem(
  "userId",
  data.user._id
);

localStorage.setItem(
  "role",
  data.user.role
);

login(data.user);

alert("Teacher Login Success");

navigate("/teacher");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const adminLogin = async () => {
    try {
      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: admin.email,
            password: admin.password,
            role: "admin",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      login(data.user);
      alert("Admin Login Success");
      navigate("/admin");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-zinc-50 to-amber-50/20 p-6 relative overflow-x-hidden selection:bg-amber-200">
      {/* Background Subtle Shapes */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-70 pointer-events-none" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-amber-200/20 blur-[100px] pointer-events-none" />
      <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-yellow-200/20 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex justify-center md:justify-start">
          <Logo />
        </div>

        <div className="mt-10 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-base font-medium text-amber-800/80">
            Select your gateway and login to your premium dashboard ✨
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          
          {/* FEATURED STUDENT LOGIN (ATTRACTIVE DESIGN) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ 
              opacity: { duration: 0.5 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            className="relative lg:col-span-1"
          >
            {/* Outer Premium Glow */}
            <div className="absolute -inset-1 rounded-[2.1rem] bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-40 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
            
            <Card className="relative border-amber-300 bg-gradient-to-b from-white to-amber-50/30 backdrop-blur shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300 rounded-[2rem] group overflow-hidden">
              {/* Top Premium Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-500/20">
                <Sparkles className="h-3 w-3 text-amber-600 animate-spin" />
                <span>Student Hub</span>
              </div>

              <CardContent className="p-7">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                      Student Login
                    </h2>
                    <p className="text-xs font-semibold text-zinc-500">
                      Step into your learning arena
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-700 font-bold text-xs uppercase tracking-wider">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="student@gmail.com"
                      value={student.email}
                      className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500 shadow-sm transition-all focus:border-amber-400"
                      onChange={(e) =>
                        setStudent({
                          ...student,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-zinc-700 font-bold text-xs uppercase tracking-wider">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={student.password}
                      className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500 shadow-sm transition-all focus:border-amber-400"
                      onChange={(e) =>
                        setStudent({
                          ...student,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold pt-1">
                    <Link
                      to="/signup"
                      className="text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-0.5"
                    >
                      New here? Create Account
                    </Link>
                    <Link
                      to="/forgot-password"
                      className="text-zinc-400 hover:text-zinc-600"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <Button
                    onClick={studentLogin}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 py-6 text-base"
                  >
                    Launch Student Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* TEACHER LOGIN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-zinc-200/80 bg-white/90 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 rounded-[2rem] group overflow-hidden">
              <CardContent className="p-7">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-amber-400 shadow-md shadow-zinc-900/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-800 group-hover:text-zinc-900 transition-colors">
                      Teacher Login
                    </h2>
                    <p className="text-xs font-semibold text-zinc-400">
                      Manage classes & students
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-600 font-bold text-xs uppercase tracking-wider">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="teacher@gmail.com"
                      value={teacher.email}
                      className="rounded-xl border-zinc-200 focus-visible:ring-zinc-800"
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-zinc-600 font-bold text-xs uppercase tracking-wider">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={teacher.password}
                      className="rounded-xl border-zinc-200 focus-visible:ring-zinc-800"
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold pt-1">
                    <Link
                      to="/teacher-signup"
                      className="text-zinc-700 hover:text-black hover:underline"
                    >
                      Join as Faculty
                    </Link>
                    <Link
                      to="/forgot-password"
                      className="text-zinc-400 hover:text-zinc-600"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    onClick={teacherLogin}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 font-bold text-amber-400 border border-zinc-700 shadow-md hover:from-zinc-900 hover:to-black transform active:scale-[0.98] transition-all"
                  >
                    Sign In as Faculty
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ADMIN LOGIN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-amber-500/20 bg-gradient-to-b from-zinc-900 to-black shadow-2xl rounded-[2rem] group overflow-hidden relative">
              <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 blur-2xl pointer-events-none" />
              
              <CardContent className="p-7 relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      Admin Portal
                    </h2>
                    <p className="text-xs font-semibold text-zinc-500">
                      Restricted management access
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Admin ID / Email</Label>
                    <Input
                      type="email"
                      placeholder="admin@gmail.com"
                      value={admin.email}
                      className="rounded-xl bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
                      onChange={(e) =>
                        setAdmin({
                          ...admin,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Secure Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={admin.password}
                      className="rounded-xl bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
                      onChange={(e) =>
                        setAdmin({
                          ...admin,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end text-xs font-bold pt-1">
                    <Link
                      to="/forgot-password"
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      Reset Credentials?
                    </Link>
                  </div>

                  <Button
                    onClick={adminLogin}
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 font-bold text-black shadow-lg shadow-amber-950/40 hover:from-amber-400 hover:to-yellow-500 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Secure Authorization</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Login;

