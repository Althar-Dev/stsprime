import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedArticleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function AnimatedArticleIcon({ className, ...props }: AnimatedArticleIconProps) {
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
        .neat-megaphone {
          transform-origin: 8px 13px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease, filter 0.3s ease;
        }

        .group:hover .neat-megaphone {
          transform: rotate(-12deg) scale(1.12);
          stroke: #01ca93;
          filter: drop-shadow(0 0 6px rgba(1, 202, 147, 0.7));
        }

        .megaphone-cone-fill {
          transition: fill-opacity 0.3s ease, fill 0.3s ease;
        }

        .group:hover .megaphone-cone-fill {
          fill: #01ca93;
          fill-opacity: 0.2;
        }
      `}</style>

      <g className="neat-megaphone">
        {/* Speaker Cone (Clean & Tidy) */}
        <path
          className="megaphone-cone-fill"
          d="M3 11L18 6V18L3 13V11Z"
        />

        {/* Megaphone Handle */}
        <path d="M11.6 16.8A3 3 0 1 1 5.8 15.2" />

        {/* Front Opening Rim */}
        <path d="M18 6A3 3 0 0 1 18 18" />
      </g>
    </svg>
  );
}
