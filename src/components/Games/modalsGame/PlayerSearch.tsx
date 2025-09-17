'use client';

import React from 'react';
import { Search, Plus, User } from 'lucide-react';
import { PlayerSearchProps } from './types';

export default function PlayerSearch({
  searchQuery,
  setSearchQuery,
  filteredUsers,
  playersCount,
  maxPlayers,
  onAddPlayer,
  onAddUnregisteredPlayer
}: PlayerSearchProps) {
  const handleAddUnregisteredPlayer = () => {
    if (searchQuery.trim() && playersCount < maxPlayers) {
      onAddUnregisteredPlayer(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const canAddMore = playersCount < maxPlayers;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Поиск игроков
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Поиск по email или никнейму..."
          />
        </div>
      </div>

      {/* Результаты поиска */}
      {searchQuery && (
        <div className="bg-[#2A2A2A] border border-[#404040]/50 rounded-lg p-4">
          <h4 className="text-white text-sm font-medium mb-3">
            Результаты поиска ({filteredUsers.length})
          </h4>
          
          {filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg border border-[#404040]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8469EF] flex items-center justify-center text-white text-sm font-bold">
                      {user.nickname?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.nickname || 'Без имени'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {user.email}
                      </div>
                      {user.role && (
                        <div className="text-xs text-gray-500">
                          Роль: {user.role}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onAddPlayer(user)}
                    disabled={!canAddMore}
                    className="px-3 py-1 bg-[#8469EF] text-white text-sm rounded-lg hover:bg-[#6B4FFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Добавить
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm text-center py-4">
              Игроки не найдены
            </div>
          )}
        </div>
      )}

      {/* Добавление незарегистрированного игрока */}
      {searchQuery && filteredUsers.length === 0 && canAddMore && (
        <div className="bg-[#2A2A2A] border border-[#404040]/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white font-medium">
                  Добавить незарегистрированного игрока
                </div>
                <div className="text-gray-400 text-sm">
                  "{searchQuery}"
                </div>
              </div>
            </div>
            <button
              onClick={handleAddUnregisteredPlayer}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Добавить
            </button>
          </div>
        </div>
      )}

      {/* Информация о лимите игроков */}
      <div className="text-xs text-gray-400 text-center">
        Игроков: {playersCount}/{maxPlayers}
        {!canAddMore && (
          <span className="text-yellow-400 ml-2">(достигнут лимит)</span>
        )}
      </div>
    </div>
  );
}