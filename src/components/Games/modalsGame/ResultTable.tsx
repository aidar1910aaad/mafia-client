'use client';

import { Plus, Trash2 } from 'lucide-react';
import { ResultTableProps } from './types';

export default function ResultTable({ 
  resultTable, 
  onAddRound, 
  onUpdateRound, 
  onRemoveRound 
}: ResultTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-white text-sm font-medium">
          Таблица результатов
        </label>
        <button
          type="button"
          onClick={onAddRound}
          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
          Добавить раунд
        </button>
      </div>
      
      {Object.keys(resultTable).length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-4 bg-[#2A2A2A] border border-[#404040]/50 rounded-lg">
          Нет данных о раундах
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(resultTable).map(([roundKey, value]) => (
            <div key={roundKey} className="flex items-center gap-2">
              <span className="text-gray-400 text-sm min-w-[60px]">{roundKey}:</span>
              <input
                type="text"
                value={value}
                onChange={(e) => onUpdateRound(roundKey, e.target.value)}
                className="flex-1 bg-[#2A2A2A] border border-[#404040]/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="Результат раунда..."
              />
              <button
                type="button"
                onClick={() => onRemoveRound(roundKey)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 