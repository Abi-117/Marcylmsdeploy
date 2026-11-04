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
  currency?: "INR" | "USD";
  status: "Paid" | "Pending" | "Failed";
  date: string;
  createdAt?: string;
  invoiceUrl?: string;
  paymentId: string;
  paymentGateway?: string;
  paymentCountry?: string;
  student?: {
    name?: string;
  };
  course?: {
    grade?: string;
  };
};

const API = "https://marcylmsdeploy-2.onrender.com/api";

const formatCurrency = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH PAYMENTS
  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API}/payments`);

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      console.log("PAYMENTS:", data);

      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Payments fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // SEPARATE INR AND USD PAYMENTS
  const inrPayments = payments.filter(
    (p) => (p.currency || "INR") === "INR"
  );

  const usdPayments = payments.filter(
    (p) => p.currency === "USD"
  );

  // TOTAL BILLED
  const totalINR = inrPayments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const totalUSD = usdPayments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  // COLLECTED
  const paidINR = inrPayments
    .filter((p) => p.status?.toLowerCase() === "paid")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const paidUSD = usdPayments
    .filter((p) => p.status?.toLowerCase() === "paid")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // OUTSTANDING
  const pendingINR = inrPayments
    .filter((p) => p.status?.toLowerCase() === "pending")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pendingUSD = usdPayments
    .filter((p) => p.status?.toLowerCase() === "pending")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Transactions, invoices and outstanding balances"
      />

      {/* REVENUE STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Billed (INR)"
          value={formatCurrency(totalINR, "INR")}
          icon={Wallet}
          accent
        />

        <StatCard
          label="Total Billed (USD)"
          value={formatCurrency(totalUSD, "USD")}
          icon={Wallet}
        />

        <StatCard
          label="Collected (INR)"
          value={formatCurrency(paidINR, "INR")}
          icon={CheckCircle2}
        />

        <StatCard
          label="Collected (USD)"
          value={formatCurrency(paidUSD, "USD")}
          icon={CheckCircle2}
        />

        <StatCard
          label="Outstanding (INR)"
          value={formatCurrency(pendingINR, "INR")}
          icon={AlertCircle}
        />

        <StatCard
          label="Outstanding (USD)"
          value={formatCurrency(pendingUSD, "USD")}
          icon={AlertCircle}
        />
      </div>

      {/* PAYMENTS TABLE */}
      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Level</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Gateway</th>
                    <th className="px-5 py-3">Country</th>
                    <th className="px-5 py-3">Invoice</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs">
                        INV-{p._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="px-5 py-3.5">
                        {p.student?.name || p.studentName || "Unknown"}
                      </td>

                      <td className="px-5 py-3.5">
                        {p.level || p.course?.grade || "-"}
                      </td>

                      <td className="px-5 py-3.5 font-medium">
                        {formatCurrency(
                          p.amount,
                          p.currency || "INR"
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge
                          variant="outline"
                          className={
                            p.status?.toLowerCase() === "paid"
                              ? "bg-gold-soft border-gold/30 text-gold-foreground"
                              : p.status?.toLowerCase() === "pending"
                              ? "bg-muted"
                              : "bg-destructive/10 border-destructive/30 text-destructive"
                          }
                        >
                          {p.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5 text-muted-foreground">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : p.date
                          ? new Date(p.date).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge
                          variant="outline"
                          className={
                            p.paymentGateway?.toLowerCase() === "paypal"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {p.paymentGateway || "Razorpay"}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5">
                        {p.paymentCountry || "India"}
                      </td>

                      <td className="px-5 py-3.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(
                              `${API}/payments/invoice/${p._id}`,
                              "_blank"
                            );
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