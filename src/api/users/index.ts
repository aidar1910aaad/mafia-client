import { API_URL } from '../API_URL';

export interface User {
    id: number;
    email: string;
    nickname: string;
    avatar: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserSearchResult {
    id: number;
    email: string;
    name: string;
    role: string;
    club: string;
}

export const usersAPI = {
    // Получение всех пользователей
    async getAllUsers(): Promise<User[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/users`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения пользователей: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Поиск пользователей по email
    async searchUsersByEmail(email: string, limit: number = 10): Promise<UserSearchResult[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const params = new URLSearchParams({
                email: email,
                limit: limit.toString()
            });

            const response = await fetch(`${API_URL}/users/search/email?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка поиска пользователей: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение пользователя по ID
    async getUserById(id: number): Promise<User> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения пользователя: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}; 