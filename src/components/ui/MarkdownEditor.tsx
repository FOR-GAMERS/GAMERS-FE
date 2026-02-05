"use client";

import React, { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { 
    Bold, Italic, Strikethrough, 
    Heading1, Heading2, Heading3, 
    List, ListOrdered, Quote, Code, 
    Link as LinkIcon, Image as ImageIcon,
    Eye, Edit3, Loader2
} from 'lucide-react';
import { storageService } from '@/services/storage-service';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function MarkdownEditor({
    value,
    onChange,
    label,
    placeholder,
    className
}: MarkdownEditorProps) {
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const [isUploading, setIsUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const insertText = useCallback((before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousValue = textarea.value;
        const selectedText = previousValue.substring(start, end);

        const newValue = previousValue.substring(0, start) + 
                         before + selectedText + after + 
                         previousValue.substring(end);
        
        onChange(newValue);

        // Restore focus and selection
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        });
    }, [onChange]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Using contest banner upload as a general storage mechanism for now
            const response = await storageService.uploadContestBanner(file);
            if (response.data?.url) {
                insertText(`![Image](${response.data.url})`);
            }
        } catch (error) {
            console.error("Failed to upload image", error);
            // Optionally insert a placeholder or error text
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const ToolbarButton = ({ 
        icon: Icon, 
        onClick, 
        tooltip, 
        active = false 
    }: { 
        icon: any; 
        onClick: () => void; 
        tooltip: string;
        active?: boolean;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={tooltip}
            className={cn(
                "p-2 rounded-md transition-all text-muted-foreground hover:text-white hover:bg-white/10",
                active && "bg-white/10 text-neon-cyan"
            )}
        >
            <Icon size={16} />
        </button>
    );

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-sm font-medium text-muted-foreground ml-1">{label}</label>}
            
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0f172a] flex flex-col h-[500px]">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/20 overflow-x-auto">
                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={Bold} onClick={() => insertText("**", "**")} tooltip="Bold" />
                        <ToolbarButton icon={Italic} onClick={() => insertText("*", "*")} tooltip="Italic" />
                        <ToolbarButton icon={Strikethrough} onClick={() => insertText("~~", "~~")} tooltip="Strikethrough" />
                        <div className="w-px h-4 bg-white/10 mx-2" />
                        <ToolbarButton icon={Heading1} onClick={() => insertText("# ")} tooltip="Heading 1" />
                        <ToolbarButton icon={Heading2} onClick={() => insertText("## ")} tooltip="Heading 2" />
                        <ToolbarButton icon={Heading3} onClick={() => insertText("### ")} tooltip="Heading 3" />
                        <div className="w-px h-4 bg-white/10 mx-2" />
                        <ToolbarButton icon={List} onClick={() => insertText("- ")} tooltip="Bullet List" />
                        <ToolbarButton icon={ListOrdered} onClick={() => insertText("1. ")} tooltip="Numbered List" />
                        <div className="w-px h-4 bg-white/10 mx-2" />
                        <ToolbarButton icon={Quote} onClick={() => insertText("> ")} tooltip="Quote" />
                        <ToolbarButton icon={Code} onClick={() => insertText("`", "`")} tooltip="Code" />
                        <div className="w-px h-4 bg-white/10 mx-2" />
                        <ToolbarButton icon={LinkIcon} onClick={() => insertText("[", "](url)")} tooltip="Link" />
                        <div className="relative">
                            <ToolbarButton 
                                icon={isUploading ? Loader2 : ImageIcon} 
                                onClick={() => fileInputRef.current?.click()} 
                                tooltip="Insert Image" 
                            />
                            {isUploading && <Loader2 className="absolute top-2 left-2 animate-spin text-neon-cyan" size={16} />}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    
                    <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5 ml-4">
                        <button
                            type="button"
                            onClick={() => setTab('write')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-all",
                                tab === 'write' ? "bg-white/10 text-white font-bold shadow-sm" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <Edit3 size={12} /> Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('preview')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-all",
                                tab === 'preview' ? "bg-white/10 text-white font-bold shadow-sm" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <Eye size={12} /> Preview
                        </button>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 relative">
                    {tab === 'write' ? (
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="w-full h-full bg-[#0f172a] p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none text-white overflow-y-auto"
                        />
                    ) : (
                        <div className="w-full h-full bg-black/40 p-6 overflow-y-auto prose prose-invert prose-sm max-w-none">
                            {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-muted-foreground/30 text-center mt-10">Nothing to preview</p>}
                        </div>
                    )}
                </div>
                
                {/* Status Bar */}
                <div className="px-4 py-2 bg-black/40 border-t border-white/5 text-xs text-muted-foreground flex justify-end">
                    {value.length} characters
                </div>
            </div>
        </div>
    );
}
