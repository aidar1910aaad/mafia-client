import Link from 'next/link';

export default function Footer() {
    const footerLinks = [
        { text: 'Приказы', href: '/orders' },
        { text: 'Рейтинговые баллы', href: '/elo' },
        { text: 'Поддержка', href: '/support' },
        { text: 'Судейский корпус', href: '/referees' },
        { text: 'Регламент', href: '/rules.pdf' },
        { text: 'Пользовательское соглашение', href: '/terms' }
    ];

    return (
        <footer className="bg-[#1D1D1D] w-full">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Десктопная версия */}
                <div className="hidden lg:flex items-center h-[100px] gap-8">
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
                                link.href === '/rules.pdf' ? (
                                    <a
                                        key={i}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#757575] mr-[20px] hover:text-[#A1A1A1] cursor-pointer transition-colors text-sm"
                                    >
                                        {link.text}
                                    </a>
                                ) : (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className="text-[#757575] mr-[20px] hover:text-[#A1A1A1] cursor-pointer transition-colors text-sm"
                                    >
                                        {link.text}
                                    </Link>
                                )
                            ))}
                        </div>
                        <div className="text-[#757575] text-sm">
                            © 2025 MAFSPACE. All right reserved.
                        </div>
                    </div>

                    {/* Правая часть для симметрии */}
                    <div className="ml-auto w-[120px]" />
                </div>

                {/* Планшетная версия */}
                <div className="hidden md:flex lg:hidden flex-col py-6 space-y-4">
                    {/* Логотип */}
                    <div className="flex justify-center">
                        <img src="/logo2.png" alt="Logo" className="h-[40px] w-[100px] object-contain" />
                    </div>

                    {/* Ссылки в две колонки */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {footerLinks.map((link, i) => (
                            link.href === '/rules.pdf' ? (
                                <a
                                    key={i}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#757575] hover:text-[#A1A1A1] cursor-pointer transition-colors text-sm text-center py-1"
                                >
                                    {link.text}
                                </a>
                            ) : (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="text-[#757575] hover:text-[#A1A1A1] cursor-pointer transition-colors text-sm text-center py-1"
                                >
                                    {link.text}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Копирайт */}
                    <div className="text-[#757575] text-sm text-center">
                        © 2025 MAFSPACE. All right reserved.
                    </div>
                </div>

                {/* Мобильная версия */}
                <div className="md:hidden flex flex-col py-6 space-y-4">
                    {/* Логотип */}
                    <div className="flex justify-center">
                        <img src="/logo2.png" alt="Logo" className="h-[36px] w-[90px] object-contain" />
                    </div>

                    {/* Ссылки в одну колонку */}
                    <div className="space-y-2">
                        {footerLinks.map((link, i) => (
                            link.href === '/rules.pdf' ? (
                                <a
                                    key={i}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-[#757575] hover:text-[#A1A1A1] cursor-pointer transition-colors text-sm text-center py-2"
                                >
                                    {link.text}
                                </a>
                            ) : (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="block text-[#757575] hover:text-[#A1A1A1] cursor-pointer transition-colors text-sm text-center py-2"
                                >
                                    {link.text}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Копирайт */}
                    <div className="text-[#757575] text-xs text-center px-4">
                        © 2025 MAFSPACE. All right reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
