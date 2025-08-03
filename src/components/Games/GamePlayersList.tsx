'use client';

import React from 'react';
import { Users, Target, Shield, Crown, Skull, Heart, Zap, User } from 'lucide-react';
import { Game } from '../../api/games';
import { getImageUrl } from '../../utils/imageUtils';
import SafeImage from '../UI/SafeImage';

interface GamePlayersListProps {
  game: Game;
}

export default function GamePlayersList({ game }: GamePlayersListProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'MAFIA':
        return <Skull className="w-4 h-4 text-red-400" />;
      case 'CITIZEN':
        return <Heart className="w-4 h-4 text-blue-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'MAFIA':
        return 'Мафия';
      case 'CITIZEN':
        return 'Горожанин';
      default:
        return role;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ALIVE':
        return <Heart className="w-3 h-3 text-green-400" />;
      case 'DEAD':
        return <Skull className="w-3 h-3 text-red-400" />;
      case 'KICKED':
        return <Zap className="w-3 h-3 text-yellow-400" />;
      default:
        return <User className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusTextPlayer = (status?: string) => {
    switch (status) {
      case 'ALIVE':
        return 'Жив';
      case 'DEAD':
        return 'Мертв';
      case 'KICKED':
        return 'Исключен';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-[#8469EF]" />
        Игроки ({game.players.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {game.players.map((player) => (
          <div key={player.id} className="bg-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {player.player?.avatar && getImageUrl(player.player.avatar, 'avatar') ? (
                  <SafeImage 
                    src={getImageUrl(player.player.avatar, 'avatar')} 
                    alt="Avatar" 
                    width={40} 
                    height={40} 
                    className="rounded-full object-cover" 
                    fallbackText={(player.player?.nickname || player.player?.email)?.charAt(0)?.toUpperCase() || 'U'}
                  />
                ) : (
                  (player.player?.nickname || player.player?.email)?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {player.player?.nickname || player.player?.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {getRoleIcon(player.role)}
                  <span>{getRoleText(player.role)}</span>
                  {getStatusIcon(player.status)}
                  <span>{getStatusTextPlayer(player.status)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <Target className="w-3 h-3" />
                <span>Убийства: {player.kills}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Skull className="w-3 h-3" />
                <span>Смерти: {player.deaths}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Shield className="w-3 h-3" />
                <span>Очки: {player.points}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Crown className="w-3 h-3" />
                <span>Игр: {player.gamesPlayed || 0}</span>
              </div>
            </div>
            
            {player.notes && (
              <div className="mt-3 pt-3 border-t border-[#404040]/30">
                <div className="text-xs text-gray-400">
                  <strong>Заметки:</strong> {player.notes}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 