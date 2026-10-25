"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Users,
  Compass,
  Calendar,
  Shield,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sliders,
} from "lucide-react";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";
import { useCampus } from "@/lib/campus-store";
import { cn } from "@/lib/utils";
import { SEED_STUDENTS } from "@/lib/seed-data";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, connectionRequests, logout, switchActiveUser } = useCampus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);

  // Incoming pending requests count
  const pendingRequestsCount = connectionRequests.filter(
    (r) => r.receiver_id === currentUser?.id && r.status === "pending"
  ).length;

  const navLinks = [
    { href: "/discover", label: "Discover", icon: Compass },
    {
      href: "/connections",
      label: "Connections",
      icon: Users,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
    },
    { href: "/campus/groups", label: "Groups", icon: Users },
    { href: "/campus/events", label: "Events", icon: Calendar },
    { href: "/safety", label: "Safety", icon: Shield },
  ];

  if (currentUser?.is_admin) {
    navLinks.push({
      href: "/admin",
      label: "Admin Panel",
      icon: ShieldCheck,
      badge: null,
    });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-2xl vibe-gradient flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-1.5 font-display">
              Vibe Check
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-secondary/15 text-secondary">
                Campus
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Switcher */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setDemoSwitcherOpen(!demoSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-dashed border-border bg-card text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              title="Switch demo persona to test both sides"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Persona: {currentUser?.full_name?.split(" ")[0] || "Select"}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {demoSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                  Switch Demo Student
                </div>
                {SEED_STUDENTS.slice(0, 5).map((seed) => (
                  <button
                    key={seed.profile.id}
                    onClick={() => {
                      switchActiveUser(seed.profile.id);
                      setDemoSwitcherOpen(false);
                    }}
                    className={cn(
                      "w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xs transition-colors",
                      currentUser?.id === seed.profile.id
                        ? "bg-primary/15 text-primary font-bold"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="w-7 h-7 rounded-full bg-muted overflow-hidden shrink-0">
                      {seed.profile.avatar_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={seed.profile.avatar_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="truncate">{seed.profile.full_name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {seed.profile.branch}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-border bg-card hover:border-primary/40 transition-colors"
              >
                <span className="text-xs font-semibold text-foreground hidden sm:inline max-w-[100px] truncate">
                  {currentUser.full_name || "Student"}
                </span>
                <div className="w-7 h-7 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center overflow-hidden">
                  {currentUser.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUser.full_name ? currentUser.full_name.charAt(0) : "U"
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-card border border-border p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-border/60">
                    <div className="font-bold text-xs truncate text-foreground">
                      {currentUser.full_name || "New Student"}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {currentUser.email}
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-secondary" />
                    <span>Privacy & Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" variant="vibe">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl text-xs font-semibold",
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
