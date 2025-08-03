'use client';

import React from 'react';
import { Trophy, Calendar } from 'lucide-react';
import { Game } from '../../api/games';

interface GameSeasonTournamentInfoProps {
  game: Game;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  formatDate: (dateString: string) => string;
}

export default function GameSeasonTournamentInfo({ 
  game, 
  getStatusColor, 
  getStatusText, 
  formatDate 
}: GameSeasonTournamentInfoProps) {
  if (!game.season && !game.tournament) return null;

  return (
    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-[#8469EF]" />
        {game.season ? 'Информация о сезоне' : 'Информация о турнире'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {game.season && (
            <>
              <h3 className="text-lg font-medium text-white mb-2">{game.season.name}</h3>
              <p className="text-[#C7C7C7] mb-3">{game.season.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C7C7C7]">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(game.season.startDate)} - {formatDate(game.season.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-[#C7C7C7]">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(game.season.status)}`}>
                    {getStatusText(game.season.status)}
                  </span>
                </div>
              </div>
            </>
          )}
          {game.tournament && (
            <>
              <h3 className="text-lg font-medium text-white mb-2">{game.tournament.name}</h3>
              <p className="text-[#C7C7C7] mb-3">{game.tournament.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C7C7C7]">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(game.tournament.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-[#C7C7C7]">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(game.tournament.status)}`}>
                    {getStatusText(game.tournament.status)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 