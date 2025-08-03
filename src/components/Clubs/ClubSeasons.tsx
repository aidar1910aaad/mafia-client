'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { seasonsAPI, Season } from '../../api/seasons';
import { Calendar, Clock, User, Trophy, ExternalLink } from 'lucide-react';

interface ClubSeasonsProps {
  clubId: number;
}

export default function ClubSeasons({ clubId }: ClubSeasonsProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setLoading(true);
        const seasonsData = await seasonsAPI.getClubSeasons(clubId);
        const seasonsArray = Array.isArray(seasonsData) ? seasonsData : (seasonsData?.seasons || []);
        setSeasons(seasonsArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки сезонов');
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, [clubId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'UPCOMING':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'INACTIVE':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'COMPLETED':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Активный';
      case 'UPCOMING':
        return 'Предстоящий';
      case 'INACTIVE':
        return 'Неактивный';
      case 'COMPLETED':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Текущие сезоны
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
          Текущие сезоны
        </h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  if (seasons.length === 0) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Текущие сезоны
        </h3>
        <div className="text-gray-400 text-sm text-center py-4">
          У клуба пока нет сезонов
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Текущие сезоны
      </h3>
      
      <div className="space-y-3">
        {seasons.map((season) => (
          <Link
            key={season.id}
            href={`/seasons/${season.id}`}
            className="block"
          >
            <div 
              className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-4 hover:border-[#404040]/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-medium text-base group-hover:text-blue-400 transition-colors">
                    {season.name}
                  </h4>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(season.status)}`}>
                  {getStatusText(season.status)}
                </span>
              </div>
              
              {season.description && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {season.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Начало: {formatDate(season.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Окончание: {formatDate(season.endDate)}</span>
                </div>
              </div>
              
              {season.referee && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <User className="w-3 h-3" />
                  <span>Судья: {season.referee.nickname || season.referee.email}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 