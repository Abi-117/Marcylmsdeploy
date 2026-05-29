// src/pages/ForgotPassword.tsx

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/auth/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      navigate("/reset-password");

    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl"
      >

        <Logo />

        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />

          Back
        </button>

        <div className="mt-8">

          <h1 className="font-display text-3xl font-semibold">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your registered email address.
          </p>

          <div className="mt-6 space-y-5">

            {/* EMAIL */}
            <div className="space-y-2">

              <Label>Email Address</Label>

              <div className="relative">

                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  placeholder="admin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />

              </div>
            </div>

            {/* BUTTON */}
            <Button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>

          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default ForgotPassword;