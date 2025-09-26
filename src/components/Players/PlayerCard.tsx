'use client';

import React from 'react';
import Link from 'next/link';
import { User, Trophy, Target, Shield, Calendar, Crown } from 'lucide-react';
import { Player } from '../../api/users';
import Avatar from '../UI/Avatar';

interface PlayerCardProps {
  player: Player;
  rank?: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

  const totalKills = player.totalKills || 0;
  const totalDeaths = player.totalDeaths || 0;
  const kdr = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toString();

  // Форматируем очки и ELO рейтинг
  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    // Если число целое, показываем без десятичных знаков
    if (Number.isInteger(num)) return num.toString();
    // Иначе округляем до 1 знака после запятой
    return num.toFixed(1);
  };

  return (
    <div className="bg-[#303030] rounded-[7px] w-full hover:bg-[#404040] transition-colors">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between p-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Rank */}
          {rank && (
            <div className="flex items-center justify-center w-8 h-8 bg-[#8469EF] rounded-full text-white font-bold text-sm">
              {rank}
            </div>
          )}
          
          {/* Avatar */}
          <Avatar 
            avatar={player.avatar}
            size="md"
            fallback={player.nickname}
            className="w-10 h-10 rounded-[6px]"
          />

          {/* Player Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="text-lg font-semibold text-[#8469EF]">
                {player.nickname}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(player.role)}`}>
                {getRoleText(player.role)}
              </span>
              {player.clubName && (
                <span className="text-[#6B8CFF] text-sm">
                  {player.clubName}
                </span>
              )}
            </div>
            
            <div className="text-[#C7C7C7] text-sm flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{player.email}</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-white font-semibold">{formatNumber(player.tournamentsParticipated)}</div>
              <div className="text-gray-400 text-xs">Турниров сыграно</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold">{formatNumber(player.eloRating)}</div>
              <div className="text-gray-400 text-xs">Баллы</div>
            </div>
          </div>

          {/* View Profile Button */}
          <Link 
            href={`/players/${player.id}`}
            className="px-4 py-2 bg-[#8469EF] hover:bg-[#6B4FFF] text-white rounded-[7px] font-medium text-sm transition-colors"
          >
            Профиль
          </Link>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Rank */}
          {rank && (
            <div className="flex items-center justify-center w-6 h-6 bg-[#8469EF] rounded-full text-white font-bold text-xs">
              {rank}
            </div>
          )}
          
          {/* Avatar */}
          <Avatar 
            avatar={player.avatar}
            size="md"
            fallback={player.nickname}
            className="w-8 h-8 rounded-[6px]"
          />

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1 mb-2">
              <div className="text-base font-semibold text-[#8469EF] truncate">
                {player.nickname}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(player.role)}`}>
                  {getRoleText(player.role)}
                </span>
                {player.clubName && (
                  <span className="text-[#6B8CFF] text-xs">
                    {player.clubName}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-[#C7C7C7] text-xs flex items-center gap-1 mb-3">
              <User className="w-3 h-3" />
              <span className="truncate">{player.email}</span>
            </div>

            {/* Mobile Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center bg-[#2A2A2A] rounded p-2">
                <div className="text-white font-semibold text-sm">{formatNumber(player.tournamentsParticipated)}</div>
                <div className="text-gray-400 text-xs">Турниров сыграно</div>
              </div>
              <div className="text-center bg-[#2A2A2A] rounded p-2">
                <div className="text-white font-semibold text-sm">{formatNumber(player.eloRating)}</div>
                <div className="text-gray-400 text-xs">Баллы</div>
              </div>
            </div>

            {/* Mobile Profile Button */}
            <Link 
              href={`/players/${player.id}`}
              className="w-full px-4 py-2 bg-[#8469EF] hover:bg-[#6B4FFF] text-white rounded-[7px] font-medium text-sm transition-colors text-center block"
            >
              Профиль
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 