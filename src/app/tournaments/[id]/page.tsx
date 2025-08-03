'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Trophy, 
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
  Mail
} from 'lucide-react';
import { tournamentsAPI, Tournament } from '../../../api/tournaments';
import { authAPI } from '../../../api/auth';
import GamesList from '../../../components/Games/GamesList';

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id;
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем турнир и пользователя параллельно
        const [tournamentData, userData] = await Promise.all([
          tournamentsAPI.getTournamentById(parseInt(tournamentId as string)),
          authAPI.getProfile().catch(() => null) // Игнорируем ошибки если пользователь не авторизован
        ]);
        
        setTournament(tournamentData);
        setCurrentUser(userData);
      } catch (err) {
        console.error('Error fetching tournament:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки турнира');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  // Отладочная информация
  useEffect(() => {
    if (tournament) {
      console.log('Tournament clubId:', tournament.clubId, 'type:', typeof tournament.clubId);
      console.log('Tournament club.id:', tournament.club?.id, 'type:', typeof tournament.club?.id);
      console.log('Tournament page - clubId exists:', !!tournament.club?.id, 'clubId:', tournament.club?.id);
      console.log('Full tournament object:', tournament);
    }
  }, [tournament]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'ACTIVE':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'COMPLETED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'CANCELLED':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING':
        return 'Предстоящий';
      case 'ACTIVE':
        return 'Активный';
      case 'COMPLETED':
        return 'Завершен';
      case 'CANCELLED':
        return 'Отменен';
      default:
        return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
          <span className="text-gray-400">Загрузка турнира...</span>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Ошибка загрузки турнира</div>
            <div className="text-gray-400 mb-4">{error || 'Турнир не найден'}</div>
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к списку турниров
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
          Вернуться к списку турниров
        </Link>

        {/* Main Tournament Card */}
        <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tournament Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#8469EF] mb-2">{tournament.name}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(tournament.status)}`}>
                    {getStatusText(tournament.status)}
                  </span>
                </div>
                {tournament.club?.logo && (
                  <Image 
                    src={tournament.club.logo} 
                    alt="Club logo" 
                    width={80} 
                    height={80} 
                    className="rounded-[12px] object-cover" 
                  />
                )}
              </div>
              
              {tournament.description && (
                <p className="text-[#C7C7C7] text-lg mb-4">{tournament.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#C7C7C7]">
                  <Calendar className="w-5 h-5 text-[#8469EF]" />
                  <span>{formatDate(tournament.date)}</span>
                </div>
                
                {tournament.club && (
                  <div className="flex items-center gap-3 text-[#C7C7C7]">
                    <Building2 className="w-5 h-5 text-[#8469EF]" />
                    <span>{tournament.club.name} • {tournament.club.city}</span>
                  </div>
                )}

                {tournament.referee && (
                  <div className="flex items-center gap-3 text-[#C7C7C7]">
                    <User className="w-5 h-5 text-[#8469EF]" />
                    <span>Судья: {tournament.referee.nickname || tournament.referee.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-[#C7C7C7]">
                  <Gamepad2 className="w-5 h-5 text-[#8469EF]" />
                  <span>{tournament.gamesCount || 0} игр</span>
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
                    <span className="text-2xl font-bold text-white">{tournament.gamesCount || 0}</span>
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
        {tournament.club && (
          <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#8469EF]" />
              Информация о клубе
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{tournament.club.name}</h3>
                <p className="text-[#C7C7C7] mb-3">{tournament.club.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#C7C7C7]">
                    <MapPin className="w-4 h-4" />
                    <span>{tournament.club.city}</span>
                  </div>
                  {tournament.club.socialMediaLink && (
                    <div className="flex items-center gap-2 text-[#C7C7C7]">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={tournament.club.socialMediaLink} 
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
              {tournament.club.logo && (
                <div className="flex justify-center md:justify-end">
                  <Image 
                    src={tournament.club.logo} 
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
        {tournament.club && (
          <GamesList
            clubId={tournament.club.id}
            tournamentId={tournament.id}
            currentUser={currentUser}
            club={tournament.club}
            onRefresh={() => {
              // Обновляем данные турнира после создания игры
              tournamentsAPI.getTournamentById(parseInt(tournamentId as string))
                .then(setTournament)
                .catch(console.error);
            }}
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {tournament.status === 'UPCOMING' && (
            <button className="px-6 py-3 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors font-medium">
              Зарегистрироваться
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