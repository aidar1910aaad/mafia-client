import { Club } from '../../api/clubs';
import { API_URL } from '../../api/API_URL';

interface ClubOwnerProps {
  club: Club;
}

export default function ClubOwner({ club }: ClubOwnerProps) {
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

  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">Владелец клуба</h3>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
          {club.owner.avatar ? (
            <img 
              src={getValidAvatarPath(club.owner.avatar) || ''} 
              alt={club.owner.nickname} 
              className="w-12 h-12 rounded-full object-cover" 
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-white text-lg font-medium">${club.owner.nickname.charAt(0).toUpperCase()}</span>`;
                }
              }}
            />
          ) : (
            <span className="text-white text-lg font-medium">
              {club.owner.nickname.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="text-white font-medium">{club.owner.nickname}</div>
          <div className="text-[#A1A1A1] text-sm">Владелец</div>
        </div>
      </div>
    </div>
  );
} 