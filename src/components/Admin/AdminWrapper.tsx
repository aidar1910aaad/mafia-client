'use client';

import { useEffect } from 'react';

interface AdminWrapperProps {
  children: React.ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  useEffect(() => {
    // Скрываем основной header и footer более точно
    const mainHeader = document.querySelector('header:not([class*="AdminHeader"])');
    const mainFooter = document.querySelector('footer:not([class*="AdminFooter"])');
    
    if (mainHeader) {
      mainHeader.style.display = 'none';
    }
    if (mainFooter) {
      mainFooter.style.display = 'none';
    }

    // Восстанавливаем при размонтировании
    return () => {
      if (mainHeader) {
        mainHeader.style.display = '';
      }
      if (mainFooter) {
        mainFooter.style.display = '';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D] flex flex-col">
      {children}
    </div>
  );
} 