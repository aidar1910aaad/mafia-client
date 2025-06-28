'use client';

export default function EloPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-6">ELO Рейтинг</h1>
          
          <div className="space-y-6">
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Как работает ELO система</h2>
              <p className="text-gray-400 mb-4">
                ELO рейтинг - это математическая система оценки относительной силы игроков в играх с нулевой суммой.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• При победе над более сильным игроком вы получаете больше очков</p>
                <p>• При поражении от более слабого игрока вы теряете больше очков</p>
                <p>• Рейтинг обновляется после каждой игры</p>
                <p>• Начальный рейтинг: 1200 очков</p>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Рейтинговые категории</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Новичок:</span>
                    <span className="text-white">0-1200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Любитель:</span>
                    <span className="text-white">1201-1400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Опытный:</span>
                    <span className="text-white">1401-1600</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Мастер:</span>
                    <span className="text-white">1601-1800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Эксперт:</span>
                    <span className="text-white">1801-2000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Легенда:</span>
                    <span className="text-white">2000+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Формула расчета</h2>
              <p className="text-gray-400 text-sm">
                Новый рейтинг = Текущий рейтинг + K × (Результат - Ожидаемый результат)
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Где K - коэффициент развития (зависит от количества игр)
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Подробная информация о рейтинговой системе и правилах начисления очков.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 