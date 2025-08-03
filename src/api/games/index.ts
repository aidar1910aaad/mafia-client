import { API_URL } from '../API_URL';

export interface GamePlayer {
    id: number;
    playerId: number;
    role: 'MAFIA' | 'CITIZEN';
    status?: 'ALIVE' | 'DEAD' | 'KICKED';
    points: number;
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
        totalKills: number;
        totalDeaths: number;
        mafiaGames: number;
        mafiaWins: number;
        citizenGames: number;
        citizenWins: number;
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
    result: 'MAFIA_WIN' | 'CITIZEN_WIN' | 'DRAW';
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
    result: 'MAFIA_WIN' | 'CITIZEN_WIN' | 'DRAW';
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
        totalKills: number;
        totalDeaths: number;
        mafiaGames: number;
        mafiaWins: number;
        citizenGames: number;
        citizenWins: number;
        createdAt: string;
        updatedAt: string;
    };
}

export interface GamesFilters {
    clubId?: number;
    seasonId?: number;
    tournamentId?: number;
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
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            // Build query parameters
            const params = new URLSearchParams();
            if (filters.clubId) params.append('clubId', filters.clubId.toString());
            if (filters.seasonId) params.append('seasonId', filters.seasonId.toString());
            if (filters.tournamentId) params.append('tournamentId', filters.tournamentId.toString());

            const response = await fetch(`${API_URL}/games?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
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
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/games/${gameId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения игры: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}; 