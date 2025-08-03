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
                        
                      
                    </div>
                </div>
            </div>
        </header>
    );
} 