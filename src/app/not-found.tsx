"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple animate-pulse">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground/80">
        Page Not Found
      </h2>
      <p className="mt-2 text-center text-muted-foreground max-w-md px-4">
        Oops! The page you are looking for seems to have glitched out of existence.
        Check the URL or return to the base.
      </p>
      
      <div className="mt-10">
        <Link
          href="/"
          className="relative px-6 py-3 font-bold text-neon-cyan border border-neon-cyan rounded-md overflow-hidden group hover:bg-neon-cyan/10 transition-all duration-300"
        >
          <span className="relative z-10">Return to Home</span>
          <div className="absolute inset-0 bg-neon-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
