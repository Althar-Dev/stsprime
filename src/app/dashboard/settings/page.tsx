
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Type,
  CircleHelp,
  Type as FontIcon,
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
  { id: "rose", name: "Rose", class: "bg-rose-500" },
  { id: "emerald", name: "Emerald", class: "bg-emerald-500" },
  { id: "grad-hyper", name: "Hyper", class: "bg-gradient-to-br from-primary to-accent" },
  { id: "grad-cosmic", name: "Cosmic", class: "bg-gradient-to-br from-purple-600 to-blue-500" },
];

const STATIC_AVATARS = [
  "dev.png",
  "boy.png", "boy-1.png", "boy-2.png", "boy-3.png", "boy-4.png",
  "girl.png", "girl-1.png", "girl-2.png", "girl-3.png"
];

const BADGE_OPTIONS = [
  { id: "verified", name: "Verified", icon: ShieldCheck, color: "text-primary", desc: "Badge verifikasi standar member." },
  { id: "pro", name: "Pro Gamer", icon: Trophy, color: "text-accent", desc: "Badge khusus pemain profesional." },
  { id: "elite", name: "Elite", icon: Medal, color: "text-purple-500", desc: "Badge eksklusif member elit." },
];

const FONT_OPTIONS = [
  { id: "f1", name: "Inter", class: "font-sans" },
  { id: "f2", name: "Space Grotesk", class: "font-headline" },
  { id: "f3", name: "Roboto", class: "font-sans" },
  { id: "f4", name: "Helvetica", class: "font-sans" },
  { id: "f5", name: "Arial", class: "font-sans" },
  { id: "f6", name: "Verdana", class: "font-sans" },
  { id: "f7", name: "Tahoma", class: "font-sans" },
  { id: "f8", name: "Trebuchet MS", class: "font-sans" },
  { id: "f9", name: "Lucida Sans", class: "font-sans" },
  { id: "f10", name: "Gill Sans", class: "font-sans" },
  { id: "f11", name: "Times New Roman", class: "font-serif" },
  { id: "f12", name: "Georgia", class: "font-serif" },
  { id: "f13", name: "Palatino", class: "font-serif" },
  { id: "f14", name: "Garamond", class: "font-serif" },
  { id: "f15", name: "Bookman", class: "font-serif" },
  { id: "f16", name: "Courier New", class: "font-mono" },
  { id: "f17", name: "Monaco", class: "font-mono" },
  { id: "f18", name: "Lucida Console", class: "font-mono" },
  { id: "f19", name: "Impact", class: "font-sans uppercase" },
  { id: "f20", name: "Comic Sans MS", class: "font-sans" },
  { id: "f21", name: "Montserrat", class: "font-sans" },
  { id: "f22", name: "Lato", class: "font-sans" },
  { id: "f23", name: "Open Sans", class: "font-sans" },
  { id: "f24", name: "Oswald", class: "font-sans uppercase" },
  { id: "f25", name: "Raleway", class: "font-sans" },
  { id: "f26", name: "Playfair Display", class: "font-serif italic" },
  { id: "f27", name: "Merriweather", class: "font-serif" },
  { id: "f28", name: "Ubuntu", class: "font-sans" },
  { id: "f29", name: "Lora", class: "font-serif" },
  { id: "f30", name: "Nunito", class: "font-sans" },
  { id: "f31", name: "PT Sans", class: "font-sans" },
  { id: "f32", name: "PT Serif", class: "font-serif" },
  { id: "f33", name: "Roboto Slab", class: "font-serif" },
  { id: "f34", name: "Josefin Sans", class: "font-sans" },
  { id: "f35", name: "Arvo", class: "font-serif" },
  { id: "f36", name: "Cabin", class: "font-sans" },
  { id: "f37", name: "Dosis", class: "font-sans" },
  { id: "f38", name: "Kanit", class: "font-sans" },
  { id: "f39", name: "Oxygen", class: "font-sans" },
  { id: "f40", name: "Bitter", class: "font-serif" },
];

const GRADIENT_COLORS = [
  { id: "g1", name: "Hyper Gold", class: "bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent" },
  { id: "g2", name: "Oceanic", class: "bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent" },
  { id: "g3", name: "Sunset", class: "bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent" },
  { id: "g4", name: "Forest", class: "bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent" },
  { id: "g5", name: "Cosmic", class: "bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent" },
  { id: "g6", name: "Rose Bloom", class: "bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent" },
  { id: "g7", name: "Twilight", class: "bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent" },
  { id: "g8", name: "Gold Rush", class: "bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent" },
  { id: "g9", name: "Neon Lime", class: "bg-gradient-to-r from-lime-400 to-cyan-500 bg-clip-text text-transparent" },
  { id: "g10", name: "Lava", class: "bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent" },
  { id: "g11", name: "Royal Blue", class: "bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent" },
  { id: "g12", name: "Cotton Candy", class: "bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent" },
  { id: "g13", name: "Minty", class: "bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent" },
  { id: "g14", name: "Deep Sea", class: "bg-gradient-to-r from-slate-600 to-blue-800 bg-clip-text text-transparent" },
  { id: "g15", name: "Morning Sky", class: "bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent" },
  { id: "g16", name: "Aurora", class: "bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent" },
  { id: "g17", name: "Fire", class: "bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent" },
  { id: "g18", name: "Gem", class: "bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent" },
  { id: "g19", name: "Space", class: "bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent" },
  { id: "g20", name: "Bubblegum", class: "bg-gradient-to-r from-pink-300 to-indigo-400 bg-clip-text text-transparent" },
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
  
  const [selectedFontId, setSelectedFontId] = useState("f1");
  const [selectedColorId, setSelectedColorId] = useState("g1");
  const [selectedBadgeId, setSelectedBadgeId] = useState("verified");
  
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
          setFirestorePhotoURL(data.photoURL || "");
          setProfileBg(data.profileBg || "bg-muted/30");
          setIsDev(!!data.dev);
          setSelectedFontId(data.fontId || "f1");
          setSelectedColorId(data.colorId || "g1");
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
    return isDev ? "/img/avas/dev.png" : (user?.photoURL || "");
  }, [photoURL, firestorePhotoURL, isDev, user?.photoURL]);

  const activeFontClass = FONT_OPTIONS.find(f => f.id === selectedFontId)?.class || "font-sans";
  const activeColorClass = GRADIENT_COLORS.find(c => c.id === selectedColorId)?.class || "bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !db || !auth) return;

    setIsSaving(true);
    try {
      const finalPhotoURL = photoURL || firestorePhotoURL || (isDev ? "/img/avas/dev.png" : (user.photoURL || ""));
      await updateProfile(user, { displayName, photoURL: finalPhotoURL });

      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        displayName,
        photoURL: finalPhotoURL,
        profileBg,
        fontId: selectedFontId,
        colorId: selectedColorId,
        fontFamily: activeFontClass,
        nameColor: activeColorClass,
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
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
                    {/* AVATAR LEFT SIDE */}
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
                                  {STATIC_AVATARS.map((file) => {
                                    if (file === "dev.png" && !isDev) return null;
                                    const avatarPath = `/img/avas/${file}`;
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
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Latar Belakang Profil</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  {BACKGROUND_OPTIONS.map((bg) => (
                                    <button key={bg.id} type="button" onClick={() => setProfileBg(bg.class)} className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border transition-all", profileBg === bg.class ? "border-primary bg-primary/5 shadow-inner" : "border-border/40 hover:border-primary/20")}>
                                      <div className={cn("h-10 w-10 rounded-full border border-background shadow-sm", bg.class)} />
                                      <span className="text-[9px] font-black uppercase tracking-tighter text-center truncate w-full">{bg.name}</span>
                                    </button>
                                  ))}
                                </div>
                             </div>
                           </div>
                           <div className="sticky bottom-0 z-30 bg-background border-t border-border p-4">
                              <Button onClick={() => setIsAvatarModalOpen(false)} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs">Simpan Pilihan</Button>
                           </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* INPUT FIELDS RIGHT SIDE ON DESKTOP */}
                    <div className="flex-1 w-full space-y-8">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                             <Mail className="h-3.5 w-3.5" /> Alamat Email
                          </Label>
                          <Input value={user?.email || ""} disabled className="bg-muted/30 font-bold h-12 rounded-xl opacity-70 border-border/50" />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                             <Type className="h-3.5 w-3.5" /> Nama Tampilan
                          </Label>
                          <Input placeholder="Nama Anda" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="font-bold h-12 rounded-xl border-border/50 focus:border-primary" />
                        </div>
                        <div className="pt-2">
                          <Button type="submit" disabled={isSaving} className="w-full md:w-auto h-12 px-12 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
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
             <div className="max-w-5xl space-y-12">
                {/* NAME CUSTOM SECTION */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <h3 className="font-black text-xl tracking-tight">Name Custom</h3>
                   </div>
                   
                   <div className="space-y-10 pl-4 border-l-2 border-primary/20">
                      {/* Name Preview */}
                      <div className="p-8 rounded-3xl bg-muted/10 border border-border/50 flex flex-col items-center justify-center gap-4 text-center">
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Pratinjau Nama</span>
                         <h4 className={cn(
                           "text-3xl md:text-5xl font-black transition-all duration-300",
                           activeFontClass,
                           activeColorClass
                         )}>
                            {displayName || "Gamer Pro"}
                         </h4>
                      </div>

                      {/* Font Selection */}
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            <FontIcon className="h-4 w-4" /> Pilih Font
                         </div>
                         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                            {FONT_OPTIONS.map((font) => (
                              <button
                                key={font.id}
                                onClick={() => setSelectedFontId(font.id)}
                                className={cn(
                                  "p-3 rounded-xl border text-sm font-bold transition-all h-12 flex items-center justify-center",
                                  selectedFontId === font.id 
                                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20" 
                                    : "border-border/50 hover:border-primary/20"
                                )}
                              >
                                <span className={font.class}>{font.name}</span>
                              </button>
                            ))}
                         </div>
                      </div>

                      {/* Gradient Color Selection */}
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            <Sparkles className="h-4 w-4" /> Pilih Warna (Gradient)
                         </div>
                         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                            {GRADIENT_COLORS.map((grad) => (
                              <button
                                key={grad.id}
                                onClick={() => setSelectedColorId(grad.id)}
                                className={cn(
                                  "p-3 rounded-xl border text-xs font-black transition-all h-12 flex items-center justify-center overflow-hidden",
                                  selectedColorId === grad.id 
                                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20" 
                                    : "border-border/50 hover:border-primary/20"
                                )}
                              >
                                <span className={cn("truncate px-1", grad.class)}>{grad.name}</span>
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <Separator />

                {/* BADGE SECTION */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Medal className="h-6 w-6 text-primary" />
                      <h3 className="font-black text-xl tracking-tight">Koleksi Badge Akun</h3>
                   </div>
                   
                   <div className="flex flex-wrap gap-5 pl-4">
                      {BADGE_OPTIONS.map((badge) => {
                        const isSelected = selectedBadgeId === badge.id;
                        return (
                          <div key={badge.id} className="relative group">
                            <button
                              type="button"
                              onClick={() => setSelectedBadgeId(badge.id)}
                              className={cn(
                                "h-20 w-20 rounded-2xl border-2 flex items-center justify-center transition-all relative",
                                isSelected 
                                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105" 
                                  : "border-border bg-card/10 hover:border-primary/30"
                              )}
                            >
                              <badge.icon className={cn("h-10 w-10", badge.color)} />
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-md">
                                  <Check className="h-4 w-4 text-primary-foreground" />
                                </div>
                              )}
                            </button>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                                  <CircleHelp className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent side="bottom" className="rounded-xl border-primary/20 bg-background px-4 py-3 w-56 shadow-2xl animate-in zoom-in-95 duration-200">
                                <div className="space-y-1">
                                  <p className="text-xs font-black flex items-center gap-2">
                                     <badge.icon className={cn("h-3.5 w-3.5", badge.color)} />
                                     {badge.name}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">{badge.desc}</p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        );
                      })}
                   </div>
                </div>

                <div className="pt-6">
                   <Button onClick={() => handleUpdateProfile(null as any)} disabled={isSaving} className="w-full sm:w-auto h-14 px-12 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                     {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                     Terapkan Kustomisasi
                   </Button>
                </div>
             </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0">
             <div className="max-w-4xl space-y-8">
                <div className="flex items-center gap-3 mb-6">
                   <ShieldCheck className="h-6 w-6 text-primary" />
                   <h3 className="font-black text-xl tracking-tight">Privasi & Keamanan</h3>
                </div>
                <div className="p-8 rounded-3xl border border-border/50 bg-card/10 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-primary/20 transition-colors">
                   <div className="space-y-1 text-center md:text-left">
                      <p className="text-xl font-black">Ganti Kata Sandi</p>
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
