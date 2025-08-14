'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Trophy, 
  Target, 
  Shield, 
  Calendar, 
  Crown, 
  MapPin, 
  Mail, 
  ArrowLeft,
  Loader2,
  Users,
  Award,
  TrendingUp,
  Activity
} from 'lucide-react';
import { usersAPI, Player } from '../../../api/users';
import Avatar from '../../../components/UI/Avatar';

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id;
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!playerId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Use the new getPlayerById API function
        const playerData = await usersAPI.getPlayerById(parseInt(playerId as string));
        setPlayer(playerData);
      } catch (err) {
        console.error('Error fetching player:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки профиля игрока');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'club_owner':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'player':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'club_owner':
        return 'Владелец клуба';
      case 'player':
        return 'Игрок';
      default:
        return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
          <span className="text-gray-400">Загрузка профиля...</span>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Ошибка загрузки профиля</div>
            <div className="text-gray-400 mb-4">{error || 'Игрок не найден'}</div>
            <Link
              href="/players"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к списку игроков
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const winRate = player.totalGames > 0 ? ((player.totalWins / player.totalGames) * 100).toFixed(1) : '0.0';
  const kdr = (player.totalDeaths || 0) > 0 ? ((player.totalKills || 0) / (player.totalDeaths || 0)).toFixed(2) : (player.totalKills || 0).toString();
  const mafiaWinRate = (player.mafiaGames || 0) > 0 ? (((player.mafiaWins || 0) / (player.mafiaGames || 0)) * 100).toFixed(1) : '0.0';
  const citizenWinRate = (player.citizenGames || 0) > 0 ? (((player.citizenWins || 0) / (player.citizenGames || 0)) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-[1080px] space-y-6">
        {/* Back Button */}
        <Link
          href="/players"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D1D1D] border border-[#404040] text-white rounded-lg hover:border-[#8469EF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к списку игроков
        </Link>

        {/* Main Profile Card */}
        <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar 
                avatar={player.avatar}
                size="xl"
                fallback={player.nickname}
                className="w-30 h-30 rounded-[12px]"
              />
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-[#8469EF] mb-2">{player.nickname}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getRoleColor(player.role)}`}>
                    {getRoleText(player.role)}
                  </span>
                  {player.clubName && (
                    <span className="text-[#6B8CFF] text-sm bg-[#6B8CFF]/10 px-2 py-1 rounded">
                      {player.clubName}
                    </span>
                  )}
                </div>
                <div className="text-gray-400 text-sm">
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    <Mail className="w-4 h-4" />
                    {player.email}
                  </div>
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    <Calendar className="w-4 h-4" />
                    Зарегистрирован {formatDate(player.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-4">Основная статистика</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{player.totalGames || 0}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Всего игр</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{player.totalWins || 0}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Победы</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-white">{winRate}%</span>
                  </div>
                  <div className="text-gray-400 text-sm">Винрейт</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-[#FFB800]" />
                    <span className="text-2xl font-bold text-white">{player.totalPoints || 0}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Очки</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Combat Statistics */}
          <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" />
              Боевая статистика
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#2A2A2A] rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300">Убийства</span>
                </div>
                <span className="text-white font-semibold">{player.totalKills || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#2A2A2A] rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Смерти</span>
                </div>
                <span className="text-white font-semibold">{player.totalDeaths || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#2A2A2A] rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">K/D Ratio</span>
                </div>
                <span className="text-white font-semibold">{kdr}</span>
              </div>
            </div>
          </div>

          {/* Role Statistics */}
          <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Статистика по ролям
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-[#2A2A2A] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Мафия</span>
                  <span className="text-white font-semibold">{(player.mafiaWins || 0)}/{(player.mafiaGames || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Винрейт</span>
                  <span className="text-white font-semibold">{mafiaWinRate}%</span>
                </div>
              </div>
              <div className="p-3 bg-[#2A2A2A] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Горожане</span>
                  <span className="text-white font-semibold">{(player.citizenWins || 0)}/{(player.citizenGames || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Винрейт</span>
                  <span className="text-white font-semibold">{citizenWinRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Дополнительная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#2A2A2A] rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Статус аккаунта</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${player.confirmed ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-gray-300">
                  {player.confirmed ? 'Подтвержден' : 'Не подтвержден'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-[#2A2A2A] rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">ID игрока</h3>
              <span className="text-gray-300 font-mono">#{player.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 