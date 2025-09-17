'use client';

import React from 'react';
import { Search, Users, Trophy } from 'lucide-react';

interface TournamentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  ratingFilter: string;
  onRatingFilterChange: (value: string) => void;
}

const TournamentFilters: React.FC<TournamentFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  typeFilter,
  onTypeFilterChange,
  ratingFilter,
  onRatingFilterChange,
}) => {
  return (
    <div className="bg-[#2A2A2A] rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск турниров..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8469EF]"
          />
        </div>


        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-3 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-[#8469EF] text-sm"
          >
            <option value="">Все</option>
            <option value="individual">Личные</option>
            <option value="team">Командные</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-gray-400" />
          <select
            value={ratingFilter}
            onChange={(e) => onRatingFilterChange(e.target.value)}
            className="px-3 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white focus:outline-none focus:border-[#8469EF] text-sm"
          >
            <option value="">Все</option>
            <option value="rated">С рейтингом СМА</option>
            <option value="unrated">Вне рейтинга</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TournamentFilters; 