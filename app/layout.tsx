import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/context/QueryProvider";
import { ConfirmProvider } from "@/context/ConfirmProvider";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BDA Admin",
  description: "BDA admin operations console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <QueryProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
