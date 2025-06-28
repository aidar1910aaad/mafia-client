'use client'

import React, { useState } from 'react';
import TournamentCard from '@/components/Seasons/TournamentCard';
import YearSelect from '@/components/Seasons/YearSelect';
import SearchInput from '@/components/Seasons/SearchInput';
import Pagination from '@/components/Seasons/Pagination';
import Image from 'next/image';

const tournaments = [
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Личный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 0,
    isOpen: true,
  },
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Командный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 6,
    isOpen: false,
  },
  // ...ещё 6 карточек для примера
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Личный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 0,
    isOpen: true,
  },
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Командный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 6,
    isOpen: false,
  },
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Личный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 0,
    isOpen: true,
  },
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Командный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 6,
    isOpen: false,
  },
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Личный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 0,
    isOpen: true,
  },
  {
    title: 'Капитанский стол III season I episode | Легион city',
    location: 'Россия, Москва',
    type: 'Командный',
    date: '22.01.2025 - 29.01.2025',
    club: 'Легион city',
    clubUrl: '#',
    logo: '/legion.png',
    count: 6,
    isOpen: false,
  },
];

const years = [2028, 2027, 2026, 2025];

export default function SeasonsPage() {
  const [year, setYear] = useState(years[0]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const totalPages = 6;

  return (
    <div className="min-h-screen bg-[#161616] flex justify-center items-start py-8 px-2">
      <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D]  border border-[#353535] p-6">
        {/* Фильтры */}
        <div className="ml-[20px] flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <YearSelect years={years} value={year} onChange={setYear} />
          <SearchInput value={search} onChange={setSearch} onSearch={() => {}} />
        </div>
        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {tournaments.map((t, i) => (
            <TournamentCard key={i} {...t} />
          ))}
        </div>
        {/* Пагинация */}
        <Pagination  current={page} total={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
