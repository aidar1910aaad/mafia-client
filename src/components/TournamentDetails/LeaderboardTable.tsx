import React, { useMemo } from 'react';
import { Tournament } from '../../api/tournaments';

interface LeaderboardTableProps {
  tournament?: Tournament;
}

interface PlayerStats {
  playerId: number;
  nickname: string;
  totalPoints: number;
  totalBonusPoints: number;
  totalPenaltyPoints: number;
  totalLh: number;
  totalCi: number;
  gamesPlayed: number;
  roleStats: {
    [role: string]: { played: number; won: number };
  };
}

const LeaderboardTable = ({ tournament }: LeaderboardTableProps) => {
  // Если турнир не загружен, показываем загрузку
  if (!tournament) {
    return (
      <div className="overflow-auto rounded-lg border border-gray-800 bg-[#111111]">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Загрузка турнирной таблицы...</div>
        </div>
      </div>
    );
  }

  // Вычисляем статистику игроков из реальных данных турнира
  const playersStats = useMemo(() => {
    if (!tournament.games) return [];

    const statsMap = new Map<number, PlayerStats>();

    // Проходим по всем играм турнира
    tournament.games.forEach(game => {
      if (!game.players) return;

      game.players.forEach(player => {
        const playerId = player.player?.id;
        const nickname = player.player?.nickname;
        
        if (!playerId || !nickname) return;

        // Получаем или создаем статистику игрока
        if (!statsMap.has(playerId)) {
          statsMap.set(playerId, {
            playerId,
            nickname,
            totalPoints: 0,
            totalBonusPoints: 0,
            totalPenaltyPoints: 0,
            totalLh: 0,
            totalCi: 0,
            gamesPlayed: 0,
            roleStats: {}
          });
        }

        const playerStats = statsMap.get(playerId)!;
        
        // Обновляем статистику
        playerStats.totalPoints += player.points || 0;
        playerStats.totalBonusPoints += player.bonusPoints || 0;
        playerStats.totalPenaltyPoints += player.penaltyPoints || 0;
        playerStats.totalLh += player.lh || 0;
        playerStats.totalCi += player.ci || 0;
        playerStats.gamesPlayed += 1;

        // Обновляем статистику по ролям
        const role = player.role || 'CITIZEN';
        if (!playerStats.roleStats[role]) {
          playerStats.roleStats[role] = { played: 0, won: 0 };
        }
        playerStats.roleStats[role].played += 1;

        // Определяем победу по сумме очков игрока
        // Если общая сумма очков (points + bonusPoints - penaltyPoints) >= 1, то игрок выиграл в этой роли
        const totalPlayerPoints = (player.points || 0) + (player.bonusPoints || 0) - (player.penaltyPoints || 0);
        if (totalPlayerPoints >= 1) {
          playerStats.roleStats[role].won += 1;
        }
      });
    });

    // Сортируем по общим очкам
    return Array.from(statsMap.values()).sort((a, b) => 
      (b.totalPoints + b.totalBonusPoints - b.totalPenaltyPoints) - 
      (a.totalPoints + a.totalBonusPoints - a.totalPenaltyPoints)
    );
  }, [tournament.games]);

  // Функция для получения статистики по роли
  const getRoleStats = (stats: PlayerStats, role: string) => {
    const roleData = stats.roleStats[role];
    if (!roleData || roleData.played === 0) return "";
    return `${roleData.won}/${roleData.played}`;
  };

  if (playersStats.length === 0) {
    return (
      <div className="overflow-auto rounded-lg border border-gray-800 bg-[#111111]">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Нет данных для отображения турнирной таблицы</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-gray-800 bg-[#111111]">
      <table className="w-full text-sm text-white border-collapse">
        <thead className="bg-[#1E1E1E]">
          <tr>
            {["#", "Игрок", "Σ", "Σ+", "Σ-", "ЛХ", "Ci", "Игр", "Мафия", "Дон", "Шериф", "Доктор", "Маньяк", "Красотка", "Мирный"].map((col, i) => (
              <th key={i} className="border border-gray-700 px-2 py-2 whitespace-nowrap font-normal text-xs">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {playersStats.map((player, i) => {
            return (
              <tr key={player.playerId} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="border-r border-gray-700 px-2 py-2 font-medium">{i + 1}</td>
                <td className="border-r border-gray-700 px-2 py-2 text-left whitespace-nowrap font-medium">
                  {player.nickname}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 font-bold text-yellow-400">
                  {Number(player.totalPoints.toFixed(2))}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-green-400">
                  {Number(player.totalBonusPoints.toFixed(2))}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-red-400">
                  {Number(player.totalPenaltyPoints.toFixed(2))}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-blue-400">
                  {Number(player.totalLh.toFixed(2))}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-purple-400">
                  {Number(player.totalCi.toFixed(2))}
                </td>
                <td className="border-r border-gray-700 px-2 py-2">
                  {player.gamesPlayed}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-red-300">
                  {getRoleStats(player, 'MAFIA')}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-red-400">
                  {getRoleStats(player, 'DON')}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-yellow-300">
                  {getRoleStats(player, 'DETECTIVE')}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-green-300">
                  {getRoleStats(player, 'DOCTOR')}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-orange-300">
                  {getRoleStats(player, 'MANIAC')}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-pink-300">
                  {getRoleStats(player, 'BEAUTY')}
                </td>
                <td className="border-r border-gray-700 px-2 py-2 text-blue-300">
                  {getRoleStats(player, 'CITIZEN')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable; 