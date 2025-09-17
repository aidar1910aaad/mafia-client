'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tournament } from '../../api/tournaments';
import { gamesAPI, Game, GameResult } from '../../api/games';

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
  lh: number;
  ci: number;
}

interface GameData {
  id: number;
  result: GameResult | null;
  players: PlayerResult[];
  hasChanges: boolean;
}

// Константы для ролей
const ROLES = {
  MAFIA: { name: 'Мафия', color: '#FF4A4A' },
  CITIZEN: { name: 'Мирный', color: '#4A90FF' },
  DOCTOR: { name: 'Доктор', color: '#4AFF4A' },
  DETECTIVE: { name: 'Шериф', color: '#FFD700' },
  DON: { name: 'Дон', color: '#8B0000' },
  MANIAC: { name: 'Маньяк', color: '#FF8C00' },
  BEAUTY: { name: 'Красотка', color: '#FF69B4' },
} as const;

const RESULTS = {
  [GameResult.MAFIA_WIN]: { name: 'Победа мафии', color: 'text-red-400' },
  [GameResult.CITIZEN_WIN]: { name: 'Победа горожан', color: 'text-green-400' },
  [GameResult.DRAW]: { name: 'Ничья', color: 'text-yellow-400' },
} as const;

// Компонент для ввода числовых значений
const NumberInput = React.memo(({ 
  value, 
  onChange, 
  className = "w-12 bg-gray-800 border border-gray-600 rounded px-1 py-1 text-center text-white text-xs",
  min = 0,
  step = 0.1
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  step?: number;
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseFloat(localValue);
    if (isNaN(numValue) || numValue < min) {
      setLocalValue(value.toString());
    }
  };

  return (
    <input
      type="number"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      min={min}
      step={step}
    />
  );
});

// Компонент для выбора роли
const RoleSelect = React.memo(({ 
  value, 
  onChange 
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const role = ROLES[value as keyof typeof ROLES] || ROLES.CITIZEN;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-20 bg-gray-800 border border-gray-600 rounded px-1 py-1 text-white text-xs"
      style={{ backgroundColor: role.color }}
    >
      {Object.entries(ROLES).map(([key, roleData]) => (
        <option key={key} value={key}>{roleData.name}</option>
      ))}
    </select>
  );
});

// Компонент для отображения роли
const RoleTag = React.memo(({ role }: { role: string }) => {
  const roleData = ROLES[role as keyof typeof ROLES] || ROLES.CITIZEN;
  
  return (
    <div 
      className="rounded-md px-2 py-1 text-xs font-semibold"
      style={{ backgroundColor: roleData.color, color: '#000' }}
    >
      {roleData.name}
    </div>
  );
});

// Компонент строки игрока
const PlayerRow = React.memo(({ 
  player, 
  result, 
  isReferee,
  onUpdate
}: {
  player: any;
  result: PlayerResult;
  isReferee: boolean;
  onUpdate: (field: keyof PlayerResult, value: any) => void;
}) => {
  const handleRoleChange = (role: string) => {
    onUpdate('role', role);
  };

  const handlePointsChange = (field: keyof PlayerResult) => (value: number) => {
    onUpdate(field, value);
  };

  return (
    <tr className="border-b border-gray-700">
      <td className="px-1 py-1 text-center text-xs">{(player.seatIndex ?? 0) + 1}</td>
      <td className="px-1 py-1 text-xs truncate max-w-24">{player.player?.nickname || 'Игрок'}</td>
      <td className="px-1 py-1">
        {isReferee ? (
          <RoleSelect value={result.role} onChange={handleRoleChange} />
        ) : (
          <RoleTag role={result.role} />
        )}
      </td>
      <td className="px-1 py-1">
        {isReferee ? (
          <NumberInput
            value={result.points}
            onChange={handlePointsChange('points')}
          />
        ) : (
          <span className="text-white text-xs">{result.points}</span>
        )}
      </td>
      <td className="px-1 py-1">
        {isReferee ? (
          <NumberInput
            value={result.bonusPoints}
            onChange={handlePointsChange('bonusPoints')}
          />
        ) : (
          <span className="text-green-400 text-xs">{result.bonusPoints}</span>
        )}
      </td>
      <td className="px-1 py-1">
        {isReferee ? (
          <NumberInput
            value={result.penaltyPoints}
            onChange={handlePointsChange('penaltyPoints')}
          />
        ) : (
          <span className="text-red-400 text-xs">{result.penaltyPoints}</span>
        )}
      </td>
      <td className="px-1 py-1">
        {isReferee ? (
          <NumberInput
            value={result.lh}
            onChange={handlePointsChange('lh')}
          />
        ) : (
          <span className="text-blue-400 text-xs">{result.lh}</span>
        )}
      </td>
      <td className="px-1 py-1">
        {isReferee ? (
          <NumberInput
            value={result.ci}
            onChange={handlePointsChange('ci')}
          />
        ) : (
          <span className="text-purple-400 text-xs">{result.ci}</span>
        )}
      </td>
    </tr>
  );
});

// Компонент игры
const GameCard = React.memo(({ 
  game, 
  gameData, 
  isReferee, 
  onUpdateGame,
  onSaveGame,
  isSaving 
}: {
  game: Game;
  gameData: GameData;
  isReferee: boolean;
  onUpdateGame: (gameId: number, field: keyof GameData, value: any) => void;
  onSaveGame: (gameId: number) => void;
  isSaving: boolean;
}) => {
  const handleResultChange = (result: GameResult | '') => {
    onUpdateGame(game.id, 'result', result || null);
  };

  const handlePlayerUpdate = (playerId: number, field: keyof PlayerResult, value: any) => {
    const updatedPlayers = gameData.players.map(player => 
      player.playerId === playerId ? { ...player, [field]: value } : player
    );
    onUpdateGame(game.id, 'players', updatedPlayers);
  };

  const resultData = gameData.result ? RESULTS[gameData.result] : null;

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-md font-medium text-white">Игра #{game.id}</h5>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">{game.players?.length || 0} игроков</div>
          
          {isReferee ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Результат:</span>
              <select
                value={gameData.result || ''}
                onChange={(e) => handleResultChange(e.target.value as GameResult)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              >
                <option value="">Не определен</option>
                <option value={GameResult.MAFIA_WIN}>Победа мафии</option>
                <option value={GameResult.CITIZEN_WIN}>Победа горожан</option>
                <option value={GameResult.DRAW}>Ничья</option>
              </select>
            </div>
          ) : (
            <div className={`text-sm font-medium ${resultData?.color || 'text-gray-400'}`}>
              {resultData?.name || 'Не определен'}
            </div>
          )}
          
          {isReferee && (
            <button
              onClick={() => onSaveGame(game.id)}
              disabled={!gameData.hasChanges || isSaving}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                gameData.hasChanges && !isSaving
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <table className="w-full text-xs text-white">
          <thead className="text-gray-400">
            <tr className="border-b border-gray-600">
              <th className="px-1 py-1 text-center w-8">#</th>
              <th className="px-1 py-1 text-left min-w-0">Игрок</th>
              <th className="px-1 py-1 text-center w-20">Роль</th>
              <th className="px-1 py-1 text-center w-12">Σ</th>
              <th className="px-1 py-1 text-center w-12">Σ+</th>
              <th className="px-1 py-1 text-center w-12">-</th>
              <th className="px-1 py-1 text-center w-12">ЛХ</th>
              <th className="px-1 py-1 text-center w-12">Ci</th>
            </tr>
          </thead>
          <tbody>
            {game.players?.sort((a, b) => (a.seatIndex || 0) - (b.seatIndex || 0)).map((player) => {
              const result = gameData.players.find(p => p.playerId === player.player?.id) || {
                playerId: player.player?.id || 0,
                role: player.role || 'CITIZEN',
                points: player.points || 0,
                bonusPoints: player.bonusPoints || 0,
                penaltyPoints: player.penaltyPoints || 0,
                lh: 0, // Поле не существует в GamePlayer, используем 0
                ci: 0, // Поле не существует в GamePlayer, используем 0
              };

              return (
                <PlayerRow
                  key={`${game.id}-${player.player?.id}`}
                  player={player}
                  result={result}
                  isReferee={isReferee}
                  onUpdate={(field, value) => handlePlayerUpdate(player.player?.id || 0, field, value)}
                />
              );
            }) || []}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const GamesTable = ({ tournament, currentUser }: GamesTableProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [gameData, setGameData] = useState<{ [gameId: number]: GameData }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingGames, setSavingGames] = useState<Set<number>>(new Set());

  // Проверяем права на редактирование
  const isReferee = useMemo(() => {
    if (!currentUser || !tournament) return false;
    if (tournament.status === 'COMPLETED' || tournament.status === 'CANCELLED') return false;
    
    return (
      currentUser.id === tournament.referee?.id ||
      currentUser.role === 'admin' ||
      currentUser.role === 'system_admin' ||
      currentUser.role === 'club_owner'
    );
  }, [currentUser, tournament]);

  // Загружаем игры
  useEffect(() => {
    const loadGames = async () => {
      if (!tournament?.id) return;

      try {
        setIsLoading(true);
        
        let gamesData = tournament.games || [];
        if (gamesData.length === 0) {
          try {
            gamesData = await gamesAPI.getGames({ tournamentId: tournament.id });
          } catch (error) {
            console.error('Ошибка загрузки игр:', error);
            gamesData = [];
          }
        }
        
        setGames(gamesData);
        
        // Инициализируем данные игр
        const initialGameData: { [gameId: number]: GameData } = {};
        gamesData.forEach(game => {
          const players: PlayerResult[] = game.players?.map(player => ({
            playerId: player.player?.id || 0,
            role: player.role || 'CITIZEN',
            points: player.points || 0,
            bonusPoints: player.bonusPoints || 0,
            penaltyPoints: player.penaltyPoints || 0,
            lh: 0, // Поле не существует в GamePlayer, используем 0
            ci: 0, // Поле не существует в GamePlayer, используем 0
          })) || [];

          initialGameData[game.id] = {
            id: game.id,
            result: game.result || null,
            players,
            hasChanges: false,
          };
        });
        
        setGameData(initialGameData);
      } catch (error) {
        console.error('Ошибка загрузки игр:', error);
        setGames([]);
        setGameData({});
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, [tournament?.id]);

  // Обновляем данные игры
  const handleUpdateGame = useCallback((gameId: number, field: keyof GameData, value: any) => {
    setGameData(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        [field]: value,
        hasChanges: true,
      }
    }));
  }, []);

  // Сохраняем данные игры
  const handleSaveGame = useCallback(async (gameId: number) => {
    const data = gameData[gameId];
    if (!data || !data.hasChanges) return;

    setSavingGames(prev => new Set(prev).add(gameId));

    try {
      await gamesAPI.updateGameResults(gameId, {
        result: data.result,
        playerResults: data.players,
      });

      // Обновляем основное состояние
      setGames(prev => 
        prev.map(game => 
          game.id === gameId 
            ? { ...game, result: data.result }
            : game
        )
      );

      // Сбрасываем флаг изменений
      setGameData(prev => ({
        ...prev,
        [gameId]: {
          ...prev[gameId],
          hasChanges: false,
        }
      }));

      console.log('✅ Данные игры сохранены:', gameId);
    } catch (error) {
      console.error('❌ Ошибка сохранения игры:', error);
    } finally {
      setSavingGames(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    }
  }, [gameData]);

  // Фильтруем обычные игры (исключаем финальные)
  const regularGames = useMemo(() => {
    return games.filter(game => 
      !game.name?.includes('Финальная игра') && 
      !game.description?.includes('финальная игра')
    );
  }, [games]);

  // Группируем игры по турам
  const gamesByRound = useMemo(() => {
    const rounds: { [key: number]: Game[] } = {};
    
    regularGames.forEach(game => {
      const roundMatch = game.name?.match(/Тур (\d+)/);
      const roundNumber = roundMatch ? parseInt(roundMatch[1]) : 1;
      
      if (!rounds[roundNumber]) {
        rounds[roundNumber] = [];
      }
      rounds[roundNumber].push(game);
    });
    
    return rounds;
  }, [regularGames]);

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

  if (regularGames.length === 0) {
    return (
      <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
        <div className="text-center text-gray-400">Пока нет обычных игр в турнире</div>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] rounded-2xl p-3 md:p-4 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Расписание игр турнира</h3>
      
      <div className="space-y-6">
        {Object.keys(gamesByRound)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(roundNumber => {
            const roundGames = gamesByRound[parseInt(roundNumber)];
            
            return (
              <div key={`round-${roundNumber}`} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <h4 className="text-lg font-medium text-white">Тур {roundNumber}</h4>
                  <div className="text-sm text-gray-400">{roundGames.length} игр</div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {roundGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      gameData={gameData[game.id]}
                      isReferee={isReferee}
                      onUpdateGame={handleUpdateGame}
                      onSaveGame={handleSaveGame}
                      isSaving={savingGames.has(game.id)}
                    />
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