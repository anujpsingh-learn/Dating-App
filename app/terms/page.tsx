import React from "react";
import Link from "next/link";
import { HeartHandshake, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TermsOfUsePage() {
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
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <HeartHandshake className="w-4 h-4" />
          <span>Campus Code of Conduct</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">
          Terms of Community Use
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Rules for respectful, purposeful student peer connection on Vibe Check.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            1. Eligibility & University Affiliation
          </h2>
          <p>
            Vibe Check is strictly for currently enrolled university students aged 18 or older. Registration is restricted to authorized institutional email domains (e.g. <code>@lpu.in</code>, <code>@thapar.edu</code>, <code>@iitd.ac.in</code>). Impersonation, fake profiles, or using non-student credentials will result in permanent account suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            2. Platform Charter: Strictly Not a Dating App
          </h2>
          <p>
            Vibe Check is built to connect students for hackathons, study sprints, sports, campus events, and genuine friendships. <strong>Romantic solicitations, sexual innuendos, unsolicited dating propositions, or predatory behavior are strictly prohibited.</strong> Any user reported for unwanted advances will have their account immediately suspended.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            3. Respectful Communication & Rate Limits
          </h2>
          <p>
            Users may send up to 20 &quot;Say Hi&quot; requests per day. Intro notes must remain courteous and relevant to academic, hobby, or project pursuits. Harassment, hate speech, bullying, or commercial spam will lead to immediate reporting and campus disciplinary notification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground font-display">
            4. Real-World Meeting Safety
          </h2>
          <p>
            Students agree to conduct initial meetings in public university settings. Vibe Check is not liable for off-platform disputes, though we cooperate fully with campus grievance cells and law enforcement in cases of misconduct.
          </p>
        </section>
      </div>
    </div>
  );
}
