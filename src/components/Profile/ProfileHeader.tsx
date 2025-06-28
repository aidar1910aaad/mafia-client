'use client';

import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
    onLogout: () => void;
}

export default function ProfileHeader({ onLogout }: ProfileHeaderProps) {
    const router = useRouter();

    return (
        <header className="bg-[#2A2A2A]/80 backdrop-blur-sm border-b border-[#404040]/50 sticky top-0 z-50">
            <div className="max-w-[1280px] mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 bg-[#404040]/50 hover:bg-[#505050]/50 text-[#A1A1A1] hover:text-white px-4 py-2 rounded-xl transition-all duration-200 border border-[#404040]/50 hover:border-[#505050]/50"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Назад
                        </button>
                        <div>
                            <h1 className="text-white text-xl font-bold">Мой профиль</h1>
                            <p className="text-[#A1A1A1] text-sm">Управление аккаунтом</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 bg-[#404040]/50 hover:bg-[#505050]/50 text-[#A1A1A1] hover:text-white px-4 py-2 rounded-xl transition-all duration-200 border border-[#404040]/50 hover:border-[#505050]/50"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Панель пользователя
                        </button>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
} 