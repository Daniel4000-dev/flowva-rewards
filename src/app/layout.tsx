import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- Import Sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flowva Rewards",
  description: "Assessment Submission",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-center" /> {/* <--- Activate Sonner here */}
      </body>
    </html>
  );
}