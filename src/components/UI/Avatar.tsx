'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../../api/API_URL';
// No longer need getAvatarBlob or checkAvatarExists

interface AvatarProps {
    avatar: string | null | undefined;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fallback?: string;
    className?: string;
    alt?: string;
}

export default function Avatar({ 
    avatar, 
    size = 'md', 
    fallback = 'U',
    className = '',
    alt = 'Avatar'
}: AvatarProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Функция для правильного формирования пути к аватару (как на странице списка игроков)
    const getValidAvatarPath = (avatarPath: string | null | undefined) => {
        if (!avatarPath) return null;
        
        // Если это уже полный URL, используем как есть
        if (avatarPath.startsWith('http')) {
            return avatarPath;
        }
        // Если это путь к файлу аватара пользователя, используем API endpoint
        else if (avatarPath.includes('user-avatars') || avatarPath.includes('avatar')) {
            return `${API_URL}/files/avatars/${avatarPath}`;
        }
        // Если уже правильный путь, используем как есть
        else if (avatarPath.startsWith('/')) {
            return avatarPath;
        }
        // Иначе добавляем ведущий слеш
        else {
            return `/${avatarPath}`;
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-lg',
        xl: 'w-24 h-24 text-2xl'
    };

    useEffect(() => {
        if (!avatar) {
            setImageUrl(null);
            setError(false);
            setLoading(false);
            return;
        }

        // If it's already a full URL, use it directly
        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            setImageUrl(avatar);
            setError(false);
            setLoading(false);
            return;
        }

        // Use static resource directly to avoid 404 errors
        setLoading(true);
        setError(false);
        
        const staticUrl = getValidAvatarPath(avatar);
        if (staticUrl) {
            setImageUrl(staticUrl);
            setError(false);
        } else {
            setImageUrl(null);
            setError(true);
        }
        setLoading(false);
    }, [avatar]);

    // Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (imageUrl && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    // Handle image error
    const handleImageError = () => {
        setError(true);
    };

    return (
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-lg ${className}`}>
            {loading ? (
                <div className="animate-spin rounded-full border-b-2 border-white w-1/2 h-1/2"></div>
            ) : imageUrl && !error ? (
                <img
                    src={imageUrl}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    crossOrigin="anonymous"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <span className="text-white font-bold select-none">
                        {fallback.charAt(0).toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
} 