'use client';
import React, { useState, useEffect } from 'react';
import { User, X, Loader2, Plus } from 'lucide-react';
import { tournamentsAPI, Tournament, TournamentParticipant } from '../../api/tournaments';
import FillTournamentModal from './FillTournamentModal';

interface PlayerSearchProps {
  tournament: Tournament;
  currentUser: any;
  onPlayerAdded?: () => void;
}

export default function PlayerSearch({ tournament, currentUser, onPlayerAdded }: PlayerSearchProps) {
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Проверяем права пользователя
  const isReferee = currentUser?.id === tournament.referee?.id;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'system_admin';
  const isClubOwner = currentUser?.role === 'club_owner' && currentUser?.id === tournament.club?.owner?.id;
  const isClubAdmin = currentUser?.role === 'club_admin' && currentUser?.id === tournament.club?.owner?.id;
  const hasPermission = isReferee || isAdmin || isClubOwner || isClubAdmin;

  // Загружаем участников турнира при монтировании компонента
  useEffect(() => {
    if (hasPermission && tournament.id) {
      loadParticipants();
    }
  }, [tournament.id, hasPermission]);

  const loadParticipants = async () => {
    try {
      setIsLoadingParticipants(true);
      
      // Временно отключаем загрузку участников, так как API не готов
      setParticipants([]);
      
      // TODO: Раскомментировать когда API будет готов
      // const participantsData = await tournamentsAPI.getTournamentParticipants(tournament.id);
      // setParticipants(participantsData);
      
    } catch (error) {
      console.error('Ошибка загрузки участников:', error);
      // В случае ошибки показываем пустой список
      setParticipants([]);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const handleFillTournament = async (players: string[], tablesCount: number, targetPlayers: number, roundsCount: number, gamesCount: number) => {
    try {
      // Создаем тестовых участников из списка игроков
      const testParticipants: TournamentParticipant[] = players.map((nickname, index) => ({
        id: index + 1,
        userId: index + 1,
        tournamentId: tournament.id,
        nickname: nickname,
        email: `${nickname.toLowerCase().replace(/\s+/g, '')}@example.com`,
        status: 'registered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setParticipants(testParticipants);
      
      if (onPlayerAdded) {
        onPlayerAdded();
      }
    } catch (error) {
      console.error('Ошибка заполнения турнира:', error);
      throw error;
    }
  };

  const handleRemovePlayer = async (participantId: number) => {
    try {
      // Временно отключаем вызов API, так как он не готов
      // Удаляем участника из локального состояния
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      
      // TODO: Раскомментировать когда API будет готов
      // await tournamentsAPI.removeTournamentParticipant(tournament.id, participantId);
      // setParticipants(prev => prev.filter(p => p.id !== participantId));
      
      if (onPlayerAdded) {
        onPlayerAdded();
      }
    } catch (error) {
      console.error('Ошибка удаления игрока:', error);
    }
  };

  // Временно разрешаем тестирование для пользователей с ролью player
  if (!hasPermission && currentUser?.role !== 'player') {
    return null; // Показываем только пользователям с правами или для тестирования
  }

  return (
    <>
      {hasPermission && (
        <div className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#8469EF]" />
            Управление участниками турнира
          </h3>

          {/* Кнопка добавления игроков */}
          <div className="mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-3 bg-[#8469EF] text-white rounded-lg hover:bg-[#6B4FFF] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Заполнить турнир
            </button>
            <p className="text-gray-400 text-sm mt-2 text-center">
              Поиск игроков или добавление вручную
            </p>
          </div>

        {/* Список участников турнира - показываем только если есть участники */}
        {participants.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-white mb-3">
              Участники турнира ({participants.length})
              {isLoadingParticipants && (
                <Loader2 className="inline ml-2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </h4>
          
            {isLoadingParticipants ? (
              <div className="text-gray-400 text-sm">Загрузка участников...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8469EF] flex items-center justify-center text-white text-sm font-bold">
                        {participant.nickname?.charAt(0) || participant.email?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{participant.nickname || 'Без имени'}</div>
                        <div className="text-gray-400 text-sm">{participant.email}</div>
                        <div className="text-xs text-gray-500">
                          Статус: {participant.status === 'confirmed' ? 'Подтвержден' : 
                                   participant.status === 'rejected' ? 'Отклонен' : 'Зарегистрирован'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(participant.id)}
                      className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                      title="Удалить участника"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Модальное окно добавления игроков */}
        <FillTournamentModal
          tournament={tournament}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFillTournament={handleFillTournament}
          currentUser={currentUser}
        />
        </div>
      )}
    </>
  );
} 