import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn(
      "relative overflow-hidden",
      className
    )}>
      <Image 
        src="/img/icon.png" 
        alt="STS Pedia Logo" 
        fill 
        className={cn("object-contain", iconClassName)}
        priority
      />
    </div>
  );
}
