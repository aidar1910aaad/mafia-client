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

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText?: string) => {
  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
  
  const parent = target.parentElement;
  if (parent && fallbackText) {
    parent.textContent = fallbackText;
  }
}; 