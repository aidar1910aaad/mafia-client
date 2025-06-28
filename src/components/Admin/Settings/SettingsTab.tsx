'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, Settings, Shield } from 'lucide-react';
import { adminAPI } from '../../../api/admin';

interface SettingsTabProps {
  message: { text: string; type: 'success' | 'error' } | null;
  setMessage: (message: { text: string; type: 'success' | 'error' } | null) => void;
}

export default function SettingsTab({ message, setMessage }: SettingsTabProps) {
  const [resetModal, setResetModal] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetSystem = async () => {
    if (resetConfirmation !== 'Сбросить') {
      setMessage({ text: 'Пожалуйста, введите "Сбросить" для подтверждения', type: 'error' });
      return;
    }

    try {
      setResetLoading(true);
      await adminAPI.resetSystem();
      
      setMessage({ text: 'Система успешно сброшена', type: 'success' });
      setResetModal(false);
      setResetConfirmation('');
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Ошибка при сбросе системы', 
        type: 'error' 
      });
    } finally {
      setResetLoading(false);
    }
  };

  const openResetModal = () => {
    setResetModal(true);
    setResetConfirmation('');
  };

  const closeResetModal = () => {
    setResetModal(false);
    setResetConfirmation('');
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Основные настройки */}
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Основные настройки</h3>
              <p className="text-[#A1A1A1] text-sm">Конфигурация системы</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1D1D1D]/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Режим обслуживания</p>
                <p className="text-[#A1A1A1] text-sm">Временно отключить доступ пользователей</p>
              </div>
              <button className="bg-[#404040]/50 hover:bg-[#505050]/50 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Включить
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1D1D1D]/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Автоматическое резервное копирование</p>
                <p className="text-[#A1A1A1] text-sm">Ежедневное создание резервных копий</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Включено
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1D1D1D]/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Логирование действий</p>
                <p className="text-[#A1A1A1] text-sm">Запись всех административных действий</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Включено
              </button>
            </div>
          </div>
        </div>

        {/* Безопасность */}
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Безопасность</h3>
              <p className="text-[#A1A1A1] text-sm">Настройки безопасности системы</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1D1D1D]/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Двухфакторная аутентификация</p>
                <p className="text-[#A1A1A1] text-sm">Требовать 2FA для администраторов</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Включено
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1D1D1D]/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Ограничение попыток входа</p>
                <p className="text-[#A1A1A1] text-sm">Блокировка после 5 неудачных попыток</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Включено
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1D1D1D]/50 rounded-xl">
              <div>
                <p className="text-white font-medium">SSL сертификат</p>
                <p className="text-[#A1A1A1] text-sm">Шифрованное соединение</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Активен
              </button>
            </div>
          </div>
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
        
        <div className="bg-[#1D1D1D]/50 rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-white text-lg font-bold mb-2">Сброс системы</h4>
              <p className="text-[#A1A1A1] text-sm mb-3">
                Это действие удалит все данные системы: пользователей, клубы, игры, статистику и настройки. 
                Это действие <span className="text-red-400 font-bold">НЕОБРАТИМО</span>.
              </p>
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Рекомендуется создать резервную копию перед сбросом</span>
              </div>
            </div>
            <button 
              onClick={openResetModal}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ml-6"
            >
              <Trash2 className="w-5 h-5" />
              Сбросить систему
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения сброса */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Сброс системы</h3>
                <p className="text-[#A1A1A1] text-sm">Это действие нельзя отменить</p>
              </div>
            </div>
            
            <div className="bg-[#1D1D1D]/50 rounded-xl p-4 mb-6">
              <p className="text-white text-sm mb-3">
                Вы собираетесь сбросить всю систему. Это удалит:
              </p>
              <ul className="text-[#A1A1A1] text-sm space-y-1 mb-4">
                <li>• Всех пользователей и их данные</li>
                <li>• Все клубы и их настройки</li>
                <li>• Всю статистику и историю игр</li>
                <li>• Все системные настройки</li>
              </ul>
              <p className="text-red-400 text-sm font-bold">
                Это действие НЕОБРАТИМО!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Для подтверждения введите "Сбросить":
                </label>
                <input
                  type="text"
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  placeholder="Сбросить"
                  className="w-full bg-[#1D1D1D]/50 border border-[#404040]/50 rounded-xl px-4 py-3 text-white placeholder-[#A1A1A1] focus:outline-none focus:border-red-500/50 transition-colors"
                  disabled={resetLoading}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeResetModal}
                  className="flex-1 bg-[#404040]/50 hover:bg-[#505050]/50 text-white px-4 py-3 rounded-xl transition-colors"
                  disabled={resetLoading}
                >
                  Отмена
                </button>
                <button
                  onClick={handleResetSystem}
                  className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                    resetConfirmation === 'Сбросить' && !resetLoading
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                      : 'bg-[#404040]/50 text-[#A1A1A1] cursor-not-allowed'
                  }`}
                  disabled={resetConfirmation !== 'Сбросить' || resetLoading}
                >
                  {resetLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Сброс...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Сбросить систему
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