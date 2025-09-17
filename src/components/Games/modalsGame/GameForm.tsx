'use client';

import { Trophy } from 'lucide-react';
import { GameFormProps } from './types';
import PlayerSearch from './PlayerSearch';
import PlayerList from './PlayerList';
import ResultTable from './ResultTable';
import { GameResult } from '../../../api/games';

export default function GameForm({
  formData,
  setFormData,
  players,
  availableUsers,
  searchQuery,
  setSearchQuery,
  filteredUsers,
  playersCount,
  maxPlayers,
  onAddPlayer,
  onAddUnregisteredPlayer,
  onRemovePlayer,
  onUpdatePlayer,
  onAddResultRound,
  onUpdateResultRound,
  onRemoveResultRound,
  onSubmit,
  loading,
  error
}: GameFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Название игры *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Игра #1 - Мафия против Горожан"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Результат *
          </label>
          <select
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value as GameResult | '' })}
            className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Выберите результат</option>
            <option value={GameResult.MAFIA_WIN}>Победа мафии</option>
            <option value={GameResult.CITIZEN_WIN}>Победа горожан</option>
            <option value={GameResult.DRAW}>Ничья</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Описание
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Описание игры..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Дата проведения
        </label>
        <input
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          className="w-full bg-[#2A2A2A] border border-[#404040]/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Поиск игроков */}
      <PlayerSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredUsers={filteredUsers}
        playersCount={playersCount}
        maxPlayers={maxPlayers}
        onAddPlayer={onAddPlayer}
        onAddUnregisteredPlayer={onAddUnregisteredPlayer}
      />

      {/* Список игроков */}
      <PlayerList
        players={players}
        availableUsers={availableUsers}
        playersCount={playersCount}
        maxPlayers={maxPlayers}
        onRemovePlayer={onRemovePlayer}
        onUpdatePlayer={onUpdatePlayer}
      />

      {/* Таблица результатов */}
      <ResultTable
        resultTable={formData.resultTable}
        onAddRound={onAddResultRound}
        onUpdateRound={onUpdateResultRound}
        onRemoveRound={onRemoveResultRound}
      />

      {/* Кнопки */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#404040]/50">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Trophy className="w-4 h-4" />
          )}
          Создать игру
        </button>
      </div>
    </form>
  );
} 