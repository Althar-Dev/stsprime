"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const { user } = useUser();
  const db = useFirestore();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      } catch (error) {
        // Fail silently
      }
    }
    fetchProfile();
  }, [user, db]);

  const profileBg = profileData?.profileBg || "bg-muted/30";
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

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
          <span className="text-xs font-bold text-foreground">Dashboard</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-5 ml-auto sm:ml-0">
          <div className="flex items-center gap-2 md:gap-2.5 px-3 md:px-3.5 py-1.5 md:py-2 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer group">
            <img src="/img/coin.png" alt="Coin" className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs md:text-sm font-black text-primary">0</span>
          </div>

          <div className="hidden xs:block">
            <ThemeToggle />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-border/50">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-black leading-none text-foreground">{user?.displayName || "Gamer"}</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black h-4 px-1.5 mt-1 rounded-sm">Terverifikasi</Badge>
            </div>
            <div className={cn(
              "h-9 w-9 md:h-11 md:w-11 rounded-full flex items-center justify-center p-0.5",
              profileBg
            )}>
              <Avatar className="h-full w-full border border-background shadow-sm shrink-0">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                <AvatarFallback className="bg-muted text-muted-foreground font-black text-[10px] md:text-xs">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}