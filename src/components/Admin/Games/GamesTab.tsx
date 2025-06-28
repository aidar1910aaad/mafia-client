'use client';

export default function GamesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">Управление играми</h2>
        <p className="text-[#A1A1A1]">Мониторинг и управление активными играми</p>
      </div>
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#404040]/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#A1A1A1]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-[#A1A1A1] text-lg">Здесь будет управление играми</p>
          <p className="text-[#757575] text-sm mt-2">Функция находится в разработке</p>
        </div>
      </div>
    </div>
  );
} 