"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useUser } from "@/firebase";
import { LoginModal } from "@/components/auth/login-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
        {/* Glow Aura Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4">
          {/* Clean Logo */}
          <div className="relative flex items-center justify-center">
            <Logo className="h-14 sm:h-16 w-28 sm:w-32" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-headline text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center justify-center gap-2">
              Memuat <span className="text-primary">Dashboard...</span>
            </h3>
            <p className="text-xs text-muted-foreground font-bold tracking-wide opacity-80 animate-pulse">
              Menyiapkan data profil, koin, & riwayat transaksi Anda
            </p>
          </div>

          {/* Shimmering Progress Bar */}
          <div className="w-48 sm:w-64 h-1.5 bg-muted/40 rounded-full overflow-hidden border border-border/40">
            <div className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full animate-shimmer" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md w-full bento-card p-10 space-y-8 flex flex-col items-center shadow-2xl bg-card/30 backdrop-blur-sm">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 rotate-3">
            <ShieldAlert className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-3">
            <h1 className="font-headline text-3xl font-black tracking-tighter">Akses Terbatas</h1>
            <p className="text-sm text-muted-foreground font-bold leading-relaxed">
              Anda harus masuk ke akun STSPrime untuk mengakses fitur Dashboard, riwayat transaksi, dan pengaturan profil secara penuh.
            </p>
          </div>
          <div className="flex flex-col w-full gap-3">
            <Button 
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
            >
              Masuk Sekarang
            </Button>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full h-12 rounded-xl font-bold gap-2 hover:bg-muted/50">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
        <LoginModal isOpen={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col bg-background">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
