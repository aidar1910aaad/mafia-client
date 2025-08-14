'use client';

import { useState, useEffect } from 'react';
import { getAvatarBlob } from '../../utils/imageUtils';

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
            return;
        }

        // If it's already a full URL, use it directly
        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            setImageUrl(avatar);
            setError(false);
            return;
        }

        // For all avatar filenames, use blob method with authorization
        setLoading(true);
        setError(false);
        
        getAvatarBlob(avatar)
            .then((url) => {
                setImageUrl(url);
                setError(!url);
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
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
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${className}`}>
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
                fallback.charAt(0).toUpperCase()
            )}
        </div>
    );
} 