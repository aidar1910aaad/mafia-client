'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { gamesAPI, Game } from '../../../api/games';
import { authAPI } from '../../../api/auth';
import { 
  formatDate, 
  getResultColor, 
  getResultText, 
  getStatusColor, 
  getStatusText 
} from '../../../utils/gameUtils';
import GameHeader from '../../../components/Games/GameHeader';
import GameStats from '../../../components/Games/GameStats';
import GameClubInfo from '../../../components/Games/GameClubInfo';
import GameSeasonTournamentInfo from '../../../components/Games/GameSeasonTournamentInfo';
import GameResultTable from '../../../components/Games/GameResultTable';
import GamePlayersList from '../../../components/Games/GamePlayersList';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id;
  
  const [game, setGame] = useState<Game | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!gameId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем игру и пользователя параллельно
        const [gameData, userData] = await Promise.all([
          gamesAPI.getGameById(parseInt(gameId as string)),
          authAPI.getProfile().catch(() => null) // Игнорируем ошибки если пользователь не авторизован
        ]);
        
        setGame(gameData);
        setCurrentUser(userData);
      } catch (err) {
        console.error('Error fetching game:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки игры');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      // Если нет истории, идем на главную
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
          <span className="text-gray-400">Загрузка игры...</span>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Ошибка загрузки игры</div>
            <div className="text-gray-400 mb-4">{error || 'Игра не найдена'}</div>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-[1080px] space-y-6">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D1D1D] border border-[#404040] text-white rounded-lg hover:border-[#8469EF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться назад
        </button>

        {/* Game Header */}
        <GameHeader 
          game={game}
          getResultColor={getResultColor}
          getResultText={getResultText}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />

        {/* Game Stats */}
        <GameStats game={game} />

        {/* Club Information */}
        <GameClubInfo game={game} />

        {/* Season/Tournament Information */}
        <GameSeasonTournamentInfo 
          game={game}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />

        {/* Result Table */}
        <GameResultTable game={game} />

        {/* Players List */}
        <GamePlayersList game={game} />
      </div>
    </div>
  );
} 