import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Lock,
  CheckCircle2,
  Award,
  CreditCard,
  Crown,
} from "lucide-react";

import axios from "axios";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  PageHeader,
  LevelBadge,
} from "@/components/dashboard/Primitives";

import { useAuth } from "@/store/auth";

const levelOrder = [
  "Basic",
  "Intermediate",
  "Advanced",
];

function StudentProgress() {

  const user =
    useAuth((s) => s.user);

  const [courses, setCourses] =
    useState<any[]>([]);

  const [openPayment, setOpenPayment] =
    useState(false);

  const [selectedLevel, setSelectedLevel] =
    useState("");

  const [selectedCourse, setSelectedCourse] =
    useState<any>(null);

  // ===================================
  // FETCH COURSES
  // ===================================

  useEffect(() => {

    const fetchCourses =
      async () => {

        try {

          const res =
            await axios.get(
              "https://marcylmsdeploy.onrender.com/api/courses"
            );

          setCourses(
            res.data
          );

        } catch (err) {

          console.log(err);

        }

      };

    fetchCourses();

  }, []);

  // ===================================
  // LOAD RAZORPAY
  // ===================================

  useEffect(() => {

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(
      script
    );

  }, []);

  // ===================================
  // CURRENT COURSE
  // ===================================

  const currentCourse =
    courses.find(
      (c: any) =>
        c._id === user?.course
    );

  // ===================================
  // LEVELS
  // ===================================

  const levels =
    levelOrder.map(
      (level) => {

        const sameLevelCourses =
          courses.filter(
            (c: any) =>

              c.name ===
                currentCourse?.name &&

              c.mainLevel ===
                level
          );

        const totalFee =
          sameLevelCourses.reduce(
            (
              sum: number,
              item: any
            ) =>
              sum +
              Number(
                item.fee || 0
              ),

            0
          );

        // =========================
        // UNLOCK LOGIC
        // =========================

        const unlocked =
          user?.unlockedLevels?.includes(
            level
          ) || false;

        const completed =
          user?.completedLevels?.includes(
            level
          ) || false;

        return {

          l: level,

          courses:
            sameLevelCourses,

          totalFee,

          unlocked,

          completed,

        };

      }
    );

  // ===================================
  // OPEN PAYMENT
  // ===================================

  const handleUnlock =
    (
      level: string,
      levelCourses: any[],
      totalFee: number
    ) => {

      setSelectedLevel(
        level
      );

      setSelectedCourse({

        courses:
          levelCourses,

        totalFee,

      });

      setOpenPayment(
        true
      );

    };

  // ===================================
  // PAYMENT
  // ===================================

  const handleRazorpayPayment =
    async () => {

      try {

        // =========================
        // CREATE ORDER
        // =========================

        const { data } =
          await axios.post(
            "https://marcylmsdeploy.onrender.com/api/payments/create-order",
            {

              amount:
                selectedCourse?.totalFee,

            }
          );

        const order =
          data.order;

        // =========================
        // RAZORPAY OPTIONS
        // =========================

        const options = {

          key:
            import.meta.env
              .VITE_RAZORPAY_KEY,

          amount:
            order.amount,

          currency:
            order.currency,

          name:
            "Marcy LMS",

          description:
            `${selectedLevel} Level Unlock`,

          order_id:
            order.id,

          handler:
            async function (
              response: any
            ) {

              try {

                // =========================
                // VERIFY PAYMENT
                // =========================

                await axios.post(
                  "https://marcylmsdeploy.onrender.com/api/payments/verify",
                  {

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,

                    userId:
                      user?.id,

                    level:
                      selectedLevel,

                    amount:
                      selectedCourse?.totalFee,

                  }
                );

                // =========================
                // SUCCESS
                // =========================

                alert(
                  `${selectedLevel} unlocked successfully`
                );

                setOpenPayment(
                  false
                );

                // =========================
                // REDIRECT
                // =========================

                window.location.href =
                  "/student/classes";

              } catch (err) {

                console.log(err);

                alert(
                  "Verification failed"
                );

              }

            },

          prefill: {

            name:
              user?.name,

            email:
              user?.email,

            contact:
              user?.phone,

          },

          theme: {

            color:
              "#C8A45D",

          },

        };

        const razorpay =
          new (
            window as any
          ).Razorpay(
            options
          );

        razorpay.open();

      } catch (err) {

        console.log(err);

        alert(
          "Payment failed"
        );

      }

    };

  return (

    <div>

      <PageHeader
        title="My Progress"
        subtitle="Track your learning journey"
      />

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

            {user?.selectedLevel ||
              "Locked"}

          </Badge>

        </div>

      </div>

      {/* LEVELS */}

      <div className="grid gap-6 lg:grid-cols-3">

        {levels.map(
          (m, i) => (

            <motion.div
              key={m.l}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  i * 0.1,
              }}
            >

              <Card
                className={`h-full transition-all ${
                  m.completed
                    ? "border-green-500 bg-green-50"
                    : m.unlocked
                    ? "border-gold bg-gold-soft/20"
                    : "opacity-70"
                }`}
              >

                <CardContent className="p-6">

                  {/* TOP */}

                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft">

                      {m.completed ? (

                        <CheckCircle2 className="h-5 w-5 text-green-600" />

                      ) : m.unlocked ? (

                        <Award className="h-5 w-5 text-gold" />

                      ) : (

                        <Lock className="h-5 w-5 text-muted-foreground" />

                      )}

                    </div>

                    <LevelBadge
                      level={m.l}
                    />

                  </div>

                  {/* TITLE */}

                  <div className="mt-4">

                    <div className="font-display text-2xl">

                      {m.l}

                    </div>

                    <div className="text-xs text-muted-foreground">

                      {m.completed
                        ? "Completed"
                        : m.unlocked
                        ? "Unlocked"
                        : "Locked"}

                    </div>

                  </div>

                  {/* GRADES */}

                  <div className="mt-5 space-y-3">

                    {m.courses.map(
                      (c: any) => (

                        <div
                          key={c._id}
                          className="rounded-xl border p-3"
                        >

                          <div className="flex items-center justify-between">

                            <div>

                              <div className="font-medium">
                                {c.grade}
                              </div>

                              <div className="mt-1 text-xs text-muted-foreground">
                                ₹{c.fee}
                              </div>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* TOTAL */}

                  <div className="mt-5 rounded-xl bg-muted/40 p-4">

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="text-sm text-muted-foreground">
                          Total Fee
                        </div>

                        <div className="text-2xl font-bold">
                          ₹{m.totalFee}
                        </div>

                      </div>

                      {m.completed ? (

                        <Badge className="bg-green-600 text-white">
                          Completed
                        </Badge>

                      ) : m.unlocked ? (

                        <Badge className="bg-gold text-gold-foreground">
                          Active
                        </Badge>

                      ) : (

                        <Button
                          className="bg-gold text-gold-foreground"
                          onClick={() =>
                            handleUnlock(
                              m.l,
                              m.courses,
                              m.totalFee
                            )
                          }
                        >

                          Unlock

                        </Button>

                      )}

                    </div>

                  </div>

                </CardContent>

              </Card>

            </motion.div>

          )
        )}

      </div>

      {/* PAYMENT MODAL */}

      {openPayment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            {/* TOP */}

            <div className="flex items-center justify-between">

              <div>

                <div className="text-2xl font-bold">

                  Unlock {selectedLevel}

                </div>

                <div className="text-sm text-muted-foreground">

                  Full level access

                </div>

              </div>

              <button
                onClick={() =>
                  setOpenPayment(
                    false
                  )
                }
              >
                ✕
              </button>

            </div>

            {/* INCLUDED GRADES */}

            <div className="mt-6 rounded-2xl border p-5">

              <div className="mb-3 font-semibold">

                Included Grades

              </div>

              <div className="space-y-2">

                {selectedCourse?.courses?.map(
                  (item: any) => (

                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >

                      <span>
                        {item.grade}
                      </span>

                      <span>
                        ₹{item.fee}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* TOTAL */}

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-muted/30 p-5">

              <div>

                <div className="font-semibold">
                  Total Fee
                </div>

                <div className="text-sm text-muted-foreground">
                  One time payment
                </div>

              </div>

              <div className="text-3xl font-bold text-gold">

                ₹{selectedCourse?.totalFee}

              </div>

            </div>

            {/* PAYMENT */}

            <div className="mt-6">

              <Button
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                onClick={
                  handleRazorpayPayment
                }
              >

                <CreditCard className="mr-2 h-4 w-4" />

                Pay with Razorpay

              </Button>

            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">

              Secure payment powered by Razorpay

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default StudentProgress;