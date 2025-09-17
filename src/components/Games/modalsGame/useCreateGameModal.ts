import { useState, useEffect } from 'react';
import { gamesAPI, CreateGameRequest, GamePlayer, GameResult } from '../../../api/games';
import { usersAPI } from '../../../api/users';
import { User, GameFormData, PlayerUser, UnregisteredUser } from './types';

const MAX_PLAYERS = 12;

// Тип для создания игрока (упрощенный)
interface CreateGamePlayer {
  playerId: number;
}

export function useCreateGameModal(
  isOpen: boolean,
  clubId: number,
  onSuccess: () => void,
  onClose: () => void,
  seasonId?: number,
  tournamentId?: number
) {
  const [formData, setFormData] = useState<GameFormData>({
    name: '',
    description: '',
    scheduledDate: '',
    result: '', // Убираем значение по умолчанию
    resultTable: {}
  });
  
  const [players, setPlayers] = useState<CreateGamePlayer[]>([]);
  const [availableUsers, setAvailableUsers] = useState<PlayerUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<PlayerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Показываем всех доступных пользователей, кроме уже добавленных
      const availablePlayerIds = players.map(p => p.playerId);
      const filtered = (availableUsers || []).filter(user => 
        !availablePlayerIds.includes(user.id)
      );
      setFilteredUsers(filtered);
    } else {
      // Фильтруем по поиску и исключаем уже добавленных
      const availablePlayerIds = players.map(p => p.playerId);
      const filtered = (availableUsers || []).filter(user =>
        !availablePlayerIds.includes(user.id) && (
          (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.nickname && user.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, availableUsers, players]);

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

  const addPlayer = (user: PlayerUser) => {
    if (players.length >= MAX_PLAYERS) {
      setError(`Максимальное количество игроков: ${MAX_PLAYERS}`);
      return;
    }

    if (players.find(p => p.playerId === user.id)) {
      setError('Этот игрок уже добавлен');
      return;
    }

    const newPlayer: CreateGamePlayer = {
      playerId: user.id
    };

    setPlayers([...players, newPlayer]);
    setSearchQuery('');
    setError(null);
  };

  const addUnregisteredPlayer = (nickname: string) => {
    if (players.length >= MAX_PLAYERS) {
      setError(`Максимальное количество игроков: ${MAX_PLAYERS}`);
      return;
    }

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setError('Введите никнейм игрока');
      return;
    }

    // Проверяем, не добавлен ли уже игрок с таким никнеймом
    const existingPlayer = players.find(p => {
      const user = availableUsers.find(u => u.id === p.playerId);
      return user?.nickname === trimmedNickname;
    });

    if (existingPlayer) {
      setError('Игрок с таким никнеймом уже добавлен');
      return;
    }

    // Создаем уникальный числовой ID для незарегистрированного пользователя
    const unregisteredId = Date.now();
    
    // Создаем незарегистрированного пользователя
    const unregisteredUser: UnregisteredUser = {
      id: unregisteredId,
      nickname: trimmedNickname,
      email: `${trimmedNickname}@unregistered.com`,
      name: trimmedNickname,
      avatar: null,
      isUnregistered: true
    };

    // Добавляем в список доступных пользователей
    setAvailableUsers(prev => [...prev, unregisteredUser]);

    const newPlayer: CreateGamePlayer = {
      playerId: unregisteredId
    };

    setPlayers([...players, newPlayer]);
    setSearchQuery('');
    setError(null);
  };

  const removePlayer = (playerId: number) => {
    setPlayers(players.filter(p => p.playerId !== playerId));
    setError(null);
  };

  const updatePlayer = (playerId: number, field: keyof CreateGamePlayer, value: any) => {
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

    if (players.length > MAX_PLAYERS) {
      setError(`Максимальное количество игроков: ${MAX_PLAYERS}`);
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

      // Создаем полных игроков для API с дефолтными значениями
      const fullPlayers: GamePlayer[] = players.map(player => ({
        id: 0, // Будет установлено сервером
        playerId: player.playerId,
        role: 'CITIZEN',
        points: 0,
        bonusPoints: 0,
        penaltyPoints: 0,
        kills: 0,
        deaths: 0,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      const gameData: CreateGameRequest = {
        name: formData.name,
        description: formData.description,
        scheduledDate: formData.scheduledDate || new Date().toISOString(),
        clubId: Number(clubId),
        seasonId: seasonId ? Number(seasonId) : undefined,
        tournamentId: tournamentId ? Number(tournamentId) : undefined,
        result: formData.result || null,
        resultTable: formData.resultTable,
        players: fullPlayers
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
        result: '',
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

  return {
    formData,
    setFormData,
    players,
    availableUsers,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    loading,
    error,
    playersCount: players.length,
    maxPlayers: MAX_PLAYERS,
    addPlayer,
    addUnregisteredPlayer,
    removePlayer,
    updatePlayer,
    addResultRound,
    updateResultRound,
    removeResultRound,
    handleSubmit
  };
} 