import { Club } from '../../api/clubs';

interface ClubInfoProps {
  club: Club;
}

export default function ClubInfo({ club }: ClubInfoProps) {
  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">Информация</h3>
      <div className="space-y-3">
        <div>
          <div className="text-[#A1A1A1] text-sm">Создан</div>
          <div className="text-white">
            {new Date(club.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
        <div>
          <div className="text-[#A1A1A1] text-sm">Обновлен</div>
          <div className="text-white">
            {new Date(club.updatedAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 