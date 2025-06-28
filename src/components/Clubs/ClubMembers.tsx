import { Club } from '../../api/clubs';

interface ClubMembersProps {
  club: Club;
}

export default function ClubMembers({ club }: ClubMembersProps) {
  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">Участники ({club.members.length})</h3>
      <div className="space-y-3">
        {club.members.slice(0, 5).map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              {member.avatar ? (
                <img src={member.avatar} alt={member.nickname} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="text-white text-sm font-medium">
                  {member.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{member.nickname}</div>
              <div className="text-[#A1A1A1] text-xs">Участник</div>
            </div>
          </div>
        ))}
        {club.members.length > 5 && (
          <div className="text-[#A1A1A1] text-sm pt-2 border-t border-[#404040]">
            И еще {club.members.length - 5} участников
          </div>
        )}
      </div>
    </div>
  );
} 