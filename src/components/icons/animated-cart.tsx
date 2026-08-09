import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedCartIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function AnimatedCartIcon({ className, ...props }: AnimatedCartIconProps) {
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
        .cart-body {
          transform-origin: 12px 14px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease;
        }

        .cart-wheel-1 {
          transform-origin: 9px 20px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease;
        }

        .cart-wheel-2 {
          transform-origin: 19px 20px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease;
        }

        /* Hover Animation Sequence - Drive Forward & Return */
        @keyframes cartDriveReturn {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
          }
          35% {
            transform: translateY(-2px) translateX(3px) rotate(-6deg) scale(1.05);
          }
          75% {
            transform: translateY(-1px) translateX(1px) rotate(-2deg) scale(1.02);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
          }
        }

        .group:hover .cart-body {
          animation: cartDriveReturn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          stroke: #01ca93;
          filter: drop-shadow(0 0 6px rgba(1, 202, 147, 0.6));
        }

        .group:hover .cart-wheel-1 {
          transform: rotate(360deg) scale(1.15);
          stroke: #01ca93;
        }

        .group:hover .cart-wheel-2 {
          transform: rotate(360deg) scale(1.15);
          stroke: #01ca93;
        }

        /* Plus Item Inside Cart Bounces Up */
        .cart-item-plus {
          opacity: 0;
          transform: translateY(4px) scale(0);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .group:hover .cart-item-plus {
          opacity: 1;
          transform: translateY(-2px) scale(1);
          stroke: #01ca93;
        }

        /* Back Wheel Smoke Puffs (Efek Asap Roda Belakang) */
        @keyframes smokePuff1 {
          0% {
            opacity: 0;
            transform: translate(7px, 20px) scale(0);
          }
          30% {
            opacity: 0.95;
            transform: translate(2px, 19px) scale(1.3);
          }
          70% {
            opacity: 0.4;
            transform: translate(-3px, 17px) scale(1.7);
          }
          100% {
            opacity: 0;
            transform: translate(-7px, 16px) scale(2.2);
          }
        }

        @keyframes smokePuff2 {
          0% {
            opacity: 0;
            transform: translate(8px, 21px) scale(0);
          }
          40% {
            opacity: 0.85;
            transform: translate(4px, 22px) scale(1.2);
          }
          80% {
            opacity: 0.3;
            transform: translate(-1px, 23px) scale(1.6);
          }
          100% {
            opacity: 0;
            transform: translate(-5px, 24px) scale(2);
          }
        }

        .cart-smoke {
          opacity: 0;
          fill: #01ca93;
          stroke: none;
        }

        .group:hover .smoke-1 {
          animation: smokePuff1 0.75s ease-out 0.05s;
        }

        .group:hover .smoke-2 {
          animation: smokePuff2 0.75s ease-out 0.15s;
        }
      `}</style>

      {/* Back Wheel Smoke Cloud Particles */}
      <circle className="cart-smoke smoke-1" cx="0" cy="0" r="1.5" />
      <circle className="cart-smoke smoke-2" cx="0" cy="0" r="1.2" />

      {/* Cart Body & Handle */}
      <path
        className="cart-body"
        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
      />

      {/* Item Plus Badge popping inside cart */}
      <path className="cart-item-plus" d="M12 7v4M10 9h4" strokeWidth="2.5" />

      {/* Left Wheel */}
      <circle className="cart-wheel-1" cx="9" cy="20" r="1.5" />

      {/* Right Wheel */}
      <circle className="cart-wheel-2" cx="19" cy="20" r="1.5" />
    </svg>
  );
}
