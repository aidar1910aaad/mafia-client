'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../api/auth';

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                
                // Сначала быстро проверяем localStorage
                const token = localStorage.getItem('authToken');
                const userInfo = localStorage.getItem('userInfo');
                
                if (token && userInfo) {
                    try {
                        const userData = JSON.parse(userInfo);
                        setIsAuthenticated(true);
                        setUser(userData);
                        setLoading(false);
                    } catch (e) {
                        // Error parsing userInfo
                    }
                }
                
                // Затем проверяем через API
                const response = await authAPI.verifyToken();
                
                if (response.success && response.user) {
                    setIsAuthenticated(true);
                    setUser(response.user);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Слушатель изменений в localStorage
        const handleStorageChange = () => {
            checkAuth();
        };

        // Слушатель событий для обновления состояния
        const handleAuthUpdate = () => {
            checkAuth();
        };

        // Добавляем слушатели
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authUpdate', handleAuthUpdate);

        // Периодическая проверка каждые 5 секунд
        const interval = setInterval(checkAuth, 5000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authUpdate', handleAuthUpdate);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            setIsAuthenticated(false);
            setUser(null);
            // Отправляем событие для обновления других компонентов
            window.dispatchEvent(new Event('authUpdate'));
            
            // Обновляем страницу для полного сброса состояния
            window.location.href = '/';
        } catch (error) {
            // Error logging out
        }
    };

    return (
        <header className="bg-[#1D1D1D] h-[88px] w-full">
            <div className="max-w-[1280px] w-full h-full mx-auto">
                <nav className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-16">
                        <Link 
                            href={isAuthenticated && user ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/'} 
                            className="cursor-pointer"
                        >
                            <Image
                                src="/logo.png"
                                alt="Mafia Game Logo"
                                width={251}
                                height={54}
                                priority
                            />
                        </Link>
                        <div className="flex items-center mr-4 gap-2">
                            <a href="/ratings" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline">Рейтинги</a>
                            <a href="/tournaments" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline">Турниры</a>
                            <a href="/clubs" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline">Клубы</a>
                            <a href="/players" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline">Игроки</a>
                            <a href="/seasons" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline">Сезоны</a>
                        </div>
                    </div>
                    
                    {!loading && (
                        <div className="flex items-center gap-4">
                            {isAuthenticated && user ? (
                                <>
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer hover:bg-[#404040]/30 p-2 rounded-xl transition-all duration-200"
                                        onClick={() => router.push('/profile')}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
                                            {user?.nickname || 'Пользователь'}
                                        </span>
                                        <svg className="w-4 h-4 text-[#A1A1A1] hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="h-[52px] w-[140px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-[7px] flex items-center justify-center gap-3 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <span className="font-medium text-[18px] text-white">
                                            Выйти
                                        </span>
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                <Link href="/auth" className="h-[52px] w-[140px] bg-[#303030] rounded-[7px] flex items-center justify-center gap-6 cursor-pointer hover:bg-[#404040] transition-colors">
                                    <span 
                                        className="font-medium text-[18px]"
                                        style={{
                                            background: 'linear-gradient(90deg, #FF15D0 25.74%, #FF7054 50.25%, #FF9F00 74.75%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        Войти
                                    </span>
                                    <Image
                                        src="/login.png"
                                        alt="Login"
                                        width={21}
                                        height={30}
                                    />
                                </Link>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
} 