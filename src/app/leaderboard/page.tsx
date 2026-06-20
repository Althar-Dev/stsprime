
"use client";

import { Footer } from "@/components/footer";
import { Crown, ShieldCheck, TrendingUp, Star, Medal, Trophy, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";

const PLACEHOLDERS = [
  { id: "p1", name: "Sultan_MLBB", points: 45280, avatar: "/img/avas/boy-1.png", isPlaceholder: true },
  { id: "p2", name: "RiotGamer99", points: 38150, avatar: "/img/avas/boy-2.png", isPlaceholder: true },
  { id: "p3", name: "GenshinSimp", points: 32900, avatar: "/img/avas/girl-1.png", isPlaceholder: true },
  { id: "p4", name: "ProPlayer_ID", points: 28400, avatar: "/img/avas/boy-3.png", isPlaceholder: true },
  { id: "p5", name: "Vand_Points", points: 25120, avatar: "/img/avas/boy-4.png", isPlaceholder: true },
  { id: "p6", name: "Alucard_Main", points: 22800, avatar: "/img/avas/boy.png", isPlaceholder: true },
  { id: "p7", name: "Primogem_Hunter", points: 19550, avatar: "/img/avas/girl-2.png", isPlaceholder: true },
  { id: "p8", name: "ValorantBoy", points: 15200, avatar: "/img/avas/boy-1.png", isPlaceholder: true },
  { id: "p9", name: "F2P_God", points: 12400, avatar: "/img/avas/girl-3.png", isPlaceholder: true },
  { id: "p10", name: "Newbie_Topup", points: 10100, avatar: "/img/avas/girl.png", isPlaceholder: true },
];

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) {
        if (!authLoading) setIsInitialLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      } catch (error) {
        // Fail silently
      } finally {
        setIsInitialLoading(false);
      }
    }
    fetchProfile();
  }, [user, db, authLoading]);

  const userPoints = profileData?.points || 0;
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";
  
  const displayPhotoURL = profileData?.photoURL || (profileData?.dev ? "/img/avas/dev.png" : (user?.photoURL || ""));

  const leaderboardData = useMemo(() => {
    let list = [...PLACEHOLDERS];
    
    if (user) {
      list.push({
        id: user.uid,
        name: user.displayName || "Gamer Pro",
        points: userPoints,
        avatar: displayPhotoURL,
        isPlaceholder: false,
        fontFamily: profileData?.fontFamily,
        nameColor: profileData?.nameColor,
        vip: profileData?.vip,
        profileBg: profileData?.profileBg || "bg-muted/30"
      });
    }

    return list.sort((a, b) => b.points - a.points).map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [user, userPoints, profileData, displayPhotoURL]);

  const TOP_THREE = leaderboardData.slice(0, 3);
  const TABLE_DATA = leaderboardData.slice(3, 10);

  const myRank = leaderboardData.find(item => item.id === user?.uid)?.rank || 0;
  const rookieGoal = 2000;
  const progressPercent = Math.min((userPoints / rookieGoal) * 100, 100);

  if (isInitialLoading || authLoading) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <nav className="sticky top-0 z-50 w-full bg-transparent">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="-ml-2 text-muted-foreground hover:text-foreground text-xs md:text-sm font-bold"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Kembali
          </Button>
          
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo className="h-9 w-9 md:h-12 md:w-12" />
          </Link>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-[10px] md:text-xs font-black tracking-[0.2em] rounded-full">
            SEASON 1: THE ULTIMATE
          </Badge>
          <h1 className="font-headline text-4xl md:text-7xl font-black mb-4 tracking-tighter text-foreground">
            Hall of Fame
          </h1>
          <p className="text-xs md:text-lg text-muted-foreground max-w-2xl mx-auto font-bold opacity-80 leading-relaxed px-4">
            Kumpulkan poin dari setiap transaksi dan ukir namamu di puncak klasemen global!
          </p>
        </div>

        {/* Dynamic Podium */}
        <div className="flex items-end justify-center gap-1 md:gap-6 mb-20 md:mb-32 px-1 max-w-4xl mx-auto">
          {/* RANK 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="relative aspect-video w-24 md:w-48 flex items-center justify-center mb-2">
                <Image src="/img/border/two.png" alt="Rank 2 Border" fill className="object-contain z-20" unoptimized />
                <div className={cn(
                  "h-10 w-10 md:h-20 md:w-20 rounded-full flex items-center justify-center p-0.5 md:p-1 shadow-xl relative z-10",
                  !TOP_THREE[1]?.isPlaceholder ? (TOP_THREE[1]?.profileBg || "bg-muted/20") : "bg-muted/20"
                )}>
                  <Avatar className="h-full w-full border border-background">
                    <AvatarImage src={TOP_THREE[1]?.avatar} alt={TOP_THREE[1]?.name} />
                    <AvatarFallback className="bg-muted text-[10px]">{TOP_THREE[1]?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center gap-1 justify-center w-full">
                <p 
                  className={cn("font-black text-[9px] md:text-sm truncate max-w-[80px] md:max-w-[120px]", !TOP_THREE[1]?.isPlaceholder ? (TOP_THREE[1]?.nameColor || "text-foreground") : "text-foreground")}
                  style={!TOP_THREE[1]?.isPlaceholder && TOP_THREE[1]?.fontFamily ? { fontFamily: TOP_THREE[1].fontFamily } : {}}
                >
                  {TOP_THREE[1]?.name}
                </p>
                {TOP_THREE[1]?.vip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image src="/img/badge/vip.png" alt="VIP" width={14} height={14} className="shrink-0 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-[10px] font-black">VIP Member</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="mt-1 px-1.5 py-0.5 bg-muted rounded-full flex items-center gap-1 border border-border/50">
                <span className="text-[8px] md:text-[11px] font-black text-foreground">
                  {TOP_THREE[1]?.points?.toLocaleString()} 
                </span>
              </div>
            </div>
            <div className="w-full h-16 md:h-40 bg-gradient-to-b from-slate-400/30 to-slate-400/10 border-t-2 md:border-t-4 border-slate-400/50 rounded-t-lg md:rounded-t-xl flex items-center justify-center">
              <span className="font-headline text-2xl md:text-6xl font-black text-slate-400/40">2</span>
            </div>
          </div>

          {/* RANK 1 */}
          <div className="flex flex-col items-center flex-1 relative -top-3 md:-top-4">
            <Crown className="h-5 w-5 md:h-10 md:w-10 text-primary mb-1 md:mb-2" />
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="relative aspect-video w-32 md:w-64 flex items-center justify-center mb-2">
                <Image src="/img/border/one.png" alt="Rank 1 Border" fill className="object-contain z-20" priority unoptimized />
                <div className={cn(
                  "h-12 w-12 md:h-24 md:w-24 rounded-full flex items-center justify-center p-0.5 md:p-1.5 shadow-2xl relative z-10",
                  !TOP_THREE[0]?.isPlaceholder ? (TOP_THREE[0]?.profileBg || "bg-muted/20") : "bg-muted/20"
                )}>
                  <Avatar className="h-full w-full border border-background">
                    <AvatarImage src={TOP_THREE[0]?.avatar} alt={TOP_THREE[0]?.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-black">{TOP_THREE[0]?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center gap-1 justify-center w-full">
                <p 
                  className={cn("font-black text-[11px] md:text-lg truncate max-w-[100px] md:max-w-[160px]", !TOP_THREE[0]?.isPlaceholder ? (TOP_THREE[0]?.nameColor || "text-foreground") : "text-foreground")}
                  style={!TOP_THREE[0]?.isPlaceholder && TOP_THREE[0]?.fontFamily ? { fontFamily: TOP_THREE[0].fontFamily } : {}}
                >
                  {TOP_THREE[0]?.name}
                </p>
                {TOP_THREE[0]?.vip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image src="/img/badge/vip.png" alt="VIP" width={18} height={18} className="shrink-0 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-[10px] font-black">VIP Member</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="mt-1 px-2 py-0.5 md:px-3 md:py-1 bg-primary/10 rounded-full flex items-center gap-1 border border-primary/30">
                <span className="text-[9px] md:text-sm font-black text-primary">
                  {TOP_THREE[0]?.points?.toLocaleString()} 
                </span>
              </div>
            </div>
            <div className="w-full h-24 md:h-56 bg-gradient-to-b from-primary/30 to-primary/5 border-t-2 md:border-t-4 border-primary rounded-t-lg md:rounded-t-xl flex items-center justify-center shadow-[0_-10px_30px_-12px_rgba(242,255,0,0.15)] md:shadow-[0_-20px_50px_-12px_rgba(242,255,0,0.15)]">
              <span className="font-headline text-3xl md:text-8xl font-black text-primary/30">1</span>
            </div>
          </div>

          {/* RANK 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="relative aspect-video w-20 md:w-40 flex items-center justify-center mb-2">
                <Image src="/img/border/three.png" alt="Rank 3 Border" fill className="object-contain z-20" unoptimized />
                <div className={cn(
                  "h-9 w-9 md:h-16 md:w-16 rounded-full flex items-center justify-center p-0.5 md:p-1 shadow-xl relative z-10",
                  !TOP_THREE[2]?.isPlaceholder ? (TOP_THREE[2]?.profileBg || "bg-muted/20") : "bg-muted/20"
                )}>
                  <Avatar className="h-full w-full border border-background">
                    <AvatarImage src={TOP_THREE[2]?.avatar} alt={TOP_THREE[2]?.name} />
                    <AvatarFallback className="bg-muted text-[10px]">{TOP_THREE[2]?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center gap-1 justify-center w-full">
                <p 
                  className={cn("font-black text-[8px] md:text-xs truncate max-w-[70px] md:max-w-[100px]", !TOP_THREE[2]?.isPlaceholder ? (TOP_THREE[2]?.nameColor || "text-foreground") : "text-foreground")}
                  style={!TOP_THREE[2]?.isPlaceholder && TOP_THREE[2]?.fontFamily ? { fontFamily: TOP_THREE[2].fontFamily } : {}}
                >
                  {TOP_THREE[2]?.name}
                </p>
                {TOP_THREE[2]?.vip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image src="/img/badge/vip.png" alt="VIP" width={12} height={12} className="shrink-0 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-[10px] font-black">VIP Member</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="mt-1 px-1 py-0.5 bg-muted rounded-full flex items-center gap-1 border border-border/50">
                <span className="text-[7px] md:text-[10px] font-black text-foreground">
                  {TOP_THREE[2]?.points?.toLocaleString()} 
                </span>
              </div>
            </div>
            <div className="w-full h-12 md:h-28 bg-gradient-to-b from-orange-400/20 to-orange-400/5 border-t-2 md:border-t-4 border-orange-400/40 rounded-t-lg md:rounded-t-xl flex items-center justify-center">
              <span className="font-headline text-xl md:text-5xl font-black text-orange-400/30">3</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bento-card p-0 overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm">
              <div className="p-4 md:p-6 border-b border-border/40 bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    < Medal className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-sm md:text-lg text-foreground">Peringkat Global</h3>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold">Pemain Teratas Musim Ini</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 text-green-500 bg-green-500/10 px-2 md:px-3 py-1 rounded-full border border-green-500/20">
                   <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                   <span className="text-[8px] md:text-[10px] font-black">LIVE</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border/30">
                      <TableHead className="font-black text-[9px] md:text-[10px] tracking-widest text-muted-foreground w-12 md:w-16 text-center">RANK</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] tracking-widest text-muted-foreground">GAMER</TableHead>
                      <TableHead className="font-black text-[9px] md:text-[10px] tracking-widest text-muted-foreground text-right pr-4 md:pr-6">SCORE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TABLE_DATA.map((item) => (
                      <TableRow key={item.id} className={cn("border-border/20 transition-all group", item.id === user?.uid ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30")}>
                        <TableCell className="text-center p-3 md:p-4">
                          <span className="font-black text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">#{item.rank}</span>
                        </TableCell>
                        <TableCell className="p-3 md:p-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className={cn(
                              "h-7 w-7 md:h-9 md:w-9 rounded-full flex items-center justify-center p-0.5",
                              !item.isPlaceholder ? (item.profileBg || "bg-muted/30") : "bg-muted/20"
                            )}>
                              <Avatar className="h-full w-full border border-background">
                                <AvatarImage src={item.avatar} />
                                <AvatarFallback className="bg-muted text-[10px]">{item.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p 
                                  className={cn("font-black text-xs md:text-sm truncate", !item.isPlaceholder ? (item.nameColor || "text-foreground") : "text-foreground")}
                                  style={!item.isPlaceholder && item.fontFamily ? { fontFamily: item.fontFamily } : {}}
                                >
                                  {item.name}
                                </p>
                                {item.id === user?.uid && <ShieldCheck className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary shrink-0" />}
                                {item.vip && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Image src="/img/badge/vip.png" alt="VIP" width={14} height={14} className="shrink-0 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-[10px] font-black">VIP Member</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                              {!item.isPlaceholder && (
                                <p className="text-[8px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                                  Your Account
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4 md:pr-6 p-3 md:p-4">
                          <span className="font-black text-xs md:text-sm text-primary tabular-nums">{item.points.toLocaleString()}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bento-card p-6 border-primary/30 bg-primary/5 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              
              <h3 className="font-black text-xs md:text-sm mb-6 flex items-center gap-2 text-primary tracking-widest">
                <Star className="h-4 w-4 fill-primary" />
                MY STATS
              </h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className={cn(
                    "h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center p-1 transition-all duration-300",
                    profileData?.profileBg || "bg-muted/30"
                  )}>
                    <Avatar className="h-full w-full border-2 border-background shadow-xl">
                      <AvatarImage src={displayPhotoURL} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-background border border-primary/30 p-1 rounded-lg">
                     <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-2">
                    <p 
                      className={cn("font-black text-lg md:text-xl leading-none truncate max-w-[140px]", profileData?.nameColor || "text-foreground")}
                      style={profileData?.fontFamily ? { fontFamily: profileData.fontFamily } : {}}
                    >
                      {user?.displayName || "Gamer Pro"}
                    </p>
                    {profileData?.vip && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Image src="/img/badge/vip.png" alt="VIP" width={20} height={20} className="shrink-0 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs font-black">VIP Member</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground text-[8px] font-black h-5 uppercase tracking-tighter">
                      RANK #{myRank || "---"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-muted-foreground tracking-widest uppercase text-[10px]">Your Points</span>
                  <span className="text-primary text-sm">{userPoints.toLocaleString()} pts</span>
                </div>
                <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden border border-border/30">
                  <div 
                    className="absolute top-0 left-0 bg-primary h-full rounded-full shadow-[0_0_10px_rgba(242,255,0,0.5)] transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground italic">
                   <span>Newbie</span>
                   <span>{Math.max(0, rookieGoal - userPoints).toLocaleString()} pts to Rookie</span>
                </div>
              </div>
            </div>

            <div className="bento-card p-6 bg-card/40 backdrop-blur-sm border-border/40">
              <h3 className="font-black text-xs md:text-sm mb-6 tracking-widest uppercase text-foreground">Pusat Poin</h3>
              <div className="space-y-5">
                <div className="flex gap-4 group cursor-help">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black mb-1 text-foreground">Topup Loyalitas</p>
                    <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">Dapatkan 1 poin setiap transaksi kelipatan Rp 1.000.</p>
                  </div>
                </div>
                <div className="flex gap-4 group cursor-help">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black mb-1 text-foreground">Daily Quest</p>
                    <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">Login 7 hari berturut-turut untuk bonus 500 poin instan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
