'use client';

import { useRef } from 'react';
import { UserProfile } from '../../api/self';
import { API_URL } from '../../api/API_URL';

interface ProfileAvatarProps {
    user: UserProfile | null;
    editing: boolean;
    uploadingAvatar: boolean;
    onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatar({ 
    user, 
    editing, 
    uploadingAvatar, 
    onAvatarUpload 
}: ProfileAvatarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to get proper avatar URL
    const getAvatarUrl = (avatar: string) => {
        if (!avatar || avatar === 'default-avatar.png') {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            return avatar;
        }
        
        // If it's a relative path, construct the full URL
        return `${API_URL}/${avatar}`;
    };

    return (
        <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                {user?.avatar && getAvatarUrl(user.avatar) ? (
                    <img
                        src={getAvatarUrl(user.avatar)!}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Hide the image if it fails to load
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    user?.nickname?.charAt(0)?.toUpperCase() || 'U'
                )}
            </div>
            {editing && (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#404040] hover:bg-[#505050] rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50"
                >
                    {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    )}
                </button>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                className="hidden"
            />
        </div>
    );
} 