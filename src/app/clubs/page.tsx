'use client'
import React, { useState, useEffect } from 'react';
import YearSelect from '@/components/Seasons/YearSelect';
import SearchInput from '@/components/Seasons/SearchInput';
import Pagination from '@/components/Seasons/Pagination';
import ClubRow from '@/components/Seasons/ClubRow';
import { CreateClubForm } from '@/components/Clubs';
import Toast from '@/components/Toast/Toast';
import { clubsAPI, Club } from '@/api/clubs';

const years = [2028, 2027, 2026, 2025];

export default function ClubsPage() {
  const [year, setYear] = useState(years[0]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as const, isVisible: false });
  const totalPages = 6;

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

  // Преобразуем данные клубов для отображения в таблице
  const clubsWithStats = clubs
    .filter(club => club.status === 'APPROVED') // Показываем только подтвержденные клубы
    .map((club, index) => ({
      place: index + 1,
      logo: club.logo || '/ultimate.png',
      name: club.name,
      city: club.city,
      points: 2000, // Фиксированные баллы для всех клубов
      elo: 3000, // Фиксированный ELO для всех клубов
      originalClub: club
    }));

  // Фильтрация по поиску
  const filteredClubs = clubsWithStats.filter(club =>
    club.name.toLowerCase().includes(search.toLowerCase()) ||
    club.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="text-white text-lg">Загрузка клубов...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-[20px] pt-[40px] px-[20px]">
      <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] shadow-2xl border border-[#C7C7C7]/20 p-[20px] pt-[40px] relative" style={{borderWidth:1}}>
        {/* Фильтры и кнопка создания */}
        <div className="flex flex-col mx-[20px] md:flex-row md:items-center gap-6 mb-2">
          <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
            <YearSelect years={years} value={year} onChange={setYear} />
            <SearchInput value={search} onChange={setSearch} onSearch={() => {}} />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Создать клуб
          </button>
        </div>

        {/* Заголовки */}
        <div className="flex items-center justify-between px-6 pb-2 pt-2 text-[#C7C7C7] text-sm font-medium">
          <span></span>
          <span>Баллы</span>
          <span className="flex items-center gap-2">ELO</span>
        </div>

        {/* Список клубов */}
        <div className='mx-[20px]'>
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club, i) => (
              <ClubRow key={club.originalClub.id} {...club} isActive={false} />
            ))
          ) : (
            <div className="text-center py-8 text-[#C7C7C7]">
              {search ? 'Клубы не найдены' : 'Клубы не загружены'}
            </div>
          )}
        </div>

        {/* Пагинация */}
        <Pagination current={page} total={totalPages} onPageChange={setPage} />
      </div>

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
