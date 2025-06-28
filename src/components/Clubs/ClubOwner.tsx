import { Club } from '../../api/clubs';

interface ClubOwnerProps {
  club: Club;
}

export default function ClubOwner({ club }: ClubOwnerProps) {
  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">Владелец клуба</h3>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
          {club.owner.avatar ? (
            <img src={club.owner.avatar} alt={club.owner.nickname} className="w-12 h-12 rounded-full object-cover" />
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