'use client';
import React, { useState, useEffect } from 'react';
import { Tournament } from '../../api/tournaments';
import GamesTable from './GamesTable';
import NominationsGrid from './NominationsGrid';
import LeaderboardTable from './LeaderboardTable';
import PlayerSearch from './PlayerSearch';

type Tab = 'games' | 'leaderboard' | 'nominations';

interface TournamentDetailsProps {
  tournament?: Tournament;
  currentUser?: any;
}

export default function TournamentDetails({ tournament, currentUser }: TournamentDetailsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('games');
  const [isLoading, setIsLoading] = useState(false);

  // Логируем данные турнира для отладки
  useEffect(() => {
    console.log('TournamentDetails получил турнир:', tournament);
    console.log('TournamentDetails получил пользователя:', currentUser);
  }, [tournament, currentUser]);

  // Если турнир не загружен, показываем загрузку
  if (!tournament) {
    return (
      <div className="bg-[#161616] text-white min-h-screen py-8">
        <div className="max-w-[1280px] w-full mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Загрузка турнира...</div>
          </div>
        </div>
      </div>
    );
  }

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

  const renderContent = () => {
    switch (activeTab) {
      case 'games':
        return <GamesTable tournament={tournament} currentUser={currentUser} />;
      case 'leaderboard':
        return <LeaderboardTable tournament={tournament} />;
      case 'nominations':
        return <NominationsGrid tournament={tournament} />;
      default:
        return <GamesTable tournament={tournament} currentUser={currentUser} />;
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
    <div className="bg-[#161616] text-white min-h-screen py-8">
      <div className="max-w-[1280px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#1E1E1E] text-yellow-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <span className="text-lg">⭐</span> {tournament.gamesCount || 0}
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
        </div>

        <h1 className="text-3xl font-semibold mb-6">
          {tournament.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Info boxes */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Локация</div>
              <div>{tournament.club?.city || 'Не указано'}</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Организатор</div>
              <div>{tournament.club?.name || 'Не указано'}</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Дата проведения</div>
              <div>{formatDate(tournament.date)}</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm">Количество игр</div>
              <div>{tournament.gamesCount || 0}</div>
            </div>
          </div>
          
          {/* Profiles */}
          <div className="space-y-4">
            {tournament.referee && (
              <div className="bg-[#1E1E1E] p-4 rounded-lg flex items-center gap-4 border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-[#8469EF] flex items-center justify-center text-white font-bold">
                  {tournament.referee.nickname?.charAt(0) || tournament.referee.email?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-[#F633FF] font-medium">
                    {tournament.referee.nickname || tournament.referee.email}
                  </p>
                  <p className="text-xs text-gray-400">Судья турнира</p>
                </div>
              </div>
            )}
            {tournament.club?.owner && (
              <div className="bg-[#1E1E1E] p-4 rounded-lg flex items-center gap-4 border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-[#FFA736] flex items-center justify-center text-white font-bold">
                  {tournament.club.owner.nickname?.charAt(0) || tournament.club.owner.email?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-[#FFA736] font-medium">
                    {tournament.club.owner.nickname || tournament.club.owner.email}
                  </p>
                  <p className="text-xs text-gray-400">Организатор</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {tournament.description && (
          <div className="bg-[#1E1E1E] rounded-lg p-4 mb-6">
            <div className="text-gray-400 mb-2 text-sm">Описание турнира</div>
            <div className="text-white">{tournament.description}</div>
          </div>
        )}

        {/* Player Search Component - показываем только судье */}
        <PlayerSearch 
          tournament={tournament}
          currentUser={currentUser}
          onPlayerAdded={() => {
            // Здесь можно обновить данные турнира
            console.log('Игрок добавлен в турнир');
          }}
        />

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