'use client';

import React from 'react';
import RatingsTable from '../../components/Ratings/RatingsTable';

export default function EloPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-8 text-center">Система рейтингов</h1>
          
          <div className="space-y-8">
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Как работает система рейтингов</h2>
              <p className="text-gray-400 mb-4">
                Система рейтингов основана на распределении очков в зависимости от места в турнире и количества участников.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Чем выше место в турнире, тем больше очков получает игрок</p>
                <p>• Количество очков зависит от общего количества участников турнира</p>
                <p>• В турнирах с большим количеством игроков очки распределяются более равномерно</p>
                <p>• Система поощряет участие в турнирах с большим количеством участников</p>
              </div>
            </div>

            <RatingsTable />

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Пояснения к таблице</h2>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• <strong>Итоговое место в турнирной таблице</strong> - очки за общее место в турнире</p>
                <p>• <strong>Место</strong> - очки за место в конкретной игре</p>
                <p>• Числа в таблице показывают количество очков, которое получает игрок</p>
                <p>• Пустые ячейки означают, что при данном количестве игроков это место не присуждается</p>
                <p>• "3к" означает 3000 очков</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 