"use client";

import { motion } from "framer-motion";

interface ContestHeroProps {
  title: string;
  thumbnailUrl: string;
  status: string;
  gameType: string;
}

export default function ContestHero({ title, thumbnailUrl, status, gameType }: ContestHeroProps) {
  return (
    <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden cursor-pointer select-none">
      {/* Background Image with Framer Motion */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* High-visibility Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/30 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-black/20" /> {/* General darkening for text pop */}

      {/* Content Container */}
      <div className="relative container mx-auto h-full px-4 flex flex-col justify-end pb-12 md:pb-16 z-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-4 max-w-5xl"
        >
          {/* Badges */}
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/50 text-xs md:text-sm font-bold uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              {gameType}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs md:text-sm font-bold uppercase tracking-wider backdrop-blur-md">
              {status}
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl leading-[1.1]">
            {title}
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
