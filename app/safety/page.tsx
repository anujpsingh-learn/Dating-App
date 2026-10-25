import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building,
  Users,
  AlertTriangle,
  Lock,
  PhoneCall,
  CheckCircle2,
  HeartHandshake,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-border/80 pb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
          <ShieldCheck className="w-4 h-4" />
          <span>Student Trust & Safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">
          Campus Safety & Community Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Vibe Check exists solely to foster authentic academic and social connections. Here is how we safeguard student safety and what you can do to protect yourself and peers.
        </p>
      </div>

      {/* Grid of Safety Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-3xl border border-secondary/20 bg-card space-y-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-foreground">
            1. Meet in Public Campus Spaces
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            For initial study sessions, project discussions, or coffee hangouts, always pick well-lit public university areas: the Central Library, Student Activity Center, or campus cafeteria.
          </p>
        </Card>

        <Card className="p-6 rounded-3xl border border-primary/20 bg-card space-y-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-foreground">
            2. Tell a Roommate or Friend
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Let a friend know when and where you are meeting someone new for a project sprint or sport match. Have a check-in plan.
          </p>
        </Card>

        <Card className="p-6 rounded-3xl border border-amber-500/20 bg-card space-y-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-foreground">
            3. Never Share Financials or OTPs
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No legitimate campus peer will ever request payment verification codes, banking information, or passwords. Never transfer money to an unverified student.
          </p>
        </Card>

        <Card className="p-6 rounded-3xl border border-destructive/20 bg-card space-y-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-foreground">
            4. Strictly Not a Dating App
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Vibe Check prohibits romantic or sexually explicit solicitations. If anyone makes you feel uncomfortable, report them immediately. We maintain a zero-tolerance policy.
          </p>
        </Card>
      </div>

      {/* How Report & Block Works */}
      <Card className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-foreground font-display">
          How Blocking & Reporting Work
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Every profile card and connection has a direct Report & Block shield icon.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5">
            <div className="font-bold text-foreground">Immediate Block</div>
            <p className="text-muted-foreground">
              When you block a user, you both disappear completely from each other&apos;s Discover grids, search results, and recommendations. No notifications are sent to them.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5">
            <div className="font-bold text-foreground">Moderator Review</div>
            <p className="text-muted-foreground">
              Reports are triaged by authorized campus welfare administrators. Accounts found violating community guidelines are permanently suspended.
            </p>
          </div>
        </div>
      </Card>

      {/* DPDP Compliance Card */}
      <div className="p-6 sm:p-8 rounded-3xl vibe-gradient-subtle border border-secondary/30 space-y-4">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          <h3 className="font-bold text-base text-foreground">
            Digital Personal Data Protection Act (DPDP 2023) Guarantees
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Under India’s DPDP Act 2023, you hold full statutory rights over your personal data:
        </p>
        <ul className="space-y-1.5 text-xs text-foreground list-disc list-inside">
          <li><strong>Right to Access:</strong> You can download your complete personal data in JSON at any time from Settings.</li>
          <li><strong>Right to Erasure:</strong> One-click permanent account deletion eliminates all profile data, interests, and records.</li>
          <li><strong>Data Minimization:</strong> We never sell data, run behavioral ads, or track you across the web.</li>
        </ul>
        <div className="pt-2">
          <Link href="/privacy">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <FileText className="w-3.5 h-3.5 text-secondary" />
              <span>Read Full DPDP Privacy Policy</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
