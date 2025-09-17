'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../api/auth';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAuth = true, requireAdmin = false }: AuthGuardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Сначала проверяем localStorage
                const token = localStorage.getItem('authToken');
                const userInfo = localStorage.getItem('userInfo');
                
                if (!token) {
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    setIsLoading(false);
                    return;
                }
                
                // Пытаемся проверить токен через API
                try {
                    const response = await authAPI.verifyToken();
                    
                    if (response.success && response.user) {
                        setIsAuthenticated(true);
                        const isUserAdmin = response.user.role === 'admin';
                        setIsAdmin(isUserAdmin);
                    } else {
                        // Fallback на localStorage
                        if (userInfo) {
                            try {
                                const userData = JSON.parse(userInfo);
                                setIsAuthenticated(true);
                                const isUserAdmin = userData.role === 'admin';
                                setIsAdmin(isUserAdmin);
                            } catch (e) {
                                setIsAuthenticated(false);
                                setIsAdmin(false);
                            }
                        } else {
                            setIsAuthenticated(false);
                            setIsAdmin(false);
                        }
                    }
                } catch (apiError) {
                    // Fallback на localStorage при ошибке API
                    if (userInfo) {
                        try {
                            const userData = JSON.parse(userInfo);
                            setIsAuthenticated(true);
                            const isUserAdmin = userData.role === 'admin';
                            setIsAdmin(isUserAdmin);
                        } catch (e) {
                            setIsAuthenticated(false);
                            setIsAdmin(false);
                        }
                    } else {
                        setIsAuthenticated(false);
                        setIsAdmin(false);
                    }
                }
            } catch (error) {
                setIsAuthenticated(false);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                router.push('/auth');
                return;
            } else if (requireAdmin && !isAdmin) {
                router.push('/tournaments');
                return;
            } else if (!requireAdmin && isAdmin) {
                // Если это админ, но он пытается зайти на обычную страницу - перенаправляем в админ панель
                router.push('/admin');
                return;
            }
            
            setShouldRender(true);
        }
    }, [isLoading, isAuthenticated, isAdmin, requireAuth, requireAdmin, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <div className="text-white text-lg">Проверка авторизации...</div>
                </div>
            </div>
        );
    }

    if (!shouldRender) {
        return (
            <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center">
                <div className="text-white text-lg">Перенаправление...</div>
            </div>
        );
    }

    return <>{children}</>;
} 