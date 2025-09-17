'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, LoginData, SignupData } from '../../api/auth';
import { User, Lock, Mail, LogIn, UserPlus, CheckCircle, LogOut } from 'lucide-react';

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
                    router.push('/tournaments');
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
        <div className="min-h-screen bg-[#161616] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] rounded-full flex items-center justify-center mx-auto mb-4">
                        {isAuthenticated ? (
                            <CheckCircle className="w-8 h-8 text-white" />
                        ) : (
                            <User className="w-8 h-8 text-white" />
                        )}
                    </div>
                    <h1 className="text-white text-3xl font-bold mb-2">
                        {isAuthenticated ? 'Добро пожаловать!' : (isLogin ? 'Вход в систему' : 'Регистрация')}
                    </h1>
                    <p className="text-[#C7C7C7]">
                        {isAuthenticated 
                            ? `Привет, ${user?.nickname}!`
                            : (isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт')
                        }
                    </p>
                </div>

                {/* Show different content for authenticated users */}
                {isAuthenticated ? (
                    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-8 shadow-xl">
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white text-xl font-bold mb-2">Вы успешно авторизованы!</h2>
                                <p className="text-[#C7C7C7] text-sm">
                                    {user?.role === 'admin' ? 'Перейдите в админ панель' : 'Перейдите к турнирам'}
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        if (user?.role === 'admin') {
                                            router.push('/admin');
                                        } else {
                                            router.push('/tournaments');
                                        }
                                    }}
                                    className="w-full bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] hover:from-[#6B4FFF] hover:to-[#5A3FE8] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    {user?.role === 'admin' ? 'Перейти в админ панель' : 'Перейти к турнирам'}
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
                                    className="w-full bg-[#2A2A2A] hover:bg-[#353535] border border-[#404040] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Выйти
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Form */
                    <div className="bg-[#1D1D1D] border border-[#353535] rounded-[18px] p-8 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-[#C7C7C7] mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-[#8469EF]" />
                                        Никнейм
                                    </label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#8469EF] focus:ring-1 focus:ring-[#8469EF] transition-colors"
                                        placeholder="Введите никнейм"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#C7C7C7] mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#8469EF]" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#8469EF] focus:ring-1 focus:ring-[#8469EF] transition-colors"
                                    placeholder="Введите email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#C7C7C7] mb-2 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-[#8469EF]" />
                                    Пароль
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#8469EF] focus:ring-1 focus:ring-[#8469EF] transition-colors"
                                    placeholder="Введите пароль"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] hover:from-[#6B4FFF] hover:to-[#5A3FE8] disabled:from-[#404040] disabled:to-[#404040] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Загрузка...
                                    </>
                                ) : (
                                    <>
                                        {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#404040]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-[#1D1D1D] text-[#808080]">или</span>
                            </div>
                        </div>

                        {/* Switch mode */}
                        <div className="text-center">
                            <p className="text-[#C7C7C7] text-sm">
                                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setEmail('');
                                        setPassword('');
                                        setNickname('');
                                    }}
                                    className="text-[#8469EF] hover:text-[#6B4FFF] ml-1 font-medium transition-colors"
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