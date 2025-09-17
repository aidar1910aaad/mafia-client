'use client';

import React, { useState } from 'react';
import { X, Save, Trophy, FileText } from 'lucide-react';

interface EditTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: {
    id: number;
    name: string;
    description: string;
  };
  onSave: (tournamentId: string, tournamentData: { name: string; description: string }) => Promise<void>;
}

export default function EditTournamentModal({ isOpen, onClose, tournament, onSave }: EditTournamentModalProps) {
  const [formData, setFormData] = useState({
    name: tournament.name,
    description: tournament.description,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(tournament.id.toString(), formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1D1D1D] rounded-xl border border-[#353535] w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#353535]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8469EF] rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Редактировать турнир</h2>
              <p className="text-gray-400 text-sm">Изменить данные турнира</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              <Trophy className="w-4 h-4 inline mr-2" />
              Название турнира
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8469EF] transition-colors"
              placeholder="Введите название турнира"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8469EF] transition-colors resize-none"
              placeholder="Введите описание турнира"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#2A2A2A] border border-[#404040] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#8469EF] hover:bg-[#6B4FFF] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Сохранить
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}