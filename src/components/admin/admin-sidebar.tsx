"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingBag,
  Package,
  Layers,
  Ticket,
  Zap,
  Coins,
  ArrowDownCircle,
  ArrowUpCircle,
  Undo2,
  FileText,
  Image as ImageIcon,
  Monitor,
  Grid3X3,
  Palette,
  Globe,
  Cpu,
  Server,
  CreditCard,
  Wallet,
  Shield,
  Trophy,
  Settings,
  LogOut,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Award,
  Lock,
  Crown,
  FileImage,
  Database
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

  const menuGroups = [
    {
      label: "Dashboard",
      items: [
        { title: "Overview", url: "/admin", icon: LayoutDashboard },
        { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
      ]
    },
    {
      label: "Shop",
      items: [
        { title: "Users", url: "/admin/shop/users", icon: Users },
        { title: "Transactions", url: "/admin/shop/transactions", icon: ShoppingBag },
        { title: "Products", url: "/admin/shop/products", icon: Package },
        { title: "Categories", url: "/admin/shop/categories", icon: Layers },
        { title: "Vouchers", url: "/admin/shop/vouchers", icon: Ticket },
        { title: "Flash Sales", url: "/admin/shop/flash-sales", icon: Zap },
        { title: "Coins", url: "/admin/shop/coins", icon: Coins },
        { title: "Deposits", url: "/admin/shop/deposits", icon: ArrowDownCircle },
        { title: "Withdrawals", url: "/admin/shop/withdrawals", icon: ArrowUpCircle },
        { title: "Refunds", url: "/admin/shop/refunds", icon: Undo2 },
        { title: "Reports", url: "/admin/shop/reports", icon: FileText },
      ]
    },
    {
      label: "Gallery",
      items: [
        { title: "Banners", url: "/admin/gallery/banners", icon: Monitor },
        { title: "Icons", url: "/admin/gallery/icons", icon: Grid3X3 },
        { title: "Backgrounds", url: "/admin/gallery/backgrounds", icon: Palette },
        { title: "Badges", url: "/admin/gallery/badges", icon: Award },
        { title: "Others", url: "/admin/gallery/others", icon: FileImage },
      ]
    },
    {
      label: "Providers",
      items: [
        { title: "DigiFlazz", url: "/admin/providers/digiflazz", icon: Server },
        { title: "Orderkuota", url: "/admin/providers/orderkuota", icon: Cpu },
      ]
    },
    {
      label: "Payments",
      items: [
        { title: "GoPay Merchant", url: "/admin/payments/gopay", icon: Wallet },
        { title: "Midtrans", url: "/admin/payments/midtrans", icon: Globe },
        { title: "Xendit", url: "/admin/payments/xendit", icon: CreditCard },
      ]
    },
    {
      label: "System",
      items: [
        { title: "Roles", url: "/admin/system/roles", icon: Lock },
        { title: "Member VIP", url: "/admin/system/vip", icon: Crown },
        { title: "Member Level", url: "/admin/system/member-levels", icon: Trophy },
        { title: "R2 Storage", url: "/admin/system/r2", icon: Database },
        { title: "Settings", url: "/admin/system/settings", icon: Settings },
      ]
    }
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

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1 overflow-x-hidden">
        {menuGroups.map((group, idx) => (
          <SidebarGroup key={idx} className="group-data-[collapsible=icon]:px-0">
            <SidebarGroupLabel className="font-black text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 px-4 mb-2 group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "font-bold rounded-xl h-10 px-4 transition-all duration-200",
                          "group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
                          isActive
                            ? "!bg-primary !text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "!text-primary-foreground" : "text-muted-foreground")} />
                          <span className="ml-1 text-xs group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-2 group-data-[collapsible=icon]:px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton asChild tooltip="Halaman User" className="group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                  <Link href="/dashboard" className="font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ChevronLeft className="h-4.5 w-4.5 shrink-0" />
                    <span className="ml-1 text-xs group-data-[collapsible=icon]:hidden">Halaman User</span>
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
              className="font-bold rounded-xl h-11 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
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
