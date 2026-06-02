import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Award,
  Search,
  Clock3,
  Eye,
  Loader2,
  FileCheck,
  Inbox,
  Calendar,
  BookOpen,
} from "lucide-react";

const API = "https://marcylmsdeploy-2.onrender.com/api";

export default function AdminCertificates() {
  const [pendingCerts, setPendingCerts] = useState<any[]>([]);
  const [approvedCerts, setApprovedCerts] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"pending" | "approved">("pending");

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${API}/certificates/pending`);
      setPendingCerts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchApproved = async () => {
    try {
      const res = await axios.get(`${API}/certificates/approved`);
      setApprovedCerts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchApproved();
  }, []);

  const approve = async (id: string) => {
    try {
      setLoadingId(id);
      const res = await axios.put(`${API}/certificates/approve/${id}`);
      setPendingCerts((prev) => prev.filter((item) => item._id !== id));
      if (res.data?.certificate) {
        setApprovedCerts((prev) => [res.data.certificate, ...prev]);
      }
    } catch (err) {
      console.log(err);
      alert("PDF generation failed");
    } finally {
      setLoadingId("");
    }
  };

  const filterFn = (item: any) =>
    item.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    item.course?.toLowerCase().includes(search.toLowerCase());

  const filteredPending = pendingCerts.filter(filterFn);
  const filteredApproved = approvedCerts.filter(filterFn);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      {/* <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
              <Award className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 leading-tight">
                Certificates
              </h1>
              <p className="text-xs text-slate-500">Admin dashboard</p>
            </div>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Certificate approvals
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review pending requests and manage issued certificates.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Pending"
            value={pendingCerts.length}
            icon={<Clock3 size={18} />}
            tone="amber"
          />
          <StatCard
            label="Approved"
            value={approvedCerts.length}
            icon={<CheckCircle2 size={18} />}
            tone="emerald"
          />
          <StatCard
            label="Total processed"
            value={pendingCerts.length + approvedCerts.length}
            icon={<FileCheck size={18} />}
            tone="slate"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1">
            <TabButton
              active={tab === "pending"}
              onClick={() => setTab("pending")}
              count={pendingCerts.length}
            >
              Pending
            </TabButton>
            <TabButton
              active={tab === "approved"}
              onClick={() => setTab("approved")}
              count={approvedCerts.length}
            >
              Approved
            </TabButton>
          </div>

          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by student or course…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
            />
          </div>
        </div>

        {/* Lists */}
        {tab === "pending" ? (
          filteredPending.length === 0 ? (
            <EmptyState
              icon={<Inbox size={28} />}
              title="No pending certificates"
              description="All caught up. New requests will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPending.map((cert) => (
                <PendingCard
                  key={cert._id}
                  cert={cert}
                  loading={loadingId === cert._id}
                  onApprove={() => approve(cert._id)}
                />
              ))}
            </div>
          )
        ) : filteredApproved.length === 0 ? (
          <EmptyState
            icon={<Award size={28} />}
            title="No approved certificates"
            description="Approved certificates will be listed here."
          />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApproved.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-medium">
                          {cert.studentName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="font-medium text-slate-900">
                          {cert.studentName}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{cert.course}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                        <CheckCircle2 size={12} />
                        Approved
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-md px-3 py-1.5 transition"
                      >
                        <Eye size={14} />
                        View PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "amber" | "emerald" | "slate";
}) {
  const tones = {
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tones[tone]}`}>
        {icon}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition flex items-center gap-2 ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
      <span
        className={`text-xs px-1.5 py-0.5 rounded ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function PendingCard({
  cert,
  loading,
  onApprove,
}: {
  cert: any;
  loading: boolean;
  onApprove: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {cert.studentName?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {cert.studentName}
              </h3>
              <p className="text-xs text-slate-500">Certificate request</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium shrink-0">
            <Clock3 size={12} />
            Pending
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <Row icon={<BookOpen size={14} />} label="Course" value={cert.course} />
        {cert.level && (
          <Row icon={<Award size={14} />} label="Level" value={cert.level} />
        )}
        {cert.completionDate && (
          <Row
            icon={<Calendar size={14} />}
            label="Completed"
            value={cert.completionDate}
          />
        )}

        {cert.previewImage && (
          <img
            src={cert.previewImage}
            alt=""
            className="w-full h-auto object-cover rounded-lg border border-slate-200 mt-2"
          />
        )}

        <button
          onClick={onApprove}
          disabled={loading}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating PDF…
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Approve certificate
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="inline-flex items-center gap-2 text-slate-500">
        {icon}
        {label}
      </span>
      <span className="font-medium text-slate-900 truncate ml-3">{value}</span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-xl py-16 text-center">
      <div className="h-12 w-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );
}
