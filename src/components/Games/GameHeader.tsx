'use client';

import React from 'react';
import { Calendar, Clock, Building2, User, Users } from 'lucide-react';
import { Game } from '../../api/games';
import { getImageUrl } from '../../utils/imageUtils';
import SafeImage from '../UI/SafeImage';

interface GameHeaderProps {
  game: Game;
  getResultColor: (result: string) => string;
  getResultText: (result: string) => string;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  formatDate: (dateString: string) => string;
}

export default function GameHeader({ 
  game, 
  getResultColor, 
  getResultText, 
  getStatusColor, 
  getStatusText, 
  formatDate 
}: GameHeaderProps) {
  return (
    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Game Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#8469EF] mb-2">{game.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getResultColor(game.result)}`}>
                  {getResultText(game.result)}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(game.status)}`}>
                  {getStatusText(game.status)}
                </span>
              </div>
            </div>
            {game.club?.logo && getImageUrl(game.club.logo, 'logo') && (
              <SafeImage 
                src={getImageUrl(game.club.logo, 'logo')} 
                alt="Club logo" 
                width={80} 
                height={80} 
                className="rounded-[12px] object-cover"
              />
            )}
          </div>
          
          {game.description && (
            <p className="text-[#C7C7C7] text-lg mb-4">{game.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#C7C7C7]">
              <Calendar className="w-5 h-5 text-[#8469EF]" />
              <span>Запланирована: {formatDate(game.scheduledDate)}</span>
            </div>
            
            {game.completedDate && (
              <div className="flex items-center gap-3 text-[#C7C7C7]">
                <Clock className="w-5 h-5 text-[#8469EF]" />
                <span>Завершена: {formatDate(game.completedDate)}</span>
              </div>
            )}
            
            {game.club && (
              <div className="flex items-center gap-3 text-[#C7C7C7]">
                <Building2 className="w-5 h-5 text-[#8469EF]" />
                <span>{game.club.name} • {game.club.city}</span>
              </div>
            )}

            {game.referee && (
              <div className="flex items-center gap-3 text-[#C7C7C7]">
                <User className="w-5 h-5 text-[#8469EF]" />
                <span>Судья: {game.referee.nickname || game.referee.email}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-[#C7C7C7]">
              <Users className="w-5 h-5 text-[#8469EF]" />
              <span>{game.players.length} игроков</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 