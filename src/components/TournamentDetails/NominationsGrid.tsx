import React, { useMemo } from 'react';
import { Tournament } from '../../api/tournaments';
import { GamePlayer } from '../../api/games';
import { Trophy, Crown, Shield, Heart, Skull, User, Zap, Stethoscope } from 'lucide-react';

interface NominationsGridProps {
  tournament?: Tournament;
}

interface PlayerStats {
  id: number;
  nickname: string;
  totalPoints: number;
  totalBonusPoints: number;
  totalPenaltyPoints: number;
  totalGames: number;
  totalWins: number;
  roleStats: {
    [role: string]: {
      gamesPlayed: number;
      gamesWon: number;
      totalPoints: number;
    };
  };
}

interface Nomination {
  title: string;
  players: string[];
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NominationCard = ({ title, players, color, icon: Icon }: { 
  title: string; 
  players: string[]; 
  color: string; 
  icon: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <div className="bg-[#1C1C1C] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 mr-2" style={{ color }} />
        <h3 className={`text-lg font-bold`} style={{ color }}>
          {title}
        </h3>
      </div>
      <div className="space-y-2 text-center text-gray-300">
        {players.map((player, index) => (
          <div key={index} className="flex items-center justify-center">
            {index === 0 && players.length > 1 && (
              <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
            )}
            {index === 1 && players.length > 2 && (
              <Trophy className="w-4 h-4 text-gray-300 mr-2" />
            )}
            {index === 2 && players.length > 2 && (
              <Trophy className="w-4 h-4 text-orange-400 mr-2" />
            )}
            <span className={index === 0 ? 'font-semibold text-white' : ''}>
              {player}
            </span>
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
              totalGames: 0,
              totalWins: 0,
              roleStats: {}
            });
          }

          const stats = playerStatsMap.get(playerId)!;
          stats.totalPoints += gamePlayer.points;
          stats.totalBonusPoints += gamePlayer.bonusPoints;
          stats.totalPenaltyPoints += gamePlayer.penaltyPoints;
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
              totalPoints: 0
            };
          }

          stats.roleStats[role].gamesPlayed += 1;
          stats.roleStats[role].totalPoints += gamePlayer.bonusPoints;

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
        { title: 'MVP', players: ['Нет данных'], color: '#FFFFFF', icon: Trophy },
        { title: 'Дон', players: ['Нет данных'], color: '#FFFFFF', icon: Crown },
        { title: 'Шериф', players: ['Нет данных'], color: '#FFFFFF', icon: Shield },
        { title: 'Красотка', players: ['Нет данных'], color: '#FF7AF3', icon: Heart },
        { title: 'Красный', players: ['Нет данных'], color: '#FF4A4A', icon: Skull },
        { title: 'Черный', players: ['Нет данных'], color: '#FFFFFF', icon: User },
        { title: 'Маньяк', players: ['Нет данных'], color: '#E4AFFF', icon: Zap },
        { title: 'Доктор', players: ['Нет данных'], color: '#87CEEB', icon: Stethoscope },
      ];
    }

    // MVP - игрок с наибольшим количеством дополнительных баллов за роли
    const mvp = calculatePlayerStats
      .sort((a, b) => b.totalBonusPoints - a.totalBonusPoints)
      .slice(0, 3)
      .map(p => p.nickname);

    // Дон - лучший игрок в роли Дона по дополнительным баллам
    const don = calculatePlayerStats
      .filter(p => p.roleStats['DON'])
      .sort((a, b) => {
        const aDon = a.roleStats['DON'];
        const bDon = b.roleStats['DON'];
        // Сортируем по дополнительным баллам за роль Дона
        return bDon.totalPoints - aDon.totalPoints;
      })
      .slice(0, 3)
      .map(p => p.nickname);

    // Шериф - лучший игрок в роли Детектива по дополнительным баллам
    const sheriff = calculatePlayerStats
      .filter(p => p.roleStats['DETECTIVE'])
      .sort((a, b) => {
        const aDet = a.roleStats['DETECTIVE'];
        const bDet = b.roleStats['DETECTIVE'];
        // Сортируем по дополнительным баллам за роль Детектива
        return bDet.totalPoints - aDet.totalPoints;
      })
      .slice(0, 3)
      .map(p => p.nickname);

    // Красотка - лучший игрок в роли Красотки по дополнительным баллам
    const beauty = calculatePlayerStats
      .filter(p => p.roleStats['BEAUTY'])
      .sort((a, b) => {
        const aBeauty = a.roleStats['BEAUTY'];
        const bBeauty = b.roleStats['BEAUTY'];
        // Сортируем по дополнительным баллам за роль Красотки
        return bBeauty.totalPoints - aBeauty.totalPoints;
      })
      .slice(0, 3)
      .map(p => p.nickname);

    // Красный - лучший игрок в роли Мафии по дополнительным баллам
    const red = calculatePlayerStats
      .filter(p => p.roleStats['MAFIA'])
      .sort((a, b) => {
        const aMafia = a.roleStats['MAFIA'];
        const bMafia = b.roleStats['MAFIA'];
        // Сортируем по дополнительным баллам за роль Мафии
        return bMafia.totalPoints - aMafia.totalPoints;
      })
      .slice(0, 3)
      .map(p => p.nickname);

    // Черный - лучший игрок в роли Мирного по дополнительным баллам
    const black = calculatePlayerStats
      .filter(p => p.roleStats['CITIZEN'])
      .sort((a, b) => {
        const aCitizen = a.roleStats['CITIZEN'];
        const bCitizen = b.roleStats['CITIZEN'];
        // Сортируем по дополнительным баллам за роль Мирного
        return bCitizen.totalPoints - aCitizen.totalPoints;
      })
      .slice(0, 3)
      .map(p => p.nickname);

    // Маньяк - лучший игрок в роли Маньяка по дополнительным баллам
    const maniac = calculatePlayerStats
      .filter(p => p.roleStats['MANIAC'])
      .sort((a, b) => {
        const aManiac = a.roleStats['MANIAC'];
        const bManiac = b.roleStats['MANIAC'];
        // Сортируем по дополнительным баллам за роль Маньяка
        return bManiac.totalPoints - aManiac.totalPoints;
      })
      .slice(0, 3)
      .map(p => p.nickname);

    // Доктор - лучший игрок в роли Доктора по дополнительным баллам
    const doctor = calculatePlayerStats
      .filter(p => p.roleStats['DOCTOR'])
      .sort((a, b) => {
        const aDoctor = a.roleStats['DOCTOR'];
        const bDoctor = b.roleStats['DOCTOR'];
        // Сортируем по дополнительным баллам за роль Доктора
        return bDoctor.totalPoints - aDoctor.totalPoints;
      })
      .slice(0, 3)
      .map(p => p.nickname);

    return [
      { title: 'MVP', players: mvp.length > 0 ? mvp : ['Нет данных'], color: '#FFFFFF', icon: Trophy },
      { title: 'Дон', players: don.length > 0 ? don : ['Нет данных'], color: '#FFFFFF', icon: Crown },
      { title: 'Шериф', players: sheriff.length > 0 ? sheriff : ['Нет данных'], color: '#FFFFFF', icon: Shield },
      { title: 'Красотка', players: beauty.length > 0 ? beauty : ['Нет данных'], color: '#FF7AF3', icon: Heart },
      { title: 'Красный', players: red.length > 0 ? red : ['Нет данных'], color: '#FF4A4A', icon: Skull },
      { title: 'Черный', players: black.length > 0 ? black : ['Нет данных'], color: '#FFFFFF', icon: User },
      { title: 'Маньяк', players: maniac.length > 0 ? maniac : ['Нет данных'], color: '#E4AFFF', icon: Zap },
      { title: 'Доктор', players: doctor.length > 0 ? doctor : ['Нет данных'], color: '#87CEEB', icon: Stethoscope },
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
          Номинации рассчитываются на основе дополнительных баллов за роли за весь турнир
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