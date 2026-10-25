"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCampus } from "@/lib/campus-store";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, currentUser } = useCampus();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string>("your student email");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("vibe_pending_email");
      if (stored) setEmail(stored);
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    const valid = await verifyOtp(otp);
    setIsLoading(false);

    if (valid) {
      // If user hasn't completed onboarding, route to /onboarding, else /discover
      if (currentUser && currentUser.onboarding_step < 4) {
        router.push("/onboarding");
      } else {
        router.push("/discover");
      }
    } else {
      setError("Invalid or expired code. Please enter 123456 or request a new code.");
    }
  };

  return (
    <div className="relative min-h-[88vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Campus Scene */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920"
          alt="University campus background"
          className="w-full h-full object-cover object-center opacity-30 dark:opacity-20 scale-105 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      <Card className="w-full max-w-md p-8 rounded-3xl border border-primary/30 glass-panel shadow-2xl space-y-6 relative">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change email</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground font-display">
            Verify Your Email
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We sent a 6-digit code to <strong className="text-foreground">{email}</strong>.
          </p>
        </div>

        {/* Demo Hint Banner */}
        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary text-center">
          💡 Demo Mode: Enter any 6 digits (e.g. <strong>123456</strong>) to verify instantly.
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              6-Digit One-Time Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setOtp(val);
                if (error) setError(null);
              }}
              className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold h-14 rounded-2xl border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="vibe"
            size="lg"
            isLoading={isLoading}
            className="w-full gap-2 font-bold"
          >
            <span>Verify & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-1">
            {resendTimer > 0 ? (
              <span>Resend code in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={() => setResendTimer(45)}
                className="text-primary font-semibold hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
