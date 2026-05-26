// ================================
// FRONTEND - Certificates Page
// ================================

import { useEffect, useState } from "react";
import axios from "axios";
import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/store/auth";

type Certificate = {
  _id: string;
  title: string;
  course: string;
  level: string;
  date: string;
  earned: boolean;
  fileUrl?: string;
};

export default function Certificates() {
  const { user } = useAuth();

  const [certificates, setCertificates] = useState<
    Certificate[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [downloadingId, setDownloadingId] =
    useState<string | null>(null);

  // ============================
  // FETCH CERTIFICATES
  // ============================

  const fetchCertificates = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `/api/student/certificates/${user._id}`
      );

      setCertificates(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user?._id]);

  // ============================
  // DOWNLOAD PDF
  // ============================

  const handleDownload = async (
    cert: Certificate
  ) => {
    if (!cert.fileUrl) return;

    try {
      setDownloadingId(cert._id);

      const res = await fetch(cert.fileUrl);

      const blob = await res.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `${cert.title}.pdf`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Certificates"
        subtitle="Your earned certificates"
      />

      {loading ? (
        <p>Loading...</p>
      ) : certificates.length === 0 ? (
        <p>No certificates found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <Card
              key={cert._id}
              className="hover:shadow-md transition"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />

                    <div>
                      <h2 className="font-semibold">
                        {cert.title}
                      </h2>

                      <p className="text-xs text-gray-500">
                        {cert.course}
                      </p>
                    </div>
                  </div>

                  {cert.earned ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <span className="text-xs text-gray-400">
                      Locked
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Level : {cert.level}
                </div>

                <div className="text-xs text-gray-400">
                  Completed : {cert.date}
                </div>

                <Button
                  className="w-full"
                  disabled={
                    !cert.earned || !cert.fileUrl
                  }
                  onClick={() =>
                    handleDownload(cert)
                  }
                >
                  <Download className="w-4 h-4 mr-2" />

                  {downloadingId === cert._id
                    ? "Downloading..."
                    : "Download Certificate"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}