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
    <header className="sticky top-0 z-40 flex h-16 md:h-20 shrink-0 items-center gap-2 border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-1 md:gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-primary transition-colors" />
        <Separator orientation="vertical" className="hidden xs:block mx-1 md:mx-2 h-4 opacity-30" />
      </div>
      
      <div className="flex flex-1 items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-black text-muted-foreground/60">Halaman</span>
          <Separator orientation="vertical" className="h-2 opacity-30" />
          <span className="text-xs font-bold text-foreground">Pengaturan</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-5 ml-auto sm:ml-0">
          <div className="flex items-center gap-1.5 md:gap-2.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer group">
            <img src="/img/coin.png" alt="Coin" className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] md:text-sm font-black text-primary">0</span>
          </div>

          <div className="hidden xs:block">
            <ThemeToggle />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-border/50">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-black leading-none text-foreground">{user?.displayName || "Gamer"}</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black h-4 px-1.5 mt-1 rounded-sm">Terverifikasi</Badge>
            </div>
            <Avatar className="h-8 w-8 md:h-10 md:w-10 border border-border shadow-sm shrink-0">
              <AvatarImage src={user?.photoURL || ""} alt={user?.email || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-[10px] md:text-xs">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
