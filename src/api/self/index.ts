import { API_URL } from '../API_URL';

export interface UserProfile {
    id: number;
    email: string;
    nickname: string;
    avatar: string;
    role: string;
}

export interface UpdateProfileData {
    nickname?: string;
    avatar?: string;
}

export const selfAPI = {
    // Получение профиля текущего пользователя
    async getProfile(): Promise<UserProfile> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/self/profile`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка получения профиля');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Обновление профиля пользователя
    async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/self/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка обновления профиля');
            }

            const result = await response.json();
            
            // Обновляем информацию о пользователе в localStorage
            if (result) {
                localStorage.setItem('userInfo', JSON.stringify(result));
            }
            
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Загрузка аватара пользователя
    async uploadAvatar(file: File): Promise<UserProfile> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${API_URL}/self/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка загрузки аватара');
            }

            const result = await response.json();
            
            // Обновляем информацию о пользователе в localStorage
            if (result) {
                localStorage.setItem('userInfo', JSON.stringify(result));
            }
            
            return result;
        } catch (error) {
            throw error;
        }
    }
}; 