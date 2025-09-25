import { API_URL } from '../API_URL';

export interface Tournament {
    id: number;
    name: string;
    description: string;
    date: string;
    clubId?: number;
    refereeId: number;
    status?: string;
    type?: 'DEFAULT' | 'ELO';
    stars?: number;
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
    type?: 'DEFAULT' | 'ELO';
    stars?: number;
}

export interface UpdateTournamentRequest {
    name?: string;
    description?: string;
    date?: string;
    clubId?: number;
    refereeId?: number;
    type?: 'DEFAULT' | 'ELO';
    stars?: number;
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
    type?: string;
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

            // Подготавливаем данные для отправки
            const requestData: any = {
                name: data.name,
                description: data.description,
                date: data.date,
                clubId: data.clubId,
                refereeId: data.refereeId,
                type: data.type || 'DEFAULT'
            };

            // Добавляем stars только для ELO турниров
            if (data.type === 'ELO' && data.stars !== undefined) {
                requestData.stars = data.stars;
            }

            const response = await fetch(`${API_URL}/tournaments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
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

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/tournaments?clubId=${clubId}`, {
                method: 'GET',
                headers,
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

            console.log(`Запрашиваем турнир с ID: ${id}`);
            console.log(`URL: ${API_URL}/tournaments/${id}`);

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/tournaments/${id}`, {
                method: 'GET',
                headers,
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
            if (filters.type) params.append('type', filters.type);

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/tournaments?${params.toString()}`, {
                method: 'GET',
                headers,
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

            console.log(`Запрашиваем участников турнира ${tournamentId}`);
            console.log(`URL: ${API_URL}/tournaments/${tournamentId}/participants`);

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/tournaments/${tournamentId}/participants`, {
                method: 'GET',
                headers,
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

    // Завершение турнира
    async completeTournament(tournamentId: number): Promise<Tournament> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            console.log(`Завершаем турнир ${tournamentId}`);
            console.log(`URL: ${API_URL}/tournaments/${tournamentId}/complete`);

            const response = await fetch(`${API_URL}/tournaments/${tournamentId}/complete`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Статус ответа завершения турнира:', response.status);

            if (!response.ok) {
                let errorMessage = `Ошибка завершения турнира: ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    console.error('Детали ошибки завершения турнира:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Не удалось распарсить ответ ошибки завершения турнира:', parseError);
                    const errorText = await response.text();
                    console.error('Текст ответа завершения турнира:', errorText);
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Турнир успешно завершен:', result);
            return result;
        } catch (error) {
            console.error('Полная ошибка завершения турнира:', error);
            throw error;
        }
    },

    // Удаление турнира
    async deleteTournament(tournamentId: number): Promise<void> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему заново.');
            }

            const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
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
                        errorMessage = 'Недостаточно прав для удаления турнира.';
                    } else if (response.status === 404) {
                        errorMessage = 'Турнир не найден.';
                    } else if (response.status === 401) {
                        errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.';
                    }
                }
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            // Если это ошибка сети
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Ошибка сети. Проверьте подключение к интернету.');
            }
            throw error;
        }
    },
}; 