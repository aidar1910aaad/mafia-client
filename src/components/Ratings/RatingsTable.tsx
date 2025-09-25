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
      [1, 85, 100, 115, 130, 145, 160, 175, 190],
      [2, 80, 95, 110, 125, 140, 155, 170, 185],
      [3, 75, 90, 105, 120, 135, 150, 165, 180],
      [4, 70, 85, 100, 115, 130, 145, 160, 175],
      [5, 65, 80, 95, 110, 125, 140, 155, 170],
      [6, 60, 75, 90, 105, 120, 135, 150, 165],
      [7, 55, 70, 85, 100, 115, 130, 145, 160],
      [8, 50, 65, 80, 95, 110, 125, 140, 155],
      [9, null, 60, 75, 90, 105, 120, 135, 150],
      [10, null, 55, 70, 85, 100, 115, 130, 145],
      [11, null, 50, 65, 80, 95, 110, 125, 140],
      [12, null, 45, 60, 75, 90, 105, 120, 135],
    ]
  },
  {
    title: "5 звезд - Место",
    data: [
      [1, 75, 90, 105, 120, 135, 150, 165, 180],
      [2, 70, 85, 100, 115, 130, 145, 160, 175],
      [3, 65, 80, 95, 110, 125, 140, 155, 170],
      [4, 60, 75, 90, 105, 120, 135, 150, 165],
      [5, 55, 70, 85, 100, 115, 130, 145, 160],
      [6, 50, 65, 80, 95, 110, 125, 140, 155],
      [7, 45, 60, 75, 90, 105, 120, 135, 150],
      [8, 40, 55, 70, 85, 100, 115, 130, 145],
      [9, null, 50, 65, 80, 95, 110, 125, 140],
      [10, null, 45, 60, 75, 90, 105, 120, 135],
      [11, null, 40, 55, 70, 85, 100, 115, 130],
      [12, null, 35, 50, 65, 80, 95, 110, 125],
    ]
  },
  {
    title: "4 звезды - Место",
    data: [
      [1, 65, 80, 95, 110, 125, 140, 155, 170],
      [2, 60, 75, 90, 105, 120, 135, 150, 165],
      [3, 55, 70, 85, 100, 115, 130, 145, 160],
      [4, 50, 65, 80, 95, 110, 125, 140, 155],
      [5, 45, 60, 75, 90, 105, 120, 135, 150],
      [6, 40, 55, 70, 85, 100, 115, 130, 145],
      [7, 35, 50, 65, 80, 95, 110, 125, 140],
      [8, 30, 45, 60, 75, 90, 105, 120, 135],
      [9, null, 40, 55, 70, 85, 100, 115, 130],
      [10, null, 35, 50, 65, 80, 95, 110, 125],
      [11, null, 30, 45, 60, 75, 90, 105, 120],
      [12, null, 25, 40, 55, 70, 85, 100, 115],
    ]
  },
  {
    title: "3 звезды - Место",
    data: [
      [1, 55, 70, 85, 100, 115, 130, 145, 160],
      [2, 50, 65, 80, 95, 110, 125, 140, 155],
      [3, 45, 60, 75, 90, 105, 120, 135, 150],
      [4, 40, 55, 70, 85, 100, 115, 130, 145],
      [5, 35, 50, 65, 80, 95, 110, 125, 140],
      [6, 30, 45, 60, 75, 90, 105, 120, 135],
      [7, 25, 40, 55, 70, 85, 100, 115, 130],
      [8, 20, 35, 50, 65, 80, 95, 110, 125],
      [9, null, 30, 45, 60, 75, 90, 105, 120],
      [10, null, 25, 40, 55, 70, 85, 100, 115],
      [11, null, 20, 35, 50, 65, 80, 95, 110],
      [12, null, 15, 30, 45, 60, 75, 90, 105],
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
      [12, null, null, null, null, null, null, null, null]
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