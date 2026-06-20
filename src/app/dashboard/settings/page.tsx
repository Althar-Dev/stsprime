
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useUser, useFirestore, useAuth } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Wand2, 
  Loader2,
  Save,
  KeyRound,
  Check,
  Camera,
  X,
  Sparkles,
  Trophy,
  Medal,
  Mail,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS_CONFIG = [
  { id: "profile", label: "Profil", icon: User },
  { id: "customize", label: "Customize", icon: Wand2 },
  { id: "security", label: "Keamanan", icon: KeyRound },
];

const BACKGROUND_OPTIONS = [
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

const STATIC_BOY_AVATARS = ["boy.png", "boy-1.png", "boy-2.png", "boy-3.png", "boy-4.png"];
const STATIC_GIRL_AVATARS = ["girl.png", "girl-1.png", "girl-2.png", "girl-3.png"];

const BADGE_OPTIONS = [
  { id: "verified", name: "Verified", icon: ShieldCheck, color: "text-primary", desc: "Badge verifikasi standar member." },
  { id: "pro", name: "Pro Gamer", icon: Trophy, color: "text-accent", desc: "Badge khusus pemain profesional." },
  { id: "elite", name: "Elite", icon: Medal, color: "text-purple-500", desc: "Badge eksklusif member elit." },
];

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [profileBg, setProfileBg] = useState("bg-muted/30");
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const [firestorePhotoURL, setFirestorePhotoURL] = useState("");
  const [nameGlow, setNameGlow] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState("verified");
  
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const availableAvatars = useMemo(() => {
    const list = [];
    if (isDev) list.push("dev.png");
    list.push(...STATIC_BOY_AVATARS);
    list.push(...STATIC_GIRL_AVATARS);
    return list;
  }, [isDev]);

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
          setFirestorePhotoURL(data.photoURL || "");
          setProfileBg(data.profileBg || "bg-muted/30");
          setIsDev(!!data.dev);
          setNameGlow(!!data.nameGlow);
          setSelectedBadgeId(data.badgeId || "verified");
        }
      } catch (error) {}
    }
    fetchProfile();
  }, [user, db]);

  useEffect(() => {
    const timer = setTimeout(resetIndicatorToActive, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const displayPhotoURL = useMemo(() => {
    if (photoURL) return photoURL;
    if (firestorePhotoURL) return firestorePhotoURL;
    if (isDev) return "/img/ava/dev.png";
    return user?.photoURL || "";
  }, [photoURL, firestorePhotoURL, isDev, user?.photoURL]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !db || !auth) return;

    setIsSaving(true);
    try {
      const finalPhotoURL = photoURL || firestorePhotoURL || (isDev ? "/img/ava/dev.png" : (user.photoURL || ""));
      await updateProfile(user, { displayName, photoURL: finalPhotoURL });

      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        displayName,
        photoURL: finalPhotoURL,
        profileBg,
        nameGlow,
        badgeId: selectedBadgeId,
        email: user.email,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, userData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: userData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

      setFirestorePhotoURL(finalPhotoURL);
      setPhotoURL("");
      toast({ title: "Berhasil", description: "Perubahan Anda telah disimpan." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal", description: error.message || "Terjadi kesalahan." });
    } finally {
      setIsSaving(false);
    }
  };

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-2xl md:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          </div>
          Pengaturan
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-bold opacity-75">
          Kelola informasi identitas dan kustomisasi tampilan profil Anda.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8 md:space-y-10">
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
                <tab.icon className={cn("h-6 w-6 md:h-5 md:w-5 transition-transform group-hover:scale-110", activeTab === tab.id && "text-primary")} />
                <span className="hidden md:inline whitespace-nowrap">{tab.label}</span>
              </TabsTrigger>
            ))}
            <div 
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out z-20 pointer-events-none"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
          </TabsList>
        </div>

        <div className="w-full">
          {/* PROFILE TAB */}
          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0">
            <Card className="border-none bg-transparent shadow-none">
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="p-0 space-y-10">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
                    <div className="relative group shrink-0">
                      <div className={cn("h-36 w-36 md:h-48 md:w-48 rounded-full flex items-center justify-center p-1.5 transition-all duration-500", profileBg)}>
                        <Avatar className="h-full w-full border-4 border-background shadow-2xl">
                          <AvatarImage src={displayPhotoURL} className="object-cover" />
                          <AvatarFallback className="bg-muted text-muted-foreground font-black text-5xl">{userInitial}</AvatarFallback>
                        </Avatar>
                      </div>
                      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                        <DialogTrigger asChild>
                          <button type="button" className="absolute inset-0 z-10">
                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                              <Camera className="h-8 w-8 text-white mb-2" />
                              <span className="text-[10px] text-white font-black tracking-widest uppercase">Ganti Avatar</span>
                            </div>
                            <div className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-xl border-4 border-background transform transition-all group-hover:scale-110">
                              <Camera className="h-5 w-5" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl border-border bg-background p-0 modal-scrollbar">
                           <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border p-5 flex items-center justify-between shrink-0">
                              <DialogTitle className="font-black text-lg">Sesuaikan Avatar</DialogTitle>
                              <DialogClose className="p-2 rounded-full hover:bg-muted/50 transition-colors"><X className="h-5 w-5" /></DialogClose>
                           </div>
                           <div className="p-6 space-y-8">
                             <div className="flex justify-center py-4">
                                <div className={cn("h-24 w-24 md:h-32 md:w-32 rounded-full flex items-center justify-center p-1 transition-all duration-500", profileBg)}>
                                  <Avatar className="h-full w-full border border-background shadow-lg">
                                    <AvatarImage src={displayPhotoURL} className="object-cover" />
                                    <AvatarFallback className="bg-muted text-muted-foreground font-black text-2xl">{userInitial}</AvatarFallback>
                                  </Avatar>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Pilih Karakter</Label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-3">
                                  {availableAvatars.map((file) => {
                                    const avatarPath = `/img/ava/${file}`;
                                    const isSelected = avatarPath === displayPhotoURL;
                                    return (
                                      <button key={file} type="button" onClick={() => setPhotoURL(avatarPath)} className={cn("relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110", isSelected ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border/30 bg-muted/20")}>
                                        <Image src={avatarPath} alt={file} fill className="object-cover" sizes="80px" />
                                        {isSelected && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in zoom-in"><Check className="h-4 w-4 text-primary-foreground" /></div>}
                                      </button>
                                    );
                                  })}
                                </div>
                             </div>
                             <Separator />
                             <div className="space-y-4 pb-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Latar Belakang</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                                  {BACKGROUND_OPTIONS.map((bg) => (
                                    <button key={bg.id} type="button" onClick={() => setProfileBg(bg.class)} className={cn("flex flex-col items-center gap-2 p-2 rounded-xl border transition-all", profileBg === bg.class ? "border-primary bg-primary/5" : "border-border/40")}>
                                      <div className={cn("h-8 w-8 rounded-full border border-background shadow-sm", bg.class)} />
                                      <span className="text-[9px] font-black uppercase tracking-tighter text-center truncate w-full">{bg.name}</span>
                                    </button>
                                  ))}
                                </div>
                             </div>
                           </div>
                           <div className="sticky bottom-0 z-30 bg-background border-t border-border p-4">
                              <Button onClick={() => setIsAvatarModalOpen(false)} className="w-full h-11 rounded-xl font-black uppercase tracking-widest text-xs">Simpan Pilihan</Button>
                           </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex-1 w-full space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                             <Mail className="h-3 w-3" /> Email
                          </Label>
                          <Input value={user?.email || ""} disabled className="bg-muted/30 font-bold h-12 rounded-xl opacity-70" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                             <Type className="h-3 w-3" /> Nama Tampilan
                          </Label>
                          <Input placeholder="Nama Anda" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="font-bold h-12 rounded-xl" />
                        </div>
                      </div>
                      <div className="pt-4 flex justify-center lg:justify-start">
                        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto h-12 px-12 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20">
                          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                          Simpan Profil
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Card>
          </TabsContent>

          {/* CUSTOMIZE TAB */}
          <TabsContent value="customize" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0">
             <div className="max-w-4xl space-y-12">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-black text-lg tracking-tight">Kustomisasi Penampilan</h3>
                   </div>
                   
                   <div className="space-y-1">
                      <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors group">
                         <div className="space-y-1">
                            <p className="font-black text-sm">Efek Kilau Nama (Name Glow)</p>
                            <p className="text-xs text-muted-foreground font-bold">Memberikan efek neon/cahaya pada nama Anda di papan peringkat.</p>
                         </div>
                         <Switch checked={nameGlow} onCheckedChange={setNameGlow} />
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <Medal className="h-5 w-5 text-primary" />
                      <h3 className="font-black text-lg tracking-tight">Koleksi Badge Akun</h3>
                   </div>
                   
                   <div className="space-y-3">
                      {BADGE_OPTIONS.map((badge) => {
                        const isSelected = selectedBadgeId === badge.id;
                        return (
                          <button
                            key={badge.id}
                            onClick={() => setSelectedBadgeId(badge.id)}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                              isSelected 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-border bg-card/10 hover:border-primary/30"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn("h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm border border-border/50", badge.color)}>
                                 <badge.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-black text-sm">{badge.name}</p>
                                <p className="text-[10px] text-muted-foreground font-bold leading-none mt-1">{badge.desc}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                            )}>
                              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                          </button>
                        );
                      })}
                   </div>
                </div>

                <div className="pt-6">
                   <Button onClick={() => handleUpdateProfile(null as any)} disabled={isSaving} className="w-full sm:w-auto h-12 px-12 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20">
                     {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                     Terapkan Kustomisasi
                   </Button>
                </div>
             </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0">
             <div className="max-w-4xl space-y-8">
                <div className="flex items-center gap-3 mb-6">
                   <ShieldCheck className="h-5 w-5 text-primary" />
                   <h3 className="font-black text-lg tracking-tight">Privasi & Keamanan</h3>
                </div>
                <div className="p-8 rounded-3xl border border-border/50 bg-card/30 flex flex-col md:flex-row items-center justify-between gap-8 group">
                   <div className="space-y-1 text-center md:text-left">
                      <p className="text-lg font-black">Ganti Kata Sandi</p>
                      <p className="text-sm text-muted-foreground font-bold">Gunakan tautan aman untuk memperbarui akses masuk Anda.</p>
                   </div>
                   <Button variant="outline" className="w-full md:w-auto h-12 px-10 rounded-xl font-black text-xs uppercase tracking-widest border-border group-hover:border-primary/50 transition-colors">
                      Kirim Link Reset
                   </Button>
                </div>
             </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
