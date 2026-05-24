// src/pages/ResetPassword.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Password reset successful");

      navigate("/");
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

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-gold" />

            <h1 className="font-display text-3xl font-semibold">
              Reset Password
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email, OTP and new password.
          </p>

          <div className="mt-6 space-y-5">

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email Address</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  name="email"
                  placeholder="admin@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* OTP */}
            <div className="space-y-2">
              <Label>OTP</Label>

              <Input
                type="text"
                name="otp"
                placeholder="Enter 6 digit OTP"
                value={formData.otp}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>New Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {loading ? "Please wait..." : "Reset Password"}
            </Button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;