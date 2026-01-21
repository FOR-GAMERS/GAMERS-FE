"use client";

import { useState, useRef } from "react";
import Footer from "@/components/landing/Footer";
import ContestCard from "@/components/contests/ContestCard";
import ContestHero from "@/components/contests/ContestHero";
import { Trophy, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useContests } from "@/hooks/use-contests";

export default function Contests() {
  const [filter, setFilter] = useState<"LATEST" | "STATUS">("LATEST");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data, isLoading, error } = useContests({
    page: currentPage,
    page_size: itemsPerPage,
    sort_by: "created_at",
    order: "desc"
  });
  
  const contests = data?.data || [];
  const pagination = data;
  
  const contestList = data?.data?.data || [];
  const totalPages = data?.data?.total_pages || 1;

  // Animation Ref
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current || isLoading) return;
    
    // Clear any existing inline styles (important for responsiveness/updates)
    gsap.set(gridRef.current.children, { clearProps: "all" });

    gsap.fromTo(gridRef.current.children, 
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: 0.05, 
            ease: "power2.out",
            clearProps: "all", // Ensure clean state after animation
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top bottom-=100", 
                toggleActions: "play none none reverse"
            }
        }
    );
  }, [contestList, isLoading]); 

  // Generate Page Numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 10) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 6) {
            for (let i = 1; i <= 9; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 5) {
            pages.push(1);
            pages.push("...");
            for (let i = totalPages - 8; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push("...");
            for (let i = currentPage - 3; i <= currentPage + 3; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        }
    }
    return pages;
  };

  return (
    <main className="relative min-h-screen pb-20 bg-background text-foreground">
      {/* Hero Banner (Full Width) */}
      <ContestHero />
      
      <div className="container mx-auto px-4 mt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <Trophy className="text-primary w-8 h-8 md:w-10 md:h-10" />
                開催中の大会
            </h1>
            
            <div className="flex items-center gap-3">
                <div className="relative w-full md:w-auto">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select 
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value as "LATEST" | "STATUS");
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-auto appearance-none bg-[#0f172a] border border-white/10 rounded-full pl-10 pr-8 py-2 text-sm font-bold focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                        <option value="LATEST">並び替え: 作成日</option>
                        <option value="STATUS">並び替え: ステータス</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Contest Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
          {isLoading ? (
             // Simple Loading State (or skeletons could be better but sticking to minimal change first)
             <div className="col-span-full h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
             </div>
          ) : contestList.length > 0 ? (
            contestList.map((contest: any) => ( // contest type should be inferred but adding explicit check if needed, 'any' for quick fix or ContestResponse
                <ContestCard key={contest.contest_id} contest={contest} />
            ))
          ) : (
             <div className="col-span-full h-96 flex flex-col items-center justify-center text-muted-foreground">
                <Trophy className="w-16 h-16 mb-4 opacity-20" />
                <p>No contests found.</p>
             </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-2 select-none">
            {/* Jump -10 */}
            <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 10))}
                className="p-2 text-muted-foreground hover:text-white disabled:opacity-30 transition-colors"
            >
                <ChevronsLeft size={20} />
            </button>
            
            {/* Prev */}
            <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 text-muted-foreground hover:text-white disabled:opacity-30 transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            
            {/* Page Numbers */}
            <div className="flex gap-2 mx-2">
                {getPageNumbers().map((p, i) => (
                    p === "..." ? (
                        <span key={`el-${i}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground font-bold">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p as number)}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                                currentPage === p 
                                ? "bg-primary text-black scale-110 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                                : "bg-secondary/30 text-muted-foreground hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {p}
                        </button>
                    )
                ))}
            </div>

            {/* Next */}
            <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 text-muted-foreground hover:text-white disabled:opacity-30 transition-colors"
            >
                <ChevronRight size={20} />
            </button>

            {/* Jump +10 */}
            <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 10))}
                className="p-2 text-muted-foreground hover:text-white disabled:opacity-30 transition-colors"
            >
                <ChevronsRight size={20} />
            </button>
        </div>

      </div>
      <Footer />
    </main>
  );
}
