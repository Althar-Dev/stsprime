
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
  Medal,
  Mail,
  Type,
  CircleHelp,
  Type as FontIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS_CONFIG = [
  { id: "profile", label: "Profil", icon: User },
  { id: "customize", label: "Customize", icon: Wand2 },
  { id: "security", label: "Keamanan", icon: KeyRound },
];

const BACKGROUND_OPTIONS = [
  { id: "default", name: "Netral", class: "bg-muted/40 border border-border/50" },
  { id: "primary", name: "STS Gold", class: "bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-amber-500/40 ring-1 ring-amber-400/50" },
  { id: "accent", name: "STS Blue", class: "bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 shadow-cyan-500/40 ring-1 ring-cyan-400/50" },
  { id: "dark", name: "Obsidian", class: "bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-800 border border-slate-700/80" },
  { id: "rose", name: "Rose", class: "bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 shadow-rose-500/40" },
  { id: "emerald", name: "Emerald", class: "bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 shadow-emerald-500/40" },
  { id: "grad-hyper", name: "Hyper", class: "bg-gradient-to-tr from-cyan-400 via-emerald-400 to-yellow-300 shadow-teal-500/40" },
  { id: "grad-cosmic", name: "Cosmic", class: "bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 shadow-purple-500/40" },
  { id: "inferno", name: "Inferno", class: "bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 shadow-red-500/40" },
  { id: "amethyst", name: "Amethyst", class: "bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-violet-400 shadow-purple-500/40" },
  { id: "neon-lime", name: "Neon Lime", class: "bg-gradient-to-tr from-lime-500 via-emerald-400 to-teal-300 shadow-lime-500/40" },
  { id: "sunset", name: "Sunset", class: "bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 shadow-pink-500/40" },
  { id: "aqua", name: "Aqua Mist", class: "bg-gradient-to-tr from-teal-500 via-cyan-400 to-emerald-300 shadow-teal-500/40" },
  { id: "ocean", name: "Deep Ocean", class: "bg-gradient-to-tr from-indigo-900 via-blue-800 to-sky-600 shadow-indigo-500/40" },
  { id: "solar", name: "Solar Flare", class: "bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-300 shadow-amber-500/40" },
  { id: "cyber-void", name: "Cyber Void", class: "bg-gradient-to-tr from-zinc-900 via-purple-950 to-pink-900 border border-purple-500/30" },
  { id: "supernova", name: "Supernova", class: "bg-gradient-to-tr from-yellow-400 via-amber-500 to-rose-600 shadow-yellow-500/40" },
  { id: "aurora", name: "Aurora", class: "bg-gradient-to-tr from-emerald-400 via-teal-400 to-indigo-500 shadow-emerald-400/40" },
  { id: "phantom", name: "Phantom", class: "bg-gradient-to-tr from-zinc-800 via-slate-700 to-neutral-500 shadow-zinc-500/40" },
  { id: "toxic", name: "Toxic", class: "bg-gradient-to-tr from-green-500 via-lime-400 to-emerald-600 shadow-green-500/40" },
  { id: "electric-violet", name: "Electric Violet", class: "bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-400 shadow-purple-500/40" },
  { id: "midnight-gold", name: "Midnight Gold", class: "bg-gradient-to-tr from-amber-700 via-yellow-600 to-slate-900 shadow-amber-600/40" },
  { id: "prismatic", name: "Prismatic", class: "bg-gradient-to-tr from-red-500 via-yellow-400 via-emerald-400 to-blue-500 shadow-pink-500/40" },
  { id: "frostbite", name: "Frostbite", class: "bg-gradient-to-tr from-sky-400 via-cyan-300 to-blue-600 shadow-sky-400/40" },
  { id: "volcanic", name: "Volcanic", class: "bg-gradient-to-tr from-orange-700 via-red-600 to-stone-900 shadow-red-600/40" },
  { id: "sakura", name: "Sakura", class: "bg-gradient-to-tr from-pink-400 via-rose-300 to-fuchsia-400 shadow-pink-400/40" },
  { id: "eclipse", name: "Eclipse", class: "bg-gradient-to-tr from-slate-900 via-purple-950 to-amber-500/50 shadow-purple-900/40" },
  { id: "vortex", name: "Vortex", class: "bg-gradient-to-tr from-indigo-600 via-sky-400 to-emerald-400 shadow-indigo-500/40" },
];

const STATIC_AVATARS = [
  "dev.png",
  "boy.png", "boy-1.png", "boy-2.png", "boy-3.png", "boy-4.png",
  "girl.png", "girl-1.png", "girl-2.png", "girl-3.png"
];

const FONT_OPTIONS = [
  { id: "f0", name: "Plus Jakarta Sans" },
  { id: "f1", name: "Inter" },
  { id: "f2", name: "Space Grotesk" },
  { id: "f3", name: "Roboto" },
  { id: "f4", name: "Helvetica" },
  { id: "f5", name: "Arial" },
  { id: "f6", name: "Verdana" },
  { id: "f7", name: "Tahoma" },
  { id: "f8", name: "Trebuchet MS" },
  { id: "f9", name: "Lucida Sans" },
  { id: "f10", name: "Gill Sans" },
  { id: "f11", name: "Times New Roman" },
  { id: "f12", name: "Georgia" },
  { id: "f13", name: "Palatino" },
  { id: "f14", name: "Garamond" },
  { id: "f15", name: "Bookman" },
  { id: "f16", name: "Courier New" },
  { id: "f17", name: "Monaco" },
  { id: "f18", name: "Lucida Console" },
  { id: "f19", name: "Impact" },
  { id: "f20", name: "Comic Sans MS" },
  { id: "f21", name: "Montserrat" },
  { id: "f22", name: "Lato" },
  { id: "f23", name: "Open Sans" },
  { id: "f24", name: "Oswald" },
  { id: "f25", name: "Raleway" },
  { id: "f26", name: "Playfair Display" },
  { id: "f27", name: "Merriweather" },
  { id: "f28", name: "Ubuntu" },
  { id: "f29", name: "Lora" },
  { id: "f30", name: "Nunito" },
  { id: "f31", name: "PT Sans" },
  { id: "f32", name: "PT Serif" },
  { id: "f33", name: "Roboto Slab" },
  { id: "f34", name: "Josefin Sans" },
  { id: "f35", name: "Arvo" },
  { id: "f36", name: "Cabin" },
  { id: "f37", name: "Dosis" },
  { id: "f38", name: "Kanit" },
  { id: "f39", name: "Oxygen" },
  { id: "f40", name: "Bitter" },
  { id: "f41", name: "Fredoka" },
  { id: "f42", name: "Righteous" },
  { id: "f43", name: "Permanent Marker" },
  { id: "f44", name: "Metal Mania" },
  { id: "f45", name: "Pirata Gothic" },
  { id: "f46", name: "Cinzel" },
  { id: "f47", name: "Sacramento" },
  { id: "f48", name: "Bungee" },
  { id: "f49", name: "Creepster" },
  { id: "f50", name: "Monoton" },
  { id: "f51", name: "Faster One" },
  { id: "f52", name: "Bangers" },
  { id: "f53", name: "Luckiest Guy" },
  { id: "f54", name: "Press Start 2P" },
  { id: "f55", name: "Silkscreen" },
  { id: "f56", name: "Kalam" },
  { id: "f57", name: "Handlee" },
  { id: "f58", name: "Courgette" },
  { id: "f59", name: "Marck Script" },
  { id: "f60", name: "Cookie" },
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
  const [isVip, setIsVip] = useState(false);
  const [firestorePhotoURL, setFirestorePhotoURL] = useState("");

  const [selectedFontId, setSelectedFontId] = useState("f1");
  const [selectedColorId, setSelectedColorId] = useState("g1");
  const [selectedBadgeId, setSelectedBadgeId] = useState("");

  const [showAllFonts, setShowAllFonts] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);

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
          setIsVip(!!data.vip);
          setSelectedFontId(data.fontId || "f1");
          setSelectedColorId(data.colorId || "g1");
          setSelectedBadgeId(data.badgeId || "");
        }
      } catch (error) { }
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

  const activeFont = useMemo(() => FONT_OPTIONS.find(f => f.id === selectedFontId), [selectedFontId]);
  const activeColorClass = useMemo(() => GRADIENT_COLORS.find(c => c.id === selectedColorId)?.class || "bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent", [selectedColorId]);

  const visibleFonts = useMemo(() => {
    if (showAllFonts) return FONT_OPTIONS;
    const current = FONT_OPTIONS.find(f => f.id === selectedFontId);
    const others = FONT_OPTIONS.filter(f => f.id !== selectedFontId).slice(0, 3);
    return current ? [current, ...others] : FONT_OPTIONS.slice(0, 4);
  }, [showAllFonts, selectedFontId]);

  const visibleColors = useMemo(() => {
    if (showAllColors) return GRADIENT_COLORS;
    const current = GRADIENT_COLORS.find(c => c.id === selectedColorId);
    const others = GRADIENT_COLORS.filter(c => c.id !== selectedColorId).slice(0, 3);
    return current ? [current, ...others] : GRADIENT_COLORS.slice(0, 4);
  }, [showAllColors, selectedColorId]);

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
        fontFamily: activeFont?.name || "Inter",
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

  useEffect(() => {
    const timer = setTimeout(() => {
      resetIndicatorToActive();
    }, 50);
    window.addEventListener("resize", resetIndicatorToActive);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", resetIndicatorToActive);
    };
  }, [activeTab]);

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-5 sm:space-y-6 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-5 sm:space-y-6">
        <div className="border-b border-border/60 relative overflow-x-auto no-scrollbar scroll-smooth w-full">
          <TabsList
            ref={tabsListRef}
            onMouseLeave={resetIndicatorToActive}
            className="bg-transparent h-auto p-0 flex gap-1.5 sm:gap-6 md:gap-8 justify-start relative overflow-visible w-full min-w-max"
          >
            {TABS_CONFIG.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onClick={() => {
                  setTimeout(resetIndicatorToActive, 20);
                }}
                onMouseEnter={(e) => moveIndicatorToElement(e.currentTarget)}
                className="rounded-none border-b-2 border-transparent bg-transparent px-3 sm:px-4 py-2.5 sm:py-3.5 font-bold text-xs sm:text-sm md:text-base text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:font-black data-[state=active]:bg-transparent shadow-none transition-all gap-1.5 sm:gap-2 relative z-10 group"
              >
                <tab.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", activeTab === tab.id && "text-primary")} />
                <span className="whitespace-nowrap">{tab.label}</span>
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
            <Card className="bento-card p-5 sm:p-8 md:p-10 border-border/50 bg-card/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl">
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-10">
                    {/* AVATAR LEFT SIDE */}
                    <div className="relative group shrink-0">
                      <div className={cn("h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full flex items-center justify-center p-1 transition-all duration-500", profileBg)}>
                        <Avatar className="h-full w-full border-2 sm:border-4 border-background shadow-xl">
                          <AvatarImage src={displayPhotoURL} className="object-cover" />
                          <AvatarFallback className="bg-muted text-muted-foreground font-black text-3xl md:text-4xl">{userInitial}</AvatarFallback>
                        </Avatar>
                      </div>
                      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                        <DialogTrigger asChild>
                          <button type="button" className="absolute inset-0 z-10">
                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                              <Camera className="h-5 w-5 md:h-7 md:w-7 text-white mb-1" />
                              <span className="text-[8px] md:text-[9px] text-white font-black tracking-widest uppercase">Ganti Avatar</span>
                            </div>
                            <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 h-7 w-7 md:h-9 md:w-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg border-2 md:border-3 border-background transform transition-all group-hover:scale-110">
                              <Camera className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border-border bg-background p-0 modal-scrollbar">
                          <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border p-3.5 sm:p-5 flex items-center justify-between shrink-0">
                            <DialogTitle className="font-black text-sm sm:text-base md:text-lg">Sesuaikan Avatar</DialogTitle>
                            <DialogClose className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"><X className="h-4 w-4" /></DialogClose>
                          </div>
                          <div className="p-3.5 sm:p-6 space-y-5 sm:space-y-7">
                            <div className="flex justify-center py-1 sm:py-3">
                              <div className={cn("h-20 w-20 sm:h-28 sm:w-28 rounded-full flex items-center justify-center p-1 transition-all duration-500", profileBg)}>
                                <Avatar className="h-full w-full border border-background shadow-lg">
                                  <AvatarImage src={displayPhotoURL} className="object-cover" />
                                  <AvatarFallback className="bg-muted text-muted-foreground font-black text-xl sm:text-2xl">{userInitial}</AvatarFallback>
                                </Avatar>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Pilih Karakter</Label>
                              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 md:gap-2.5">
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
                            <div className="space-y-3 pb-3">
                              <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Latar Belakang Profil</Label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
                                {BACKGROUND_OPTIONS.map((bg) => (
                                  <button key={bg.id} type="button" onClick={() => setProfileBg(bg.class)} className={cn("flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all", profileBg === bg.class ? "border-primary bg-primary/10 shadow-inner ring-1 ring-primary/30" : "border-border/40 hover:border-primary/30")}>
                                    <div className={cn("h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-background shadow-xs shrink-0", bg.class)} />
                                    <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-tighter text-center truncate w-full">{bg.name}</span>
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
                    <div className="flex-1 w-full space-y-5 sm:space-y-6">
                      <div className="space-y-3 md:space-y-4">
                        <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" /> Alamat Email
                        </Label>
                        <Input value={user?.email || ""} disabled className="bg-muted/30 font-bold h-11 md:h-12 rounded-xl opacity-70 border-border/50 text-sm" />
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                          <Type className="h-3.5 w-3.5" /> Nama Tampilan
                        </Label>
                        <Input placeholder="Nama Anda" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="font-bold h-11 md:h-12 rounded-xl border-border/50 focus:border-primary text-sm" />
                      </div>
                      <div className="pt-2">
                        <Button type="submit" disabled={isSaving} className="w-full md:w-auto h-12 px-12 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
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
            <div className="bento-card p-5 sm:p-8 md:p-10 border-border/50 bg-card/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl space-y-6 sm:space-y-8">
              {/* NAME CUSTOM SECTION */}
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-black text-base sm:text-lg md:text-xl tracking-tight">Name Custom</h3>
                </div>

                <div className="space-y-6 sm:space-y-8 pl-2 sm:pl-4 border-l-2 border-primary/20">
                  {/* Name Preview */}
                  <div className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-muted/10 border border-border/50 flex flex-col items-center justify-center gap-2 sm:gap-3 text-center">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">Pratinjau Nama</span>
                    <h4
                      className={cn("text-xl sm:text-3xl md:text-4xl font-black transition-all duration-300 break-all", activeColorClass)}
                      style={{ fontFamily: activeFont?.name || "Inter" }}
                    >
                      {displayName || "Gamer Pro"}
                    </h4>
                  </div>

                  {/* Font Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        <FontIcon className="h-3.5 w-3.5" /> Pilih Font
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllFonts(!showAllFonts)}
                        className="text-[9px] sm:text-[10px] font-black text-primary hover:bg-primary/10 gap-1 h-7 px-2"
                      >
                        {showAllFonts ? <><ChevronUp className="h-3 w-3" /> Sembunyikan</> : <><ChevronDown className="h-3 w-3" /> Lainnya</>}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {visibleFonts.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setSelectedFontId(font.id)}
                          className={cn(
                            "p-2 rounded-xl border text-xs font-bold transition-all h-10 flex items-center justify-center",
                            selectedFontId === font.id
                              ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20 text-primary"
                              : "border-border/50 hover:border-primary/20"
                          )}
                        >
                          <span style={{ fontFamily: font.name }} className="truncate px-1">{font.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gradient Color Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" /> Pilih Warna (Gradient)
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllColors(!showAllColors)}
                        className="text-[9px] sm:text-[10px] font-black text-primary hover:bg-primary/10 gap-1 h-7 px-2"
                      >
                        {showAllColors ? <><ChevronUp className="h-3 w-3" /> Sembunyikan</> : <><ChevronDown className="h-3 w-3" /> Lainnya</>}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {visibleColors.map((grad) => (
                        <button
                          key={grad.id}
                          onClick={() => setSelectedColorId(grad.id)}
                          className={cn(
                            "p-2 rounded-xl border text-[10px] sm:text-xs font-black transition-all h-10 flex items-center justify-center overflow-hidden",
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

              <Separator className="opacity-40" />

              {/* BADGE SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Medal className="h-5 w-5 text-primary" />
                  <h3 className="font-black text-base sm:text-lg md:text-xl tracking-tight">Koleksi Badge Akun</h3>
                </div>

                <div className="flex flex-wrap gap-4 pl-2 sm:pl-4">
                  {/* VIP Badge - Only visible if isVip is true */}
                  {isVip && (
                    <div className="relative group">
                      <div className={cn(
                        "h-16 w-16 sm:h-18 sm:w-18 rounded-2xl border-2 border-primary bg-primary/10 flex items-center justify-center transition-all relative scale-105 shadow-lg shadow-primary/20"
                      )}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Image src="/img/badge/vip.png" alt="VIP" width={44} height={44} className="object-contain cursor-pointer" />
                          </PopoverTrigger>
                          <PopoverContent side="bottom" className="rounded-xl border-primary/20 bg-background px-4 py-3 w-40 shadow-2xl animate-in zoom-in-95 duration-200">
                            <p className="text-[10px] font-black text-center">VIP Member</p>
                          </PopoverContent>
                        </Popover>
                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-md pointer-events-none">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  )}

                  {!isVip && (
                    <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 w-full text-center">
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-bold">Belum ada badge yang tersedia untuk koleksi Anda.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={() => handleUpdateProfile(null as any)} disabled={isSaving} className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 text-xs">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Terapkan Kustomisasi
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0">
            <div className="bento-card p-5 sm:p-8 md:p-10 border-border/50 bg-card/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-black text-base sm:text-lg md:text-xl tracking-tight">Privasi & Keamanan</h3>
              </div>
              <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-border/50 bg-muted/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-primary/20 transition-colors">
                <div className="space-y-0.5">
                  <p className="text-base sm:text-lg font-black text-foreground">Ganti Kata Sandi</p>
                  <p className="text-xs text-muted-foreground font-bold">Gunakan tautan aman untuk memperbarui akses masuk Anda.</p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto rounded-xl font-black text-xs h-10 px-5 border-border hover:bg-primary/10 hover:text-primary transition-colors">
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
