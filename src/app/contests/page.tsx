"use client";

import { useState, useRef } from "react";
import Footer from "@/components/landing/Footer";
import ContestCard from "@/components/contests/ContestCard";
import ContestHero from "@/components/contests/ContestHero";
import { ContestResponse, ContestStatus } from "@/types/contest";
import { Trophy, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// MOCK DATA GENERATOR
const generateMockContests = (count: number): ContestResponse[] => {
  return Array.from({ length: count }).map((_, i) => ({
    contest_id: i + 1,
    title: `Community Valorant Cup #${i + 1}`,
    description: "Join the ultimate competitive experience. High rewards and fast servers.",
    max_team_count: (i % 3 === 0) ? 16 : 32,
    total_point: (i + 1) * 100,
    contest_type: (i % 2 === 0) ? "TEAM" : "INDIVIDUAL",
    contest_status: (i % 5 === 0) ? "RECRUITING" : (i % 5 === 1) ? "ONGOING" : "FINISHED",
    created_at: new Date(Date.now() - i * 86400000).toISOString(), // Days ago
  }));
};

const MOCK_DATA = generateMockContests(500);

export default function Contests() {
  const [filter, setFilter] = useState<"LATEST" | "STATUS">("LATEST");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting Logic
  const sortedData = [...MOCK_DATA].sort((a, b) => {
    if (filter === "LATEST") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
        const priority: Record<ContestStatus, number> = { 
            "RECRUITING": 0, "ONGOING": 1, "PREPARING": 2, "FINISHED": 3 
        };
        return priority[a.contest_status] - priority[b.contest_status];
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate Page Numbers (1~9 ... Last)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 9;

    if (totalPages <= 10) {
        // Show all if small count
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        // Complex logic for large counts
        if (currentPage <= 6) {
            // Early pages: Show 1 to 9 ... Last
            for (let i = 1; i <= 9; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 5) {
            // End pages: Show 1 ... Last-8 to Last
            pages.push(1);
            pages.push("...");
            for (let i = totalPages - 8; i <= totalPages; i++) pages.push(i);
        } else {
            // Middle pages: 1 ... Cur-3 to Cur+3 ... Last
            pages.push(1);
            pages.push("...");
            for (let i = currentPage - 3; i <= currentPage + 3; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        }
    }
    return pages;
  };

  // Animation Ref
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Kill previous ScrollTriggers to prevent duplicates on re-render/filter change
    // Using a simple from animation with batch or stagger
    if (!gridRef.current) return;
    
    gsap.fromTo(gridRef.current.children, 
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: 0.05, 
            ease: "power2.out",
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top bottom-=100", // Start when top of grid hits bottom-100px
                toggleActions: "play none none reverse"
            }
        }
    );
  }, [currentData]); // Re-run when data changes (pagination/filter)

  return (
    <main className="min-h-screen pb-20 bg-background text-foreground">
      {/* Hero Banner (Full Width) */}
      <ContestHero />
      
      <div className="container mx-auto px-4 mt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <Trophy className="text-primary w-8 h-8 md:w-10 md:h-10" />
                Active Contests
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
                        <option value="LATEST">Sort by: Created Date</option>
                        <option value="STATUS">Sort by: Ongoing/Recruiting</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Contest Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
          {currentData.map((contest) => (
            <ContestCard key={contest.contest_id} contest={contest} />
          ))}
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
