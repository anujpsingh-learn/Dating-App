import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CampusProvider } from "@/lib/campus-store";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vibe Check | University Student Connection Platform",
  description:
    "Find your people on campus. Connect with university students for study partners, hackathons, sports, campus events, and genuine friendships based on shared vibes.",
  keywords: [
    "university networking",
    "campus peer finder",
    "study partners",
    "hackathon teammates",
    "student community",
    "vibe check",
  ],
  authors: [{ name: "Vibe Check Team" }],
  openGraph: {
    title: "Vibe Check | Find Your People on Campus",
    description: "Not a dating app. The authentic student connection network.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={bricolage.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CampusProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CampusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
