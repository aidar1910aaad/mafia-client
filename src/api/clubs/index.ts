import { API_URL } from '../API_URL';

export interface User {
    id: number | string;
    email: string;
    nickname: string;
    name?: string;
    city?: string;
    avatar: string;
    role: string;
}

export interface ClubOwner {
    id: number;
    email: string;
    nickname: string;
    avatar: string;
    role: string;
}

export interface Club {
    id: number;
    name: string;
    logo: string | null;
    description: string;
    city: string;
    socialMediaLink: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    owner: User;
    administrators: User[];
    members: User[];
}

export interface CreateClubRequest {
    name: string;
    description: string;
    city: string;
    socialMediaLink: string;
    message: string;
}

export interface JoinClubRequest {
    message: string;
}

export interface JoinRequest {
    id: number;
    user: User;
    club: Club;
    type: 'MEMBERSHIP';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    message: string;
    createdAt: string;
    updatedAt: string;
}

export const clubsAPI = {
    // Получение всех клубов
    async getClubs(): Promise<Club[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка получения клубов');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение клуба по ID
    async getClubById(id: string | number): Promise<Club> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения клуба: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Создание заявки на вступление в клуб
    async joinClub(clubId: string | number, data: JoinClubRequest): Promise<any> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs/${clubId}/join`, {
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
                throw new Error(errorData.message || `Ошибка создания заявки на вступление: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Создание заявки на создание клуба
    async createClubRequest(data: CreateClubRequest): Promise<void> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs/requests`, {
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
                throw new Error(errorData.message || 'Ошибка создания заявки');
            }
        } catch (error) {
            throw error;
        }
    },

    // Получение клуба пользователя
    async getUserClub(): Promise<Club> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs/my-club`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения клуба: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Получение заявок на вступление в клуб
    async getClubRequests(clubId: number): Promise<JoinRequest[]> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs/${clubId}/requests`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка получения заявок: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Одобрение заявки на вступление
    async approveRequest(requestId: number): Promise<JoinRequest> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs/requests/${requestId}/approve`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка одобрения заявки: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Отклонение заявки на вступление
    async rejectRequest(requestId: number): Promise<JoinRequest> {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`${API_URL}/clubs/requests/${requestId}/reject`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка отклонения заявки: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}; 