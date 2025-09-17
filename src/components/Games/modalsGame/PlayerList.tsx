'use client';

import React from 'react';
import { X, User, Edit2 } from 'lucide-react';
import { PlayerListProps } from './types';

export default function PlayerList({
  players,
  availableUsers,
  playersCount,
  maxPlayers,
  onRemovePlayer,
  onUpdatePlayer
}: PlayerListProps) {
  const getPlayerInfo = (playerId: number) => {
    return availableUsers.find(user => user.id === playerId);
  };

  const canRemovePlayers = playersCount > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white text-sm font-medium">
          Участники игры ({playersCount}/{maxPlayers})
        </h4>
        {canRemovePlayers && (
          <div className="text-xs text-gray-400">
            Нажмите ✕ для удаления
          </div>
        )}
      </div>

      {players.length > 0 ? (
        <div className="space-y-2">
          {players.map((player, index) => {
            const playerInfo = getPlayerInfo(player.playerId);
            
            return (
              <div
                key={`${player.playerId}-${index}`}
                className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg border border-[#404040]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8469EF] flex items-center justify-center text-white text-sm font-bold">
                    {playerInfo ? (
                      playerInfo.nickname?.charAt(0) || playerInfo.email?.charAt(0) || '?'
                    ) : (
                      '?'
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {playerInfo ? (
                        playerInfo.nickname || 'Без имени'
                      ) : (
                        'Неизвестный игрок'
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {playerInfo ? playerInfo.email : `ID: ${player.playerId}`}
                    </div>
                    {playerInfo?.role && (
                      <div className="text-xs text-gray-500">
                        Роль: {playerInfo.role}
                      </div>
                    )}
                    {playerInfo?.isUnregistered && (
                      <div className="text-xs text-yellow-400">
                        Незарегистрированный
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdatePlayer(player.playerId, 'playerId', player.playerId)}
                    className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded"
                    title="Редактировать"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemovePlayer(player.playerId)}
                    className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                    title="Удалить игрока"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400 text-sm text-center py-8 bg-[#2A2A2A] rounded-lg border border-[#404040]/30">
          <User className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <div>Пока нет участников</div>
          <div className="text-xs mt-1">Используйте поиск выше для добавления игроков</div>
        </div>
      )}

      {/* Информация о лимите */}
      {playersCount >= maxPlayers && (
        <div className="text-xs text-yellow-400 text-center bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-2">
          ⚠️ Достигнут максимальный лимит игроков ({maxPlayers})
        </div>
      )}
    </div>
  );
}