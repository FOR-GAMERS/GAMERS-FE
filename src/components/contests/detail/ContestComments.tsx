"use client";

import { MessageSquare, Send, MoreVertical, Trash2, Edit2, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
  avatarUrl?: string;
}

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface ContestCommentsProps {
  comments: Comment[];
  isLoggedIn: boolean;
  currentUser?: User;
}

export default function ContestComments({ comments, isLoggedIn, currentUser }: ContestCommentsProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn) return;
    console.log("Submit comment:", newComment);
    setNewComment("");
  };

  return (
    <section className="max-w-4xl mx-auto pt-16 border-t border-white/10">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <MessageSquare className="text-neon-purple" />
        Comments <span className="text-muted-foreground text-lg font-normal">({comments.length})</span>
      </h3>

      {/* Input Area */}
      <div className="relative mb-12 group">
        {!isLoggedIn && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl border border-white/5 transition-opacity">
                <p className="text-sm text-gray-400 font-medium">
                    댓글을 작성하려면 <span className="text-neon-cyan underline cursor-pointer hover:text-cyan-300">로그인</span>이 필요합니다.
                </p>
            </div>
        )}

        <form onSubmit={handleSubmit} className={cn("flex gap-4 transition-opacity duration-300", !isLoggedIn && "opacity-40 select-none pointer-events-none")}>
            <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/10">
                {currentUser?.avatarUrl ? (
                    <Image src={currentUser.avatarUrl} alt={currentUser.name} fill className="object-cover" />
                ) : (
                    <User size={20} className="text-muted-foreground" />
                )}
            </div>
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isLoggedIn ? "대회에 대해 궁금한 점을 남겨보세요..." : "로그인이 필요합니다."}
                    disabled={!isLoggedIn}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 pr-12 text-white focus:outline-none focus:border-neon-purple focus:bg-white/10 transition-all placeholder:text-muted-foreground/50"
                />
                <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg text-neon-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newComment.trim() || !isLoggedIn}
                >
                    <Send size={18} />
                </button>
            </div>
        </form>
      </div>

      {/* Comment List */}
      <div className="space-y-8">
        {comments.map((comment) => {
            const isMyComment = isLoggedIn && currentUser?.id === comment.authorId;
            
            return (
                <div key={comment.id} className="flex gap-4 group animate-fade-in-up">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10">
                         {comment.avatarUrl ? (
                            <Image src={comment.avatarUrl} alt={comment.author} fill className="object-cover" />
                         ) : (
                            <span className="text-xs font-bold text-gray-400">{comment.author[0]}</span>
                         )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={cn("font-bold text-sm", isMyComment ? "text-neon-cyan" : "text-white")}>
                                    {comment.author}
                                </span>
                                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                            </div>
                            
                            {/* Action Buttons (Only for Owner) */}
                            {isMyComment && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded transition-colors" title="수정">
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="삭제">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                </div>
            );
        })}
        {comments.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-white/10 rounded-xl bg-white/5">
                아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
            </div>
        )}
      </div>
    </section>
  );
}
