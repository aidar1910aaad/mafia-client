'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Tournament } from '../../api/tournaments';
import { gamesAPI, Game } from '../../api/games';

interface GamesTableProps {
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

const GamesTable = ({ tournament, currentUser }: GamesTableProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerResults, setPlayerResults] = useState<{ [key: string]: PlayerResult }>({});
  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  // Проверяем, является ли текущий пользователь судьей турнира
  const isReferee = currentUser && tournament && (
    currentUser.id === tournament.referee?.id ||
    currentUser.role === 'admin' ||
    currentUser.role === 'system_admin'
  );

  useEffect(() => {
    if (tournament?.id) {
      loadGames();
    }
  }, [tournament?.id]);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      const gamesData = await gamesAPI.getGames({ tournamentId: tournament!.id });
      setGames(gamesData);
      
      // Инициализируем результаты игроков
      const initialResults: { [key: string]: PlayerResult } = {};
      gamesData.forEach(game => {
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
      console.error('Ошибка загрузки игр:', error);
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

    // Обновляем локальное состояние
    setPlayerResults(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));

    // Создаем новый таймер
    const timer = setTimeout(async () => {
      try {
        // Получаем актуальное состояние через функциональное обновление
        setPlayerResults(currentResults => {
          const currentResult = currentResults[key];
          
          if (currentResult) {
            const updatedResult = {
              ...currentResult,
              [field]: value
            };
            
            console.log('API запрос:', { gameId, field, value });
            console.log('URL:', `PATCH /games/${gameId}/results`);
            console.log('JSON отправляем:', JSON.stringify({ playerResults: [updatedResult] }, null, 2));
            
            // Отправляем запрос асинхронно
            gamesAPI.updateGameResults(gameId, { playerResults: [updatedResult] })
              .then((response) => {
                console.log('✅ Обновлено');
                // API возвращает только игроков, не полную игру
                // Поэтому НЕ обновляем список игр - оставляем как есть
                // НЕ обновляем playerResults - оставляем локальные значения
              })
              .catch((error) => {
                console.error('❌ Ошибка:', error);
              });
          }
          
          return currentResults;
        });
      } catch (error) {
        console.error('Ошибка обновления результата:', error);
      }
    }, 1000);

    setDebounceTimers(prev => ({
      ...prev,
      [key]: timer
    }));
  }, [debounceTimers]);

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

  // Группируем игры по турам
  const groupGamesByRound = () => {
    const rounds: { [key: number]: Game[] } = {};
    
    games.forEach(game => {
      const roundMatch = game.name?.match(/Тур (\d+)/);
      const roundNumber = roundMatch ? parseInt(roundMatch[1]) : 1;
      
      if (!rounds[roundNumber]) {
        rounds[roundNumber] = [];
      }
      rounds[roundNumber].push(game);
    });
    
    return rounds;
  };

  if (isLoading) {
    return (
      <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Загрузка игр...</div>
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

  const rounds = groupGamesByRound();

  if (games.length === 0) {
    return (
      <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
        <div className="text-center text-gray-400">Пока нет игр в турнире</div>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6">Расписание игр турнира</h3>
      
      <div className="space-y-8">
        {Object.keys(rounds).sort((a, b) => parseInt(a) - parseInt(b)).map(roundNumber => {
          const roundGames = rounds[parseInt(roundNumber)];
          
          return (
            <div key={`round-${roundNumber}`} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <h4 className="text-lg font-medium text-white">Тур {roundNumber}</h4>
                <div className="text-sm text-gray-400">{roundGames.length} игр</div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roundGames.map((game, gameIndex) => (
                  <div key={`game-${game.id}`} className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-md font-medium text-white">{game.name}</h5>
                      <div className="text-sm text-gray-400">{game.players?.length || 0} игроков</div>
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
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamesTable; 