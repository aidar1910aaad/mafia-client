import React, { useMemo } from 'react';
import { Tournament } from '../../api/tournaments';
import { GamePlayer } from '../../api/games';
import { Trophy, Crown, Shield, Heart, Skull, User, Zap, Stethoscope, Target } from 'lucide-react';

interface NominationsGridProps {
  tournament?: Tournament;
}

interface PlayerStats {
  id: number;
  nickname: string;
  totalPoints: number;
  totalBonusPoints: number;
  totalPenaltyPoints: number;
  totalLh: number;
  totalCi: number;
  totalGames: number;
  totalWins: number;
  roleStats: {
    [role: string]: {
      gamesPlayed: number;
      gamesWon: number;
      totalPoints: number;
      totalPenaltyPoints: number;
      totalLh: number;
      totalCi: number;
    };
  };
}

interface PlayerNomination {
  nickname: string;
  totalPoints: number;
  totalBonusPoints: number;
  totalPenaltyPoints: number;
  totalLh: number;
  totalCi: number;
  rating: number;
}

interface Nomination {
  title: string;
  players: PlayerNomination[];
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NominationCard = ({ title, players, color, icon: Icon }: { 
  title: string; 
  players: PlayerNomination[]; 
  color: string; 
  icon: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <div className="bg-[#1C1C1C] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-center mb-3">
        <div className="w-5 h-5 mr-2" style={{ color }}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className={`text-lg font-bold`} style={{ color }}>
          {title}
        </h3>
      </div>
      <div className="space-y-1 text-center text-gray-300">
        {players.map((player, index) => (
          <div key={index} className="rounded-lg p-3">
            <div className="flex items-center justify-center mb-2">
              {index === 0 && (
                <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
              )}
              {index === 1 && (
                <Trophy className="w-4 h-4 text-gray-300 mr-2" />
              )}
              {index === 2 && (
                <Trophy className="w-4 h-4 text-orange-400 mr-2" />
              )}
              <span className={index === 0 ? 'font-semibold text-white' : 'font-medium text-white'}>
                {player.nickname}
              </span>
            </div>
            
          </div>
        ))}
        {players.length === 0 && (
          <p className="text-gray-500 italic">Нет данных</p>
        )}
      </div>
    </div>
  );
};

const NominationsGrid = ({ tournament }: NominationsGridProps) => {
  // Функция для расчета статистики игроков
  const calculatePlayerStats = useMemo((): PlayerStats[] => {
    if (!tournament?.games) return [];

    const playerStatsMap = new Map<number, PlayerStats>();

    // Проходим по всем играм турнира (включая финальные)
    tournament.games.forEach(game => {
      if (game.players) {
        game.players.forEach((gamePlayer: GamePlayer) => {
          if (!gamePlayer.player) return;

          const playerId = gamePlayer.player.id;
          const nickname = gamePlayer.player.nickname;
          const role = gamePlayer.role;

          if (!playerStatsMap.has(playerId)) {
            playerStatsMap.set(playerId, {
              id: playerId,
              nickname,
              totalPoints: 0,
              totalBonusPoints: 0,
              totalPenaltyPoints: 0,
              totalLh: 0,
              totalCi: 0,
              totalGames: 0,
              totalWins: 0,
              roleStats: {}
            });
          }

          const stats = playerStatsMap.get(playerId)!;
          stats.totalPoints += gamePlayer.points;
          stats.totalBonusPoints += gamePlayer.bonusPoints;
          stats.totalPenaltyPoints += gamePlayer.penaltyPoints;
          stats.totalLh += gamePlayer.lh || 0;
          stats.totalCi += gamePlayer.ci || 0;
          stats.totalGames += 1;

          // Считаем победы (если игра завершена и есть результат)
          if (game.result) {
            let isWin = false;
            
            if (game.result === 'MAFIA_WIN') {
              // Мафия выиграла - побеждают MAFIA, DON, MANIAC
              isWin = role === 'MAFIA' || role === 'DON' || role === 'MANIAC';
            } else if (game.result === 'CITIZEN_WIN') {
              // Мирные выиграли - побеждают CITIZEN, DOCTOR, DETECTIVE, BEAUTY
              isWin = role === 'CITIZEN' || role === 'DOCTOR' || role === 'DETECTIVE' || role === 'BEAUTY';
            }
            
            if (isWin) {
              stats.totalWins += 1;
            }
          }

          // Статистика по ролям
          if (!stats.roleStats[role]) {
            stats.roleStats[role] = {
              gamesPlayed: 0,
              gamesWon: 0,
              totalPoints: 0,
              totalPenaltyPoints: 0,
              totalLh: 0,
              totalCi: 0
            };
          }

          stats.roleStats[role].gamesPlayed += 1;
          stats.roleStats[role].totalPoints += gamePlayer.bonusPoints;
          stats.roleStats[role].totalPenaltyPoints += gamePlayer.penaltyPoints;
          stats.roleStats[role].totalLh += gamePlayer.lh || 0;
          stats.roleStats[role].totalCi += gamePlayer.ci || 0;

          if (game.result) {
            let isWin = false;
            
            if (game.result === 'MAFIA_WIN') {
              // Мафия выиграла - побеждают MAFIA, DON, MANIAC
              isWin = role === 'MAFIA' || role === 'DON' || role === 'MANIAC';
            } else if (game.result === 'CITIZEN_WIN') {
              // Мирные выиграли - побеждают CITIZEN, DOCTOR, DETECTIVE, BEAUTY
              isWin = role === 'CITIZEN' || role === 'DOCTOR' || role === 'DETECTIVE' || role === 'BEAUTY';
            }
            
            if (isWin) {
              stats.roleStats[role].gamesWon += 1;
            }
          }
        });
      }
    });

    return Array.from(playerStatsMap.values());
  }, [tournament?.games]);

  // Функция для расчета номинаций
  const nominations = useMemo((): Nomination[] => {
    if (calculatePlayerStats.length === 0) {
      return [
        { title: 'MVP', players: [], color: '#FFFFFF', icon: Trophy },
        { title: 'Дон', players: [], color: '#FFFFFF', icon: Crown },
        { title: 'Шериф', players: [], color: '#FFFFFF', icon: Shield },
        { title: 'Красотка', players: [], color: '#FF7AF3', icon: Heart },
        { title: 'Мафия', players: [], color: '#FF4A4A', icon: Target },
        { title: 'Мирный', players: [], color: '#FFFFFF', icon: User },
        { title: 'Маньяк', players: [], color: '#E4AFFF', icon: Zap },
        { title: 'Доктор', players: [], color: '#87CEEB', icon: Stethoscope },
      ];
    }

    // Функция для расчета комплексного рейтинга игрока
    const calculatePlayerRating = (player: PlayerStats) => {
      // Учитываем только: бонусы - штрафы + LH + CI (без базовых очков)
      return player.totalBonusPoints - player.totalPenaltyPoints + player.totalLh + player.totalCi;
    };

    // Функция для расчета рейтинга игрока в конкретной роли
    const calculateRoleRating = (player: PlayerStats, role: string) => {
      const roleStats = player.roleStats[role];
      if (!roleStats) return 0;
      
      // Для роли учитываем: бонусы за роль - штрафы за роль + LH + CI в этой роли
      return roleStats.totalPoints - roleStats.totalPenaltyPoints + roleStats.totalLh + roleStats.totalCi;
    };

    // MVP - игрок с наибольшим комплексным рейтингом
    const mvp = calculatePlayerStats
      .sort((a, b) => calculatePlayerRating(b) - calculatePlayerRating(a))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не показываем в MVP
        totalBonusPoints: p.totalBonusPoints,
        totalPenaltyPoints: p.totalPenaltyPoints,
        totalLh: p.totalLh,
        totalCi: p.totalCi,
        rating: calculatePlayerRating(p)
      }));

    // Дон - лучший игрок в роли Дона по комплексному рейтингу
    const don = calculatePlayerStats
      .filter(p => p.roleStats['DON'] && calculateRoleRating(p, 'DON') > 0)
      .sort((a, b) => calculateRoleRating(b, 'DON') - calculateRoleRating(a, 'DON'))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не учитываются в ролевых номинациях
        totalBonusPoints: p.roleStats['DON'].totalPoints,
        totalPenaltyPoints: p.roleStats['DON'].totalPenaltyPoints, // Штрафы за роль
        totalLh: p.roleStats['DON'].totalLh,
        totalCi: p.roleStats['DON'].totalCi,
        rating: calculateRoleRating(p, 'DON')
      }));

    // Шериф - лучший игрок в роли Детектива по комплексному рейтингу
    const sheriff = calculatePlayerStats
      .filter(p => p.roleStats['DETECTIVE'] && calculateRoleRating(p, 'DETECTIVE') > 0)
      .sort((a, b) => calculateRoleRating(b, 'DETECTIVE') - calculateRoleRating(a, 'DETECTIVE'))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не учитываются в ролевых номинациях
        totalBonusPoints: p.roleStats['DETECTIVE'].totalPoints,
        totalPenaltyPoints: p.roleStats['DETECTIVE'].totalPenaltyPoints, // Штрафы за роль
        totalLh: p.roleStats['DETECTIVE'].totalLh,
        totalCi: p.roleStats['DETECTIVE'].totalCi,
        rating: calculateRoleRating(p, 'DETECTIVE')
      }));

    // Красотка - лучший игрок в роли Красотки по комплексному рейтингу
    const beauty = calculatePlayerStats
      .filter(p => p.roleStats['BEAUTY'] && calculateRoleRating(p, 'BEAUTY') > 0)
      .sort((a, b) => calculateRoleRating(b, 'BEAUTY') - calculateRoleRating(a, 'BEAUTY'))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не учитываются в ролевых номинациях
        totalBonusPoints: p.roleStats['BEAUTY'].totalPoints,
        totalPenaltyPoints: p.roleStats['BEAUTY'].totalPenaltyPoints, // Штрафы за роль
        totalLh: p.roleStats['BEAUTY'].totalLh,
        totalCi: p.roleStats['BEAUTY'].totalCi,
        rating: calculateRoleRating(p, 'BEAUTY')
      }));

    // Мафия - лучший игрок в роли Мафии по комплексному рейтингу
    const red = calculatePlayerStats
      .filter(p => p.roleStats['MAFIA'] && calculateRoleRating(p, 'MAFIA') > 0)
      .sort((a, b) => calculateRoleRating(b, 'MAFIA') - calculateRoleRating(a, 'MAFIA'))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не учитываются в ролевых номинациях
        totalBonusPoints: p.roleStats['MAFIA'].totalPoints,
        totalPenaltyPoints: p.roleStats['MAFIA'].totalPenaltyPoints, // Штрафы за роль
        totalLh: p.roleStats['MAFIA'].totalLh,
        totalCi: p.roleStats['MAFIA'].totalCi,
        rating: calculateRoleRating(p, 'MAFIA')
      }));

    // Мирный - лучший игрок в роли Мирного по комплексному рейтингу
    const black = calculatePlayerStats
      .filter(p => p.roleStats['CITIZEN'] && calculateRoleRating(p, 'CITIZEN') > 0)
      .sort((a, b) => calculateRoleRating(b, 'CITIZEN') - calculateRoleRating(a, 'CITIZEN'))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не учитываются в ролевых номинациях
        totalBonusPoints: p.roleStats['CITIZEN'].totalPoints,
        totalPenaltyPoints: p.roleStats['CITIZEN'].totalPenaltyPoints, // Штрафы за роль
        totalLh: p.roleStats['CITIZEN'].totalLh,
        totalCi: p.roleStats['CITIZEN'].totalCi,
        rating: calculateRoleRating(p, 'CITIZEN')
      }));

    // Маньяк - лучший игрок в роли Маньяка по комплексному рейтингу
    const maniac = calculatePlayerStats
      .filter(p => p.roleStats['MANIAC'] && calculateRoleRating(p, 'MANIAC') > 0)
      .sort((a, b) => calculateRoleRating(b, 'MANIAC') - calculateRoleRating(a, 'MANIAC'))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не учитываются в ролевых номинациях
        totalBonusPoints: p.roleStats['MANIAC'].totalPoints,
        totalPenaltyPoints: p.roleStats['MANIAC'].totalPenaltyPoints, // Штрафы за роль
        totalLh: p.roleStats['MANIAC'].totalLh,
        totalCi: p.roleStats['MANIAC'].totalCi,
        rating: calculateRoleRating(p, 'MANIAC')
      }));

    // Доктор - лучший игрок в роли Доктора по комплексному рейтингу
    const doctor = calculatePlayerStats
      .filter(p => p.roleStats['DOCTOR'] && calculateRoleRating(p, 'DOCTOR') > 0)
      .sort((a, b) => calculateRoleRating(b, 'DOCTOR') - calculateRoleRating(a, 'DOCTOR'))
      .slice(0, 3)
      .map(p => ({
        nickname: p.nickname,
        totalPoints: 0, // Базовые баллы не учитываются в ролевых номинациях
        totalBonusPoints: p.roleStats['DOCTOR'].totalPoints,
        totalPenaltyPoints: p.roleStats['DOCTOR'].totalPenaltyPoints, // Штрафы за роль
        totalLh: p.roleStats['DOCTOR'].totalLh,
        totalCi: p.roleStats['DOCTOR'].totalCi,
        rating: calculateRoleRating(p, 'DOCTOR')
      }));

    return [
      { title: 'MVP', players: mvp, color: '#FFFFFF', icon: Trophy },
      { title: 'Дон', players: don, color: '#FFFFFF', icon: Crown },
      { title: 'Шериф', players: sheriff, color: '#FFFFFF', icon: Shield },
      { title: 'Красотка', players: beauty, color: '#FF7AF3', icon: Heart },
        { title: 'Мафия', players: red, color: '#FF4A4A', icon: Target },
        { title: 'Мирный', players: black, color: '#FFFFFF', icon: User },
      { title: 'Маньяк', players: maniac, color: '#E4AFFF', icon: Zap },
      { title: 'Доктор', players: doctor, color: '#87CEEB', icon: Stethoscope },
    ];
  }, [calculatePlayerStats]);

  // Если турнир не загружен, показываем загрузку
  if (!tournament) {
    return (
      <div className="bg-[#111111] rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400">Загрузка номинаций...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[#111111] rounded-2xl p-6 border border-gray-800">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Номинации турнира</h2>
        <p className="text-gray-400 text-sm">
          Номинации рассчитываются на основе комплексного рейтинга: бонусы - штрафы + LH + CI за весь турнир
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nominations.map((nom) => (
          <NominationCard 
            key={nom.title} 
            title={nom.title} 
            players={nom.players} 
            color={nom.color} 
            icon={nom.icon}
          />
        ))}
      </div>
      
    </div>
  );
};

export default NominationsGrid; 