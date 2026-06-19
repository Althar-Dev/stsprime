"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <div className="flex flex-1 items-center justify-between">
        <div>
           {/* Breadcrumb style text or just space */}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
            <img src="/img/coin.png" alt="Coin" className="h-5 w-5" />
            <span className="text-xs font-black">0</span>
          </div>
          
          <ThemeToggle />
          
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black leading-none">{user?.displayName || "Gamer"}</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black h-4 px-1 mt-1">MEMBER</Badge>
            </div>
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.photoURL || ""} alt={user?.email || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
