'use client';

import { useState } from 'react';
import { AlertTriangle, Settings, RotateCcw } from 'lucide-react';
import { adminAPI } from '../../../api/admin';

interface SettingsTabProps {
  message: { text: string; type: 'success' | 'error' } | null;
  setMessage: (message: { text: string; type: 'success' | 'error' } | null) => void;
}

export default function SettingsTab({ message, setMessage }: SettingsTabProps) {
  const [eloResetModal, setEloResetModal] = useState(false);
  const [eloResetConfirmation, setEloResetConfirmation] = useState('');
  const [eloResetLoading, setEloResetLoading] = useState(false);

  const handleResetElo = async () => {
    if (eloResetConfirmation !== 'Сбросить ELO') {
      setMessage({ text: 'Пожалуйста, введите "Сбросить ELO" для подтверждения', type: 'error' });
      return;
    }

    try {
      setEloResetLoading(true);
      const result = await adminAPI.resetElo();
      
      // Показываем детальное сообщение об успехе
      const successMessage = result.affectedUsers 
        ? `✅ ELO успешно сброшен! Затронуто игроков: ${result.affectedUsers}. Все рейтинги установлены на 1000.`
        : `✅ ELO всех игроков успешно сброшен! Все рейтинги установлены на базовое значение 1000.`;
      
      setMessage({ text: successMessage, type: 'success' });
      setEloResetModal(false);
      setEloResetConfirmation('');
      
      // Дополнительное уведомление в консоль для отладки
      console.log('ELO Reset completed successfully:', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при сбросе ELO';
      setMessage({ 
        text: `❌ ${errorMessage}`, 
        type: 'error' 
      });
      console.error('ELO Reset failed:', error);
    } finally {
      setEloResetLoading(false);
    }
  };

  const openEloResetModal = () => {
    setEloResetModal(true);
    setEloResetConfirmation('');
  };

  const closeEloResetModal = () => {
    setEloResetModal(false);
    setEloResetConfirmation('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Настройки системы</h2>
          <p className="text-[#A1A1A1]">Управление системными настройками и конфигурацией</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
      </div>


      {/* Опасная зона */}
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xl font-bold">Опасная зона</h3>
            <p className="text-[#A1A1A1] text-sm">Действия, которые нельзя отменить</p>
          </div>
        </div>
        
        {/* Сброс ELO */}
        <div className="bg-[#1D1D1D]/50 rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-white text-lg font-bold mb-2">Сброс ELO всех игроков</h4>
              <p className="text-[#A1A1A1] text-sm mb-3">
                Сбросит рейтинг ELO всех игроков до базового значения (1000). 
                Это действие <span className="text-orange-400 font-bold">НЕОБРАТИМО</span>.
              </p>
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Все игроки получат одинаковый начальный рейтинг</span>
              </div>
            </div>
            <button 
              onClick={openEloResetModal}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ml-6"
            >
              <RotateCcw className="w-5 h-5" />
              Сбросить ELO
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения сброса ELO */}
      {eloResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-900/30 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Сброс ELO всех игроков</h3>
                <p className="text-[#A1A1A1] text-sm">Это действие нельзя отменить</p>
              </div>
            </div>
            
            <div className="bg-[#1D1D1D]/50 rounded-xl p-4 mb-6">
              <p className="text-white text-sm mb-3">
                Вы собираетесь сбросить рейтинг ELO всех игроков до базового значения (1000).
              </p>
              <ul className="text-[#A1A1A1] text-sm space-y-1 mb-4">
                <li>• Все игроки получат одинаковый рейтинг 1000</li>
                <li>• История игр и статистика сохранится</li>
                <li>• Текущие рейтинги будут потеряны</li>
                <li>• Это действие затронет всех активных игроков</li>
                <li>• После сброса вы получите уведомление об успешном выполнении</li>
              </ul>
              <p className="text-orange-400 text-sm font-bold">
                Это действие НЕОБРАТИМО!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Для подтверждения введите "Сбросить ELO":
                </label>
                <input
                  type="text"
                  value={eloResetConfirmation}
                  onChange={(e) => setEloResetConfirmation(e.target.value)}
                  placeholder="Сбросить ELO"
                  className="w-full bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-xl px-4 py-3 text-white placeholder-[#A1A1A1] focus:outline-none focus:border-orange-500/50 transition-colors"
                  disabled={eloResetLoading}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeEloResetModal}
                  className="flex-1 bg-[#404040]/50 hover:bg-[#505050]/50 text-white px-4 py-3 rounded-xl transition-colors"
                  disabled={eloResetLoading}
                >
                  Отмена
                </button>
                <button
                  onClick={handleResetElo}
                  className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                    eloResetConfirmation === 'Сбросить ELO' && !eloResetLoading
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                      : 'bg-[#404040]/50 text-[#A1A1A1] cursor-not-allowed'
                  }`}
                  disabled={eloResetConfirmation !== 'Сбросить ELO' || eloResetLoading}
                >
                  {eloResetLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Сброс ELO...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Сбросить ELO
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 