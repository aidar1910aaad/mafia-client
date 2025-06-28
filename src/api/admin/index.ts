import { API_URL } from '../API_URL';

export interface AdminAPIResponse {
  success: boolean;
  message?: string;
}

export interface SystemStats {
  totalUsers: number;
  totalClubs: number;
  totalSeasons: number;
  totalTournaments: number;
  totalGames: number;
  pendingClubRequests: number;
}

export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  avatar: string;
  confirmed: boolean;
  role: 'player' | 'admin' | 'club_owner';
  totalGames: number;
  totalWins: number;
  totalPoints: number;
  totalKills: number;
  totalDeaths: number;
  mafiaGames: number;
  mafiaWins: number;
  citizenGames: number;
  citizenWins: number;
  createdAt: string;
  updatedAt: string;
  club: any | null;
}

export const adminAPI = {
  // Получить всех пользователей
  getUsers: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Одобрить клуб и назначить владельца
  approveClub: async (clubId: string): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const response = await fetch(`${API_URL}/admin/club-requests/${clubId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Отклонить клуб
  rejectClub: async (clubId: string): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const response = await fetch(`${API_URL}/admin/club-requests/${clubId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Получить статистику системы
  getStats: async (): Promise<SystemStats> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const response = await fetch(`${API_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Удалить клуб
  deleteClub: async (clubId: string): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const response = await fetch(`${API_URL}/admin/clubs/${clubId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Сбросить систему (заглушка)
  resetSystem: async (): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен не найден');
      }

      // TODO: Заменить на реальный API endpoint
      // const response = await fetch(`${API_URL}/admin/reset-system`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({}));
      //   throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      // }

      // Имитация задержки
      await new Promise(resolve => setTimeout(resolve, 2000));

      return { success: true, message: 'Система успешно сброшена' };
    } catch (error) {
      throw error;
    }
  },
}; 