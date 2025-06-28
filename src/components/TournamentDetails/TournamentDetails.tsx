'use client';
import React, { useState } from 'react';
import GamesTable from './GamesTable';
import NominationsGrid from './NominationsGrid';
import LeaderboardTable from './LeaderboardTable';

type Tab = 'games' | 'leaderboard' | 'nominations';

export default function TournamentDetails() {
  const [activeTab, setActiveTab] = useState<Tab>('games');

  const renderContent = () => {
    switch (activeTab) {
      case 'games':
        return <GamesTable />;
      case 'leaderboard':
        return <LeaderboardTable />;
      case 'nominations':
        return <NominationsGrid />;
      default:
        return <GamesTable />;
    }
  };

  const getButtonClass = (tab: Tab) => {
    const baseClass = 'px-5 py-2 rounded-lg text-sm font-medium transition-colors';
    if (activeTab === tab) {
      return `${baseClass} bg-[#F633FF] text-white`;
    }
    return `${baseClass} bg-[#2C2C2C] text-gray-300 hover:bg-gray-700`;
  };

  return (
    <div className="bg-[#161616] text-white min-h-screen py-8 px-4">
      <div className="max-w-[1280px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#1E1E1E] text-yellow-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <span className="text-lg">⭐</span> 0
          </div>
        </div>

        <h1 className="text-3xl font-semibold mb-6">
          Капитанский стол II сезон | Легион city
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Info boxes */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Локация</div>
              <div>Россия, Москва</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Организатор</div>
              <div>Легион city</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Тип турнира</div>
              <div>Личный</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Количество участников</div>
              <div>12</div>
            </div>
          </div>
          
          {/* Profiles */}
          <div className="space-y-4">
            <div className="bg-[#1E1E1E] p-4 rounded-lg flex items-center gap-4 border border-gray-700">
              <img src="/avatar1.png" alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="text-[#F633FF] font-medium">Берлускони</p>
                <p className="text-xs text-gray-400">ГС турнира</p>
              </div>
            </div>
            <div className="bg-[#1E1E1E] p-4 rounded-lg flex items-center gap-4 border border-gray-700">
              <img src="/avatar2.png" alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="text-[#FFA736] font-medium">Керамбит</p>
                <p className="text-xs text-gray-400">Организатор</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setActiveTab('games')} className={getButtonClass('games')}>
            Игры
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={getButtonClass('leaderboard')}>
            Турнирная таблица
          </button>
          <button onClick={() => setActiveTab('nominations')} className={getButtonClass('nominations')}>
            Номинации
          </button>
        </div>

        {/* Content based on tab */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 