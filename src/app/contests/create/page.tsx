"use client";

import { ChevronLeft, Image as ImageIcon, Trash2, Upload, Hash, Server, Edit3, Eye, Calendar, Plus, X, Clock, Settings, Trophy, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Mock Data for Discord
const MOCK_GUILDS = [
  { id: "g1", name: "GAMERS Official", icon: null },
  { id: "g2", name: "Valorant KR Community", icon: null },
  { id: "g3", name: "My Private Server", icon: null },
];

const MOCK_CHANNELS: Record<string, { id: string; name: string }[]> = {
  "g1": [{ id: "c1", name: "📢-announcements" }, { id: "c2", name: "🏆-tournaments" }],
  "g2": [{ id: "c3", name: "🎉-events" }, { id: "c4", name: "💬-general" }],
  "g3": [{ id: "c5", name: "🔒-admin-only" }],
};

export default function CreateContestPage() {
  const router = useRouter();

  // State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedGuild, setSelectedGuild] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  
  // DTO State
  const [gameType, setGameType] = useState("VALORANT");
  const [contestType, setContestType] = useState("TEAM");
  const [maxTeamCount, setMaxTeamCount] = useState(16);
  const [totalTeamMember, setTotalTeamMember] = useState(5);
  const [autoStart, setAutoStart] = useState(false);
  const [tierPoints, setTierPoints] = useState<Record<string, number>>({});
  
  // Games State
  const [games, setGames] = useState<{ id: number; startTime: string }[]>([]);
  
  // Mobile Tab State for Editor
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Animation
  useGSAP(() => {
    gsap.from(".animate-section", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all"
    });
  }, { scope: containerRef });

  // Validation Logic
  const isValid = 
      title.length > 0 && 
      thumbnailPreview !== null && 
      description.length > 0 && 
      selectedChannel !== "" &&
      games.length > 0; // Check if at least one game is added

  // Submit Handler
  const handleSubmit = () => {
    if (!isValid) return;

    // Construct CreateContestRequest
    const requestData = {
        title,
        description,
        contest_type: contestType,
        game_type: gameType,
        max_team_count: maxTeamCount,
        total_team_member: totalTeamMember,
        auto_start: autoStart,
        discord_guild_id: selectedGuild,
        discord_text_channel_id: selectedChannel,
        games: games.map(g => ({ start_time: new Date(g.startTime).toISOString() })),
        score_table: gameType === "VALORANT" ? {
            table_name: `${title} - Score Table`,
            ...tierPoints
        } : undefined
    };

    console.log("🚀 [CreateContestRequest] Final Payload:", requestData);
    alert("Check Console for Payload!");
  };

  // Handlers
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-deep-black text-white relative overflow-hidden pb-32">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/10 pointer-events-none" />
      
      {/* Sticky Header - Lower Z-index than Global Header (z-50) */}
      <header className="sticky top-0 z-40 w-full h-16 bg-deep-black/80 backdrop-blur-md border-b border-white/5 flex items-center">
        <div className="container mx-auto px-4 max-w-5xl flex items-center gap-4">
            <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-bold tracking-tight">대회 생성하기</h1>
        </div>
      </header>
      
      {/* Main Content Container */}
      <div ref={containerRef} className="container mx-auto px-4 py-8 max-w-5xl relative z-10 space-y-12">
        
        {/* 1. Title Edit Section */}
        <section className="animate-section space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">대회 제목</label>
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={64}
                placeholder="대회 제목을 입력하세요 (예: 2024 발로란트 챔피언십)"
                className="w-full bg-transparent text-3xl md:text-5xl font-black placeholder:text-white/10 border-b-2 border-white/10 focus:border-neon-cyan focus:outline-none py-4 transition-colors"
            />
            <div className="text-right text-xs text-muted-foreground">
                {title.length} / 64
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Left Column: Thumbnail (4 cols) */}
            <section className="animate-section lg:col-span-5 space-y-4">
                <div className="flex justify-end items-center">
                    {thumbnailPreview && (
                        <button 
                            onClick={() => setThumbnailPreview(null)}
                            className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                        >
                            <Trash2 size={12} /> 이미지 삭제
                        </button>
                    )}
                </div>

                <div 
                    className={cn(
                        "aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group max-h-[300px] lg:max-h-none",
                        thumbnailPreview ? "border-white/10" : "border-white/20 hover:border-neon-purple hover:bg-white/5"
                    )}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                    />
                    
                    {thumbnailPreview ? (
                        <>
                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                <Upload size={20} className="mr-2" /> 변경하기
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted-foreground group-hover:text-neon-purple group-hover:scale-110 transition-all duration-300">
                                <ImageIcon size={32} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white group-hover:text-neon-purple transition-colors">클릭하여 업로드</p>
                                <p className="text-xs text-muted-foreground mt-1">또는 파일을 여기로 드래그하세요</p>
                            </div>
                            <p className="text-[10px] text-white/30">권장 비율 4:3 (JPG, PNG)</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Right Column: Details & Settings (8 cols) */}
            <section className="lg:col-span-7 space-y-8">
                
                {/* 3. Discord Mock Integration */}
                <div className="animate-section bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                        <span className="w-1 h-6 bg-[#5865F2] rounded-full block"></span>
                        Discord 연동
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Server Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <Server size={12} /> Target Server
                            </label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#5865F2] transition-colors appearance-none cursor-pointer"
                                    value={selectedGuild}
                                    onChange={(e) => {
                                        setSelectedGuild(e.target.value);
                                        setSelectedChannel(""); // Reset channel
                                    }}
                                >
                                    <option value="" disabled>서버를 선택하세요</option>
                                    {MOCK_GUILDS.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Channel Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <Hash size={12} /> Notification Channel
                            </label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#5865F2] transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={selectedChannel}
                                    onChange={(e) => setSelectedChannel(e.target.value)}
                                    disabled={!selectedGuild}
                                >
                                    <option value="" disabled>
                                        {selectedGuild ? "채널을 선택하세요" : "서버를 먼저 선택하세요"}
                                    </option>
                                    {selectedGuild && MOCK_CHANNELS[selectedGuild]?.map(c => (
                                        <option key={c.id} value={c.id}>#{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                    ▼
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg p-4 text-xs text-[#5865F2] leading-relaxed">
                        ⚠️ 대회가 생성되면 선택된 디스코드 채널에 자동으로 <strong>모집 공고</strong>가 전송됩니다. 봇 권한을 확인해주세요.
                    </div>
                </div>
            </section>
        </div>

        {/* 4. Text Edit Section (Split View for Desktop, Tabs for Mobile) */}
        <div className="animate-section space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground ml-1">상세 내용 (Markdown)</label>
                
                {/* Mobile Tabs */}
                <div className="flex lg:hidden bg-white/5 rounded-lg p-1 gap-1">
                    <button 
                        onClick={() => setEditorTab('write')}
                        className={cn("px-3 py-1 text-xs rounded-md transition-all flex items-center gap-1", editorTab === 'write' ? "bg-white/10 text-white font-bold" : "text-muted-foreground")}
                    >
                        <Edit3 size={12} /> Edit
                    </button>
                    <button 
                        onClick={() => setEditorTab('preview')}
                        className={cn("px-3 py-1 text-xs rounded-md transition-all flex items-center gap-1", editorTab === 'preview' ? "bg-white/10 text-white font-bold" : "text-muted-foreground")}
                    >
                        <Eye size={12} /> Preview
                    </button>
                </div>

                <span className="hidden lg:inline text-[10px] bg-white/10 px-2 py-1 rounded text-muted-foreground uppercase">Split View Active</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
                {/* Editor: Visible if using 'write' tab or on Desktop (lg) */}
                <div className={cn("relative h-full", editorTab === 'preview' && "hidden lg:block")}>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="# 대회 상세 내용을 입력하세요 on\n\n- 규칙 설명\n- 일정 안내\n- 상금 정보"
                        className="w-full h-full bg-[#0f172a] border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all placeholder:text-white/20"
                    />
                </div>

                {/* Preview: Visible if using 'preview' tab or on Desktop (lg) */}
                <div className={cn("h-full bg-black/40 border border-white/5 rounded-xl p-6 overflow-y-auto", editorTab === 'write' && "hidden lg:block")}>
                    <div className="prose prose-invert prose-sm max-w-none">
                        {description ? (
                            <ReactMarkdown>{description}</ReactMarkdown>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 select-none">
                                <p className="text-sm">미리보기 영역입니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>



        {/* 5. Games Schedule Section */}
        <div className="animate-section space-y-4">
             <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="text-neon-cyan" size={20} />
                    Games Schedule
                </h3>
                <button 
                    onClick={() => {
                        if (games.length < 5) {
                            setGames([...games, { id: Date.now(), startTime: "" }]);
                        }
                    }}
                    disabled={games.length >= 5}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    <Plus size={14} /> Add Game ({games.length}/5)
                </button>
             </div>

             <div className="space-y-3">
                {games.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-muted-foreground text-sm">
                        No games scheduled. Add at least one game.
                    </div>
                )}
                {games.map((game, index) => (
                    <div key={game.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-muted-foreground block mb-1">Start Time</label>
                            <input 
                                type="datetime-local" 
                                value={game.startTime}
                                onChange={(e) => {
                                    const newGames = [...games];
                                    newGames[index].startTime = e.target.value;
                                    setGames(newGames);
                                }}
                                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-neon-cyan outline-none w-full max-w-[300px]"
                            />
                        </div>
                        <button 
                            onClick={() => setGames(games.filter(g => g.id !== game.id))}
                            className="p-2 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
             </div>
        </div>

        {/* 6. Option Section (Tier Point Table) - Conditional */}
        {gameType === "VALORANT" && (
            <div className="animate-section space-y-4">
                <h3 className="text-lg font-bold border-b border-white/5 pb-4">
                    Settings: Valorant Rank Points
                </h3>
                
                <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[300px]">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Rank Tier</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ascendant", "Immortal", "Radiant"].map((tier) => (
                                    <tr key={tier} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{tier}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative max-w-[120px]">
                                                <input 
                                                    type="number" 
                                                    placeholder="0"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-right focus:outline-none focus:border-neon-purple transition-all font-mono"
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        setTierPoints(prev => ({ ...prev, [tier]: val }));
                                                    }}
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Pt</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
        
        {/* Sticky Upload Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-deep-black/90 backdrop-blur-xl border-t border-white/5 z-[60]">
            <div className="container mx-auto max-w-5xl flex items-center justify-between">
                <div className="text-sm text-muted-foreground hidden md:block">
                    <span className={cn("font-bold transition-colors duration-300", isValid ? "text-neon-cyan" : "text-white/30")}>
                        {isValid ? "All Ready!" : "필수 항목을 모두 입력해주세요"}
                    </span>
                </div>
                
                <button
                    disabled={!isValid}
                    onClick={handleSubmit}
                    className={cn(
                        "w-full md:w-auto px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2",
                        isValid 
                            ? "bg-neon-cyan text-black hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] scale-100" 
                            : "bg-white/10 text-white/30 cursor-not-allowed scale-95"
                    )}
                >
                    <Upload size={18} />
                    대회 생성하기
                </button>
            </div>
        </div>

      </div>
    </main>
  );
}
