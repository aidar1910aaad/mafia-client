'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { seasonsAPI, Season, SeasonsResponse, SeasonsFilters } from '../../api/seasons';
import SeasonCard from '../../components/Seasons/SeasonCard';
import SeasonFilters from '../../components/Seasons/SeasonFilters';
import SeasonPagination from '../../components/Seasons/SeasonPagination';

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters state
  const [filters, setFilters] = useState<SeasonsFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'ASC'
  });

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: SeasonsResponse = await seasonsAPI.getAllSeasons(filters);
      
      setSeasons(response.seasons);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err) {
      console.error('Error fetching seasons:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки сезонов');
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
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

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Ошибка загрузки сезонов</div>
            <div className="text-gray-400 mb-4">{error}</div>
            <button
              onClick={fetchSeasons}
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
            <Calendar className="w-8 h-8 text-[#8469EF]" />
            <h1 className="text-2xl font-bold text-white">Сезоны</h1>
          </div>
          {total > 0 && (
            <span className="text-gray-400 text-sm">
              Найдено {total} сезонов
            </span>
          )}
        </div>

        {/* Filters */}
        <SeasonFilters
          search={filters.search || ''}
          onSearchChange={handleSearchChange}
          status={filters.status || ''}
          onStatusChange={handleStatusChange}
          sortBy={filters.sortBy || 'name'}
          onSortByChange={handleSortByChange}
          sortOrder={filters.sortOrder || 'ASC'}
          onSortOrderChange={handleSortOrderChange}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
              <span className="text-gray-400">Загрузка сезонов...</span>
            </div>
          </div>
        )}

        {/* Seasons Grid */}
        {!loading && seasons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {seasons.map((season) => (
              <SeasonCard key={season.id} season={season} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && seasons.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Сезоны не найдены
            </h3>
            <p className="text-gray-500">
              {filters.search || filters.status 
                ? 'Попробуйте изменить параметры поиска'
                : 'Пока нет доступных сезонов'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <SeasonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
