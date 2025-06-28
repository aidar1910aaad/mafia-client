import React from 'react';

const RoleTag = ({ role, color }: { role: string; color: string }) => (
  <div className="rounded-md px-2 py-1 text-xs font-semibold" style={{ backgroundColor: color, color: '#000' }}>
    {role}
  </div>
);

const GamesTable = () => {
  const gameData = [
    { name: 'Керамбит', role: { name: 'Шериф', color: '#FFD700' }, score1: 3, score2: 2 },
    { name: 'BWDMoscow', role: { name: 'Маньяк', color: '#E4AFFF' }, score1: 1, score2: '' },
    { name: 'Флай', role: { name: '', color: '' }, score1: 3, score2: 1.5 },
    { name: 'Ганнибал', role: { name: 'Чёрный', color: '#808080' }, score1: 0.5, score2: 0.5 },
    { name: 'Рони', role: { name: '', color: '' }, score1: 3, score2: '' },
    { name: 'Майкрофт', role: { name: 'Доктор', color: '#87CEEB' }, score1: 3, score2: 1.5 },
    { name: 'Жена Миллиардера', role: { name: '', color: '' }, score1: 3, score2: '' },
    { name: 'Баконяко', role: { name: '', color: '' }, score1: 3, score2: '' },
    { name: 'Директор', role: { name: '', color: '' }, score1: 3, score2: 1 },
    { name: 'Drummer', role: { name: 'Дон', color: '#FF4A4A' }, score1: '', score2: '' },
    { name: 'Diablo', role: { name: 'Чёрный', color: '#808080' }, score1: '', score2: '' },
    { name: 'Зажигалочка', role: { name: 'Красотка', color: '#FF7AF3' }, score1: 3, score2: '' },
  ];

  const statsData = [
    { name: 'Керамбит', lh: '2 4 10 11', lhs: 1.5 },
    { name: 'BWDMoscow', lh: '1 4 10 11', lhs: 1.5 },
    { name: 'Флай', lh: '1 2 5 12', lhs: '' },
  ];

  return (
    <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* First table */}
        <div className="lg:col-span-2">
          <table className="w-full text-sm text-white">
            <thead className="text-gray-400">
              <tr className="border-b border-gray-700">
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Игрок</th>
                <th className="px-2 py-2 text-center">Роль</th>
                <th className="px-2 py-2 text-center">Σ</th>
                <th className="px-2 py-2 text-center">Σ+</th>
                <th className="px-2 py-2 text-center">-</th>
              </tr>
            </thead>
            <tbody>
              {gameData.map((player, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="px-2 py-3">{i + 1}</td>
                  <td className="px-2 py-3">{player.name}</td>
                  <td className="px-2 py-3">
                    <div className="flex justify-center">
                      {player.role.name && <RoleTag role={player.role.name} color={player.role.color} />}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">{player.score1}</td>
                  <td className="px-2 py-3 text-center">{player.score2}</td>
                  <td className="px-2 py-3 text-center"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Second table */}
        <div className="lg:col-span-1">
          <table className="w-full text-sm text-white">
            <thead className="text-gray-400">
              <tr className="border-b border-gray-700">
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Игрок</th>
                <th className="px-2 py-2 text-center">ЛХ</th>
                <th className="px-2 py-2 text-center">ЛХС</th>
              </tr>
            </thead>
            <tbody>
              {statsData.map((player, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="px-2 py-3">{i + 1}</td>
                  <td className="px-2 py-3">{player.name}</td>
                  <td className="px-2 py-3 text-center">{player.lh}</td>
                  <td className="px-2 py-3 text-center">{player.lhs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GamesTable; 