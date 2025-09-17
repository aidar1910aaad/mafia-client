'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface AdminSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  className?: string;
}

export default function AdminSearch({ 
  placeholder = "Поиск...", 
  onSearch, 
  initialValue = "",
  className = ""
}: AdminSearchProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1A1] w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-xl pl-10 pr-10 py-3 text-white placeholder-[#A1A1A1] focus:outline-none focus:border-blue-500/50 transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A1A1A1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}