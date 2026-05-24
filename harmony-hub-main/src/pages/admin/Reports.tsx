import { useEffect, useState } from "react";

import { PageHeader } from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const COLORS = [

  "oklch(0.72 0.13 78)",
  "oklch(0.16 0.01 60)",
  "oklch(0.6 0.08 70)",
  "oklch(0.82 0.1 80)",
  "oklch(0.4 0.05 60)",
  "oklch(0.5 0.1 75)",

];

type CourseType = {

  name: string;

  students: number;
};

type RevenueType = {

  month: string;

  students: number;
};

function AdminReports() {

  const [courses, setCourses] =
    useState<CourseType[]>([]);

  const [revenueData, setRevenueData] =
    useState<RevenueType[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH REPORT DATA
  // =========================

  const fetchReports = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/reports"
      );

      const data = await response.json();

      setCourses(data.courses);

      setRevenueData(
        data.revenueData
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchReports();

  }, []);

  const pieData =
    courses.slice(0, 6).map((c) => ({

      name: c.name,

      value: c.students,

    }));

  return (
    <div>

      <PageHeader
        title="Reports & insights"
        subtitle="Deep analytics across the academy"
      />

      {loading ? (

        <div className="mt-10 text-center text-muted-foreground">
          Loading reports...
        </div>

      ) : (

        <div className="grid gap-6 lg:grid-cols-2">

          {/* PIE CHART */}

          <Card>

            <CardContent className="p-6">

              <div className="mb-4 font-display text-lg">

                Enrolment by course

              </div>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >

                    {pieData.map((_, i) => (

                      <Cell
                        key={i}
                        fill={
                          COLORS[
                            i % COLORS.length
                          ]
                        }
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">

                {pieData.map((d, i) => (

                  <div
                    key={d.name}
                    className="flex items-center gap-1.5"
                  >

                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{
                        background:
                          COLORS[
                            i % COLORS.length
                          ],
                      }}
                    />

                    {d.name}

                  </div>
                ))}

              </div>

            </CardContent>

          </Card>

          {/* BAR CHART */}

          <Card>

            <CardContent className="p-6">

              <div className="mb-4 font-display text-lg">

                Student growth

              </div>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={revenueData}
                >

                  <CartesianGrid
                    stroke="oklch(0.9 0.01 80)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    stroke="oklch(0.5 0.015 70)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="oklch(0.5 0.015 70)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="students"
                    fill="oklch(0.72 0.13 78)"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </div>
      )}
    </div>
  );
}

export default AdminReports;