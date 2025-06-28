'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, LoginData, SignupData } from '../../api/auth';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authAPI.verifyToken();
                if (response.success && response.user) {
                    setIsAuthenticated(true);
                    setUser(response.user);
                }
            } catch (error) {
                // Error checking auth
            }
        };

        checkAuth();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            
            if (isLogin) {
                const loginData: LoginData = { email, password };
                response = await authAPI.login(loginData);
            } else {
                const signupData: SignupData = { email, password, nickname };
                response = await authAPI.signup(signupData);
            }

            if (response.success) {
                // Проверяем, что токены сохранены
                const savedToken = localStorage.getItem('authToken');
                const savedRefreshToken = localStorage.getItem('refreshToken');
                
                // Обновляем состояние компонента
                setIsAuthenticated(true);
                setUser(response.user);
                
                // Отправляем событие для обновления хедера
                window.dispatchEvent(new Event('authUpdate'));
                
                // Перенаправляем пользователя согласно его роли
                if (response.user?.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError(response.message || 'Произошла ошибка');
            }
        } catch (error) {
            setError('Ошибка сети');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#161616] flex items-center justify-center px-4">
            <div className="w-full max-w-sm mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-white text-3xl font-bold mb-2">
                        {isAuthenticated ? 'Вы уже авторизованы' : (isLogin ? 'Вход' : 'Регистрация')}
                    </h1>
                    <p className="text-gray-400">
                        {isAuthenticated 
                            ? `Добро пожаловать, ${user?.nickname}!`
                            : (isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт')
                        }
                    </p>
                </div>

                {/* Show different content for authenticated users */}
                {isAuthenticated ? (
                    <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-full">
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-white text-xl font-bold mb-2">Вы успешно авторизованы!</h2>
                                <p className="text-gray-400 text-sm">
                                    {user?.role === 'admin' ? 'Перейдите в админ панель' : 'Перейдите в панель управления'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (user?.role === 'admin') {
                                        router.push('/admin');
                                    } else {
                                        router.push('/dashboard');
                                    }
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {user?.role === 'admin' ? 'Перейти в админ панель' : 'Перейти в панель управления'}
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await authAPI.logout();
                                        setIsAuthenticated(false);
                                        setUser(null);
                                    } catch (error) {
                                        console.error('Error logging out:', error);
                                    }
                                }}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Form */
                    <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Никнейм
                                    </label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Введите никнейм"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Введите email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Пароль
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Введите пароль"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-900/50 border border-red-700 rounded-md px-4 py-3">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:cursor-not-allowed"
                            >
                                {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">или</span>
                            </div>
                        </div>

                        {/* Switch mode */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setEmail('');
                                        setPassword('');
                                        setNickname('');
                                    }}
                                    className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
                                >
                                    {isLogin ? 'Зарегистрироваться' : 'Войти'}
                                </button>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 