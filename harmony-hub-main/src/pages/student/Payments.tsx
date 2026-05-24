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

  level: string;

  status: "Paid" | "Failed";

  paymentId: string;

  orderId: string;

  createdAt: string;
};

function PaymentHistory() {

  const user =
    useAuth((s) => s.user);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchPayments =
      async () => {

        try {

          const res =
            await axios.get(
              `https://marcylmsdeploy.onrender.com/api/payments/history/${user?.id}`
            );

          setPayments(
            res.data
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }

      };

    if (user?.id) {

      fetchPayments();

    }

  }, [user?.id]);

  if (loading) {

    return (

      <div className="p-6 text-muted-foreground">

        Loading payment history...

      </div>

    );

  }

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
  <Card key={p.paymentId}>

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

                {/* LEVEL */}

                <div className="mt-4 text-lg font-bold">

                  {p.level} Level

                </div>

                {/* AMOUNT */}

                <div className="text-sm text-muted-foreground">

                  ₹{p.amount}

                </div>

                {/* PAYMENT ID */}

                <div className="mt-2 text-xs text-muted-foreground break-all">

                  Payment ID: {p.paymentId}

                </div>

                {/* ORDER ID */}

                <div className="mt-1 text-xs text-muted-foreground break-all">

                  Order ID: {p.orderId}

                </div>

                {/* DATE */}

                <div className="mt-2 text-xs text-muted-foreground">

                  {format(
                    new Date(
                      p.createdAt
                    ),
                    "dd MMM yyyy · hh:mm a"
                  )}

                </div>

                {/* DOWNLOAD */}

                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://marcylmsdeploy.onrender.com/api/payments/invoice/${p.paymentId}`,
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