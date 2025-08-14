'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, UserProfile } from '../../api/auth';
import MessageDisplay from './MessageDisplay';

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const router = useRouter();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const profileResponse = await authAPI.getProfile();
                setUser(profileResponse);
            } catch (error) {
                console.error('Ошибка получения профиля:', error);
                const response = await authAPI.verifyToken();
                if (response.success && response.user) {
                    setUser(response.user as UserProfile);
                }
            } finally {
                setLoading(false);
            }
        };
        getUserInfo();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D] flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <div className="text-white text-lg">Загрузка профиля...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D]">
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <MessageDisplay message={message} messageType={messageType} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Левая колонка - Профиль пользователя и общая статистика */}
                    <div className="space-y-6">
                        {/* Профиль пользователя */}
                        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
                            <div className="text-center">
                                {/* Аватар */}
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#404040]/50 bg-[#404040] flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center ${user?.avatar ? 'hidden' : ''}`}>
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Имя пользователя */}
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    {user?.nickname || 'Игровой Никнейм'}
                                </h1>
                                
                                {/* Клуб */}
                                <p className="text-white text-lg mb-1">
                                    {user?.club?.name || 'Клуб игрока'}
                                </p>
                                
                                {/* Город */}
                                <p className="text-white text-base">
                                    {'Город игрока'}
                                </p>
                            </div>
                        </div>

                        {/* Общая статистика */}
                        <div className="space-y-4">
                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Побед/Игр всего</h3>
                                <p className="text-white text-lg">800/1200 (Winrate - 72%)</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Всего</h3>
                                <p className="text-white text-lg">414,61</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Средний балл</h3>
                                <p className="text-white text-lg">0,7051</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Всего допов</h3>
                                <p className="text-white text-lg">100,4</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">ПУ</h3>
                                <p className="text-white text-lg">71</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">ЛХ</h3>
                                <div className="space-y-1">
                                    <p className="text-white text-sm">4 черных - 11 (5,63%)</p>
                                    <p className="text-white text-sm">3 черных - 4 (5,63%)</p>
                                    <p className="text-white text-sm">2 черных - 29 (40,85%)</p>
                                    <p className="text-white text-sm">1 черный - 27 (38,03%)</p>
                                    <p className="text-white text-sm">0 черный - 27 (38,03%)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - Диаграмма ролей и статистика по ролям */}
                    <div className="space-y-6">
                        {/* Диаграмма ролей */}
                        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-center">Распределение ролей</h3>
                            
                            {/* Заглушка для диаграммы */}
                            <div className="w-64 h-64 mx-auto mb-6 rounded-full border-8 border-[#404040] relative">
                                <div className="absolute inset-0 rounded-full" style={{
                                    background: 'conic-gradient(from 0deg, #8B5CF6 0deg 120deg, #F97316 120deg 240deg, #EC4899 240deg 360deg)'
                                }}></div>
                                <div className="absolute inset-4 rounded-full bg-[#2A2A2A]"></div>
                            </div>

                            {/* Легенда ролей */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-red-400 text-sm">Мирный - 8,39 доп. (макс. 0.7)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-purple-400 text-sm">Мафия - 2,39 доп. (макс. 0.2)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-400 text-sm">Дон - 2,39 доп. (макс. 0.2)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white text-sm">Шериф - 8,39 доп. (макс. 0.7)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white text-sm">Красотка - 8,39 доп. (макс. 0.7)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white text-sm">Доктор - 8,39 доп. (макс. 0.7)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white text-sm">Маньяк - 8,39 доп. (макс. 0.7)</span>
                                </div>
                            </div>
                        </div>

                        {/* Статистика по ролям */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-sm">Победы на карте Мирный</h3>
                                <p className="text-white text-sm">Winrate - 80% (7/36 игр)</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-sm">Победы на карте Мафия</h3>
                                <p className="text-white text-sm">Winrate - 40% (2/36 игр)</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-sm">Победы на карте Шериф</h3>
                                <p className="text-white text-sm">Winrate - 80% (7/36 игр)</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-sm">Победы на карте Маньяк</h3>
                                <p className="text-white text-sm">Winrate - 40% (2/36 игр)</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-sm">Победы на карте Красотка</h3>
                                <p className="text-white text-sm">Winrate - 80% (7/36 игр)</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-sm">Победы на карте Доктор</h3>
                                <p className="text-white text-sm">Winrate - 40% (2/36 игр)</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-sm">Победы на карте Дон</h3>
                                <p className="text-white text-sm">Winrate - 80% (7/36 игр)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 