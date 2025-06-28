import React from 'react';

// This is a placeholder component for a single leaderboard item
const LeaderboardItem = ({ rank, name }: { rank: number; name: string }) => (
  <div className="bg-[#1A1A1A] rounded-lg p-3 flex items-center justify-between text-sm">
    <div className="flex items-center gap-3">
      <span className="text-gray-400 font-bold w-4">{rank}</span>
      <span>{name}</span>
    </div>
    {/* Placeholder for other stats */}
    <div className="flex items-center gap-4 text-gray-400">
      <span>1234</span>
      <span>1500</span>
    </div>
  </div>
);

// This is the card component for a single leaderboard (Clubs or Players)
const LeaderboardCard = ({ title, hasBlueBorder = false }: { title: string; hasBlueBorder?: boolean }) => {
  // Placeholder data
  const items = [
    { rank: 1, name: 'Placeholder Club/Player 1' },
    { rank: 2, name: 'Placeholder Club/Player 2' },
    { rank: 3, name: 'Placeholder Club/Player 3' },
    { rank: 4, name: 'Placeholder Club/Player 4' },
    { rank: 5, name: 'Placeholder Club/Player 5' },
    { rank: 6, name: 'Placeholder Club/Player 6' },
    { rank: 7, name: 'Placeholder Club/Player 7' },
    { rank: 8, name: 'Placeholder Club/Player 8' },
  ];

  const borderClass = hasBlueBorder ? 'border-blue-500' : 'border-gray-800';

  return (
    <div className={`bg-[#111111] border ${borderClass} rounded-2xl p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <a href="#" className="text-sm text-purple-400 hover:underline">
          Показать все &gt;
        </a>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-3 px-3">
        <span>Клуб</span>
        <div className="flex gap-8">
          <span>Баллы</span>
          <span>ELO</span>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <LeaderboardItem key={item.rank} rank={item.rank} name={item.name} />
        ))}
      </div>
    </div>
  );
};

// This is the main component for the leaderboards section
const Leaderboards = () => {
  return (
    <div className="text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LeaderboardCard title="Топ Клубов" />
          <LeaderboardCard title="Топ Игроков" hasBlueBorder />
        </div>
      </div>
    </div>
  );
};

export default Leaderboards; 