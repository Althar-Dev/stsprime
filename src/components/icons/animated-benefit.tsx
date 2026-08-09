import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBenefitIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function AnimatedBenefitIcon({ className, ...props }: AnimatedBenefitIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("overflow-visible shrink-0", className)}
      {...props}
    >
      <style>{`
        /* Gift Box Lid Animation (Pops Open on Hover) */
        .gift-lid {
          transform-origin: 12px 7px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease;
        }

        /* Gift Box Body Wiggle */
        @keyframes giftBoxWiggle {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
          75% { transform: rotate(-2deg); }
          100% { transform: rotate(0deg); }
        }

        .gift-box {
          transform-origin: 12px 16px;
          transition: stroke 0.3s ease;
        }

        /* Reward Sparkle Gem floating out of box */
        .gift-reward-star {
          opacity: 0;
          transform: translateY(6px) scale(0) rotate(-20deg);
          transform-origin: 12px 4px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s;
        }

        .group:hover .gift-lid {
          transform: translateY(-5px) rotate(-12deg);
          stroke: #01ca93;
        }

        .group:hover .gift-box {
          animation: giftBoxWiggle 0.6s ease-in-out;
        }

        .group:hover .gift-reward-star {
          opacity: 1;
          transform: translateY(-5px) scale(1.2) rotate(12deg);
          stroke: #01ca93;
          fill: #01ca93;
          fill-opacity: 0.3;
          filter: drop-shadow(0 0 8px rgba(1, 202, 147, 0.85));
        }

        /* Sparkle dots */
        .gift-sparkle-1, .gift-sparkle-2 {
          opacity: 0;
          transform: scale(0);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s;
        }
        .group:hover .gift-sparkle-1 {
          opacity: 1;
          transform: translate(3px, 2px) scale(1);
          fill: #fbbf24;
        }
        .group:hover .gift-sparkle-2 {
          opacity: 1;
          transform: translate(21px, 3px) scale(1);
          fill: #01ca93;
        }
      `}</style>

      {/* Floating Sparkle Particles */}
      <circle className="gift-sparkle-1" cx="0" cy="0" r="1.2" />
      <circle className="gift-sparkle-2" cx="0" cy="0" r="1" />

      {/* Reward Star popping out of box */}
      <path
        className="gift-reward-star"
        d="M12 1.5l1.2 2.4 2.7.4-1.9 1.9.5 2.7-2.5-1.3-2.5 1.3.5-2.7-1.9-1.9 2.7-.4z"
        strokeWidth="1.5"
      />

      {/* Gift Box Lid & Ribbon */}
      <g className="gift-lid">
        <path d="M3 7h18v4H3z" />
        <path d="M12 7v4" />
      </g>

      {/* Gift Box Container */}
      <g className="gift-box">
        <path d="M5 11v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
        <path d="M12 11v11" />
      </g>
    </svg>
  );
}
