"use client";

import * as React from "react";
import {
  Gamepad2,
  History,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  LifeBuoy,
  Send,
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
import { cn } from "@/lib/utils";

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
      title: "Riwayat Transaksi",
      url: "/history",
      icon: History,
      isActive: pathname === "/history",
    },
    {
      title: "Pengaturan Akun",
      url: "/dashboard", // Placeholder
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ];

  const navSecondary = [
    {
      title: "Pusat Bantuan",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Hubungi Kami",
      url: "#",
      icon: Send,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/50 bg-card/30 backdrop-blur-xl">
      <SidebarHeader className="p-4 md:p-6">
        <Link href="/" className="flex items-center gap-3 px-1 transition-all hover:opacity-80">
          <Logo className="h-9 w-9 shrink-0 shadow-lg shadow-primary/10 rounded-xl" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden animate-in fade-in duration-300">
            <span className="font-headline text-base font-black tracking-tighter text-foreground leading-none">
              STS Pedia
            </span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-tight mt-0.5">
              by StarVale
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[10px] tracking-[0.2em] text-muted-foreground/50 px-4 mb-2">
            OVERVIEW
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    className={cn(
                      "font-bold rounded-xl h-11 px-4 transition-all duration-200 group-data-[collapsible=icon]:px-2",
                      item.isActive 
                        ? "bg-primary/10 text-primary hover:bg-primary/20" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className={cn("h-5 w-5", item.isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="ml-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="font-black text-[10px] tracking-[0.2em] text-muted-foreground/50 px-4 mb-2">
            SUPPORT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="font-bold rounded-xl h-11 px-4 text-muted-foreground hover:bg-muted/50 hover:text-foreground group-data-[collapsible=icon]:px-2"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="ml-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto mb-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Belanja Sekarang"
                  className="font-black rounded-xl h-12 px-4 bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 group-data-[collapsible=icon]:px-2"
                >
                  <Link href="/">
                    <Gamepad2 className="h-5 w-5" />
                    <span className="ml-1">Topup Game</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50 bg-muted/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="font-bold rounded-xl h-11 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all group-data-[collapsible=icon]:px-2"
              tooltip="Keluar dari Akun"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-1">Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}