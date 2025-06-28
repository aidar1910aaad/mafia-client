import React from 'react';
import Image from 'next/image';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  onSearch?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSearch }) => (
  <div className="relative w-[338px] h-[52px]">
    <input
      type="text"
      placeholder="Поиск"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter' && onSearch) onSearch(); }}
      className="w-[338px] h-[52px] bg-[#303030]  rounded-[7px] px-4 py-2 text-[#8469EF] pr-10 focus:outline-none placeholder-[#8469EF]"
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2"
      onClick={onSearch}
      tabIndex={-1}
    >
      <Image src="/search.png" alt="search" width={20} height={20} />
    </button>
  </div>
);

export default SearchInput; 