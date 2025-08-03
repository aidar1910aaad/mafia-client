'use client';

import React from 'react';
import { Target, Shield, Skull, Heart } from 'lucide-react';
import { Game } from '../../api/games';

interface GameStatsProps {
  game: Game;
}

export default function GameStats({ game }: GameStatsProps) {
  const totalKills = game.players.reduce((sum, p) => sum + p.kills, 0);
  const totalPoints = game.players.reduce((sum, p) => sum + p.points, 0);
  const mafiaPlayers = game.players.filter(p => p.role === 'MAFIA');
  const citizenPlayers = game.players.filter(p => p.role === 'CITIZEN');

  return (
    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Статистика</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-red-400" />
            <span className="text-2xl font-bold text-white">{totalKills}</span>
          </div>
          <div className="text-gray-400 text-sm">Всего убийств</div>
        </div>
        
        <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">{totalPoints}</span>
          </div>
          <div className="text-gray-400 text-sm">Всего очков</div>
        </div>

        <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Skull className="w-5 h-5 text-red-400" />
            <span className="text-2xl font-bold text-white">{mafiaPlayers.length}</span>
          </div>
          <div className="text-gray-400 text-sm">Мафия</div>
        </div>

        <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">{citizenPlayers.length}</span>
          </div>
          <div className="text-gray-400 text-sm">Горожане</div>
        </div>
      </div>
    </div>
  );
} 