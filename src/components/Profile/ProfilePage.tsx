'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../api/auth';
import { selfAPI, UserProfile } from '../../api/self';
import ProfileHeader from './ProfileHeader';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import ProfileActions from './ProfileActions';
import ProfileForm from './ProfileForm';
import MessageDisplay from './MessageDisplay';
import UserClub from './UserClub';

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [formData, setFormData] = useState({
        nickname: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const router = useRouter();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const profileResponse = await selfAPI.getProfile();
                setUser(profileResponse);
                setFormData({
                    nickname: profileResponse.nickname || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } catch (error) {
                const response = await authAPI.verifyToken();
                if (response.success && response.user) {
                    setUser(response.user as UserProfile);
                    setFormData({
                        nickname: response.user.nickname || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        getUserInfo();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            setMessage('');
            const updateData: any = {};
            if (formData.nickname) updateData.nickname = formData.nickname;
            const response = await selfAPI.updateProfile(updateData);
            setUser(response);
            setMessage('Профиль успешно обновлен!');
            setMessageType('success');
            setEditing(false);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Ошибка при обновлении профиля');
            setMessageType('error');
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            setUploadingAvatar(true);
            setMessage('');
            const response = await selfAPI.uploadAvatar(file);
            setUser(response);
            setMessage('Аватар успешно загружен!');
            setMessageType('success');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Ошибка при загрузке аватара');
            setMessageType('error');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            router.push('/');
        } catch (error) {
            // Error logging out
        }
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
            <ProfileHeader onLogout={handleLogout} />

            <main className="max-w-[800px] mx-auto px-4 py-8">
                <MessageDisplay message={message} messageType={messageType} />

                <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl overflow-hidden shadow-xl">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 border-b border-[#404040]/50">
                        <div className="flex items-center gap-6">
                            <ProfileAvatar
                                user={user}
                                editing={editing}
                                uploadingAvatar={uploadingAvatar}
                                onAvatarUpload={handleAvatarUpload}
                            />
                            <ProfileInfo user={user} />
                            <ProfileActions
                                editing={editing}
                                onEdit={() => setEditing(true)}
                                onSave={handleSave}
                                onCancel={() => setEditing(false)}
                            />
                        </div>
                    </div>

                    {/* Profile Form */}
                    <ProfileForm
                        user={user}
                        editing={editing}
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                </div>

                {/* User Club Section - показываем только для владельцев клубов */}
                {user && user.role === 'club_owner' && (
                    <div className="mt-8">
                        <UserClub userId={user.id} />
                    </div>
                )}
            </main>
        </div>
    );
} 