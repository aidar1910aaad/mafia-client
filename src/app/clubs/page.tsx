'use client'
import React, { useState, useEffect } from 'react';
import SearchInput from '@/components/Seasons/SearchInput';
import ClubRow from '@/components/Seasons/ClubRow';
import { CreateClubForm } from '@/components/Clubs';
import ClubPagination from '@/components/Clubs/ClubPagination';
import Toast from '@/components/Toast/Toast';
import { clubsAPI, Club } from '@/api/clubs';
import { API_URL } from '@/api/API_URL';

export default function ClubsPage() {
  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as const, isVisible: false });
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Сортировка
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError('');
      const clubsData = await clubsAPI.getClubs();
      setClubs(clubsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка загрузки клубов');
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setToast({ message: 'Администратор рассмотрит заявку на создание клуба', type: 'success', isVisible: true });
    // Обновляем список клубов
    fetchClubs();
  };

  // Обработчики для сортировки и пагинации
  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setCurrentPage(1); // Сбрасываем на первую страницу при смене сортировки
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };


  // Преобразуем данные клубов для отображения в таблице
  const filteredClubs = clubs
    .filter(club => club.status === 'APPROVED') // Показываем только подтвержденные клубы
    .filter(club =>
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.city.toLowerCase().includes(search.toLowerCase())
    );

  // Сортируем по ELO рейтингу
  const sortedClubs = filteredClubs.sort((a, b) => {
    const aElo = a.elo || 1000;
    const bElo = b.elo || 1000;
    return sortOrder === 'desc' ? bElo - aElo : aElo - bElo;
  });

  // Пагинация
  const totalPages = Math.ceil(sortedClubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClubs = sortedClubs.slice(startIndex, endIndex);

  const clubsWithStats = paginatedClubs.map((club, index) => {
      // Правильно формируем путь к логотипу
      let logoPath = '/club-avatar-default.svg'; // Дефолтный логотип
      
      if (club.logo) {
        // Если это уже полный URL, используем как есть
        if (club.logo.startsWith('http')) {
          logoPath = club.logo;
        }
        // Если это путь к файлу аватара клуба, используем API endpoint
        else if (club.logo.includes('club-avatars') || club.logo.includes('avatar')) {
          logoPath = `${API_URL}/files/club-avatars/${club.logo}`;
        }
        // Если уже правильный путь, используем как есть
        else if (club.logo.startsWith('/')) {
          logoPath = club.logo;
        }
        // Иначе добавляем ведущий слеш
        else {
          logoPath = `/${club.logo}`;
        }
      }
      
      // Используем ELO клуба напрямую из API
      const clubElo = club.elo || 1000; // Используем ELO клуба из API, дефолт 1000
      
      // Вычисляем общие баллы всех игроков в клубе
      const allMembers = [...club.members, ...club.administrators];
      const totalPoints = allMembers.length > 0
        ? Math.round(allMembers.reduce((sum, member) => sum + (member.points || 0), 0))
        : 0;

      return {
        place: startIndex + index + 1,
        logo: logoPath,
        name: club.name,
        city: club.city,
        points: totalPoints,
        elo: clubElo,
        originalClub: club
      };
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center py-4 px-2">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
          <div className="text-white text-base sm:text-lg">Загрузка клубов...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center py-4 px-2">
        <div className="text-red-400 text-base sm:text-lg text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-4 sm:py-8 px-2 sm:px-4">
      <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] shadow-2xl border border-[#C7C7C7]/20 p-4 sm:p-6 relative" style={{borderWidth:1}}>
        {/* Фильтры и кнопка создания */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1">
            <SearchInput value={search} onChange={handleSearchChange} onSearch={() => {}} />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Создать клуб</span>
            <span className="sm:hidden">Создать</span>
          </button>
        </div>

        {/* Элементы управления */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSortToggle}
              className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg transition-colors text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Сортировка: {sortOrder === 'desc' ? 'По убыванию' : 'По возрастанию'}
            </button>
            <div className="text-sm text-gray-400">
              Показано {clubsWithStats.length} из {sortedClubs.length} клубов
            </div>
          </div>
        </div>

        {/* Заголовки - только для десктопа */}
        <div className="hidden md:flex items-center justify-end px-6 pb-2 pt-2 text-[#C7C7C7] text-sm font-medium">
          <span className="flex items-center gap-2 w-[100px] justify-end">ELO</span>
        </div>

        {/* Список клубов */}
        <div className="space-y-3">
          {clubsWithStats.length > 0 ? (
            clubsWithStats.map((club, i) => (
              <ClubRow key={club.originalClub.id} {...club} isActive={false} />
            ))
          ) : (
            <div className="text-center py-8 text-[#C7C7C7]">
              {search ? 'Клубы не найдены' : 'Клубы не загружены'}
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <ClubPagination
            key={`pagination-${currentPage}-${totalPages}`}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        </div>

        {/* Пагинация снизу - как на странице турниров */}
       

        {/* Модальное окно создания клуба */}
      {showCreateForm && (
        <CreateClubForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Toast notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
}
