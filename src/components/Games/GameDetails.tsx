'use client';

import { useState, useEffect } from 'react';
import { gamesAPI, Game, GameResult } from '../../api/games';
import { usersAPI } from '../../api/users';
import { Calendar, Users, Trophy, Target, Shield, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Avatar from '../UI/Avatar';

interface GameDetailsProps {
  gameId: number;
}

interface User {
  id: number;
  name: string;
  nickname: string;
  email: string;
  avatar: string | null;
}

export default function GameDetails({ gameId }: GameDetailsProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameData();
  }, [gameId]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const [gameData, usersData] = await Promise.all([
        gamesAPI.getGameById(gameId),
        usersAPI.getAllUsers()
      ]);
      setGame(gameData);
      setUsers(usersData);
    } catch (err) {
      console.error('Ошибка загрузки игры:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки игры');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultColor = (result?: GameResult | null) => {
    if (!result) return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    
    switch (result) {
      case GameResult.MAFIA_WIN:
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case GameResult.CITIZEN_WIN:
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case GameResult.DRAW:
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getResultText = (result?: GameResult | null) => {
    if (!result) return 'Не определен';
    
    switch (result) {
      case GameResult.MAFIA_WIN:
        return 'Победа мафии';
      case GameResult.CITIZEN_WIN:
        return 'Победа горожан';
      case GameResult.DRAW:
        return 'Ничья';
      default:
        return 'Неизвестно';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'MAFIA':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'CITIZEN':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'MAFIA':
        return 'Мафия';
      case 'CITIZEN':
        return 'Горожанин';
      default:
        return 'Неизвестно';
    }
  };

  const getUserById = (userId: number) => {
    return users.find(user => user.id === userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
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
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к турнирам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-[1080px] space-y-6">
        {/* Back Button */}
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D1D1D] border border-[#404040] text-white rounded-lg hover:border-[#8469EF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к турнирам
        </Link>

        {/* Main Game Card */}
        <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#8469EF] mb-2">{game.name}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getResultColor(game.result)}`}>
                {getResultText(game.result)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Дата проведения</div>
              <div className="text-white font-medium">{formatDate(game.scheduledDate)}</div>
            </div>
          </div>
          
          {game.description && (
            <p className="text-[#C7C7C7] text-lg mb-6">{game.description}</p>
          )}

          {/* Game Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold text-white">{game.players.length}</span>
              </div>
              <div className="text-gray-400 text-sm">Игроков</div>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-bold text-white">
                  {game.players.reduce((sum, p) => sum + p.kills, 0)}
                </span>
              </div>
              <div className="text-gray-400 text-sm">Всего убийств</div>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  {game.players.reduce((sum, p) => sum + p.points, 0)}
                </span>
              </div>
              <div className="text-gray-400 text-sm">Всего очков</div>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold text-white">
                  {game.players.filter(p => p.role === 'MAFIA').length}
                </span>
              </div>
              <div className="text-gray-400 text-sm">Мафия</div>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8469EF]" />
            Участники игры
          </h2>
          
          <div className="space-y-4">
            {game.players.map((player) => {
              const user = getUserById(player.playerId);
              return (
                <div key={player.playerId} className="bg-[#2A2A2A] border border-[#404040]/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        avatar={user?.avatar}
                        size="md"
                        fallback={user?.name || user?.nickname || 'U'}
                        className="w-12 h-12"
                      />
                      <div>
                        <h3 className="text-white font-medium">
                          {user?.name || user?.nickname || user?.email || `Игрок ${player.playerId}`}
                        </h3>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(player.role)}`}>
                      {getRoleText(player.role)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400">Очки</div>
                      <div className="text-white font-medium">{player.points}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Убийства</div>
                      <div className="text-white font-medium">{player.kills}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Смерти</div>
                      <div className="text-white font-medium">{player.deaths}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">K/D</div>
                      <div className="text-white font-medium">
                        {player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills}
                      </div>
                    </div>
                  </div>
                  
                  {player.notes && (
                    <div className="mt-3 p-3 bg-[#1D1D1D] rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Заметки</div>
                      <div className="text-white text-sm">{player.notes}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Table */}
        {Object.keys(game.resultTable).length > 0 && (
          <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#8469EF]" />
              Таблица результатов
            </h2>
            
            <div className="space-y-2">
              {Object.entries(game.resultTable).map(([roundKey, result]) => (
                <div key={roundKey} className="flex items-center gap-4 p-3 bg-[#2A2A2A] rounded-lg">
                  <span className="text-[#8469EF] font-medium min-w-[80px]">{roundKey}</span>
                  <span className="text-white">{result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Info */}
        <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8469EF]" />
            Информация об игре
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">ID игры</div>
              <div className="text-white font-medium">{game.id}</div>
            </div>
            <div>
              <div className="text-gray-400">Клуб</div>
              <div className="text-white font-medium">{game.club?.name || 'Не указан'}</div>
            </div>
            {game.season && (
              <div>
                <div className="text-gray-400">Сезон</div>
                <div className="text-white font-medium">{game.season.name}</div>
              </div>
            )}
            {game.tournament && (
              <div>
                <div className="text-gray-400">Турнир</div>
                <div className="text-white font-medium">{game.tournament.name}</div>
              </div>
            )}
            <div>
              <div className="text-gray-400">Создана</div>
              <div className="text-white font-medium">{formatDate(game.createdAt)}</div>
            </div>
            <div>
              <div className="text-gray-400">Обновлена</div>
              <div className="text-white font-medium">{formatDate(game.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 