'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, Trophy, Clock, User } from 'lucide-react';
import { Season } from '../../api/seasons';
import { API_URL } from '../../api/API_URL';

interface SeasonCardProps {
  season: Season;
}

const SeasonCard: React.FC<SeasonCardProps> = ({ season }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Функция для правильного формирования пути к логотипу
  const getValidLogoPath = (logoPath: string | null | undefined) => {
    if (!logoPath) return null;
    
    // Если это уже полный URL, возвращаем как есть
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    
    // Если это путь к файлу аватара клуба, используем API endpoint
    if (logoPath.includes('club-avatars') || logoPath.includes('avatar')) {
      return `${API_URL}/files/club-avatars/${logoPath}`;
    }
    
    // Если уже правильный путь, возвращаем как есть
    if (logoPath.startsWith('/')) {
      return logoPath;
    }
    
    // Иначе добавляем ведущий слеш
    return `/${logoPath}`;
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

  const gamesCount = season.games?.length || 0;
  const isActive = season.status === 'ACTIVE';

  return (
    <div className="bg-[#303030] rounded-[7px] w-full h-[238px] flex flex-col justify-between p-4 hover:bg-[#404040] transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-[24px] font-semibold text-[#8469EF] leading-tight mb-1 line-clamp-1">
            {season.name}
          </div>
          <div className="text-[#C7C7C7] mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {season.club ? (
              <Link 
                href={`/clubs/${season.club.id}`}
                className="hover:text-blue-400 transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {season.club.name}
              </Link>
            ) : (
              'Не указан клуб'
            )}
          </div>
          <div className="text-[#C7C7C7] mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(season.startDate)} - {formatDate(season.endDate)}
          </div>
          <div className="text-[#C7C7C7] mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="font-medium text-[#8469EF]">Судья:</span>
            <span className="text-[#6B8CFF]">
              {season.referee?.nickname || season.referee?.email || 'Не назначен'}
            </span>
          </div>
          {season.description && (
            <div className="text-[#C7C7C7] text-sm line-clamp-2">
              {season.description}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[48px] ml-4">
          {season.club?.logo ? (
            <Link 
              href={`/clubs/${season.club.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={getValidLogoPath(season.club.logo)!} 
                alt="Club logo" 
                width={48} 
                height={48} 
                className="rounded-[6px] object-cover hover:opacity-80 transition-opacity cursor-pointer" 
              />
            </Link>
          ) : (
            <div className="w-12 h-12 bg-[#404040] rounded-[6px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#757575]" />
            </div>
          )}
          <div className="flex items-center gap-1 bg-[#FFF3E0] rounded-[6px] px-2 py-1 text-xs text-[#FFB800] font-semibold">
            <Image src="/star.png" alt="star" width={14} height={14} />
            {gamesCount}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(season.status)}`}>
            {getStatusText(season.status)}
          </span>
        </div>
      </div>
      <div className="mt-2">
        {isActive ? (
          <Link 
            href={`/seasons/${season.id}`}
            className="flex w-[248px] h-[52px] text-[18px] items-center gap-2 px-4 py-2 bg-[#8469EF] hover:bg-[#6B4FFF] text-white rounded-[7px] font-medium text-sm transition-colors"
          >
            Сезон активен
            <Image src="/login.png" alt="login" width={18} height={18} />
          </Link>
        ) : (
          <Link 
            href={`/seasons/${season.id}`}
            className="flex w-[215px] h-[52px] text-[18px] items-center gap-2 px-4 py-2 bg-[#444444] text-[#C7C7C7] rounded-[7px] font-medium text-sm hover:bg-[#555555] transition-colors"
          >
            Посмотреть сезон
          </Link>
        )}
      </div>
    </div>
  );
};

export default SeasonCard; 