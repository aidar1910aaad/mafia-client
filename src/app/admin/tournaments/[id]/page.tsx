'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { tournamentsAPI, Tournament } from '../../../../api/tournaments';
import { authAPI } from '../../../../api/auth';
import TournamentDetails from '../../../../components/TournamentDetails/TournamentDetails';
import AdminWrapper from '../../../../components/Admin/AdminWrapper';
import AuthGuard from '../../../../components/Auth/AuthGuard';

export default function AdminTournamentPage() {
  const params = useParams();
  const tournamentId = params.id;
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем турнир и пользователя параллельно
        const [tournamentData, userData] = await Promise.all([
          tournamentsAPI.getTournamentById(parseInt(tournamentId as string)),
          authAPI.getProfile().catch(() => null) // Игнорируем ошибки если пользователь не авторизован
        ]);
        
        console.log('Админская страница турнира - полученные данные:');
        console.log('ID турнира:', tournamentId);
        console.log('Турнир:', tournamentData);
        console.log('Текущий пользователь:', userData);
        
        setTournament(tournamentData);
        setCurrentUser(userData);
      } catch (err) {
        console.error('Error fetching tournament:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки турнира');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  if (loading) {
    return (
      <AdminWrapper>
        <AuthGuard requireAuth={true} requireAdmin={true}>
          <div className="min-h-screen flex justify-center items-center">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#8469EF]" />
              <span className="text-gray-400">Загрузка турнира...</span>
            </div>
          </div>
        </AuthGuard>
      </AdminWrapper>
    );
  }

  if (error || !tournament) {
    return (
      <AdminWrapper>
        <AuthGuard requireAuth={true} requireAdmin={true}>
          <div className="min-h-screen flex justify-center items-start py-8 px-4">
            <div className="w-full max-w-[1080px] rounded-[18px] bg-[#1D1D1D] border border-[#353535] p-6">
              <div className="text-center">
                <div className="text-red-400 text-lg mb-4">Ошибка загрузки турнира</div>
                <div className="text-gray-400 mb-4">{error || 'Турнир не найден'}</div>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться в админ панель
                </Link>
              </div>
            </div>
          </div>
        </AuthGuard>
      </AdminWrapper>
    );
  }

  return (
    <AdminWrapper>
      <AuthGuard requireAuth={true} requireAdmin={true}>
        <div className="min-h-screen bg-[#161616]">
          <div className="max-w-[1280px] w-full mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D1D1D] border border-[#404040] text-white rounded-lg hover:border-[#8469EF] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться в админ панель
            </Link>

            {/* Tournament Details Component */}
            <TournamentDetails 
              tournament={tournament}
              currentUser={currentUser}
            />
          </div>
        </div>
      </AuthGuard>
    </AdminWrapper>
  );
}