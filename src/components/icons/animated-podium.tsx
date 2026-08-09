import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedPodiumIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function AnimatedPodiumIcon({ className, ...props }: AnimatedPodiumIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="60 40 392 420"
      className={cn("overflow-visible shrink-0", className)}
      {...props}
    >
      <defs>
        <clipPath id="__lottie_element_27">
          <rect width="512" height="512" x="0" y="0" />
        </clipPath>
      </defs>

      <style>{`
        /* Default state: star uses currentColor */
        .orange-star-path {
          stroke: currentColor;
          fill: currentColor;
          fill-opacity: 0;
          transition: stroke 0.3s ease, fill 0.3s ease, fill-opacity 0.3s ease, filter 0.3s ease;
        }

        .podium-star-container {
          transform-origin: 256px 133px;
        }

        /* Star Jump, Bounce on Podium, and Return Animation */
        @keyframes starJumpBounce {
          0% {
            transform: matrix(1,0,0,1,255.99,133.4) scale(1) rotate(0deg);
          }
          30% {
            transform: matrix(1,0,0,1,255.99,90) scale(1.22) rotate(16deg);
          }
          60% {
            transform: matrix(1,0,0,1,255.99,152) scale(0.92, 1.1) rotate(-6deg);
          }
          80% {
            transform: matrix(1,0,0,1,255.99,126) scale(1.06) rotate(4deg);
          }
          100% {
            transform: matrix(1,0,0,1,255.99,133.4) scale(1) rotate(0deg);
          }
        }

        @keyframes podiumImpact {
          0%, 50% { transform: matrix(1,0,0,1,256,256) scale(1); }
          60% { transform: matrix(1,0,0,1,256,260) scale(1.03, 0.96); }
          100% { transform: matrix(1,0,0,1,256,256) scale(1); }
        }

        .group:hover .podium-star-container {
          animation: starJumpBounce 0.75s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Orange color ONLY on hover */
        .group:hover .orange-star-path {
          stroke: #f97316 !important;
          fill: #f97316 !important;
          fill-opacity: 0.35 !important;
          filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.9));
        }

        .group:hover .podium-impact-group {
          animation: podiumImpact 0.75s ease-out;
        }
      `}</style>

      <g clipPath="url(#__lottie_element_27)">
        {/* Star (Turns Orange on hover) */}
        <g
          className="podium-star-container"
          transform="matrix(1,0,0,1,255.99000549316406,133.4010009765625)"
          style={{ display: "block" }}
        >
          <path
            className="orange-star-path"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
            strokeOpacity="1"
            strokeWidth="32"
            d="M-8.01,-56.9 C-8.01,-56.9 -21.21,-30.4 -21.21,-30.4 C-22.51,-27.8 -25.01,-26 -27.91,-25.6 C-27.91,-25.6 -57.61,-21.3 -57.61,-21.3 C-62.41,-20.7 -65.81,-16.3 -65.21,-11.4 C-64.91,-9.4 -64.01,-7.6 -62.61,-6.2 C-62.61,-6.2 -41.11,14.4 -41.11,14.4 C-39.01,16.4 -38.01,19.3 -38.51,22.2 C-38.51,22.2 -43.61,51.3 -43.61,51.3 C-44.41,56.2 -41.11,60.7 -36.21,61.5 C-34.31,61.8 -32.31,61.5 -30.61,60.6 C-30.61,60.6 -4.11,46.8 -4.11,46.8 C-1.51,45.4 1.59,45.4 4.19,46.8 C4.19,46.8 30.69,60.6 30.69,60.6 C34.99,62.9 40.39,61.2 42.69,56.9 C43.59,55.2 43.89,53.2 43.59,51.3 C43.59,51.3 38.49,22.2 38.49,22.2 C37.99,19.3 38.99,16.4 41.09,14.4 C41.09,14.4 62.59,-6.2 62.59,-6.2 C66.09,-9.6 66.19,-15.1 62.79,-18.6 C61.39,-20 59.59,-21 57.59,-21.2 C57.59,-21.2 27.89,-25.5 27.89,-25.5 C24.99,-25.9 22.49,-27.7 21.19,-30.3 C21.19,-30.3 7.89,-56.8 7.89,-56.8 C5.59,-61.2 0.19,-62.9 -4.21,-60.6 C-5.81,-59.9 -7.11,-58.5 -8.01,-56.9z"
          />
        </g>

        {/* Podium Base Stand (Pure currentColor) */}
        <g className="podium-impact-group" transform="matrix(1,0,0,1,256,256)" style={{ display: "block" }}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            fillOpacity="0"
            stroke="currentColor"
            strokeOpacity="1"
            strokeWidth="32"
            d="M-57.79999923706055,54.20000076293945 C-57.79999923706055,54.20000076293945 -144.5,54.20000076293945 -144.5,54.20000076293945 C-160.5,54.20000076293945 -173.5,67.19999694824219 -173.5,83.19999694824219 C-173.5,83.19999694824219 -173.5,155.39999389648438 -173.5,155.39999389648438 C-173.5,171.3000030517578 -160.5,184.39999389648438 -144.5,184.39999389648438 C-144.5,184.39999389648438 144.5,184.39999389648438 144.5,184.39999389648438 C160.39999389648438,184.39999389648438 173.5,171.39999389648438 173.5,155.39999389648438 C173.5,155.39999389648438 173.5,121.69999694824219 173.5,121.69999694824219 C173.5,105.69999694824219 57.79999923706055,92.69999694824219 57.79999923706055,92.69999694824219 M57.79999923706055,184.3000030517578 C57.79999923706055,184.3000030517578 57.79999923706055,20.5 57.79999923706055,20.5 C57.79999923706055,4.5 44.79999923706055,-8.5 28.799999237060547,-8.5 C28.799999237060547,-8.5 -28.899999618530273,-8.5 -28.899999618530273,-8.5 C-44.79999923706055,-8.5 -57.900001525878906,4.5 -57.900001525878906,20.5 C-57.900001525878906,20.5 -57.900001525878906,184.3000030517578 -57.900001525878906,184.3000030517578"
          />
        </g>
      </g>
    </svg>
  );
}
