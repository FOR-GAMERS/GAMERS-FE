import { useState, useCallback, useEffect } from 'react';
import { gameService } from '@/services/game-service';
import { GameResponse, CreateGameRequest, UpdateGameRequest } from '@/types/api';
import { ApiError } from '@/lib/api-client';

export function useContestGames(contestId: number | null) {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    if (!contestId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await gameService.getContestGames(contestId);
      if (response.data) {
        setGames(response.data);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch games');
      }
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, loading, error, refresh: fetchGames };
}

export function useGameActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGame = async (data: CreateGameRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameService.createGame(data);
      return response.data;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        throw err;
      } else {
        const msg = 'Failed to create game';
        setError(msg);
        throw new Error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateGame = async (gameId: number, data: UpdateGameRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameService.updateGame(gameId, data);
      return response.data;
    } catch (err) {
       if (err instanceof ApiError) {
        setError(err.message);
        throw err;
      } else {
        const msg = 'Failed to update game';
        setError(msg);
        throw new Error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return { 
    createGame, 
    updateGame, 
    loading, 
    error 
  };
}
