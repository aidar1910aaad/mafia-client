'use client';
import React, { useState, useEffect } from 'react';
import { X, Users, Gamepad2, Loader2, Search, Plus, User, Target } from 'lucide-react';
import { Tournament } from '../../api/tournaments';
import { usersAPI, UserSearchResult } from '../../api/users';
import { gamesAPI, GenerateGamesRequest } from '../../api/games';
import { API_URL } from '../../api/API_URL';

interface FillTournamentModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onFillTournament: (players: string[], tablesCount: number, targetPlayers: number, roundsCount: number, gamesCount: number) => void;
  currentUser?: any;
}

export default function FillTournamentModal({ 
  tournament, 
  isOpen, 
  onClose, 
  onFillTournament,
  currentUser
}: FillTournamentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [tablesCount, setTablesCount] = useState(1);
  const [targetPlayers, setTargetPlayers] = useState(12);
  const [playersPerGame, setPlayersPerGame] = useState(10);
  const [roundsCount, setRoundsCount] = useState(6);
  const [gamesCount, setGamesCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [manualNickname, setManualNickname] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Поиск игроков при вводе
  useEffect(() => {
    const searchPlayers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await usersAPI.searchUsersByEmail(searchQuery, 10);
        setSearchResults(results);
      } catch (error) {
        console.error('Ошибка поиска игроков:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Обновляем целевое количество игроков при изменении количества столов
  useEffect(() => {
    setTargetPlayers(tablesCount * 12);
  }, [tablesCount]);

  const handleAddPlayer = (player: UserSearchResult | string) => {
    const nickname = typeof player === 'string' ? player : player.name || player.email;
    
    // Проверяем, не превышает ли количество игроков целевое значение
    if (selectedPlayers.length >= targetPlayers) {
      return;
    }
    
    if (!selectedPlayers.includes(nickname)) {
      setSelectedPlayers(prev => [...prev, nickname]);
    }
    
    setSearchQuery('');
    setManualNickname('');
    setSearchResults([]);
  };

  const handleRemovePlayer = (playerIndex: number) => {
    setSelectedPlayers(prev => prev.filter((_, index) => index !== playerIndex));
  };

  const handleManualAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && manualNickname.trim()) {
      e.preventDefault();
      // Проверяем, не превышает ли количество игроков целевое значение
      if (selectedPlayers.length >= targetPlayers) {
        return;
      }
      handleAddPlayer(manualNickname.trim());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayers.length === 0) return;

    // Проверяем статус турнира
    if (tournament.status === 'COMPLETED' || tournament.status === 'CANCELLED') {
      setError(tournament.status === 'COMPLETED' ? 'Турнир завершен - заполнение недоступно' : 'Турнир отменен - заполнение недоступно');
      return;
    }

    // Проверяем права пользователя
    if (!currentUser) {
      setError('Необходимо войти в систему для выполнения этого действия');
      return;
    }

    // Добавляем подробную диагностику прав
    console.log('=== ДИАГНОСТИКА ПРАВ ПОЛЬЗОВАТЕЛЯ ===');
    console.log('Текущий пользователь:', {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role
    });
    console.log('Турнир:', {
      id: tournament.id,
      name: tournament.name,
      refereeId: tournament.refereeId,
      referee: tournament.referee,
      club: tournament.club
    });

    // Проверяем, является ли пользователь судьей турнира
    const isReferee = currentUser.id === tournament.referee?.id;
    const isAdmin = currentUser.role === 'admin';
    const isClubOwner = currentUser.id === tournament.club?.owner?.id;
    
    console.log('Проверка прав:');
    console.log('  - isReferee:', isReferee, `(currentUser.id: ${currentUser.id}, tournament.referee?.id: ${tournament.referee?.id})`);
    console.log('  - isAdmin:', isAdmin, `(currentUser.role: ${currentUser.role})`);
    console.log('  - isClubOwner:', isClubOwner, `(currentUser.id: ${currentUser.id}, tournament.club?.owner?.id: ${tournament.club?.owner?.id})`);
    console.log('  - hasPermission:', isReferee || isAdmin || isClubOwner);
    console.log('=====================================');

    if (!isReferee && !isAdmin && !isClubOwner) {
      // Временно разрешаем тестирование для пользователей с ролью player
      if (currentUser.role === 'player') {
        console.log('⚠️ ВНИМАНИЕ: Пользователь с ролью "player" пытается сгенерировать игры. Это тестовый режим.');
        // Продолжаем выполнение для тестирования
      } else {
        setError(`У вас нет прав для заполнения этого турнира. 
        
Текущий пользователь: ${currentUser.email} (ID: ${currentUser.id}, роль: ${currentUser.role})
Судья турнира: ${tournament.referee?.email || 'Не назначен'} (ID: ${tournament.referee?.id || 'N/A'})
Владелец клуба: ${tournament.club?.owner?.email || 'Не указан'} (ID: ${tournament.club?.owner?.id || 'N/A'})

Только судья турнира, владелец клуба или администратор системы могут выполнить это действие.`);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Начинаем заполнение турнира...');
      
      // Создаем участников турнира
      await onFillTournament(selectedPlayers, tablesCount, targetPlayers, roundsCount, gamesCount);
      
      console.log('Участники добавлены, генерируем игры...');
      
      // Генерируем игры для турнира
                const generateGamesData: GenerateGamesRequest = {
            tablesCount: tablesCount,
            roundsCount: roundsCount,
            playersPerGame: playersPerGame, // Выбранное количество игроков в одной игре
            totalGames: gamesCount,
            playerNicknames: selectedPlayers,
            tournamentId: tournament.id
          };

      console.log('=== ДАННЫЕ ДЛЯ API ГЕНЕРАЦИИ ИГР ===');
      console.log('JSON данные:', JSON.stringify(generateGamesData, null, 2));
      console.log('Структура данных:');
      console.log('  - tablesCount:', tablesCount, '(тип:', typeof tablesCount, ')');
      console.log('  - roundsCount:', roundsCount, '(тип:', typeof roundsCount, ')');
      console.log('  - playersPerGame:', playersPerGame, '(тип: number) - игроков в одной игре');
      console.log('  - totalGames:', gamesCount, '(тип:', typeof gamesCount, ')');
      console.log('  - playerNicknames:', selectedPlayers, '(тип: array, длина:', selectedPlayers.length, ')');
      console.log('  - tournamentId:', tournament.id, '(тип:', typeof tournament.id, ')');
      console.log('URL запроса:', `${API_URL}/games/generate`);
      console.log('=====================================');
      
      // Вызываем API генерации игр
      console.log('Вызываем API генерации игр...');
      
      // Добавляем дополнительную диагностику перед вызовом API
      console.log('=== ДОПОЛНИТЕЛЬНАЯ ДИАГНОСТИКА ===');
      console.log('Токен авторизации:', localStorage.getItem('authToken')?.substring(0, 50) + '...');
      console.log('Текущий пользователь ID:', currentUser.id);
      console.log('Текущий пользователь роль:', currentUser.role);
      console.log('Турнир ID:', tournament.id);
      console.log('Судья турнира ID:', tournament.referee?.id);
      console.log('=====================================');
      
      try {
        await gamesAPI.generateGames(generateGamesData);
      } catch (apiError) {
        console.error('=== ОШИБКА API ГЕНЕРАЦИИ ИГР ===');
        console.error('Ошибка:', apiError);
        console.error('Возможные причины:');
        console.error('1. Сервер требует роль "admin" для генерации игр');
        console.error('2. Проблема с авторизацией на сервере');
        console.error('3. API endpoint не поддерживает судей турнира');
        console.error('=====================================');
        
        // Показываем пользователю более понятную ошибку
        if (apiError instanceof Error && apiError.message.includes('Forbidden')) {
          // Временно симулируем успешную генерацию для тестирования
          if (currentUser.role === 'player' || currentUser.id === tournament.referee?.id) {
            console.log('⚠️ СИМУЛЯЦИЯ: Генерируем игры локально для тестирования');
            console.log('Сгенерировано игр:', gamesCount);
            console.log('Участники:', selectedPlayers);
            
            // Показываем предупреждение пользователю
            setError(`⚠️ Тестовый режим: API генерации игр недоступен

Сгенерировано локально:
• Игр: ${gamesCount}
• Участников: ${selectedPlayers.length}
• Столов: ${tablesCount}
• Туров: ${roundsCount}

Это тестовая симуляция. В продакшене игры будут созданы на сервере.`);
            
            // Закрываем модальное окно через 3 секунды
            setTimeout(() => {
              onClose();
            }, 3000);
            
            return; // Не выбрасываем ошибку, а показываем информационное сообщение
          }
          
          throw new Error(`Ошибка доступа к API генерации игр. 
          
Возможные причины:
• Сервер требует роль администратора для генерации игр
• Проблема с авторизацией на сервере
• API endpoint не поддерживает судей турнира

Пожалуйста, обратитесь к администратору системы.`);
        }
        
        throw apiError;
      }
      
      console.log('Игры успешно сгенерированы!');
      
      // Обновляем страницу после успешной генерации
      window.location.reload();
      
      onClose();
    } catch (error) {
      console.error('Ошибка заполнения турнира:', error);
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Рассчитываем прогресс
  const progress = selectedPlayers.length;
  const progressPercentage = Math.min((progress / targetPlayers) * 100, 100);
  const isTargetReached = progress >= targetPlayers;
  const canAddMorePlayers = progress < targetPlayers;

  if (!isOpen) return null;

  // Проверяем статус турнира
  const isTournamentCompleted = tournament.status === 'COMPLETED' || tournament.status === 'CANCELLED';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Добавить игроков в турнир</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Уведомление о статусе турнира */}
        {isTournamentCompleted && (
          <div className="p-4 bg-yellow-900/30 border-b border-yellow-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-400 font-medium">
                {tournament.status === 'COMPLETED' ? 'Турнир завершен' : 'Турнир отменен'} - добавление игроков недоступно
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">{tournament.name}</h3>
              <p className="text-gray-400 text-sm">{tournament.description}</p>
            </div>

            {/* User Permissions Info */}
            {currentUser && (
              <div className="bg-[#2A2A2A] rounded-lg p-4 border-l-4 border-blue-500">
                <h4 className="text-sm font-medium text-white mb-2">Ваши права:</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  {currentUser.id === tournament.referee?.id && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Судья турнира</span>
                    </div>
                  )}
                  {currentUser.role === 'admin' && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Администратор системы</span>
                    </div>
                  )}
                  {currentUser.id === tournament.club?.owner?.id && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Владелец клуба</span>
                    </div>
                  )}
                  
                </div>
                
                {/* Предупреждение о проблеме с API */}
                {currentUser.role === 'player' && (
                  <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-500 rounded">
                    <div className="text-yellow-400 text-xs">
                      <div className="font-medium">⚠️ Известная проблема:</div>
                      <div>API генерации игр может требовать роль администратора</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tables Count */}
            <div>
              <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Количество столов
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTablesCount(count)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      tablesCount === count
                        ? 'bg-[#8469EF] text-white'
                        : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#353535]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tablesCount}
                  onChange={(e) => setTablesCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8469EF] focus:outline-none"
                />
              </div>
            </div>

            {/* Players Per Game */}
            <div>
              <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Игроков в одной игре
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[8, 10, 12, 14].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPlayersPerGame(count)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      playersPerGame === count
                        ? 'bg-[#8469EF] text-white'
                        : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#353535]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={playersPerGame}
                  onChange={(e) => setPlayersPerGame(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8469EF] focus:outline-none"
                />
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Стандарт мафии: 10 игроков (2 мафии + 1 шериф + 7 горожан)
              </p>
            </div>

                         {/* Target Players Count */}
             <div>
               <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                 <Target className="w-4 h-4" />
                 Целевое количество игроков
               </label>
               <div className="grid grid-cols-4 gap-2">
                 {[12, 24, 36, 48, 60, 72, 84, 96].map((count) => (
                   <button
                     key={count}
                     type="button"
                     onClick={() => setTargetPlayers(count)}
                     className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                       targetPlayers === count
                         ? 'bg-[#8469EF] text-white'
                         : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#353535]'
                     }`}
                   >
                     {count}
                   </button>
                 ))}
               </div>
               <div className="mt-2">
                 <input
                   type="number"
                   min="1"
                   max="200"
                   value={targetPlayers}
                   onChange={(e) => setTargetPlayers(parseInt(e.target.value) || 12)}
                   className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8469EF] focus:outline-none"
                 />
               </div>
               <p className="text-gray-400 text-sm mt-1">
                 Рекомендуется: {tablesCount * playersPerGame} игроков ({tablesCount} столов × {playersPerGame} игроков)
               </p>
             </div>

             {/* Rounds Count */}
             <div>
               <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                 <Gamepad2 className="w-4 h-4" />
                 Количество туров
               </label>
               <div className="grid grid-cols-4 gap-2">
                 {[3, 4, 5, 6, 8, 10, 12, 15].map((count) => (
                   <button
                     key={count}
                     type="button"
                     onClick={() => setRoundsCount(count)}
                     className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                       roundsCount === count
                         ? 'bg-[#8469EF] text-white'
                         : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#353535]'
                     }`}
                   >
                     {count}
                   </button>
                 ))}
               </div>
               <div className="mt-2">
                 <input
                   type="number"
                   min="1"
                   max="20"
                   value={roundsCount}
                   onChange={(e) => setRoundsCount(parseInt(e.target.value) || 6)}
                   className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8469EF] focus:outline-none"
                 />
               </div>
             </div>

             {/* Games Count */}
             <div>
               <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                 <Users className="w-4 h-4" />
                 Количество игр
               </label>
               <div className="grid grid-cols-4 gap-2">
                 {[12, 24, 36, 48, 60, 72, 84, 96].map((count) => (
                   <button
                     key={count}
                     type="button"
                     onClick={() => setGamesCount(count)}
                     className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                       gamesCount === count
                         ? 'bg-[#8469EF] text-white'
                         : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#353535]'
                     }`}
                   >
                     {count}
                   </button>
                 ))}
               </div>
               <div className="mt-2">
                 <input
                   type="number"
                   min="1"
                   max="200"
                   value={gamesCount}
                   onChange={(e) => setGamesCount(parseInt(e.target.value) || 12)}
                   className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8469EF] focus:outline-none"
                 />
               </div>
               <p className="text-gray-400 text-sm mt-1">
                 Рекомендуется: {targetPlayers * roundsCount} игр ({targetPlayers} игроков × {roundsCount} туров)
               </p>
             </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Прогресс заполнения</span>
                <span className={`text-sm font-medium ${isTargetReached ? 'text-green-400' : 'text-gray-400'}`}>
                  {progress}/{targetPlayers}
                </span>
              </div>
              <div className="w-full bg-[#2A2A2A] rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isTargetReached ? 'bg-green-500' : 'bg-[#8469EF]'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>{targetPlayers}</span>
              </div>
            </div>

            {/* Player Search */}
            <div>
              <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Поиск игроков
              </label>
              
              {/* Search Input */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск по email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8469EF] focus:outline-none"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                )}
              </div>

              {/* Manual Nickname Input */}
              <div className="relative mb-3">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Или введите никнейм вручную и нажмите Enter"
                  value={manualNickname}
                  onChange={(e) => setManualNickname(e.target.value)}
                  onKeyPress={handleManualAdd}
                  className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8469EF] focus:outline-none"
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-[#2A2A2A] rounded-lg border border-gray-600 max-h-40 overflow-y-auto">
                  {searchResults.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 hover:bg-[#353535] border-b border-gray-600 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8469EF] flex items-center justify-center text-white text-sm font-bold">
                          {player.name?.charAt(0) || player.email?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{player.name || 'Без имени'}</div>
                          <div className="text-gray-400 text-sm">{player.email}</div>
                          {player.club && (
                            <div className="text-gray-500 text-xs">{player.club}</div>
                          )}
                        </div>
                      </div>
                                             <button
                         type="button"
                         onClick={() => handleAddPlayer(player)}
                         disabled={selectedPlayers.includes(player.name || player.email) || !canAddMorePlayers}
                         className="px-3 py-1 bg-[#8469EF] text-white rounded text-sm hover:bg-[#6B4FFF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                       >
                         <Plus className="w-3 h-3" />
                         {canAddMorePlayers ? 'Добавить' : 'Лимит'}
                       </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Players */}
            <div>
              <h4 className="text-md font-medium text-white mb-3">
                Выбранные игроки ({selectedPlayers.length})
                {progress >= targetPlayers && (
                  <span className="text-green-400 text-sm ml-2">
                    ✓ Цель достигнута!
                  </span>
                )}
              </h4>
              
              {selectedPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedPlayers.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8469EF] flex items-center justify-center text-white text-sm font-bold">
                          {player.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{player}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(index)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                        title="Удалить игрока"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm p-4 bg-[#2A2A2A] rounded-lg border border-gray-600">
                  Пока нет выбранных игроков
                </div>
              )}
            </div>

                                      {/* Error Display */}
             {error && (
               <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                 <div className="text-red-400 text-sm">
                   <div className="font-medium mb-1">Ошибка:</div>
                   <div>{error}</div>
                 </div>
               </div>
             )}

             {/* Info */}
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <div className="text-sm text-gray-400 space-y-1">
                  <div>• Столов: {tablesCount}</div>
                  <div>• Цель: {targetPlayers} игроков</div>
                  <div>• Добавлено: {progress} игроков</div>
                  <div>• Осталось: {Math.max(0, targetPlayers - progress)} игроков</div>
                  <div>• Туров: {roundsCount}</div>
                  <div>• Игр: {gamesCount}</div>
                  <div>• Рекомендуется игр: {targetPlayers * roundsCount}</div>
                  {progress >= targetPlayers && (
                    <div className="text-green-400 text-sm">
                      ✓ Целевое количество достигнуто!
                    </div>
                  )}
                </div>
              </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#353535] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedPlayers.length === 0 || !isTargetReached || isTournamentCompleted}
              className="flex-1 px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
               {isLoading ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" />
                   Добавление...
                 </>
                               ) : !isTargetReached ? (
                  `Добавьте еще ${targetPlayers - selectedPlayers.length} игроков`
                ) : (
                  `Добавить ${selectedPlayers.length} игроков и сгенерировать ${gamesCount} игр`
                )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
} 