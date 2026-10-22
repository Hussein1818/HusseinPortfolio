import React, { useState, useCallback, useMemo } from 'react';
import { ShieldAlert, Flame } from 'lucide-react';

interface SmartImageProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly fallbackType?: 'boss' | 'relic' | 'avatar';
}

export const SmartImage: React.FC<SmartImageProps> = React.memo(
  ({ src, alt, className = '', fallbackType = 'relic' }) => {
    const [attemptIndex, setAttemptIndex] = useState<number>(0);
    const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

    const candidatePaths = useMemo(() => {
      const baseWithoutExt = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      return [
        src,
        `${src}.jpg`,
        `${src}.png`,
        `${baseWithoutExt}.png`,
        `${baseWithoutExt}.jpg`,
        `${baseWithoutExt}.jpg.jpg`,
        `${baseWithoutExt}.png.png`,
      ];
    }, [src]);

    const handleImageError = useCallback(() => {
      setAttemptIndex((prev) => {
        if (prev + 1 < candidatePaths.length) {
          return prev + 1;
        }
        setHasFailedAll(true);
        return prev;
      });
    }, [candidatePaths.length]);

    if (hasFailedAll) {
      if (fallbackType === 'boss') {
        return (
          <div
            className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0907] via-[#0d0605] to-black p-6 text-center ${className}`}
          >
            <ShieldAlert className="h-20 w-20 text-red-500 animate-pulse" />
            <span className="mt-3 font-code text-xs uppercase tracking-widest text-red-400">
              Obsidian Concurrency Golem
            </span>
          </div>
        );
      }
      return (
        <div
          className={`flex items-center justify-center bg-[#120f0c] text-amber-500 ${className}`}
        >
          <Flame className="h-12 w-12 animate-pulse" />
        </div>
      );
    }

    return (
      <img
        src={candidatePaths[attemptIndex]}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={handleImageError}
        className={className}
      />
    );
  }
);