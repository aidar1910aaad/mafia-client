'use client';

import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isLoading?: boolean;
}

export default function DeleteUserModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName, 
  isLoading = false 
}: DeleteUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1D1D1D] border border-[#404040] rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#404040]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Удаление пользователя</h3>
              <p className="text-[#A1A1A1] text-sm">Это действие нельзя отменить</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-[#A1A1A1] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#404040]/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-[#A1A1A1] text-sm leading-relaxed">
              Вы уверены, что хотите удалить пользователя{' '}
              <span className="text-white font-medium">"{userName}"</span>?
            </p>
            <p className="text-[#A1A1A1] text-sm mt-2">
              Все данные пользователя будут безвозвратно удалены из системы.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-medium mb-1">Внимание!</p>
                <p className="text-red-300 text-xs">
                  Это действие нельзя отменить. Все игры, статистика и связанные данные пользователя будут удалены навсегда.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-[#404040]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-[#404040] hover:bg-[#505050] text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Удаление...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Удалить пользователя
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}