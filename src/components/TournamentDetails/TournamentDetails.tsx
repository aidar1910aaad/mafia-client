'use client';
import React, { useState, useEffect } from 'react';
import { Tournament, tournamentsAPI } from '../../api/tournaments';
import { Trophy, CheckCircle, XCircle, Star, MapPin, Calendar, Users, Crown } from 'lucide-react';
import GamesTable from './GamesTable';
import NominationsGrid from './NominationsGrid';
import LeaderboardTable from './LeaderboardTable';
import PlayerSearch from './PlayerSearch';
import GenerateFinalGamesModal from './GenerateFinalGamesModal';
import FinalGamesTable from './FinalGamesTable';

type Tab = 'games' | 'leaderboard' | 'nominations' | 'finalGames';

interface TournamentDetailsProps {
  tournament?: Tournament;
  currentUser?: any;
}

export default function TournamentDetails({ tournament, currentUser }: TournamentDetailsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('games');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);




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
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
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
      case 'finalGames':
        return <FinalGamesTable tournament={tournament} currentUser={currentUser} />;
      default:
        return <GamesTable tournament={tournament} currentUser={currentUser} />;
    }
  };

  // Проверяем, есть ли финальные игры
  const hasFinalGames = tournament?.games?.some(game => 
    game.name?.includes('Финальная игра') || game.description?.includes('финальная игра')
  ) || false;

  const getButtonClass = (tab: Tab) => {
    const baseClass = 'px-5 py-2 rounded-lg text-sm font-medium transition-colors';
    if (activeTab === tab) {
      return `${baseClass} bg-[#F633FF] text-white`;
    }
    return `${baseClass} bg-[#2C2C2C] text-gray-300 hover:bg-gray-700`;
  };

  const handleCompleteTournament = async () => {
    if (!tournament || !currentUser) return;

    // Проверяем права доступа - только судья турнира, владелец клуба турнира или системные админы
    const canComplete = currentUser.id === tournament.referee?.id ||
                       currentUser.role === 'admin' ||
                       currentUser.role === 'system_admin' ||
                       (currentUser.role === 'club_owner' && currentUser.id === tournament.club?.owner?.id) ||
                       (currentUser.role === 'club_admin' && currentUser.id === tournament.club?.owner?.id);

    if (!canComplete) {
      alert('У вас нет прав для завершения турнира');
      return;
    }

    // Проверяем, что турнир еще не завершен
    if (tournament.status === 'COMPLETED') {
      alert('Турнир уже завершен');
      return;
    }

    // Проверяем, что турнир можно завершить (активный или предстоящий)
    if (tournament.status !== 'ACTIVE' && tournament.status !== 'UPCOMING') {
      alert('Можно завершить только активный или предстоящий турнир. Текущий статус: ' + getStatusText(tournament.status));
      return;
    }

    const actionText = tournament.status === 'UPCOMING' ? 'отменить' : 'завершить';
    if (!confirm(`Вы уверены, что хотите ${actionText} турнир? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      setIsCompleting(true);
      await tournamentsAPI.completeTournament(tournament.id);
      
      // Обновляем статус турнира в локальном состоянии
      if (tournament) {
        tournament.status = 'COMPLETED';
      }
      
      const successText = tournament.status === 'UPCOMING' ? 'Турнир успешно отменен!' : 'Турнир успешно завершен!';
      alert(successText);
      
      // Перезагружаем страницу для обновления данных
      window.location.reload();
    } catch (error) {
      console.error('Ошибка завершения турнира:', error);
      alert(`Ошибка завершения турнира: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleGamesGenerated = () => {
    // Перезагружаем страницу для обновления данных
    window.location.reload();
  };

  return (
    <div className="bg-[#161616] text-white min-h-screen py-8">
      <div className="max-w-[1280px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          {tournament.stars && (
            <div className="bg-[#1E1E1E] text-yellow-400 px-2 py-1 rounded-full text-sm flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              {tournament.stars}
            </div>
          )}
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
          {tournament.status === 'COMPLETED' && (
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Турнир завершен
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">
            {tournament.name}
          </h1>
          
          {/* Кнопки управления турниром */}
          {(() => {
            const hasPermission = currentUser && (currentUser.id === tournament.referee?.id ||
                                currentUser.role === 'admin' ||
                                currentUser.role === 'system_admin' ||
                                (currentUser.role === 'club_owner' && currentUser.id === tournament.club?.owner?.id) ||
                                (currentUser.role === 'club_admin' && currentUser.id === tournament.club?.owner?.id));
            const canComplete = tournament.status === 'ACTIVE' || tournament.status === 'UPCOMING';
            
            console.log('Проверка прав доступа:');
            console.log('hasPermission:', hasPermission);
            console.log('canComplete:', canComplete);
            console.log('Показывать кнопки:', hasPermission && canComplete);
            
            return hasPermission && canComplete;
          })() && (
            <div className="flex gap-3">
              {/* Кнопка генерации финальных игр */}
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
              >
                <Trophy className="w-5 h-5" />
                Генерировать финальные игры
              </button>
              
              {/* Кнопка завершения турнира */}
              <button
                onClick={handleCompleteTournament}
                disabled={isCompleting}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-800 disabled:to-red-900 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-red-500/25 disabled:shadow-none"
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Завершение...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Завершение турнира
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Info boxes */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Локация
              </div>
              <div>{tournament.club?.city || 'Не указано'}</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Организатор
              </div>
              <div>{tournament.club?.name || 'Не указано'}</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Дата проведения
              </div>
              <div>{formatDate(tournament.date)}</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <div className="text-gray-400 mb-1 text-sm flex items-center gap-2">
                {tournament.stars ? <Star className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                {tournament.stars ? 'Звездность' : 'Количество игр'}
              </div>
              <div>
                {tournament.stars ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    {tournament.stars}
                  </div>
                ) : (
                  tournament.games?.length || tournament.gamesCount || 0
                )}
              </div>
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
                  <p className="text-[#F633FF] font-medium flex items-center gap-2">
                    <Crown className="w-4 h-4" />
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
                  <p className="text-[#FFA736] font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
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

        {/* Завершенный турнир - информационное сообщение */}
        {tournament.status === 'COMPLETED' && (
          <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-blue-400 font-medium mb-1">Турнир завершен</div>
                <div className="text-blue-300 text-sm">
                  Все игры сыграны, результаты подсчитаны. Турнирная таблица и номинации доступны для просмотра.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player Search Component - показываем только судье и только для незавершенных турниров */}
        {tournament.status !== 'COMPLETED' && (
          <PlayerSearch 
            tournament={tournament}
            currentUser={currentUser}
            onPlayerAdded={() => {
              // Здесь можно обновить данные турнира
              console.log('Игрок добавлен в турнир');
            }}
          />
        )}

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
          {hasFinalGames && (
            <button onClick={() => setActiveTab('finalGames')} className={getButtonClass('finalGames')}>
              Финальные игры
            </button>
          )}
        </div>

        {/* Content based on tab */}
        <div>
          {renderContent()}
        </div>

        {/* Модальное окно генерации финальных игр */}
        <GenerateFinalGamesModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          tournament={tournament}
          onGamesGenerated={handleGamesGenerated}
        />
      </div>
    </div>
  );
} 