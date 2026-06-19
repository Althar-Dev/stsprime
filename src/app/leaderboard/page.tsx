
"use client";

import { Footer } from "@/components/footer";
import { Crown, ShieldCheck, TrendingUp, ChevronRight, Star, Medal, Trophy, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";

const TOP_THREE = [
  { id: 1, name: "Sultan_MLBB", points: "45,280", avatar: "https://picsum.photos/seed/u1/200/200", rank: 1, badge: "Legendary" },
  { id: 2, name: "RiotGamer99", points: "38,150", avatar: "https://picsum.photos/seed/u2/200/200", rank: 2, badge: "Elite" },
  { id: 3, name: "GenshinSimp", points: "32,900", avatar: "https://picsum.photos/seed/u3/200/200", rank: 3, badge: "Elite" },
];

const OTHER_RANKS = [
  { id: 4, name: "ProPlayer_ID", points: "28,400", avatar: "https://picsum.photos/seed/u4/100/100", rank: 4 },
  { id: 5, name: "Vand_Points", points: "25,120", avatar: "https://picsum.photos/seed/u5/100/100", rank: 5 },
  { id: 6, name: "Alucard_Main", points: "22,800", avatar: "https://picsum.photos/seed/u6/100/100", rank: 6 },
  { id: 7, name: "Primogem_Hunter", points: "19,550", avatar: "https://picsum.photos/seed/u7/100/100", rank: 7 },
  { id: 8, name: "ValorantBoy", points: "15,200", avatar: "https://picsum.photos/seed/u8/100/100", rank: 8 },
  { id: 9, name: "F2P_God", points: "12,400", avatar: "https://picsum.photos/seed/u9/100/100", rank: 9 },
  { id: 10, name: "Newbie_Topup", points: "10,100", avatar: "https://picsum.photos/seed/u10/100/100", rank: 10 },
];

export default function LeaderboardPage() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/10">
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
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-[10px] md:text-xs font-black tracking-[0.2em] rounded-full">
            SEASON 4: THE ULTIMATE WHALE
          </Badge>
          <h1 className="font-headline text-4xl md:text-7xl font-black mb-4 tracking-tighter">
            Hall of Fame
          </h1>
          <p className="text-xs md:text-lg text-muted-foreground max-w-2xl mx-auto font-bold opacity-80 leading-relaxed px-4">
            Kumpulkan poin dari setiap transaksi dan ukir namamu di puncak klasemen global!
          </p>
        </div>

        {/* 3D Podium Section */}
        <div className="flex items-end justify-center gap-2 md:gap-6 mb-20 md:mb-32 px-2 max-w-4xl mx-auto">
          {/* Rank 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center mb-4 text-center">
              <Avatar className="h-14 w-14 md:h-20 md:w-20 border-2 border-slate-400/50 shadow-xl mb-2">
                <AvatarImage src={TOP_THREE[1].avatar} alt={TOP_THREE[1].name} />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <p className="font-black text-[10px] md:text-sm truncate w-24 md:w-32">{TOP_THREE[1].name}</p>
              <div className="mt-1 px-2 py-0.5 bg-muted rounded-full flex items-center gap-1 border border-border/50">
                <span className="text-[9px] md:text-[11px] font-black">
                  {TOP_THREE[1].points} 
                  <img src="/img/fire.gif" alt="fire" className="h-3 w-3 md:h-4 md:w-4 inline-block align-text-bottom ml-1" />
                </span>
              </div>
            </div>
            <div className="w-full h-24 md:h-40 bg-gradient-to-b from-slate-400/30 to-slate-400/10 border-t-4 border-slate-400/50 rounded-t-xl flex items-center justify-center">
              <span className="font-headline text-4xl md:text-6xl font-black text-slate-400/40">2</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center flex-1 relative -top-4">
            <Crown className="h-6 w-6 md:h-10 md:w-10 text-primary mb-2" />
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="relative">
                <Avatar className="h-18 w-18 md:h-28 md:w-28 border-4 border-primary shadow-2xl ring-4 ring-primary/20 mb-2">
                  <AvatarImage src={TOP_THREE[0].avatar} alt={TOP_THREE[0].name} />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
              </div>
              <p className="font-black text-xs md:text-lg truncate w-28 md:w-40">{TOP_THREE[0].name}</p>
              <div className="mt-1 px-3 py-1 bg-primary/10 rounded-full flex items-center gap-1 border border-primary/30">
                <span className="text-[10px] md:text-sm font-black text-primary">
                  {TOP_THREE[0].points} 
                  <img src="/img/fire.gif" alt="fire" className="h-4 w-4 md:h-5 md:w-5 inline-block align-text-bottom ml-1" />
                </span>
              </div>
            </div>
            <div className="w-full h-32 md:h-56 bg-gradient-to-b from-primary/30 to-primary/5 border-t-4 border-primary rounded-t-xl flex items-center justify-center shadow-[0_-20px_50px_-12px_rgba(242,255,0,0.15)]">
              <span className="font-headline text-5xl md:text-8xl font-black text-primary/30">1</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center mb-4 text-center">
              <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-orange-400/50 shadow-xl mb-2">
                <AvatarImage src={TOP_THREE[2].avatar} alt={TOP_THREE[2].name} />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <p className="font-black text-[9px] md:text-xs truncate w-20 md:w-28">{TOP_THREE[2].name}</p>
              <div className="mt-1 px-2 py-0.5 bg-muted rounded-full flex items-center gap-1 border border-border/50">
                <span className="text-[8px] md:text-[10px] font-black">
                  {TOP_THREE[2].points} 
                  <img src="/img/fire.gif" alt="fire" className="h-3 w-3 md:h-4 md:w-4 inline-block align-text-bottom ml-1" />
                </span>
              </div>
            </div>
            <div className="w-full h-16 md:h-28 bg-gradient-to-b from-orange-400/20 to-orange-400/5 border-t-4 border-orange-400/40 rounded-t-xl flex items-center justify-center">
              <span className="font-headline text-3xl md:text-5xl font-black text-orange-400/30">3</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Table Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bento-card p-0 overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm">
              <div className="p-5 md:p-6 border-b border-border/40 bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Medal className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-lg">Peringkat Global</h3>
                    <p className="text-[10px] text-muted-foreground font-bold">10 Kontributor Teratas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                   <TrendingUp className="h-4 w-4" />
                   <span className="text-[10px] font-black">LIVE</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border/30">
                      <TableHead className="font-black text-[10px] tracking-widest text-muted-foreground w-16 text-center">RANK</TableHead>
                      <TableHead className="font-black text-[10px] tracking-widest text-muted-foreground">GAMER</TableHead>
                      <TableHead className="font-black text-[10px] tracking-widest text-muted-foreground text-right pr-6">SCORE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OTHER_RANKS.map((item) => (
                      <TableRow key={item.id} className="border-border/20 hover:bg-muted/30 transition-all group">
                        <TableCell className="text-center">
                          <span className="font-black text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item.rank}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border/60">
                              <AvatarImage src={item.avatar} />
                              <AvatarFallback className="bg-muted">U</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-black text-sm flex items-center gap-1.5 truncate">
                                {item.name}
                                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                              </p>
                              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Verified Player</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <span className="font-black text-sm text-primary tabular-nums">{item.points}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 bg-muted/10 border-t border-border/20 text-center">
                 <button className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto">
                    LIHAT SEMUA PERINGKAT <ChevronRight className="h-3 w-3" />
                 </button>
              </div>
            </div>
          </div>

          {/* User Stats Sidebar */}
          <div className="space-y-6">
            <div className="bento-card p-6 border-primary/30 bg-primary/5 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              
              <h3 className="font-black text-xs md:text-sm mb-6 flex items-center gap-2 text-primary tracking-widest">
                <Star className="h-4 w-4 fill-primary" />
                MY STATS
              </h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary shadow-xl">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "G"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-background border border-primary/30 p-1 rounded-lg">
                     <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-black text-lg md:text-xl leading-none mb-2 truncate max-w-[140px]">{user?.displayName || "Gamer Pro"}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground text-[8px] font-black h-5">RANK #854</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-muted-foreground tracking-widest uppercase text-[10px]">Your Points</span>
                  <span className="text-primary text-sm">1,240 pts</span>
                </div>
                <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden border border-border/30">
                  <div className="absolute top-0 left-0 bg-primary h-full w-[40%] rounded-full shadow-[0_0_10px_rgba(242,255,0,0.5)] transition-all duration-1000" />
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground italic">
                   <span>Newbie</span>
                   <span>760 pts to Rookie</span>
                </div>
              </div>
            </div>

            <div className="bento-card p-6 bg-card/40 backdrop-blur-sm border-border/40">
              <h3 className="font-black text-xs md:text-sm mb-6 tracking-widest uppercase">Pusat Poin</h3>
              <div className="space-y-5">
                <div className="flex gap-4 group cursor-help">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black mb-1">Topup Loyalitas</p>
                    <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">Dapatkan 1 poin setiap transaksi kelipatan Rp 1.000.</p>
                  </div>
                </div>
                <div className="flex gap-4 group cursor-help">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black mb-1">Daily Quest</p>
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
