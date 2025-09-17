import { API_URL } from '../API_URL';

export interface Season {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    clubId?: number;
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
        owner?: {
            id: number;
            email: string;
            nickname: string;
            avatar: string;
            role: string;
        };
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

export interface SeasonsResponse {
    seasons: Season[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface SeasonsFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    clubId?: number;
    refereeId?: number;
    sortBy?: string;
    sortOrder?: string;
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
    // Получение всех сезонов с фильтрацией и пагинацией
    async getAllSeasons(filters: SeasonsFilters = {}): Promise<SeasonsResponse> {
        try {
            const token = localStorage.getItem('authToken');

            // Build query parameters
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            if (filters.clubId) params.append('clubId', filters.clubId.toString());
            if (filters.refereeId) params.append('refereeId', filters.refereeId.toString());
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/seasons?${params.toString()}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Если ошибка Unauthorized и нет токена, возвращаем пустой результат для публичного доступа
                if (response.status === 401 && !token) {
                    return {
                        seasons: [],
                        total: 0,
                        page: 1,
                        limit: filters.limit || 10,
                        totalPages: 0,
                        hasNext: false,
                        hasPrev: false
                    };
                }
                throw new Error(errorData.message || `Ошибка получения сезонов: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

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

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/seasons?clubId=${clubId}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Если ошибка Unauthorized и нет токена, возвращаем пустой массив для публичного доступа
                if (response.status === 401 && !token) {
                    return [];
                }
                throw new Error(errorData.message || `Ошибка получения сезонов: ${response.status}`);
            }

            const data = await response.json();
            // Возвращаем массив сезонов из ответа API
            return data.seasons || data || [];
        } catch (error) {
            throw error;
        }
    },

    // Получение сезона по ID
    async getSeasonById(id: number): Promise<Season> {
        try {
            const token = localStorage.getItem('authToken');

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/seasons/${id}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Если ошибка Unauthorized и нет токена, выбрасываем ошибку для публичного доступа
                if (response.status === 401 && !token) {
                    throw new Error('Для просмотра сезона необходимо авторизоваться');
                }
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