import { Club } from '../../api/clubs';

interface ClubAdministratorsProps {
  club: Club;
}

export default function ClubAdministrators({ club }: ClubAdministratorsProps) {
  if (club.administrators.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">Администраторы ({club.administrators.length})</h3>
      <div className="space-y-3">
        {club.administrators.slice(0, 5).map((admin) => (
          <div key={admin.id} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center">
              {admin.avatar ? (
                <img src={admin.avatar} alt={admin.nickname} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="text-white text-sm font-medium">
                  {admin.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{admin.nickname}</div>
              <div className="text-[#A1A1A1] text-xs">Администратор</div>
            </div>
          </div>
        ))}
        {club.administrators.length > 5 && (
          <div className="text-[#A1A1A1] text-sm pt-2 border-t border-[#404040]">
            И еще {club.administrators.length - 5} администраторов
          </div>
        )}
      </div>
    </div>
  );
} 