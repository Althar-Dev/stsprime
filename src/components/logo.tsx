import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-primary shadow-[0_0_15px_rgba(242,255,0,0.3)]",
      className
    )}>
      <Image 
        src="/img/icon.png" 
        alt="STS Pedia Logo" 
        fill 
        className={cn("object-contain p-1.5", iconClassName)}
        priority
      />
    </div>
  );
}
