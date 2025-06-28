'use client';

import { UserProfile } from '../../api/self';

interface ProfileInfoProps {
    user: UserProfile | null;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
    return (
        <div className="flex-1">
            <h2 className="text-white text-2xl font-bold mb-2">{user?.nickname || 'Пользователь'}</h2>
            <p className="text-[#A1A1A1] mb-1">{user?.email}</p>
            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === 'admin' 
                        ? 'bg-red-900/30 text-red-400' 
                        : 'bg-blue-900/30 text-blue-400'
                }`}>
                    {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
                <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Активен
                </span>
            </div>
        </div>
    );
} 