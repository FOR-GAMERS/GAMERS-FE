'use client';

import { useState } from 'react';
import { useGameActions } from '@/hooks/use-games';
import { GameTeamType } from '@/types/api';
import { Loader2 } from 'lucide-react';

interface GameCreationPanelProps {
  contestId: number;
  onSuccess?: () => void;
}

const TEAM_TYPES: GameTeamType[] = ['SINGLE', 'DUO', 'TRIO', 'FULL', 'HURUPA'];

export function GameCreationPanel({ contestId, onSuccess }: GameCreationPanelProps) {
  const { createGame, loading, error } = useGameActions();
  
  // Form State
  const [startedAt, setStartedAt] = useState('');
  const [endedAt, setEndedAt] = useState('');
  const [teamType, setTeamType] = useState<GameTeamType>('SINGLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!startedAt || !endedAt) {
      alert('Start and End times are required');
      return;
    }

    try {
      // Must format date to ISO string if backend expects specific format
      // Swagger usually implies ISO8601 string. 
      // Input type="datetime-local" gives "YYYY-MM-DDTHH:mm"
      // We might need to append :00Z or seconds/timezone info depending on backend.
      // Let's perform basic ISO conversion.
      const startIso = new Date(startedAt).toISOString();
      const endIso = new Date(endedAt).toISOString();

      await createGame({
        contest_id: contestId,
        game_team_type: teamType,
        started_at: startIso,
        ended_at: endIso
      });
      
      // Reset form
      setStartedAt('');
      setEndedAt('');
      setTeamType('SINGLE');

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      // Error is handled by hook state, but we log here too
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Create New Game</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Team Type
          </label>
          <select
            value={teamType}
            onChange={(e) => setTeamType(e.target.value as GameTeamType)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={loading}
          >
            {TEAM_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endedAt}
              onChange={(e) => setEndedAt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Game'
          )}
        </button>
      </form>
    </div>
  );
}
