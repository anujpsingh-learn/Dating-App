import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, HeartHandshake, Lock } from "lucide-react";
import { getAllowedDomains } from "@/lib/domain-validator";

export function Footer() {
  const allowed = getAllowedDomains();

  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-sm mt-16 text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight">
                Vibe<span className="text-primary">Check</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              The verified peer-connection platform for university students. Discover study partners, project collaborators, gym buddies, and genuine campus friends based on mutual vibes and authentic interests.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-[11px] font-semibold text-secondary">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Campus Community • Strictly Not a Dating App</span>
            </div>
          </div>

          {/* Col 2: Navigation & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Platform & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/discover" className="text-muted-foreground hover:text-primary transition-colors">
                  Discover Peers
                </Link>
              </li>
              <li>
                <Link href="/connections" className="text-muted-foreground hover:text-primary transition-colors">
                  My Connections
                </Link>
              </li>
              <li>
                <Link href="/campus/groups" className="text-muted-foreground hover:text-primary transition-colors">
                  Campus Groups
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-muted-foreground hover:text-primary transition-colors">
                  Safety & Meeting Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & DPDP Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Privacy & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Community Use
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-muted-foreground hover:text-primary transition-colors">
                  Data Export & Deletion
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* DPDP Compliance Notice & Allowed Domains */}
        <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-secondary" />
            <span>
              DPDP Act 2023 Compliant: Verified university emails only. Phone and email are strictly hidden until mutual consent.
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Allowed: </span>
            {allowed.map((d) => (
              <span key={d} className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
                @{d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
