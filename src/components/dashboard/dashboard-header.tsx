"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 flex h-16 md:h-20 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-8">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-primary transition-colors" />
      <Separator orientation="vertical" className="mx-2 h-4 opacity-30" />
      
      <div className="flex flex-1 items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest text-muted-foreground/60">PAGES</span>
          <Separator orientation="vertical" className="h-2 opacity-30" />
          <span className="text-xs font-bold text-foreground">Dashboard</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          {/* STS Coin Display */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer group">
            <img src="/img/coin.png" alt="Coin" className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs md:text-sm font-black text-primary">0</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 border-x border-border/50 px-2 md:px-4">
             <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground rounded-xl">
               <Search className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground rounded-xl">
               <Bell className="h-4 w-4" />
             </Button>
          </div>
          
          <ThemeToggle />
          
          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-border/50">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-black leading-none text-foreground">{user?.displayName || "Gamer"}</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black h-4 px-1.5 mt-1 rounded-sm">VERIFIED MEMBER</Badge>
            </div>
            <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-border/50 shadow-sm">
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
