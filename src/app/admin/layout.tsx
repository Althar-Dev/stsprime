"use client";

import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import AdminLoadingSkeleton from "@/components/admin/admin-loading-skeleton";

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

  if (authLoading || checkingAdmin) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="flex flex-col h-screen max-h-screen overflow-hidden bg-background min-w-0 w-full max-w-full">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
            <AdminLoadingSkeleton />
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col h-screen max-h-screen overflow-hidden bg-background min-w-0 w-full max-w-full">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
