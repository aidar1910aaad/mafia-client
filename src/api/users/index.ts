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

export interface Player {
    id: number;
    email: string;
    nickname: string;
    avatar: string;
    role: string;
    confirmed: boolean;
    clubName?: string;
    totalGames: number;
    totalWins: number;
    totalPoints: number;
    totalKills?: number;
    totalDeaths?: number;
    mafiaGames?: number;
    mafiaWins?: number;
    citizenGames?: number;
    citizenWins?: number;
    eloRating: number;
    tournamentsParticipated: number;
    createdAt: string;
}

export interface RoleStat {
    id: number;
    role: string;
    gamesPlayed: number;
    gamesWon: number;
    createdAt: string;
    updatedAt: string;
}

export interface ExtendedPlayerProfile {
    id: number;
    email: string;
    nickname: string;
    avatar: string | null;
    role: string;
    confirmed: boolean;
    clubName?: string;
    totalGames: number;
    totalWins: number;
    totalPoints: number;
    totalKills?: number;
    totalDeaths?: number;
    mafiaGames?: number;
    mafiaWins?: number;
    citizenGames?: number;
    citizenWins?: number;
    eloRating: number;
    totalBonusPoints: number;
    tournamentsParticipated: number;
    roleStats: RoleStat[];
    createdAt: string;
    updatedAt: string;
}

export interface PlayersResponse {
    players: Player[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PlayersFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface UserSearchResult {
    id: number;
    email: string;
    name: string;
    role: string;
    club: string;
}

export const usersAPI = {
    // Получение всех игроков с фильтрацией и пагинацией
    async getAllPlayers(filters: PlayersFilters = {}): Promise<PlayersResponse> {
        try {
            const token = localStorage.getItem('authToken');

            // Build query parameters
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.role) params.append('role', filters.role);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/users?${params.toString()}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения игроков: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

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

            const data = await response.json();
            
            // Проверяем, является ли ответ массивом или объектом с полем players
            if (Array.isArray(data)) {
                return data;
            } else if (data && Array.isArray(data.players)) {
                return data.players;
            } else if (data && Array.isArray(data.users)) {
                return data.users;
            } else {
                console.error('Неожиданный формат ответа API:', data);
                return [];
            }
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
    async getUserById(id: number): Promise<Player> {
        try {
            const token = localStorage.getItem('authToken');

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения пользователя: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение игрока по ID с полной статистикой
    async getPlayerById(id: number): Promise<Player> {
        try {
            const token = localStorage.getItem('authToken');

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения игрока: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение расширенного профиля пользователя по ID
    async getExtendedPlayerProfile(id: number): Promise<ExtendedPlayerProfile> {
        try {
            const token = localStorage.getItem('authToken');

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/users/extended-profile/${id}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения расширенного профиля: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}; 