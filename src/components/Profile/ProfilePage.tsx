'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selfAPI, UserProfile } from '../../api/self';
import MessageDisplay from './MessageDisplay';
import Avatar from '../UI/Avatar';

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const router = useRouter();

    // Форматируем числа для отображения
    const formatNumber = (num: number | undefined) => {
        if (!num) return '0';
        // Если число целое, показываем без десятичных знаков
        if (Number.isInteger(num)) return num.toString();
        // Иначе округляем до 1 знака после запятой
        return num.toFixed(1);
    };

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const profileResponse = await selfAPI.getProfile();
                setUser(profileResponse);
            } catch (error) {
                console.error('Ошибка получения профиля:', error);
                setMessage('Ошибка при загрузке профиля');
                setMessageType('error');
            } finally {
                setLoading(false);
            }
        };
        getUserInfo();
    }, []);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setMessage('');
            const updatedUser = await selfAPI.uploadAvatar(file);
            setUser(updatedUser);
            setMessage('Аватар успешно загружен!');
            setMessageType('success');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Ошибка при загрузке аватара');
            setMessageType('error');
        }
        
        // Очищаем input
        event.target.value = '';
    };

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
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#404040]/50 bg-[#404040] flex items-center justify-center">
                                        <Avatar 
                                            avatar={user?.avatar}
                                            size="xl"
                                            fallback={user?.nickname || 'U'}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    
                                    {/* Кнопка загрузки аватара */}
                                    <button
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#8469EF] hover:bg-[#6B4FFF] rounded-full flex items-center justify-center transition-colors"
                                        title="Загрузить аватар"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                    {/* Скрытый input для загрузки файла */}
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>
                                
                                {/* Имя пользователя */}
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    {user?.nickname || 'Игровой Никнейм'}
                                </h1>
                                
                               
                                
                                {/* Роль */}
                                <p className="text-white text-base">
                                    {user?.role === 'admin' ? 'Администратор' : 
                                     user?.role === 'club_owner' ? 'Владелец клуба' : 
                                     user?.role === 'player' ? 'Игрок' : 
                                     user?.role || 'Неизвестная роль'}
                                </p>
                            </div>
                        </div>

                        {/* Общая статистика */}
                        <div className="space-y-4">
                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Побед/Игр всего</h3>
                                <p className="text-white text-lg">
                                    {user?.totalWins || 0}/{user?.totalGames || 0} 
                                    {user?.totalGames && user.totalGames > 0 ? 
                                        ` (Winrate - ${((user.totalWins / user.totalGames) * 100).toFixed(1)}%)` : 
                                        ' (Winrate - 0%)'
                                    }
                                </p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Всего очков</h3>
                                <p className="text-white text-lg">{formatNumber(user?.totalPoints)}</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Средний балл</h3>
                                <p className="text-white text-lg">
                                    {user?.totalGames && user.totalGames > 0 ? 
                                        formatNumber(user.totalPoints / user.totalGames) : 
                                        '0'
                                    }
                                </p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Всего допов</h3>
                                <p className="text-white text-lg">{formatNumber(user?.totalBonusPoints)}</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Баллы</h3>
                                <p className="text-white text-lg">{formatNumber(user?.eloRating)}</p>
                            </div>

                            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2">Турниров сыграно</h3>
                                <p className="text-white text-lg">{formatNumber(user?.tournamentsParticipated || 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - Диаграмма ролей и статистика по ролям */}
                    <div className="space-y-6">
                        {/* Диаграмма ролей */}
                        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-center">Распределение ролей</h3>
                            
                            {/* Диаграмма ролей */}
                            <div className="w-64 h-64 mx-auto mb-6 rounded-full border-8 border-[#404040] relative">
                                {(() => {
                                    if (!user?.roleStats || user.roleStats.length === 0) {
                                        return (
                                            <div className="absolute inset-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                                                <span className="text-white text-sm">Нет данных</span>
                                            </div>
                                        );
                                    }
                                    
                                    const totalGames = user.roleStats.reduce((sum, stat) => sum + stat.gamesPlayed, 0);
                                    if (totalGames === 0) {
                                        return (
                                            <div className="absolute inset-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                                                <span className="text-white text-sm">Нет игр</span>
                                            </div>
                                        );
                                    }
                                    
                                    const roleColors = {
                                        'CITIZEN': '#10B981',
                                        'MAFIA': '#EF4444',
                                        'DETECTIVE': '#3B82F6',
                                        'MANIAC': '#8B5CF6',
                                        'BEAUTY': '#EC4899',
                                        'DOCTOR': '#06B6D4',
                                        'DON': '#F97316'
                                    };
                                    
                                    let currentAngle = 0;
                                    const segments = user.roleStats
                                        .filter(stat => stat.gamesPlayed > 0)
                                        .map(stat => {
                                            const angle = (stat.gamesPlayed / totalGames) * 360;
                                            const segment = {
                                                role: stat.role,
                                                angle,
                                                startAngle: currentAngle,
                                                endAngle: currentAngle + angle,
                                                color: roleColors[stat.role as keyof typeof roleColors] || '#6B7280'
                                            };
                                            currentAngle += angle;
                                            return segment;
                                        });
                                    
                                    const conicGradient = segments.length > 0 ? 
                                        `conic-gradient(from 0deg, ${segments.map(seg => 
                                            `${seg.color} ${seg.startAngle}deg ${seg.endAngle}deg`
                                        ).join(', ')})` : 
                                        'conic-gradient(from 0deg, #6B7280 0deg 360deg)';
                                    
                                    return (
                                        <>
                                            <div className="absolute inset-0 rounded-full" style={{
                                                background: conicGradient
                                            }}></div>
                                            <div className="absolute inset-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-white text-lg font-bold">{totalGames}</div>
                                                    <div className="text-white text-xs">всего игр</div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Легенда ролей */}
                            <div className="grid grid-cols-1 gap-2">
                                {user?.roleStats?.filter(stat => stat.gamesPlayed > 0).map((roleStat) => {
                                    const roleNames: { [key: string]: string } = {
                                        'CITIZEN': 'Мирный',
                                        'MAFIA': 'Мафия',
                                        'DETECTIVE': 'Шериф',
                                        'MANIAC': 'Маньяк',
                                        'BEAUTY': 'Красотка',
                                        'DOCTOR': 'Доктор',
                                        'DON': 'Дон'
                                    };
                                    
                                    const roleColors: { [key: string]: string } = {
                                        'CITIZEN': 'text-green-400',
                                        'MAFIA': 'text-red-400',
                                        'DETECTIVE': 'text-blue-400',
                                        'MANIAC': 'text-purple-400',
                                        'BEAUTY': 'text-pink-400',
                                        'DOCTOR': 'text-cyan-400',
                                        'DON': 'text-orange-400'
                                    };
                                    
                                    const percentage = user.totalGames > 0 ? 
                                        ((roleStat.gamesPlayed / user.totalGames) * 100).toFixed(1) : 
                                        '0.0';
                                    
                                    return (
                                        <div key={roleStat.id} className="flex justify-between items-center">
                                            <span className={`text-sm ${roleColors[roleStat.role] || 'text-white'}`}>
                                                {roleNames[roleStat.role] || roleStat.role} - {roleStat.gamesPlayed} игр ({percentage}%)
                                            </span>
                                        </div>
                                    );
                                })}
                                {(!user?.roleStats || user.roleStats.filter(stat => stat.gamesPlayed > 0).length === 0) && (
                                    <div className="text-center text-gray-400 text-sm">
                                        Нет данных о ролях
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Статистика по ролям */}
                        <div className="grid grid-cols-2 gap-4">
                            {user?.roleStats?.map((roleStat) => {
                                const winRate = roleStat.gamesPlayed > 0 ? 
                                    ((roleStat.gamesWon / roleStat.gamesPlayed) * 100).toFixed(1) : 
                                    '0.0';
                                
                                const roleNames: { [key: string]: string } = {
                                    'CITIZEN': 'Мирный',
                                    'MAFIA': 'Мафия',
                                    'DETECTIVE': 'Шериф',
                                    'MANIAC': 'Маньяк',
                                    'BEAUTY': 'Красотка',
                                    'DOCTOR': 'Доктор',
                                    'DON': 'Дон'
                                };
                                
                                const roleColors: { [key: string]: string } = {
                                    'CITIZEN': 'text-green-400',
                                    'MAFIA': 'text-red-400',
                                    'DETECTIVE': 'text-blue-400',
                                    'MANIAC': 'text-purple-400',
                                    'BEAUTY': 'text-pink-400',
                                    'DOCTOR': 'text-cyan-400',
                                    'DON': 'text-orange-400'
                                };
                                
                                return (
                                    <div key={roleStat.id} className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-xl p-4">
                                        <h3 className={`font-semibold mb-2 text-sm ${roleColors[roleStat.role] || 'text-white'}`}>
                                            {roleNames[roleStat.role] || roleStat.role}
                                        </h3>
                                        <p className="text-white text-sm">
                                            Winrate - {winRate}% ({roleStat.gamesWon}/{roleStat.gamesPlayed} игр)
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 