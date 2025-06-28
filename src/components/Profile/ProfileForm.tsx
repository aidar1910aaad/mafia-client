'use client';

import { UserProfile } from '../../api/self';

interface ProfileFormProps {
    user: UserProfile | null;
    editing: boolean;
    formData: {
        nickname: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileForm({ 
    user, 
    editing, 
    formData, 
    onInputChange 
}: ProfileFormProps) {
    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Никнейм
                    </label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={onInputChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 bg-[#1D1D1D] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Введите никнейм"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-[#1D1D1D] border border-[#404040] rounded-xl text-white placeholder-gray-400 opacity-50 cursor-not-allowed"
                        placeholder="Email"
                    />
                </div>

                {editing && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Текущий пароль
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 bg-[#1D1D1D] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Введите текущий пароль"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Новый пароль
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 bg-[#1D1D1D] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Введите новый пароль"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Подтвердите новый пароль
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={onInputChange}
                                className="w-full px-4 py-3 bg-[#1D1D1D] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Подтвердите новый пароль"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 