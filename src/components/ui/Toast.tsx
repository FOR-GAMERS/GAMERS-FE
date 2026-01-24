'use client';

import React, { useRef, useEffect } from 'react';
import { ToastType } from '@/context/ToastContext';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onRemove: () => void;
}

export function Toast({ id, message, type, onRemove }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: toastRef });

  // Entrance Animation
  useGSAP(() => {
    gsap.fromTo(toastRef.current,
      { x: 50, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );

    // Progress Bar
    gsap.to(progressRef.current, {
        width: '0%',
        duration: 4,
        ease: 'linear',
        onComplete: handleRemove
    });
  }, []);

  const handleRemove = contextSafe(() => {
    gsap.to(toastRef.current, {
        x: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onRemove
    });
  });

  const getIcon = () => {
    switch (type) {
        case 'success': return <Check size={18} className="text-neon-cyan" />;
        case 'error': return <AlertCircle size={18} className="text-red-500" />;
        default: return <Info size={18} className="text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
        case 'success': return 'border-neon-cyan/50 bg-deep-black/90 shadow-[0_0_15px_rgba(0,243,255,0.2)]';
        case 'error': return 'border-red-500/50 bg-deep-black/90 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
        default: return 'border-blue-500/50 bg-deep-black/90 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
    }
  };

  const getProgressColor = () => {
    switch (type) {
        case 'success': return 'bg-neon-cyan';
        case 'error': return 'bg-red-500';
        default: return 'bg-blue-500';
    }
  };

  return (
    <div 
        ref={toastRef}
        className={`pointer-events-auto relative w-80 rounded-lg border backdrop-blur-md p-4 flex items-start gap-3 overflow-hidden ${getStyles()}`}
    >
        <div className={`mt-0.5 shrink-0 ${type === 'success' ? 'animate-pulse' : ''}`}>
             {getIcon()}
        </div>
        
        <div className="flex-1 mr-2">
            <p className="text-sm font-bold text-white leading-tight">{message}</p>
        </div>

        <button onClick={handleRemove} className="text-white/40 hover:text-white transition-colors shrink-0">
            <X size={14} />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div ref={progressRef} className={`h-full w-full ${getProgressColor()}`} />
        </div>
    </div>
  );
}
