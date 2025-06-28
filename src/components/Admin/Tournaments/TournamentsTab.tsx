'use client';

export default function TournamentsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">Управление турнирами</h2>
        <p className="text-[#A1A1A1]">Создание и управление турнирами</p>
      </div>
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#404040]/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#A1A1A1]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-[#A1A1A1] text-lg">Здесь будет управление турнирами</p>
          <p className="text-[#757575] text-sm mt-2">Функция находится в разработке</p>
        </div>
      </div>
    </div>
  );
} 