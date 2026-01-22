"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnimatedSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface AnimatedSelectProps {
  options: AnimatedSelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function AnimatedSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  disabled = false,
  className
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const toggleOpen = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled}
          className={cn(
            "w-full bg-black/40 border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-all duration-300 outline-none",
            isOpen ? "border-neon-cyan/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-black/60" : "border-white/10 hover:border-white/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className={cn("font-medium truncate", !selectedOption && "text-muted-foreground")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown size={16} className={cn("transition-colors", isOpen ? "text-neon-cyan" : "text-white/30")} />
          </motion.div>
        </button>

        {/* Dropdown Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl ring-1 ring-black/5"
            >
              <motion.div 
                className="max-h-60 overflow-y-auto py-1 custom-scrollbar"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                  hidden: {}
                }}
              >
                {options.map((option) => (
                  <motion.div
                    key={option.value}
                    variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <button
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                        "w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group",
                        option.value === value 
                            ? "bg-neon-cyan/10 text-neon-cyan font-bold" 
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <span>{option.label}</span>
                        {option.value === value && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Check size={14} />
                            </motion.div>
                        )}
                    </button>
                  </motion.div>
                ))}
                {options.length === 0 && (
                    <div className="px-4 py-8 text-center text-muted-foreground text-xs">
                        No options available
                    </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
