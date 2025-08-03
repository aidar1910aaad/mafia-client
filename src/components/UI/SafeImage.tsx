'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  fallbackText,
  onError 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Если нет src или произошла ошибка, показываем fallback
  if (!src || hasError) {
    return (
      <div 
        className={`bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold ${className}`}
        style={{ width, height }}
      >
        {fallbackText || '?'}
      </div>
    );
  }

  return (
    <Image 
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e);
      }}
    />
  );
} 