
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  BookOpen,
  CheckCircle2,
  PlayCircle,
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
} from "@/components/dashboard/Primitives";

import { useAuth } from "@/store/auth";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

function StudentProgress() {

  const user =
    useAuth((s) => s.user);
    const isGroupStudent = user?.classType === "Group";

  const [courses, setCourses] =
    useState<any[]>([]);

  const [payments, setPayments] =
    useState<any[]>([]);

  const [openPayment, setOpenPayment] =
    useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState<any>(null);



  const [country, setCountry] =
  useState("India");
  // const [country, setCountry] =
  // useState("United States");

useEffect(() => {
  axios
    .get("https://ipapi.co/json/")
    .then((res) => {
      setCountry(
        res.data.country_name || "India"
      );
    })
    .catch(() => {
      setCountry("India");
    });
}, []);


  // =====================================
  // FETCH COURSES + PAYMENTS
  // =====================================

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      // COURSES
      const courseRes =
        await axios.get(
          `${API}/courses`
        );

      setCourses(
        courseRes.data || []
      );

      // PAYMENTS
      if (user?._id) {

        const paymentRes =
          await axios.get(
            `${API}/payments/student/${user._id}`
          );

        setPayments(
          paymentRes.data || []
        );

      }

    } catch (err) {

      console.log(err);

    }

  };

  // =====================================
  // LOAD RAZORPAY
  // =====================================

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

  // =====================================
  // CURRENT COURSE
  // =====================================

  const currentCourse =
    courses.find(
      (c: any) =>
        c._id === user?.course
    );

  // =====================================
  // ALL GRADES
  // =====================================

  const gradeCourses =
    courses.filter(
      (c: any) =>
        c.name ===
        currentCourse?.name
    );

  // =====================================
  // CHECK PAYMENT
  // =====================================

  const isPaid =
    (courseId: string) => {

      return payments.some(
        (p: any) =>
          String(
            p.course?._id ||
            p.course
          ) === String(courseId)
      );

    };

  // =====================================
  // FIND ACTIVE COURSE
  // =====================================

 const latestPaid =
  payments.length > 0
    ? payments[0]
    : null;

  // =====================================
  // OPEN PAYMENT
  // =====================================

  const handlePay =
    (course: any) => {

      setSelectedCourse(
        course
      );

      setOpenPayment(
        true
      );

    };

  // =====================================
  // PAYMENT
  // =====================================

  const handleRazorpayPayment =
    async () => {

      try {

        if (
          !selectedCourse
        ) return;

        // CREATE ORDER
        const { data } =
          await axios.post(
            `${API}/payments/create-order`,
            {
              amount:
                selectedCourse.fee,
            }
          );

        const order =
          data.order;

        const options = {

          key:
            import.meta.env
              .VITE_RAZORPAY_KEY,

          amount:
            order.amount,

          currency:
            order.currency,

          name:
            "Marcys Academy",

          description:
            `${selectedCourse.grade} Payment`,

          order_id:
            order.id,

          handler:
            async function (
              response: any
            ) {

              try {

                await axios.post(`${API}/payments/verify`, {
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
  userId: user?._id,
  courseId: selectedCourse._id,
  amount: selectedCourse.fee,
  level: selectedCourse.mainLevel,
  classType: user?.classType,
});

                alert(
  user?.classType === "Group"
    ? "Payment Successful.\nYou have been added to the Group Batch waiting list."
    : "Payment Successful.\nAdmin will assign your teacher and schedule soon."
);
                localStorage.removeItem("ms-auth");
                window.location.reload();

                setOpenPayment(
                  false
                );

                fetchData();

              } catch (err: any) {

                console.log(err);

                alert(
                  err?.response?.data
                    ?.message ||
                    "Verification failed"
                );

              }

            },

          prefill: {

            name:
              user?.name,

            email:
              user?.email,

          },

          theme: {

            color:
              "#C8A45D",

          },

        };

        const razorpay =
          new (
            window as any
          ).Razorpay(options);

        razorpay.open();

      } catch (err) {

        console.log(err);

        alert(
          "Payment failed"
        );

      }

    };


    const handlePaypalPayment = async () => {

  try {

    const { data } =
      await axios.post(
  `${API}/payments/paypal/create-order`,
  {
    amount: selectedCourse.fee,
    classType: user?.classType,
  }
);

    window.location.href =
      data.approvalUrl;

  } catch (err) {

    console.log(err);

    alert("PayPal payment failed");

  }

};

  return (

    <div>

      <PageHeader
        title="My Progress"
        subtitle="Track your learning journey"
      />

      {/* COURSE HEADER */}

      <div className="mb-8 rounded-2xl border bg-card p-6">

        <div className="flex items-center justify-between">

          <div>

            <div className="text-sm text-muted-foreground">

              Current Course

            </div>

            <div className="mt-1 text-3xl font-bold">

              {currentCourse?.name || "-"}

            </div>

          </div>

          <BookOpen className="h-8 w-8 text-gold" />

        </div>

      </div>

      {/* COURSES */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {gradeCourses.map(
          (course: any) => {

            const paid =
              isPaid(
                course._id
              );

            const active =
              latestPaid &&
              String(
                latestPaid.course?._id ||
                latestPaid.course
              ) ===
                String(
                  course._id
                );

            return (

              <motion.div
                key={course._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >

                <Card
                  className={`h-full transition-all ${
                    paid
                      ? "border-green-500 bg-green-50"
                      : active
                      ? "border-gold bg-gold-soft/20"
                      : ""
                  }`}
                >

                  <CardContent className="p-6">

                    {/* ICON */}

                    <div className="flex items-center justify-between">

                      <div>

                        {paid ? (

                          <CheckCircle2 className="h-7 w-7 text-green-600" />

                        ) : active ? (

                          <PlayCircle className="h-7 w-7 text-gold" />

                        ) : (

                          <Lock className="h-7 w-7 text-muted-foreground" />

                        )}

                      </div>

                      <Badge variant="outline">

                        {
                          course.mainLevel
                        }

                      </Badge>

                    </div>

                    {/* TITLE */}

                    <div className="mt-5">

                      <div className="text-2xl font-bold">

                        {
                          course.grade
                        }

                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">

                        {
                          course.name
                        }

                      </div>

                    </div>

                    {/* PRICE */}

                    <div className="mt-6 text-3xl font-bold">

                      ₹
                      {
                        course.fee
                      }

                    </div>

                    {/* STATUS */}

                    <div className="mt-2 text-sm text-muted-foreground">

                      {paid
                        ? "Payment completed"

                        : "Purchase to unlock"}

                    </div>

                    {/* BUTTON */}

                    <div className="mt-6">

                      {paid ? (

                        <Button
                          disabled
                          className="w-full bg-green-600 text-white"
                        >

                          Paid

                        </Button>

                      ) : (

                        <Button
                          onClick={() =>
                            handlePay(
                              course
                            )
                          }
                          className="w-full bg-black text-white"
                        >

                          Pay Now

                        </Button>

                      )}

                    </div>

                  </CardContent>

                </Card>

              </motion.div>

            );

          }
        )}

      </div>

      {/* PAYMENT MODAL */}

      {openPayment &&
        selectedCourse && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-6">

              <div className="text-2xl font-bold">

                Pay {
                  selectedCourse.grade
                }

              </div>

              <div className="mt-2 text-sm text-muted-foreground">
  {user?.classType === "Group"
    ? "Complete payment to reserve your seat in the group batch."
    : "Complete payment to book your individual one-to-one class."}
</div>

<div className="mt-6 rounded-xl border p-4 space-y-3">

  <div className="flex items-center justify-between">
    <span className="font-medium">
      Course
    </span>

    <span>
      {selectedCourse.grade}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="font-medium">
      Class Type
    </span>

    <Badge>
      {user?.classType}
    </Badge>
  </div>

  {user?.classType === "Group" ? (
    <>
      <div className="flex items-center justify-between">
        <span>Maximum Students</span>

        <span>
          {selectedCourse.maxStudents}
        </span>
      </div>

      <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        ✔ You will be added to a Group Batch after payment.
        <br />
        ✔ Admin will assign the batch, teacher and meeting link.
      </div>
    </>
  ) : (
    <>
      <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        ✔ One-to-One Live Classes
        <br />
        ✔ Personal Teacher
        <br />
        ✔ Flexible Schedule
        <br />
        ✔ Admin will assign your teacher and class timing after payment.
      </div>
    </>
  )}

  <div className="flex items-center justify-between border-t pt-3">
    <span className="font-semibold">
      Monthly Fee
    </span>

    <span className="text-xl font-bold">
      ₹{selectedCourse.fee}
    </span>
  </div>

</div>

              {country === "India" ? (

  <Button
    onClick={handleRazorpayPayment}
    className="mt-6 w-full bg-gold text-black"
  >
    Pay with Razorpay
  </Button>

) : (

 <Button
  onClick={handlePaypalPayment}
  className="mt-6 w-full bg-blue-600 text-white"
>
  Pay with PayPal
</Button>

)}


              <Button
                variant="outline"
                onClick={() =>
                  setOpenPayment(
                    false
                  )
                }
                className="mt-3 w-full"
              >

                Cancel

              </Button>

            </div>

          </div>

        )}

    </div>

  );

}

export default StudentProgress;

