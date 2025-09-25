'use client';

import { Users, Gamepad2, Trophy, BarChart3, Settings, Building2 } from 'lucide-react';

interface AdminNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminNavigation({ activeTab, setActiveTab }: AdminNavigationProps) {
  const tabs = [
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'tournaments', label: 'Турниры', icon: Trophy },
    { id: 'statistics', label: 'Статистика', icon: BarChart3 },
    { id: 'settings', label: 'Настройки', icon: Settings },
    { id: 'clubs', label: 'Клубы', icon: Building2 }
  ];

  return (
    <nav className="bg-[#2A2A2A]/60 backdrop-blur-sm border-b border-[#404040]/50">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium rounded-t-2xl transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#1D1D1D] text-white shadow-lg'
                    : 'text-[#A1A1A1] hover:text-white hover:bg-[#2A2A2A]/50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 