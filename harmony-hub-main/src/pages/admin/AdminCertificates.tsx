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
  Filter,
  Clock3,
} from "lucide-react";

const API =
  "http://localhost:5000/api";

export default function AdminCertificatePreview() {



 const [
  certs,
  setCerts,
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
  // FETCH
  // =========================

  const fetchPending =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/certificates/pending`
          );

        setCerts(
          res.data
        );

      } catch (err) {

        console.log(err);

      }
    };

  useEffect(() => {

    fetchPending();

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

        await axios.put(
          `${API}/certificates/approve/${id}`
        );

        setCerts(
          (prev) =>
            prev.filter(
              (item) =>
                item._id !== id
            )
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoadingId("");

      }
    };

  // =========================
  // FILTER
  // =========================

  const filtered =
    certs.filter(
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

    <div className="min-h-screen bg-[#f3f6fb] p-5 md:p-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

        <div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-800">

            Certificate Requests

          </h1>

          <p className="text-slate-500 mt-3 text-lg">

            Manage & approve student certificates

          </p>

        </div>

        {/* STATS */}

        <div className="bg-white px-6 py-4 rounded-3xl shadow-lg border border-slate-200 flex items-center gap-4">

          <div className="bg-indigo-100 p-4 rounded-2xl">

            <Award
              className="text-indigo-600"
              size={28}
            />

          </div>

          <div>

            <p className="text-slate-500 text-sm font-semibold">

              Pending Requests

            </p>

            <h2 className="text-3xl font-black text-slate-800">

              {certs.length}

            </h2>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-200 mb-10 flex items-center gap-4">

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
          className="w-full outline-none text-lg bg-transparent"
        />

        <button className="bg-slate-100 p-3 rounded-2xl">

          <Filter
            className="text-slate-600"
            size={22}
          />

        </button>

      </div>

      {/* EMPTY */}

      {filtered.length === 0 && (

        <div className="bg-white rounded-[35px] p-20 text-center shadow-lg border border-slate-200">

          <Award
            size={80}
            className="mx-auto text-indigo-500 mb-6"
          />

          <h2 className="text-4xl font-black text-slate-800">

            No Pending Requests

          </h2>

          <p className="text-slate-500 text-lg mt-4">

            All certificates are approved

          </p>

        </div>

      )}

      {/* CARDS */}

      <div className="grid xl:grid-cols-2 2xl:grid-cols-3 gap-8">

        {filtered.map(
          (cert) => (

            <div
              key={cert._id}
              className="bg-white rounded-[35px] overflow-hidden shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300"
            >

              {/* TOP */}

              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">

                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between mb-6">

                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-lg">

                      <Award size={30} />

                    </div>

                    <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-lg flex items-center gap-2">

                      <Clock3 size={16} />

                      Pending

                    </div>

                  </div>

                  <h2 className="text-3xl font-black">

                    {cert.studentName}

                  </h2>

                  <p className="text-white/80 mt-2">

                    Certificate Request
                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="p-6 space-y-5">

                {/* COURSE */}

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

                  <div className="flex items-center gap-3 mb-3">

                    <div className="bg-cyan-100 p-3 rounded-xl">

                      <GraduationCap
                        className="text-cyan-600"
                        size={20}
                      />

                    </div>

                    <p className="text-slate-500 font-semibold">

                      Course
                    </p>

                  </div>

                  <h3 className="text-2xl font-black text-slate-800">

                    {cert.course}

                  </h3>

                </div>

                {/* LEVEL */}

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

                    <p className="text-slate-500 font-semibold mb-2">

                      Level
                    </p>

                    <h3 className="text-xl font-black text-slate-800">

                      {cert.level}
                    </h3>

                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

                    <p className="text-slate-500 font-semibold mb-2">

                      Duration
                    </p>

                    <h3 className="text-xl font-black text-slate-800">

                      {cert.duration}
                    </h3>

                  </div>

                </div>

                {/* DATE */}

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">

                  <div className="flex items-center gap-3 mb-3">

                    <div className="bg-green-100 p-3 rounded-xl">

                      <Calendar
                        className="text-green-600"
                        size={20}
                      />

                    </div>

                    <p className="text-slate-500 font-semibold">

                      Completion Date
                    </p>

                  </div>

                  <h3 className="text-xl font-black text-slate-800">

                    {cert.completionDate}
                  </h3>

                </div>

              </div>

              {/* BUTTON */}

              <div className="p-6 pt-0">

                <button
                  onClick={() =>
                    approve(
                      cert._id
                    )
                  }
                  disabled={
                    loadingId === cert._id
                  }
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white py-5 rounded-2xl text-xl font-black shadow-lg flex items-center justify-center gap-3"
                >

                  {loadingId === cert._id ? (

                    <>
                      Generating PDF...
                    </>

                  ) : (

                    <>
                      <CheckCircle2 size={26} />

                      Approve Certificate
                    </>

                  )}

                </button>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}