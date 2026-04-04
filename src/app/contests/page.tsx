'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ContestsListContent } from '@/components/contest/ContestsListContent';
import { motion } from 'framer-motion';

export default function ContestsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0C0C0F] text-[#EEEEF0]">
      <Navbar />
      
      <main className="flex-1 pt-32">
        {/* Page Hero */}
        <div className="mx-auto flex flex-col gap-4 px-6 md:px-16 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-baseline gap-6"
          >
            <h1 className="font-barlow text-6xl font-black italic tracking-tighter text-[#EEEEF0] md:text-8xl">
              대회 찾기
            </h1>
            <p className="font-inter text-lg text-[#7A7A85] md:text-xl font-medium">
              모든 경쟁의 시작은 여기서. 당신만의 무대를 찾으세요.
            </p>
          </motion.div>
        </div>

        {/* Content Section */}
        <ContestsListContent />
      </main>

      <Footer />
    </div>
  );
}
