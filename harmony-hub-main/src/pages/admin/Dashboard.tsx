import { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  Users,
  GraduationCap,
  Video,
  Award,
  Clock,
  BookOpen,
  TrendingUp,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

const API = "https://marcylmsdeploy-2.onrender.com/api";

export default function AdminOverview() {
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalTeachers: 0,
    liveClasses: 0,
    pendingCertificates: 0,
    pendingPayments: 0,
    totalCourses: 0,
    monthRevenue: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/admin/dashboard`);
        setRecentPayments((res.data.recentPayments || []).slice(0, 5));
        setDashboard({
          totalRevenue: res.data.totalRevenue || 0,
          totalStudents: res.data.totalStudents || 0,
          totalTeachers: res.data.totalTeachers || 0,
          liveClasses: res.data.liveClasses || 0,
          pendingCertificates: res.data.pendingCertificates || 0,
          pendingPayments: res.data.pendingPayments || 0,
          totalCourses: res.data.totalCourses || 0,
          monthRevenue: res.data.monthRevenue || 0,
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of academy performance and activity
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Primary KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Revenue"
            value={`₹${dashboard.totalRevenue.toLocaleString()}`}
            icon={<Wallet size={18} />}
            accent="text-emerald-600"
          />
          <KpiCard
            label="Students"
            value={dashboard.totalStudents}
            icon={<Users size={18} />}
            accent="text-indigo-600"
          />
          <KpiCard
            label="Teachers"
            value={dashboard.totalTeachers}
            icon={<GraduationCap size={18} />}
            accent="text-violet-600"
          />
          <KpiCard
            label="Live Classes"
            value={dashboard.liveClasses}
            icon={<Video size={18} />}
            accent="text-rose-600"
          />
        </section>

        {/* Secondary KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCard
            label="Pending Certificates"
            value={dashboard.pendingCertificates}
            icon={<Award size={16} />}
            tone="amber"
          />
          {/* <MiniCard
            label="Pending Payments"
            value={dashboard.pendingPayments}
            icon={<Clock size={16} />}
            tone="orange"
          /> */}
          <MiniCard
            label="Active Courses"
            value={dashboard.totalCourses}
            icon={<BookOpen size={16} />}
            tone="sky"
          />
          <MiniCard
            label="Monthly Revenue"
            value={`₹${dashboard.monthRevenue.toLocaleString()}`}
            icon={<TrendingUp size={16} />}
            tone="emerald"
          />
        </section>

        {/* Recent payments */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Payments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest transactions across the academy
              </p>
            </div>
            
          </header>

          {recentPayments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-slate-500">No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Course</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPayments.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
                            {p.student?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-slate-900">
                            {p.student?.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {p.course?.grade || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">
                        ₹{Number(p.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function KpiCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <span className={`${accent}`}>{icon}</span>
      </div>
      <div className="text-2xl font-semibold text-slate-900 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function MiniCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone: "amber" | "orange" | "sky" | "emerald";
}) {
  const tones: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
      <div
        className={`h-10 w-10 rounded-lg border flex items-center justify-center ${tones[tone]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="text-lg font-semibold text-slate-900 tabular-nums truncate">
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const styles =
    s === "approved" || s === "paid" || s === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "pending"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : s === "rejected" || s === "failed"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles}`}
    >
      {status || "unknown"}
    </span>
  );
}
