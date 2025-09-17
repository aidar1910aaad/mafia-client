'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../api/auth';

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    // Инициализация клиентского состояния
    useEffect(() => {
        setIsClient(true);
        
        // Загружаем данные из localStorage
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
            try {
                const userData = JSON.parse(userInfo);
                setIsAuthenticated(true);
                setUser(userData);
                setLoading(false);
                setInitialLoad(false);
            } catch (e) {
                setLoading(true);
            }
        } else {
            setLoading(true);
        }
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Если уже есть данные из localStorage, не делаем API запрос
                if (isAuthenticated && user && !initialLoad) {
                    return;
                }

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
                setInitialLoad(false);
            }
        };

        // Делаем API запрос только если нет данных из localStorage
        if (initialLoad && !isAuthenticated) {
            checkAuth();
        } else {
            setInitialLoad(false);
        }

        // Слушатель изменений в localStorage
        const handleStorageChange = () => {
            const token = localStorage.getItem('authToken');
            const userInfo = localStorage.getItem('userInfo');
            
            if (token && userInfo) {
                try {
                    const userData = JSON.parse(userInfo);
                    setIsAuthenticated(true);
                    setUser(userData);
                } catch (e) {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        // Слушатель событий для обновления состояния
        const handleAuthUpdate = () => {
            checkAuth();
        };

        // Добавляем слушатели
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authUpdate', handleAuthUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authUpdate', handleAuthUpdate);
        };
    }, []);

    const handleLogout = useCallback(async () => {
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
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }, [isMobileMenuOpen]);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    return (
        <header className="bg-[#1D1D1D] w-full relative">
            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between h-[88px]">
                    {/* Логотип */}
                    <div className="flex items-center">
                        <Link 
                            href={isAuthenticated && user ? (user?.role === 'admin' ? '/admin' : '/tournaments') : '/'} 
                            className="cursor-pointer"
                        >
                            <Image
                                src="/logo.png"
                                alt="Mafia Game Logo"
                                width={251}
                                height={54}
                                priority
                                className="w-auto h-8 sm:h-10 lg:h-[54px]"
                            />
                        </Link>
                    </div>

                    {/* Десктопная навигация */}
                    <div className="hidden lg:flex items-center gap-16">
                        <div className="flex items-center gap-2">
                            <a href="/ratings" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline text-sm">Рейтинги</a>
                            <a href="/tournaments" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline text-sm">Турниры</a>
                            <a href="/clubs" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline text-sm">Клубы</a>
                            <a href="/players" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline text-sm">Игроки</a>
                            <a href="/seasons" className="h-[34px] min-w-[120px] flex items-center justify-center border border-[#757575] text-[#757575] hover:border-white hover:text-white transition-colors rounded-[22px] no-underline text-sm">Сезоны</a>
                        </div>
                    </div>
                    
                    {/* Десктопные кнопки авторизации */}
                    <div className="hidden md:flex items-center gap-4 w-[210px] justify-end">
                        {!isClient || (loading && initialLoad) ? (
                            <div className="h-[40px] w-[100px] bg-[#303030] rounded-[7px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            </div>
                        ) : isAuthenticated && user ? (
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
                                        <span className="text-white text-xs font-medium hover:text-blue-400 transition-colors">
                                            {user?.nickname || 'Пользователь'}
                                        </span>
                                        <svg className="w-4 h-4 text-[#A1A1A1] hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-md flex items-center justify-center gap-1 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        style={{ 
                                            width: '90px', 
                                            height: '34px',
                                            minWidth: '90px',
                                            minHeight: '34px'
                                        }}
                                    >
                                        <span className="font-medium text-xs text-white">
                                            Выйти
                                        </span>
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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

                    {/* Мобильная кнопка меню */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {/* Мобильная кнопка входа/профиль */}
                        <div className="flex items-center w-[80px] justify-center">
                            {!isClient || (loading && initialLoad) ? (
                                <div className="h-[40px] w-[80px] bg-[#303030] rounded-[7px] flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                </div>
                            ) : isAuthenticated && user ? (
                                    <div 
                                        className="flex items-center gap-2 cursor-pointer hover:bg-[#404040]/30 p-2 rounded-xl transition-all duration-200"
                                        onClick={() => router.push('/profile')}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-white text-sm font-medium hidden sm:block">
                                            {user?.nickname || 'Пользователь'}
                                        </span>
                                    </div>
                                ) : (
                                    <Link href="/auth" className="h-[40px] w-[80px] sm:w-[100px] bg-[#303030] rounded-[7px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#404040] transition-colors">
                                        <span 
                                            className="font-medium text-sm sm:text-base"
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
                                            width={16}
                                            height={20}
                                        />
                                    </Link>
                                )}
                            </div>
                        
                        {/* Кнопка мобильного меню */}
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 text-white hover:bg-[#404040]/30 rounded-lg transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Мобильное меню */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1D1D1D] border-t border-[#404040] z-50">
                        <div className="px-4 py-4 space-y-4">
                            {/* Навигационные ссылки */}
                            <div className="space-y-2">
                                <a 
                                    href="/ratings" 
                                    className="block py-3 px-4 text-[#757575] hover:text-white hover:bg-[#404040]/30 rounded-lg transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Рейтинги
                                </a>
                                <a 
                                    href="/tournaments" 
                                    className="block py-3 px-4 text-[#757575] hover:text-white hover:bg-[#404040]/30 rounded-lg transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Турниры
                                </a>
                                <a 
                                    href="/clubs" 
                                    className="block py-3 px-4 text-[#757575] hover:text-white hover:bg-[#404040]/30 rounded-lg transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Клубы
                                </a>
                                <a 
                                    href="/players" 
                                    className="block py-3 px-4 text-[#757575] hover:text-white hover:bg-[#404040]/30 rounded-lg transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Игроки
                                </a>
                                <a 
                                    href="/seasons" 
                                    className="block py-3 px-4 text-[#757575] hover:text-white hover:bg-[#404040]/30 rounded-lg transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Сезоны
                                </a>
                            </div>

                            {/* Кнопка выхода для мобильных устройств */}
                            {isClient && isAuthenticated && user && (
                                <div className="pt-4 border-t border-[#404040]">
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeMobileMenu();
                                        }}
                                        className="w-full h-[32px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-[7px] flex items-center justify-center gap-1 cursor-pointer transition-all duration-200"
                                    >
                                        <span className="font-medium text-xs text-white">
                                            Выйти
                                        </span>
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
} 