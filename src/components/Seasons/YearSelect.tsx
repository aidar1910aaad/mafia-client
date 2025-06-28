import React from 'react';

interface YearSelectProps {
  years: number[];
  value: number;
  onChange: (year: number) => void;
}

const YearSelect: React.FC<YearSelectProps> = ({ years, value, onChange }) => (
  <select
    className="bg-[#303030]  rounded-[7px] px-4 py-2 text-[#8469EF] focus:outline-none w-[98px] h-[52px]"
    value={value}
    onChange={e => onChange(Number(e.target.value))}
  >
    {years.map(y => <option key={y} value={y}>{y}</option>)}
  </select>
);

export default YearSelect; 