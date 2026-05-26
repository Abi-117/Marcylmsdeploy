import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, CalendarDays, Wallet, Bell, Settings,
  LogOut, Music2, BookOpen, Award, BarChart3, Video, ClipboardList, Trophy,
  Search, Sun, Moon, Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { notifications } from "@/mock-data";

const navByRole: Record<Role, { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/students", label: "Students", icon: GraduationCap },
    { to: "/admin/teachers", label: "Teachers", icon: Users },
    {to: '/admin/attendance', label: "Attendance", icon: CalendarDays},
    // { to: "/admin/batches", label: "Batches", icon: BookOpen },
    { to: "/admin/classes", label: "Online Classes", icon: Video },
    { to: "/admin/payments", label: "Payments", icon: Wallet },
    // { to: "/admin/events", label: "Events", icon: Trophy },
    { to: "/admin/courses", label: "Courses", icon: BookOpen },
    { to: "/admin/feedback", label: "Feedback", icon: BarChart3 },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  ],
  teacher: [
    { to: "/teacher", label: "Overview", icon: LayoutDashboard },
    { to: "/teacher/classes", label: "My Classes", icon: Video },
    { to: "/teacher/students", label: "Students", icon: GraduationCap },
    { to: "/teacher/attendance", label: "Attendance", icon: CalendarDays },
    { to: "/teacher/grades", label: "Teacher Attendance", icon: Award },
    { to: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
    // { to: "/teacher/assignmentreviews", label: "Assignment Reviews", icon: BarChart3 },
    { to: "/teacher/feedback", label: "Feedback", icon: BarChart3 },
    { to: "/teacher/schedule", label: "Schedule", icon: CalendarDays },
  ],
  student: [
    { to: "/student", label: "Overview", icon: LayoutDashboard },
    { to: "/student/classes", label: "Classes", icon: Video },
    // { to: "/student/practice", label: "Practice", icon: Music2 },
    { to: "/student/progress", label: "Progress", icon: Award },
    { to: "/student/Notificationassignments", label: "Assignments", icon: ClipboardList },
    // { to: "/student/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/student/payments", label: "Payments", icon: Wallet },
    { to: '/student/attendance', label: "Attendance", icon: CalendarDays },
    { to: "/student/feedback", label: "Feedback", icon: BarChart3 },
    { to: "/student/certificates", label: "Certificates", icon: Trophy },
  ],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (!user) return null;
  const items = navByRole[user.role] || [];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo />
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== `/${user.role}` && pathname.startsWith(item.to));
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${active ? "bg-gold-soft text-gold-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
                <item.icon className={`h-4 w-4 ${active ? "text-gold" : ""}`} />
                {item.label}
                {active && <motion.div layoutId="sidebar-active" className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar className="h-9 w-9 ring-1 ring-gold/40">
              <AvatarFallback className="bg-gold-soft text-gold-foreground text-xs font-semibold">
                {user?.name
  ? user.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs capitalize text-muted-foreground">{user.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students, classes, batches…" className="pl-9 bg-muted/50" />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground md:inline-flex">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium">{n.title}</span>
                      {!n.read && <Badge className="h-1.5 w-1.5 rounded-full bg-gold p-0" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{n.message}</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-4 sm:p-6 lg:p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
