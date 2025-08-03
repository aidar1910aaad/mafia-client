'use client';

import React from 'react';
import { Building2, MapPin, Mail } from 'lucide-react';
import { Game } from '../../api/games';
import { getImageUrl } from '../../utils/imageUtils';
import SafeImage from '../UI/SafeImage';

interface GameClubInfoProps {
  game: Game;
}

export default function GameClubInfo({ game }: GameClubInfoProps) {
  if (!game.club) return null;

  return (
    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-[#8469EF]" />
        Информация о клубе
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">{game.club.name}</h3>
          <p className="text-[#C7C7C7] mb-3">{game.club.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#C7C7C7]">
              <MapPin className="w-4 h-4" />
              <span>{game.club.city}</span>
            </div>
            {game.club.socialMediaLink && (
              <div className="flex items-center gap-2 text-[#C7C7C7]">
                <Mail className="w-4 h-4" />
                <a 
                  href={game.club.socialMediaLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#8469EF] hover:underline"
                >
                  Социальные сети
                </a>
              </div>
            )}
          </div>
        </div>
        {game.club.logo && getImageUrl(game.club.logo, 'logo') && (
          <div className="flex justify-center md:justify-end">
            <SafeImage 
              src={getImageUrl(game.club.logo, 'logo')} 
              alt="Club logo" 
              width={120} 
              height={120} 
              className="rounded-[12px] object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
} 