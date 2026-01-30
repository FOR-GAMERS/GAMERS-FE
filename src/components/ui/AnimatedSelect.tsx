"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  startIcon?: React.ReactNode;
  size?: 'default' | 'sm';
}

export default function AnimatedSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  disabled = false,
  className,
  startIcon,
  size = 'default'
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
        const updatePosition = () => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY + 8, // 8px gap
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true); // true for capture to catch all scrolls
        
        return () => {
             window.removeEventListener('resize', updatePosition);
             window.removeEventListener('scroll', updatePosition, true);
        };
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        // We check if click is outside BOTH the container (trigger) AND the portal content
        // Since portal content is not child of containerRef in DOM tree, simple contain check isn't enough depending on structure.
        // However, if we put a ref on the dropdown itself we can check.
        // But simpler: just check if target is NOT in containerRef.
        // If the user clicks ON the dropdown in the portal, we should NOT close.
        // We need a ref for the dropdown content.
        
        // This logic is tricky with portals. 
        // A common pattern is checking event.target.closest('[data-portal-id="unique-id"]')
    };

    if (isOpen) {
         // Because logic is complex, we'll implement a custom click handler on window
         const onWindowClick = (e: MouseEvent) => {
             const target = e.target as HTMLElement;
             const isTrigger = containerRef.current?.contains(target);
             const isDropdown = target.closest(`[data-select-portal="${label || 'select'}"]`);
             
             if (!isTrigger && !isDropdown) {
                 setIsOpen(false);
             }
         };
         window.addEventListener('mousedown', onWindowClick);
         return () => window.removeEventListener('mousedown', onWindowClick);
    }
  }, [isOpen, label]);

  const selectedOption = options.find((opt) => opt.value === value);

  const toggleOpen = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const portalContent = (
    <AnimatePresence>
        {isOpen && (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ 
                position: 'absolute', 
                top: position.top, 
                left: position.left, 
                width: position.width,
                zIndex: 9999
            }}
            data-select-portal={label || 'select'}
            className="overflow-hidden rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl ring-1 ring-black/5"
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
                    "w-full text-left transition-colors flex items-center justify-between group",
                    size === 'sm' ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
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
  );

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
          ref={buttonRef}
          type="button"
          onClick={toggleOpen}
          disabled={disabled}
          className={cn(
            "w-full bg-black/40 border rounded-xl flex items-center justify-between transition-all duration-300 outline-none",
            size === 'sm' ? "px-3 py-1.5 text-xs" : "px-4 py-3 text-sm",
            isOpen ? "border-neon-cyan/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-black/60" : "border-white/10 hover:border-white/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-2 truncate">
              {startIcon && <span className="text-muted-foreground">{startIcon}</span>}
              <span className={cn("font-medium truncate", !selectedOption && "text-muted-foreground")}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown size={16} className={cn("transition-colors", isOpen ? "text-neon-cyan" : "text-white/30")} />
          </motion.div>
        </button>

        {mounted ? createPortal(portalContent, document.body) : null}
      </div>
    </div>
  );
}
