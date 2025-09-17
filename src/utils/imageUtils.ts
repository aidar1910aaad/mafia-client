import { API_URL } from '../api/API_URL';

export const getImageUrl = (imagePath: string, type: 'avatar' | 'logo' = 'avatar') => {
  if (!imagePath || imagePath.trim() === '' || imagePath === 'default-avatar.png') return '';
  
  // Если это уже абсолютный URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Если это относительный путь, добавляем базовый URL
  if (imagePath.startsWith('/')) {
    return `${API_URL}${imagePath}`;
  }
  
  // Если это путь к файлу аватара клуба, используем API endpoint
  if (imagePath.includes('club-avatars') || imagePath.includes('avatar')) {
    return `${API_URL}/files/club-avatars/${imagePath}`;
  }
  
  // Если это просто имя файла, добавляем базовый URL и соответствующий путь
  const folder = type === 'avatar' ? 'avatars' : 'logos';
  return `${API_URL}/${folder}/${imagePath}`;
};

export const getAvatarUrl = (avatar: string | null | undefined): string | null => {
    if (!avatar || avatar === 'default-avatar.png') {
        return null;
    }
    
    // If it's already a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
    }
    
    // Construct the full URL using the files/avatars endpoint
    return `${API_URL}/files/avatars/${avatar}`;
};

// Function to get avatar as blob with optional authorization
export const getAvatarBlob = async (avatar: string | null | undefined, type: 'user-avatars' | 'club-avatars' = 'user-avatars'): Promise<string | null> => {
    if (!avatar || avatar === 'default-avatar.png') {
        return null;
    }
    
    // If it's already a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        // Try different possible paths for avatar based on type
        const possibleUrls = [
            `${API_URL}/files/${type}/${avatar}`,
            `${API_URL}/files/avatars/${avatar}`,
            `${API_URL}/uploads/${avatar}`,
            `${API_URL}/${type}/${avatar}`
        ];
        
        let response = null;
        let workingUrl = null;
        
        for (const url of possibleUrls) {
            try {
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                response = await fetch(url, {
                    headers,
                });
                
                if (response.ok) {
                    workingUrl = url;
                    break;
                }
                // Silently continue for 404 or other errors
            } catch (error) {
                // Silently continue to next URL
                continue;
            }
        }
        
        if (!workingUrl || !response || !response.ok) {
            // No need to log 404 errors as they're expected for missing avatars
            return null;
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    } catch (error) {
        // Silently handle errors for missing avatars
        return null;
    }
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText?: string) => {
  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
  
  const parent = target.parentElement;
  if (parent && fallbackText) {
    parent.textContent = fallbackText;
  }
};

// Function to check if avatar exists without logging 404 errors
export const checkAvatarExists = async (avatar: string | null | undefined, type: 'user-avatars' | 'club-avatars' = 'user-avatars'): Promise<boolean> => {
    if (!avatar || avatar === 'default-avatar.png') {
        return false;
    }
    
    // If it's already a full URL, assume it exists
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return true;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        
        // Try different possible paths for avatar based on type
        const possibleUrls = [
            `${API_URL}/api/files/${type}/${avatar}`,
            `${API_URL}/files/${type}/${avatar}`,
            `${API_URL}/files/avatars/${avatar}`,
            `${API_URL}/uploads/${avatar}`,
            `${API_URL}/${type}/${avatar}`,
            `${API_URL}/api/avatars/${avatar}`,
            `${API_URL}/api/club-avatars/${avatar}`
        ];
        
        for (const url of possibleUrls) {
            try {
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const response = await fetch(url, {
                    method: 'HEAD', // Only check if file exists, don't download
                    headers,
                });
                
                if (response.ok) {
                    return true;
                }
                // Silently continue for 404 or other errors
            } catch (error) {
                // Silently continue to next URL
                continue;
            }
        }
        
        return false;
    } catch (error) {
        return false;
    }
}; 