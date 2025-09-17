'use client';

import { useState, useEffect } from 'react';
import { tournamentsAPI, Tournament } from '../../../api/tournaments';
import { Check, X, Eye, Trash2, RefreshCw, AlertTriangle, Trophy, Calendar, Users, Edit } from 'lucide-react';
import AdminSearch from '../Common/AdminSearch';
import AdminPagination from '../Common/AdminPagination';
import AdminFilters, { FilterConfig } from '../Common/AdminFilters';
import AdminTable from '../Common/AdminTable';
import AnimatedTableRow from '../Common/AnimatedTableRow';
import CreateTournamentModal from './CreateTournamentModal';
import EditTournamentModal from '../Common/EditTournamentModal';
import { useAdminTable } from '../../../hooks/useAdminTable';
import { adminAPI } from '../../../api/admin';

interface TournamentsTabProps {
  message: { text: string; type: 'success' | 'error' } | null;
  setMessage: (message: { text: string; type: 'success' | 'error' } | null) => void;
}

export default function TournamentsTab({ message, setMessage }: TournamentsTabProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; tournament: Tournament | null }>({ show: false, tournament: null });
  const [retryAttempts, setRetryAttempts] = useState<{ [tournamentId: string]: number }>({});
  const [totalTournaments, setTotalTournaments] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
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
        { value: 'ACTIVE', label: 'Активен' },
        { value: 'COMPLETED', label: 'Завершен' },
        { value: 'CANCELLED', label: 'Отменен' },
        { value: 'UPCOMING', label: 'Предстоящий' }
      ]
    },
    {
      key: 'type',
      label: 'Тип',
      type: 'select',
      options: [
        { value: 'DEFAULT', label: 'Обычный' },
        { value: 'ELO', label: 'ELO' }
      ]
    },
    {
      key: 'date',
      label: 'Дата проведения',
      type: 'dateRange'
    }
  ];

  const fetchTournaments = async () => {
    try {
      setTournamentsLoading(true);
      
      // Use server-side pagination with API limit of 100
      const tournamentsData = await tournamentsAPI.getAllTournaments({ 
        page: state.page,
        limit: Math.min(state.limit, 100), // Respect API limit
        search: state.search || undefined,
        status: state.filters.status || undefined,
        typeFilter: state.filters.type || undefined,
        dateFilter: state.filters.date_from && state.filters.date_to ? 
          `${state.filters.date_from},${state.filters.date_to}` : undefined
      });
      
      setTournaments(tournamentsData.tournaments);
      setTotalTournaments(tournamentsData.total || tournamentsData.tournaments.length);
      
      // Store all tournaments for client-side operations if needed
      setAllTournaments(tournamentsData.tournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setTournamentsLoading(false);
    }
  };

  const handleDeleteTournament = async (tournamentId: number, retryCount = 0) => {
    try {
      setActionLoading(`delete-${tournamentId}`);
      setRetryAttempts(prev => ({ ...prev, [tournamentId]: retryCount }));
      
      await tournamentsAPI.deleteTournament(tournamentId);
      
      const successMessage = `✅ Турнир успешно удален!`;
      setMessage({ text: successMessage, type: 'success' });
      setDeleteModal({ show: false, tournament: null });
      setRetryAttempts(prev => ({ ...prev, [tournamentId]: 0 }));
      
      // Обновляем список турниров
      await fetchTournaments();
      
      // Дополнительное уведомление в консоль для отладки
      console.log('Tournament deleted successfully:', tournamentId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении турнира';
      
      // Если это 500 ошибка и мы еще не пробовали повторить
      if (errorMessage.includes('500') && retryCount < 2) {
        setMessage({ 
          text: `⚠️ Попытка ${retryCount + 1}/3: Сервер временно недоступен. Повторяем через 2 секунды...`, 
          type: 'error' 
        });
        
        // Ждем 2 секунды перед повтором
        setTimeout(() => {
          handleDeleteTournament(tournamentId, retryCount + 1);
        }, 2000);
        return;
      }
      
      // Если это 403 ошибка - недостаточно прав
      if (errorMessage.includes('403') || errorMessage.includes('Недостаточно прав')) {
        setMessage({ 
          text: `🚫 Недостаточно прав для удаления турнира. Обратитесь к администратору.`, 
          type: 'error' 
        });
      } else if (errorMessage.includes('404') || errorMessage.includes('не найден')) {
        setMessage({ 
          text: `❓ Турнир не найден. Возможно, он уже был удален.`, 
          type: 'error' 
        });
      } else if (errorMessage.includes('401') || errorMessage.includes('Сессия истекла')) {
        setMessage({ 
          text: `🔐 Сессия истекла. Пожалуйста, войдите в систему заново.`, 
          type: 'error' 
        });
      } else {
        setMessage({ 
          text: `❌ ${errorMessage}`, 
          type: 'error' 
        });
      }
      
      console.error('Tournament deletion failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteModal = (tournament: Tournament) => {
    setDeleteModal({ show: true, tournament });
  };

  const closeDeleteModal = () => {
    const tournamentId = deleteModal.tournament?.id;
    setDeleteModal({ show: false, tournament: null });
    if (tournamentId) {
      setRetryAttempts(prev => ({ ...prev, [tournamentId]: 0 }));
    }
    setActionLoading(null);
  };

  const handleCreateSuccess = () => {
    setMessage({ text: '✅ Турнир успешно создан!', type: 'success' });
    fetchTournaments(); // Обновляем список турниров
  };

  const handleCreateError = (errorMessage: string) => {
    setMessage({ text: `❌ ${errorMessage}`, type: 'error' });
  };

  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setShowEditModal(true);
  };

  const handleSaveTournament = async (tournamentId: string, tournamentData: { name: string; description: string }) => {
    try {
      await adminAPI.updateTournament(tournamentId, tournamentData);
      // Обновляем локальное состояние
      setTournaments(prev => prev.map(tournament => 
        tournament.id.toString() === tournamentId 
          ? { ...tournament, name: tournamentData.name, description: tournamentData.description }
          : tournament
      ));
      setShowEditModal(false);
      setEditingTournament(null);
      setMessage({ text: '✅ Турнир успешно обновлен!', type: 'success' });
    } catch (error) {
      throw error;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">Активен</span>;
      case 'COMPLETED':
        return <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Завершен</span>;
      case 'CANCELLED':
        return <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm font-medium">Отменен</span>;
      case 'UPCOMING':
        return <span className="bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">Предстоящий</span>;
      default:
        return <span className="bg-gray-900/30 text-gray-400 px-3 py-1 rounded-full text-sm font-medium">Неизвестно</span>;
    }
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'ELO':
        return <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded text-xs font-medium">ELO</span>;
      case 'DEFAULT':
        return <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-medium">Обычный</span>;
      default:
        return <span className="bg-gray-900/30 text-gray-400 px-2 py-1 rounded text-xs font-medium">-</span>;
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [state.page, state.limit, state.search, state.filters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">Управление турнирами</h2>
          <p className="text-[#A1A1A1]">Управляйте всеми турнирами системы</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Создать турнир
          </button>
          <button 
            onClick={fetchTournaments}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Обновить
          </button>
        </div>
      </div>

      {/* Search */}
      <AdminSearch
        placeholder="Поиск по названию, описанию, клубу или судье..."
        onSearch={updateSearch}
        className="max-w-md"
      />

      {/* Filters */}
      <AdminFilters
        filters={filterConfigs}
        onFiltersChange={updateFilters}
      />
      
      <AdminTable
        loading={tournamentsLoading}
        columns={8}
        rows={20}
        minHeight="800px"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#404040]/50">
              <tr>
                <th className="text-left p-6 text-white font-semibold">ID</th>
                <th className="text-left p-6 text-white font-semibold">Название</th>
                <th className="text-left p-6 text-white font-semibold">Клуб</th>
                <th className="text-left p-6 text-white font-semibold">Судья</th>
                <th className="text-left p-6 text-white font-semibold">Дата</th>
                <th className="text-left p-6 text-white font-semibold">Тип</th>
                <th className="text-left p-6 text-white font-semibold">Статус</th>
                <th className="text-left p-6 text-white font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.length > 0 ? (
                tournaments.map((tournament, index) => (
                  <AnimatedTableRow 
                    key={tournament.id} 
                    index={index}
                    className="border-b border-[#404040]/30 hover:bg-[#1D1D1D]/30 transition-all duration-200"
                  >
                    <td className="p-6 text-[#A1A1A1] font-mono">#{tournament.id}</td>
                    <td className="p-6 text-white font-medium">{tournament.name}</td>
                    <td className="p-6 text-[#A1A1A1]">{tournament.clubName || 'Не указан'}</td>
                    <td className="p-6 text-[#A1A1A1]">{tournament.refereeName || 'Не указан'}</td>
                    <td className="p-6 text-[#A1A1A1] text-sm">
                      {tournament.date ? new Date(tournament.date).toLocaleDateString('ru-RU') : '-'}
                    </td>
                    <td className="p-6">{getTypeBadge(tournament.type)}</td>
                    <td className="p-6">{getStatusBadge(tournament.status)}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button className="text-[#A1A1A1] hover:text-blue-400 transition-all duration-200 p-2 rounded-lg hover:bg-blue-900/30 border border-transparent hover:border-blue-500/50 hover:scale-105" title="Просмотреть турнир">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditTournament(tournament)}
                          className="text-[#A1A1A1] hover:text-green-400 transition-all duration-200 p-2 rounded-lg hover:bg-green-900/30 border border-transparent hover:border-green-500/50 hover:scale-105" 
                          title="Редактировать турнир"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className={`transition-all duration-200 p-2 rounded-lg hover:bg-red-900/30 border border-transparent hover:border-red-500/50 ${
                            actionLoading === `delete-${tournament.id}` 
                              ? 'text-red-400 cursor-not-allowed bg-red-900/20' 
                              : 'text-[#A1A1A1] hover:text-red-400 hover:scale-105'
                          }`} 
                          title="Удалить турнир" 
                          onClick={() => openDeleteModal(tournament)}
                          disabled={actionLoading === `delete-${tournament.id}`}
                        >
                          {actionLoading === `delete-${tournament.id}` ? (
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
                  <td colSpan={8} className="p-6 text-center text-[#A1A1A1]">
                    Турниры не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminTable>

      {/* Модальное окно подтверждения удаления */}
      {deleteModal.show && deleteModal.tournament && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Удалить турнир</h3>
                <p className="text-[#A1A1A1] text-sm">Это действие нельзя отменить</p>
              </div>
            </div>
            
            <div className="bg-[#1D1D1D]/50 rounded-xl p-4 mb-6">
              <p className="text-white text-sm mb-2">
                Вы действительно хотите удалить турнир <span className="font-bold text-red-400">"{deleteModal.tournament.name}"</span>?
              </p>
              <div className="text-[#A1A1A1] text-xs space-y-1">
                <p>Клуб: {deleteModal.tournament.clubName || 'Не указан'}</p>
                <p>Судья: {deleteModal.tournament.refereeName || 'Не указан'}</p>
                <p>Дата: {deleteModal.tournament.date ? new Date(deleteModal.tournament.date).toLocaleDateString('ru-RU') : 'Не указана'}</p>
                <p>Тип: {deleteModal.tournament.type || 'Не указан'}</p>
              </div>
              {retryAttempts[deleteModal.tournament.id] > 0 && (
                <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
                    <p className="text-yellow-400 text-xs font-medium">
                      Попытка {retryAttempts[deleteModal.tournament.id]}/3
                    </p>
                  </div>
                  <p className="text-yellow-300 text-xs mt-1">
                    Сервер временно недоступен. Повторяем автоматически...
                  </p>
      </div>
              )}
          </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-[#404040]/50 hover:bg-[#505050]/50 text-white px-4 py-2 rounded-xl transition-colors"
                disabled={actionLoading === `delete-${deleteModal.tournament.id}`}
              >
                Отмена
              </button>
              {retryAttempts[deleteModal.tournament.id] > 0 && retryAttempts[deleteModal.tournament.id] < 3 && (
                <button
                  onClick={() => handleDeleteTournament(deleteModal.tournament!.id, retryAttempts[deleteModal.tournament.id])}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  disabled={actionLoading === `delete-${deleteModal.tournament.id}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Повторить
                </button>
              )}
              <button
                onClick={() => handleDeleteTournament(deleteModal.tournament!.id)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                disabled={actionLoading === `delete-${deleteModal.tournament.id}`}
              >
                {actionLoading === `delete-${deleteModal.tournament.id}` ? (
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
        totalPages={Math.ceil(totalTournaments / state.limit)}
        onPageChange={updatePage}
        totalItems={totalTournaments}
        itemsPerPage={state.limit}
      />

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />

      {/* Edit Tournament Modal */}
      {editingTournament && (
        <EditTournamentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTournament(null);
          }}
          tournament={editingTournament}
          onSave={handleSaveTournament}
        />
      )}
    </div>
  );
} 