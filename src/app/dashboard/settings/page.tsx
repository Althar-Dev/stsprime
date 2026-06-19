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
  Save,
  KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      await updateProfile(user, { displayName });

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
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Pengaturan
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-bold">
          Kelola informasi profil, keamanan akun, dan preferensi aplikasi Anda.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Tabs List */}
        <TabsList className="flex md:flex-col h-auto bg-transparent p-0 justify-start space-x-2 md:space-x-0 md:space-y-1 w-full md:w-64 overflow-x-auto no-scrollbar shrink-0 flex-nowrap">
          <TabsTrigger 
            value="profile" 
            className="rounded-xl font-bold text-xs gap-3 py-3 px-4 justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all w-auto md:w-full border border-transparent data-[state=active]:border-primary/20 shrink-0 whitespace-nowrap"
          >
            <User className="h-4 w-4" /> Profil akun
          </TabsTrigger>
          <TabsTrigger 
            value="appearance" 
            className="rounded-xl font-bold text-xs gap-3 py-3 px-4 justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all w-auto md:w-full border border-transparent data-[state=active]:border-primary/20 shrink-0 whitespace-nowrap"
          >
            <Palette className="h-4 w-4" /> Tampilan tema
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="rounded-xl font-bold text-xs gap-3 py-3 px-4 justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all w-auto md:w-full border border-transparent data-[state=active]:border-primary/20 shrink-0 whitespace-nowrap"
          >
            <KeyRound className="h-4 w-4" /> Keamanan & sandi
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-xl font-bold text-xs gap-3 py-3 px-4 justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all w-auto md:w-full border border-transparent data-[state=active]:border-primary/20 shrink-0 whitespace-nowrap"
          >
            <Bell className="h-4 w-4" /> Notifikasi
          </TabsTrigger>
        </TabsList>

        {/* Content Area */}
        <div className="flex-1 w-full">
          <TabsContent value="profile" className="space-y-6 mt-0 focus-visible:outline-none">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <form onSubmit={handleUpdateProfile}>
                <CardHeader>
                  <CardTitle className="text-xl font-black">Informasi dasar</CardTitle>
                  <CardDescription className="font-bold text-xs">
                    Nama ini akan terlihat oleh pengguna lain di papan peringkat global.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Alamat email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ""} 
                      disabled 
                      className="bg-muted/30 font-bold border-border h-11"
                    />
                    <p className="text-[10px] text-muted-foreground font-bold italic">Email tidak dapat diubah untuk saat ini karena terhubung dengan akun utama.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Nama tampilan</Label>
                    <Input 
                      id="displayName" 
                      placeholder="Masukkan nama tampilan Anda" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-background font-bold border-border h-11 focus-visible:ring-primary"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/10 border-t border-border/30 pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground font-black text-xs gap-2 rounded-xl h-11 px-8 shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Simpan perubahan
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="bento-card border-primary/20 bg-primary/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black">Status keanggotaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-5 bg-background/50 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">Anggota terverifikasi</p>
                      <p className="text-[10px] text-muted-foreground font-bold">Terdaftar sejak {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-black text-[10px] px-4 py-1">Aktif</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-0 focus-visible:outline-none">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black">Tema aplikasi</CardTitle>
                <CardDescription className="font-bold text-xs">Pilih bagaimana antarmuka STS Pedia terlihat di perangkat Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'light', name: 'Mode terang', icon: Sun },
                    { id: 'dark', name: 'Mode gelap', icon: Moon },
                    { id: 'system', name: 'Sistem', icon: Monitor },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all group",
                        theme === t.id 
                          ? "border-primary bg-primary/5 shadow-inner" 
                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
                      )}
                    >
                      <t.icon className={cn(
                        "h-10 w-10 transition-colors",
                        theme === t.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="font-black text-xs">{t.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-0 focus-visible:outline-none">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black">Keamanan akun</CardTitle>
                <CardDescription className="font-bold text-xs">Kelola kata sandi dan pengaturan keamanan akses Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-5 bg-muted/30 rounded-2xl border border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-foreground">Kata sandi akun</p>
                    <p className="text-[10px] text-muted-foreground font-bold italic">Terakhir diperbarui: belum pernah</p>
                  </div>
                  <Button variant="outline" className="font-black text-xs rounded-xl border-border h-11 px-6 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all">
                    Ubah sandi
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bento-card border-destructive/20 bg-destructive/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black text-destructive">Zona bahaya</CardTitle>
                <CardDescription className="font-bold text-xs">Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="font-black text-xs rounded-xl w-full sm:w-auto h-11 px-8 shadow-lg shadow-destructive/10">
                  Hapus akun selamanya
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-0 focus-visible:outline-none">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black">Notifikasi aplikasi</CardTitle>
                <CardDescription className="font-bold text-xs">Atur jenis pembaruan yang ingin Anda terima.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-5 border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">Email transaksi</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Terima struk pembayaran otomatis melalui email.</p>
                  </div>
                  <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer shadow-sm">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">Promo & penawaran</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Dapatkan info flash sale dan diskon eksklusif member.</p>
                  </div>
                  <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer border border-border/50">
                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
