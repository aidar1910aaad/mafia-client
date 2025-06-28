import { Club } from '../../api/clubs';

interface ClubStatisticsProps {
  club: Club;
}

export default function ClubStatistics({ club }: ClubStatisticsProps) {
  const totalMembers = club.members.length;
  const totalAdministrators = club.administrators.length;
  const totalPeople = totalMembers + totalAdministrators;

  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h2 className="text-white text-2xl font-bold mb-6">Статистика</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{totalPeople}</div>
          <div className="text-[#A1A1A1] text-sm">Участников</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{totalMembers}</div>
          <div className="text-[#A1A1A1] text-sm">Членов</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{totalAdministrators}</div>
          <div className="text-[#A1A1A1] text-sm">Администраторов</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{club.city}</div>
          <div className="text-[#A1A1A1] text-sm">Город</div>
        </div>
      </div>
    </div>
  );
} 