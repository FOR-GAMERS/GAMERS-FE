import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GAMERS | Premium Gaming Experience",
  description: "Level up your gaming journey with GAMERS.",
  icons: {
    icon: '/icon.svg',
  },
};

import { ToastProvider } from "@/context/ToastContext";

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased bg-background text-foreground overflow-x-hidden")}>
        <SmoothScroll>
          <Providers>
            <ToastProvider>
              {children}
            </ToastProvider>
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
