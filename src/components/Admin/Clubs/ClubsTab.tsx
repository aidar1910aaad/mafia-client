'use client';

import { useState, useEffect } from 'react';
import { clubsAPI, Club } from '../../../api/clubs';
import { adminAPI } from '../../../api/admin';
import { Check, X, Eye, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';

interface ClubsTabProps {
  message: { text: string; type: 'success' | 'error' } | null;
  setMessage: (message: { text: string; type: 'success' | 'error' } | null) => void;
}

export default function ClubsTab({ message, setMessage }: ClubsTabProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; club: Club | null }>({ show: false, club: null });

  const fetchClubs = async () => {
    try {
      setClubsLoading(true);
      const clubsData = await clubsAPI.getClubs();
      setClubs(clubsData);
    } catch (error) {
      // Error fetching clubs
    } finally {
      setClubsLoading(false);
    }
  };

  const handleApproveClub = async (clubId: string) => {
    try {
      setActionLoading(`approve-${clubId}`);
      await adminAPI.approveClub(clubId.toString());
      setMessage({ text: 'Клуб успешно одобрен', type: 'success' });
      // Обновляем список клубов
      await fetchClubs();
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Ошибка при одобрении клуба', 
        type: 'error' 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClub = async (clubId: string) => {
    try {
      setActionLoading(`reject-${clubId}`);
      await adminAPI.rejectClub(clubId.toString());
      setMessage({ text: 'Клуб отклонен', type: 'success' });
      // Обновляем список клубов
      await fetchClubs();
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Ошибка при отклонении клуба', 
        type: 'error' 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    try {
      setActionLoading(`delete-${clubId}`);
      await adminAPI.deleteClub(clubId.toString());
      setMessage({ text: 'Клуб успешно удален', type: 'success' });
      setDeleteModal({ show: false, club: null });
      // Обновляем список клубов
      await fetchClubs();
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Ошибка при удалении клуба', 
        type: 'error' 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteModal = (club: Club) => {
    setDeleteModal({ show: true, club });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, club: null });
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Управление клубами</h2>
          <p className="text-[#A1A1A1]">Управляйте всеми клубами системы</p>
        </div>
        <button 
          onClick={fetchClubs}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Обновить
        </button>
      </div>
      
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl overflow-hidden shadow-xl">
        {clubsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <div className="text-white text-lg">Загрузка клубов...</div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#404040]/50">
                <tr>
                  <th className="text-left p-6 text-white font-semibold">ID</th>
                  <th className="text-left p-6 text-white font-semibold">Название</th>
                  <th className="text-left p-6 text-white font-semibold">Город</th>
                  <th className="text-left p-6 text-white font-semibold">Владелец</th>
                  <th className="text-left p-6 text-white font-semibold">Статус</th>
                  <th className="text-left p-6 text-white font-semibold">Дата создания</th>
                  <th className="text-left p-6 text-white font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {clubs.length > 0 ? (
                  clubs.map((club) => (
                    <tr key={club.id} className="border-b border-[#404040]/30 hover:bg-[#1D1D1D]/30 transition-colors">
                      <td className="p-6 text-[#A1A1A1] font-mono">#{club.id}</td>
                      <td className="p-6 text-white font-medium">{club.name}</td>
                      <td className="p-6 text-[#A1A1A1]">{club.city}</td>
                      <td className="p-6 text-[#A1A1A1]">{club.owner.nickname}</td>
                      <td className="p-6">
                        {club.status === 'APPROVED' && (
                          <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                            Подтвержден
                          </span>
                        )}
                        {club.status === 'PENDING' && (
                          <span className="bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                            Ожидает
                          </span>
                        )}
                        {club.status === 'REJECTED' && (
                          <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                            Отклонен
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-[#A1A1A1] text-sm">
                        {new Date(club.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          {club.status === 'PENDING' && (
                            <>
                              <button 
                                className={`transition-all duration-200 p-2 rounded-lg hover:bg-green-900/30 border border-transparent hover:border-green-500/50 ${
                                  actionLoading === `approve-${club.id}` 
                                    ? 'text-green-400 cursor-not-allowed bg-green-900/20' 
                                    : 'text-[#A1A1A1] hover:text-green-400 hover:scale-105'
                                }`} 
                                title="Подтвердить клуб" 
                                onClick={() => handleApproveClub(club.id.toString())}
                                disabled={actionLoading === `approve-${club.id}`}
                              >
                                {actionLoading === `approve-${club.id}` ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button 
                                className={`transition-all duration-200 p-2 rounded-lg hover:bg-red-900/30 border border-transparent hover:border-red-500/50 ${
                                  actionLoading === `reject-${club.id}` 
                                    ? 'text-red-400 cursor-not-allowed bg-red-900/20' 
                                    : 'text-[#A1A1A1] hover:text-red-400 hover:scale-105'
                                }`} 
                                title="Отклонить клуб" 
                                onClick={() => handleRejectClub(club.id.toString())}
                                disabled={actionLoading === `reject-${club.id}`}
                              >
                                {actionLoading === `reject-${club.id}` ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          <button className="text-[#A1A1A1] hover:text-blue-400 transition-all duration-200 p-2 rounded-lg hover:bg-blue-900/30 border border-transparent hover:border-blue-500/50 hover:scale-105" title="Просмотреть клуб">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className={`transition-all duration-200 p-2 rounded-lg hover:bg-red-900/30 border border-transparent hover:border-red-500/50 ${
                              actionLoading === `delete-${club.id}` 
                                ? 'text-red-400 cursor-not-allowed bg-red-900/20' 
                                : 'text-[#A1A1A1] hover:text-red-400 hover:scale-105'
                            }`} 
                            title="Удалить клуб" 
                            onClick={() => openDeleteModal(club)}
                            disabled={actionLoading === `delete-${club.id}`}
                          >
                            {actionLoading === `delete-${club.id}` ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[#A1A1A1]">
                      Клубы не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {deleteModal.show && deleteModal.club && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Удалить клуб</h3>
                <p className="text-[#A1A1A1] text-sm">Это действие нельзя отменить</p>
              </div>
            </div>
            
            <div className="bg-[#1D1D1D]/50 rounded-xl p-4 mb-6">
              <p className="text-white text-sm mb-2">
                Вы действительно хотите удалить клуб <span className="font-bold text-red-400">"{deleteModal.club.name}"</span>?
              </p>
              <p className="text-[#A1A1A1] text-xs">
                Город: {deleteModal.club.city} | Владелец: {deleteModal.club.owner.nickname}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-[#404040]/50 hover:bg-[#505050]/50 text-white px-4 py-2 rounded-xl transition-colors"
                disabled={actionLoading === `delete-${deleteModal.club.id}`}
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteClub(deleteModal.club!.id.toString())}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                disabled={actionLoading === `delete-${deleteModal.club.id}`}
              >
                {actionLoading === `delete-${deleteModal.club.id}` ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Удаление...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Удалить
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}