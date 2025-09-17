'use client';

import { useState } from 'react';
import { tournamentsAPI, CreateTournamentRequest } from '../../../api/tournaments';
import { clubsAPI } from '../../../api/clubs';
import { usersAPI } from '../../../api/users';
import DatePicker from '../../UI/DatePicker';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

interface Club {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  club: string;
}

export default function CreateTournamentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onError
}: CreateTournamentModalProps) {
  const [formData, setFormData] = useState<CreateTournamentRequest>({
    name: '',
    description: '',
    date: '',
    clubId: 0,
    refereeId: 0,
    type: 'DEFAULT',
    stars: undefined
  });

  // Состояние для номинаций
  const [enabledNominations, setEnabledNominations] = useState({
    mvp: true,
    don: true,
    sheriff: true,
    beauty: true,
    red: true,
    black: true,
    maniac: true,
    doctor: true
  });

  const [clubs, setClubs] = useState<Club[]>([]);
  const [referees, setReferees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [refereesLoading, setRefereesLoading] = useState(false);
  const [showClubSearch, setShowClubSearch] = useState(false);
  const [showRefereeSearch, setShowRefereeSearch] = useState(false);
  const [clubSearchQuery, setClubSearchQuery] = useState('');
  const [refereeSearchQuery, setRefereeSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stars' ? (value ? parseInt(value) : undefined) : value
    }));
  };

  const handleClubSearch = async (query: string) => {
    setClubSearchQuery(query);
    if (query.length < 2) {
      setClubs([]);
      return;
    }

    try {
      setClubsLoading(true);
      const allClubs = await clubsAPI.getClubs();
      const filteredClubs = allClubs.filter(club => 
        club.name.toLowerCase().includes(query.toLowerCase())
      );
      setClubs(filteredClubs);
    } catch (error) {
      console.error('Error searching clubs:', error);
    } finally {
      setClubsLoading(false);
    }
  };

  const selectClub = (club: Club | null) => {
    if (club) {
      setFormData(prev => ({ ...prev, clubId: club.id }));
      setClubSearchQuery(club.name);
    } else {
      setFormData(prev => ({ ...prev, clubId: 0 }));
      setClubSearchQuery('Без клуба');
    }
    setShowClubSearch(false);
  };


  const handleRefereeSearch = async (query: string) => {
    setRefereeSearchQuery(query);
    if (query.length < 2) {
      setReferees([]);
      return;
    }

    try {
      setRefereesLoading(true);
      const searchResults = await usersAPI.searchUsersByEmail(query, 20);
      const filteredUsers = searchResults.filter(user => 
        (user.name && user.name.toLowerCase().includes(query.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(query.toLowerCase()))
      );
      setReferees(filteredUsers);
    } catch (error) {
      console.error('Error searching referees:', error);
    } finally {
      setRefereesLoading(false);
    }
  };


  const selectReferee = (referee: User) => {
    setFormData(prev => ({ ...prev, refereeId: referee.id }));
    setRefereeSearchQuery(`${referee.name} (${referee.email})`);
    setShowRefereeSearch(false);
  };

  const toggleNomination = (nomination: keyof typeof enabledNominations) => {
    setEnabledNominations(prev => ({
      ...prev,
      [nomination]: !prev[nomination]
    }));
  };

  const handleSubmit = async () => {
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.date || !formData.refereeId) {
      onError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (formData.date < new Date().toISOString().split('T')[0]) {
      onError('Дата турнира не может быть в прошлом');
      return;
    }

    if (formData.type === 'ELO' && (!formData.stars || formData.stars < 1 || formData.stars > 6)) {
      onError('Для ELO турнира необходимо указать количество звезд от 1 до 6');
      return;
    }

    try {
      setLoading(true);
      await tournamentsAPI.createTournament({
        ...formData,
        refereeId: parseInt(formData.refereeId.toString())
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        date: '',
        clubId: 0,
        refereeId: 0,
        type: 'DEFAULT',
        stars: undefined
      });
      setClubSearchQuery('');
      setRefereeSearchQuery('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании турнира';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Введите название турнира"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание турнира *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Опишите турнир..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <DatePicker
              value={formData.date}
              onChange={(date) => setFormData(prev => ({ ...prev, date }))}
              label="Дата турнира *"
              placeholder="Выберите дату турнира"
              minDate={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Клуб
            </label>
            <div className="relative">
              <input
                type="text"
                value={clubSearchQuery}
                onChange={(e) => handleClubSearch(e.target.value)}
                onFocus={() => setShowClubSearch(true)}
                placeholder="Поиск клуба или выберите 'Без клуба'..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {clubsLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {/* Результаты поиска */}
              {showClubSearch && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {/* Опция "Без клуба" */}
                  <button
                    type="button"
                    onClick={() => selectClub(null)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-600"
                  >
                    <div className="font-medium">Без клуба</div>
                    <div className="text-sm text-gray-400">Турнир без привязки к клубу</div>
                  </button>
                  
                  {/* Список клубов */}
                  {clubs.length > 0 ? (
                    clubs.map((club) => (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() => selectClub(club)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0"
                      >
                        <div className="font-medium">{club.name}</div>
                      </button>
                    ))
                  ) : clubSearchQuery.length >= 2 && !clubsLoading ? (
                    <div className="px-4 py-3 text-gray-400 text-sm">
                      Клубы не найдены
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Тип турнира *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'DEFAULT', stars: undefined }))}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === 'DEFAULT'
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
                onClick={() => setFormData(prev => ({ ...prev, type: 'ELO' }))}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === 'ELO'
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

          {formData.type === 'ELO' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Количество звезд *
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5, 6].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, stars: star }))}
                    className={`group relative p-2 rounded-lg transition-all duration-200 ${
                      formData.stars === star
                        ? 'bg-yellow-500/20 border-2 border-yellow-500'
                        : 'bg-gray-700/50 border-2 border-gray-600 hover:border-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    <svg 
                      className={`w-8 h-8 transition-all duration-200 ${
                        formData.stars === star
                          ? 'text-yellow-400 scale-110'
                          : 'text-gray-400 group-hover:text-yellow-300 group-hover:scale-105'
                      }`}
                      fill={formData.stars && formData.stars >= star ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all duration-200 ${
                      formData.stars === star
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
                value={refereeSearchQuery}
                onChange={(e) => handleRefereeSearch(e.target.value)}
                onFocus={() => setShowRefereeSearch(true)}
                placeholder="Начните вводить email для поиска..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              {refereesLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {/* Результаты поиска */}
              {showRefereeSearch && referees.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {referees.map((referee) => (
                    <button
                      key={referee.id}
                      type="button"
                      onClick={() => selectReferee(referee)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0"
                    >
                      <div className="font-medium">{referee.name}</div>
                      <div className="text-sm text-gray-400">{referee.email}</div>
                      <div className="text-xs text-gray-500">{referee.role} • {referee.club || 'Без клуба'}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Сообщение если ничего не найдено */}
              {showRefereeSearch && refereeSearchQuery.length >= 2 && referees.length === 0 && !refereesLoading && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg px-4 py-3 text-gray-400 text-sm">
                  Пользователи не найдены
                </div>
              )}
            </div>
            
            {/* Скрытое поле для хранения ID выбранного пользователя */}
            <input
              type="hidden"
              name="refereeId"
              value={formData.refereeId}
            />
          </div>

        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Создать турнир'}
          </button>
        </div>
      </div>
    </div>
  );
}