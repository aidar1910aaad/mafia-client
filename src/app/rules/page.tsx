'use client';

import { BookOpen, Users, Clock, Shield, Award, AlertTriangle, FileText, Gavel } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-6">Регламент</h1>
          
          <div className="space-y-8">
            {/* Основные правила игры */}
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h2 className="text-white text-xl font-semibold">Основные правила игры в мафию</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-400">
                <div>
                  <h3 className="text-white font-medium mb-2">Цель игры</h3>
                  <p>Мирные жители должны вычислить и казнить всех мафиози, а мафия - уничтожить мирных жителей.</p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Роли игроков</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-green-400 font-medium">Мирные жители:</h4>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Обычные жители города</li>
                        <li>Доктор - может лечить игроков</li>
                        <li>Комиссар - может проверять игроков</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-medium">Мафия:</h4>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Мафиози - убивают игроков ночью</li>
                        <li>Дон - лидер мафии</li>
                        <li>Маньяк - играет за себя</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Фазы игры</h3>
                  <div className="space-y-2">
                    <p><strong>День:</strong> Обсуждение, голосование за казнь</p>
                    <p><strong>Ночь:</strong> Мафия выбирает жертву, спецроли используют способности</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Регламент проведения игр */}
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-green-400" />
                <h2 className="text-white text-xl font-semibold">Регламент проведения игр</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-400">
                <div>
                  <h3 className="text-white font-medium mb-2">Временные рамки</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-yellow-400 font-medium">Дневная фаза:</h4>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Обсуждение: 3-5 минут</li>
                        <li>Голосование: 1 минута</li>
                        <li>Подсчет голосов: 30 секунд</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-purple-400 font-medium">Ночная фаза:</h4>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Выбор мафии: 30 секунд</li>
                        <li>Действия спецролей: 30 секунд</li>
                        <li>Объявление результатов: 15 секунд</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Правила общения</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Говорить только в свою очередь</li>
                    <li>Не перебивать других игроков</li>
                    <li>Использовать уважительный тон</li>
                    <li>Не использовать нецензурную лексику</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Запрещенные действия */}
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h2 className="text-white text-xl font-semibold">Запрещенные действия</h2>
              </div>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-2">Во время игры:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Подсказки и жесты</li>
                      <li>Переговоры вне игры</li>
                      <li>Использование внешних источников</li>
                      <li>Нарушение временных рамок</li>
                      <li>Оскорбления и токсичное поведение</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Технические нарушения:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Использование нескольких аккаунтов</li>
                      <li>Передача учетных данных</li>
                      <li>Попытки взлома системы</li>
                      <li>Спам и флуд в чатах</li>
                      <li>Намеренное нарушение работы сервера</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Правила турниров */}
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
                <h2 className="text-white text-xl font-semibold">Правила турниров и сезонов</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-400">
                <div>
                  <h3 className="text-white font-medium mb-2">Форматы турниров</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-[#2A2A2A] rounded-lg">
                      <h4 className="text-blue-400 font-medium">Одиночные</h4>
                      <p>Индивидуальные соревнования игроков</p>
                    </div>
                    <div className="p-3 bg-[#2A2A2A] rounded-lg">
                      <h4 className="text-green-400 font-medium">Командные</h4>
                      <p>Соревнования между клубами</p>
                    </div>
                    <div className="p-3 bg-[#2A2A2A] rounded-lg">
                      <h4 className="text-purple-400 font-medium">Сезонные</h4>
                      <p>Длительные турниры с рейтингом</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Система начисления очков</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Победа мирных: +10 очков</li>
                    <li>Победа мафии: +8 очков</li>
                    <li>Победа маньяка: +15 очков</li>
                    <li>За активность: +2 очка</li>
                    <li>За нарушение правил: -5 очков</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Кодекс поведения */}
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-white text-xl font-semibold">Кодекс поведения</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-2">Обязанности игроков:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Уважать других участников</li>
                      <li>Соблюдать правила игры</li>
                      <li>Не использовать читы и эксплойты</li>
                      <li>Сообщать о нарушениях</li>
                      <li>Помогать новичкам</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Права игроков:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Участвовать в играх и турнирах</li>
                      <li>Создавать и управлять клубами</li>
                      <li>Подавать жалобы и апелляции</li>
                      <li>Получать техническую поддержку</li>
                      <li>Участвовать в развитии сообщества</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Процедуры и протоколы */}
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="w-6 h-6 text-purple-400" />
                <h2 className="text-white text-xl font-semibold">Процедуры и протоколы</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-400">
                <div>
                  <h3 className="text-white font-medium mb-2">Подача жалоб</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Собрать доказательства нарушения</li>
                    <li>Обратиться к модератору или администрации</li>
                    <li>Указать время, место и участников инцидента</li>
                    <li>Дождаться рассмотрения жалобы</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Система наказаний</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-[#2A2A2A] rounded-lg">
                      <h4 className="text-yellow-400 font-medium">Предупреждение</h4>
                      <p>Первое нарушение правил</p>
                    </div>
                    <div className="p-3 bg-[#2A2A2A] rounded-lg">
                      <h4 className="text-orange-400 font-medium">Временный бан</h4>
                      <p>От 1 дня до 1 недели</p>
                    </div>
                    <div className="p-3 bg-[#2A2A2A] rounded-lg">
                      <h4 className="text-red-400 font-medium">Перманентный бан</h4>
                      <p>За серьезные нарушения</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Апелляции</h3>
                  <p>Решения модераторов можно обжаловать в течение 48 часов после вынесения наказания.</p>
                </div>
              </div>
            </div>

            {/* Технические требования */}
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-green-400" />
                <h2 className="text-white text-xl font-semibold">Технические требования</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-2">Минимальные требования:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Современный браузер (Chrome, Firefox, Safari)</li>
                      <li>Стабильное интернет-соединение</li>
                      <li>Микрофон для голосового общения</li>
                      <li>Наушники или колонки</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Рекомендуемые требования:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Высокоскоростной интернет</li>
                      <li>Качественный микрофон</li>
                      <li>Веб-камера для видеосвязи</li>
                      <li>Резервное подключение к интернету</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Соблюдение данного регламента обеспечивает честную и приятную игру для всех участников.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Последнее обновление: 28.06.2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 