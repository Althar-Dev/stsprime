"use client";

import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Logo } from "@/components/logo";

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
      
      if (!user) {
        router.push("/");
        return;
      }

      if (!db) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().admin === true) {
          setIsAdmin(true);
          setCheckingAdmin(false);
        } else {
          setIsAdmin(false);
          router.push("/");
        }
      } catch (error) {
        setIsAdmin(false);
        router.push("/");
      }
    }

    checkAdminStatus();
  }, [user, db, authLoading, router]);

  if (authLoading || checkingAdmin || isAdmin === false) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Logo className="h-16 w-32" />
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-[10px] font-black tracking-widest uppercase opacity-50">Mengautentikasi Otoritas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col bg-background min-w-0 overflow-x-hidden w-full max-w-full">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
