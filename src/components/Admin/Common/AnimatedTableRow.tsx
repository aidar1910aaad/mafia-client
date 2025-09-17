'use client';

import { ReactNode, useState, useEffect } from 'react';

interface AnimatedTableRowProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export default function AnimatedTableRow({ 
  children, 
  index, 
  className = "" 
}: AnimatedTableRowProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Задержка для анимации появления строк
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50); // 50ms задержка между строками

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <tr 
      className={`${className} transition-all duration-300 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </tr>
  );
}