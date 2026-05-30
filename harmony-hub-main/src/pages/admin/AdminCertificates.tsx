import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  CheckCircle2,
  GraduationCap,
  Calendar,
  Award,
  Search,
  Clock3,
  FileText,
  Eye,
} from "lucide-react";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function AdminCertificates() {

  // =========================
  // STATES
  // =========================

  const [
    pendingCerts,
    setPendingCerts,
  ] = useState<any[]>([]);

  const [
    approvedCerts,
    setApprovedCerts,
  ] = useState<any[]>([]);

  const [
    loadingId,
    setLoadingId,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  // =========================
  // FETCH PENDING
  // =========================

  const fetchPending =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/certificates/pending`
          );

        setPendingCerts(
          res.data
        );

      } catch (err) {

        console.log(err);

      }
    };

  // =========================
  // FETCH APPROVED
  // =========================

  const fetchApproved =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/certificates/approved`
          );

        setApprovedCerts(
          res.data
        );

      } catch (err) {

        console.log(err);

      }
    };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    fetchPending();

    fetchApproved();

  }, []);

  // =========================
  // APPROVE
  // =========================

  const approve =
    async (
      id: string
    ) => {

      try {

        setLoadingId(id);

        const res =
          await axios.put(
            `${API}/certificates/approve/${id}`
          );

        // REMOVE FROM PENDING

        setPendingCerts(
          (prev) =>
            prev.filter(
              (item) =>
                item._id !== id
            )
        );

        // ADD TO APPROVED

       if (res.data?.certificate) {
  setApprovedCerts((prev) => [
    res.data.certificate,
    ...prev,
  ]);
}

      } catch (err) {

        console.log(err);

        alert(
          "PDF generation failed"
        );

      } finally {

        setLoadingId("");

      }
    };

  // =========================
  // SEARCH FILTER
  // =========================

  const filteredPending =
    pendingCerts.filter(
      (item) =>

        item.studentName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.course
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <div className="min-h-screen bg-[#eef2ff] p-5 md:p-10">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-5xl font-black text-slate-800">

            Certificate Dashboard

          </h1>

          <p className="text-slate-500 mt-3 text-lg">

            Manage student certificate approvals

          </p>

        </div>

        {/* STATS */}

        <div className="flex gap-5 flex-wrap">

          <div className="bg-white px-6 py-5 rounded-3xl shadow-xl border border-slate-200 min-w-[220px]">

            <div className="flex items-center gap-4">

              <div className="bg-orange-100 p-4 rounded-2xl">

                <Clock3
                  className="text-orange-600"
                  size={28}
                />

              </div>

              <div>

                <p className="text-slate-500 font-semibold">

                  Pending

                </p>

                <h2 className="text-4xl font-black text-slate-800">

                  {pendingCerts.length}

                </h2>

              </div>

            </div>

          </div>

          <div className="bg-white px-6 py-5 rounded-3xl shadow-xl border border-slate-200 min-w-[220px]">

            <div className="flex items-center gap-4">

              <div className="bg-green-100 p-4 rounded-2xl">

                <Award
                  className="text-green-600"
                  size={28}
                />

              </div>

              <div>

                <p className="text-slate-500 font-semibold">

                  Approved

                </p>

                <h2 className="text-4xl font-black text-slate-800">

                  {approvedCerts.length}

                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-200 flex items-center gap-4 mb-10">

        <div className="bg-slate-100 p-3 rounded-2xl">

          <Search
            className="text-slate-500"
            size={22}
          />

        </div>

        <input
          type="text"
          placeholder="Search student or course..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full outline-none bg-transparent text-lg"
        />

      </div>

      {/* PENDING */}

      <div className="mb-14">

        <div className="flex items-center gap-3 mb-8">

          <Clock3
            className="text-orange-500"
            size={28}
          />

          <h2 className="text-3xl font-black text-slate-800">

            Pending Requests

          </h2>

        </div>

        {filteredPending.length === 0 ? (

          <div className="bg-white rounded-[35px] p-16 text-center shadow-xl border border-slate-200">

            <Award
              size={70}
              className="mx-auto text-indigo-500 mb-5"
            />

            <h2 className="text-4xl font-black text-slate-800">

              No Pending Certificates

            </h2>

          </div>

        ) : (

          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 gap-8">

            {filteredPending.map(
              (cert) => (

                <div
                  key={cert._id}
                  className="bg-white rounded-[35px] overflow-hidden shadow-xl border border-slate-200"
                >

                  {/* TOP */}

                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">

                    <div className="flex justify-between items-start">

                      <div>

                        <h2 className="text-3xl font-black">

                          {cert.studentName}

                        </h2>

                        <p className="text-white/80 mt-2">

                          Certificate Request

                        </p>

                      </div>

                      <div className="bg-white/20 p-4 rounded-2xl">

                        <Award size={28} />

                      </div>

                    </div>

                  </div>

                  {/* BODY */}

                  <div className="p-6 space-y-5">

                    <div className="bg-slate-50 p-5 rounded-2xl border">

                      <h3 className="text-2xl font-black text-slate-800">

                        {cert.course}

                      </h3>

                      <p className="text-slate-500 mt-2">

                        {cert.level}
                      </p>

                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border">

                      <p className="text-slate-500 mb-2">

                        Completion Date

                      </p>

                      <h3 className="font-bold text-slate-800">

                        {cert.completionDate}

                      </h3>

                    </div>

                    {cert.previewImage && (

                      <img
                        src={cert.previewImage}
                        alt=""
                        className="w-full h-[240px] object-cover rounded-2xl border"
                      />

                    )}

                    <button
                      onClick={() =>
                        approve(
                          cert._id
                        )
                      }
                      disabled={
                        loadingId === cert._id
                      }
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-2xl text-xl font-black shadow-lg"
                    >

                      {loadingId === cert._id
                        ? "Generating PDF..."
                        : "Approve Certificate"}

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* APPROVED */}

      <div>

        <div className="flex items-center gap-3 mb-8">

          <CheckCircle2
            className="text-green-500"
            size={28}
          />

          <h2 className="text-3xl font-black text-slate-800">

            Approved Certificates

          </h2>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {approvedCerts.map(
            (cert) => (

              <div
                key={cert._id}
                className="bg-white rounded-3xl p-6 shadow-xl border"
              >

                <h3 className="text-2xl font-black text-slate-800">

                  {cert.studentName}

                </h3>

                <p className="text-slate-500 mt-2">

                  {cert.course}
                </p>

                <div className="mt-5">

                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all duration-300"
                  >

                    <Eye size={22} />

                    View PDF

                  </a>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}