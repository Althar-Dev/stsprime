
"use client";

import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (authLoading) return;
      
      if (!user || !db) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().admin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    }

    checkAdminStatus();
  }, [user, db, authLoading]);

  if (authLoading || checkingAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-black tracking-widest uppercase opacity-50">Memverifikasi Otoritas...</p>
        </div>
      </div>
    );
  }

  if (!user || isAdmin === false) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md w-full bento-card p-10 space-y-8 flex flex-col items-center shadow-2xl bg-card/30 backdrop-blur-sm border-destructive/20">
          <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center border border-destructive/20">
            <Lock className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-3">
            <h1 className="font-headline text-3xl font-black tracking-tighter text-destructive uppercase">Akses Dilarang</h1>
            <p className="text-sm text-muted-foreground font-bold leading-relaxed">
              Area ini terbatas hanya untuk administrator sistem. Identitas Anda tidak memiliki izin yang cukup untuk mengakses kontrol panel ini.
            </p>
          </div>
          <div className="flex flex-col w-full gap-3">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Logo className="h-10 w-20" />
            </Link>
            <div className="h-6 w-px bg-border mx-2" />
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span className="text-xs font-black tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-wider">User Dash</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-wider">Beranda</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
