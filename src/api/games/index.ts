import { API_URL } from '../API_URL';

export enum GameResult {
  MAFIA_WIN = 'MAFIA_WIN',
  CITIZEN_WIN = 'CITIZEN_WIN',
  DRAW = 'DRAW'
}

export interface GamePlayer {
    id: number;
    playerId: number;
    role: 'MAFIA' | 'CITIZEN' | 'DOCTOR' | 'DETECTIVE' | 'DON' | 'MANIAC' | 'BEAUTY';
    status?: 'ALIVE' | 'DEAD' | 'KICKED';
    seatIndex?: number | null;
    points: number;
    bonusPoints: number;
    penaltyPoints: number;
    kills: number;
    deaths: number;
    gamesPlayed?: number;
    gamesWon?: number;
    notes?: string;
    diedAt?: string | null;
    kickedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    player?: {
        id: number;
        email: string;
        nickname: string;
        avatar: string;
        confirmed: boolean;
        role: string;
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
    };
}

export interface GameResultTable {
    [key: string]: string;
}

export interface CreateGameRequest {
    name: string;
    description: string;
    scheduledDate: string;
    clubId: number;
    seasonId?: number;
    tournamentId?: number;
    result?: GameResult | null;
    resultTable: GameResultTable;
    players: GamePlayer[];
}

export interface Game {
    id: number;
    name: string;
    description: string;
    scheduledDate: string;
    completedDate?: string;
    status?: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    clubId: number;
    seasonId?: number;
    tournamentId?: number;
    result?: GameResult | null;
    resultTable: GameResultTable;
    players: GamePlayer[];
    totalPlayers?: number;
    mafiaCount?: number;
    citizenCount?: number;
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
    season?: {
        id: number;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    tournament?: {
        id: number;
        name: string;
        description: string;
        date: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    referee?: {
        id: number;
        email: string;
        password: string;
        nickname: string;
        avatar: string;
        confirmed: boolean;
        role: string;
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
    };
}

export interface GamesFilters {
    clubId?: number;
    seasonId?: number;
    tournamentId?: number;
}

export interface GenerateGamesRequest {
    tablesCount: number;
    roundsCount: number;
    playersPerGame: number;
    totalGames: number;
    playerNicknames: string[];
    tournamentId: number;
}

export interface GenerateFinalGamesRequest {
    tournamentId: number;
    tablesCount: number;
    playersPerGame: number;
    roundsCount: number;
    totalGames: number;
}

export interface UpdateGameResultsRequest {
    playerResults: {
        playerId: number;
        role: string;
        points: number;
        bonusPoints: number;
        penaltyPoints: number;
    }[];
    result?: GameResult | null;
}



export const gamesAPI = {
    // Создание новой игры
    async createGame(data: CreateGameRequest): Promise<Game> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/games`, {
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
                throw new Error(errorData.message || `Ошибка создания игры: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение списка игр с фильтрацией
    async getGames(filters: GamesFilters = {}): Promise<Game[]> {
        try {
            const token = localStorage.getItem('authToken');

            // Build query parameters
            const params = new URLSearchParams();
            if (filters.clubId) params.append('clubId', filters.clubId.toString());
            if (filters.seasonId) params.append('seasonId', filters.seasonId.toString());
            if (filters.tournamentId) params.append('tournamentId', filters.tournamentId.toString());

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/games?${params.toString()}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения игр: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение игры по ID
    async getGameById(gameId: number): Promise<Game> {
        try {
            const token = localStorage.getItem('authToken');

            // Prepare headers - include authorization only if token exists
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/games/${gameId}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения игры: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Генерация игр для турнира
    async generateGames(data: GenerateGamesRequest): Promise<Game[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            console.log('Отправляем запрос на генерацию игр:', data);
            console.log('=== ДЕТАЛИ ЗАПРОСА ===');
            console.log('URL:', `${API_URL}/games/generate`);
            console.log('Метод: POST');
            console.log('Заголовки:', {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.substring(0, 20)}...`
            });
            console.log('Тело запроса (JSON):', JSON.stringify(data, null, 2));
            console.log('========================');

            const response = await fetch(`${API_URL}/games/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            console.log('Статус ответа:', response.status);
            console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
            console.log('=== ДЕТАЛИ ОТВЕТА ===');
            console.log('Статус:', response.status, response.statusText);
            console.log('Заголовки:', Object.fromEntries(response.headers.entries()));
            
            // Пытаемся прочитать тело ответа
            const responseText = await response.text();
            console.log('Тело ответа (текст):', responseText);
            
            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log('Тело ответа (JSON):', responseData);
            } catch (parseError) {
                console.log('Ответ не является валидным JSON');
            }
            console.log('========================');

            if (!response.ok) {
                let errorMessage = `Ошибка генерации игр: ${response.status}`;
                
                try {
                    const errorData = responseData || await response.json();
                    console.error('Детали ошибки:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Не удалось распарсить ответ ошибки:', parseError);
                    errorMessage = responseText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }

            const result = responseData || await response.json();
            console.log('Успешно сгенерированы игры:', result);
            return result;
        } catch (error) {
            console.error('Полная ошибка генерации игр:', error);
            throw error;
        }
    },

    // Обновление результатов игры
    async updateGameResults(gameId: number, data: UpdateGameResultsRequest): Promise<GamePlayer[]> {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) { throw new Error('Токен не найден'); }

            console.log('Отправляем обновление результатов игры:', { gameId, data });
            
            const response = await fetch(`${API_URL}/games/${gameId}/results`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            console.log('Статус ответа:', response.status);
            console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
            
            const responseText = await response.text();
            console.log('Тело ответа (текст):', responseText);
            
            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log('Тело ответа (JSON):', responseData);
            } catch (parseError) {
                console.log('Ответ не является валидным JSON');
            }

            if (!response.ok) {
                let errorMessage = `Ошибка обновления результатов: ${response.status}`;
                try {
                    const errorData = responseData || await response.json();
                    console.error('Детали ошибки:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Не удалось распарсить ответ ошибки:', parseError);
                    errorMessage = responseText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            const result = responseData || await response.json();
            console.log('Результаты успешно обновлены:', result);
            return result;
        } catch (error) {
            console.error('Полная ошибка обновления результатов:', error);
            throw error;
        }
    },

    // Генерация финальных игр для турнира
    async generateFinalGames(data: GenerateFinalGamesRequest): Promise<Game[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            console.log('Отправляем запрос на генерацию финальных игр:', data);
            console.log('=== ДЕТАЛИ ЗАПРОСА ===');
            console.log('URL:', `${API_URL}/games/generate-final`);
            console.log('Метод: POST');
            console.log('Заголовки:', {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.substring(0, 20)}...`
            });
            console.log('Тело запроса (JSON):', JSON.stringify(data, null, 2));
            console.log('========================');

            // Строим query параметры
            const params = new URLSearchParams();
            params.append('tournamentId', data.tournamentId.toString());
            params.append('tablesCount', data.tablesCount.toString());
            params.append('playersPerGame', data.playersPerGame.toString());
            params.append('roundsCount', data.roundsCount.toString());
            params.append('totalGames', data.totalGames.toString());

            const response = await fetch(`${API_URL}/games/generate-final?${params.toString()}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Статус ответа:', response.status);
            console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
            console.log('=== ДЕТАЛИ ОТВЕТА ===');
            console.log('Статус:', response.status, response.statusText);
            console.log('Заголовки:', Object.fromEntries(response.headers.entries()));
            
            // Пытаемся прочитать тело ответа
            const responseText = await response.text();
            console.log('Тело ответа (текст):', responseText);
            
            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log('Тело ответа (JSON):', responseData);
            } catch (parseError) {
                console.log('Ответ не является валидным JSON');
            }
            console.log('========================');

            if (!response.ok) {
                let errorMessage = `Ошибка генерации финальных игр: ${response.status}`;
                
                try {
                    const errorData = responseData || await response.json();
                    console.error('Детали ошибки:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Не удалось распарсить ответ ошибки:', parseError);
                    errorMessage = responseText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }

            const result = responseData || await response.json();
            console.log('Успешно сгенерированы финальные игры:', result);
            return result;
        } catch (error) {
            console.error('Полная ошибка генерации финальных игр:', error);
            throw error;
        }
    },

    // Тестовый метод для проверки доступности API
    async testGenerateGamesAPI(): Promise<boolean> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            console.log('Тестируем доступность API генерации игр...');

            const response = await fetch(`${API_URL}/games/generate`, {
                method: 'OPTIONS',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Тест API - статус:', response.status);
            return response.ok;
        } catch (error) {
            console.error('Ошибка тестирования API:', error);
            return false;
        }
    }
}; 