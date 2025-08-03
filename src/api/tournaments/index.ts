import { API_URL } from '../API_URL';

export interface Tournament {
    id: number;
    name: string;
    description: string;
    date: string;
    clubId?: number;
    refereeId: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    clubName?: string;
    clubLogo?: string | null;
    refereeName?: string;
    refereeEmail?: string;
    gamesCount?: number;
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

export interface TournamentsResponse {
    tournaments: Tournament[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreateTournamentRequest {
    name: string;
    description: string;
    date: string;
    clubId: number;
    refereeId: number;
}

export interface UpdateTournamentRequest {
    name?: string;
    description?: string;
    date?: string;
    clubId?: number;
    refereeId?: number;
}

export interface TournamentsFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    clubId?: number;
    refereeId?: number;
    sortBy?: string;
    sortOrder?: string;
}

export const tournamentsAPI = {
    // Создание нового турнира
    async createTournament(data: CreateTournamentRequest): Promise<Tournament> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/tournaments`, {
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
                throw new Error(errorData.message || `Ошибка создания турнира: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение турниров клуба
    async getClubTournaments(clubId: number): Promise<TournamentsResponse> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/tournaments?clubId=${clubId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения турниров: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение турнира по ID
    async getTournamentById(id: number): Promise<Tournament> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/tournaments/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения турнира: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Обновление турнира
    async updateTournament(id: number, data: UpdateTournamentRequest): Promise<Tournament> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/tournaments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка обновления турнира: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение всех турниров с фильтрацией и пагинацией
    async getAllTournaments(filters: TournamentsFilters = {}): Promise<TournamentsResponse> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

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

            const response = await fetch(`${API_URL}/tournaments?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения турниров: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
}; 