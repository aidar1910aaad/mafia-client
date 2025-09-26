'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  User, 
  Trophy, 
  Target, 
  Shield, 
  Calendar, 
  Crown, 
  MapPin, 
  Loader2,
  Users,
  Award,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ExtendedPlayerProfile } from '../../api/users';
import Avatar from '../UI/Avatar';

interface PlayerProfileContentProps {
  player: ExtendedPlayerProfile | null;
  loading: boolean;
  error: string | null;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
}

export default function PlayerProfileContent({ 
  player, 
  loading, 
  error, 
  showBackButton = false,
  backButtonHref = "/players",
  backButtonText = "Вернуться к списку игроков"
}: PlayerProfileContentProps) {
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
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
          <span className="text-gray-400">Загрузка профиля...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-2">Ошибка загрузки</div>
        <div className="text-gray-400">{error}</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">Профиль не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-4 sm:py-8 px-2 sm:px-4">
      <div className="w-full max-w-[1200px]">
        <main className="max-w-[1200px] mx-auto px-4 py-8">
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
                    <div className="w-10 h-10 bg-gradient-to-r from-[#EC4899] to-[#DB2777] rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">Баллы</h3>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {player?.eloRating || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - Диаграмма ролей и статистика по ролям */}
            <div className="space-y-6">
              {/* Диаграмма ролей */}
              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-white font-semibold mb-4 text-center">Распределение ролей</h3>
                
                {/* Диаграмма ролей */}
                <div className="w-80 h-80 mx-auto mb-6 rounded-full border-8 border-[#404040] relative">
                  {(() => {
                    if (!player?.roleStats || player.roleStats.length === 0) {
                      return (
                        <div className="absolute inset-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                          <span className="text-white text-sm">Нет данных</span>
                        </div>
                      );
                    }
                    
                    const totalGames = player.roleStats.reduce((sum, stat) => sum + stat.gamesPlayed, 0);
                    if (totalGames === 0) {
                      return (
                        <div className="absolute inset-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                          <span className="text-white text-sm">Нет игр</span>
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
                          <div className="bg-[#2A2A2A] border border-[#404040] rounded-lg p-3 shadow-lg">
                            <p className="text-white font-medium">{data.name}</p>
                            <p className="text-[#8469EF] text-sm">
                              Игр: {data.value} ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    };
                    
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </div>
                
                {/* Легенда */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {player?.roleStats
                    ?.filter(stat => stat.gamesPlayed > 0)
                    .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
                    .slice(0, 6)
                    .map((stat, index) => {
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
                        <div key={stat.role} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: roleColors[stat.role] || '#6B7280' }}
                          ></div>
                          <span className="text-white text-xs">
                            {roleNames[stat.role] || stat.role}: {stat.gamesPlayed}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Статистика по ролям */}
              <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] border border-[#404040]/30 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-white font-semibold mb-6 text-center">Статистика по ролям</h3>
                
                <div className="space-y-4">
                  {player?.roleStats
                    ?.filter(stat => stat.gamesPlayed > 0)
                    .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
                    .map((stat) => {
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
                      
                      const winRate = stat.gamesPlayed > 0 ? ((stat.gamesWon / stat.gamesPlayed) * 100).toFixed(1) : '0';
                      
                      return (
                        <div key={stat.role} className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: roleColors[stat.role] || '#6B7280' }}
                              ></div>
                              <h4 className="text-white font-semibold">
                                {roleNames[stat.role] || stat.role}
                              </h4>
                            </div>
                            <span className="text-[#8469EF] text-sm font-medium">
                              {winRate}% побед
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-white font-semibold">{stat.gamesPlayed}</div>
                              <div className="text-gray-400 text-xs">Игр</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-semibold">{stat.gamesWon}</div>
                              <div className="text-gray-400 text-xs">Побед</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-semibold">
                                {stat.gamesPlayed > 0 ? (stat.gamesWon / stat.gamesPlayed).toFixed(2) : '0.00'}
                              </div>
                              <div className="text-gray-400 text-xs">K/D</div>
                            </div>
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
    </div>
  );
}