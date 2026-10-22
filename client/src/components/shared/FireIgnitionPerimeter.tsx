import React from 'react';

interface FireIgnitionPerimeterProps {
  readonly isIgniting: boolean;
}

export const FireIgnitionPerimeter: React.FC<FireIgnitionPerimeterProps> =
  React.memo(({ isIgniting }) => {
    if (!isIgniting) return null;

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-3xl"
      >
        <div className="chamber-flash-overlay absolute inset-0 rounded-3xl" />
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="lightningFlameGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <rect
            x="0.8"
            y="0.8"
            width="98.4"
            height="98.4"
            rx="3.5"
            ry="3.5"
            fill="none"
            stroke="url(#lightningFlameGrad)"
            strokeWidth="2.4"
            pathLength="100"
            className="lightning-stroke-anim"
          />
        </svg>
      </div>
    );
  });