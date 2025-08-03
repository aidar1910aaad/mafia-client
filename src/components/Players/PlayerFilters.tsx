'use client';

import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Users } from 'lucide-react';

interface PlayerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
}

const PlayerFilters: React.FC<PlayerFiltersProps> = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-[#2A2A2A] rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск игроков..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8469EF]"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white hover:border-[#8469EF] transition-colors"
        >
          <Filter className="w-4 h-4" />
          Фильтры
        </button>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-3 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-[#8469EF]"
          >
            <option value="nickname">По никнейму</option>
            <option value="totalPoints">По очкам</option>
            <option value="totalGames">По играм</option>
            <option value="totalWins">По победам</option>
            <option value="createdAt">По дате регистрации</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white hover:border-[#8469EF] transition-colors"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-[#404040]">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Роль</label>
              <select
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                className="px-3 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-[#8469EF]"
              >
                <option value="">Все роли</option>
                <option value="player">Игроки</option>
                <option value="club_owner">Владельцы клубов</option>
                <option value="admin">Администраторы</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerFilters; 