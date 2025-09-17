'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usersAPI, Player } from '../../api/users';
import { clubsAPI, Club } from '../../api/clubs';

// Component for a single leaderboard item
const LeaderboardItem = ({ 
  rank, 
  name, 
  points, 
  elo, 
  isPlayer = false,
  playerId,
  clubId
}: { 
  rank: number; 
  name: string; 
  points: number; 
  elo: number;
  isPlayer?: boolean;
  playerId?: number;
  clubId?: number;
}) => {
  const content = (
    <div className="bg-[#1A1A1A] rounded-lg p-3 flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 font-bold w-4">{rank}</span>
        <span className="truncate">{name}</span>
      </div>
      <div className="flex items-center gap-4 text-gray-400">
        <span>{elo}</span>
      </div>
    </div>
  );

  // Если это игрок и есть ID, делаем кликабельным
  if (isPlayer && playerId) {
    return (
      <Link href={`/players/${playerId}`} className="block">
        {content}
      </Link>
    );
  }

  // Если это клуб и есть ID, делаем кликабельным
  if (!isPlayer && clubId) {
    return (
      <Link href={`/clubs/${clubId}`} className="block">
        {content}
      </Link>
    );
  }

  // Иначе возвращаем обычный div
  return content;
};

// This is the card component for a single leaderboard (Clubs or Players)
const LeaderboardCard = ({ 
  title, 
  hasBlueBorder = false, 
  items, 
  loading, 
  error,
  isPlayer = false,
  showAllLink 
}: { 
  title: string; 
  hasBlueBorder?: boolean;
  items: Array<{ rank: number; name: string; points: number; elo: number; playerId?: number; clubId?: number; }>;
  loading: boolean;
  error: string | null;
  isPlayer?: boolean;
  showAllLink: string;
}) => {
  const borderClass = hasBlueBorder ? 'border-blue-500' : 'border-gray-800';

  return (
    <div className={`bg-[#111111] border ${borderClass} rounded-2xl p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={showAllLink} className="text-sm text-purple-400 hover:underline">
          Показать все &gt;
        </Link>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-3 px-3">
        <span>{isPlayer ? 'Игрок' : 'Клуб'}</span>
        <div className="flex gap-8">
          <span>ELO</span>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-lg p-3 flex items-center justify-between text-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <div className="w-24 h-4 bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <LeaderboardItem 
              key={item.rank} 
              rank={item.rank} 
              name={item.name} 
              points={item.points}
              elo={item.elo}
              isPlayer={isPlayer}
              playerId={item.playerId}
              clubId={item.clubId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// This is the main component for the leaderboards section
const Leaderboards = () => {
  const [topPlayers, setTopPlayers] = useState<Array<{ rank: number; name: string; points: number; elo: number; playerId?: number; }>>([]);
  const [topClubs, setTopClubs] = useState<Array<{ rank: number; name: string; points: number; elo: number; clubId?: number; }>>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);
  const [clubsError, setClubsError] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем топ игроков
    const loadTopPlayers = async () => {
      try {
        setPlayersLoading(true);
        setPlayersError(null);
        
        const response = await usersAPI.getAllPlayers({
          limit: 8,
          sortBy: 'eloRating',
          sortOrder: 'desc'
        });
        
        // Выводим в консоль данные API для игроков
        console.log('=== API ДАННЫЕ ДЛЯ ТОПА ИГРОКОВ ===');
        console.log('Полный ответ API для игроков:', response);
        console.log('Количество игроков:', response.players?.length || 0);
        
        // Показываем детали каждого игрока
        if (response.players) {
          response.players.forEach((player, index) => {
            console.log(`Игрок ${index + 1}:`, {
              id: player.id,
              nickname: player.nickname,
              email: player.email,
              avatar: player.avatar,
              role: player.role,
              totalPoints: player.totalPoints,
              totalGames: player.totalGames,
              totalWins: player.totalWins,
              eloRating: player.eloRating,
              clubName: player.clubName,
              confirmed: player.confirmed
            });
          });
        }
        
        const players = response.players.map((player, index) => ({
          rank: index + 1,
          name: player.nickname,
          points: 0, // Баллы не отображаются
          elo: player.eloRating || 1000, // Используем реальное значение ELO из API
          playerId: player.id
        }));
        
        console.log('Обработанные данные для отображения игроков:', players);
        console.log('=== КОНЕЦ API ДАННЫХ ДЛЯ ТОПА ИГРОКОВ ===');
        
        setTopPlayers(players);
      } catch (error) {
        console.error('Ошибка загрузки топ игроков:', error);
        setPlayersError('Не удалось загрузить топ игроков');
      } finally {
        setPlayersLoading(false);
      }
    };

    // Загружаем топ клубов
    const loadTopClubs = async () => {
      try {
        setClubsLoading(true);
        setClubsError(null);
        
        const clubs = await clubsAPI.getClubs();
        
        // Выводим в консоль данные API для клубов
        console.log('=== API ДАННЫЕ ДЛЯ ТОПА КЛУБОВ ===');
        console.log('Полные данные клубов от API:', clubs);
        console.log('Количество клубов:', clubs.length);
        
        // Показываем детали каждого клуба
        clubs.forEach((club, index) => {
          console.log(`Клуб ${index + 1}:`, {
            id: club.id,
            name: club.name,
            description: club.description,
            city: club.city,
            status: club.status,
            elo: club.elo,
            membersCount: club.members.length,
            administratorsCount: club.administrators.length,
            owner: club.owner,
            createdAt: club.createdAt,
            socialMediaLink: club.socialMediaLink
          });
        });
        
        // Сортируем клубы по ELO рейтингу (по убыванию)
        const sortedClubs = clubs
          .sort((a, b) => (b.elo || 0) - (a.elo || 0))
          .slice(0, 8)
          .map((club, index) => ({
            rank: index + 1,
            name: club.name,
            points: 0, // Баллы не отображаются для клубов
            elo: club.elo || 1000, // Используем реальное значение ELO из API
            clubId: club.id
          }));
        
        console.log('Обработанные данные для отображения:', sortedClubs);
        console.log('=== КОНЕЦ API ДАННЫХ ДЛЯ ТОПА КЛУБОВ ===');
        
        setTopClubs(sortedClubs);
      } catch (error) {
        console.error('Ошибка загрузки топ клубов:', error);
        setClubsError('Не удалось загрузить топ клубов');
      } finally {
        setClubsLoading(false);
      }
    };

    loadTopPlayers();
    loadTopClubs();
  }, []);

  return (
    <div className="text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LeaderboardCard 
            title="Топ Клубов" 
            items={topClubs}
            loading={clubsLoading}
            error={clubsError}
            isPlayer={false}
            showAllLink="/clubs"
          />
          <LeaderboardCard 
            title="Топ Игроков" 
            items={topPlayers}
            loading={playersLoading}
            error={playersError}
            isPlayer={true}
            showAllLink="/players"
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboards; 