"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Ban,
  UserCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCampus } from "@/lib/campus-store";

export default function AdminPage() {
  const {
    currentUser,
    reports,
    resolveReport,
    suspendUser,
    restoreUser,
    connectionRequests,
    switchActiveUser,
  } = useCampus();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Demo reports if empty
  const displayReports = reports.length > 0 ? reports : [
    {
      id: "rep_demo_1",
      reporter_id: "u_ananya_02",
      reported_id: "u_tanmay_07",
      reason: "Romantic / dating propositions",
      details: "Sent an unsolicited message attempting to ask out on a date rather than study collaboration.",
      status: "pending" as const,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      reporter: {
        id: "u_ananya_02",
        full_name: "Ananya Iyer",
        email: "ananya.iyer@lpu.in",
        branch: "B.Des",
      } as any,
      reported: {
        id: "u_tanmay_07",
        full_name: "Tanmay Joshi",
        email: "tanmay.joshi@lpu.in",
        branch: "CSE (Cloud)",
      } as any,
    },
  ];

  const totalConnections = connectionRequests.filter((r) => r.status === "accepted").length;
  const pendingReportsCount = displayReports.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-secondary text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Welfare & Moderation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-display">
            Admin Moderation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review community safety reports, manage user suspensions, and audit campus activity.
          </p>
        </div>

        {/* Demo role indicator */}
        <Badge variant="teal" className="gap-1.5 py-1 px-3 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Authorized Admin Access</span>
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 rounded-3xl border border-border bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">
            Active Students
          </div>
          <div className="text-2xl font-black text-foreground">18</div>
          <div className="text-[11px] text-secondary font-medium">
            Verified institutional emails
          </div>
        </Card>

        <Card className="p-5 rounded-3xl border border-border bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">
            Total Connections
          </div>
          <div className="text-2xl font-black text-primary">
            {totalConnections + 12}
          </div>
          <div className="text-[11px] text-muted-foreground font-medium">
            Mutual student links
          </div>
        </Card>

        <Card className="p-5 rounded-3xl border border-border bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">
            Pending Reports
          </div>
          <div className="text-2xl font-black text-amber-500">
            {pendingReportsCount}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Requires moderation
          </div>
        </Card>

        <Card className="p-5 rounded-3xl border border-border bg-card space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">
            Platform Health
          </div>
          <div className="text-2xl font-black text-emerald-500">99.8%</div>
          <div className="text-[11px] text-muted-foreground font-medium">
            DPDP compliance score
          </div>
        </Card>
      </div>

      {/* Reports Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-destructive" />
            <span>Student Reports Queue</span>
          </h2>
          <span className="text-xs text-muted-foreground">
            Showing {displayReports.length} report(s)
          </span>
        </div>

        <div className="space-y-4">
          {displayReports.map((report) => (
            <Card
              key={report.id}
              className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" className="text-xs font-bold">
                    {report.reason}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Filed on {new Date(report.created_at).toLocaleTimeString()}
                  </span>
                </div>

                <Badge
                  variant={report.status === "pending" ? "default" : "outline"}
                  className="capitalize self-start sm:self-auto text-[10px]"
                >
                  Status: {report.status}
                </Badge>
              </div>

              {/* Reported details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border text-xs">
                <div>
                  <span className="font-bold text-muted-foreground block text-[10px] uppercase">
                    Reporter (Student)
                  </span>
                  <span className="font-semibold text-foreground">
                    {report.reporter?.full_name || "Anonymous Student"}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    ({report.reporter?.branch || "Student"})
                  </span>
                </div>

                <div>
                  <span className="font-bold text-muted-foreground block text-[10px] uppercase">
                    Reported Account
                  </span>
                  <span className="font-semibold text-destructive">
                    {report.reported?.full_name || report.reported_id}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    ({report.reported?.branch || "Target User"})
                  </span>
                </div>
              </div>

              {report.details && (
                <div className="text-xs text-muted-foreground bg-card p-3 rounded-xl border border-border/60">
                  <strong className="text-foreground">Details provided: </strong>
                  &ldquo;{report.details}&rdquo;
                </div>
              )}

              {/* Admin Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-border/80">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resolveReport(report.id, "dismissed");
                    showToast("Report marked as dismissed.");
                  }}
                  className="gap-1.5 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Dismiss Report</span>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    suspendUser(report.reported_id);
                    resolveReport(report.id, "actioned");
                    showToast(`User ${report.reported?.full_name || report.reported_id} suspended.`);
                  }}
                  className="gap-1.5 text-xs font-bold"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Suspend Student Account</span>
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    restoreUser(report.reported_id);
                    showToast(`Account restored.`);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Restore Access</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
