import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ClubRowProps {
  place: number;
  logo: string;
  name: string;
  city: string;
  points: number;
  elo: number;
  isActive?: boolean;
  originalClub?: {
    id: number;
  };
}

const medalIcons = [
  '/medal-gold.png',
  '/medal-silver.png',
  '/medal-bronze.png',
];

function getEloColor(elo: number) {
  if (elo < 500) return '#e32bb8';
  if (elo < 1000) return '#e63c9f';
  if (elo < 1500) return '#eb4b88';
  if (elo < 2000) return '#ed5c6d';
  if (elo < 2500) return '#f26e57';
  if (elo < 3000) return '#f5794c';
  if (elo < 3500) return '#f78040';
  if (elo < 4000) return '#fa8932';
  if (elo < 4500) return '#fc9526';
  return '#ff9c19';
}

const ClubRow: React.FC<ClubRowProps> = ({ place, logo, name, city, points, elo, isActive, originalClub }) => {
  const showMedal = place <= 3;
  const eloColor = getEloColor(elo);
  
  const clubContent = (
    <div className={`flex items-center justify-between bg-[#303030] h-[115px] rounded-[7px] px-6 py-4 mb-3 transition-all duration-200 hover:bg-[#404040] cursor-pointer`}>
      <div className="flex items-center gap-4 min-w-[220px]">
        <div className="relative">
          <Image src={logo} alt="logo" width={56} height={56} className="rounded-full object-cover" />
          <div className="absolute -bottom-2 -right-2">
            {showMedal ? (
              <Image src={medalIcons[place-1]} alt={`medal-${place}`} width={28} height={28} />
            ) : (
              <div className="w-7 h-7 flex items-center justify-center bg-[#161616] rounded-full text-white font-bold text-[18px] border border-[#353535]">{place}</div>
            )}
          </div>
        </div>
        <div>
          <div className="text-[20px] font-semibold text-[#8469EF] leading-tight">{name}</div>
          <div className="text-xs text-[#C7C7C7]">{city}</div>
        </div>
      </div>
      <div className="text-[20px] text-white font-semibold w-[80px] text-center">{points}</div>
      <div className="flex items-center gap-2 w-[100px] justify-end">
        <svg width="21" height="44" viewBox="0 0 21 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0927 25.0487L13.5568 19.4692C13.163 19.0722 13.0585 18.4703 13.2954 17.9626L20.5537 2.41692C21.1792 1.07748 19.4922 -0.134403 18.4278 0.889325L0.475204 18.1527C-0.0519074 18.6597 -0.0743018 19.4973 0.425344 20.0301L5.53475 25.4821C5.87699 25.8472 5.9861 26.3741 5.81717 26.846L0.660301 41.2624C0.184876 42.5919 1.82365 43.6527 2.83734 42.6713L19.0724 26.9506C19.6071 26.4329 19.6163 25.5768 19.0926 25.0491L19.0927 25.0487Z" fill={eloColor}/>
        </svg>
        <span className="text-[20px] font-semibold" style={{color: eloColor}}>{elo}</span>
      </div>
    </div>
  );

  // Если есть ID клуба, делаем кликабельным
  if (originalClub?.id) {
    return (
      <Link href={`/clubs/${originalClub.id}`}>
        {clubContent}
      </Link>
    );
  }

  // Иначе возвращаем обычный div
  return clubContent;
};

export default ClubRow; 