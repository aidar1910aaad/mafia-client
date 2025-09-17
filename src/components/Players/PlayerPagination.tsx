'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PlayerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PlayerPagination: React.FC<PlayerPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white hover:border-[#8469EF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Назад</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 sm:px-3 py-2 text-gray-400 text-sm">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === page
                    ? 'bg-[#8469EF] text-white'
                    : 'bg-[#1D1D1D] border border-[#404040] text-white hover:border-[#8469EF]'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-[#1D1D1D] border border-[#404040] rounded-lg text-white hover:border-[#8469EF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <span className="hidden sm:inline">Вперед</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PlayerPagination; 