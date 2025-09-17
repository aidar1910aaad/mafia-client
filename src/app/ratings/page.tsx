'use client';

import React from 'react';
import RatingsTable from '../../components/Ratings/RatingsTable';

export default function RatingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#161616] via-[#1A1A1A] to-[#161616]">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] bg-clip-text text-transparent">
            Система рейтингов по звездам
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Справочная таблица распределения очков по местам в зависимости от количества участников турнира и уровня сложности (звезды)
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] mx-auto rounded-full mt-6"></div>
        </div>

        <div className="space-y-12">
          {/* Info Section */}
          <div className="bg-gradient-to-br from-[#1D1D1D] to-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8469EF] to-[#6B4FFF] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold">Как работает система рейтингов по звездам</h2>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Система рейтингов основана на справедливом распределении очков в зависимости от места в турнире, количества участников и уровня сложности (звезды).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#8469EF] rounded-full"></div>
                  <p className="text-gray-300">6 звезд - самый высокий уровень сложности с максимальными очками</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#6B4FFF] rounded-full"></div>
                  <p className="text-gray-300">1 звезда - базовый уровень сложности с минимальными очками</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#8469EF] rounded-full"></div>
                  <p className="text-gray-300">Чем выше место в турнире, тем больше очков получает игрок</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#6B4FFF] rounded-full"></div>
                  <p className="text-gray-300">Количество очков зависит от общего количества участников турнира</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#8469EF] rounded-full"></div>
                  <p className="text-gray-300">В турнирах с большим количеством игроков очки распределяются более равномерно</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#6B4FFF] rounded-full"></div>
                  <p className="text-gray-300">Система поощряет участие в турнирах с большим количеством участников</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <RatingsTable />

          {/* Legend Section */}
          <div className="bg-gradient-to-br from-[#1D1D1D] to-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6B4FFF] to-[#8469EF] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold">Пояснения к таблице</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#8469EF] to-[#6B4FFF] rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">1</div>
                  <div>
                    <p className="text-white font-semibold mb-1">6 звезд - Итоговое место в турнирной таблице</p>
                    <p className="text-gray-300 text-sm">Очки за общее место в турнире высшего уровня</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#6B4FFF] to-[#8469EF] rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">2</div>
                  <div>
                    <p className="text-white font-semibold mb-1">5-1 звезды - Место</p>
                    <p className="text-gray-300 text-sm">Очки за место в конкретной игре по уровням сложности</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#8469EF] to-[#6B4FFF] rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">3</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Числа в таблице</p>
                    <p className="text-gray-300 text-sm">Показывают количество очков, которое получает игрок</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#6B4FFF] to-[#8469EF] rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">4</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Пустые ячейки (-)</p>
                    <p className="text-gray-300 text-sm">Означают, что при данном количестве игроков это место не присуждается</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#8469EF] to-[#6B4FFF] rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">5</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Уровни сложности</p>
                    <p className="text-gray-300 text-sm">6 звезд = максимальная сложность, 1 звезда = базовая сложность</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#6B4FFF] to-[#8469EF] rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">6</div>
                  <div>
                    <p className="text-white font-semibold mb-1">Специальные значения</p>
                    <p className="text-gray-300 text-sm">"3к" означает 3000 очков</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-[#8469EF]/10 to-[#6B4FFF]/10 rounded-lg border border-[#8469EF]/20">
              <p className="text-yellow-400 font-semibold text-center">
                💡 "3к" означает 3000 очков
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}