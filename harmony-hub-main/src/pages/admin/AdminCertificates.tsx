import { useEffect, useState } from "react";

import axios from "axios";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  CheckCircle2,
  Loader2,
} from "lucide-react";

const API =
  "https://your-api.com/api";

export default function
AdminCertificates() {

  const [
    certs,
    setCerts,
  ] = useState<any[]>([]);

  const [
    loadingId,
    setLoadingId,
  ] = useState("");

  // =========================
  // FETCH PENDING
  // =========================

  useEffect(() => {

    fetchPending();

  }, []);

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

  // =========================
  // APPROVE
  // =========================

  const approveCertificate =
    async (
      id: string
    ) => {

      try {

        setLoadingId(id);

        await axios.put(
          `${API}/certificates/approve/${id}`
        );

        alert(
          "Certificate Approved"
        );

        fetchPending();

      } catch (err) {

        console.log(err);

      } finally {

        setLoadingId("");

      }
    };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Pending Certificates
      </h1>

      <div className="grid gap-4">

        {certs.map(
          (cert) => (

            <Card
              key={cert._id}
            >

              <CardContent
                className="p-5 flex items-center justify-between"
              >

                <div>

                  <h2 className="font-semibold text-lg">
                    {cert.studentName}
                  </h2>

                  <p className="text-sm">
                    {cert.course}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {cert.level}
                  </p>

                </div>

                <Button
                  onClick={() =>
                    approveCertificate(
                      cert._id
                    )
                  }
                >

                  {loadingId ===
                  cert._id ? (

                    <Loader2 className="w-4 h-4 animate-spin" />

                  ) : (

                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </>

                  )}

                </Button>

              </CardContent>

            </Card>

          )
        )}

      </div>

    </div>
  );
}