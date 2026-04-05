'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eraser, UserSearch, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface NicknameParsingPanelProps {
  onParse: (nicknames: string[]) => void;
  className?: string;
}

export function NicknameParsingPanel({ onParse, className }: NicknameParsingPanelProps) {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [parsedList, setParsedList] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleParse = () => {
    if (!inputText.trim()) return;

    // Regex to match:
    // 1. Nickname#TAG (LoL/Valorant style)
    // 2. Just Nicknames (separated by newlines or commas)
    // 3. Chat log lines like "Nickname: message" or "Nickname joined..."
    
    // Simple but effective: split by common delimiters and filter
    const lines = inputText.split(/[\n,]/);
    const names = lines
      .map(line => {
        // Extract from "Name: message"
        const colonMatch = line.match(/^([^:]+):/);
        if (colonMatch) return colonMatch[1].trim();
        
        // Extract from "Name joined/entered"
        const joinMatch = line.match(/^([^\s]+)\s+(님이|joined|entered)/i);
        if (joinMatch) return joinMatch[1].trim();

        return line.trim();
      })
      .filter(name => name.length > 0 && name.length < 32)
      .slice(0, 10); // Limit to 10 for LoL 5v5 context

    setParsedList(names);
    onParse(names);
    
    if (names.length > 0) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText('');
    setParsedList([]);
    onParse([]);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[13px] font-black text-[#EEEEF0] uppercase tracking-wider flex items-center gap-2">
          <UserSearch className="h-4 w-4 text-neon-mint" />
          {t('playground.team_distribution.parsing.title')}
        </h3>
        {parsedList.length > 0 && (
          <span className="text-[11px] font-bold text-neon-mint/80">
            {t('playground.team_distribution.parsing.parsed_count', { count: parsedList.length })}
          </span>
        )}
      </div>

      <div className="relative group">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('playground.team_distribution.parsing.placeholder')}
          className="w-full h-32 bg-[#0C0C0D] border border-white/5 rounded-2xl p-4 text-[13px] text-[#EEEEF0] placeholder:text-[#5A5A65] focus:outline-none focus:border-neon-mint/30 focus:bg-white/5 transition-all resize-none font-mono"
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-white/5 text-[#5A5A65] hover:text-white hover:bg-white/10 transition-all"
            title={t('playground.team_distribution.parsing.clear_button')}
          >
            <Eraser className="h-4 w-4" />
          </button>
          <button
            onClick={handleParse}
            disabled={!inputText.trim()}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black transition-all active:scale-95",
              isSuccess 
                ? "bg-neon-mint text-black" 
                : "bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>SUCCESS</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>{t('playground.team_distribution.parsing.parse_button')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {parsedList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            {parsedList.map((name, i) => (
              <motion.span
                key={`${name}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 rounded-lg bg-neon-mint/10 border border-neon-mint/20 text-neon-mint text-[11px] font-black"
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
