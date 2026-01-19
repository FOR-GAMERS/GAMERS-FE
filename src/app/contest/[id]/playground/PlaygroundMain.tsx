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
  Medal,
  Swords
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Home', icon: LayoutDashboard },
  { name: 'Game List', icon: Gamepad2 },
  { name: 'Member List', icon: Users },
  { name: 'My Team', icon: Shield },
  { name: 'Bracket', icon: Trophy },
  { name: 'Result', icon: ClipboardList },
];

// --- Mock Data ---

const MOCK_CONTEST_DATA = {
  title: "Neon City Cyber-League 2026",
  description: `
## Welcome to the Neon City League
Prepare for the ultimate showdown in the **Cyber-League 2026**.
Teams will compete across multiple disciplines to claim the title of *Net-Runner Champion*.

### Schedule
- **Qualifier**: Jan 20th - Jan 22nd
- **Group Stage**: Jan 25th - Jan 30th
- **Grand Final**: Feb 5th

### Rules
1. No cheating or exploiting bugs.
2. Teams must be present 15 minutes before match start.
3. Be respectful to all participants.

Good luck, runners.
  `
};

const MOCK_GAMES = [
  {
    id: 1,
    title: "Cyber-Strike: Global Offensive",
    genre: "FPS / Tactical",
    description: "5v5 Tactical Shooter where precision meets strategy. Map pool includes: Dust_2077, Mirage_Neo, and Inferno_X.",
    rules: "Best of 3 Maps. Standard competitive rules apply."
  },
  {
    id: 2,
    title: "League of Legends: Arcane",
    genre: "MOBA",
    description: "5v5 Strategic battle. Destroy the enemy Nexus to win. Draft mode enabled.",
    rules: "Tournament Draft, 3 Bans per team."
  },
  {
    id: 3,
    title: "Rocket League: Nitro",
    genre: "Sports / Vehicle",
    description: "3v3 High-octane vehicular soccer. First to score 5 goals or highest score at 5 mins wins.",
    rules: "Standard Arena. No modifiers."
  }
];

const MOCK_MEMBERS = [
  { id: 101, name: "Kaelthas", discordId: "kael#1234", rank: "Diamond", point: 2500 },
  { id: 102, name: "Jinx", discordId: "jinx_bombs#9999", rank: "Challenger", point: 3200 },
  { id: 103, name: "Vi", discordId: "vi_punch#8888", rank: "Platinum", point: 1800 },
  { id: 104, name: "Ekko", discordId: "time_kid#7777", rank: "Gold", point: 1450 },
  { id: 105, name: "Caitlyn", discordId: "sheriff#6666", rank: "Diamond", point: 2600 },
];

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
    name: 'Quarter Finals',
    matches: [
      { id: 'm1', t1: 'Runners', t2: 'Arasaka', t1Score: 2, t2Score: 1, winner: 'Runners', status: 'finished' },
      { id: 'm2', t1: 'Militech', t2: 'Kang Tao', t1Score: 0, t2Score: 2, winner: 'Kang Tao', status: 'finished' },
      { id: 'm3', t1: 'Aldecaldos', t2: 'Mox', t1Score: 1, t2Score: 2, winner: 'Mox', status: 'finished' },
      { id: 'm4', t1: 'Animals', t2: 'Voodoo', t1Score: 0, t2Score: 0, winner: null, status: 'scheduled' },
    ]
  },
  {
    id: 'semi',
    name: 'Semi Finals',
    matches: [
      { id: 'm5', t1: 'Runners', t2: 'Kang Tao', t1Score: 0, t2Score: 0, winner: null, status: 'scheduled' },
      { id: 'm6', t1: 'Mox', t2: 'TBD', t1Score: 0, t2Score: 0, winner: null, status: 'tbd' },
    ]
  },
  {
    id: 'final',
    name: 'Grand Final',
    matches: [
      { id: 'm7', t1: 'TBD', t2: 'TBD', t1Score: 0, t2Score: 0, winner: null, status: 'tbd' },
    ]
  }
];


export default function PlaygroundMain() {
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
      case 'Home': return <HomeView />;
      case 'Game List': return <GameListView />;
      case 'Member List': return <MemberListView />;
      case 'My Team': return <MyTeamView />;
      case 'Bracket': return <BracketView />;
      case 'Result': return <ResultView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* List Section (Navigation) */}
      <aside className="lg:col-span-1 flex flex-col gap-4" ref={sidebarRef}>
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md shadow-lg sticky top-8">
          <h2 className="text-lg font-semibold text-neon-purple mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-neon-purple rounded-full shadow-[0_0_8px_#b23aff]"></span>
            MENU
          </h2>
          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`menu-item w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group flex items-center gap-3 ${
                  activeTab === item.name
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors ${
                    activeTab === item.name ? 'text-neon-cyan' : 'group-hover:text-white'
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
        {/* Simple key change for re-mounting and potential animation if needed, or keeping stable */}
        {renderContent()}
      </main>
    </div>
  );
}

// --- Views ---

function HomeView() {
  return (
    <div className="space-y-6 animate-fade-in-up">
       <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-neutral-800 pb-4">
            <LayoutDashboard className="text-neon-cyan" size={32} />
            {MOCK_CONTEST_DATA.title}
          </h2>
          
          <div className="prose prose-invert prose-p:text-neutral-400 prose-headings:text-white prose-a:text-neon-cyan prose-strong:text-white max-w-none">
            <ReactMarkdown>{MOCK_CONTEST_DATA.description}</ReactMarkdown>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-neutral-800">
             <div className="p-4 rounded-xl bg-deep-black/50 border border-neutral-800 flex justify-between items-center group hover:border-neon-cyan/30 transition-colors cursor-default">
                <span className="text-sm text-gray-500">Status</span>
                <div className="text-xl text-neon-cyan font-bold drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">Live</div>
             </div>
              <div className="p-4 rounded-xl bg-deep-black/50 border border-neutral-800 flex justify-between items-center group hover:border-neon-purple/30 transition-colors cursor-default">
                <span className="text-sm text-gray-500">Participants</span>
                <div className="text-xl text-white font-bold">128/128</div>
             </div>
          </div>
       </div>
    </div>
  );
}

function GameListView() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Gamepad2 className="text-neon-cyan" />
        Game List
      </h2>
      
      <div className="space-y-3">
         {MOCK_GAMES.map((game) => {
            const isExpanded = expandedId === game.id;
            return (
              <div 
                key={game.id} 
                className={`rounded-xl border transition-all duration-300 overflow-hidden will-change-transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neon-purple/5 ${
                  isExpanded 
                    ? 'bg-neutral-900/60 border-neon-cyan/30 shadow-[0_0_10px_rgba(0,243,255,0.05)]' 
                    : 'bg-neutral-900/30 border-neutral-800 hover:border-neon-purple/50'
                }`}
              >
                 <button 
                  onClick={() => toggleAccordion(game.id)}
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
                          {game.title}
                        </h3>
                        <p className="text-xs text-neutral-500 font-mono tracking-wide">{game.genre}</p>
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
                         <strong className="text-white block mb-1">Description</strong>
                         {game.description}
                       </div>
                       <div className="p-3 rounded-lg bg-deep-black/30 border border-white/5">
                         <strong className="text-neon-purple block mb-1 text-xs uppercase tracking-wider">Tournament Rules</strong>
                         {game.rules}
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            );
         })}
      </div>
    </div>
  );
}

function MemberListView() {
  const HAS_MY_TEAM = true; 

  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
         <Users className="text-neon-cyan" />
         Member List
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-sm font-medium text-neutral-500 uppercase tracking-wider">
              <th className="py-4 px-4">Member Name</th>
              <th className="py-4 px-4">Discord ID</th>
              <th className="py-4 px-4">Current Rank</th>
              <th className="py-4 px-4 text-right">Point</th>
              {HAS_MY_TEAM && <th className="py-4 px-4 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {MOCK_MEMBERS.map((member) => (
              <tr key={member.id} className="group hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neon-purple/10 transform transition-all duration-300 hover:-translate-y-1 will-change-transform text-sm">
                <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 group-hover:ring-neon-cyan/50 transition-all">
                      {member.name.substring(0,2).toUpperCase()}
                   </div>
                   {member.name}
                </td>
                <td className="py-4 px-4 text-neutral-400 font-mono text-xs">{member.discordId}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    member.rank === 'Challenger' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                    member.rank === 'Diamond' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                    'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}>
                    {member.rank}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-white font-mono">{member.point.toLocaleString()}</td>
                {HAS_MY_TEAM && (
                  <td className="py-4 px-4 text-right">
                    <button className="text-xs bg-neon-purple/10 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto">
                      <UserPlus size={14} /> Invite
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MyTeamView() {
  const { name, members, capacity } = MOCK_MY_TEAM;
  const emptySlots = Math.max(0, capacity - members.length);

  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
           <Shield className="text-neon-cyan" />
           {name}
        </h2>
        <div className="text-sm text-neutral-500 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900">
           Capacity: <span className="text-white font-bold">{members.length}</span> / {capacity}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {members.map((member) => (
             <div key={member.id} className="relative p-6 rounded-xl bg-gradient-to-br from-neutral-800/40 to-neutral-900/40 border border-neutral-700/50 hover:border-neon-cyan/40 transition-all duration-300 hover:-translate-y-1 will-change-transform group">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full ${member.avatarColor} flex items-center justify-center text-black font-bold text-lg shadow-lg`}>
                      {member.name.substring(0,1).toUpperCase()}
                   </div>
                   <div>
                      <div className="text-white font-bold text-lg">{member.name}</div>
                      <div className="text-xs text-neon-cyan uppercase tracking-wider font-semibold">{member.role}</div>
                   </div>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-2 h-2 rounded-full bg-neon-cyan box-shadow-[0_0_5px_#00f3ff]"></div>
                </div>
             </div>
         ))}

         {Array.from({ length: emptySlots }).map((_, idx) => (
             <div key={`empty-${idx}`} className="p-6 rounded-xl border-2 border-dashed border-neutral-800 bg-neutral-900/20 flex flex-col items-center justify-center gap-2 min-h-[100px] text-neutral-600 hover:text-neutral-400 hover:border-neutral-700 transition-colors">
                <UserPlus size={24} />
                <span className="text-sm font-medium">Empty Slot</span>
             </div>
         ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
          <button className="bg-neon-cyan text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all">
             Invite New Member
          </button>
      </div>
    </div>
  );
}

function BracketView() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Animate connector lines
    gsap.fromTo('.bracket-line', 
      { width: 0 }, 
      { width: '2rem', duration: 1.5, ease: 'power2.inOut', stagger: 0.2 } 
    );
    
    // Animate glow for winner lines
    gsap.to('.winner-line', {
      boxShadow: '0 0 10px #00f3ff',
      repeat: -1,
      yoyo: true,
      duration: 1.5
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 overflow-x-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
         <Trophy className="text-neon-cyan" />
         Tournament Bracket
      </h2>
      
      <div className="flex gap-16 min-w-[800px]">
         {MOCK_BRACKET_ROUNDS.map((round, rIndex) => (
            <div key={round.id} className="flex flex-col flex-1 gap-8">
               <h3 className="text-center text-neutral-500 text-sm font-mono uppercase tracking-widest mb-4 border-b border-neutral-800 pb-2">
                 {round.name}
               </h3>
               
               <div className="flex flex-col justify-around h-full gap-8">
                  {round.matches.map((match) => {
                     const isP1Winner = match.winner === match.t1 && match.status === 'finished';
                     const isP2Winner = match.winner === match.t2 && match.status === 'finished';

                     return (
                        <div key={match.id} className="relative flex flex-col justify-center">
                           <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 w-48 shadow-lg relative z-10 transition-transform hover:scale-105 duration-300">
                              <div className={`flex justify-between items-center mb-2 pb-2 border-b border-neutral-800 ${isP1Winner ? 'text-neon-cyan font-bold' : 'text-neutral-400'}`}>
                                 <span>{match.t1}</span>
                                 <span className="bg-neutral-800 px-2 py-0.5 rounded text-xs text-white">{match.t1Score}</span>
                              </div>
                              <div className={`flex justify-between items-center ${isP2Winner ? 'text-neon-cyan font-bold' : 'text-neutral-400'}`}>
                                 <span>{match.t2}</span>
                                 <span className="bg-neutral-800 px-2 py-0.5 rounded text-xs text-white">{match.t2Score}</span>
                              </div>
                              
                              {match.status === 'scheduled' && (
                                <div className="absolute -top-2 -right-2 bg-neutral-800 text-neutral-500 text-[10px] px-2 py-0.5 rounded-full border border-neutral-700">LIVE</div>
                              )}
                           </div>
                           
                           {/* Connecting Line Animation */}
                           {rIndex < MOCK_BRACKET_ROUNDS.length - 1 && (
                              <div className={`bracket-line absolute top-1/2 -right-8 h-[2px] w-8 origin-left ${match.winner ? 'winner-line bg-neon-cyan' : 'bg-neutral-800'}`}></div>
                           )}
                        </div>
                     )
                  })}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

function ResultView() {
  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
         <ClipboardList className="text-neon-cyan" />
         Final Results
      </h2>

      <div className="overflow-hidden rounded-xl border border-neutral-800">
         <table className="w-full text-left">
            <thead className="bg-neutral-900 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
               <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Team Name</th>
                  <th className="p-4 text-center">W / L</th>
                  <th className="p-4 text-right">Prize</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-900/50">
               {MOCK_RESULTS.map((res) => {
                  const isFirst = res.rank === 1;
                  return (
                     <tr key={res.rank} className={`group transition-colors ${isFirst ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : 'hover:bg-neutral-800/50'}`}>
                        <td className="p-4">
                           {isFirst ? (
                              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 border border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                 <Crown size={16} />
                              </div>
                           ) : (
                              <span className="text-neutral-500 font-mono w-8 h-8 flex items-center justify-center">#{res.rank}</span>
                           )}
                        </td>
                        <td className={`p-4 font-bold ${isFirst ? 'text-yellow-400 text-lg' : 'text-white'}`}>
                           {res.team}
                        </td>
                        <td className="p-4 text-center text-neutral-400 font-mono">
                           <span className="text-green-500">{res.win}</span>
                           <span className="mx-1 opacity-30">/</span>
                           <span className="text-red-500">{res.lose}</span>
                        </td>
                        <td className={`p-4 text-right font-mono ${isFirst ? 'text-yellow-400 font-bold' : 'text-neutral-300'}`}>
                           {res.prize}
                        </td>
                     </tr>
                  )
               })}
            </tbody>
         </table>
      </div>
    </div>
  );
}
