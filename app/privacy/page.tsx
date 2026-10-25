import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2 border-b border-border/80 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">
          Privacy Policy (DPDP Act 2023 Compliant)
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Last updated: October 2026 • Formatted in accordance with India’s Digital Personal Data Protection Act, 2023.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <Card className="p-6 rounded-3xl border border-secondary/30 bg-secondary/5 space-y-2">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-secondary" />
            <span>Summary of Key Commitments</span>
          </h3>
          <p>
            Vibe Check collects minimal digital personal data strictly to help university students discover and connect with peers for academic, project, hobby, and sports collaboration. <strong>We do not sell personal data, display third-party tracking ads, or disclose your contact information to other students without explicit mutual consent.</strong>
          </p>
        </Card>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            1. Personal Data We Collect
          </h2>
          <p>We process only data you directly provide to participate on campus:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Institutional Identity:</strong> Official university email address (used for OTP verification).</li>
            <li><strong>Profile Information:</strong> Full name, age (18+ verified), academic course, department/branch, year of study, residency status (hostel or day scholar), and optional profile photo.</li>
            <li><strong>Synergy Attributes:</strong> Academic & extracurricular interests (likes, dislikes, top 3), campus goals (study buddy, hackathon teammate, etc.), availability slots, and languages.</li>
            <li><strong>Private Contact Information:</strong> Phone number and email, stored in encrypted tables and accessible only to reciprocally accepted connections.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            2. Purpose of Data Processing (Purpose Limitation)
          </h2>
          <p>Your digital personal data is processed exclusively for:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Computing personalized vibe compatibility scores between university peers.</li>
            <li>Delivering connection requests and secure contact reveals.</li>
            <li>Enforcing rate limits (20 requests/day) and campus safety moderation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            3. Contact Privacy & Disclosure Guard
          </h2>
          <p>
            Unlike open directory services, your phone number and email are <strong>never rendered in search, recommendations, or public cards</strong>. They are revealed only when two students mutually accept a connection request, and only if each student has checked &quot;Share verified email/phone&quot; in their privacy settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            4. Your Rights as a Data Principal (DPDP Act 2023)
          </h2>
          <p>You have full autonomy over your personal information:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Right to Access & Portability:</strong> Download a complete JSON archive of your personal records from Settings in one click.</li>
            <li><strong>Right to Correction:</strong> Edit or update any profile field, interest, or photo at any time.</li>
            <li><strong>Right to Erasure:</strong> Delete your account permanently via Settings; all your profile data, connection records, and interests will be permanently expunged.</li>
            <li><strong>Right of Grievance Redressal:</strong> Contact our designated Campus Data Protection Officer at <code>dpo@vibecheck.campus.edu</code>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
