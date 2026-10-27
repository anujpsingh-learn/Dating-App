import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CampusProvider } from "@/lib/campus-store";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vibe Check | University Student Connection Network",
  description:
    "Curated peer connection for university students. Discover study partners, hackathon teams, gym buddies, campus event companions, and lifelong friends based on shared vibes.",
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
    description: "Strictly platonic. The authentic, verified university peer network.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${jakarta.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
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
