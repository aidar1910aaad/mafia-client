import React from 'react';

const LeaderboardTable = () => {
  const tableData = [
    ["Керамбит", "24,5", "9,5", "", "", "2/2", "1/1", "1/1", "1/1", "", "1/1", "0/1", "", "5/6", "5/6"],
    ["Diablo", "22,5", "7,5", "", "", "1/1", "1/1", "1/1", "1/2", "", "", "", "", "5/6", "5/6"],
    ["BWDMoscow", "19", "4,5", "1", "1,5", "3", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Флай", "17,25", "4,5", "", "0,75", "2", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Ганнибал", "15,25", "3", "", "0,25", "1", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Директор", "14,75", "1,5", "", "1", "", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Рони", "14,5", "2,5", "", "", "", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Майкрофт", "11,75", "2,5", "1", "0,5", "", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Зажигалочка", "11,25", "2", "", "", "", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Баконяко", "10,75", "1", "", "0,75", "", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Drummer", "8,75", "2,5", "", "", "", "", "", "", "", "", "", "", "5/6", "5/6"],
    ["Жена Миллиардера", "8,75", "2", "", "", "", "", "", "", "", "", "", "", "5/6", "5/6"]
  ];

  return (
    <div className="overflow-auto rounded-lg border border-gray-800 bg-[#111111]">
      <table className="w-full text-sm text-white border-collapse">
        <thead className="bg-[#1E1E1E]">
          <tr>
            {["#", "Игрок", "Σ", "Σ+", "ЛХ", "Си", "ПУ", "К", "Ш", "Кр", "Док", "Д", "Ч", "М", "Winrate", "ELO"].map((col, i) => (
              <th key={i} className="border border-gray-700 px-2 py-2 whitespace-nowrap font-normal">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {tableData.map((row, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td className="border-r border-gray-700 px-2 py-2">{i + 1}</td>
              <td className="border-r border-gray-700 px-2 py-2 text-left whitespace-nowrap">{row[0]}</td>
              {row.slice(1).map((cell, j) => (
                <td key={j} className="border-r border-gray-700 px-2 py-2 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable; 