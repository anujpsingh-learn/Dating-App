"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  ShieldAlert,
  Sparkles,
  Lock,
  Clock,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportModal } from "@/components/ui/report-modal";
import { useCampus } from "@/lib/campus-store";
import { Profile } from "@/types/database";

export default function ConnectionsPage() {
  const {
    currentUser,
    connectionRequests,
    respondToRequest,
    privacySettings,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<"connections" | "incoming" | "sent">(
    "connections"
  );
  const [reportTarget, setReportTarget] = useState<Profile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Mutual accepted connections
  const acceptedRequests = connectionRequests.filter(
    (r) =>
      r.status === "accepted" &&
      (r.sender_id === currentUser?.id || r.receiver_id === currentUser?.id)
  );

  // 2. Incoming requests
  const incomingRequests = connectionRequests.filter(
    (r) => r.receiver_id === currentUser?.id && r.status === "pending"
  );

  // 3. Sent requests
  const sentRequests = connectionRequests.filter(
    (r) => r.sender_id === currentUser?.id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-foreground text-background text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-secondary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Campus Scene */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-border/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1800"
            alt="Students on Campus"
            className="w-full h-full object-cover object-center opacity-20 dark:opacity-10 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/90 to-card/95" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Users className="w-4 h-4" />
            <span>Campus Network</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-foreground">
            Connections &amp; Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Contact information is revealed only between mutual connections.
          </p>
        </div>

        {/* Safety Tip Pill */}
        <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center gap-2.5 text-xs text-foreground">
          <Lock className="w-4 h-4 text-secondary shrink-0" />
          <span>Phone & email stay private until mutual consent.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("connections")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "connections"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>My Connections ({acceptedRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("incoming")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all relative ${
            activeTab === "incoming"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests</span>
          {incomingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center font-bold">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("sent")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "sent"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests ({sentRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: MY CONNECTIONS */}
      {activeTab === "connections" && (
        <div className="space-y-6">
          {/* First Connection Safety Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-foreground">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-600 dark:text-amber-400 font-bold">
                Campus Meeting Safety Guidelines:
              </strong>
              <span>
                Always plan your first meetups in public campus locations (e.g. Central Library, Student Center, or Campus Cafeteria). Never share banking details or OTPs.
              </span>
            </div>
          </div>

          {acceptedRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acceptedRequests.map((req) => {
                const peer =
                  req.sender_id === currentUser?.id
                    ? req.receiver_profile
                    : req.sender_profile;

                if (!peer) return null;

                return (
                  <Card
                    key={req.id}
                    className="p-6 rounded-3xl border border-border bg-card space-y-4 hover:border-primary/40 transition-all relative"
                  >
                    <button
                      onClick={() => setReportTarget(peer)}
                      title="Report or block user"
                      className="absolute top-5 right-5 text-muted-foreground hover:text-destructive p-1.5 rounded-full hover:bg-muted transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 overflow-hidden border border-primary/20 shrink-0 flex items-center justify-center font-bold text-xl text-primary">
                        {peer.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={peer.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          peer.full_name?.charAt(0) || "U"
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">
                            {peer.full_name}
                          </h3>
                          <Badge variant="teal" className="text-[10px]">
                            Mutual Vibe
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {peer.branch} • Year {peer.year}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {peer.hostel_or_day} • {peer.languages?.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;{peer.bio}&rdquo;
                    </p>

                    {/* Revealed Contact Information */}
                    <div className="p-3.5 rounded-2xl bg-muted/60 border border-border space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-secondary" />
                        <span>Verified Contact Details</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-medium font-mono text-[11px]">
                            {peer.email}
                          </span>
                        </div>
                        {peer.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span className="font-medium font-mono text-[11px]">
                              {peer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Original intro note context */}
                    <div className="text-[11px] text-muted-foreground bg-background p-2.5 rounded-xl border border-border/60">
                      <strong>Intro note: </strong> &ldquo;{req.message}&rdquo;
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 rounded-3xl border border-dashed border-border bg-card/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto text-xl">
                👥
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground">
                  No accepted connections yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Head over to the Discover tab to explore classmates and say hi with an intro note!
                </p>
              </div>
              <Link href="/discover">
                <Button variant="vibe" size="sm">
                  Explore Discover Grid
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: INCOMING REQUESTS */}
      {activeTab === "incoming" && (
        <div className="space-y-4">
          {incomingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incomingRequests.map((req) => {
                const sender = req.sender_profile;
                if (!sender) return null;

                return (
                  <Card
                    key={req.id}
                    className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg text-primary">
                        {sender.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sender.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          sender.full_name?.charAt(0) || "U"
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-base text-foreground">
                          {sender.full_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {sender.branch} • Year {sender.year}
                        </p>
                      </div>
                    </div>

                    {/* Intro Note */}
                    <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 text-xs text-foreground space-y-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-primary">
                        Intro Note from {sender.full_name.split(" ")[0]}:
                      </span>
                      <p className="italic">&ldquo;{req.message}&rdquo;</p>
                    </div>

                    {/* Actions: Accept or Decline */}
                    <div className="flex items-center gap-3 pt-2 border-t border-border/80">
                      <Button
                        variant="vibe"
                        size="sm"
                        onClick={() => {
                          respondToRequest(req.id, "accepted");
                          showToast(`Accepted! You and ${sender.full_name} are now connected.`);
                        }}
                        className="gap-1.5 flex-1 font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept & Reveal Contact</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          respondToRequest(req.id, "declined");
                          showToast(`Request declined.`);
                        }}
                        className="gap-1.5 text-muted-foreground hover:text-destructive"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 rounded-3xl border border-dashed border-border bg-card/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto text-xl">
                📬
              </div>
              <h3 className="font-bold text-base text-foreground">
                No incoming connection requests
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                When fellow students discover your profile and send a request, it will appear here for your review.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: SENT REQUESTS */}
      {activeTab === "sent" && (
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sentRequests.map((req) => {
                const receiver = req.receiver_profile;
                return (
                  <Card
                    key={req.id}
                    className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-muted overflow-hidden shrink-0 flex items-center justify-center font-bold text-base text-foreground">
                          {receiver?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={receiver.avatar_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            receiver?.full_name?.charAt(0) || "U"
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {receiver?.full_name || "Campus Peer"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {receiver?.branch}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <Badge
                        variant={
                          req.status === "accepted"
                            ? "teal"
                            : req.status === "declined"
                            ? "outline"
                            : "warning"
                        }
                        className="text-[10px] font-bold capitalize"
                      >
                        {req.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <strong>Your note: </strong> &ldquo;{req.message}&rdquo;
                    </div>

                    <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1">
                      <span>Sent on {new Date(req.created_at).toLocaleDateString()}</span>
                      {req.status === "accepted" && (
                        <Link href="/connections">
                          <span className="text-primary font-bold hover:underline">
                            View Verified Contact →
                          </span>
                        </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 rounded-3xl border border-dashed border-border bg-card/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto text-xl">
                🚀
              </div>
              <h3 className="font-bold text-base text-foreground">
                You haven&apos;t sent any requests yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Find interesting peers in Discover and say hi with a quick intro note!
              </p>
              <Link href="/discover">
                <Button variant="vibe" size="sm">
                  Go to Discover
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}

      {/* Safety Report Modal */}
      <ReportModal
        profile={reportTarget}
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
}
