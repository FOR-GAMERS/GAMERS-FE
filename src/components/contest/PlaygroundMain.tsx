'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Users, 
  Shield, 
  Trophy, 
  ClipboardList,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Crown,
} from 'lucide-react';
import { getValorantRankName } from "@/lib/valorant-utils";
import { useToast } from '@/context/ToastContext';
import { ContestResponse } from '@/types/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contestService } from '@/services/contest-service';
import { Loader2, AlertCircle } from 'lucide-react';
import AnimatedSelect from '@/components/ui/AnimatedSelect';

const MENU_ITEMS = [
  { name: 'ホーム', id: 'Home', icon: LayoutDashboard },
  { name: '参加者一覧', id: 'Member List', icon: Users },
  { name: 'マイチーム', id: 'My Team', icon: Shield },
  { name: 'トーナメント表', id: 'Bracket', icon: Trophy },
  { name: '結果', id: 'Result', icon: ClipboardList },
];

// --- Mock Data for unsupported features ---
const MOCK_MY_TEAM = {
    name: "Night City Runners",
    capacity: 5,
    members: [
        { id: 1, name: "V_Cyberpunk", role: "Captain", avatarColor: "bg-neon-cyan" },
        { id: 2, name: "Jackie_W", role: "Fragger", avatarColor: "bg-red-500" },
        { id: 3, name: "Judy_Tech", role: "Support", avatarColor: "bg-neon-purple" },
    ]
};

const MOCK_RESULTS = [
    { rank: 1, team: "Night City Runners", win: 15, lose: 2, prize: "$10,000" },
    { rank: 2, team: "Arasaka Corp", win: 14, lose: 3, prize: "$5,000" },
    { rank: 3, team: "Militech Ops", win: 12, lose: 5, prize: "$2,500" },
    { rank: 4, team: "Kang Tao", win: 10, lose: 7, prize: "$1,000" },
    { rank: 5, team: "Aldecaldos", win: 8, lose: 9, prize: "-" },
];

const MOCK_BRACKET_ROUNDS = [
  {
    id: 'quarter',
    name: '準々決勝',
    matches: [
      { id: 'm1', t1: 'Runners', t2: 'Arasaka', t1Score: 2, t2Score: 1, winner: 'Runners', status: 'finished' },
      { id: 'm2', t1: 'Militech', t2: 'Kang Tao', t1Score: 0, t2Score: 2, winner: 'Kang Tao', status: 'finished' },
      { id: 'm3', t1: 'Aldecaldos', t2: 'Mox', t1Score: 1, t2Score: 2, winner: 'Mox', status: 'finished' },
      { id: 'm4', t1: 'Animals', t2: 'Voodoo', t1Score: 0, t2Score: 0, winner: null, status: 'scheduled' },
    ]
  },
  {
    id: 'semi',
    name: '準決勝',
    matches: [
      { id: 'm5', t1: 'Runners', t2: 'Kang Tao', t1Score: 0, t2Score: 0, winner: null, status: 'scheduled' },
      { id: 'm6', t1: 'Mox', t2: 'TBD', t1Score: 0, t2Score: 0, winner: null, status: 'tbd' },
    ]
  },
  {
    id: 'final',
    name: '決勝',
    matches: [
      { id: 'm7', t1: 'TBD', t2: 'TBD', t1Score: 0, t2Score: 0, winner: null, status: 'tbd' },
    ]
  }
];

interface PlaygroundMainProps {
  contest: ContestResponse;
}

export default function PlaygroundMain({ contest }: PlaygroundMainProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Sidebar Stagger Animation
  useGSAP(() => {
    gsap.fromTo('.menu-item', 
      { x: -30, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        stagger: 0.1, 
        duration: 0.8, 
        ease: 'power2.out',
        delay: 0.5 
      }
    );
  }, { scope: sidebarRef });

  const renderContent = () => {
    switch (activeTab) {
      case 'Home': return <HomeView contest={contest} />;
      case 'Game List': return <GameListView contestId={contest.contest_id} />;
      case 'Member List': return <MemberListView contestId={contest.contest_id} />;
      case 'My Team': return <MyTeamView contestId={contest.contest_id} />;
      case 'Bracket': return <BracketView />;
      case 'Result': return <ResultView />;
      default: return <HomeView contest={contest} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* List Section (Navigation) */}
      <aside className="lg:col-span-1 flex flex-col gap-4" ref={sidebarRef}>
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md shadow-lg sticky top-8">
          <h2 className="text-lg font-semibold text-neon-purple mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-neon-purple rounded-full shadow-[0_0_8px_#b23aff]"></span>
            メニュー
          </h2>
          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`menu-item w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group flex items-center gap-3 ${
                  activeTab === item.id
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors ${
                    activeTab === item.id ? 'text-neon-cyan' : 'group-hover:text-white'
                  }`}
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* View Section (Content) */}
      <main className="lg:col-span-3 min-h-[500px]">
        {renderContent()}
      </main>
    </div>
  );
}

// --- Views ---

function HomeView({ contest }: { contest: ContestResponse }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
       <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-neutral-800 pb-4">
            <LayoutDashboard className="text-neon-cyan" size={32} />
            {contest.title}
          </h2>
          
          <div className="prose prose-invert prose-p:text-neutral-400 prose-headings:text-white prose-a:text-neon-cyan prose-strong:text-white max-w-none">
            <p className="text-neutral-300 whitespace-pre-wrap">{contest.description || '大会の説明はありません。'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-neutral-800">
             <div className="p-4 rounded-xl bg-deep-black/50 border border-neutral-800 flex justify-between items-center group hover:border-neon-cyan/30 transition-colors cursor-default">
                <span className="text-sm text-gray-500">ステータス</span>
                <div className="text-xl text-neon-cyan font-bold drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                    {contest.contest_status === 'ACTIVE' ? '開催中' : 
                     contest.contest_status === 'PENDING' ? '準備中' :
                     contest.contest_status === 'RECRUITING' ? '募集中' :
                     contest.contest_status === 'FINISHED' ? '終了' : 
                     contest.contest_status === 'CANCELLED' ? '中止' : contest.contest_status}
                </div>
             </div>
              <div className="p-4 rounded-xl bg-deep-black/50 border border-neutral-800 flex justify-between items-center group hover:border-neon-purple/30 transition-colors cursor-default">
                <span className="text-sm text-gray-500">参加チーム / 上限</span>
                <div className="text-xl text-white font-bold">{Math.floor((contest.total_team_member || 0) / 5)} / {contest.max_team_count || '∞'}</div>
             </div>
             <div className="p-4 rounded-xl bg-deep-black/50 border border-neutral-800 flex justify-between items-center group hover:border-neon-purple/30 transition-colors cursor-default">
                <span className="text-sm text-gray-500">ゲームタイプ</span>
                <div className="text-xl text-white font-bold">{contest.game_type}</div>
             </div>
          </div>
       </div>
    </div>
  );
}

function GameListView({ contestId }: { contestId: number }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const { data: gamesResponse, isLoading } = useQuery({
      queryKey: ['contest-games', contestId],
      queryFn: () => contestService.getContestGames(contestId)
  });

  const games = gamesResponse?.data || [];

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
      return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan"/></div>;
  }

  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Gamepad2 className="text-neon-cyan" />
        ゲーム一覧
      </h2>
      
      {games.length === 0 ? (
          <div className="text-neutral-500 text-center py-8">ゲームが登録されていません。</div>
      ) : (
        <div className="space-y-3">
            {games.map((game) => {
                const isExpanded = expandedId === game.game_id;
                return (
                <div 
                    key={game.game_id} 
                    className={`rounded-xl border transition-all duration-300 overflow-hidden will-change-transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neon-purple/5 ${
                    isExpanded 
                        ? 'bg-neutral-900/60 border-neon-cyan/30 shadow-[0_0_10px_rgba(0,243,255,0.05)]' 
                        : 'bg-neutral-900/30 border-neutral-800 hover:border-neon-purple/50'
                    }`}
                >
                    <button 
                    onClick={() => toggleAccordion(game.game_id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    >
                        <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                            isExpanded ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-neutral-800 text-neutral-500'
                        }`}>
                            <Gamepad2 size={24} />
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg transition-colors ${isExpanded ? 'text-white' : 'text-neutral-300'}`}>
                            Game #{game.game_id}
                            </h3>
                            <p className="text-xs text-neutral-500 font-mono tracking-wide">Status: {game.game_status}</p>
                        </div>
                        </div>
                        {isExpanded ? <ChevronUp className="text-neon-cyan" /> : <ChevronDown className="text-neutral-600" />}
                    </button>
                    
                    <div 
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                    >
                    <div className="overflow-hidden">
                        <div className="p-5 pt-0 border-t border-white/5 text-neutral-400 text-sm leading-relaxed space-y-4">
                        <div>
                            <strong className="text-white block mb-1">形式</strong>
                            {game.game_team_type}
                        </div>
                        <div className="p-3 rounded-lg bg-deep-black/30 border border-white/5">
                            <strong className="text-neon-purple block mb-1 text-xs uppercase tracking-wider">作成日</strong>
                            {new Date(game.created_at).toLocaleDateString()}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                );
            })}
        </div>
      )}
    </div>
  );
}

import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useMe } from '@/hooks/use-user';

// ... (previous imports remain, make sure to check for duplicates if replacing whole file or parts) 
// Actually I am replacing from line 285 onwards (MemberListView and below) to implement changes safely.
// Wait, I should do targeted edits or I will lose context if I replace too much.
// But the changes are structural in MemberListView and MyTeamView. 

// Let's implement MemberListView first with Pagination/Sort.

function MemberListView({ contestId }: { contestId: number }) {
  const { addToast } = useToast();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('point');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const PAGE_SIZE = 10;

  const { data: membersResponse, isLoading, refetch } = useQuery({
      queryKey: ['contest-members', contestId, page, sortBy, order],
      queryFn: () => contestService.getContestMembers(contestId, { page, page_size: PAGE_SIZE, sort_by: sortBy, order })
  });

  // Fetch games to find "Active" game for invitation
  const { data: gamesResponse } = useQuery({
      queryKey: ['contest-games', contestId],
      queryFn: () => contestService.getContestGames(contestId)
  });
  const activeGameId = gamesResponse?.data?.[0]?.game_id; // Naive: assume first game is relevant

  // Fetch Game Members to check if I am in a team (and my role)
  const { data: gameMembersRes } = useQuery({
      queryKey: ['game-members', activeGameId],
      queryFn: () => activeGameId ? contestService.getGameMembers(activeGameId) : Promise.resolve(null),
      enabled: !!activeGameId
  });

  const { data: me } = useMe();
  const myGameMemberProfile = gameMembersRes?.data?.find(m => m.user_id === me?.data?.user_id);
  const myTeamId = myGameMemberProfile?.team_id;
  const iAmLeader = myGameMemberProfile?.member_type === 'LEADER'; // Verify actual value 'LEADER' from API
  // Note: API for game members might use different enums, let's assume 'LEADER'/'MEMBER' based on context or 'LeaderTypeMember' etc.
  // Actually standard for games might be different. Let's assume standard 'LEADER'.

  const members = membersResponse?.data?.data || [];
  const totalPages = membersResponse?.data?.total_pages || 1;

  const handleInvite = async (userId: number, username: string) => {
      if (!activeGameId) return;
      try {
          await contestService.inviteUserToTeam(activeGameId, userId);
          addToast(`${username}を招待しました！`, 'success');
      } catch (e) {
          addToast('招待に失敗しました。', 'error');
      }
  };

  if (isLoading) {
      return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan"/></div>;
  }

  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-neon-cyan" />
            参加者一覧
        </h2>
        
        <div className="flex items-center gap-3">
             <div className="w-48">
                <AnimatedSelect 
                    value={sortBy}
                    onChange={(val: string | number) => setSortBy(val as string)}
                    options={[
                        { value: "point", label: "ポイント順" },
                        { value: "current_tier", label: "現在のランク順" },
                        { value: "peak_tier", label: "最高ランク順" }
                    ]}
                    startIcon={<Filter size={16} />}
                />
            </div>
             <div className="w-32">
                <AnimatedSelect 
                    value={order}
                    onChange={(val: string | number) => setOrder(val as 'asc' | 'desc')}
                    options={[
                        { value: "desc", label: "降順" },
                        { value: "asc", label: "昇順" }
                    ]}
                />
            </div>
        </div>
      </div>
      
      {members.length === 0 ? (
          <div className="text-neutral-500 text-center py-8">参加者がいません。</div>
      ) : (
      <>
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
              <tr className="border-b border-neutral-800 text-sm font-medium text-neutral-500 uppercase tracking-wider">
               <th className="py-4 px-4">名前</th>
               <th className="py-4 px-4">タグ</th>
               <th className="py-4 px-4">現在ランク</th>
               <th className="py-4 px-4">最高ランク</th>
               <th className="py-4 px-4 text-right">ポイント</th>
               {iAmLeader && <th className="py-4 px-4 text-right">操作</th>}
             </tr>
           </thead>
           <tbody className="divide-y divide-neutral-800">
             {members.map((member) => {
               // Avatar Logic
                const getAvatarSrc = () => {
                    if (member.avatar?.startsWith('http')) return member.avatar;
                    if (member.profile_key && member.avatar) {
                        return `https://cdn.discordapp.com/avatars/${member.profile_key}/${member.avatar}.png`;
                    }
                    return undefined;
                };
                const avatarSrc = getAvatarSrc();

               // Invite Logic CHECK: Can I invite this person?
               // 1. I must be leader (checked by column)
               // 2. Target must not be in my team (Need to check game members for this target too?)
               // Ideally we should check if they are already in a team. 
               // For now, button is shown, backend will error if invalid.
               
               // Check if this member is ME or in my team?
               // The Member list returns ContestMembers. We don't verify their team status here easily without mapping gameMembers.
               // Let's simplified: Show invite if I'm leader.

               return (
               <tr key={member.user_id} className="group hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neon-purple/10 transform transition-all duration-300 hover:-translate-y-1 will-change-transform text-sm">
                 <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 group-hover:ring-neon-cyan/50 transition-all overflow-hidden">
                       {avatarSrc ? (
                           <img src={avatarSrc} alt={member.username} className="w-full h-full object-cover" />
                       ) : (
                           <span>{member.username.substring(0,2).toUpperCase()}</span>
                       )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            {member.username}
                            {member.leader_type === 'LEADER' && <span className="text-[10px] bg-neon-cyan/20 text-neon-cyan px-1.5 py-0.5 rounded border border-neon-cyan/30">LEADER</span>}
                        </div>
                    </div>
                 </td>
                 <td className="py-4 px-4 text-neutral-400 font-mono text-xs">#{member.tag}</td>
                 <td className="py-4 px-4 font-bold text-white">{member.current_tier_patched || getValorantRankName(member.current_tier)}</td>
                 <td className="py-4 px-4 font-bold text-neon-cyan">{member.peak_tier_patched || getValorantRankName(member.peak_tier)}</td>
                 <td className="py-4 px-4 text-right text-white font-mono">{member.point.toLocaleString()}</td>
                 {iAmLeader && me?.data?.user_id !== member.user_id && (
                   <td className="py-4 px-4 text-right">
                     <button 
                       onClick={() => handleInvite(member.user_id, member.username)}
                       className="text-xs bg-neon-purple/10 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto"
                     >
                       <UserPlus size={14} /> 招待
                     </button>
                   </td>
                 )}
                 {iAmLeader && me?.data?.user_id === member.user_id && (
                     <td className="py-4 px-4 text-right"><span className="text-neutral-600 text-xs">自分</span></td>
                 )}
               </tr>
             );
             })}
          </tbody>
        </table>
      </div>

       {/* Pagination Controls */}
       {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-30 disabled:hover:text-neutral-400 transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-neutral-400 font-mono">
                Page <span className="text-white font-bold">{page}</span> / {totalPages}
            </span>
            <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-30 disabled:hover:text-neutral-400 transition-all"
            >
                 <ChevronRight size={20} />
            </button>
        </div>
       )}
      </>
      )}
    </div>
  );
}

function MyTeamView({ contestId }: { contestId: number }) {
  const { addToast } = useToast();
  const { data: me } = useMe();
  const myUserId = me?.data?.user_id;
  const queryClient = useQueryClient();

  // Fetch games
  const { data: gamesResponse } = useQuery({
      queryKey: ['contest-games', contestId],
      queryFn: () => contestService.getContestGames(contestId)
  });
  const activeGameId = gamesResponse?.data?.[0]?.game_id;

  // Fetch Game Members
  const { data: gameMembersRes, isLoading, refetch } = useQuery({
      queryKey: ['game-members', activeGameId],
      queryFn: () => activeGameId ? contestService.getGameMembers(activeGameId) : Promise.resolve(null),
      enabled: !!activeGameId
  });

  const allMembers = gameMembersRes?.data || [];
  const myProfile = allMembers.find(m => m.user_id === myUserId);
  const myTeamId = myProfile?.team_id;
  const iAmLeader = myProfile?.member_type === 'LEADER';

  const teamMembers = myTeamId ? allMembers.filter(m => m.team_id === myTeamId) : [];
  
  const handleCreateTeam = async () => {
       try {
           await contestService.applyContest(contestId); // Assuming apply creates a team/entry
           addToast('チームを作成しました！', 'success');
           // Invalidate queries to refresh
           queryClient.invalidateQueries({ queryKey: ['game-members', activeGameId] });
           queryClient.invalidateQueries({ queryKey: ['contest-games', contestId] });
           refetch();
       } catch (e: any) {
           addToast(e.message || 'チーム作成に失敗しました。', 'error');
           console.error(e);
       }
  };

  const handleDeleteTeam = async () => {
      if (!activeGameId || !confirm('本当にチームを解散しますか？この操作は取り消せません。')) return;
      try {
          await contestService.deleteTeam(activeGameId);
          addToast('チームを解散しました。', 'success');
           queryClient.invalidateQueries({ queryKey: ['game-members', activeGameId] });
           refetch();
      } catch (e: any) {
           addToast('チームの解散に失敗しました。', 'error');
      }
  };

  const handleLeaveTeam = async () => {
       if (!activeGameId || !confirm('本当にチームを脱退しますか？')) return;
       try {
           await contestService.leaveTeam(activeGameId);
           addToast('チームを脱退しました。', 'success');
            queryClient.invalidateQueries({ queryKey: ['game-members', activeGameId] });
            refetch();
       } catch (e: any) {
           addToast('チームの脱退に失敗しました。', 'error');
       }
  };

  if (isLoading) {
      return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan"/></div>;
  }

  if (!myTeamId || teamMembers.length === 0) {
      return (
          <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up flex flex-col items-center justify-center min-h-[400px]">
             <Shield className="text-neutral-800 mb-4" size={48} />
             <h2 className="text-xl font-bold text-neutral-400 mb-2">チーム未所属</h2>
             <p className="text-neutral-600 text-sm mb-6">現在チームに所属していません。</p>
             <button 
                onClick={handleCreateTeam}
                className="bg-neon-cyan text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all flex items-center gap-2"
             >
                <UserPlus size={18} /> チームを作成
             </button>
          </div>
      );
  }

  const capacity = 5; // Default for Valorant
  const emptySlots = Math.max(0, capacity - teamMembers.length);

  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
           <Shield className="text-neon-cyan" />
           My Team
        </h2>
        <div className="flex items-center gap-4">
             <div className="text-sm text-neutral-500 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900">
                定員: <span className="text-white font-bold">{teamMembers.length}</span> / {capacity}
             </div>
             {iAmLeader ? (
                 <button 
                    onClick={handleDeleteTeam}
                    className="text-xs bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                 >
                    チーム解散
                 </button>
             ) : (
                 <button 
                    onClick={handleLeaveTeam}
                    className="text-xs bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                 >
                    チーム脱退
                 </button>
             )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {teamMembers.map((member) => {
             // Avatar Logic
             const getAvatarSrc = () => {
                 if (member.avatar?.startsWith('http')) return member.avatar;
                 if (member.discord_id && member.avatar) {
                     return `https://cdn.discordapp.com/avatars/${member.discord_id}/${member.avatar}.png`;
                 }
                 return undefined;
             };
             const avatarSrc = getAvatarSrc();

             return (
             <div key={member.user_id} className="relative p-6 rounded-xl bg-gradient-to-br from-neutral-800/40 to-neutral-900/40 border border-neutral-700/50 hover:border-neon-cyan/40 transition-all duration-300 hover:-translate-y-1 will-change-transform group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
                      {avatarSrc ? (
                          <img src={avatarSrc} alt={member.username} className="w-full h-full object-cover" />
                      ) : (
                          <span>{member.username.substring(0,1).toUpperCase()}</span>
                      )}
                   </div>
                   <div>
                      <div className="text-white font-bold text-lg">{member.username}</div>
                      <div className="text-xs text-neon-cyan uppercase tracking-wider font-semibold">{member.member_type}</div>
                   </div>
                </div>
                {/* Visual indicator for leader */}
                 {member.member_type === 'LEADER' && (
                    <div className="absolute top-2 right-2 text-neon-cyan">
                        <Crown size={16} />
                    </div>
                )}
             </div>
             );
         })}

         {Array.from({ length: emptySlots }).map((_, idx) => (
             <div key={`empty-${idx}`} className="p-6 rounded-xl border-2 border-dashed border-neutral-800 bg-neutral-900/20 flex flex-col items-center justify-center gap-2 min-h-[100px] text-neutral-600 hover:text-neutral-400 hover:border-neutral-700 transition-colors">
                <UserPlus size={24} />
                <span className="text-sm font-medium">空き枠</span>
             </div>
         ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
          <button 
             onClick={() => addToast('招待機能は参加者一覧から利用可能です', 'info')}
             className="bg-neon-cyan text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all opacity-80 flex items-center gap-2"
          >
             <Users size={18} /> メンバー管理
          </button>
      </div>
    </div>
  );
}

function BracketView() {
  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up flex flex-col items-center justify-center min-h-[400px]">
       <Trophy className="text-neutral-800 mb-4" size={48} />
       <h2 className="text-xl font-bold text-neutral-400 mb-2">トーナメント表</h2>
       <p className="text-neutral-600 text-sm">現在準備中です...</p>
    </div>
  );
}

function ResultView() {
  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up flex flex-col items-center justify-center min-h-[400px]">
       <ClipboardList className="text-neutral-800 mb-4" size={48} />
       <h2 className="text-xl font-bold text-neutral-400 mb-2">大会結果</h2>
       <p className="text-neutral-600 text-sm">現在準備中です...</p>
    </div>
  );
}
