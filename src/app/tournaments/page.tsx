'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Loader2 } from 'lucide-react';
import { tournamentsAPI, Tournament, TournamentsResponse, TournamentsFilters } from '../../api/tournaments';
import TournamentCard from '../../components/Tournaments/TournamentCard';
import TournamentFilters from '../../components/Tournaments/TournamentFilters';
import TournamentPagination from '../../components/Tournaments/TournamentPagination';

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters state
  const [filters, setFilters] = useState<TournamentsFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    sortBy: 'date',
    sortOrder: 'desc',
    dateFilter: '',
    typeFilter: '',
    ratingFilter: ''
  });

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: TournamentsResponse = await tournamentsAPI.getAllTournaments(filters);
      
      setTournaments(response.tournaments);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки турниров');
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value, page: 1 }));
  };

  const handleSortByChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value, page: 1 }));
  };

  const handleSortOrderChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortOrder: value, page: 1 }));
  };

  const handleDateFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, dateFilter: value, page: 1 }));
  };

  const handleTypeFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, typeFilter: value, page: 1 }));
  };

  const handleRatingFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, ratingFilter: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Ошибка загрузки турниров</div>
            <div className="text-gray-400 mb-4">{error}</div>
            <button
              onClick={fetchTournaments}
              className="px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-[#8469EF]" />
            <h1 className="text-2xl font-bold text-white">Турниры</h1>
          </div>
          {total > 0 && (
            <span className="text-gray-400 text-sm">
              Найдено {total} турниров
            </span>
          )}
        </div>

        {/* Filters */}
        <TournamentFilters
          search={filters.search || ''}
          onSearchChange={handleSearchChange}
          status={filters.status || ''}
          onStatusChange={handleStatusChange}
          sortBy={filters.sortBy || 'date'}
          onSortByChange={handleSortByChange}
          sortOrder={filters.sortOrder || 'desc'}
          onSortOrderChange={handleSortOrderChange}
          dateFilter={filters.dateFilter || ''}
          onDateFilterChange={handleDateFilterChange}
          typeFilter={filters.typeFilter || ''}
          onTypeFilterChange={handleTypeFilterChange}
          ratingFilter={filters.ratingFilter || ''}
          onRatingFilterChange={handleRatingFilterChange}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
              <span className="text-gray-400">Загрузка турниров...</span>
            </div>
          </div>
        )}

        {/* Tournaments Grid */}
        {!loading && tournaments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Турниры не найдены
            </h3>
            <p className="text-gray-500">
              {filters.search || filters.status 
                ? 'Попробуйте изменить параметры поиска'
                : 'Пока нет доступных турниров'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <TournamentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
