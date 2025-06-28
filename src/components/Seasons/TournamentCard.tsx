import React from 'react';
import Image from 'next/image';

interface TournamentCardProps {
  title: string;
  location: string;
  type: string;
  date: string;
  club: string;
  clubUrl: string;
  logo: string;
  count: number;
  isOpen: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  title,
  location,
  type,
  date,
  club,
  clubUrl,
  logo,
  count,
  isOpen,
}) => {
  return (
    <div className="bg-[#303030] rounded-[7px] w-[465px] h-[238px] flex flex-col justify-between ml-[20px] p-4  ">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[24px] font-semibold text-[#8469EF] leading-tight mb-1">
            {title}
          </div>
          <div className=" text-[#C7C7C7] mb-1">{location}</div>
          <div className=" text-[#C7C7C7] mb-1">{date}</div>
          <div className=" text-[#C7C7C7] mb-1">
            <span className="font-medium text-[#8469EF]">{type}</span> <a href={clubUrl} className="text-[#6B8CFF] hover:underline ml-1">{club}</a>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[48px]">
          <Image src={logo} alt="logo" width={48} height={48} className="rounded-[6px] object-cover" />
          <div className="flex items-center gap-1 bg-[#FFF3E0] rounded-[6px] px-2 py-1 text-xs text-[#FFB800] font-semibold">
            <Image src="/star.png" alt="star" width={14} height={14} />
            {count}
          </div>
        </div>
      </div>
      <div className="mt-2">
        {isOpen ? (
          <button className="flex w-[248px] h-[52px] text-[18px] items-center gap-2 px-4 py-2 bg-[#8469EF] hover:bg-[#6B4FFF] text-white rounded-[7px] font-medium text-sm transition-colors">
            Регистрация открыта
            <Image src="/login.png" alt="login" width={18} height={18} />
          </button>
        ) : (
          <button className="flex w-[215px] h-[52px] text-[18px] items-center gap-2 px-4 py-2 bg-[#444444] text-[#C7C7C7] rounded-[7px] font-medium text-sm cursor-not-allowed" disabled>
            Регистрация закрыта
          </button>
        )}
      </div>
    </div>
  );
};

export default TournamentCard; 