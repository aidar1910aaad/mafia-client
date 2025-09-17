'use client';

import { useState, useEffect } from 'react';
import { clubsAPI, Club } from '../../../api/clubs';
import { adminAPI } from '../../../api/admin';
import { Check, X, Eye, Trash2, RefreshCw, AlertTriangle, Edit } from 'lucide-react';
import AdminSearch from '../Common/AdminSearch';
import AdminPagination from '../Common/AdminPagination';
import AdminFilters, { FilterConfig } from '../Common/AdminFilters';
import AdminTable from '../Common/AdminTable';
import AnimatedTableRow from '../Common/AnimatedTableRow';
import EditClubModal from '../Common/EditClubModal';
import { useAdminTable } from '../../../hooks/useAdminTable';

interface ClubsTabProps {
  message: { text: string; type: 'success' | 'error' } | null;
  setMessage: (message: { text: string; type: 'success' | 'error' } | null) => void;
}

export default function ClubsTab({ message, setMessage }: ClubsTabProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; club: Club | null }>({ show: false, club: null });
  const [retryAttempts, setRetryAttempts] = useState<{ [clubId: string]: number }>({});
  const [totalClubs, setTotalClubs] = useState(0);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    state,
    updatePage,
    updateLimit,
    updateSearch,
    updateFilters,
    resetFilters
  } = useAdminTable({
    initialLimit: 20
  });

  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: 'APPROVED', label: 'Подтвержден' },
        { value: 'PENDING', label: 'Ожидает' },
        { value: 'REJECTED', label: 'Отклонен' }
      ]
    },
    {
      key: 'city',
      label: 'Город',
      type: 'select',
      options: [] // Will be populated dynamically
    },
    {
      key: 'createdAt',
      label: 'Дата создания',
      type: 'dateRange'
    }
  ];

  const fetchClubs = async () => {
    try {
      setClubsLoading(true);
      const clubsData = await clubsAPI.getClubs();
      setAllClubs(clubsData);
      
      // Get unique cities for filter
      const cities = [...new Set(clubsData.map(club => club.city))].map(city => ({
        value: city,
        label: city
      }));
      
      // Update city filter options
      const updatedFilterConfigs = filterConfigs.map(filter => 
        filter.key === 'city' ? { ...filter, options: cities } : filter
      );
      
      // Client-side filtering and pagination
      let filteredClubs = clubsData;
      
      // Apply search filter
      if (state.search) {
        filteredClubs = filteredClubs.filter(club => 
          club.name.toLowerCase().includes(state.search.toLowerCase()) ||
          club.city.toLowerCase().includes(state.search.toLowerCase()) ||
          club.description?.toLowerCase().includes(state.search.toLowerCase()) ||
          club.owner.nickname.toLowerCase().includes(state.search.toLowerCase())
        );
      }
      
      // Apply status filter
      if (state.filters.status) {
        filteredClubs = filteredClubs.filter(club => club.status === state.filters.status);
      }
      
      // Apply city filter
      if (state.filters.city) {
        filteredClubs = filteredClubs.filter(club => club.city === state.filters.city);
      }
      
      // Apply date range filter
      if (state.filters.createdAt_from) {
        const fromDate = new Date(state.filters.createdAt_from);
        filteredClubs = filteredClubs.filter(club => new Date(club.createdAt) >= fromDate);
      }
      
      if (state.filters.createdAt_to) {
        const toDate = new Date(state.filters.createdAt_to);
        toDate.setHours(23, 59, 59, 999);
        filteredClubs = filteredClubs.filter(club => new Date(club.createdAt) <= toDate);
      }
      
      setTotalClubs(filteredClubs.length);
      
      // Apply pagination
      const startIndex = (state.page - 1) * state.limit;
      const endIndex = startIndex + state.limit;
      const paginatedClubs = filteredClubs.slice(startIndex, endIndex);
      
      setClubs(paginatedClubs);
    } catch (error) {
      console.error('Error fetching clubs:', error);
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

  const handleDeleteClub = async (clubId: string, retryCount = 0) => {
    try {
      setActionLoading(`delete-${clubId}`);
      setRetryAttempts(prev => ({ ...prev, [clubId]: retryCount }));
      
      await adminAPI.deleteClub(clubId.toString());
      setMessage({ text: 'Клуб успешно удален', type: 'success' });
      setDeleteModal({ show: false, club: null });
      setRetryAttempts(prev => ({ ...prev, [clubId]: 0 }));
      // Обновляем список клубов
      await fetchClubs();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении клуба';
      
      // Если это 500 ошибка и мы еще не пробовали повторить
      if (errorMessage.includes('500') && retryCount < 2) {
        setMessage({ 
          text: `Попытка ${retryCount + 1}/3: ${errorMessage}. Повторяем через 2 секунды...`, 
          type: 'error' 
        });
        
        // Ждем 2 секунды перед повтором
        setTimeout(() => {
          handleDeleteClub(clubId, retryCount + 1);
        }, 2000);
        return;
      }
      
      setMessage({ 
        text: errorMessage, 
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
    setRetryAttempts(prev => ({ ...prev, [deleteModal.club?.id || '']: 0 }));
  };

  const handleEditClub = (club: Club) => {
    setEditingClub(club);
    setShowEditModal(true);
  };

  const handleSaveClub = async (clubId: string, clubData: { name: string; description: string; city: string }) => {
    try {
      await adminAPI.updateClub(clubId, clubData);
      // Обновляем локальное состояние
      setClubs(prev => prev.map(club => 
        club.id.toString() === clubId 
          ? { ...club, name: clubData.name, description: clubData.description, city: clubData.city }
          : club
      ));
      setShowEditModal(false);
      setEditingClub(null);
      setMessage({ text: '✅ Клуб успешно обновлен!', type: 'success' });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [state.page, state.limit, state.search, state.filters]);

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

      {/* Search */}
      <AdminSearch
        placeholder="Поиск по названию, городу, описанию или владельцу..."
        onSearch={updateSearch}
        className="max-w-md"
      />

      {/* Filters */}
      <AdminFilters
        filters={filterConfigs}
        onFiltersChange={updateFilters}
      />
      
      <AdminTable
        loading={clubsLoading}
        columns={7}
        rows={20}
        minHeight="800px"
      >
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
                clubs.map((club, index) => (
                  <AnimatedTableRow 
                    key={club.id} 
                    index={index}
                    className="border-b border-[#404040]/30 hover:bg-[#1D1D1D]/30 transition-all duration-200"
                  >
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
                          onClick={() => handleEditClub(club)}
                          className="text-[#A1A1A1] hover:text-green-400 transition-all duration-200 p-2 rounded-lg hover:bg-green-900/30 border border-transparent hover:border-green-500/50 hover:scale-105" 
                          title="Редактировать клуб"
                        >
                          <Edit className="w-4 h-4" />
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
                  </AnimatedTableRow>
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
      </AdminTable>

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
              {retryAttempts[deleteModal.club.id] > 0 && (
                <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-xs">
                    Попытка {retryAttempts[deleteModal.club.id]}/3
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-[#404040]/50 hover:bg-[#505050]/50 text-white px-4 py-2 rounded-xl transition-colors"
                disabled={actionLoading === `delete-${deleteModal.club.id}`}
              >
                Отмена
              </button>
              {retryAttempts[deleteModal.club.id] > 0 && retryAttempts[deleteModal.club.id] < 3 && (
                <button
                  onClick={() => handleDeleteClub(deleteModal.club!.id.toString(), retryAttempts[deleteModal.club.id])}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  disabled={actionLoading === `delete-${deleteModal.club.id}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Повторить
                </button>
              )}
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

      {/* Pagination */}
      <AdminPagination
        currentPage={state.page}
        totalPages={Math.ceil(totalClubs / state.limit)}
        onPageChange={updatePage}
        totalItems={totalClubs}
        itemsPerPage={state.limit}
      />

      {/* Edit Club Modal */}
      {editingClub && (
        <EditClubModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingClub(null);
          }}
          club={editingClub}
          onSave={handleSaveClub}
        />
      )}
    </div>
  );
}