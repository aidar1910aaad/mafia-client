'use client';

import { X } from 'lucide-react';
import { CreateGameModalProps } from './types';
import { useCreateGameModal } from './useCreateGameModal';
import GameForm from './GameForm';

export default function CreateGameModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  clubId, 
  seasonId, 
  tournamentId 
}: CreateGameModalProps) {
  const {
    formData,
    setFormData,
    players,
    availableUsers,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    loading,
    error,
    playersCount,
    maxPlayers,
    addPlayer,
    addUnregisteredPlayer,
    removePlayer,
    updatePlayer,
    addResultRound,
    updateResultRound,
    removeResultRound,
    handleSubmit
  } = useCreateGameModal(isOpen, clubId, onSuccess, onClose, seasonId, tournamentId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1D1D1D] border border-[#404040]/50 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">Создать игру</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <GameForm
          formData={formData}
          setFormData={setFormData}
          players={players}
          availableUsers={availableUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredUsers={filteredUsers}
          playersCount={playersCount}
          maxPlayers={maxPlayers}
          onAddPlayer={addPlayer}
          onAddUnregisteredPlayer={addUnregisteredPlayer}
          onRemovePlayer={removePlayer}
          onUpdatePlayer={updatePlayer}
          onAddResultRound={addResultRound}
          onUpdateResultRound={updateResultRound}
          onRemoveResultRound={removeResultRound}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {/* Кнопка отмены */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#404040]/50 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
} 