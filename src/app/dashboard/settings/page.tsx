
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Check,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS_CONFIG = [
  { id: "profile", label: "Profil", icon: User },
  { id: "appearance", label: "Tema", icon: Palette },
  { id: "security", label: "Keamanan", icon: KeyRound },
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
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  
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
    async function loadAvatars() {
      try {
        const files = await getAvatarFiles();
        setAvatarFiles(files);
      } catch (err) {
        // Fail silently
      }
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
        title: "Berhasil",
        description: "Profil Anda telah diperbarui.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message || "Terjadi kesalahan.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "G";

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
          Kelola profil dan preferensi akun Anda.
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
                  <CardTitle className="text-xl md:text-2xl font-black">Informasi Profil</CardTitle>
                </CardHeader>
                <CardContent className="px-6 md:px-10 space-y-12">
                  
                  {/* Avatar Picker Section */}
                  <div className="flex flex-col items-center sm:items-start gap-8">
                    <div className="relative group">
                      <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                        <AvatarImage src={photoURL} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-4xl">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      
                      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                        <DialogTrigger asChild>
                          <button 
                            type="button"
                            className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
                          >
                            <Camera className="h-8 w-8 text-white mb-2" />
                            <span className="text-[10px] text-white font-black tracking-widest uppercase">Ganti</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border-border bg-background">
                          <DialogHeader>
                            <DialogTitle className="font-black text-xl">Pilih Avatar</DialogTitle>
                            <DialogDescription className="font-bold">
                              Gunakan karakter unik untuk profil digital Anda.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 py-6">
                            {avatarFiles.length > 0 ? (
                              avatarFiles.map((file, i) => {
                                const avatarPath = `/img/ava/${file}`;
                                const isSelected = photoURL === avatarPath;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setPhotoURL(avatarPath);
                                      setIsAvatarModalOpen(false);
                                    }}
                                    className={cn(
                                      "relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 group",
                                      isSelected 
                                        ? "border-primary shadow-lg ring-2 ring-primary/20" 
                                        : "border-border/30 bg-muted/20 hover:border-primary/50"
                                    )}
                                  >
                                    <Image 
                                      src={avatarPath} 
                                      alt={`Avatar ${file}`} 
                                      fill 
                                      className="object-cover"
                                      sizes="(max-width: 768px) 33vw, 15vw"
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
                              <div className="col-span-full py-12 text-center border border-dashed rounded-3xl bg-muted/10">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-3" />
                                <p className="text-xs font-bold text-muted-foreground">Memuat koleksi...</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 w-full">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Email</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ""} 
                          disabled 
                          className="bg-muted/30 font-bold border-border h-12 text-sm cursor-not-allowed opacity-80 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="displayName" className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Nama Tampilan</Label>
                        <Input 
                          id="displayName" 
                          placeholder="Nama Anda" 
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="bg-background font-bold border-border h-12 text-sm focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/10 border-t border-border/30 p-6 md:p-10">
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full md:w-auto bg-primary text-primary-foreground font-black text-sm gap-3 rounded-2xl h-12 px-12 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                  >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Simpan Perubahan
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shrink-0">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-lg font-black">Status Member</p>
                  <p className="text-xs text-muted-foreground font-bold">Akun Anda telah terverifikasi sebagai member aktif.</p>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground font-black px-6 py-2 rounded-xl">Verified Member</Badge>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-8 mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="bento-card border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader className="p-6 md:p-10">
                <CardTitle className="text-xl md:text-2xl font-black">Tema Visual</CardTitle>
                <CardDescription className="font-bold">Pilih gaya yang paling nyaman untuk Anda.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-10 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { id: 'light', name: 'Mode Terang', icon: Sun },
                    { id: 'dark', name: 'Mode Gelap', icon: Moon },
                    { id: 'system', name: 'Sistem', icon: Monitor },
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
                        "h-12 w-12 transition-colors",
                        theme === t.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="font-black text-xs uppercase tracking-tighter">{t.name}</span>
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
                <CardTitle className="text-xl md:text-2xl font-black">Keamanan Akun</CardTitle>
              </CardHeader>
              <CardContent className="px-6 md:px-10 pb-10 space-y-6">
                <div className="p-8 bg-muted/30 rounded-3xl border border-border/30 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-black">Ganti Kata Sandi</p>
                    <p className="text-xs text-muted-foreground font-bold">Link reset sandi akan dikirim ke email terdaftar.</p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto font-black text-xs uppercase tracking-widest rounded-2xl h-12 px-10 border-border hover:bg-primary/10">
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
