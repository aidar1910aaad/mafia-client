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
    participants?: TournamentParticipant[];
}

export interface TournamentParticipant {
    id: number;
    userId: number;
    tournamentId: number;
    nickname: string;
    email: string;
    avatar?: string;
    status: 'registered' | 'confirmed' | 'rejected';
    createdAt: string;
    updatedAt: string;
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
    dateFilter?: string;
    typeFilter?: string;
    ratingFilter?: string;
}

export interface FillTournamentRequest {
    playersCount: number;
    roundsCount: number;
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

            console.log(`Запрашиваем турнир с ID: ${id}`);
            console.log(`URL: ${API_URL}/tournaments/${id}`);

            const response = await fetch(`${API_URL}/tournaments/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Статус ответа:', response.status);
            console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorMessage = `Ошибка получения турнира: ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    console.error('Детали ошибки:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Не удалось распарсить ответ ошибки:', parseError);
                    const errorText = await response.text();
                    console.error('Текст ответа:', errorText);
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Полученный турнир:', result);
            return result;
        } catch (error) {
            console.error('Полная ошибка получения турнира:', error);
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
            if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);
            if (filters.typeFilter) params.append('typeFilter', filters.typeFilter);
            if (filters.ratingFilter) params.append('ratingFilter', filters.ratingFilter);

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

    // Добавление участника в турнир
    async addTournamentParticipant(tournamentId: number, userId: number): Promise<TournamentParticipant> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/tournaments/${tournamentId}/participants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка добавления участника: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Удаление участника из турнира
    async removeTournamentParticipant(tournamentId: number, participantId: number): Promise<void> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/tournaments/${tournamentId}/participants/${participantId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка удаления участника: ${response.status}`);
            }
        } catch (error) {
            throw error;
        }
    },

    // Получение участников турнира
    async getTournamentParticipants(tournamentId: number): Promise<TournamentParticipant[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            console.log(`Запрашиваем участников турнира ${tournamentId}`);
            console.log(`URL: ${API_URL}/tournaments/${tournamentId}/participants`);

            const response = await fetch(`${API_URL}/tournaments/${tournamentId}/participants`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Статус ответа участников:', response.status);

            if (!response.ok) {
                let errorMessage = `Ошибка получения участников: ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    console.error('Детали ошибки участников:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Не удалось распарсить ответ ошибки участников:', parseError);
                    const errorText = await response.text();
                    console.error('Текст ответа участников:', errorText);
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Полученные участники:', result);
            return result;
        } catch (error) {
            console.error('Полная ошибка получения участников:', error);
            throw error;
        }
    },

    // Заполнение турнира тестовыми игроками
    async fillTournament(tournamentId: number, data: FillTournamentRequest): Promise<TournamentParticipant[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/tournaments/${tournamentId}/fill`, {
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
                throw new Error(errorData.message || `Ошибка заполнения турнира: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
}; 