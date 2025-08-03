'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Trophy, MapPin } from 'lucide-react';
import { Tournament } from '../../api/tournaments';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
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

  const isRegistrationOpen = tournament.status === 'UPCOMING';

  return (
    <div className="bg-[#303030] rounded-[7px] w-full h-[238px] flex flex-col justify-between p-4 hover:bg-[#404040] transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-[24px] font-semibold text-[#8469EF] leading-tight mb-1 line-clamp-1">
            {tournament.name}
          </div>
          <div className="text-[#C7C7C7] mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {tournament.club ? (
              <Link 
                href={`/clubs/${tournament.club.id}`}
                className="hover:text-blue-400 transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {tournament.club.name}
              </Link>
            ) : tournament.clubName ? (
              <span>{tournament.clubName}</span>
            ) : (
              'Не указан клуб'
            )}
          </div>
          <div className="text-[#C7C7C7] mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(tournament.date)}
          </div>
          <div className="text-[#C7C7C7] mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="font-medium text-[#8469EF]">Судья:</span>
            <span className="text-[#6B8CFF]">
              {tournament.refereeName || tournament.refereeEmail || 'Не назначен'}
            </span>
          </div>
          {tournament.description && (
            <div className="text-[#C7C7C7] text-sm line-clamp-2">
              {tournament.description}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[48px] ml-4">
          {tournament.club?.logo ? (
            <Link 
              href={`/clubs/${tournament.club.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={tournament.club.logo} 
                alt="Club logo" 
                width={48} 
                height={48} 
                className="rounded-[6px] object-cover hover:opacity-80 transition-opacity cursor-pointer" 
              />
            </Link>
          ) : tournament.clubLogo ? (
            <Image 
              src={tournament.clubLogo} 
              alt="Club logo" 
              width={48} 
              height={48} 
              className="rounded-[6px] object-cover" 
            />
          ) : (
            <div className="w-12 h-12 bg-[#404040] rounded-[6px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#757575]" />
            </div>
          )}
          <div className="flex items-center gap-1 bg-[#FFF3E0] rounded-[6px] px-2 py-1 text-xs text-[#FFB800] font-semibold">
            <Image src="/star.png" alt="star" width={14} height={14} />
            {tournament.gamesCount || 0}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
        </div>
      </div>
      <div className="mt-2">
        {isRegistrationOpen ? (
          <Link 
            href={`/tournaments/${tournament.id}`}
            className="flex w-[248px] h-[52px] text-[18px] items-center gap-2 px-4 py-2 bg-[#8469EF] hover:bg-[#6B4FFF] text-white rounded-[7px] font-medium text-sm transition-colors"
          >
            Регистрация открыта
            <Image src="/login.png" alt="login" width={18} height={18} />
          </Link>
        ) : (
          <Link 
            href={`/tournaments/${tournament.id}`}
            className="flex w-[215px] h-[52px] text-[18px] items-center gap-2 px-4 py-2 bg-[#444444] text-[#C7C7C7] rounded-[7px] font-medium text-sm hover:bg-[#555555] transition-colors"
          >
            Посмотреть турнир
          </Link>
        )}
      </div>
    </div>
  );
};

export default TournamentCard; 