import { useEffect, useState } from "react";

import axios from "axios";

import { format } from "date-fns";

import {
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/store/auth";

import { PageHeader } from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

type Payment = {
  _id: string;

  amount: number;

  status: "Paid" | "Failed";

  paymentId: string;

  orderId: string;

  createdAt: string;

  course?: {
    name: string;
    grade: string;
    mainLevel: string;
  };
};

function PaymentHistory() {

  const user =
    useAuth((s) => s.user);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // FETCH PAYMENTS
  // =====================================

  useEffect(() => {

    const fetchPayments =
      async () => {

        try {

          const res =
            await axios.get(
              `https://marcylmsdeploy-2.onrender.com/api/payments/history/${user?._id}`
            );

          setPayments(
            res.data || []
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }

      };

    if (user?._id) {

      fetchPayments();

    }

  }, [user?._id]);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="p-6 text-muted-foreground">

        Loading payment history...

      </div>

    );

  }

  // =====================================
  // UI
  // =====================================

  return (

    <div>

      <PageHeader
        title="Payment History"
        subtitle="All your transactions"
      />

      {payments.length === 0 ? (

        <div className="rounded-xl border p-6 text-muted-foreground">

          No payments found

        </div>

      ) : (

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {payments.map((p) => (

            <Card key={p._id}>

              <CardContent className="p-5">

                {/* STATUS */}

                <div className="flex items-center justify-between">

                  <Badge
                    className={
                      p.status === "Paid"
                        ? "bg-green-600 text-white"
                        : "bg-red-500 text-white"
                    }
                  >

                    {p.status === "Paid" ? (

                      <CheckCircle2 className="mr-1 h-3 w-3" />

                    ) : (

                      <XCircle className="mr-1 h-3 w-3" />

                    )}

                    {p.status}

                  </Badge>

                  <CreditCard className="h-4 w-4 text-muted-foreground" />

                </div>

                {/* COURSE */}

                <div className="mt-4 text-lg font-bold">

                  {p.course?.grade || "Course"}

                </div>

                <div className="text-sm text-muted-foreground">

                  {p.course?.name}

                </div>

                {/* AMOUNT */}

                <div className="mt-4 text-2xl font-bold">

                  ₹{p.amount}

                </div>

                {/* PAYMENT ID */}

                <div className="mt-3 text-xs text-muted-foreground break-all">

                  Payment ID: {p.paymentId || "-"}

                </div>

                {/* ORDER ID */}

                <div className="mt-1 text-xs text-muted-foreground break-all">

                  Order ID: {p.orderId || "-"}

                </div>

                {/* DATE */}

                <div className="mt-3 text-xs text-muted-foreground">

                  {format(
                    new Date(p.createdAt),
                    "dd MMM yyyy · hh:mm a"
                  )}

                </div>

                {/* DOWNLOAD */}

                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://marcylmsdeploy-2.onrender.com/api/payments/invoice/${p._id}`,
                      "_blank"
                    )
                  }
                >

                  Download Invoice

                </Button>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>

  );

}

export default PaymentHistory;