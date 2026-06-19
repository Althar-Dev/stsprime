"use client";

import * as React from "react";
import {
  Gamepad2,
  History,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const auth = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Riwayat",
      url: "/history",
      icon: History,
      isActive: pathname === "/history",
    },
    {
      title: "Settings",
      url: "/dashboard", // Sementara diarahkan ke dashboard
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 px-1">
          <Logo className="h-8 w-8 shrink-0" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline text-sm font-black tracking-tighter text-foreground leading-none">
              STS Pedia
            </span>
            <span className="text-[9px] font-bold text-muted-foreground tracking-tight">
              from StarVale
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[10px] tracking-widest text-muted-foreground/60">
            MENU UTAMA
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    className="font-bold rounded-xl h-11 transition-all active:scale-95"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="font-black text-[10px] tracking-widest text-muted-foreground/60">
            AKSI
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Kembali ke Beranda"
                  className="font-bold rounded-xl h-11 text-primary hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                >
                  <Link href="/">
                    <ChevronLeft />
                    <span>Topup Game</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="font-bold rounded-xl h-11 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95"
              tooltip="Keluar"
            >
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
