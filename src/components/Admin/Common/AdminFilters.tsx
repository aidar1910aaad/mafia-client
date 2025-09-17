'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'dateRange';
  options?: FilterOption[];
  placeholder?: string;
}

interface AdminFiltersProps {
  filters: FilterConfig[];
  onFiltersChange: (filters: Record<string, any>) => void;
  className?: string;
}

export default function AdminFilters({ 
  filters, 
  onFiltersChange, 
  className = "" 
}: AdminFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.key} className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">{filter.label}</label>
            <select
              value={activeFilters[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value || null)}
              className="bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            >
              <option value="">Все</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count !== undefined ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={filter.key} className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">{filter.label}</label>
            <div className="relative">
              <select
                multiple
                value={activeFilters[filter.key] || []}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                  handleFilterChange(filter.key, selectedValues);
                }}
                className="bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors w-full"
                size={Math.min(filter.options?.length || 1, 5)}
              >
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.count !== undefined ? `(${option.count})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={filter.key} className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">{filter.label}</label>
            <input
              type="date"
              value={activeFilters[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value || null)}
              className="bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        );

      case 'dateRange':
        return (
          <div key={filter.key} className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">{filter.label}</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={activeFilters[`${filter.key}_from`] || ''}
                onChange={(e) => handleFilterChange(`${filter.key}_from`, e.target.value || null)}
                placeholder="От"
                className="bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors flex-1"
              />
              <input
                type="date"
                value={activeFilters[`${filter.key}_to`] || ''}
                onChange={(e) => handleFilterChange(`${filter.key}_to`, e.target.value || null)}
                placeholder="До"
                className="bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors flex-1"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#A1A1A1]" />
          <h3 className="text-white font-semibold">Фильтры</h3>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[#A1A1A1] hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Очистить
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#A1A1A1] hover:text-white transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filters.map(renderFilter)}
        </div>
      )}
    </div>
  );
}