'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tournamentsAPI, Tournament, TournamentsResponse } from '../../api/tournaments';
import { Calendar, Clock, User, Trophy, Edit, ExternalLink } from 'lucide-react';

interface ClubTournamentsProps {
  clubId: number;
  onEditTournament?: (tournament: Tournament) => void;
  currentUser?: any;
  club?: any;
}

export default function ClubTournaments({ clubId, onEditTournament, currentUser, club }: ClubTournamentsProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response: TournamentsResponse = await tournamentsAPI.getClubTournaments(clubId);
        
        // Debug logging
        console.log('API Response:', response);
        
        // The API returns { tournaments: [...], total: number, page: number, limit: number, totalPages: number }
        if (response && Array.isArray(response.tournaments)) {
          setTournaments(response.tournaments);
        } else {
          console.warn('Unexpected API response format:', response);
          setTournaments([]);
        }
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки турниров');
        setTournaments([]); // Ensure tournaments is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [clubId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (date: string, status?: string) => {
    // If status is provided from API, use it
    if (status) {
      switch (status.toUpperCase()) {
        case 'UPCOMING':
          return 'text-green-400 bg-green-400/10 border-green-400/20';
        case 'ACTIVE':
          return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case 'COMPLETED':
          return 'text-red-400 bg-red-400/10 border-red-400/20';
        case 'CANCELLED':
          return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        default:
          break;
      }
    }
    
    // Fallback to date-based logic
    const tournamentDate = new Date(date);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tournamentDay = new Date(tournamentDate);
    tournamentDay.setHours(0, 0, 0, 0);
    
    if (tournamentDay < tomorrow) {
      return 'text-red-400 bg-red-400/10 border-red-400/20'; // Завершен
    } else if (tournamentDay.getTime() === tomorrow.getTime()) {
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'; // Скоро
    } else {
      return 'text-green-400 bg-green-400/10 border-green-400/20'; // Предстоящий
    }
  };

  const getStatusText = (date: string, status?: string) => {
    // If status is provided from API, use it
    if (status) {
      switch (status.toUpperCase()) {
        case 'UPCOMING':
          return 'Предстоящий';
        case 'ACTIVE':
          return 'Активный';
        case 'COMPLETED':
          return 'Завершен';
        case 'CANCELLED':
          return 'Отменен';
        default:
          break;
      }
    }
    
    // Fallback to date-based logic
    const tournamentDate = new Date(date);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tournamentDay = new Date(tournamentDate);
    tournamentDay.setHours(0, 0, 0, 0);
    
    if (tournamentDay < tomorrow) {
      return 'Завершен';
    } else if (tournamentDay.getTime() === tomorrow.getTime()) {
      return 'Скоро';
    } else {
      return 'Предстоящий';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Турниры
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Турниры
        </h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  if (!Array.isArray(tournaments) || tournaments.length === 0) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Турниры
        </h3>
        <div className="text-gray-400 text-sm text-center py-4">
          У клуба пока нет турниров
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Турниры
      </h3>
      
      <div className="space-y-3">
        {Array.isArray(tournaments) && tournaments.map((tournament) => (
          <div key={tournament.id} className="relative">
            <Link
              href={`/tournaments/${tournament.id}`}
              className="block"
            >
              <div 
                className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-4 hover:border-[#404040]/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium text-base group-hover:text-blue-400 transition-colors">
                      {tournament.name}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(tournament.date, tournament.status)}`}>
                      {getStatusText(tournament.date, tournament.status)}
                    </span>
                  </div>
                </div>
                
                {tournament.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {tournament.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Дата: {formatDate(tournament.date)}</span>
                  </div>
                </div>
                
                {tournament.referee && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <User className="w-3 h-3" />
                    <span>Судья: {tournament.referee.nickname || tournament.referee.email}</span>
                  </div>
                )}
                
                {/* Show referee info from new API fields if available */}
                {!tournament.referee && (tournament.refereeName || tournament.refereeEmail) && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <User className="w-3 h-3" />
                    <span>Судья: {tournament.refereeName || tournament.refereeEmail}</span>
                  </div>
                )}
              </div>
            </Link>
            
            {/* Edit button positioned absolutely to avoid interfering with link */}
            {onEditTournament && currentUser && club && (
              // Только владелец клуба может редактировать турниры своего клуба
              (currentUser.id === club.owner.id || currentUser.role === 'admin') && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditTournament(tournament);
                  }}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-blue-400 transition-colors bg-[#1D1D1D] rounded"
                  title="Редактировать турнир"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 