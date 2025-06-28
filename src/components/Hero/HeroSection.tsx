import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Хотите зарегистрировать свой клуб на <span className="text-purple-400">MAFSPACE</span>?
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8">
            Вступайте в федерацию СМА и пользуйтесь неограниченным функционалом сайта: создание рейтингов, сезонов и турниров, продвинутая статистика для ваших игроков, возможность участвовать в ELO турнирах и многое другое ждет вас на сайте MAFSPACE!
          </p>
          <Link href="/auth">
            <button className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 group">
              Присоединиться
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="flex justify-center items-center">
          <Image
            src="/Group.png"
            alt="Космическая иллюстрация"
            width={600}
            height={450}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 