import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const API =
  "http://localhost:5000/api";

export default function
AdminCertificatePreview() {

  const [
    certs,
    setCerts,
  ] = useState<any[]>([]);

  useEffect(() => {

    fetchPending();

  }, []);

  const fetchPending =
    async () => {

      const res =
        await axios.get(
          `${API}/certificates/pending`
        );

      setCerts(
        res.data
      );
    };

  const approve =
    async (
      id: string
    ) => {

      await axios.put(
        `${API}/certificates/approve/${id}`
      );

      alert(
        "Approved"
      );

      fetchPending();
    };

  return (

    <div className="p-10 grid gap-10">

      {certs.map(
        (cert) => (

          <div
            key={cert._id}
            className="border rounded-lg p-5"
          >

            <img
              src={
                cert.previewImage
              }
              alt=""
              className="w-full rounded-lg border"
            />

            <button
              onClick={() =>
                approve(
                  cert._id
                )
              }
              className="bg-green-600 text-white px-5 py-3 mt-5"
            >
              Approve
            </button>

          </div>

        )
      )}

    </div>
  );
}