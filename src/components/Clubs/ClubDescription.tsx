import { Club } from '../../api/clubs';

interface ClubDescriptionProps {
  club: Club;
}

export default function ClubDescription({ club }: ClubDescriptionProps) {
  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h2 className="text-white text-2xl font-bold mb-4">О клубе</h2>
      <p className="text-[#A1A1A1] leading-relaxed">
        {club.description || 'Описание клуба отсутствует.'}
      </p>
    </div>
  );
} 