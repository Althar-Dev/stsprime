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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
  Camera,
  Layers,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS_CONFIG = [
  { id: "profile", label: "Profil", icon: User },
  { id: "appearance", label: "Tema", icon: Palette },
  { id: "security", label: "Keamanan", icon: KeyRound },
];

const BACKGROUND_OPTIONS = [
  // Solids
  { id: "default", name: "Netral", class: "bg-muted/30" },
  { id: "primary", name: "STS Gold", class: "bg-primary" },
  { id: "accent", name: "STS Blue", class: "bg-accent" },
  { id: "dark", name: "Obsidian", class: "bg-slate-900" },
  { id: "slate-800", name: "Slate", class: "bg-slate-800" },
  { id: "zinc-900", name: "Zinc", class: "bg-zinc-900" },
  { id: "rose", name: "Rose", class: "bg-rose-500" },
  { id: "emerald", name: "Emerald", class: "bg-emerald-500" },
  { id: "amber", name: "Amber", class: "bg-amber-500" },
  { id: "cyan", name: "Cyan", class: "bg-cyan-500" },
  { id: "violet", name: "Violet", class: "bg-violet-600" },
  { id: "fuchsia", name: "Fuchsia", class: "bg-fuchsia-600" },
  { id: "teal", name: "Teal", class: "bg-teal-500" },
  { id: "indigo", name: "Indigo", class: "bg-indigo-600" },
  { id: "lime", name: "Lime", class: "bg-lime-500" },
  { id: "orange", name: "Orange", class: "bg-orange-500" },
  { id: "pink", name: "Pink", class: "bg-pink-500" },
  { id: "sky", name: "Sky", class: "bg-sky-400" },
  { id: "red", name: "Crimson", class: "bg-red-600" },
  { id: "yellow", name: "Lemon", class: "bg-yellow-400" },
  { id: "gray", name: "Stone", class: "bg-stone-500" },
  { id: "deep-blue", name: "Navy", class: "bg-blue-900" },

  // Gradients
  { id: "grad-hyper", name: "Hyper", class: "bg-gradient-to-br from-primary to-accent" },
  { id: "grad-legendary", name: "Legendary", class: "bg-gradient-to-br from-slate-900 via-primary/50 to-slate-900" },
  { id: "grad-cosmic", name: "Cosmic", class: "bg-gradient-to-br from-purple-600 to-blue-500" },
  { id: "grad-sunset", name: "Sunset", class: "bg-gradient-to-br from-orange-500 to-rose-500" },
  { id: "grad-ocean", name: "Ocean", class: "bg-gradient-to-br from-cyan-500 to-blue-500" },
  { id: "grad-neon", name: "Neon", class: "bg-gradient-to-br from-green-400 to-blue-500" },
  { id: "grad-mystic", name: "Mystic", class: "bg-gradient-to-br from-indigo-900 to-violet-800" },
  { id: "grad-fire", name: "Inferno", class: "bg-gradient-to-br from-red-600 to-yellow-500" },
  { id: "grad-glacier", name: "Glacier", class: "bg-gradient-to-br from-blue-100 to-blue-300" },
  { id: "grad-midnight", name: "Midnight", class: "bg-gradient-to-br from-zinc-950 to-slate-900" },
  { id: "grad-aurora", name: "Aurora", class: "bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600" },
  { id: "grad-lava", name: "Lava", class: "bg-gradient-to-r from-red-800 via-orange-600 to-yellow-500" },
  { id: "grad-forest", name: "Forest", class: "bg-gradient-to-b from-emerald-900 to-green-700" },
  { id: "grad-candy", name: "Candy", class: "bg-gradient-to-br from-pink-400 to-purple-400" },
  { id: "grad-dawn", name: "Dawn", class: "bg-gradient-to-r from-blue-700 to-orange-400" },
  { id: "grad-dusk", name: "Dusk", class: "bg-gradient-to-tr from-slate-900 to-slate-700" },
  { id: "grad-mint", name: "Minty", class: "bg-gradient-to-br from-teal-200 to-teal-500" },
  { id: "grad-royal", name: "Royal", class: "bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500" },
  { id: "grad-cherry", name: "Cherry", class: "bg-gradient-to-b from-rose-400 to-rose-700" },
  { id: "grad-space", name: "Deep Space", class: "bg-gradient-to-bl from-gray-900 via-purple-900 to-violet-600" },
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
  const [profileBg, setProfileBg] = useState("bg-muted/30");
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
          setProfileBg(data.profileBg || "bg-muted/30");
        } else {
          setDisplayName(user.displayName || "");
          setPhotoURL(user.photoURL || "");
          setProfileBg("bg-muted/30");
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
        profileBg,
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

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

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
                      <div className={cn(
                        "h-32 w-32 md:h-40 md:w-40 rounded-full flex items-center justify-center p-1 transition-all duration-500",
                        profileBg
                      )}>
                        <Avatar className="h-full w-full border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                          <AvatarImage src={photoURL} className="object-cover" />
                          <AvatarFallback className="bg-muted text-muted-foreground font-black text-4xl">
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                        <DialogTrigger asChild>
                          <button 
                            type="button"
                            className="absolute inset-0 z-10"
                          >
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                              <Camera className="h-8 w-8 text-white mb-2" />
                              <span className="text-[10px] text-white font-black tracking-widest uppercase">Ganti</span>
                            </div>
                            
                            {/* Floating Edit Button */}
                            <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-xl border-4 border-background transform transition-all group-hover:scale-110">
                              <Camera className="h-5 w-5" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl border-border bg-background p-0 modal-scrollbar scroll-smooth">
                          <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border p-4 flex flex-col items-center shrink-0">
                            <DialogClose className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted/50 transition-colors">
                              <X className="h-5 w-5" />
                            </DialogClose>
                            
                            <DialogHeader className="text-center px-8">
                              <DialogTitle className="font-black text-lg">Kustomisasi Avatar</DialogTitle>
                              <DialogDescription className="font-bold text-[10px]">
                                Sesuaikan karakter dan latar belakang profil Anda.
                              </DialogDescription>
                            </DialogHeader>

                            {/* Live Preview Inside Modal - Reduced Height */}
                            <div className="mt-3 flex items-center gap-4 py-2 px-6 bg-muted/20 rounded-2xl border border-dashed border-border overflow-hidden relative w-full max-w-sm">
                              <div className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center p-0.5 transition-all duration-500 shrink-0",
                                profileBg
                              )}>
                                <Avatar className="h-full w-full border border-background shadow-md">
                                  <AvatarImage src={photoURL} className="object-cover" />
                                  <AvatarFallback className="bg-muted text-muted-foreground font-black text-xl">
                                    {userInitial}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black text-foreground uppercase tracking-wider">Pratinjau Profil</p>
                                <p className="text-[9px] text-muted-foreground font-bold">Inilah tampilan Anda di platform.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6 space-y-10">
                            {/* Avatar Grid */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <h4 className="font-black text-sm uppercase tracking-tight">Pilih Karakter</h4>
                              </div>
                              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-3">
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
                                          sizes="(max-width: 768px) 25vw, 10vw"
                                        />
                                        {isSelected && (
                                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in zoom-in duration-300">
                                            <Check className="h-4 w-4 text-primary-foreground drop-shadow-md" />
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="col-span-full py-8 text-center border border-dashed rounded-3xl bg-muted/10">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-2" />
                                    <p className="text-[10px] font-bold text-muted-foreground">Memuat karakter...</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Separator />

                            {/* Background Options Grid */}
                            <div className="space-y-4 pb-4">
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-primary" />
                                <h4 className="font-black text-sm uppercase tracking-tight">Pilih Latar Belakang</h4>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                                {BACKGROUND_OPTIONS.map((bg) => {
                                  const isSelected = profileBg === bg.class;
                                  return (
                                    <button
                                      key={bg.id}
                                      type="button"
                                      onClick={() => setProfileBg(bg.class)}
                                      className={cn(
                                        "flex flex-col items-center gap-2 p-2 rounded-xl border transition-all hover:bg-muted/30 group",
                                        isSelected ? "border-primary bg-primary/5" : "border-border/40"
                                      )}
                                    >
                                      <div className={cn(
                                        "h-8 w-8 rounded-full border border-background shadow-sm",
                                        bg.class
                                      )} />
                                      <span className={cn(
                                        "text-[9px] font-black uppercase tracking-tighter text-center",
                                        isSelected ? "text-primary" : "text-muted-foreground"
                                      )}>{bg.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="sticky bottom-0 z-30 bg-background border-t border-border p-4">
                            <Button 
                              onClick={() => setIsAvatarModalOpen(false)}
                              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs"
                            >
                              Terapkan Perubahan
                            </Button>
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
