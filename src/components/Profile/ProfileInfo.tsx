'use client';

import { UserProfile } from '../../api/auth';
import { Calendar, Trophy, Target, Shield } from 'lucide-react';

interface ProfileInfoProps {
    user: UserProfile | null;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
    if (!user) return null;

    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Администратор';
            case 'club_owner':
                return 'Владелец клуба';
            case 'user':
                return 'Пользователь';
            default:
                return role;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-900/30 text-red-400';
            case 'club_owner':
                return 'bg-purple-900/30 text-purple-400';
            default:
                return 'bg-blue-900/30 text-blue-400';
        }
    };

    return (
        <div className="flex-1">
            <h2 className="text-white text-2xl font-bold mb-2">{user.nickname || 'Пользователь'}</h2>
            <p className="text-[#A1A1A1] mb-3">{user.email}</p>
            
            <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                </span>
                <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {user.confirmed ? 'Подтвержден' : 'Не подтвержден'}
                </span>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">
                        {user.totalWins || 0} побед из {user.totalGames || 0} игр
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-sm">
                        {user.totalKills || 0} убийств, {user.totalDeaths || 0} смертей
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">
                        {user.totalPoints ? (Number.isInteger(user.totalPoints) ? user.totalPoints.toString() : user.totalPoints.toFixed(1)) : 0} очков
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-sm">
                        С {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                </div>
            </div>
        </div>
    );
} 