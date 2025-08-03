'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Clock, 
  ArrowLeft,
  Loader2,
  Gamepad2,
  Award,
  Building2,
  Mail,
  Trophy,
  Target
} from 'lucide-react';
import { seasonsAPI, Season } from '../../../api/seasons';
import { authAPI } from '../../../api/auth';
import GamesList from '../../../components/Games/GamesList';

export default function SeasonPage() {
  const params = useParams();
  const router = useRouter();
  const seasonId = params.id;
  
  const [season, setSeason] = useState<Season | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!seasonId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем сезон и пользователя параллельно
        const [seasonData, userData] = await Promise.all([
          seasonsAPI.getSeasonById(parseInt(seasonId as string)),
          authAPI.getProfile().catch(() => null) // Игнорируем ошибки если пользователь не авторизован
        ]);
        
        setSeason(seasonData);
        setCurrentUser(userData);
      } catch (err) {
        console.error('Error fetching season:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки сезона');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seasonId]);

  // Отладочная информация
  useEffect(() => {
    if (season) {
      console.log('Season clubId:', season.clubId, 'type:', typeof season.clubId);
      console.log('Season club.id:', season.club?.id, 'type:', typeof season.club?.id);
      console.log('Season page - clubId exists:', !!season.club?.id, 'clubId:', season.club?.id);
      console.log('Full season object:', season);
    }
  }, [season]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'ACTIVE':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'COMPLETED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'INACTIVE':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'Предстоящий';
      case 'ACTIVE':
        return 'Активный';
      case 'COMPLETED':
        return 'Завершен';
      case 'INACTIVE':
        return 'Неактивный';
      default:
        return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
          <span className="text-gray-400">Загрузка сезона...</span>
        </div>
      </div>
    );
  }

  if (error || !season) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Ошибка загрузки сезона</div>
            <div className="text-gray-400 mb-4">{error || 'Сезон не найден'}</div>
            <Link
              href="/seasons"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к списку сезонов
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const gamesCount = season.games?.length || 0;
  const isActive = season.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-[1080px] space-y-6">
        {/* Back Button */}
        <Link
          href="/seasons"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D1D1D] border border-[#404040] text-white rounded-lg hover:border-[#8469EF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к списку сезонов
        </Link>

        {/* Main Season Card */}
        <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Season Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#8469EF] mb-2">{season.name}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(season.status)}`}>
                    {getStatusText(season.status)}
                  </span>
                </div>
                {season.club?.logo && (
                  <Image 
                    src={season.club.logo} 
                    alt="Club logo" 
                    width={80} 
                    height={80} 
                    className="rounded-[12px] object-cover" 
                  />
                )}
              </div>
              
              {season.description && (
                <p className="text-[#C7C7C7] text-lg mb-4">{season.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#C7C7C7]">
                  <Calendar className="w-5 h-5 text-[#8469EF]" />
                  <span>{formatDate(season.startDate)} - {formatDate(season.endDate)}</span>
                </div>
                
                {season.club && (
                  <div className="flex items-center gap-3 text-[#C7C7C7]">
                    <Building2 className="w-5 h-5 text-[#8469EF]" />
                    <span>{season.club.name} • {season.club.city}</span>
                  </div>
                )}

                {season.referee && (
                  <div className="flex items-center gap-3 text-[#C7C7C7]">
                    <User className="w-5 h-5 text-[#8469EF]" />
                    <span>Судья: {season.referee.nickname || season.referee.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-[#C7C7C7]">
                  <Gamepad2 className="w-5 h-5 text-[#8469EF]" />
                  <span>{gamesCount} игр</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:w-64">
              <h2 className="text-xl font-semibold text-white mb-4">Статистика</h2>
              <div className="space-y-3">
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{gamesCount}</span>
                  </div>
                  <div className="text-gray-400 text-sm">Всего игр</div>
                </div>
                
                <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold text-white">-</span>
                  </div>
                  <div className="text-gray-400 text-sm">Участники</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Club Information */}
        {season.club && (
          <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#8469EF]" />
              Информация о клубе
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{season.club.name}</h3>
                <p className="text-[#C7C7C7] mb-3">{season.club.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#C7C7C7]">
                    <MapPin className="w-4 h-4" />
                    <span>{season.club.city}</span>
                  </div>
                  {season.club.socialMediaLink && (
                    <div className="flex items-center gap-2 text-[#C7C7C7]">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={season.club.socialMediaLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#8469EF] hover:underline"
                      >
                        Социальные сети
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {season.club.logo && (
                <div className="flex justify-center md:justify-end">
                  <Image 
                    src={season.club.logo} 
                    alt="Club logo" 
                    width={120} 
                    height={120} 
                    className="rounded-[12px] object-cover" 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Games List */}
        {season.club && (
          <GamesList
            clubId={season.club.id}
            seasonId={season.id}
            currentUser={currentUser}
            club={season.club}
            onRefresh={() => {
              // Обновляем данные сезона после создания игры
              seasonsAPI.getSeasonById(parseInt(seasonId as string))
                .then(setSeason)
                .catch(console.error);
            }}
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {isActive && (
            <button className="px-6 py-3 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors font-medium">
              Присоединиться
            </button>
          )}
          <button className="px-6 py-3 bg-[#404040] text-white rounded-lg hover:bg-[#555555] transition-colors font-medium">
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
} 