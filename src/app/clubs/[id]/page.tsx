'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { clubsAPI, Club, ClubOwner } from '../../../api/clubs/index';
import { seasonsAPI, CreateSeasonRequest } from '../../../api/seasons';
import { tournamentsAPI, CreateTournamentRequest, UpdateTournamentRequest } from '../../../api/tournaments';
import { usersAPI, User, UserSearchResult } from '../../../api/users';
import { authAPI } from '../../../api/auth';
import {
  ClubBanner,
  ClubDescription,
  ClubStatistics,
  ClubSocialMedia,
  ClubOwner as ClubOwnerComponent,
  ClubAdministrators,
  ClubMembers,
  ClubInfo,
  JoinClubButton,
  ClubSeasons,
  ClubTournaments,
  ClubRequests
} from '../../../components/Clubs';
import Toast from '../../../components/Toast/Toast';
import DatePicker from '../../../components/UI/DatePicker';
import { Calendar, Plus, User as UserIcon, Search, Trophy } from 'lucide-react';

export default function ClubPage() {
  const params = useParams();
  const clubId = params.id;
  const [club, setClub] = useState<Club | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false });
  
  // Состояние для модального окна создания сезона
  const [showCreateSeasonModal, setShowCreateSeasonModal] = useState(false);
  const [creatingSeason, setCreatingSeason] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [seasonFormData, setSeasonFormData] = useState<CreateSeasonRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    clubId: 0,
    refereeId: 0
  });

  // Состояние для модального окна создания турнира
  const [showCreateTournamentModal, setShowCreateTournamentModal] = useState(false);
  const [creatingTournament, setCreatingTournament] = useState(false);
  const [tournamentSearchResults, setTournamentSearchResults] = useState<UserSearchResult[]>([]);
  const [tournamentSearchQuery, setTournamentSearchQuery] = useState('');
  const [isTournamentSearching, setIsTournamentSearching] = useState(false);
  const [showTournamentSearchResults, setShowTournamentSearchResults] = useState(false);
  const [tournamentFormData, setTournamentFormData] = useState<CreateTournamentRequest>({
    name: '',
    description: '',
    date: '',
    clubId: 0,
    refereeId: 0,
    type: 'DEFAULT',
    stars: undefined
  });

  // Состояние для модального окна редактирования турнира
  const [showEditTournamentModal, setShowEditTournamentModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<number | null>(null);
  const [editTournamentSearchResults, setEditTournamentSearchResults] = useState<UserSearchResult[]>([]);
  const [editTournamentSearchQuery, setEditTournamentSearchQuery] = useState('');
  const [isEditTournamentSearching, setIsEditTournamentSearching] = useState(false);
  const [showEditTournamentSearchResults, setShowEditTournamentSearchResults] = useState(false);
  const [editTournamentFormData, setEditTournamentFormData] = useState<UpdateTournamentRequest>({
    name: '',
    description: '',
    date: '',
    clubId: 0,
    refereeId: 0,
    type: 'DEFAULT',
    stars: undefined
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем информацию о текущем пользователе
        const userResponse = await authAPI.verifyToken();
        if (userResponse.success && userResponse.user) {
          setCurrentUser(userResponse.user);
        }

        // Получаем информацию о клубе
        if (typeof clubId === 'string') {
          const clubData = await clubsAPI.getClubById(clubId);
          console.log('ClubPage: Данные клуба:', clubData);
          console.log('ClubPage: Логотип клуба:', clubData.logo);
          console.log('ClubPage: Владелец клуба:', clubData.owner);
          console.log('ClubPage: Участники клуба:', clubData.members);
          
          // Проверим, есть ли полные URL в данных
          if (clubData.logo && clubData.logo.startsWith('http')) {
            console.log('ClubPage: Логотип уже полный URL:', clubData.logo);
          }
          if (clubData.owner.avatar && clubData.owner.avatar.startsWith('http')) {
            console.log('ClubPage: Аватар владельца уже полный URL:', clubData.owner.avatar);
          }
          setClub(clubData);
          
          // Получаем список всех пользователей для выбора судьи
          try {
            const usersData = await usersAPI.getAllUsers();
            setAllUsers(usersData);
          } catch (err) {
            console.warn('Не удалось загрузить список пользователей:', err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchData();
    }
  }, [clubId]);

  const handleJoinSuccess = () => {
    setToast({ 
      message: 'Заявка на вступление в клуб отправлена успешно!', 
      type: 'success', 
      isVisible: true 
    });
  };

  const handleAvatarUpdate = (updatedClub: Club) => {
    setClub(updatedClub);
    setToast({ 
      message: 'Аватар клуба успешно обновлен!', 
      type: 'success', 
      isVisible: true 
    });
  };

  const handleSeasonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setSeasonFormData({
      ...seasonFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await usersAPI.searchUsersByEmail(query, 10);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.warn('Ошибка поиска пользователей:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearchUsers(query);
  };

  const handleSelectUser = (user: UserSearchResult) => {
    setSeasonFormData({
      ...seasonFormData,
      refereeId: user.id
    });
    setSearchQuery(`${user.name} (${user.email})`);
    setShowSearchResults(false);
  };

  const handleCreateSeason = async () => {
    if (!seasonFormData.name.trim() || !seasonFormData.description.trim() || !seasonFormData.startDate || !seasonFormData.endDate || !seasonFormData.refereeId) {
      setToast({ 
        message: 'Пожалуйста, заполните все обязательные поля', 
        type: 'error', 
        isVisible: true 
      });
      return;
    }

    if (new Date(seasonFormData.startDate) >= new Date(seasonFormData.endDate)) {
      setToast({ 
        message: 'Дата окончания должна быть позже даты начала', 
        type: 'error', 
        isVisible: true 
      });
      return;
    }

    try {
      setCreatingSeason(true);
      await seasonsAPI.createSeason({
        ...seasonFormData,
        clubId: club!.id,
        refereeId: parseInt(seasonFormData.refereeId.toString())
      });
      
      setShowCreateSeasonModal(false);
      setSeasonFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        clubId: 0,
        refereeId: 0
      });
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
      
      setToast({ 
        message: 'Сезон успешно создан!', 
        type: 'success', 
        isVisible: true 
      });
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : 'Ошибка создания сезона', 
        type: 'error', 
        isVisible: true 
      });
    } finally {
      setCreatingSeason(false);
    }
  };

  // Функции для работы с турнирами
  const handleTournamentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTournamentFormData({
      ...tournamentFormData,
      [name]: name === 'stars' ? (value ? parseInt(value) : undefined) : value
    });
  };

  const handleTournamentSearchUsers = async (query: string) => {
    if (query.length < 2) {
      setTournamentSearchResults([]);
      setShowTournamentSearchResults(false);
      return;
    }

    try {
      setIsTournamentSearching(true);
      const results = await usersAPI.searchUsersByEmail(query, 10);
      setTournamentSearchResults(results);
      setShowTournamentSearchResults(true);
    } catch (err) {
      console.warn('Ошибка поиска пользователей:', err);
      setTournamentSearchResults([]);
    } finally {
      setIsTournamentSearching(false);
    }
  };

  const handleTournamentSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setTournamentSearchQuery(query);
    handleTournamentSearchUsers(query);
  };

  const handleSelectTournamentUser = (user: UserSearchResult) => {
    setTournamentFormData({
      ...tournamentFormData,
      refereeId: user.id
    });
    setTournamentSearchQuery(`${user.name} (${user.email})`);
    setShowTournamentSearchResults(false);
  };

  const handleCreateTournament = async () => {
    if (!tournamentFormData.name.trim() || !tournamentFormData.description.trim() || !tournamentFormData.date || !tournamentFormData.refereeId) {
      setToast({ 
        message: 'Пожалуйста, заполните все обязательные поля', 
        type: 'error', 
        isVisible: true 
      });
      return;
    }

    if (tournamentFormData.date < new Date().toISOString().split('T')[0]) {
      const currentDate = new Date().toISOString().split('T')[0];
      setToast({ 
        message: `Дата турнира не может быть в прошлом. Выбрано: ${tournamentFormData.date}, Сегодня: ${currentDate}`, 
        type: 'error', 
        isVisible: true 
      });
      return;
    }

    // Валидация для ELO турниров
    if (tournamentFormData.type === 'ELO') {
      if (tournamentFormData.stars === undefined || tournamentFormData.stars < 1 || tournamentFormData.stars > 6) {
        setToast({ 
          message: 'Для ELO турнира необходимо указать количество звезд от 1 до 6', 
          type: 'error', 
          isVisible: true 
        });
        return;
      }
    }

    try {
      setCreatingTournament(true);
      await tournamentsAPI.createTournament({
        ...tournamentFormData,
        clubId: club!.id,
        refereeId: parseInt(tournamentFormData.refereeId.toString())
      });
      
      setShowCreateTournamentModal(false);
      setTournamentFormData({
        name: '',
        description: '',
        date: '',
        clubId: 0,
        refereeId: 0,
        type: 'DEFAULT',
        stars: undefined
      });
      setTournamentSearchQuery('');
      setTournamentSearchResults([]);
      setShowTournamentSearchResults(false);
      
      setToast({ 
        message: 'Турнир успешно создан!', 
        type: 'success', 
        isVisible: true 
      });
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : 'Ошибка создания турнира', 
        type: 'error', 
        isVisible: true 
      });
    } finally {
      setCreatingTournament(false);
    }
  };

  // Функция для открытия модального окна редактирования турнира
  const handleEditTournament = (tournament: any) => {
    setEditingTournamentId(tournament.id);
    setEditTournamentFormData({
      name: tournament.name,
      description: tournament.description,
      date: tournament.date.split('T')[0], // Убираем время из даты
      clubId: tournament.clubId,
      refereeId: tournament.refereeId,
      type: tournament.type || 'DEFAULT',
      stars: tournament.stars
    });
    setEditTournamentSearchQuery(tournament.referee ? `${tournament.referee.nickname || tournament.referee.email}` : '');
    setShowEditTournamentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="text-white text-lg">Загрузка клуба...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Ошибка загрузки клуба</div>
          <div className="text-gray-400 mb-6">{error}</div>
          <a 
            href="/clubs" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Вернуться к списку клубов
          </a>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">Клуб не найден</div>
          <a 
            href="/clubs" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Вернуться к списку клубов
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616]">
      <ClubBanner club={club} currentUser={currentUser} onAvatarUpdate={handleAvatarUpdate} />

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ClubDescription club={club} />
            <ClubStatistics club={club} />
            <ClubSocialMedia club={club} />
            
            {/* Заявки на вступление - только для владельцев и администраторов */}
            {currentUser && club.status === 'APPROVED' && (
              (club.owner.id === currentUser.id || 
               club.administrators.some((admin: any) => admin.id === currentUser.id) ||
               currentUser.role === 'admin') && (
                <ClubRequests clubId={club.id} />
              )
            )}
            
            <ClubSeasons clubId={club.id} />
            <ClubTournaments clubId={club.id} onEditTournament={handleEditTournament} currentUser={currentUser} club={club} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ClubOwnerComponent club={club} />
            <ClubAdministrators club={club} />
            <ClubMembers club={club} />
            <ClubInfo club={club} />
            
            {/* Кнопка управления сезонами для владельцев и администраторов */}
            {currentUser && club.status === 'APPROVED' && (
              (club.owner.id === currentUser.id || 
               club.administrators.some((admin: ClubOwner) => admin.id === currentUser.id) ||
               currentUser.role === 'admin') && (
                <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Управление клубом</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCreateSeasonModal(true)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Создать сезон
                    </button>
                    <button
                      onClick={() => setShowCreateTournamentModal(true)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Trophy className="w-5 h-5" />
                      Создать турнир
                    </button>
                    <a 
                      href={`/clubs/${club.id}/seasons`}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Calendar className="w-5 h-5" />
                      Управление сезонами
                    </a>
                  </div>
                </div>
              )
            )}
            
            {/* Кнопка вступления в клуб */}
            <JoinClubButton 
              club={club} 
              currentUser={currentUser} 
              onSuccess={handleJoinSuccess}
            />
          </div>
        </div>
      </div>

      {/* Модальное окно создания сезона */}
      {showCreateSeasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1D1D1D] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-white text-xl font-bold mb-4">Создать новый сезон</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название сезона *
                </label>
                <input
                  type="text"
                  name="name"
                  value={seasonFormData.name}
                  onChange={handleSeasonInputChange}
                  placeholder="Введите название сезона"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Описание *
                </label>
                <textarea
                  name="description"
                  value={seasonFormData.description}
                  onChange={handleSeasonInputChange}
                  placeholder="Опишите сезон..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <DatePicker
                  value={seasonFormData.startDate}
                  onChange={(date) => setSeasonFormData({ ...seasonFormData, startDate: date })}
                  label="Дата начала *"
                  placeholder="Выберите дату начала"
                  minDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <DatePicker
                  value={seasonFormData.endDate}
                  onChange={(date) => setSeasonFormData({ ...seasonFormData, endDate: date })}
                  label="Дата окончания *"
                  placeholder="Выберите дату окончания"
                  minDate={seasonFormData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Судья *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Начните вводить email для поиска..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  {/* Результаты поиска */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.role} • {user.club || 'Без клуба'}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Сообщение если ничего не найдено */}
                  {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg px-4 py-3 text-gray-400 text-sm">
                      Пользователи не найдены
                    </div>
                  )}
                </div>
                
                {/* Скрытое поле для хранения ID выбранного пользователя */}
                <input
                  type="hidden"
                  name="refereeId"
                  value={seasonFormData.refereeId}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateSeasonModal(false);
                  setSeasonFormData({
                    name: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    clubId: 0,
                    refereeId: 0
                  });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={creatingSeason}
              >
                Отмена
              </button>
              <button
                onClick={handleCreateSeason}
                disabled={creatingSeason}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {creatingSeason ? 'Создание...' : 'Создать сезон'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания турнира */}
      {showCreateTournamentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1D1D1D] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-white text-xl font-bold mb-4">Создать новый турнир</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название турнира *
                </label>
                <input
                  type="text"
                  name="name"
                  value={tournamentFormData.name}
                  onChange={handleTournamentInputChange}
                  placeholder="Введите название турнира"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Описание турнира *
                </label>
                <textarea
                  name="description"
                  value={tournamentFormData.description}
                  onChange={handleTournamentInputChange}
                  placeholder="Опишите турнир..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <DatePicker
                  value={tournamentFormData.date}
                  onChange={(date) => setTournamentFormData({ ...tournamentFormData, date: date })}
                  label="Дата турнира *"
                  placeholder="Выберите дату турнира"
                  minDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Тип турнира *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTournamentFormData({
                      ...tournamentFormData,
                      type: 'DEFAULT',
                      stars: undefined
                    })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      tournamentFormData.type === 'DEFAULT'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500 hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">Обычный турнир</div>
                      <div className="text-xs opacity-75 mt-1">Стандартные правила</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTournamentFormData({
                      ...tournamentFormData,
                      type: 'ELO'
                    })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      tournamentFormData.type === 'ELO'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500 hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">ELO турнир</div>
                      <div className="text-xs opacity-75 mt-1">Рейтинговый турнир</div>
                    </div>
                  </button>
                </div>
              </div>

              {tournamentFormData.type === 'ELO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Количество звезд *
                  </label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTournamentFormData({
                          ...tournamentFormData,
                          stars: star
                        })}
                        className={`group relative p-2 rounded-lg transition-all duration-200 ${
                          tournamentFormData.stars === star
                            ? 'bg-yellow-500/20 border-2 border-yellow-500'
                            : 'bg-gray-700/50 border-2 border-gray-600 hover:border-yellow-400 hover:bg-yellow-500/10'
                        }`}
                      >
                        <svg 
                          className={`w-8 h-8 transition-all duration-200 ${
                            tournamentFormData.stars === star
                              ? 'text-yellow-400 scale-110'
                              : 'text-gray-400 group-hover:text-yellow-300 group-hover:scale-105'
                          }`}
                          fill={tournamentFormData.stars && tournamentFormData.stars >= star ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all duration-200 ${
                          tournamentFormData.stars === star
                            ? 'text-yellow-400 opacity-100'
                            : 'text-gray-500 opacity-0 group-hover:opacity-100'
                        }`}>
                          {star}
                        </span>
                      </button>
                    ))}
                  </div>

                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Судья *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tournamentSearchQuery}
                    onChange={handleTournamentSearchInputChange}
                    placeholder="Начните вводить email для поиска..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {isTournamentSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  {/* Результаты поиска */}
                  {showTournamentSearchResults && tournamentSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {tournamentSearchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectTournamentUser(user)}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.role} • {user.club || 'Без клуба'}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Сообщение если ничего не найдено */}
                  {showTournamentSearchResults && tournamentSearchQuery.length >= 2 && tournamentSearchResults.length === 0 && !isTournamentSearching && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg px-4 py-3 text-gray-400 text-sm">
                      Пользователи не найдены
                    </div>
                  )}
                </div>
                
                {/* Скрытое поле для хранения ID выбранного пользователя */}
                <input
                  type="hidden"
                  name="refereeId"
                  value={tournamentFormData.refereeId}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateTournamentModal(false);
                  setTournamentFormData({
                    name: '',
                    description: '',
                    date: '',
                    clubId: 0,
                    refereeId: 0,
                    type: 'DEFAULT',
                    stars: undefined
                  });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={creatingTournament}
              >
                Отмена
              </button>
              <button
                onClick={handleCreateTournament}
                disabled={creatingTournament}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {creatingTournament ? 'Создание...' : 'Создать турнир'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования турнира */}
      {showEditTournamentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1D1D1D] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-white text-xl font-bold mb-4">Редактировать турнир</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название турнира *
                </label>
                <input
                  type="text"
                  name="name"
                  value={editTournamentFormData.name}
                  onChange={(e) => setEditTournamentFormData({ ...editTournamentFormData, name: e.target.value })}
                  placeholder="Введите название турнира"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Описание турнира *
                </label>
                <textarea
                  name="description"
                  value={editTournamentFormData.description}
                  onChange={(e) => setEditTournamentFormData({ ...editTournamentFormData, description: e.target.value })}
                  placeholder="Опишите турнир..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <DatePicker
                  value={editTournamentFormData.date}
                  onChange={(date) => setEditTournamentFormData({ ...editTournamentFormData, date: date })}
                  label="Дата турнира *"
                  placeholder="Выберите дату турнира"
                  minDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Тип турнира *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditTournamentFormData({
                      ...editTournamentFormData,
                      type: 'DEFAULT',
                      stars: undefined
                    })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      editTournamentFormData.type === 'DEFAULT'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500 hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">Обычный турнир</div>
                      <div className="text-xs opacity-75 mt-1">Стандартные правила</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setEditTournamentFormData({
                      ...editTournamentFormData,
                      type: 'ELO'
                    })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      editTournamentFormData.type === 'ELO'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500 hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">ELO турнир</div>
                      <div className="text-xs opacity-75 mt-1">Рейтинговый турнир</div>
                    </div>
                  </button>
                </div>
              </div>

              {editTournamentFormData.type === 'ELO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Количество звезд *
                  </label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditTournamentFormData({
                          ...editTournamentFormData,
                          stars: star
                        })}
                        className={`group relative p-2 rounded-lg transition-all duration-200 ${
                          editTournamentFormData.stars === star
                            ? 'bg-yellow-500/20 border-2 border-yellow-500'
                            : 'bg-gray-700/50 border-2 border-gray-600 hover:border-yellow-400 hover:bg-yellow-500/10'
                        }`}
                      >
                        <svg 
                          className={`w-8 h-8 transition-all duration-200 ${
                            editTournamentFormData.stars === star
                              ? 'text-yellow-400 scale-110'
                              : 'text-gray-400 group-hover:text-yellow-300 group-hover:scale-105'
                          }`}
                          fill={editTournamentFormData.stars && editTournamentFormData.stars >= star ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all duration-200 ${
                          editTournamentFormData.stars === star
                            ? 'text-yellow-400 opacity-100'
                            : 'text-gray-500 opacity-0 group-hover:opacity-100'
                        }`}>
                          {star}
                        </span>
                      </button>
                    ))}
                  </div>

                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Судья *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editTournamentSearchQuery}
                    onChange={(e) => setEditTournamentSearchQuery(e.target.value)}
                    placeholder="Начните вводить email для поиска..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {isEditTournamentSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  {/* Результаты поиска */}
                  {showEditTournamentSearchResults && editTournamentSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {editTournamentSearchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setEditTournamentFormData({ ...editTournamentFormData, refereeId: user.id });
                            setEditTournamentSearchQuery(`${user.name} (${user.email})`);
                            setShowEditTournamentSearchResults(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.role} • {user.club || 'Без клуба'}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Сообщение если ничего не найдено */}
                  {showEditTournamentSearchResults && editTournamentSearchQuery.length >= 2 && editTournamentSearchResults.length === 0 && !isEditTournamentSearching && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg px-4 py-3 text-gray-400 text-sm">
                      Пользователи не найдены
                    </div>
                  )}
                </div>
                
                {/* Скрытое поле для хранения ID выбранного пользователя */}
                <input
                  type="hidden"
                  name="refereeId"
                  value={editTournamentFormData.refereeId}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditTournamentModal(false);
                  setEditTournamentFormData({
                    name: '',
                    description: '',
                    date: '',
                    clubId: 0,
                    refereeId: 0
                  });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={editingTournament}
              >
                Отмена
              </button>
              <button
                onClick={async () => {
                  try {
                    setEditingTournament(true);
                    await tournamentsAPI.updateTournament(editingTournamentId!, {
                      ...editTournamentFormData,
                      clubId: club!.id,
                      refereeId: parseInt(editTournamentFormData.refereeId.toString())
                    });
                    setShowEditTournamentModal(false);
                    setEditTournamentFormData({
                      name: '',
                      description: '',
                      date: '',
                      clubId: 0,
                      refereeId: 0
                    });
                    setEditTournamentSearchQuery('');
                    setEditTournamentSearchResults([]);
                    setShowEditTournamentSearchResults(false);
                    setToast({ 
                      message: 'Турнир успешно обновлен!', 
                      type: 'success', 
                      isVisible: true 
                    });
                  } catch (err) {
                    setToast({ 
                      message: err instanceof Error ? err.message : 'Ошибка обновления турнира', 
                      type: 'error', 
                      isVisible: true 
                    });
                  } finally {
                    setEditingTournament(false);
                  }
                }}
                disabled={editingTournament}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {editingTournament ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast уведомления */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
} 