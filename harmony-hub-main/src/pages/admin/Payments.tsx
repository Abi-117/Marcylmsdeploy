import { useEffect, useState } from "react";

import {
  PageHeader,
  StatCard,
} from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";

type Payment = {

  _id: string;

  invoice: string;

  studentName: string;

  level: string;

  amount: number;

  status: "Paid" | "Pending" | "Failed";

  date: string;
  invoiceUrl?: string;
};

function AdminPayments() {

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH PAYMENTS
  // =========================

  const fetchPayments = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/payments"
      );

      const data = await response.json();

      setPayments(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchPayments();

  }, []);

  // =========================
  // TOTALS
  // =========================

  const total = payments.reduce(
    (a, p) => a + p.amount,
    0
  );

  const paid = payments
    .filter((p) => p.status === "Paid")
    .reduce((a, p) => a + p.amount, 0);

  const pending = payments
    .filter((p) => p.status === "Pending")
    .reduce((a, p) => a + p.amount, 0);

  return (
    <div>

      <PageHeader
        title="Payments"
        subtitle="Transactions, invoices and outstanding balances"
      />

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard
          label="Total billed"
          value={`₹${(
            total / 1000
          ).toFixed(1)}k`}
          icon={Wallet}
          accent
        />

        <StatCard
          label="Collected"
          value={`₹${(
            paid / 1000
          ).toFixed(1)}k`}
          icon={CheckCircle2}
        />

        <StatCard
          label="Outstanding"
          value={`₹${(
            pending / 1000
          ).toFixed(1)}k`}
          icon={AlertCircle}
        />

      </div>

      {/* TABLE */}

      <Card className="mt-6">

        <CardContent className="p-0">

          {loading ? (

            <div className="p-10 text-center text-muted-foreground">
              Loading payments...
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">

                  <tr>

                    <th className="px-5 py-3">
                      Invoice
                    </th>

                    <th className="px-5 py-3">
                      Student
                    </th>

                    <th className="px-5 py-3">
                      Level
                    </th>

                    <th className="px-5 py-3">
                      Amount
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3">
                      Date
                    </th>

                    <th />

                  </tr>

                </thead>

                <tbody>

                  {payments.map((p) => (

                    <tr
                      key={p._id}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >

                      <td className="px-5 py-3.5 font-mono text-xs">

                        {p.invoice}

                      </td>

                      <td className="px-5 py-3.5">

                        {p.studentName}

                      </td>

                      <td className="px-5 py-3.5">

                        {p.level}

                      </td>

                      <td className="px-5 py-3.5 font-medium">

                        ₹{p.amount.toLocaleString()}

                      </td>

                      <td className="px-5 py-3.5">

                        <Badge
                          variant="outline"
                          className={
                            p.status === "Paid"
                              ? "bg-gold-soft border-gold/30 text-gold-foreground"
                              : p.status ===
                                "Pending"
                              ? "bg-muted"
                              : "bg-destructive/10 border-destructive/30 text-destructive"
                          }
                        >

                          {p.status}

                        </Badge>

                      </td>

                      <td className="px-5 py-3.5 text-muted-foreground">

                        {p.date}

                      </td>

                      <td className="px-5 py-3.5">

                        <Button
  variant="ghost"
  size="sm"
  onClick={() => {
    if (!p.invoiceUrl) {
      alert("Invoice not available");
      return;
    }

    window.open(p.invoiceUrl, "_blank");
  }}
>
  <Download className="h-3.5 w-3.5" />
</Button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </CardContent>

      </Card>
    </div>
  );
}

export default AdminPayments;