"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-neon-cyan/30">
        <Header />
        <main className="flex-1 flex flex-col relative w-full pt-16">
            {children}
        </main>
        <Footer className="relative" />
    </div>
  );
}
