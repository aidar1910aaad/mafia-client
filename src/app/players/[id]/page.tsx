'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
import { usersAPI, ExtendedPlayerProfile } from '../../../api/users';
import Avatar from '../../../components/UI/Avatar';

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id;
  
  const [player, setPlayer] = useState<ExtendedPlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!playerId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Use the new getExtendedPlayerProfile API function
        const playerData = await usersAPI.getExtendedPlayerProfile(parseInt(playerId as string));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="text-white text-lg">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1200px] rounded-[18px] bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 p-6">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D]">
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/players"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 text-white rounded-lg hover:border-[#8469EF] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к списку игроков
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка - Профиль пользователя и общая статистика */}
          <div className="space-y-6">
            {/* Профиль пользователя */}
            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                {/* Аватар с красивой рамкой */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8469EF] via-[#6B4FFF] to-[#8B5CF6] p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#2A2A2A] flex items-center justify-center">
                      <Avatar 
                        avatar={player?.avatar}
                        size="xl"
                        fallback={player?.nickname || 'U'}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  {/* Декоративные элементы */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] rounded-full opacity-60"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-full opacity-40"></div>
                </div>
                
                {/* Имя пользователя */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#C7C7C7] bg-clip-text text-transparent mb-3">
                  {player?.nickname || 'Игровой Никнейм'}
                </h1>
                
              
                
                {/* Роль с красивым бейджем */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8469EF]/20 to-[#6B4FFF]/20 border border-[#8469EF]/30 mb-4">
                  <Crown className="w-4 h-4 text-[#8469EF]" />
                  <span className="text-[#8469EF] font-medium">
                    {player?.role === 'admin' ? 'Администратор' : 
                     player?.role === 'club_owner' ? 'Владелец клуба' : 
                     player?.role === 'player' ? 'Игрок' : 
                     player?.role || 'Неизвестная роль'}
                  </span>
                </div>

                {/* Клуб */}
                {player?.clubName && (
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-[#6B8CFF]" />
                    <p className="text-[#6B8CFF] text-lg font-medium">
                      {player.clubName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Общая статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Побед/Игр всего</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {player?.totalWins || 0}/{player?.totalGames || 0}
                </div>
                <div className="text-[#10B981] text-sm font-medium">
                  {player?.totalGames && player.totalGames > 0 ? 
                    `Процент побед: ${((player.totalWins / player.totalGames) * 100).toFixed(1)}%` : 
                    'Процент побед: 0%'
                  }
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Всего очков</h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {player?.totalPoints ? (Number.isInteger(player.totalPoints) ? player.totalPoints.toString() : player.totalPoints.toFixed(1)) : 0}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Средний балл</h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {player?.totalGames && player.totalGames > 0 ? 
                    (() => {
                      const avg = player.totalPoints / player.totalGames;
                      return Number.isInteger(avg) ? avg.toString() : avg.toFixed(1);
                    })() : 
                    '0'
                  }
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Дополнительные баллы</h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {player?.totalBonusPoints || 0}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#EC4899] to-[#DB2777] rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Баллы</h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {player?.eloRating || 0}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Турниров сыграно</h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {player?.tournamentsParticipated || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Диаграмма ролей и статистика по ролям */}
          <div className="space-y-6">
            {/* Диаграмма ролей */}
            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-[#C7C7C7] bg-clip-text text-transparent mb-2">
                  Распределение ролей
                </h3>
                <p className="text-[#C7C7C7] text-sm">Статистика по ролям в играх</p>
              </div>
              
              {/* Круговая диаграмма ролей с Recharts */}
              <div className="flex flex-col items-center">
                {(() => {
                  if (!player?.roleStats || player.roleStats.length === 0) {
                    return (
                      <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] flex items-center justify-center border-4 border-[#404040]/30 shadow-2xl">
                        <div className="text-center">
                          <div className="text-white text-xl font-semibold mb-2">Нет данных</div>
                          <div className="text-[#C7C7C7] text-sm">Статистика отсутствует</div>
                        </div>
                      </div>
                    );
                  }
                  
                  const totalGames = player.roleStats.reduce((sum, stat) => sum + stat.gamesPlayed, 0);
                  if (totalGames === 0) {
                    return (
                      <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] flex items-center justify-center border-4 border-[#404040]/30 shadow-2xl">
                        <div className="text-center">
                          <div className="text-white text-xl font-semibold mb-2">Нет игр</div>
                          <div className="text-[#C7C7C7] text-sm">Игры не сыграны</div>
                        </div>
                      </div>
                    );
                  }
                  
                  const roleNames: { [key: string]: string } = {
                    'CITIZEN': 'Мирный',
                    'MAFIA': 'Мафия',
                    'DETECTIVE': 'Шериф',
                    'MANIAC': 'Маньяк',
                    'BEAUTY': 'Красотка',
                    'DOCTOR': 'Доктор',
                    'DON': 'Дон'
                  };
                  
                  const roleColors: { [key: string]: string } = {
                    'CITIZEN': '#10B981',
                    'MAFIA': '#EF4444',
                    'DETECTIVE': '#3B82F6',
                    'MANIAC': '#8B5CF6',
                    'BEAUTY': '#EC4899',
                    'DOCTOR': '#06B6D4',
                    'DON': '#F97316'
                  };
                  
                  const chartData = player.roleStats
                    .filter(stat => stat.gamesPlayed > 0)
                    .map(stat => ({
                      name: roleNames[stat.role] || stat.role,
                      value: stat.gamesPlayed,
                      color: roleColors[stat.role] || '#6B7280',
                      percentage: ((stat.gamesPlayed / totalGames) * 100).toFixed(1)
                    }))
                    .sort((a, b) => b.value - a.value);
                  
                  const CustomTooltip = ({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#2A2A2A] border border-[#404040]/30 rounded-lg p-3 shadow-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: data.color }}
                            ></div>
                            <span className="text-white font-semibold">{data.name}</span>
                          </div>
                          <div className="text-[#C7C7C7] text-sm">
                            Игр: <span className="text-white font-medium">{data.value}</span>
                          </div>
                          <div className="text-[#C7C7C7] text-sm">
                            Процент: <span className="text-white font-medium">{data.percentage}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  };
                  
                  return (
                    <div className="w-full max-w-md">
                      <div className="relative w-80 h-80 mx-auto mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={140}
                              paddingAngle={2}
                              dataKey="value"
                              animationBegin={0}
                              animationDuration={800}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        
                        {/* Центральная информация */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <div className="text-white text-3xl font-bold">{totalGames}</div>
                            <div className="text-[#C7C7C7] text-sm">всего игр</div>
                          </div>
                        </div>
                      </div>

                      {/* Легенда ролей */}
                      <div className="grid grid-cols-2 gap-3">
                        {chartData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[#2A2A2A]/50 rounded-lg border border-[#404040]/20">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-white font-medium text-sm">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">{item.value}</div>
                              <div className="text-[#C7C7C7] text-xs">{item.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Статистика по ролям */}
            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-2xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-[#C7C7C7] bg-clip-text text-transparent mb-2">
                  Статистика по ролям
                </h3>
                <p className="text-[#C7C7C7] text-sm">Winrate по каждой роли</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {player?.roleStats?.map((roleStat) => {
                  const winRate = roleStat.gamesPlayed > 0 ? 
                    ((roleStat.gamesWon / roleStat.gamesPlayed) * 100).toFixed(1) : 
                    '0.0';
                  
                  const roleNames: { [key: string]: string } = {
                    'CITIZEN': 'Мирный',
                    'MAFIA': 'Мафия',
                    'DETECTIVE': 'Шериф',
                    'MANIAC': 'Маньяк',
                    'BEAUTY': 'Красотка',
                    'DOCTOR': 'Доктор',
                    'DON': 'Дон'
                  };
                  
                  const roleColors: { [key: string]: string } = {
                    'CITIZEN': '#10B981',
                    'MAFIA': '#EF4444',
                    'DETECTIVE': '#3B82F6',
                    'MANIAC': '#8B5CF6',
                    'BEAUTY': '#EC4899',
                    'DOCTOR': '#06B6D4',
                    'DON': '#F97316'
                  };
                  
                  return (
                    <div key={roleStat.id} className="bg-[#2A2A2A]/50 border border-[#404040]/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: roleColors[roleStat.role] || '#6B7280' }}
                          ></div>
                          <h3 className="text-white font-semibold">
                            {roleNames[roleStat.role] || roleStat.role}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-lg">{winRate}%</div>
                          <div className="text-[#C7C7C7] text-sm">
                            {roleStat.gamesWon} из {roleStat.gamesPlayed} побед
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-[#404040]/30 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${winRate}%`,
                            backgroundColor: roleColors[roleStat.role] || '#6B7280'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 