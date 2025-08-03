import { API_URL } from '../API_URL';

export interface LoginData {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    nickname: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: {
        id: number;
        email: string;
        nickname: string;
        avatar: string;
        role: string;
    };
    tokens?: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface UserProfile {
    id: number;
    email: string;
    nickname: string;
    avatar: string;
    role: string;
    confirmed: boolean;
    club?: {
        id: number;
        name: string;
        logo: string | null;
        description: string;
        city: string;
        status: string;
        userRole: string;
        joinedAt: string;
        socialMediaLink: string;
    };
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
}

export const authAPI = {
    // Вход в аккаунт
    async login(data: LoginData): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Сохраняем токены в localStorage
                if (result.tokens) {
                    localStorage.setItem('authToken', result.tokens.accessToken);
                    localStorage.setItem('refreshToken', result.tokens.refreshToken);
                }
                
                // Сохраняем информацию о пользователе
                if (result.user) {
                    localStorage.setItem('userInfo', JSON.stringify(result.user));
                }
                
                return {
                    success: true,
                    user: result.user,
                    tokens: result.tokens
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Ошибка входа'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка сети'
            };
        }
    },

    // Регистрация
    async signup(data: SignupData): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Сохраняем токены в localStorage
                if (result.tokens) {
                    localStorage.setItem('authToken', result.tokens.accessToken);
                    localStorage.setItem('refreshToken', result.tokens.refreshToken);
                }
                
                // Сохраняем информацию о пользователе
                if (result.user) {
                    localStorage.setItem('userInfo', JSON.stringify(result.user));
                }
                
                return {
                    success: true,
                    user: result.user,
                    tokens: result.tokens
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Ошибка регистрации'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка сети'
            };
        }
    },

    // Выход из аккаунта
    async logout(): Promise<AuthResponse> {
        try {
            const token = localStorage.getItem('authToken');
            
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Всегда очищаем localStorage, независимо от ответа API
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');

            if (response.ok) {
                return {
                    success: true,
                    message: 'Успешный выход'
                };
            } else {
                return {
                    success: false,
                    message: 'Ошибка выхода'
                };
            }
        } catch (error) {
            // Очищаем localStorage даже при сетевой ошибке
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');
            
            return {
                success: false,
                message: 'Ошибка сети'
            };
        }
    },

    // Обновление токена
    async refreshToken(): Promise<AuthResponse> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                return {
                    success: false,
                    message: 'Refresh токен не найден'
                };
            }

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            const result = await response.json();

            if (response.ok) {
                // Обновляем токены в localStorage
                if (result.tokens) {
                    localStorage.setItem('authToken', result.tokens.accessToken);
                    localStorage.setItem('refreshToken', result.tokens.refreshToken);
                }
                
                return {
                    success: true,
                    tokens: result.tokens
                };
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userInfo');
                return {
                    success: false,
                    message: result.message || 'Ошибка обновления токена'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка сети'
            };
        }
    },

    // Проверка токена
    async verifyToken(): Promise<AuthResponse> {
        try {
            const token = localStorage.getItem('authToken');
            const userInfo = localStorage.getItem('userInfo');
            
            if (!token) {
                return {
                    success: false,
                    message: 'Токен не найден'
                };
            }

            // Поскольку /auth/verify endpoint не существует, используем только localStorage
            if (userInfo) {
                try {
                    const userData = JSON.parse(userInfo);
                    return {
                        success: true,
                        user: userData
                    };
                } catch (e) {
                    return {
                        success: false,
                        message: 'Ошибка чтения данных пользователя'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'Данные пользователя не найдены'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка проверки токена'
            };
        }
    },

    // Получение профиля пользователя
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения профиля: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}; 