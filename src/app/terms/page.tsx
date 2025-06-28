'use client';

import { FileText, Shield, Users, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-6">Пользовательское соглашение</h1>
          
          <div className="space-y-6">
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-white text-xl font-semibold">Общие положения</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Настоящее Пользовательское соглашение регулирует отношения между пользователями и администрацией системы управления клубами мафии.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Соглашение вступает в силу с момента регистрации пользователя</p>
                <p>• Администрация оставляет за собой право изменять условия соглашения</p>
                <p>• Пользователи обязаны соблюдать все правила и нормы поведения</p>
                <p>• За нарушение правил предусмотрены санкции вплоть до блокировки</p>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-green-400" />
                <h2 className="text-white text-xl font-semibold">Права и обязанности пользователей</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Права пользователей:</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>• Создавать и управлять клубами</p>
                    <p>• Участвовать в турнирах и сезонах</p>
                    <p>• Получать техническую поддержку</p>
                    <p>• Обращаться к администрации с вопросами</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-3">Обязанности пользователей:</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>• Соблюдать правила поведения</p>
                    <p>• Не нарушать права других пользователей</p>
                    <p>• Не использовать систему для незаконной деятельности</p>
                    <p>• Сообщать о нарушениях администрации</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-white text-xl font-semibold">Конфиденциальность и безопасность</h2>
              </div>
              <div className="space-y-3 text-sm text-gray-400">
                <p>• Администрация обязуется защищать персональные данные пользователей</p>
                <p>• Данные не передаются третьим лицам без согласия пользователя</p>
                <p>• Используются современные методы шифрования данных</p>
                <p>• Пользователи обязаны не передавать свои учетные данные третьим лицам</p>
                <p>• При подозрении на компрометацию аккаунта необходимо немедленно сменить пароль</p>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h2 className="text-white text-xl font-semibold">Запрещенные действия</h2>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Использование оскорбительных выражений и нецензурной лексики</p>
                <p>• Спам и реклама сторонних ресурсов</p>
                <p>• Создание фейковых аккаунтов</p>
                <p>• Попытки взлома или обхода системы безопасности</p>
                <p>• Нарушение авторских прав</p>
                <p>• Пропаганда насилия, экстремизма и других противоправных действий</p>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Ответственность</h2>
              <div className="space-y-3 text-sm text-gray-400">
                <p>• Пользователи несут ответственность за свои действия в системе</p>
                <p>• Администрация не несет ответственности за действия пользователей</p>
                <p>• При нарушении правил аккаунт может быть заблокирован</p>
                <p>• В случае серьезных нарушений данные могут быть переданы правоохранительным органам</p>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Изменения в соглашении</h2>
              <div className="space-y-3 text-sm text-gray-400">
                <p>• Администрация может изменять условия соглашения</p>
                <p>• Пользователи будут уведомлены об изменениях</p>
                <p>• Продолжение использования системы означает согласие с новыми условиями</p>
                <p>• Дата последнего обновления: 28.06.2025</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Используя систему, вы соглашаетесь с условиями данного пользовательского соглашения.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Версия 1.0 от 28.06.2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 