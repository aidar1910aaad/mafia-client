'use client';

import { Mail, MessageCircle, Phone, Clock } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-6">Поддержка</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-blue-400" />
                <h2 className="text-white text-xl font-semibold">Email поддержка</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Напишите нам на email для получения технической поддержки.
              </p>
              <a 
                href="mailto:support@mafia-game.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                support@mafia-game.com
              </a>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-white text-xl font-semibold">Чат поддержки</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Получите мгновенную помощь через онлайн чат.
              </p>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                Открыть чат
              </button>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-purple-400" />
                <h2 className="text-white text-xl font-semibold">Телефон</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Позвоните нам для получения консультации.
              </p>
              <a 
                href="tel:+7-800-555-0123" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                +7 (800) 555-01-23
              </a>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-yellow-400" />
                <h2 className="text-white text-xl font-semibold">Время работы</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Мы работаем для вас каждый день.
              </p>
              <div className="text-sm text-gray-400">
                <p>Пн-Пт: 9:00 - 18:00</p>
                <p>Сб-Вс: 10:00 - 16:00</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Как создать клуб?</h3>
                <p className="text-gray-400 text-sm">
                  Перейдите в раздел "Клубы" и нажмите кнопку "Создать клуб". Заполните необходимую информацию и дождитесь одобрения администрации.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Как принять участие в турнире?</h3>
                <p className="text-gray-400 text-sm">
                  Обратитесь к администратору клуба или владельцу клуба для регистрации на турнир.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Как изменить пароль?</h3>
                <p className="text-gray-400 text-sm">
                  Войдите в свой профиль и перейдите в настройки аккаунта для изменения пароля.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Мы всегда готовы помочь вам с любыми вопросами по работе с системой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 