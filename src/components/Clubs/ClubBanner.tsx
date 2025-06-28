import { Club } from '../../api/clubs';

interface ClubBannerProps {
  club: Club;
}

export default function ClubBanner({ club }: ClubBannerProps) {
  // Вычисляем статистику на основе данных
  const totalMembers = club.members.length;
  const totalAdministrators = club.administrators.length;
  const totalPeople = totalMembers + totalAdministrators;

  return (
    <div className="relative h-64 bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-end gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            {club.logo ? (
              <img src={club.logo} alt={`${club.name} logo`} className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{club.name.charAt(0)}</span>
              </div>
            )}
          </div>
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