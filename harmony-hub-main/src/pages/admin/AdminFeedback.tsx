import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

const API = "https://marcylmsdeploy-2.onrender.com/api";

export default function AdminFeedback() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/feedback/all`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      {data.map((f: any) => (
        <Card key={f._id} className="rounded-xl">
          <CardContent className="p-4 space-y-2">

            <div className="font-semibold">
              Student: {f.studentId?.name} ({f.studentId?.email})
            </div>

            <div className="text-sm">
              Teacher: {f.teacherId?.name}
            </div>

            <div className="text-muted-foreground">
              {f.message}
            </div>

            <div className="text-xs text-gray-400">
              {new Date(f.createdAt).toLocaleString()}
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}