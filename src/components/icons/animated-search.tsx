import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedSearchTransactionIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function AnimatedSearchTransactionIcon({ className, ...props }: AnimatedSearchTransactionIconProps) {
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
        /* Transaction Receipt Document */
        .trx-document {
          transform-origin: 10px 12px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease;
        }

        /* Magnifying Glass Scan Motion */
        @keyframes magnifyingScan {
          0% {
            transform: translate(0, 0) scale(1);
          }
          35% {
            transform: translate(-3px, -3px) scale(1.15) rotate(-8deg);
          }
          70% {
            transform: translate(2px, -2px) scale(1.18) rotate(6deg);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        .trx-lens {
          transform-origin: 15px 15px;
          transition: stroke 0.3s ease, filter 0.3s ease;
        }

        .group:hover .trx-lens {
          animation: magnifyingScan 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          stroke: #01ca93;
          filter: drop-shadow(0 0 6px rgba(1, 202, 147, 0.7));
        }

        .group:hover .trx-document {
          transform: translateY(-1px) scale(1.03);
        }

        /* Verified Checkmark Badge Pop-up */
        .trx-check {
          opacity: 0;
          transform: scale(0) rotate(-15deg);
          transform-origin: 8px 12px;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
        }
        .group:hover .trx-check {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          stroke: #01ca93;
        }

        .trx-line {
          transition: opacity 0.3s ease;
        }
        .group:hover .trx-line {
          opacity: 0.35;
        }
      `}</style>

      {/* Transaction Receipt Paper */}
      <path
        className="trx-document"
        d="M4 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      />

      {/* Receipt Lines */}
      <line className="trx-line" x1="6" y1="7" x2="12" y2="7" />
      <line className="trx-line" x1="6" y1="11" x2="10" y2="11" />
      <line className="trx-line" x1="6" y1="15" x2="9" y2="15" />

      {/* Checkmark Verification Badge */}
      <path className="trx-check" d="M5.5 11.5l2 2 4.5-4.5" strokeWidth="2.5" />

      {/* Magnifying Glass Lens & Handle */}
      <g className="trx-lens">
        <circle cx="15" cy="15" r="4.5" />
        <path d="M18.5 18.5L22 22" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
