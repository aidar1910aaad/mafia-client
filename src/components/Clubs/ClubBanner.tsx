import { Club } from '../../api/clubs';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { API_URL } from '../../api/API_URL';

interface ClubBannerProps {
  club: Club;
  currentUser?: any;
  onAvatarUpdate?: (updatedClub: Club) => void;
}

export default function ClubBanner({ club, currentUser, onAvatarUpdate }: ClubBannerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Вычисляем статистику на основе данных
  const totalMembers = club.members.length;
  const totalAdministrators = club.administrators.length;
  const totalPeople = totalMembers + totalAdministrators;

  // Проверяем, является ли текущий пользователь владельцем клуба
  const isOwner = currentUser && club.owner.id === currentUser.id;


  // Функция для правильного формирования пути к логотипу (как на странице списка клубов)
  const getValidLogoPath = (logoPath: string | null | undefined) => {
    if (!logoPath) {
      return '/club-avatar-default.svg';
    }
    
    // Если это уже полный URL, используем как есть
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    // Если это путь к файлу аватара клуба, используем API endpoint
    else if (logoPath.includes('club-avatars') || logoPath.includes('avatar')) {
      return `${API_URL}/files/club-avatars/${logoPath}`;
    }
    // Если уже правильный путь, используем как есть
    else if (logoPath.startsWith('/')) {
      return logoPath;
    }
    // Иначе добавляем ведущий слеш
    else {
      return `/${logoPath}`;
    }
  };

  const handleAvatarClick = () => {
    if (isOwner && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onAvatarUpdate) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Импортируем API функцию
      const { clubsAPI } = await import('../../api/clubs');
      const updatedClub = await clubsAPI.uploadClubAvatar(club.id, file);
      
      onAvatarUpdate(updatedClub);
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      alert(error instanceof Error ? error.message : 'Ошибка загрузки аватара');
    } finally {
      setIsUploading(false);
      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative h-64 bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-end gap-6">
          <div 
            className={`relative w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg ${
              isOwner ? 'cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105' : ''
            }`}
            onClick={handleAvatarClick}
          >
            {isUploading ? (
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Image 
                src={getValidLogoPath(club.logo)} 
                alt={`${club.name} logo`} 
                width={64}
                height={64}
                className="object-contain" 
                onError={(e) => {
                  // Fallback to default if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = '/club-avatar-default.svg';
                }}
              />
            )}
            
            {/* Иконка загрузки для владельца */}
            {isOwner && !isUploading && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Скрытый input для загрузки файла */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex-1">
            <h1 className="text-white text-4xl font-bold mb-2">{club.name}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                {totalPeople} участников
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {club.city}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              club.status === 'APPROVED' ? 'bg-green-900/30 text-green-400 border border-green-700' :
              club.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' :
              'bg-red-900/30 text-red-400 border border-red-700'
            }`}>
              {club.status === 'APPROVED' ? 'Активен' : 
               club.status === 'PENDING' ? 'На рассмотрении' : 'Отклонен'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 