"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground text-center px-4">
      <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-neon-purple animate-pulse">
        500
      </h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground/90">
        System Malfunction
      </h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        An unexpected error has occurred in the system. Our netrunners have been notified.
      </p>
      
      <div className="mt-10 flex gap-4">
        <button
          onClick={reset}
          className="relative px-6 py-3 font-bold text-background bg-neon-cyan/90 rounded-md hover:bg-neon-cyan transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="relative px-6 py-3 font-bold text-neon-cyan border border-neon-cyan rounded-md hover:bg-neon-cyan/10 transition-colors"
        >
          Return Home
        </Link>
      </div>

       <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
         <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
