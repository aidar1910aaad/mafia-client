import React from 'react';

const NominationCard = ({ title, players, color }: { title: string; players: string[]; color: string }) => {
  return (
    <div className="bg-[#1C1C1C] rounded-lg p-4">
      <h3 className={`text-lg font-bold mb-3 text-center`} style={{ color }}>
        {title}
      </h3>
      <div className="space-y-2 text-center text-gray-300">
        {players.map((player, index) => (
          <p key={index}>{player}</p>
        ))}
      </div>
    </div>
  );
};

const NominationsGrid = () => {
  const nominations = [
    { title: 'MVP', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#FFFFFF' },
    { title: 'Дон', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#FFFFFF' },
    { title: 'Шериф', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#FFFFFF' },
    { title: 'Красотка', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#FF7AF3' },
    { title: 'Красный', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#FF4A4A' },
    { title: 'Черный', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#FFFFFF' },
    { title: 'Маньяк', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#E4AFFF' },
    { title: 'Доктор', players: ['Керамбит', 'Diablo', 'BWDMoscow'], color: '#87CEEB' },
  ];

  return (
    <div className="bg-[#111111] rounded-2xl p-6 border border-gray-800">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nominations.map((nom) => (
          <NominationCard key={nom.title} title={nom.title} players={nom.players} color={nom.color} />
        ))}
      </div>
    </div>
  );
};

export default NominationsGrid; 