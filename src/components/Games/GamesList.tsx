'use client';

import { useState, useEffect } from 'react';
import { gamesAPI, Game } from '../../api/games';
import { 
  Calendar, 
  Clock, 
  User, 
  Trophy, 
  Edit, 
  ExternalLink, 
  Users, 
  Target, 
  Shield 
} from 'lucide-react';
import CreateGameModal from './CreateGameModal';
import Link from 'next/link';
import { 
  formatDate, 
  getResultColor, 
  getResultText 
} from '../../utils/gameUtils';

interface GamesListProps {
  clubId?: number;
  seasonId?: number;
  tournamentId?: number;
  currentUser?: any;
  club?: any;
  onRefresh?: () => void;
}

export default function GamesList({ 
  clubId, 
  seasonId, 
  tournamentId, 
  currentUser, 
  club,
  onRefresh 
}: GamesListProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [clubId, seasonId, tournamentId]);

  // Отладочная информация
  useEffect(() => {
    console.log('GamesList clubId:', clubId, 'type:', typeof clubId);
    console.log('GamesList currentUser:', currentUser);
    console.log('GamesList club:', club);
  }, [clubId, currentUser, club]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (clubId) filters.clubId = clubId;
      if (seasonId) filters.seasonId = seasonId;
      if (tournamentId) filters.tournamentId = tournamentId;
      
      const gamesData = await gamesAPI.getGames(filters);
      setGames(gamesData);
    } catch (err) {
      console.error('Ошибка загрузки игр:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки игр');
    } finally {
      setLoading(false);
    }
  };

  const canCreateGame = currentUser && clubId && (
    // Проверяем, является ли пользователь владельцем клуба
    (club && club.owner && currentUser.id === club.owner.id) ||
    // Проверяем роль пользователя
    currentUser.role === 'admin' ||
    currentUser.role === 'owner' ||
    // Проверяем, является ли пользователь владельцем клуба по clubId
    (club && currentUser.clubId === clubId) ||
    // Проверяем, принадлежит ли пользователь к этому клубу и имеет роль owner/admin
    (currentUser.club && currentUser.club.id === clubId && 
     (currentUser.club.userRole === 'owner' || currentUser.club.userRole === 'admin'))
  );

  console.log('canCreateGame:', canCreateGame, {
    currentUser: !!currentUser,
    clubId: !!clubId,
    clubOwnerMatch: club && club.owner && currentUser?.id === club.owner.id,
    userRole: currentUser?.role,
    clubIdMatch: club && currentUser?.clubId === clubId,
    userClubMatch: currentUser?.club && currentUser.club.id === clubId,
    userClubRole: currentUser?.club?.userRole
  });

  const handleGameCreated = () => {
    fetchGames();
    if (onRefresh) onRefresh();
  };

  if (loading) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Игры
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Игры
        </h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Игры
            {games.length > 0 && (
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                {games.length}
              </span>
            )}
          </h3>
          
          {canCreateGame && clubId && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Trophy className="w-4 h-4" />
              Создать игру
            </button>
          )}
        </div>
        
        {games.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            Пока нет игр
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="block"
              >
                <div 
                  className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-4 hover:border-[#404040]/50 transition-all duration-200 cursor-pointer group hover:bg-[#2A2A2A]/50"
                >
                  {/* Заголовок и статусы */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium text-lg group-hover:text-blue-400 transition-colors">
                        {game.name}
                      </h4>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getResultColor(game.result)}`}>
                        {getResultText(game.result)}
                      </span>
                      {game.status === 'COMPLETED' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full border text-green-400 bg-green-400/10 border-green-400/20">
                          Завершена
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Описание */}
                  {game.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {game.description}
                    </p>
                  )}
                  
                  {/* Основная информация */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-[#8469EF]" />
                      <span>{formatDate(game.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Users className="w-4 h-4 text-[#8469EF]" />
                      <span>{game.players.length} игроков</span>
                    </div>
                  </div>
                  
                  {/* Статистика */}
                  <div className="bg-[#2A2A2A] rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="w-3 h-3 text-red-400" />
                          <span className="text-white font-semibold text-sm">
                            {game.players.reduce((sum, p) => sum + p.kills, 0)}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs">Убийства</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Shield className="w-3 h-3 text-blue-400" />
                          <span className="text-white font-semibold text-sm">
                            {game.players.reduce((sum, p) => sum + p.points, 0)}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs">Очки</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span className="text-white font-semibold text-sm">
                            {game.players.filter(p => p.role === 'MAFIA').length}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs">Мафия</div>
                      </div>
                    </div>
                  </div>

                  {/* Информация о клубе и сезоне/турнире */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#404040]/30">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Клуб:</span>
                      <span className="text-white">{game.club?.name || 'Не указан'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {game.season && (
                        <span className="text-gray-400">Сезон: <span className="text-white">{game.season.name}</span></span>
                      )}
                      {game.tournament && (
                        <span className="text-gray-400">Турнир: <span className="text-white">{game.tournament.name}</span></span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && clubId && (
        <CreateGameModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleGameCreated}
          clubId={clubId}
          seasonId={seasonId}
          tournamentId={tournamentId}
        />
      )}
    </>
  );
} 