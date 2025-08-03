'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '../../api/auth';
import { Calendar, MapPin, Users, ExternalLink, Crown, User, Building2, Trophy } from 'lucide-react';

interface UserClubProps {
    userId: number;
    user?: UserProfile | null;
}

export default function UserClub({ userId, user }: UserClubProps) {
    const [club, setClub] = useState(user?.club || null);

    useEffect(() => {
        if (user?.club) {
            setClub(user.club);
        }
    }, [user]);

    if (!club) {
        return null;
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'OWNER':
                return <Crown className="w-5 h-5 text-yellow-400" />;
            case 'ADMIN':
                return <Crown className="w-5 h-5 text-blue-400" />;
            default:
                return <User className="w-5 h-5 text-gray-400" />;
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'OWNER':
                return 'Владелец';
            case 'ADMIN':
                return 'Администратор';
            case 'MEMBER':
                return 'Участник';
            default:
                return role;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'OWNER':
                return 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30 text-yellow-300';
            case 'ADMIN':
                return 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-300';
            default:
                return 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 border-gray-500/30 text-gray-300';
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#2A2A2A]/90 to-[#1D1D1D]/90 backdrop-blur-sm border border-[#404040]/50 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header с градиентом */}
            <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 p-6 border-b border-[#404040]/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl">
                            <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-white text-xl font-bold">Мой клуб</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getRoleBadgeColor(club.userRole)}`}>
                            {getRoleIcon(club.userRole)}
                            <span className="text-sm font-medium">{getRoleText(club.userRole)}</span>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                            club.status === 'APPROVED' ? 'bg-green-600/20 border-green-500/30 text-green-300' :
                            club.status === 'PENDING' ? 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300' :
                            'bg-red-600/20 border-red-500/30 text-red-300'
                        }`}>
                            {club.status === 'APPROVED' ? 'Одобрен' :
                             club.status === 'PENDING' ? 'На рассмотрении' : 'Отклонен'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Основной контент */}
            <div className="p-6">
                {/* Название и логотип */}
                <div className="flex items-start gap-6 mb-6">
                    {club.logo && (
                        <div className="relative">
                            <a href={`/clubs/${club.id}`} className="block group">
                                <img 
                                    src={club.logo} 
                                    alt={club.name}
                                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#404040]/50 shadow-lg group-hover:border-blue-500/50 transition-all duration-200 group-hover:scale-105"
                                />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <Trophy className="w-3 h-3 text-white" />
                                </div>
                            </a>
                        </div>
                    )}
                    <div className="flex-1">
                        <a 
                            href={`/clubs/${club.id}`}
                            className="block group"
                        >
                            <h4 className="text-white text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors duration-200 cursor-pointer">
                                {club.name}
                            </h4>
                        </a>
                        <p className="text-gray-300 text-base leading-relaxed">{club.description}</p>
                    </div>
                </div>

                {/* Информация о клубе */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#1D1D1D]/50 rounded-xl p-4 border border-[#404040]/30">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                                <MapPin className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-gray-300 font-medium">Город</span>
                        </div>
                        <p className="text-white text-lg font-semibold">{club.city}</p>
                    </div>
                    
                    <div className="bg-[#1D1D1D]/50 rounded-xl p-4 border border-[#404040]/30">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-600/20 rounded-lg">
                                <Calendar className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="text-gray-300 font-medium">Дата вступления</span>
                        </div>
                        <p className="text-white text-lg font-semibold">
                            {new Date(club.joinedAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {/* Социальные сети */}
                {club.socialMediaLink && (
                    <div className="bg-[#1D1D1D]/50 rounded-xl p-4 border border-[#404040]/30 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600/20 rounded-lg">
                                <ExternalLink className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-gray-300 font-medium">Социальные сети</span>
                        </div>
                        <a 
                            href={club.socialMediaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300 text-lg font-medium transition-colors hover:underline"
                        >
                            Перейти на страницу
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}

                {/* Кнопки действий - только для владельцев и администраторов */}
                {club.status === 'APPROVED' && (club.userRole === 'OWNER' || club.userRole === 'ADMIN') && (
                    <div className="pt-4 border-t border-[#404040]/30">
                        <div className="flex flex-wrap gap-4">
                            <a 
                                href={`/clubs/${club.id}`}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Building2 className="w-5 h-5" />
                                Перейти в клуб
                            </a>
                            <a 
                                href={`/clubs/${club.id}/seasons`}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Calendar className="w-5 h-5" />
                                Управление сезонами
                            </a>
                        </div>
                    </div>
                )}

                {/* Кнопка перехода в клуб для обычных участников */}
                {club.status === 'APPROVED' && club.userRole === 'MEMBER' && (
                    <div className="pt-4 border-t border-[#404040]/30">
                        <a 
                            href={`/clubs/${club.id}`}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Building2 className="w-5 h-5" />
                            Перейти в клуб
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
} 