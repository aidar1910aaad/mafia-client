'use client';

import Link from 'next/link';
import { User, Award, Shield, Star } from 'lucide-react';

export default function RefereesPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-6">Судейский корпус</h1>
          
          <div className="space-y-6">
            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-white text-xl font-semibold">О судейском корпусе</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Судейский корпус - это команда опытных игроков, которые обеспечивают честное и справедливое проведение игр в клубах мафии.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Судьи проходят специальное обучение</p>
                <p>• Каждый судья имеет рейтинг и отзывы</p>
                <p>• Судьи назначаются на турниры и сезоны</p>
                <p>• Система контроля качества работы судей</p>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
                <h2 className="text-white text-xl font-semibold">Категории судей</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#2A2A2A] rounded-lg">
                  <div className="text-2xl mb-2">🥉</div>
                  <h3 className="text-white font-medium mb-2">Начинающий судья</h3>
                  <p className="text-gray-400 text-sm">Может судить игры в клубах</p>
                </div>
                <div className="text-center p-4 bg-[#2A2A2A] rounded-lg">
                  <div className="text-2xl mb-2">🥈</div>
                  <h3 className="text-white font-medium mb-2">Опытный судья</h3>
                  <p className="text-gray-400 text-sm">Может судить турниры</p>
                </div>
                <div className="text-center p-4 bg-[#2A2A2A] rounded-lg">
                  <div className="text-2xl mb-2">🥇</div>
                  <h3 className="text-white font-medium mb-2">Главный судья</h3>
                  <p className="text-gray-400 text-sm">Может судить чемпионаты</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-green-400" />
                <h2 className="text-white text-xl font-semibold">Судьи</h2>
              </div>
              <div className="space-y-4">
                <Link href="/players/71" className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Берлускони</h4>
                      <p className="text-gray-400 text-sm">Судья</p>
                    </div>
                  </div>
                </Link>
                <Link href="/players/2" className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Герцог</h4>
                      <p className="text-gray-400 text-sm">Судья</p>
                    </div>
                  </div>
                </Link>
                <Link href="/players/13" className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Drummer</h4>
                      <p className="text-gray-400 text-sm">Судья</p>
                    </div>
                  </div>
                </Link>
                <Link href="/players/8" className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Вояджер</h4>
                      <p className="text-gray-400 text-sm">Судья</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Как стать судьей</h2>
              <div className="space-y-3 text-sm text-gray-400">
                <p>1. Иметь опыт игры в мафию не менее 50 игр</p>
                <p>2. Подать заявку на вступление в судейский корпус</p>
                <p>3. Пройти обучение и сдать экзамен</p>
                <p>4. Получить рекомендации от действующих судей</p>
                <p>5. Начать с судейства простых игр под наблюдением</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Судейский корпус обеспечивает высокое качество проведения игр и турниров.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 