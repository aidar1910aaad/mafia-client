'use client';

import React, { useState } from 'react';

interface RatingsTableProps {
  className?: string;
}

// Данные для таблицы распределения очков
const ratingsData = [
  {
    title: "6 звезд - Итоговое место в турнирной таблице",
    data: [
      [1, 160, 145, 140, 135, 130, 125, 120, 115],
      [2, 145, 140, 135, 130, 125, 120, 115, 110],
      [3, 140, 135, 130, 125, 120, 115, 110, 105],
      [4, 135, 130, 125, 120, 115, 110, 105, 100],
      [5, 130, 125, 120, 115, 110, 105, 100, 95],
      [6, 125, 120, 115, 110, 105, 100, 95, 90],
      [7, 120, 115, 110, 105, 100, 95, 90, 85],
      [8, 115, 110, 105, 100, 95, 90, 85, 80],
      [9, null, 105, 100, 95, 90, 85, 80, 75],
      [10, null, null, 95, 90, 85, 80, 75, 70],
      [11, null, null, null, 85, 80, 75, 70, 65],
      [12, null, null, null, null, 75, 70, 65, 60],
      [13, null, null, null, null, null, 65, 60, 55],
      [14, null, null, null, null, null, 60, 55, 50],
      [15, null, null, null, null, null, null, 50, 45],
      [16, null, null, null, null, null, null, 45, 40],
      [17, null, null, null, null, null, null, 45, 40],
      [18, null, null, null, null, null, null, null, 35],
    ]
  },
  {
    title: "5 звезд - Место",
    data: [
      [1, 130, 120, 115, 110, 105, 100, 95, 90],
      [2, 120, 115, 110, 105, 100, 95, 90, 85],
      [3, 115, 110, 105, 100, 95, 90, 85, 80],
      [4, 110, 105, 100, 95, 90, 85, 80, 75],
      [5, 105, 100, 95, 90, 85, 80, 75, 70],
      [6, 100, 95, 90, 85, 80, 75, 70, 65],
      [7, 95, 90, 85, 80, 75, 70, 65, 60],
      [8, 90, 85, 80, 75, 70, 65, 60, 55],
      [9, null, 80, 75, 70, 65, 60, 55, 50],
      [10, null, null, 70, 65, 60, 55, 50, 45],
      [11, null, null, null, 60, 55, 50, 45, 40],
      [12, null, null, null, null, 50, 45, 40, 35],
      [13, null, null, null, null, null, 40, 35, 30],
      [14, null, null, null, null, null, 35, 30, 25],
      [15, null, null, null, null, null, 30, 25, 20],
      [16, null, null, null, null, null, null, null, 15],
      [17, null, null, null, null, null, null, null, 10],
      [18, null, null, null, null, null, null, null, 5],
    ]
  },
  {
    title: "4 звезды - Место",
    data: [
      [1, 115, 95, 90, 85, 80, 75, 70, 65],
      [2, 95, 90, 85, 80, 75, 70, 65, 60],
      [3, 90, 85, 80, 75, 70, 65, 60, 55],
      [4, 85, 80, 75, 70, 65, 60, 55, 50],
      [5, 80, 75, 70, 65, 60, 55, 50, 45],
      [6, 75, 70, 65, 60, 55, 50, 45, 40],
      [7, 70, 65, 60, 55, 50, 45, 40, 35],
      [8, null, 60, 55, 50, 45, 40, 35, 30],
      [9, null, null, 50, 45, 40, 35, 30, 25],
      [10, null, null, null, 40, 35, 30, 25, 20],
      [11, null, null, null, null, 30, 25, 20, 15],
      [12, null, null, null, null, null, 25, 20, 15],
      [13, null, null, null, null, null, null, 15, 10],
      [14, null, null, null, null, null, null, null, 5],
      [15, null, null, null, null, null, null, null, 5],
      [16, null, null, null, null, null, null, null, null],
      [17, null, null, null, null, null, null, null, null],
      [18, null, null, null, null, null, null, null, null],
    ]
  },
  {
    title: "3 звезды - Место",
    data: [
      [1, 100, 90, 85, 80, 75, 70, 65, 60],
      [2, 90, 85, 80, 75, 70, 65, 60, 55],
      [3, 85, 80, 75, 70, 65, 60, 55, 50],
      [4, 80, 75, 70, 65, 60, 55, 50, 45],
      [5, 75, 70, 65, 60, 55, 50, 45, 40],
      [6, 70, 65, 60, 55, 50, 45, 40, 35],
      [7, null, 60, 55, 50, 45, 40, 35, 30],
      [8, null, null, 50, 45, 40, 35, 30, 25],
      [9, null, null, null, 35, 30, 25, 20, 20],
      [10, null, null, null, null, 25, 20, 15, 15],
      [11, null, null, null, null, null, 15, 10, 10],
      [12, null, null, null, null, null, null, 10, 5],
      [13, null, null, null, null, null, null, null, null],
      [14, null, null, null, null, null, null, null, null],
      [15, null, null, null, null, null, null, null, null],
      [16, null, null, null, null, null, null, null, null],
      [17, null, null, null, null, null, null, null, null],
      [18, null, null, null, null, null, null, null, null],
    ]
  },
  {
    title: "2 звезды - Место",
    data: [
      [1, 90, 85, 80, 75, 70, 65, 60, 55],
      [2, 85, 80, 75, 70, 65, 60, 55, 50],
      [3, 80, 75, 70, 65, 60, 55, 50, 45],
      [4, 75, 70, 65, 60, 55, 50, 45, 40],
      [5, 70, 65, 60, 55, 50, 45, 40, 35],
      [6, null, 60, 55, 50, 45, 40, 35, 30],
      [7, null, null, 50, 45, 40, 35, 30, 25],
      [8, null, null, null, 35, 30, 25, 20, 20],
      [9, null, null, null, null, 25, 20, 15, 15],
      [10, null, null, null, null, null, 20, 15, 15],
      [11, null, null, null, null, null, null, 10, 10],
      [12, null, null, null, null, null, null, 5, 5],
      [13, null, null, null, null, null, null, null, 5],
      [14, null, null, null, null, null, null, null, null],
      [15, null, null, null, null, null, null, null, null],
      [16, null, null, null, null, null, null, null, null],
      [17, null, null, null, null, null, null, null, null],
      [18, null, null, null, null, null, null, null, null],
    ]
  },
  {
    title: "1 звезда - Место",
    data: [
      [1, 80, 75, 70, 65, 60, 55, 50, 45],
      [2, 75, 70, 65, 60, 55, 50, 45, 40],
      [3, 70, 65, 60, 55, 50, 45, 40, 35],
      [4, null, 60, 55, 50, 45, 40, 35, 30],
      [5, null, null, 50, 45, 40, 35, 30, 25],
      [6, null, null, null, 35, 30, 25, 20, 20],
      [7, null, null, null, null, 25, 20, 15, 15],
      [8, null, null, null, null, null, 20, 15, 15],
      [9, null, null, null, null, null, null, 10, 10],
      [10, null, null, null, null, null, null, 5, 5],
      [11, null, null, null, null, null, null, null, 5],
      [12, null, null, null, null, null, null, null, null],
      [13, null, null, null, null, null, null, null, null],
      [14, null, null, null, null, null, null, null, null],
      [15, null, null, null, null, null, null, null, null],
      [16, null, null, null, null, null, null, null, null],
      [17, null, null, null, null, null, null, null, null],
      [18, null, null, null, null, null, null, null, null],
    ]
  }
];

const playerCounts = [12, 24, 36, 48, 60, 72, 84, 96];

const starOptions = [
  { value: 6, label: "6 звезд" },
  { value: 5, label: "5 звезд" },
  { value: 4, label: "4 звезды" },
  { value: 3, label: "3 звезды" },
  { value: 2, label: "2 звезды" },
  { value: 1, label: "1 звезда" },
];

const RatingsTable: React.FC<RatingsTableProps> = ({ className = "" }) => {
  const [selectedStars, setSelectedStars] = useState(6);

  const selectedTable = ratingsData.find(table => {
    if (selectedStars === 6) return table.title.includes("6 звезд");
    if (selectedStars === 5) return table.title.includes("5 звезд");
    if (selectedStars === 4) return table.title.includes("4 звезды");
    if (selectedStars === 3) return table.title.includes("3 звезды");
    if (selectedStars === 2) return table.title.includes("2 звезды");
    if (selectedStars === 1) return table.title.includes("1 звезда");
    return false;
  });

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Селектор звездности */}
      <div className="bg-gradient-to-br from-[#1D1D1D] to-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-6 shadow-xl">
        <h2 className="text-white text-xl font-bold text-center mb-4">
          Выберите звездность турнира
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {starOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStars(option.value)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedStars === option.value
                  ? 'bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] text-white shadow-lg'
                  : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A] border border-[#404040]/30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица */}
      {selectedTable && (
        <div className="bg-gradient-to-br from-[#1D1D1D] to-[#2A2A2A] border border-[#404040]/50 rounded-2xl p-6 shadow-xl">
          <div className="mb-6">
            <h3 className="text-white text-xl font-bold text-center mb-2">
              {selectedTable.title}
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-[#8469EF] to-[#6B4FFF] mx-auto rounded-full"></div>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-[#404040]/30">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#2A2A2A] to-[#1D1D1D] border-b-2 border-[#404040]">
                  <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold border-r border-[#404040]/30">
                    Место
                  </th>
                  {playerCounts.map((count) => (
                    <th key={count} className="px-3 py-3 text-center text-gray-300 text-sm font-semibold min-w-[70px] border-r border-[#404040]/30 last:border-r-0">
                      {count}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedTable.data.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={`border-b border-[#404040]/20 hover:bg-gradient-to-r hover:from-[#2A2A2A]/50 hover:to-[#1D1D1D]/50 transition-all duration-200 ${
                      rowIndex % 2 === 0 ? 'bg-[#1D1D1D]/30' : 'bg-transparent'
                    }`}
                  >
                    <td className="px-4 py-3 text-center text-white font-bold border-r border-[#404040]/20">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#8469EF] to-[#6B4FFF] rounded-full flex items-center justify-center text-sm mx-auto">
                        {row[0]}
                      </div>
                    </td>
                    {row.slice(1).map((value, colIndex) => (
                      <td key={colIndex} className="px-3 py-3 text-center text-white border-r border-[#404040]/20 last:border-r-0">
                        {value === null ? (
                          <span className="text-gray-600">-</span>
                        ) : (value as any) === "3к" ? (
                          <span className="text-yellow-400 font-bold">3к</span>
                        ) : (
                          <span className="font-medium">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingsTable;