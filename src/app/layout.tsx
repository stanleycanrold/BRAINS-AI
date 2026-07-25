import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRAINS AI — Validate before you build",
  description:
    "The 0→1 validation & startup engine. Capture, validate, and launch with evidence — not documents.",
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Clerk key isn't set (e.g. during build without env vars), render
  // without the provider so the build doesn't crash on auto-generated pages.
  const content = (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );

  if (!clerkKey) return content;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00E5FF",
          colorBackground: "#12121A",
          colorText: "#F5F5F7",
          colorInputBackground: "#1A1A26",
          colorInputText: "#F5F5F7",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
