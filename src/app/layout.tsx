import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Idle Merge Battle",
  description: "An incremental game with resource management, battles, and item merging",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className={cn(
            "flex-1 overflow-y-auto",
            // Base padding
            "p-4",
            // Left padding accounts for hamburger menu on mobile and menu width on desktop
            "pl-20", // 5rem (80px) for hamburger + safe space
            // Responsive padding adjustments
            "sm:pl-24", // 6rem (96px) for larger screens
            "lg:pl-8", // Normal padding when sidebar is always visible
            // Other padding
            "pr-4 sm:pr-6 lg:pr-8",
            "pt-4 sm:pt-6 lg:pt-8",
            "pb-8"
          )}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
