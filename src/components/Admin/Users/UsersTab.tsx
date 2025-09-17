'use client';

import { useState, useEffect } from 'react';
import { adminAPI, User } from '../../../api/admin';
import { RefreshCw, Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Avatar from '../../UI/Avatar';
import AdminSearch from '../Common/AdminSearch';
import AdminPagination from '../Common/AdminPagination';
import AdminFilters, { FilterConfig } from '../Common/AdminFilters';
import AdminTable from '../Common/AdminTable';
import AnimatedTableRow from '../Common/AnimatedTableRow';
import { useAdminTable } from '../../../hooks/useAdminTable';
import EditUserModal from '../Common/EditUserModal';

interface UsersTabProps {
  message: { text: string; type: 'success' | 'error' } | null;
}

export default function UsersTab({ message }: UsersTabProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    state,
    updatePage,
    updateLimit,
    updateSearch,
    updateFilters,
    updateSort,
    resetFilters
  } = useAdminTable({
    initialLimit: 20
  });

  const filterConfigs: FilterConfig[] = [
    {
      key: 'role',
      label: 'Роль',
      type: 'select',
      options: [
        { value: 'admin', label: 'Администратор' },
        { value: 'club_owner', label: 'Владелец клуба' },
        { value: 'player', label: 'Игрок' }
      ]
    },
    {
      key: 'createdAt',
      label: 'Дата регистрации',
      type: 'dateRange'
    }
  ];

  const handleSort = (column: string) => {
    let newSortOrder: 'asc' | 'desc' = 'asc';
    
    if (state.sortBy === column) {
      // If clicking the same column, toggle order
      newSortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    updateSort(column, newSortOrder);
  };

  const getSortIcon = (column: string) => {
    if (state.sortBy !== column) {
      return <ArrowUpDown className="w-3 h-3" />;
    }
    return state.sortOrder === 'asc' ? 
      <ArrowUp className="w-3 h-3" /> : 
      <ArrowDown className="w-3 h-3" />;
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (userId: string, userData: { email: string; nickname: string }) => {
    try {
      await adminAPI.updateUser(userId, userData);
      // Обновляем локальное состояние
      setUsers(prev => prev.map(user => 
        user.id.toString() === userId 
          ? { ...user, email: userData.email, nickname: userData.nickname }
          : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const usersData = await adminAPI.getUsers();
      
      // Client-side filtering and pagination for now
      let filteredUsers = usersData;
      
      // Apply search filter
      if (state.search) {
        filteredUsers = filteredUsers.filter(user => 
          user.nickname.toLowerCase().includes(state.search.toLowerCase()) ||
          user.email.toLowerCase().includes(state.search.toLowerCase())
        );
      }
      
      // Apply role filter
      if (state.filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === state.filters.role);
      }
      
      
      // Apply date range filter
      if (state.filters.createdAt_from) {
        const fromDate = new Date(state.filters.createdAt_from);
        filteredUsers = filteredUsers.filter(user => new Date(user.createdAt) >= fromDate);
      }
      
      if (state.filters.createdAt_to) {
        const toDate = new Date(state.filters.createdAt_to);
        toDate.setHours(23, 59, 59, 999); // End of day
        filteredUsers = filteredUsers.filter(user => new Date(user.createdAt) <= toDate);
      }
      
      // Apply sorting
      if (state.sortBy) {
        filteredUsers.sort((a, b) => {
          let aValue: any = a[state.sortBy as keyof User];
          let bValue: any = b[state.sortBy as keyof User];
          
          // Handle different data types
          if (state.sortBy === 'createdAt') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (aValue < bValue) {
            return state.sortOrder === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return state.sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setTotalUsers(filteredUsers.length);
      
      // Apply pagination
      const startIndex = (state.page - 1) * state.limit;
      const endIndex = startIndex + state.limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
    } catch (error) {
      console.error('UsersTab - error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [state.page, state.limit, state.search, state.filters, state.sortBy, state.sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-2xl font-bold mb-1">Управление пользователями</h2>
          <p className="text-[#A1A1A1] text-sm">Управляйте аккаунтами пользователей системы</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
      </div>

      {/* Search */}
      <AdminSearch
        placeholder="Поиск по никнейму или email..."
        onSearch={updateSearch}
        className="max-w-md"
      />

      {/* Filters */}
      <AdminFilters
        filters={filterConfigs}
        onFiltersChange={updateFilters}
      />
      
      <AdminTable
        loading={usersLoading}
        columns={9}
        rows={20}
        minHeight="700px"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#404040]/50">
              <tr>
                <th 
                  className="text-left p-3 text-white font-semibold text-xs cursor-pointer hover:bg-[#404040]/70 transition-colors select-none"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    ID
                    {getSortIcon('id')}
                  </div>
                </th>
                <th className="text-left p-3 text-white font-semibold text-xs">Аватар</th>
                <th 
                  className="text-left p-3 text-white font-semibold text-xs cursor-pointer hover:bg-[#404040]/70 transition-colors select-none"
                  onClick={() => handleSort('nickname')}
                >
                  <div className="flex items-center gap-1">
                    Никнейм
                    {getSortIcon('nickname')}
                  </div>
                </th>
                <th 
                  className="text-left p-3 text-white font-semibold text-xs cursor-pointer hover:bg-[#404040]/70 transition-colors select-none"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  className="text-left p-3 text-white font-semibold text-xs cursor-pointer hover:bg-[#404040]/70 transition-colors select-none"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-1">
                    Роль
                    {getSortIcon('role')}
                  </div>
                </th>
                <th 
                  className="text-left p-3 text-white font-semibold text-xs cursor-pointer hover:bg-[#404040]/70 transition-colors select-none"
                  onClick={() => handleSort('totalGames')}
                >
                  <div className="flex items-center gap-1">
                    Игры
                    {getSortIcon('totalGames')}
                  </div>
                </th>
                <th 
                  className="text-left p-3 text-white font-semibold text-xs cursor-pointer hover:bg-[#404040]/70 transition-colors select-none"
                  onClick={() => handleSort('totalWins')}
                >
                  <div className="flex items-center gap-1">
                    Победы
                    {getSortIcon('totalWins')}
                  </div>
                </th>
                <th 
                  className="text-left p-3 text-white font-semibold text-xs cursor-pointer hover:bg-[#404040]/70 transition-colors select-none"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Дата
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="text-left p-3 text-white font-semibold text-xs">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <AnimatedTableRow 
                    key={user.id} 
                    index={index}
                    className="border-b border-[#404040]/30 hover:bg-[#1D1D1D]/30 transition-all duration-200"
                  >
                    <td className="p-3 text-[#A1A1A1] font-mono text-xs">#{user.id}</td>
                    <td className="p-3">
                      <Avatar 
                        avatar={user.avatar}
                        size="sm"
                        fallback={user.nickname}
                        className="w-8 h-8"
                      />
                    </td>
                    <td className="p-3 text-white font-medium text-sm">{user.nickname}</td>
                    <td className="p-3 text-[#A1A1A1] text-xs truncate max-w-[120px]">{user.email}</td>
                    <td className="p-3">
                      {user.role === 'admin' && (
                        <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                          Админ
                        </span>
                      )}
                      {user.role === 'club_owner' && (
                        <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
                          Владелец
                        </span>
                      )}
                      {user.role === 'player' && (
                        <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                          Игрок
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#A1A1A1] text-xs">{user.totalGames}</td>
                    <td className="p-3 text-[#A1A1A1] text-xs">{user.totalWins}</td>
                    <td className="p-3 text-[#A1A1A1] text-xs">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button className="text-[#A1A1A1] hover:text-blue-400 transition-all duration-200 p-1.5 rounded-lg hover:bg-[#1D1D1D]/50 hover:scale-105" title="Просмотреть">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-[#A1A1A1] hover:text-green-400 transition-all duration-200 p-1.5 rounded-lg hover:bg-[#1D1D1D]/50 hover:scale-105" 
                          title="Редактировать"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-[#A1A1A1] hover:text-red-400 transition-all duration-200 p-1.5 rounded-lg hover:bg-[#1D1D1D]/50 hover:scale-105" title="Удалить">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </AnimatedTableRow>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-[#A1A1A1]">
                    Пользователи не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminTable>

      {/* Pagination */}
      <AdminPagination
        currentPage={state.page}
        totalPages={Math.ceil(totalUsers / state.limit)}
        onPageChange={updatePage}
        totalItems={totalUsers}
        itemsPerPage={state.limit}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
} 