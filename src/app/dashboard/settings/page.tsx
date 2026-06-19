"use client";

import { useState, useEffect, useRef } from "react";
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
  Moon, 
  Sun, 
  Monitor,
  Loader2,
  Save,
  KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS_CONFIG = [
  { id: "profile", label: "Profil akun", icon: User },
  { id: "appearance", label: "Tampilan tema", icon: Palette },
  { id: "security", label: "Keamanan & sandi", icon: KeyRound },
];

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const moveIndicatorToElement = (element: HTMLElement | null) => {
    if (element) {
      setIndicatorStyle({
        left: element.offsetLeft,
        width: element.offsetWidth,
      });
    }
  };

  const resetIndicatorToActive = () => {
    const activeElement = tabsListRef.current?.querySelector('[data-state="active"]') as HTMLElement;
    moveIndicatorToElement(activeElement);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || user.displayName || "");
        } else if (user.displayName) {
          setDisplayName(user.displayName);
        }
      } catch (error) {
        // Fail silently
      }
    }

    fetchProfile();
  }, [user, db]);

  useEffect(() => {
    const timer = setTimeout(resetIndicatorToActive, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

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

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-2xl md:text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          Pengaturan
        </h1>
        <p className="text-[11px] md:text-sm text-muted-foreground font-bold max-w-2xl opacity-75">
          Kelola informasi profil personal, preferensi keamanan akun, serta sesuaikan tampilan aplikasi sesuai kenyamanan Anda.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <div className="border-b border-border/60 relative overflow-x-auto no-scrollbar scroll-smooth w-full">
          <TabsList 
            ref={tabsListRef} 
            onMouseLeave={resetIndicatorToActive}
            className="bg-transparent h-auto p-0 flex gap-1 md:gap-8 justify-between md:justify-start relative overflow-visible min-w-full md:min-w-max"
          >
            {TABS_CONFIG.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                onMouseEnter={(e) => moveIndicatorToElement(e.currentTarget)}
                title={tab.label}
                className="rounded-none border-b-2 border-transparent bg-transparent flex-1 md:flex-none px-4 md:px-0 py-4 font-bold text-sm text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none transition-all gap-2 relative z-10"
              >
                <tab.icon className="h-5 w-5 md:h-4 md:w-4" />
                <span className="hidden md:inline whitespace-nowrap">{tab.label}</span>
              </TabsTrigger>
            ))}
            
            <div 
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out z-20 pointer-events-none"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width
              }}
            />
          </TabsList>
        </div>

        <div className="w-full">
          <TabsContent value="profile" className="space-y-6 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm overflow-hidden">
              <form onSubmit={handleUpdateProfile}>
                <CardHeader className="p-6 md:p-8">
                  <CardTitle className="text-lg md:text-xl font-black">Informasi Dasar Akun</CardTitle>
                  <CardDescription className="font-bold text-[11px] md:text-xs">
                    Kelola nama publik Anda yang akan terlihat di Leaderboard STS Pedia.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 md:px-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Alamat Email Terdaftar</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ""} 
                      disabled 
                      className="bg-muted/30 font-bold border-border h-12 md:h-11 text-sm cursor-not-allowed opacity-80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Nama Tampilan Publik</Label>
                    <Input 
                      id="displayName" 
                      placeholder="Masukkan nama tampilan baru" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-background font-bold border-border h-12 md:h-11 text-sm focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/10 border-t border-border/30 p-6 md:p-8">
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full md:w-auto bg-primary text-primary-foreground font-black text-xs gap-2 rounded-xl h-12 md:h-11 px-10 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Simpan Perubahan
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="bento-card border-primary/20 bg-primary/5 shadow-sm p-2">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-background/50 rounded-2xl border border-primary/10 gap-6 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 shrink-0">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-base font-black text-foreground">Status Keanggotaan</p>
                      <p className="text-[11px] md:text-xs text-muted-foreground font-bold opacity-75">Akun Anda telah terverifikasi secara resmi.</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-black text-[10px] px-6 py-2 uppercase tracking-widest rounded-lg">Verified</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader className="p-6 md:p-8">
                <CardTitle className="text-lg md:text-xl font-black">Tema Antarmuka</CardTitle>
                <CardDescription className="font-bold text-[11px] md:text-xs">Personalisasi tampilan aplikasi sesuai preferensi cahaya Anda.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'light', name: 'Mode Terang', icon: Sun },
                    { id: 'dark', name: 'Mode Gelap', icon: Moon },
                    { id: 'system', name: 'Sistem Default', icon: Monitor },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all group relative",
                        theme === t.id 
                          ? "border-primary bg-primary/5 shadow-inner" 
                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
                      )}
                    >
                      <t.icon className={cn(
                        "h-10 w-10 transition-colors",
                        theme === t.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="font-black text-xs uppercase tracking-tighter">{t.name}</span>
                      {theme === t.id && (
                        <div className="absolute top-2 right-2">
                           <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader className="p-6 md:p-8">
                <CardTitle className="text-lg md:text-xl font-black">Keamanan Akun & Sandi</CardTitle>
                <CardDescription className="font-bold text-[11px] md:text-xs">Pastikan akun Anda tetap aman dengan memperbarui kata sandi secara berkala.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8 space-y-4">
                <div className="p-6 bg-muted/30 rounded-2xl border border-border/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-black text-foreground">Ganti Kata Sandi</p>
                    <p className="text-[11px] md:text-xs text-muted-foreground font-bold italic opacity-75">Tautan reset sandi akan dikirimkan ke email Anda.</p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto font-black text-[10px] uppercase tracking-widest rounded-xl border-border h-12 md:h-11 px-8 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all">
                    Update Sandi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
