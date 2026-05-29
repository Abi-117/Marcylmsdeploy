import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Award } from "lucide-react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, LevelBadge } from "@/components/dashboard/Primitives";
import { useAuth } from "@/store/auth";

const levelOrder = ["Basic", "Intermediate", "Advanced"];

function StudentProgress() {
  const user = useAuth((s) => s.user);

  const [courses, setCourses] = useState<any[]>([]);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "https://marcylmsdeploy-2.onrender.com/api/courses"
        );
        setCourses(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourses();
  }, []);

  // ================= RAZORPAY SCRIPT =================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ================= CURRENT COURSE =================
  const currentCourse = courses.find(
    (c: any) => c._id === user?.course
  );

  // ================= LEVELS (NO TOTAL SUM) =================
  const levels = levelOrder.map((level) => {
    const levelCourses = courses.filter(
      (c: any) =>
        c.name === currentCourse?.name &&
        c.mainLevel === level
    );

    return {
      l: level,
      courses: levelCourses,
      unlocked: user?.unlockedLevels?.includes(level),
      completed: user?.completedLevels?.includes(level),
    };
  });

  // ================= OPEN PAYMENT =================
  const handlePay = (level: string, course: any) => {
    setSelectedLevel(level);
    setSelectedCourse(course);
    setOpenPayment(true);
  };

  // ================= RAZORPAY PAYMENT =================
  const handleRazorpayPayment = async () => {
    try {
      if (!selectedCourse?.fee) {
        alert("Invalid payment data");
        return;
      }

      const { data } = await axios.post(
        "https://marcylmsdeploy-2.onrender.com/api/payments/create-order",
        {
          amount: selectedCourse.fee,
        }
      );

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Marcy LMS",
        description: `${selectedCourse.grade} Payment`,
        order_id: order.id,

        handler: async function (response: any) {
          try {
            await axios.post(
              "https://marcylmsdeploy-2.onrender.com/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?._id,
                level: selectedLevel,
                courseId: selectedCourse._id,
                amount: selectedCourse.fee,
              }
            );

            alert("Payment successful");
            setOpenPayment(false);
            window.location.href = "/student/classes";
          } catch (err) {
            console.log(err);
            alert("Verification failed");
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },

        theme: {
          color: "#C8A45D",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  return (
    <div>
      <PageHeader title="My Progress" subtitle="Track your learning journey" />

      {/* CURRENT COURSE */}
      <div className="mb-6 rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              Current Course
            </div>
            <div className="mt-1 text-2xl font-bold">
              {currentCourse?.name || "-"}
            </div>
          </div>

          <Badge className="bg-gold text-gold-foreground">
            {user?.selectedLevel || "Locked"}
          </Badge>
        </div>
      </div>

      {/* LEVELS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {levels.map((m) => (
          <motion.div
            key={m.l}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className={`h-full ${
                m.completed
                  ? "border-green-500 bg-green-50"
                  : m.unlocked
                  ? "border-gold bg-gold-soft/20"
                  : "opacity-70"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div>
                    {m.completed ? (
                      <CheckCircle2 />
                    ) : m.unlocked ? (
                      <Award />
                    ) : (
                      <Lock />
                    )}
                  </div>

                  <LevelBadge level={m.l} />
                </div>

                <div className="mt-4 font-bold text-xl">{m.l}</div>

                {/* GRADES LIST */}
                <div className="mt-5 space-y-3">
                  {m.courses?.map((c: any) => (
                    <div
                      key={c._id}
                      className="border p-3 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{c.grade}</div>
                        <div className="text-sm text-gray-500">
                          ₹{c.fee}
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePay(m.l, c)}
                      >
                        Pay
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* PAYMENT MODAL */}
      {openPayment && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-xl font-bold">
              Pay {selectedCourse.grade}
            </h2>

            <div className="mt-4 flex justify-between">
              <span>{selectedCourse.grade}</span>
              <span>₹{selectedCourse.fee}</span>
            </div>

            <div className="mt-5 font-bold text-xl">
              ₹{selectedCourse.fee}
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleRazorpayPayment}
            >
              Pay with Razorpay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProgress;