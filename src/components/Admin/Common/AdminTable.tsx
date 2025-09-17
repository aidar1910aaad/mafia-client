'use client';

import { ReactNode, useState, useEffect } from 'react';
import TableSkeleton from './TableSkeleton';

interface AdminTableProps {
  children: ReactNode;
  loading: boolean;
  columns: number;
  rows?: number;
  className?: string;
  minHeight?: string;
}

export default function AdminTable({ 
  children, 
  loading, 
  columns, 
  rows = 10,
  className = "",
  minHeight = "600px"
}: AdminTableProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(!loading);

  useEffect(() => {
    if (loading) {
      setIsTransitioning(true);
      setShowContent(false);
    } else {
      // Небольшая задержка для плавного перехода
      const timer = setTimeout(() => {
        setShowContent(true);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || isTransitioning) {
    return (
      <div style={{ minHeight }} className={className}>
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
          <TableSkeleton rows={rows} columns={columns} />
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ minHeight }} 
      className={`bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${className}`}
    >
      <div className={`transition-all duration-500 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {children}
      </div>
    </div>
  );
}