import { Club } from '../../api/clubs';

interface ClubSocialMediaProps {
  club: Club;
}

export default function ClubSocialMedia({ club }: ClubSocialMediaProps) {
  if (!club.socialMediaLink) {
    return null;
  }

  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <h2 className="text-white text-2xl font-bold mb-4">Социальные сети</h2>
      <a 
        href={club.socialMediaLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
        </svg>
        Перейти в социальные сети
      </a>
    </div>
  );
} 