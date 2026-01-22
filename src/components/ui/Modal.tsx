"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content */}
            <div className={cn(
                "relative bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200",
                className
            )}>
                <div className="flex items-center justify-between mb-6">
                    {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {children}

            </div>
        </div>,
        document.body
    );
}
