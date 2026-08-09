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
        src="/img/logo.png"
        alt="STSPrime Logo"
        fill
        className={cn("object-contain", iconClassName)}
        priority
      />
    </div>
  );
}
