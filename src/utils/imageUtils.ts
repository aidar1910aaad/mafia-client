import { API_URL } from '../api/API_URL';

export const getImageUrl = (imagePath: string, type: 'avatar' | 'logo' = 'avatar') => {
  if (!imagePath || imagePath.trim() === '') return '';
  
  // Если это уже абсолютный URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Если это относительный путь, добавляем базовый URL
  if (imagePath.startsWith('/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return '';
    return `${apiUrl}${imagePath}`;
  }
  
  // Если это просто имя файла, добавляем базовый URL и соответствующий путь
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return '';
  
  const folder = type === 'avatar' ? 'avatars' : 'logos';
  return `${apiUrl}/${folder}/${imagePath}`;
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

// Function to get avatar as blob with authorization
export const getAvatarBlob = async (avatar: string | null | undefined): Promise<string | null> => {
    if (!avatar || avatar === 'default-avatar.png') {
        return null;
    }
    
    // If it's already a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return null;
        }
        
        // Try different possible paths for avatar
        const possibleUrls = [
            `${API_URL}/files/avatars/${avatar}`,
            `${API_URL}/uploads/${avatar}`,
            `${API_URL}/avatars/${avatar}`
        ];
        
        let response = null;
        let workingUrl = null;
        
        for (const url of possibleUrls) {
            try {
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    workingUrl = url;
                    break;
                }
            } catch (error) {
                continue;
            }
        }
        
        if (!workingUrl || !response || !response.ok) {
            return null;
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    } catch (error) {
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