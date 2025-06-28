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
  ClubTournaments
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
    refereeId: 0
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
    refereeId: 0
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
    setTournamentFormData({
      ...tournamentFormData,
      [e.target.name]: e.target.value
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
        refereeId: 0
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
      refereeId: tournament.refereeId
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
      <ClubBanner club={club} />

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ClubDescription club={club} />
            <ClubStatistics club={club} />
            <ClubSocialMedia club={club} />
            <ClubSeasons clubId={club.id} />
            <ClubTournaments clubId={club.id} onEditTournament={handleEditTournament} currentUser={currentUser} />
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
                    refereeId: 0
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