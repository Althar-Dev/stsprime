"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  LogOut,
  ShieldAlert,
  ChevronLeft
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
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const navAdmin = [
    {
      title: "Ringkasan",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      title: "Kelola Pesanan",
      url: "/admin/orders",
      icon: ShoppingBag,
      isActive: pathname === "/admin/orders",
    },
    {
      title: "Produk & Harga",
      url: "/admin/products",
      icon: Package,
      isActive: pathname === "/admin/products",
    },
    {
      title: "Data Pengguna",
      url: "/admin/users",
      icon: Users,
      isActive: pathname === "/admin/users",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border bg-card">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        <Link href="/admin" className="flex items-center gap-3 px-1 transition-all hover:opacity-80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Logo className="h-10 w-20 group-data-[collapsible=icon]:hidden" />
          <div className="hidden group-data-[collapsible=icon]:flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
        <SidebarGroup className="group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel className="font-black text-[10px] text-muted-foreground/50 px-4 mb-2 group-data-[collapsible=icon]:hidden">
            Manajemen Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navAdmin.map((item) => (
                <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    className={cn(
                      "font-bold rounded-xl h-11 px-4 transition-all duration-200",
                      "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
                      item.isActive
                        ? "!bg-primary !text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className={cn("h-5 w-5 shrink-0", item.isActive ? "!text-primary-foreground" : "text-muted-foreground")} />
                      <span className="ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mt-2">
          <SidebarGroupLabel className="font-black text-[10px] text-muted-foreground/50 px-4 mb-2 group-data-[collapsible=icon]:hidden">
            Lainnya
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton asChild tooltip="Halaman User" className="group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                  <Link href="/dashboard" className="font-bold text-muted-foreground hover:text-primary">
                    <ChevronLeft className="h-5 w-5 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Halaman User</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border bg-muted/20 group-data-[collapsible=icon]:p-1.5">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              onClick={handleLogout}
              className="font-bold rounded-xl h-11 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
              tooltip="Logout Admin"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="ml-1 group-data-[collapsible=icon]:hidden">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}