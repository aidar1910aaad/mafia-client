'use client';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-6">Приказы</h1>
          
          <div className="space-y-6">
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Приказ №1 от 28.06.2025</h2>
              <p className="text-gray-400 mb-4">
                О назначении судей для проведения турниров в клубах мафии.
              </p>
              <div className="text-sm text-gray-500">
                Дата публикации: 28.06.2025
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Приказ №2 от 27.06.2025</h2>
              <p className="text-gray-400 mb-4">
                Об утверждении правил проведения игр в клубах мафии.
              </p>
              <div className="text-sm text-gray-500">
                Дата публикации: 27.06.2025
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Приказ №3 от 26.06.2025</h2>
              <p className="text-gray-400 mb-4">
                О создании системы рейтинга игроков и клубов.
              </p>
              <div className="text-sm text-gray-500">
                Дата публикации: 26.06.2025
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Здесь будут публиковаться все официальные приказы и распоряжения администрации системы.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 