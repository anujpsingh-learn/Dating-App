"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, GraduationCap, ArrowRight, ShieldCheck, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { validateUniversityEmail, getAllowedDomains } from "@/lib/domain-validator";
import { useCampus } from "@/lib/campus-store";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useCampus();
  const [email, setEmail] = useState("");
  const [consentDpdp, setConsentDpdp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const allowed = getAllowedDomains();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email domain
    const validation = validateUniversityEmail(email);
    if (!validation.isValid) {
      setError(validation.error || "Please provide a valid university email.");
      return;
    }

    if (!consentDpdp) {
      setError("Please accept the DPDP Privacy Notice & Terms to proceed.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithEmail(email);
      setIsLoading(false);
      if (res.success) {
        // Store pending email for verification screen
        if (typeof window !== "undefined") {
          sessionStorage.setItem("vibe_pending_email", email);
        }
        router.push("/auth/verify");
      } else {
        setError(res.message);
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 rounded-3xl border border-primary/20 bg-card shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl vibe-gradient flex items-center justify-center text-white mx-auto shadow-md shadow-primary/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground font-display">
            Sign In with University Email
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter your official student email address. We’ll send you a one-time verification code (OTP).
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Student Email Address"
            type="email"
            placeholder="e.g. yourname@lpu.in"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            helperText={`Allowed domains: ${allowed.map((d) => "@" + d).join(", ")}`}
            required
          />

          {/* DPDP Act 2023 Consent Checkbox */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-2 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentDpdp}
                onChange={(e) => {
                  setConsentDpdp(e.target.checked);
                  if (error) setError(null);
                }}
                className="mt-0.5 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-foreground leading-snug">
                I agree to the{" "}
                <Link href="/terms" className="text-primary underline font-semibold">
                  Terms of Community Use
                </Link>{" "}
                and consent to data processing under the{" "}
                <Link href="/privacy" className="text-primary underline font-semibold">
                  DPDP Act 2023 Privacy Policy
                </Link>
                . My contact details will remain private until I accept a connection.
              </span>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
            <span>Send Verification OTP</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-2 border-t border-border/80 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Lock className="w-3.5 h-3.5 text-secondary" />
          <span>Strictly no spam or romantic solicitation permitted.</span>
        </div>
      </Card>
    </div>
  );
}
