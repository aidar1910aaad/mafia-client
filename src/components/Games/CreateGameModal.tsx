'use client';

import { useState, useEffect } from 'react';
import { gamesAPI, CreateGameRequest, GamePlayer } from '../../api/games';
import { usersAPI } from '../../api/users';
import { X, Plus, Trash2, Search, User, Target, Shield, MessageSquare, Trophy } from 'lucide-react';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clubId: number;
  seasonId?: number;
  tournamentId?: number;
}

interface User {
  id: number;
  email: string;
  nickname: string;
  name?: string;
  avatar: string | null;
  role?: string;
}

export default function CreateGameModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  clubId, 
  seasonId, 
  tournamentId 
}: CreateGameModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scheduledDate: '',
    result: 'MAFIA_WIN' as 'MAFIA_WIN' | 'CITIZEN_WIN' | 'DRAW',
    resultTable: {} as Record<string, string>
  });
  
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(availableUsers || []);
    } else {
      const filtered = (availableUsers || []).filter(user =>
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.nickname && user.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, availableUsers]);

  const fetchUsers = async () => {
    try {
      const usersData = await usersAPI.getAllUsers();
      if (Array.isArray(usersData)) {
        setAvailableUsers(usersData);
        setFilteredUsers(usersData);
      } else {
        console.error('Ошибка: usersData не является массивом:', usersData);
        setAvailableUsers([]);
        setFilteredUsers([]);
      }
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
      setAvailableUsers([]);
      setFilteredUsers([]);
    }
  };

  const addPlayer = (user: User) => {
    if (players.find(p => p.playerId === user.id)) {
      return; // Игрок уже добавлен
    }

    const newPlayer: GamePlayer = {
      playerId: user.id,
      role: 'CITIZEN',
      points: 0,
      kills: 0,
      deaths: 0,
      notes: ''
    };

    setPlayers([...players, newPlayer]);
    setSearchQuery('');
  };

  const removePlayer = (playerId: number) => {
    setPlayers(players.filter(p => p.playerId !== playerId));
  };

  const updatePlayer = (playerId: number, field: keyof GamePlayer, value: any) => {
    setPlayers(players.map(p => 
      p.playerId === playerId ? { ...p, [field]: value } : p
    ));
  };

  const addResultRound = () => {
    const roundKey = `round${Object.keys(formData.resultTable).length + 1}`;
    setFormData(prev => ({
      ...prev,
      resultTable: { ...prev.resultTable, [roundKey]: '' }
    }));
  };

  const updateResultRound = (roundKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      resultTable: { ...prev.resultTable, [roundKey]: value }
    }));
  };

  const removeResultRound = (roundKey: string) => {
    const newResultTable = { ...formData.resultTable };
    delete newResultTable[roundKey];
    setFormData(prev => ({
      ...prev,
      resultTable: newResultTable
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Название игры обязательно');
      return;
    }

    if (players.length === 0) {
      setError('Добавьте хотя бы одного игрока');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Проверяем, что clubId является числом
      console.log('clubId:', clubId, 'type:', typeof clubId);
      if (!clubId || clubId === 0 || isNaN(Number(clubId))) {
        setError(`ID клуба должен быть числом. Получено: ${clubId} (тип: ${typeof clubId})`);
        return;
      }

      const gameData: CreateGameRequest = {
        name: formData.name,
        description: formData.description,
        scheduledDate: formData.scheduledDate || new Date().toISOString(),
        clubId: Number(clubId),
        seasonId: seasonId ? Number(seasonId) : undefined,
        tournamentId: tournamentId ? Number(tournamentId) : undefined,
        result: formData.result,
        resultTable: formData.resultTable,
        players
      };

      console.log('Отправляемые данные игры:', gameData);
      await gamesAPI.createGame(gameData);
      onSuccess();
      onClose();
      
      // Сброс формы
      setFormData({
        name: '',
        description: '',
        scheduledDate: '',
        result: 'MAFIA_WIN',
        resultTable: {}
      });
      setPlayers([]);
    } catch (err) {
      console.error('Ошибка создания игры:', err);
      setError(err instanceof Error ? err.message : 'Ошибка создания игры');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1D1D1D] border border-[#404040]/50 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">Создать игру</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Название игры *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Игра #1 - Мафия против Горожан"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Результат *
              </label>
              <select
                value={formData.result}
                onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value as any }))}
                className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="MAFIA_WIN">Победа мафии</option>
                <option value="CITIZEN_WIN">Победа горожан</option>
                <option value="DRAW">Ничья</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Описание игры..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Дата проведения
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Добавление игроков */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Добавить игроков
            </label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Поиск игроков..."
              />
            </div>

            {searchQuery && filteredUsers.length > 0 && (
              <div className="bg-[#2A2A2A] border border-[#404040]/50 rounded-lg max-h-48 overflow-y-auto">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => addPlayer(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#404040]/30 transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        (user.name || user.nickname)?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.name || user.nickname || user.email}
                      </div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Список добавленных игроков */}
          {players.length > 0 && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Игроки ({players.length})
              </label>
              <div className="space-y-3">
                {players.map((player) => {
                  const user = availableUsers.find(u => u.id === player.playerId);
                  return (
                    <div key={player.playerId} className="bg-[#2A2A2A] border border-[#404040]/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.avatar ? (
                              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              (user?.name || user?.nickname)?.charAt(0)?.toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {user?.name || user?.nickname || user?.email}
                            </div>
                            <div className="text-gray-400 text-sm">{user?.email}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePlayer(player.playerId)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Роль</label>
                          <select
                            value={player.role}
                            onChange={(e) => updatePlayer(player.playerId, 'role', e.target.value)}
                            className="w-full bg-[#1D1D1D] border border-[#404040]/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="CITIZEN">Горожанин</option>
                            <option value="MAFIA">Мафия</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Очки</label>
                          <input
                            type="number"
                            value={player.points}
                            onChange={(e) => updatePlayer(player.playerId, 'points', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#1D1D1D] border border-[#404040]/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Убийства</label>
                          <input
                            type="number"
                            value={player.kills}
                            onChange={(e) => updatePlayer(player.playerId, 'kills', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#1D1D1D] border border-[#404040]/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Смерти</label>
                          <input
                            type="number"
                            value={player.deaths}
                            onChange={(e) => updatePlayer(player.playerId, 'deaths', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#1D1D1D] border border-[#404040]/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-gray-400 text-xs mb-1">Заметки</label>
                        <input
                          type="text"
                          value={player.notes || ''}
                          onChange={(e) => updatePlayer(player.playerId, 'notes', e.target.value)}
                          className="w-full bg-[#1D1D1D] border border-[#404040]/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder="Заметки об игроке..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Таблица результатов */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white text-sm font-medium">
                Таблица результатов
              </label>
              <button
                type="button"
                onClick={addResultRound}
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Добавить раунд
              </button>
            </div>
            
            {Object.keys(formData.resultTable).length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-4 bg-[#2A2A2A] border border-[#404040]/50 rounded-lg">
                Нет данных о раундах
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(formData.resultTable).map(([roundKey, value]) => (
                  <div key={roundKey} className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm min-w-[60px]">{roundKey}:</span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateResultRound(roundKey, e.target.value)}
                      className="flex-1 bg-[#2A2A2A] border border-[#404040]/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Результат раунда..."
                    />
                    <button
                      type="button"
                      onClick={() => removeResultRound(roundKey)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#404040]/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trophy className="w-4 h-4" />
              )}
              Создать игру
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 