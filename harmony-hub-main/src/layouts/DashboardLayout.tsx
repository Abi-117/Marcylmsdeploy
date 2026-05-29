import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, CalendarDays, Wallet, Bell, Settings,
  LogOut, BookOpen, Award, BarChart3, Video, ClipboardList,
  Search, Sun, Moon, Menu,
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
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  ],
  teacher: [
    { to: "/teacher", label: "Overview", icon: LayoutDashboard },
    { to: "/teacher/classes", label: "My Classes", icon: Video },
    { to: "/teacher/students", label: "Students", icon: GraduationCap },
    { to: "/teacher/attendance", label: "Attendance", icon: CalendarDays },
    { to: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/teacher/certificates", label: "Certificates", icon: Award },
  ],
  student: [
    { to: "/student", label: "Overview", icon: LayoutDashboard },
    { to: "/student/classes", label: "Classes", icon: Video },
    { to: "/student/progress", label: "Progress", icon: Award },
    { to: "/student/payments", label: "Payments", icon: Wallet },
    { to: "/student/attendance", label: "Attendance", icon: CalendarDays },
    { to: "/student/certificates", label: "Certificates", icon: Award },
  ],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ REAL NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ✅ FETCH NOTIFICATIONS FROM BACKEND
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
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b px-5">
          <Logo />
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-gold-soft font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* USER */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {user.name
                  ?.split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.role}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background px-4">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input className="pl-9" placeholder="Search..." />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* DARK MODE */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun /> : <Moon />}
            </Button>

            {/* NOTIFICATIONS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute h-2 w-2 rounded-full bg-gold" />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem
                      key={n._id}
                      className="flex flex-col items-start"
                    >
                      <div className="flex w-full justify-between">
                        <span className="font-medium">{n.title}</span>
                        {!n.read && (
                          <Badge className="h-2 w-2 rounded-full p-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {n.message}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* SETTINGS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
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