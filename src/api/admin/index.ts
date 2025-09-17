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
  totalKills?: number;
  totalDeaths?: number;
  mafiaGames?: number;
  mafiaWins?: number;
  citizenGames?: number;
  citizenWins?: number;
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
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
      }

      const response = await fetch(`${API_URL}/admin/clubs/${clubId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // Если не удалось распарсить JSON, используем стандартное сообщение
          if (response.status === 500) {
            errorMessage = 'Внутренняя ошибка сервера. Попробуйте позже или обратитесь к администратору.';
          } else if (response.status === 403) {
            errorMessage = 'Недостаточно прав для удаления клуба.';
          } else if (response.status === 404) {
            errorMessage = 'Клуб не найден.';
          } else if (response.status === 401) {
            errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.';
          }
        }
        
        throw new Error(errorMessage);
      }

      return { success: true };
    } catch (error) {
      // Если это ошибка сети
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Ошибка сети. Проверьте подключение к интернету.');
      }
      throw error;
    }
  },

  // Сбросить ELO всех игроков
  resetElo: async (): Promise<{ success: boolean; message: string; affectedUsers?: number }> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
      }

      const response = await fetch(`${API_URL}/admin/reset-elo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // Если не удалось распарсить JSON, используем стандартное сообщение
          if (response.status === 500) {
            errorMessage = 'Внутренняя ошибка сервера. Попробуйте позже или обратитесь к администратору.';
          } else if (response.status === 403) {
            errorMessage = 'Недостаточно прав для сброса ELO.';
          } else if (response.status === 401) {
            errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { 
        success: true, 
        message: data.message || 'ELO всех игроков успешно сброшен',
        affectedUsers: data.affectedUsers 
      };
    } catch (error) {
      // Если это ошибка сети
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Ошибка сети. Проверьте подключение к интернету.');
      }
      throw error;
    }
  },

  // Редактировать пользователя
  updateUser: async (userId: string, userData: { email?: string; nickname?: string }): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
      }

      const response = await fetch(`${API_URL}/admin/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
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

  // Редактировать турнир
  updateTournament: async (tournamentId: string, tournamentData: { name?: string; description?: string }): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
      }

      const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tournamentData),
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

  // Редактировать клуб
  updateClub: async (clubId: string, clubData: { name?: string; description?: string; city?: string }): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
      }

      const response = await fetch(`${API_URL}/clubs/${clubId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(clubData),
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

  // Редактировать сезон
  updateSeason: async (seasonId: string, seasonData: { name?: string; description?: string }): Promise<AdminAPIResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
      }

      const response = await fetch(`${API_URL}/seasons/${seasonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(seasonData),
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

}; 