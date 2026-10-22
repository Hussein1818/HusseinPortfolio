import React, { useEffect, useRef } from 'react';

interface TorchMaskProps {
  readonly isLumosActive: boolean;
  readonly isArcaneVision: boolean;
}

export const TorchMask: React.FC<TorchMaskProps> = React.memo(
  ({ isLumosActive, isArcaneVision }) => {
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const spotlightRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      let rafId: number | null = null;

      const updateTorchPosition = (clientX: number, clientY: number) => {
        if (rafId !== null) return;

        rafId = requestAnimationFrame(() => {
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
          }
          if (spotlightRef.current) {
            spotlightRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
          }
          rafId = null;
        });
      };

      const handleMouseMove = (event: MouseEvent) => {
        updateTorchPosition(event.clientX, event.clientY);
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 0) {
          updateTorchPosition(
            event.touches[0].clientX,
            event.touches[0].clientY
          );
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }, []);

    const primaryFlameColor = isArcaneVision ? '#38bdf8' : '#f59e0b';
    const secondaryFlameColor = isArcaneVision ? '#8b5cf6' : '#dc2626';
    const coreTint = isArcaneVision
      ? 'rgba(139, 92, 246, 0.16)'
      : 'rgba(245, 158, 11, 0.14)';

    return (
      <>
        {!isLumosActive && (
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
          >
            <div
              ref={spotlightRef}
              className="pointer-events-none absolute top-0 left-0 -ml-[2500px] -mt-[2500px] h-[5000px] w-[5000px]"
              style={{
                background: `radial-gradient(circle 310px at 2500px 2500px, ${coreTint} 0%, rgba(10, 8, 6, 0.7) 52%, rgba(3, 2, 2, 0.96) 100%)`,
                willChange: 'transform',
                transform: 'translate3d(50vw, 35vh, 0)',
              }}
            />
          </div>
        )}

        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[9999] -ml-4 -mt-8 hidden md:block"
          style={{
            willChange: 'transform',
            transform: 'translate3d(50vw, 35vh, 0)',
          }}
        >
          <svg
            width="44"
            height="56"
            viewBox="0 0 46 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
  }
);