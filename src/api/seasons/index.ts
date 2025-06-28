import { API_URL } from '../API_URL';

export interface Season {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    clubId: number;
    refereeId: number;
    status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'UPCOMING';
    createdAt: string;
    updatedAt: string;
    club?: {
        id: number;
        name: string;
        logo: string | null;
        description: string;
        city: string;
        socialMediaLink: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    referee?: {
        id: number;
        email: string;
        nickname: string;
        avatar: string;
        role: string;
    };
    games?: any[];
}

export interface CreateSeasonRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    clubId: number;
    refereeId: number;
}

export interface Referee {
    id: number;
    email: string;
    nickname: string;
    avatar: string;
    role: string;
}

export const seasonsAPI = {
    // Создание нового сезона
    async createSeason(data: CreateSeasonRequest): Promise<Season> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/seasons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка создания сезона: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение сезонов клуба
    async getClubSeasons(clubId: number): Promise<Season[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/seasons?clubId=${clubId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения сезонов: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение сезона по ID
    async getSeasonById(id: number): Promise<Season> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/seasons/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения сезона: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение доступных судей
    async getReferees(): Promise<Referee[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/referees`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения списка судей: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}; 