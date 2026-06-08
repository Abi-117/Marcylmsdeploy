import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, CalendarDays, Wallet, Bell, Settings,
  LogOut, Music2, BookOpen, Award, BarChart3, Video, ClipboardList, Trophy,
  Search, Sun, Moon, Menu,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import { Logo } from "@/components/Logo";
import { useAuth } from "@/store/auth";
import type { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ProfileCard } from "@/components/ProfileCard";


const navByRole: Record<Role, any[]> = {
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/students", label: "Students", icon: GraduationCap },
    { to: "/admin/teachers", label: "Teachers", icon: Users },
    { to: "/admin/attendance", label: "Attendance", icon: CalendarDays },
    { to: "/admin/classes", label: "Online Classes", icon: Video },
    { to: "/admin/payments", label: "Payments", icon: Wallet },
    { to: "/admin/courses", label: "Courses", icon: BookOpen },
    { to: "/admin/certificates", label: "Certificates", icon: Award },
    { to: "/admin/feedback", label: "Feedback", icon: BarChart3 },
//     {to: "/admin/mail-logs", label: "Mail Logs",
//   icon: Mail,
// },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  ],
  teacher: [
    { to: "/teacher", label: "Overview", icon: LayoutDashboard },
    { to: "/teacher/classes", label: "My Classes", icon: Video },
    { to: "/teacher/students", label: "Students", icon: GraduationCap },
    { to: "/teacher/attendance", label: "Attendance", icon: CalendarDays },
    { to: "/teacher/grades", label: "My Attendance", icon: CalendarDays },
    { to: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/teacher/certificates", label: "Certificates", icon: Award },
    { to: "/teacher/feedback", label: "Feedback", icon: BarChart3 },
    { to: "/teacher/schedule", label: "Schedule", icon: CalendarDays },
  ],
  student: [
  { to: "/student", label: "Overview", icon: LayoutDashboard },
  { to: "/student/classes", label: "Classes", icon: Video },
  { to: "/student/progress", label: "Progress", icon: Award },

  // ✅ FIXED
  { to: "/student/notificationassignments", label: "Assignments", icon: ClipboardList },

  { to: "/student/payments", label: "Payments", icon: Wallet },
  { to: "/student/attendance", label: "Attendance", icon: CalendarDays },
  { to: "/student/certificates", label: "Certificates", icon: Award },

  // ✅ ADD PROFILE MENU
  { to: "/student/profile", label: "Profile", icon: Users },
],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "https://marcylmsdeploy-2.onrender.com/api/notifications"
        );
        setNotifications(res.data || []);
      } catch (err) {
        console.log("Notification fetch error:", err);
      }
    };

    fetchNotifications();
  }, []);

  if (!user) return null;

  const items = navByRole[user.role] || [];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-background">

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-sidebar transition-transform lg:static ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-16 items-center border-b px-5">
          <Logo />
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  active ? "bg-gold-soft font-medium" : ""
                }`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

      <div
  className="absolute bottom-0 p-3 w-full border-t cursor-pointer"
>
  <ProfileCard
    user={user}
    token={localStorage.getItem("token") || ""}
  />
</div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col">

        {/* HEADER */}
        <header className="flex h-16 items-center border-b px-4">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden">
            <Menu />
          </button>

          <div className="ml-auto flex items-center gap-2">

            {/* THEME */}
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
              {dark ? <Sun /> : <Moon />}
            </Button>

            {/* NOTIFICATIONS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell />
                  {unread > 0 && (
                    <span className="absolute h-2 w-2 bg-gold rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                  <div className="p-3 text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem key={n._id}>
                      <div>
                        <div className="font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.message}</div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* SETTINGS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {/* CONTENT */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6"
        >
          <Outlet />
        </motion.main>

      </div>
    </div>
  );
}