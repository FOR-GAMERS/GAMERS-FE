'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ContestDetailContent } from '@/components/contest/ContestDetailContent';
import { motion } from 'framer-motion';

export default function ContestDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0C0C0F] text-[#EEEEF0]">
      {/* Navbar with absolute positioning for hero overlap */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <main className="flex-1">
        <ContestDetailContent />
      </main>

      <Footer />
    </div>
  );
}
