'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Loader2, Trophy, Target, Shield, Crown } from 'lucide-react';
import { usersAPI, Player, PlayersResponse, PlayersFilters } from '../../api/users';
import PlayerCard from '../../components/Players/PlayerCard';
import PlayerFilters from '../../components/Players/PlayerFilters';
import PlayerPagination from '../../components/Players/PlayerPagination';

export default function PlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters state
  const [filters, setFilters] = useState<PlayersFilters>({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    sortBy: 'nickname',
    sortOrder: 'asc'
  });

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PlayersResponse = await usersAPI.getAllPlayers(filters);
      
      setPlayers(response.players);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки игроков');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleRoleChange = (value: string) => {
    setFilters(prev => ({ ...prev, role: value, page: 1 }));
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

  // Calculate overall statistics
  const totalGames = players.reduce((sum, player) => sum + player.totalGames, 0);
  const totalWins = players.reduce((sum, player) => sum + player.totalWins, 0);
  const totalKills = players.reduce((sum, player) => sum + player.totalKills, 0);
  const totalDeaths = players.reduce((sum, player) => sum + player.totalDeaths, 0);
  const totalPoints = players.reduce((sum, player) => sum + player.totalPoints, 0);

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">Ошибка загрузки игроков</div>
            <div className="text-gray-400 mb-4">{error}</div>
            <button
              onClick={fetchPlayers}
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
            <Users className="w-8 h-8 text-[#8469EF]" />
            <h1 className="text-2xl font-bold text-white">Игроки</h1>
          </div>
          {total > 0 && (
            <span className="text-gray-400 text-sm">
              Найдено {total} игроков
            </span>
          )}
        </div>

        {/* Statistics */}
        {!loading && players.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-[#2A2A2A] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">{totalGames}</span>
              </div>
              <div className="text-gray-400 text-xs">Всего игр</div>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">{totalWins}</span>
              </div>
              <div className="text-gray-400 text-xs">Всего побед</div>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-red-400" />
                <span className="text-white font-semibold">{totalKills}</span>
              </div>
              <div className="text-gray-400 text-xs">Всего убийств</div>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">{totalDeaths}</span>
              </div>
              <div className="text-gray-400 text-xs">Всего смертей</div>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-[#FFB800]" />
                <span className="text-white font-semibold">{totalPoints}</span>
              </div>
              <div className="text-gray-400 text-xs">Всего очков</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <PlayerFilters
          search={filters.search || ''}
          onSearchChange={handleSearchChange}
          role={filters.role || ''}
          onRoleChange={handleRoleChange}
          sortBy={filters.sortBy || 'nickname'}
          onSortByChange={handleSortByChange}
          sortOrder={filters.sortOrder || 'asc'}
          onSortOrderChange={handleSortOrderChange}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
              <span className="text-gray-400">Загрузка игроков...</span>
            </div>
          </div>
        )}

        {/* Players Grid */}
        {!loading && players.length > 0 && (
          <div className="space-y-4 mb-8">
            {players.map((player, index) => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                rank={currentPage > 1 ? (currentPage - 1) * (filters.limit || 10) + index + 1 : index + 1}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && players.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Игроки не найдены
            </h3>
            <p className="text-gray-500">
              {filters.search || filters.role 
                ? 'Попробуйте изменить параметры поиска'
                : 'Пока нет зарегистрированных игроков'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <PlayerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
