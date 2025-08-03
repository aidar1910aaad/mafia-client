'use client';

import React from 'react';
import { Award, Star } from 'lucide-react';
import { Game } from '../../api/games';

interface GameResultTableProps {
  game: Game;
}

export default function GameResultTable({ game }: GameResultTableProps) {
  if (Object.keys(game.resultTable).length === 0) return null;

  return (
    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-[#8469EF]" />
        Таблица результатов
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(game.resultTable).map(([round, result]) => (
          <div key={round} className="bg-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{round}</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-[#C7C7C7] text-sm">
              {result || 'Нет данных'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 