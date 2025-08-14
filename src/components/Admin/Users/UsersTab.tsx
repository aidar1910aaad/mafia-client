'use client';

import { useState, useEffect } from 'react';
import { adminAPI, User } from '../../../api/admin';
import { RefreshCw, Eye, Edit, Trash2 } from 'lucide-react';
import Avatar from '../../UI/Avatar';

interface UsersTabProps {
  message: { text: string; type: 'success' | 'error' } | null;
}

export default function UsersTab({ message }: UsersTabProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const usersData = await adminAPI.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('UsersTab - error fetching users:', error);
      // Error fetching users
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl overflow-hidden shadow-xl">
        {usersLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <div className="text-white text-base">Загрузка пользователей...</div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#404040]/50">
                <tr>
                  <th className="text-left p-3 text-white font-semibold text-xs">ID</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Аватар</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Никнейм</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Email</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Роль</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Статус</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Игры</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Победы</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Дата</th>
                  <th className="text-left p-3 text-white font-semibold text-xs">Действия</th>
                </tr>
              </thead>
              <tbody>
                                 {users.length > 0 ? (
                   users.map((user) => (
                       <tr key={user.id} className="border-b border-[#404040]/30 hover:bg-[#1D1D1D]/30 transition-colors">
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
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                          user.confirmed 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            user.confirmed ? 'bg-green-400' : 'bg-yellow-400'
                          }`}></div>
                          {user.confirmed ? 'Подтвержден' : 'Не подтвержден'}
                        </span>
                      </td>
                      <td className="p-3 text-[#A1A1A1] text-xs">{user.totalGames}</td>
                      <td className="p-3 text-[#A1A1A1] text-xs">{user.totalWins}</td>
                      <td className="p-3 text-[#A1A1A1] text-xs">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button className="text-[#A1A1A1] hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-[#1D1D1D]/50" title="Просмотреть">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-[#A1A1A1] hover:text-green-400 transition-colors p-1.5 rounded-lg hover:bg-[#1D1D1D]/50" title="Редактировать">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-[#A1A1A1] hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-[#1D1D1D]/50" title="Удалить">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-[#A1A1A1]">
                      Пользователи не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 