'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Tournament } from '../../api/tournaments';
import { gamesAPI, Game, GameResult } from '../../api/games';

interface FinalGamesTableProps {
  tournament?: Tournament;
  currentUser?: any;
}

interface PlayerResult {
  playerId: number;
  role: string;
  points: number;
  bonusPoints: number;
  penaltyPoints: number;
}

const RoleTag = ({ role, color }: { role: string; color: string }) => (
  <div className="rounded-md px-2 py-1 text-xs font-semibold" style={{ backgroundColor: color, color: '#000' }}>
    {role}
  </div>
);

const getRoleColor = (role: string) => {
  switch (role) {
    case 'MAFIA': return '#FF4A4A';
    case 'CITIZEN': return '#4A90FF';
    case 'DOCTOR': return '#4AFF4A';
    case 'DETECTIVE': return '#FFD700';
    case 'DON': return '#8B0000';
    case 'MANIAC': return '#FF8C00';
    case 'BEAUTY': return '#FF69B4';
    default: return '#808080';
  }
};

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'MAFIA': return 'Мафия';
    case 'CITIZEN': return 'Мирный';
    case 'DOCTOR': return 'Доктор';
    case 'DETECTIVE': return 'Шериф';
    case 'DON': return 'Дон';
    case 'MANIAC': return 'Маньяк';
    case 'BEAUTY': return 'Красотка';
    default: return role;
  }
};

const getResultDisplayName = (result: GameResult | null) => {
  if (!result) return 'Не определен';
  
  switch (result) {
    case GameResult.MAFIA_WIN: return 'Победа мафии';
    case GameResult.CITIZEN_WIN: return 'Победа горожан';
    case GameResult.DRAW: return 'Ничья';
    default: return 'Не определен';
  }
};

const getResultColor = (result: GameResult | null) => {
  if (!result) return 'text-gray-400';
  
  switch (result) {
    case GameResult.MAFIA_WIN: return 'text-red-400';
    case GameResult.CITIZEN_WIN: return 'text-green-400';
    case GameResult.DRAW: return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

const FinalGamesTable = ({ tournament, currentUser }: FinalGamesTableProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerResults, setPlayerResults] = useState<{ [key: string]: PlayerResult }>({});
  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  // Проверяем, является ли текущий пользователь судьей турнира или владельцем клуба
  const isReferee = currentUser && tournament && (
    currentUser.id === tournament.referee?.id ||
    currentUser.role === 'admin' ||
    currentUser.role === 'system_admin' ||
    currentUser.role === 'club_owner' ||
    currentUser.role === 'club_admin'
  );

  useEffect(() => {
    if (tournament?.id) {
      loadFinalGames();
    }
  }, [tournament?.id, tournament?.games]);

  const loadFinalGames = async () => {
    try {
      setIsLoading(true);
      
      let gamesData = [];
      
      // Сначала проверяем, есть ли игры уже в объекте турнира
      if (tournament?.games && Array.isArray(tournament.games) && tournament.games.length > 0) {
        console.log('🎮 Используем игры из турнира:', tournament.games.length);
        gamesData = tournament.games;
      } else {
        // Если игр нет в турнире, пытаемся загрузить отдельно
        console.log('🎮 Загружаем игры через API...');
        try {
          gamesData = await gamesAPI.getGames({ tournamentId: tournament!.id });
        } catch (apiError) {
          console.warn('⚠️ Не удалось загрузить игры через API:', apiError);
          gamesData = [];
        }
      }
      
      // Фильтруем только финальные игры
      const finalGames = gamesData.filter(game => 
        game.name?.includes('Финальная игра') || game.description?.includes('финальная игра')
      );
      
      setGames(finalGames);
      
      // Инициализируем результаты игроков
      const initialResults: { [key: string]: PlayerResult } = {};
      finalGames.forEach(game => {
        game.players?.forEach(player => {
          const key = `${game.id}-${player.player?.id}`;
          initialResults[key] = {
            playerId: player.player?.id || 0,
            role: player.role || 'CITIZEN',
            points: player.points || 0,
            bonusPoints: player.bonusPoints || 0,
            penaltyPoints: player.penaltyPoints || 0,
          };
        });
      });
      setPlayerResults(initialResults);
    } catch (error) {
      console.error('Ошибка загрузки финальных игр:', error);
      setGames([]);
      setPlayerResults({});
    } finally {
      setIsLoading(false);
    }
  };

  // Дебаунсинг для отправки результатов
  const debouncedUpdateResult = useCallback((gameId: number, playerId: number, field: keyof PlayerResult, value: number | string) => {
    const key = `${gameId}-${playerId}`;
    
    // Очищаем предыдущий таймер
    if (debounceTimers[key]) {
      clearTimeout(debounceTimers[key]);
    }

    // Создаем новый таймер
    const newTimer = setTimeout(async () => {
      try {
        const updatedResults = {
          ...playerResults,
          [key]: {
            ...playerResults[key],
            [field]: value
          }
        };

        // Отправляем обновление на сервер
        await gamesAPI.updateGameResults(gameId, {
          result: null, // Не обновляем результат игры
          playerResults: Object.values(updatedResults).filter(result => 
            Object.keys(updatedResults).some(k => k.startsWith(`${gameId}-${result.playerId}`))
          )
        });

        console.log('✅ Результат игрока обновлен');
      } catch (error) {
        console.error('❌ Ошибка обновления результата игрока:', error);
      }
    }, 1000);

    // Обновляем состояние таймеров
    setDebounceTimers(prev => ({
      ...prev,
      [key]: newTimer
    }));

    // Обновляем локальное состояние
    setPlayerResults(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  }, [debounceTimers, playerResults]);

  const handlePointsChange = (gameId: number, playerId: number, field: keyof PlayerResult, value: string) => {
    const numValue = parseFloat(value) || 0;
    debouncedUpdateResult(gameId, playerId, field, numValue);
  };

  const handleRoleChange = (gameId: number, playerId: number, newRole: string) => {
    // Обновляем роль в локальном состоянии игр
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? {
              ...game,
              players: game.players?.map(player => 
                player.player?.id === playerId 
                  ? { ...player, role: newRole as any }
                  : player
              )
            }
          : game
      )
    );

    // Обновляем роль в результатах игроков
    const key = `${gameId}-${playerId}`;
    setPlayerResults(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        role: newRole
      }
    }));

    // Отправляем изменение роли на сервер с дебаунсингом
    debouncedUpdateResult(gameId, playerId, 'role', newRole);
  };

  const handleResultChange = async (gameId: number, newResult: GameResult | '') => {
    try {
      // Обновляем результат в локальном состоянии
      setGames(prevGames => 
        prevGames.map(game => 
          game.id === gameId 
            ? { ...game, result: newResult || undefined }
            : game
        )
      );

      // Отправляем обновление результата на сервер
      await gamesAPI.updateGameResults(gameId, { 
        result: newResult || null,
        playerResults: [] // Отправляем пустой массив, так как обновляем только результат игры
      });
      console.log('✅ Результат финальной игры обновлен');
    } catch (error) {
      console.error('❌ Ошибка обновления результата финальной игры:', error);
      // Откатываем изменения в случае ошибки
      setGames(prevGames => 
        prevGames.map(game => 
          game.id === gameId 
            ? { ...game, result: game.result }
            : game
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Загрузка финальных игр...</div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Турнир не загружен</div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
        <div className="text-center text-gray-400">Пока нет финальных игр в турнире</div>
      </div>
    );
  }

  // Компонент для отображения финальной игры
  const FinalGameCard = ({ game }: { game: Game }) => (
    <div key={`final-game-${game.id}`} className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-md font-medium text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          {game.name}
        </h5>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">{game.players?.length || 0} игроков</div>
          {isReferee && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Результат:</span>
              <select
                value={game.result || ''}
                onChange={(e) => handleResultChange(game.id, e.target.value as GameResult)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              >
                <option value="">Не определен</option>
                <option value={GameResult.MAFIA_WIN}>Победа мафии</option>
                <option value={GameResult.CITIZEN_WIN}>Победа горожан</option>
                <option value={GameResult.DRAW}>Ничья</option>
              </select>
            </div>
          )}
          {!isReferee && (
            <div className={`text-sm font-medium ${game.result ? getResultColor(game.result) : 'text-gray-400'}`}>
              {game.result ? getResultDisplayName(game.result) : 'Не определен'}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Основная таблица игры */}
        <div className="lg:col-span-3">
          <table className="w-full text-sm text-white">
            <thead className="text-gray-400">
              <tr className="border-b border-gray-600">
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Игрок</th>
                <th className="px-2 py-2 text-center">Роль</th>
                <th className="px-2 py-2 text-center">Σ</th>
                <th className="px-2 py-2 text-center">Σ+</th>
                <th className="px-2 py-2 text-center">-</th>
              </tr>
            </thead>
            <tbody>
              {game.players?.sort((a, b) => (a.seatIndex || 0) - (b.seatIndex || 0)).map((player, playerIndex) => {
                const resultKey = `${game.id}-${player.player?.id}`;
                const result = playerResults[resultKey];
                
                return (
                  <tr key={`${game.id}-${player.id}-${player.player?.id}`} className="border-b border-gray-700">
                    <td className="px-2 py-2">{(player.seatIndex ?? 0) + 1}</td>
                    <td className="px-2 py-2">{player.player?.nickname || 'Игрок'}</td>
                    <td className="px-2 py-2">
                      {isReferee ? (
                        <select
                          value={player.role || 'CITIZEN'}
                          onChange={(e) => handleRoleChange(game.id, player.player?.id || 0, e.target.value)}
                          className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                          style={{ backgroundColor: getRoleColor(player.role || 'CITIZEN') }}
                        >
                          <option value="MAFIA">Мафия</option>
                          <option value="CITIZEN">Мирный</option>
                          <option value="DOCTOR">Доктор</option>
                          <option value="DETECTIVE">Шериф</option>
                          <option value="DON">Дон</option>
                          <option value="MANIAC">Маньяк</option>
                          <option value="BEAUTY">Красотка</option>
                        </select>
                      ) : (
                        <RoleTag 
                          role={getRoleDisplayName(player.role || 'CITIZEN')} 
                          color={getRoleColor(player.role || 'CITIZEN')} 
                        />
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {isReferee ? (
                        <input
                          type="number"
                          step="0.25"
                          className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-center text-white text-sm"
                          value={result?.points || 0}
                          onChange={(e) => handlePointsChange(game.id, player.player?.id || 0, 'points', e.target.value)}
                          min="0"
                          placeholder="0"
                        />
                      ) : (
                        <span className="text-white text-sm">{result?.points || 0}</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {isReferee ? (
                        <input
                          type="number"
                          step="0.25"
                          className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-center text-white text-sm"
                          value={result?.bonusPoints || 0}
                          onChange={(e) => handlePointsChange(game.id, player.player?.id || 0, 'bonusPoints', e.target.value)}
                          min="0"
                          placeholder="0"
                        />
                      ) : (
                        <span className="text-green-400 text-sm">{result?.bonusPoints || 0}</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {isReferee ? (
                        <input
                          type="number"
                          step="0.25"
                          className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-center text-white text-sm"
                          value={result?.penaltyPoints || 0}
                          onChange={(e) => handlePointsChange(game.id, player.player?.id || 0, 'penaltyPoints', e.target.value)}
                          min="0"
                          placeholder="0"
                        />
                      ) : (
                        <span className="text-red-400 text-sm">{result?.penaltyPoints || 0}</span>
                      )}
                    </td>
                  </tr>
                );
              }) || []}
            </tbody>
          </table>
        </div>

        {/* Дополнительная таблица игры */}
        <div className="lg:col-span-1">
          <table className="w-full text-xs text-white">
            <thead className="text-gray-400">
              <tr className="border-b border-gray-600">
                <th className="px-1 py-1 text-left text-xs">#</th>
                <th className="px-1 py-1 text-left text-xs">Игрок</th>
                <th className="px-1 py-1 text-center text-xs">ЛХ</th>
                <th className="px-1 py-1 text-center text-xs">ЛХС</th>
              </tr>
            </thead>
            <tbody>
              {game.players?.sort((a, b) => (a.seatIndex || 0) - (b.seatIndex || 0)).slice(0, 3).map((player, playerIndex) => (
                <tr key={`stats-${game.id}-${player.id}-${player.player?.id}`} className="border-b border-gray-700">
                  <td className="px-1 py-1 text-xs">{(player.seatIndex ?? 0) + 1}</td>
                  <td className="px-1 py-1 text-xs truncate">{player.player?.nickname || 'Игрок'}</td>
                  <td className="px-1 py-1 text-center text-xs">-</td>
                  <td className="px-1 py-1 text-center text-xs">-</td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Финальные игры турнира
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {games.map((game) => (
            <FinalGameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalGamesTable;