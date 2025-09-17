'use client';
import React, { useState } from 'react';
import { Tournament } from '../../api/tournaments';
import { gamesAPI, GenerateFinalGamesRequest } from '../../api/games';

interface GenerateFinalGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: Tournament;
  onGamesGenerated: () => void;
}

export default function GenerateFinalGamesModal({ 
  isOpen, 
  onClose, 
  tournament, 
  onGamesGenerated 
}: GenerateFinalGamesModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tablesCount: 1,
    playersPerGame: 10,
    roundsCount: 1,
    totalGames: 1
  });

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tournament) return;

    try {
      setIsLoading(true);
      
      const requestData: GenerateFinalGamesRequest = {
        tournamentId: tournament.id,
        tablesCount: formData.tablesCount,
        playersPerGame: formData.playersPerGame,
        roundsCount: formData.roundsCount,
        totalGames: formData.totalGames
      };

      console.log('Генерируем финальные игры с параметрами:', requestData);
      
      const generatedGames = await gamesAPI.generateFinalGames(requestData);
      
      console.log('Сгенерированы финальные игры:', generatedGames);
      
      alert(`Успешно сгенерировано ${generatedGames.length} финальных игр!`);
      
      onGamesGenerated();
      onClose();
      
    } catch (error) {
      console.error('Ошибка генерации финальных игр:', error);
      alert(`Ошибка генерации финальных игр: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Генерация финальных игр
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
          <div className="text-blue-400 text-sm font-medium mb-1">Турнир</div>
          <div className="text-blue-300 text-sm">{tournament.name}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Количество столов
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.tablesCount}
              onChange={(e) => handleInputChange('tablesCount', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-[#2C2C2C] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F633FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Игроков за столом
            </label>
            <input
              type="number"
              min="6"
              max="15"
              value={formData.playersPerGame}
              onChange={(e) => handleInputChange('playersPerGame', parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2 bg-[#2C2C2C] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F633FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Количество раундов
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.roundsCount}
              onChange={(e) => handleInputChange('roundsCount', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-[#2C2C2C] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F633FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Общее количество игр
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.totalGames}
              onChange={(e) => handleInputChange('totalGames', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-[#2C2C2C] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F633FF]"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#F633FF] hover:bg-[#E02EE5] disabled:bg-[#F633FF]/50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Генерация...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Сгенерировать
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
          <div className="text-yellow-400 text-sm font-medium mb-1">⚠️ Внимание</div>
          <div className="text-yellow-300 text-xs">
            Финальные игры будут созданы для участников турнира. Убедитесь, что все параметры корректны.
          </div>
        </div>
      </div>
    </div>
  );
}