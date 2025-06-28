'use client';

import { useState } from 'react';
import { Club } from '../../api/clubs';
import { clubsAPI } from '../../api/clubs';

interface JoinClubButtonProps {
  club: Club;
  currentUser: any;
  onSuccess?: () => void;
}

export default function JoinClubButton({ club, currentUser, onSuccess }: JoinClubButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Проверяем, может ли пользователь вступить в клуб
  const canJoin = currentUser && currentUser.role !== 'club_owner' && currentUser.role !== 'admin';
  
  // Проверяем, не является ли пользователь уже участником
  const isAlreadyMember = club.members.some(member => member.id === currentUser?.id) ||
                         club.administrators.some(admin => admin.id === currentUser?.id) ||
                         club.owner.id === currentUser?.id;

  const handleJoinClub = async () => {
    if (!message.trim()) {
      setError('Пожалуйста, напишите сообщение');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await clubsAPI.joinClub(club.id, { message: message.trim() });
      
      setShowModal(false);
      setMessage('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании заявки');
    } finally {
      setLoading(false);
    }
  };

  if (!canJoin || isAlreadyMember) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Вступить в клуб
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1D1D1D] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-4">Заявка на вступление в клуб</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Сообщение владельцу клуба
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Расскажите, почему хотите вступить в клуб..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-900/50 border border-red-700 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setMessage('');
                  setError(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={loading}
              >
                Отмена
              </button>
              <button
                onClick={handleJoinClub}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 