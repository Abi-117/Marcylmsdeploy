import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function
StudentCertificates() {

  const [
    certs,
    setCerts,
  ] = useState<any[]>([]);

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      ) || "{}"
    );

  // =========================
  // FETCH CERTIFICATES
  // =========================

  const fetchCertificates =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/certificates/student/${user._id}`
          );

        setCerts(
          res.data.certs || []
        );

      } catch (err) {

        console.log(err);

      }
    };

  useEffect(() => {

    if (user?._id) {

      fetchCertificates();

    }

  }, []);

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      <h1 className="text-4xl font-black mb-8">

        My Certificates

      </h1>

      {certs.length === 0 ? (

        <div className="bg-white rounded-3xl p-10 text-center">

          <h2 className="text-2xl font-bold">

            No Certificates Yet

          </h2>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {certs.map(
            (cert) => (

              <div
                key={cert._id}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >

                <h2 className="text-2xl font-black">

                  {cert.course}

                </h2>

                <p className="mt-2 text-slate-500">

                  {cert.level}
                </p>

                <p className="mt-2 text-slate-500">

                  {cert.completionDate}
                </p>

                <a
                  href={cert.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-6
                    inline-block
                    bg-indigo-600
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    font-bold
                  "
                >
                  View Certificate
                </a>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}
