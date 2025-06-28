'use client';

import { useState, useEffect } from 'react';
import { adminAPI, SystemStats } from '../../../api/admin';
import { RefreshCw, X, Users, Building2, Gamepad2, Trophy, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export default function StatisticsTab() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await adminAPI.getStats();
      setStats(statsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Статистика системы</h2>
          <p className="text-[#A1A1A1]">Общая статистика и аналитика</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <div className="text-white text-lg">Загрузка статистики...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Статистика системы</h2>
          <p className="text-[#A1A1A1]">Общая статистика и аналитика</p>
        </div>
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-6">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Ошибка: {error}</span>
          </div>
          <button
            onClick={fetchStats}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Статистика системы</h2>
          <p className="text-[#A1A1A1]">Общая статистика и аналитика</p>
        </div>
        <button 
          onClick={fetchStats}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Обновить
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Всего пользователей</h3>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{stats?.totalUsers || 0}</p>
          <p className="text-blue-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Зарегистрированных пользователей
          </p>
        </div>

        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Всего клубов</h3>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{stats?.totalClubs || 0}</p>
          <p className="text-green-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Созданных клубов
          </p>
        </div>

        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Всего игр</h3>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{stats?.totalGames || 0}</p>
          <p className="text-purple-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Проведенных игр
          </p>
        </div>

        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Турниры</h3>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{stats?.totalTournaments || 0}</p>
          <p className="text-yellow-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Созданных турниров
          </p>
        </div>

        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Сезоны</h3>
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{stats?.totalSeasons || 0}</p>
          <p className="text-indigo-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Активных сезонов
          </p>
        </div>

        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Заявки клубов</h3>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{stats?.pendingClubRequests || 0}</p>
          <p className="text-orange-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Ожидают рассмотрения
          </p>
        </div>
      </div>
    </div>
  );
} 