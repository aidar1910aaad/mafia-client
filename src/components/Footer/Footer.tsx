import Link from 'next/link';

export default function Footer() {
    const footerLinks = [
        { text: 'Приказы', href: '/orders' },
        { text: 'ELO баллы', href: '/elo' },
        { text: 'Поддержка', href: '/support' },
        { text: 'Судейский корпус', href: '/referees' },
        { text: 'Регламент', href: '/rules' },
        { text: 'Пользовательское соглашение', href: '/terms' }
    ];

    return (
        <footer className="bg-[#1D1D1D] h-[100px] w-full">
            <div className="max-w-[1280px] h-full mx-auto px-4 flex items-center gap-8">

                {/* Левая часть: логотип */}
                <div className="flex items-center">
                    <img src="/logo2.png" alt="Logo" className="h-[48px] w-[120px] object-contain" />
                </div>

                {/* Разделяющая линия */}
                <div className="w-[1px] h-[64px] ml-6 bg-[#D9D9D95C]" />

                {/* Центр: ссылки + копирайт под ними */}
                <div className="flex flex-col ml-[40px] items-start justify-center">
                    <div className="flex gap-x-2 mb-2">
                        {footerLinks.map((link, i) => (
                            <Link
                                key={i}
                                href={link.href}
                                className="text-[#757575] mr-[20px] hover:text-[#A1A1A1] cursor-pointer transition-colors"
                            >
                                {link.text}
                            </Link>
                        ))}
                    </div>
                    <div className="text-[#757575] ">
                        © 2025 MAFSPACE. All right reserved.
                    </div>
                </div>

                {/* Правая часть для симметрии */}
                <div className="ml-auto w-[120px]" />
            </div>
        </footer>
    );
}
