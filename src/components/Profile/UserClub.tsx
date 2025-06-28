'use client';

import { useState, useEffect } from 'react';
import { Club } from '../../api/clubs';
import { clubsAPI } from '../../api/clubs';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';

interface UserClubProps {
    userId: number;
}

export default function UserClub({ userId }: UserClubProps) {
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserClub = async () => {
            try {
                setLoading(true);
                const clubData = await clubsAPI.getUserClub();
                setClub(clubData);
            } catch (err) {
                if (err instanceof Error && err.message.includes('404')) {
                    // У пользователя нет клуба - это нормально
                    setClub(null);
                } else {
                    setError(err instanceof Error ? err.message : 'Ошибка загрузки клуба');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserClub();
    }, [userId]);

    if (loading) {
        return (
            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div className="text-gray-400">Загрузка информации о клубе...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
                <div className="text-red-400 text-sm">Ошибка загрузки клуба: {error}</div>
            </div>
        );
    }

    if (!club) {
        return null; // Не показываем компонент, если у пользователя нет клуба
    }

    return (
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Мой клуб</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    club.status === 'APPROVED' ? 'bg-green-900/30 text-green-400' :
                    club.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                }`}>
                    {club.status === 'APPROVED' ? 'Одобрен' :
                     club.status === 'PENDING' ? 'На рассмотрении' : 'Отклонен'}
                </span>
            </div>

            <div className="space-y-4">
                {/* Название и логотип */}
                <div className="flex items-center gap-4">
                    {club.logo && (
                        <img 
                            src={club.logo} 
                            alt={club.name}
                            className="w-16 h-16 rounded-xl object-cover border border-[#404040]/50"
                        />
                    )}
                    <div>
                        <h4 className="text-white text-xl font-bold">{club.name}</h4>
                        <p className="text-gray-400 text-sm mt-1">{club.description}</p>
                    </div>
                </div>

                {/* Информация о клубе */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{club.city}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                            {club.members.length + club.administrators.length + 1} участников
                        </span>
                    </div>
                </div>

                {/* Социальные сети */}
                {club.socialMediaLink && (
                    <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <a 
                            href={club.socialMediaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                            Социальные сети
                        </a>
                    </div>
                )}

                {/* Кнопка управления сезонами */}
                {club.status === 'APPROVED' && (
                    <div className="pt-4 border-t border-[#404040]/50">
                        <a 
                            href={`/clubs/${club.id}/seasons`}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Calendar className="w-4 h-4" />
                            Управление сезонами
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
} 