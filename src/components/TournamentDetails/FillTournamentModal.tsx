'use client';
import React, { useState, useEffect } from 'react';
import { X, Users, Gamepad2, Loader2, Search, Plus, User, Target } from 'lucide-react';
import { Tournament } from '../../api/tournaments';
import { usersAPI, UserSearchResult } from '../../api/users';
import { gamesAPI, GenerateGamesRequest } from '../../api/games';

interface FillTournamentModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onFillTournament: (players: string[], tablesCount: number, targetPlayers: number, roundsCount: number, gamesCount: number) => void;
}

export default function FillTournamentModal({ 
  tournament, 
  isOpen, 
  onClose, 
  onFillTournament 
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

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Начинаем заполнение турнира...');
      
      // Тестируем доступность API
      const isAPIAvailable = await gamesAPI.testGenerateGamesAPI();
      console.log('API доступен:', isAPIAvailable);
      
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
      console.log('URL запроса:', `${process.env.NEXT_PUBLIC_API_URL || 'https://mafia-production-0fd1.up.railway.app'}/games/generate`);
      console.log('=====================================');
      
      // Вызываем API генерации игр
      console.log('Вызываем API генерации игр...');
      await gamesAPI.generateGames(generateGamesData);
      
      console.log('Игры успешно сгенерированы!');
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">{tournament.name}</h3>
              <p className="text-gray-400 text-sm">{tournament.description}</p>
            </div>

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
               disabled={isLoading || selectedPlayers.length === 0 || !isTargetReached}
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