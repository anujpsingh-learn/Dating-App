"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sliders,
  Shield,
  Eye,
  EyeOff,
  Download,
  Trash2,
  CheckCircle2,
  Lock,
  AlertTriangle,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCampus } from "@/lib/campus-store";
import { GenderVisibility, RequestPermission } from "@/types/database";

export default function SettingsPage() {
  const router = useRouter();
  const {
    privacySettings,
    updatePrivacySettings,
    exportUserData,
    deleteAccount,
    currentUser,
  } = useCampus();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExport = () => {
    const jsonStr = exportUserData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vibe-check-student-data-${currentUser?.id || "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data export downloaded successfully (DPDP Act compliant).");
  };

  const handleDelete = () => {
    deleteAccount();
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-secondary text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1 border-b border-border/80 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
          <Sliders className="w-4 h-4" />
          <span>Privacy & Account Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground font-display">
          Privacy & Data Controls
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure who can see your profile, manage contact sharing, or exercise your rights under the DPDP Act 2023.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. DISCOVERY & VISIBILITY */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                Profile Visibility & Discovery
              </h3>
              <p className="text-xs text-muted-foreground">
                Control whether other campus peers can view your card in Discover.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Temporarily Hide Profile Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  {privacySettings.is_profile_hidden ? (
                    <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-secondary" />
                  )}
                  <span>Pause & Hide My Profile Temporarily</span>
                </div>
                <p className="text-[11px] text-muted-foreground max-w-md">
                  When paused, you won&apos;t appear in discover results or recommendations. Existing mutual connections can still view your shared chat/contacts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  updatePrivacySettings({
                    is_profile_hidden: !privacySettings.is_profile_hidden,
                  });
                  showToast(
                    privacySettings.is_profile_hidden
                      ? "Profile is now visible in Discover."
                      : "Profile hidden from Discover."
                  );
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  privacySettings.is_profile_hidden ? "bg-amber-500" : "bg-muted border border-border"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    privacySettings.is_profile_hidden ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Who can send requests */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Who can send me &quot;Say Hi&quot; requests?
              </label>
              <select
                value={privacySettings.allow_requests_from}
                onChange={(e) => {
                  updatePrivacySettings({
                    allow_requests_from: e.target.value as RequestPermission,
                  });
                  showToast("Request permissions updated.");
                }}
                className="w-full h-11 rounded-xl border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="everyone">Everyone on campus (Recommended)</option>
                <option value="same_branch_or_year">Only students in my branch or academic year</option>
                <option value="nobody">Nobody (Temporarily pause all incoming requests)</option>
              </select>
            </div>

            {/* Who can see gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gender Visibility
              </label>
              <select
                value={privacySettings.show_gender}
                onChange={(e) => {
                  updatePrivacySettings({
                    show_gender: e.target.value as GenderVisibility,
                  });
                  showToast("Gender visibility updated.");
                }}
                className="w-full h-11 rounded-xl border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="everyone">Everyone</option>
                <option value="connections_only">Only my accepted mutual connections</option>
                <option value="nobody">Nobody (Completely hidden)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 2. CONTACT DISCLOSURE CONTROLS */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                Mutual Contact Disclosure
              </h3>
              <p className="text-xs text-muted-foreground">
                Decide which contact items are shared when you accept a connection request.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground">
                  Share verified university email with connections
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Reveals your @edu email only to accepted connections.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.reveal_email_to_connections}
                onChange={(e) => {
                  updatePrivacySettings({
                    reveal_email_to_connections: e.target.checked,
                  });
                  showToast("Contact sharing preference updated.");
                }}
                className="rounded border-input text-secondary focus:ring-secondary w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground">
                  Share phone number with connections
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Reveals your phone number only if provided and connection is mutually accepted.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.reveal_phone_to_connections}
                onChange={(e) => {
                  updatePrivacySettings({
                    reveal_phone_to_connections: e.target.checked,
                  });
                  showToast("Contact sharing preference updated.");
                }}
                className="rounded border-input text-secondary focus:ring-secondary w-4 h-4"
              />
            </label>
          </div>
        </Card>

        {/* 3. DPDP COMPLIANCE & ACCOUNT ACTIONS */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-destructive/20 bg-card space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                Digital Personal Data Protection (DPDP 2023) Rights
              </h3>
              <p className="text-xs text-muted-foreground">
                Export your full data or exercise your right to permanent erasure.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-2 text-xs border-border flex-1"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Download My Personal Data (JSON)</span>
            </Button>

            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="gap-2 text-xs flex-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account & Erase All Data</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-card border border-destructive/30 p-6 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-lg text-foreground">
                Permanently delete account?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This will immediately purge your profile, interests, connection requests, and all campus records. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="gap-2 font-bold"
              >
                <UserX className="w-4 h-4" />
                <span>Confirm & Delete Forever</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
