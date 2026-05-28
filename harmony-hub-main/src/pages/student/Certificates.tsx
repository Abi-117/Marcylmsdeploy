import { useEffect, useState } from "react";

import axios from "axios";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Award,
  Download,
} from "lucide-react";

const API =
  "https://your-api.com/api";

export default function
StudentCertificates() {

  const [
    certs,
    setCerts,
  ] = useState<any[]>([]);

  // =========================
  // GET USER
  // =========================

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      ) || "{}"
    );

  // =========================
  // FETCH CERTIFICATES
  // =========================

  useEffect(() => {

    fetchCertificates();

  }, []);

  const fetchCertificates =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/certificates/student/${user._id}`
          );

        setCerts(
          res.data
        );

      } catch (err) {

        console.log(err);

      }
    };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        My Certificates
      </h1>

      <div className="grid gap-4">

        {certs.length === 0 && (

          <Card>

            <CardContent className="p-10 text-center">

              <Award className="mx-auto mb-4 w-10 h-10" />

              <p>
                No certificates yet
              </p>

            </CardContent>

          </Card>

        )}

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
                    {cert.course}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {cert.level}
                  </p>

                  <p className="text-sm">
                    {cert.completionDate}
                  </p>

                </div>

                <a
                  href={
                    cert.pdfUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >

                  <Button>

                    <Download className="w-4 h-4 mr-2" />

                    Download

                  </Button>

                </a>

              </CardContent>

            </Card>

          )
        )}

      </div>

    </div>
  );
}