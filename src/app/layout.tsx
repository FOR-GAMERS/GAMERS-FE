import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";
import Banner from "@/components/layout/Banner";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GAMERS | Premium Gaming Experience",
  description: "Level up your gaming journey with GAMERS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased bg-background text-foreground overflow-x-hidden")}>
        <SmoothScroll>
          <Banner />
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
