"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Trophy, Crown, Medal, TrendingUp, ShieldCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@/firebase";

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-xs font-black tracking-widest rounded-full">
            SEASON 4: THE ULTIMATE WHALE
          </Badge>
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Leaderboard
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto font-bold opacity-80">
            Peringkat tertinggi bagi para gamer yang paling loyal. Kumpulkan poin dari setiap transaksi dan jadilah nomor satu di STS Pedia!
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-16 md:mb-24 px-4">
          {/* Rank 2 */}
          <div className="order-2 md:order-1">
            <div className="bento-card p-6 flex flex-col items-center text-center border-border/60 bg-card/30 scale-95 md:scale-100">
              <div className="relative mb-4">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-slate-400">
                  <AvatarImage src={TOP_THREE[1].avatar} alt={TOP_THREE[1].name} />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-slate-400 text-white h-8 w-8 rounded-full flex items-center justify-center font-black shadow-lg">2</div>
              </div>
              <h3 className="font-black text-lg md:text-xl truncate w-full">{TOP_THREE[1].name}</h3>
              <p className="text-primary font-black text-sm">{TOP_THREE[1].points} pts</p>
              <Badge variant="outline" className="mt-3 border-slate-400/30 text-slate-400 text-[10px] font-black uppercase tracking-wider">{TOP_THREE[1].badge}</Badge>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="order-1 md:order-2">
            <div className="bento-card p-8 flex flex-col items-center text-center border-primary/50 bg-gradient-to-b from-primary/10 to-transparent shadow-2xl shadow-primary/5 scale-105 md:scale-110 relative">
              <Crown className="h-10 w-10 text-primary absolute -top-6 animate-bounce" />
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary">
                  <AvatarImage src={TOP_THREE[0].avatar} alt={TOP_THREE[0].name} />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg">1</div>
              </div>
              <h3 className="font-black text-xl md:text-2xl truncate w-full">{TOP_THREE[0].name}</h3>
              <p className="text-primary font-black text-base md:text-lg">{TOP_THREE[0].points} pts</p>
              <Badge className="mt-3 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider">{TOP_THREE[0].badge}</Badge>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3">
            <div className="bento-card p-6 flex flex-col items-center text-center border-border/60 bg-card/30 scale-90 md:scale-95">
              <div className="relative mb-4">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-orange-400">
                  <AvatarImage src={TOP_THREE[2].avatar} alt={TOP_THREE[2].name} />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white h-8 w-8 rounded-full flex items-center justify-center font-black shadow-lg">3</div>
              </div>
              <h3 className="font-black text-lg md:text-xl truncate w-full">{TOP_THREE[2].name}</h3>
              <p className="text-primary font-black text-sm">{TOP_THREE[2].points} pts</p>
              <Badge variant="outline" className="mt-3 border-orange-400/30 text-orange-400 text-[10px] font-black uppercase tracking-wider">{TOP_THREE[2].badge}</Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bento-card p-0 overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
                <h3 className="font-headline font-black text-lg flex items-center gap-2">
                  <Medal className="h-5 w-5 text-primary" />
                  Peringkat Global
                </h3>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="font-black text-xs text-muted-foreground w-20 text-center">RANK</TableHead>
                      <TableHead className="font-black text-xs text-muted-foreground">GAMER</TableHead>
                      <TableHead className="font-black text-xs text-muted-foreground text-right">TOTAL POINTS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OTHER_RANKS.map((item) => (
                      <TableRow key={item.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                        <TableCell className="text-center">
                          <span className="font-black text-sm text-muted-foreground">{item.rank}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={item.avatar} />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-black text-sm flex items-center gap-1.5">
                                {item.name}
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-black text-sm text-primary">{item.points} pts</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* My Stats & Info Sidebar */}
          <div className="space-y-6">
            <div className="bento-card p-6 border-primary/20 bg-primary/5">
              <h3 className="font-black text-sm mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-primary fill-primary" />
                Peringkat Anda
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "G"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-black text-lg leading-none mb-1">{user?.displayName || "Gamer Pro"}</p>
                  <p className="text-xs text-muted-foreground font-bold">Peringkat #854</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Points</span>
                  <span className="text-primary">1,240 pts</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[40%]" />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold text-center">Butuh 760 poin lagi untuk naik ke peringkat berikutnya!</p>
              </div>
            </div>

            <div className="bento-card p-6">
              <h3 className="font-black text-sm mb-4">Cara Mendapat Poin</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black">Topup Rutin</p>
                    <p className="text-[10px] text-muted-foreground font-bold leading-tight">Dapatkan 1 poin untuk setiap transaksi Rp 1.000.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black">Daily Streak</p>
                    <p className="text-[10px] text-muted-foreground font-bold leading-tight">Bonus poin jika melakukan transaksi 3 hari berturut-turut.</p>
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
