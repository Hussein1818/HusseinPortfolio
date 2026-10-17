import React, { useEffect, useRef } from 'react';

interface TorchMaskProps {
  readonly isLumosActive: boolean;
  readonly isArcaneVision: boolean;
}

export const TorchMask: React.FC<TorchMaskProps> = ({
  isLumosActive,
  isArcaneVision,
}) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        }
        document.documentElement.style.setProperty('--torch-x', `${clientX}px`);
        document.documentElement.style.setProperty('--torch-y', `${clientY}px`);
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        updatePosition(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    // Mobile scroll fallback so the torch illuminates the center viewport while scrolling
    const handleScroll = () => {
      if (window.matchMedia('(pointer: coarse)').matches) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight * 0.42;
        updatePosition(centerX, centerY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const primaryFlameColor = isArcaneVision ? '#38bdf8' : '#f59e0b';
  const secondaryFlameColor = isArcaneVision ? '#8b5cf6' : '#dc2626';
  const coreTint = isArcaneVision
    ? 'rgba(139, 92, 246, 0.18)'
    : 'rgba(245, 158, 11, 0.15)';

  return (
    <>
      {/* True Dungeon Darkness Overlay with Torch Spotlight Hole */}
      {!isLumosActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 320px at var(--torch-x) var(--torch-y), ${coreTint} 0%, rgba(10, 8, 6, 0.68) 52%, rgba(3, 2, 2, 0.96) 100%)`,
            willChange: 'background',
          }}
        />
      )}

      {/* Custom Handheld Torch Cursor - Always on top of Modals (z-[9999]) */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -ml-4 -mt-8 hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <svg
          width="46"
          height="58"
          viewBox="0 0 46 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_18px_rgba(245,158,11,0.95)]"
        >
          <g className="flame-animated">
            <path
              d="M23 2C23 2 35 12 33 24C31 32 26 34 23 34C20 34 15 32 13 24C11 12 23 2 23 2Z"
              fill={secondaryFlameColor}
              fillOpacity="0.9"
            />
            <path
              d="M23 7C23 7 31 15 29 24C28 29 25 32 23 32C21 32 18 29 17 24C15 15 23 7 23 7Z"
              fill={primaryFlameColor}
            />
            <path
              d="M23 14C23 14 27 19 26 25C25 28 24 30 23 30C22 30 21 28 20 25C19 19 23 14 23 14Z"
              fill="#fef3c7"
            />
          </g>
          <path
            d="M16 33H30L28 38H18L16 33Z"
            fill="#78350f"
            stroke="#fbbf24"
            strokeWidth="1.2"
          />
          <path
            d="M19 38H27L25 55C25 56.1 24.1 57 23 57C21.9 57 21 56.1 21 55L19 38Z"
            fill="#451a03"
            stroke="#92400e"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    </>
  );
};