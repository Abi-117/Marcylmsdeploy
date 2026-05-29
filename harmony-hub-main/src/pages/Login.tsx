import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Users } from "lucide-react";

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

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // SAVE TOKEN
    localStorage.setItem("token", data.token);

    // SAVE USER
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

    // TOKEN SAVE
    localStorage.setItem("token", data.token);

    // ZUSTAND STORE SAVE
    login(data.user);

    alert("Admin Login Success");

    navigate("/admin");

  } catch (error) {
    console.log(error);

    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <Logo />

        <div className="mt-10 text-center">
          <h1 className="font-display text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-muted-foreground">
            Login based on your role
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          
          {/* STUDENT LOGIN */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border/60 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="font-display text-2xl">
                      Student Login
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Access student dashboard
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>

                    <Input
                      type="email"
                      placeholder="student@gmail.com"
                      value={student.email}
                      onChange={(e) =>
                        setStudent({
                          ...student,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Password</Label>

                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={student.password}
                      onChange={(e) =>
                        setStudent({
                          ...student,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link
                      to="/signup"
                      className="text-gold hover:underline"
                    >
                      Signup
                    </Link>

                    <Link
                      to="/forgot-password"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    onClick={studentLogin}
                    className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                  >
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* TEACHER LOGIN */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/60 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft">
                    <Users className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="font-display text-2xl">
                      Teacher Login
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Manage classes & students
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>

                    <Input
                      type="email"
                      placeholder="teacher@gmail.com"
                      value={teacher.email}
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Password</Label>

                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={teacher.password}
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link
                      to="/teacher-signup"
                      className="text-gold hover:underline"
                    >
                      Signup
                    </Link>

                    <Link
                      to="/forgot-password"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    onClick={teacherLogin}
                    className="w-full bg-foreground text-background hover:bg-foreground/90"
                  >
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ADMIN LOGIN */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/60 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                    <ShieldCheck className="h-6 w-6 text-red-600" />
                  </div>

                  <div>
                    <h2 className="font-display text-2xl">
                      Admin Login
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Restricted admin access
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Admin Email</Label>

                    <Input
                      type="email"
                      placeholder="admin@gmail.com"
                      value={admin.email}
                      onChange={(e) =>
                        setAdmin({
                          ...admin,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Password</Label>

                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={admin.password}
                      onChange={(e) =>
                        setAdmin({
                          ...admin,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    onClick={adminLogin}
                    className="w-full bg-red-600 text-white hover:bg-red-700"
                  >
                    Secure Login
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