import { useEffect, useState } from "react";
import axios from "axios";

const API =
  "https://marcylmsdeploy-2.onrender.com/api/admin";

export default function MailLogs() {

  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {

      const { data } =
        await axios.get(
          `${API}/mail-logs`
        );

      setLogs(data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Mail Reminders
        </h1>

        <p className="text-muted-foreground">
          View all reminder emails sent to students
        </p>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-muted/50">

                <th className="p-4 text-left">
                  Student
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Type
                </th>

                <th className="p-4 text-left">
                  Subject
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Sent At
                </th>

              </tr>

            </thead>

            <tbody>

              {logs.map((log: any) => (

                <tr
                  key={log._id}
                  className="border-b hover:bg-muted/30"
                >

                  <td className="p-4 font-medium">
                    {log.student?.name}
                  </td>

                  <td className="p-4">
                    {log.email}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        log.type ===
                        "payment-reminder"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {log.type}
                    </span>

                  </td>

                  <td className="p-4">
                    {log.subject}
                  </td>

                  <td className="p-4">

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {log.status}
                    </span>

                  </td>

                  <td className="p-4">

                    {new Date(
                      log.sentAt
                    ).toLocaleString()}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}