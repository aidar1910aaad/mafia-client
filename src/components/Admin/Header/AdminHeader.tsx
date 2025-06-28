'use client';

import { useRouter } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { authAPI } from '../../../api/auth';

interface AdminHeaderProps {
  user: any;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      // Принудительно очищаем localStorage на случай, если API не сработал
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      // Перезагружаем страницу для полного сброса состояния
      window.location.href = '/auth';
    } catch (error) {
      // Даже при ошибке очищаем localStorage и перенаправляем
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/auth';
    }
  };

  return (
    <header className="AdminHeader bg-[#2A2A2A]/80 backdrop-blur-sm border-b border-[#404040]/50 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Админ панель</h1>
                {user && (
                  <p className="text-[#A1A1A1] text-sm">
                    Администратор: <span className="text-white font-medium">{user.nickname}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
           
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 