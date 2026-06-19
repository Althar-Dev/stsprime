"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore, useAuth } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Palette, 
  Bell, 
  Moon, 
  Sun, 
  Monitor,
  Loader2,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || user.displayName || "");
        } else {
          setDisplayName(user.displayName || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user, db]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !auth) return;

    setIsSaving(true);
    try {
      // Update Auth Profile
      await updateProfile(user, { displayName });

      // Update Firestore Profile
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        displayName,
        email: user.email,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, userData, { merge: true })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: userData,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "Profil diperbarui",
        description: "Perubahan nama tampilan Anda telah disimpan.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal memperbarui",
        description: error.message || "Terjadi kesalahan saat menyimpan profil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 font-bold">
          Kelola informasi profil, keamanan akun, dan preferensi aplikasi Anda.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-full sm:w-auto h-auto grid grid-cols-2 sm:flex sm:flex-row gap-1">
          <TabsTrigger value="profile" className="rounded-lg font-bold text-xs gap-2 py-2">
            <User className="h-4 w-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg font-bold text-xs gap-2 py-2">
            <Palette className="h-4 w-4" /> Tampilan
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg font-bold text-xs gap-2 py-2">
            <ShieldCheck className="h-4 w-4" /> Keamanan
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg font-bold text-xs gap-2 py-2">
            <Bell className="h-4 w-4" /> Notifikasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bento-card border-none shadow-sm">
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle className="text-xl font-black">Informasi Dasar</CardTitle>
                <CardDescription className="font-bold text-xs">
                  Nama ini akan terlihat oleh pengguna lain di Leaderboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black tracking-widest text-muted-foreground">EMAIL</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-muted/30 font-bold border-border"
                  />
                  <p className="text-[10px] text-muted-foreground font-bold italic">Email tidak dapat diubah untuk saat ini.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-[10px] font-black tracking-widest text-muted-foreground">NAMA TAMPILAN</Label>
                  <Input 
                    id="displayName" 
                    placeholder="Masukkan nama Anda" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background font-bold border-border"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end bg-muted/20 border-t border-border pt-6">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-primary text-primary-foreground font-black text-xs gap-2 rounded-xl"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Perubahan
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="bento-card border-none shadow-sm bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl font-black">Status Keanggotaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Verified Member</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Terdaftar sejak {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground font-black text-[10px]">ACTIVE</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bento-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Tema Aplikasi</CardTitle>
              <CardDescription className="font-bold text-xs">Pilih bagaimana STS Pedia terlihat di perangkat Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                    theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Sun className={`h-8 w-8 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-black text-xs">Light Mode</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Moon className={`h-8 w-8 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-black text-xs">Dark Mode</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                    theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Monitor className={`h-8 w-8 ${theme === "system" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-black text-xs">System Default</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bento-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Kata Sandi</CardTitle>
              <CardDescription className="font-bold text-xs">Ubah kata sandi Anda secara berkala untuk menjaga keamanan akun.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-black">Kata Sandi Terakhir Diubah</p>
                  <p className="text-[10px] text-muted-foreground font-bold italic">Belum pernah diubah</p>
                </div>
                <Button variant="outline" className="font-black text-xs rounded-xl border-border">
                  Ganti Password
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bento-card border-destructive/20 bg-destructive/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black text-destructive">Danger Zone</CardTitle>
              <CardDescription className="font-bold text-xs">Tindakan ini tidak dapat dibatalkan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="font-black text-xs rounded-xl w-full sm:w-auto">
                Hapus Akun Selamanya
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bento-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Pengaturan Notifikasi</CardTitle>
              <CardDescription className="font-bold text-xs">Kelola bagaimana Anda menerima pembaruan dari STS Pedia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <p className="text-sm font-black">Email Transaksi</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Terima struk pembayaran melalui email.</p>
                </div>
                <div className="h-6 w-10 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <p className="text-sm font-black">Promo & Event</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Dapatkan info Flash Sale dan diskon eksklusif.</p>
                </div>
                <div className="h-6 w-10 bg-muted rounded-full relative">
                  <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
