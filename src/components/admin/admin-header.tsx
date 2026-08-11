"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/firebase";
import { ShieldAlert, Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function AdminHeader() {
  const { user } = useUser();
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-primary transition-colors" />
        <Separator orientation="vertical" className="mx-2 h-4 opacity-30" />
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <span className="text-xs font-black tracking-widest uppercase">Admin TOKO</span>
        </div>
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari transaksi..." 
            className="pl-10 h-9 bg-muted/30 border-border text-xs font-bold rounded-xl"
          />
        </div>

        <button className="relative h-9 w-9 rounded-xl bg-muted/30 flex items-center justify-center hover:bg-primary/10 transition-colors">
          <Bell className="h-4.5 w-4.5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-black leading-none">{user?.displayName || "Administrator"}</span>
            <span className="text-[10px] font-bold text-primary mt-1">Super Admin</span>
          </div>
          <Avatar className="h-9 w-9 rounded-xl border border-primary/20 shadow-sm">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
