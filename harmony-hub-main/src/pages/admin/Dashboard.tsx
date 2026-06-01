import { useEffect, useState } from "react";
import axios from "axios";

import {
  Wallet,
  Users,
  GraduationCap,
  Video,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const API = "https://marcylmsdeploy-2.onrender.com/api";

export default function AdminOverview() {
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalTeachers: 0,
    liveClasses: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/admin/dashboard`);

setRecentPayments(
  (res.data.recentPayments || []).slice(0, 3)
);
      setDashboard({
        totalRevenue: res.data.totalRevenue || 0,
        totalStudents: res.data.totalStudents || 0,
        totalTeachers: res.data.totalTeachers || 0,
        liveClasses: res.data.liveClasses || 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">

      {/* TITLE */}
      <div className="mb-8">
        <h1 className="text-4xl font-black">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">
          Manage academy overview, payments & reminders
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Revenue */}
        <Card className="rounded-3xl shadow-lg border-1">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm">Total Revenue</p>
            <h2 className="text-3xl font-black mt-2">
              ₹{dashboard.totalRevenue}
            </h2>
          </CardContent>
        </Card>

        {/* Students */}
        <Card className="rounded-3xl shadow-lg border-1">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm">Students</p>
            <h2 className="text-3xl font-black mt-2">
              {dashboard.totalStudents}
            </h2>
          </CardContent>
        </Card>

        {/* Teachers */}
        <Card className="rounded-3xl shadow-lg border-1">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm">Teachers</p>
            <h2 className="text-3xl font-black mt-2">
              {dashboard.totalTeachers}
            </h2>
          </CardContent>
        </Card>

        {/* Live Classes */}
        <Card className="rounded-3xl shadow-lg border-1">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm">Live Classes</p>
            <h2 className="text-3xl font-black mt-2">
              {dashboard.liveClasses}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* RECENT PAYMENTS (OUTSIDE GRID — FIXED) */}
      <Card className="mt-8 rounded-3xl shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-black">
            Recent Payments
          </CardTitle>
        </CardHeader>

        <CardContent>
          {recentPayments.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No Payments Found
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div
                  key={p._id}
                  className="border rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">
                      {p.student?.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {p.course?.grade}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="font-bold">₹{p.amount}</div>
                    <Badge>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}