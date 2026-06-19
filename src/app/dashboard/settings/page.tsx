"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useFirestore, useAuth } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import Image from "next/image";
import { getAvatarFiles } from "./actions";

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
  KeyRound,
  Check
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
  const [photoURL, setPhotoURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFiles, setAvatarFiles] = useState<string[]>([]);
  
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

  // Fetch daftar avatar dari server
  useEffect(() => {
    async function loadAvatars() {
      const files = await getAvatarFiles();
      setAvatarFiles(files);
    }
    loadAvatars();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || user.displayName || "");
          setPhotoURL(data.photoURL || user.photoURL || "");
        } else {
          setDisplayName(user.displayName || "");
          setPhotoURL(user.photoURL || "");
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
      await updateProfile(user, { displayName, photoURL });

      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        displayName,
        photoURL,
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
        description: "Perubahan profil Anda telah berhasil disimpan.",
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
    <div className="p-4 md:p-6 lg:p-10 space-y-8 md:space-y-12 w-full mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-2xl md:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          </div>
          Pengaturan
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-bold opacity-75">
          Kelola informasi profil personal, preferensi tampilan tema aplikasi, serta tingkatkan keamanan akun Anda.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8 md:space-y-12">
        <div className="border-b border-border/60 relative overflow-x-auto no-scrollbar scroll-smooth w-full">
          <TabsList 
            ref={tabsListRef} 
            onMouseLeave={resetIndicatorToActive}
            className="bg-transparent h-auto p-0 flex gap-4 md:gap-12 justify-between md:justify-start relative overflow-visible min-w-full md:min-w-max"
          >
            {TABS_CONFIG.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                onMouseEnter={(e) => moveIndicatorToElement(e.currentTarget)}
                className="rounded-none border-b-2 border-transparent bg-transparent flex-1 md:flex-none px-4 md:px-0 py-5 font-bold text-sm md:text-base text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none transition-all gap-3 relative z-10 group"
              >
                <tab.icon className={cn(
                  "h-6 w-6 md:h-5 md:w-5 transition-transform group-hover:scale-110",
                  activeTab === tab.id && "text-primary"
                )} />
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
          <TabsContent value="profile" className="space-y-8 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm overflow-hidden">
              <form onSubmit={handleUpdateProfile}>
                <CardHeader className="p-6 md:p-10">
                  <CardTitle className="text-xl md:text-2xl font-black">Informasi Dasar Akun</CardTitle>
                  <CardDescription className="font-bold text-xs md:text-sm">
                    Sesuaikan identitas digital Anda di STS Pedia agar lebih mudah dikenali.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 md:px-10 space-y-10">
                  
                  {/* Avatar Picker Section */}
                  <div className="space-y-6">
                    <Label className="text-[10px] md:text-xs font-black tracking-widest text-muted-foreground uppercase">Pilih Avatar Profil</Label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                      {avatarFiles.length > 0 ? (
                        avatarFiles.map((file, i) => {
                          const avatarPath = `/img/ava/${file}`;
                          const isSelected = photoURL === avatarPath;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setPhotoURL(avatarPath)}
                              className={cn(
                                "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 group",
                                isSelected 
                                  ? "border-primary shadow-lg ring-4 ring-primary/20" 
                                  : "border-border/30 bg-muted/20 hover:border-primary/50"
                              )}
                            >
                              <Image 
                                src={avatarPath} 
                                alt={`Avatar ${file}`} 
                                fill 
                                className="object-cover"
                                sizes="(max-width: 768px) 25vw, 10vw"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in zoom-in duration-300">
                                  <Check className="h-6 w-6 text-primary-foreground drop-shadow-md" />
                                </div>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-8 text-center border border-dashed rounded-2xl">
                          <p className="text-xs font-bold text-muted-foreground">Tidak ada avatar ditemukan di /img/ava/</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-[10px] md:text-xs font-black tracking-widest text-muted-foreground uppercase">Alamat Email Terdaftar</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="bg-muted/30 font-bold border-border h-12 md:h-14 text-sm md:text-base cursor-not-allowed opacity-80 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="displayName" className="text-[10px] md:text-xs font-black tracking-widest text-muted-foreground uppercase">Nama Tampilan Publik</Label>
                      <Input 
                        id="displayName" 
                        placeholder="Masukkan nama tampilan baru" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-background font-bold border-border h-12 md:h-14 text-sm md:text-base focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/10 border-t border-border/30 p-6 md:p-10">
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full md:w-auto bg-primary text-primary-foreground font-black text-sm md:text-base gap-3 rounded-2xl h-12 md:h-14 px-12 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Simpan Perubahan
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="bento-card border-primary/20 bg-primary/5 shadow-sm p-2">
              <CardContent className="p-6 md:p-10">
                <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-background/50 rounded-3xl border border-primary/10 gap-8 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30 shrink-0">
                      <ShieldCheck className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-black text-foreground">Status Keanggotaan</p>
                      <p className="text-xs md:text-sm text-muted-foreground font-bold opacity-75">Akun Anda telah terverifikasi sebagai member STS Pedia.</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-black text-[10px] md:text-xs px-8 py-3 uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10">Verified Member</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-8 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader className="p-6 md:p-10">
                <CardTitle className="text-xl md:text-2xl font-black">Tema Antarmuka</CardTitle>
                <CardDescription className="font-bold text-xs md:text-sm">Sesuaikan gaya visual aplikasi agar lebih nyaman bagi mata Anda.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-10 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { id: 'light', name: 'Mode Terang', icon: Sun },
                    { id: 'dark', name: 'Mode Gelap', icon: Moon },
                    { id: 'system', name: 'Sistem Default', icon: Monitor },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex flex-col items-center gap-6 p-10 rounded-3xl border-2 transition-all group relative",
                        theme === t.id 
                          ? "border-primary bg-primary/5 shadow-inner scale-[1.02]" 
                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/30 hover:scale-[1.01]"
                      )}
                    >
                      <t.icon className={cn(
                        "h-12 w-12 md:h-14 md:w-14 transition-colors",
                        theme === t.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="font-black text-xs md:text-sm uppercase tracking-tighter">{t.name}</span>
                      {theme === t.id && (
                        <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                           <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                           </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-8 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader className="p-6 md:p-10">
                <CardTitle className="text-xl md:text-2xl font-black">Keamanan Akun & Sandi</CardTitle>
                <CardDescription className="font-bold text-xs md:text-sm">Lindungi aset digital Anda dengan memperbarui informasi keamanan.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-10 pb-10 space-y-6">
                <div className="p-8 bg-muted/30 rounded-3xl border border-border/30 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
                  <div className="flex flex-col gap-2">
                    <p className="text-base md:text-lg font-black text-foreground">Ganti Kata Sandi</p>
                    <p className="text-xs md:text-sm text-muted-foreground font-bold italic opacity-75">Tautan aman untuk mereset sandi akan dikirimkan ke alamat email terdaftar Anda.</p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto font-black text-[10px] md:text-xs uppercase tracking-widest rounded-2xl border-border h-12 md:h-14 px-10 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm">
                    Kirim Link Reset
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
