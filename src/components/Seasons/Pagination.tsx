import React from 'react';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => (
  <div className="flex justify-left gap-2 mt-4 ml-[20px]">
    {Array.from({ length: total }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        className={`w-[51px] h-[52px] bg-[#161616] rounded-[7px] flex items-center justify-center font-semibold text-[#8469EF] transition-colors ${page===current ? 'bg-[#303030] text-white' : 'bg-[#161616] hover:bg-[#353535]'}`}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ))}
  </div>
);

export default Pagination; 