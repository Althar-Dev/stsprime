
"use client";

import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Gamepad2, History, LayoutDashboard, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const RECENT_TRANSACTIONS = [
  { id: "STS-9821-X", game: "Mobile Legends", item: "172 Diamonds", price: "Rp 38,000", status: "Success", date: "24 Okt 2023" },
  { id: "STS-8722-A", game: "Genshin Impact", item: "300 Crystals", price: "Rp 79,000", status: "Success", date: "15 Okt 2023" },
  { id: "STS-7612-B", game: "Valorant", item: "1250 Points", price: "Rp 150,000", status: "Success", date: "28 Sep 2023" },
];

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      } catch (error) {
        // Fail silently
      }
    }
    fetchProfile();
  }, [user, db]);

  const profileBg = profileData?.profileBg || "bg-muted/30";
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";
  
  const displayPhotoURL = profileData?.photoURL || (profileData?.dev ? "/img/avas/dev.png" : (user?.photoURL || ""));

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="font-headline text-2xl md:text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            Dashboard
          </h1>
          <p className="text-[10px] md:text-sm text-muted-foreground font-bold max-w-md">
            Pantau aktivitas saldo koin, pengeluaran topup, dan status item digital Anda dalam satu tampilan terpadu.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link href="/" className="flex-1 sm:flex-none">
            <Button className="w-full rounded-xl font-black text-xs h-11 bg-primary text-primary-foreground gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              <Gamepad2 className="h-4 w-4" /> Topup Game
            </Button>
          </Link>
          <Link href="/history" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full rounded-xl font-bold text-xs h-11 border-border gap-2 hover:bg-muted/50">
              <History className="h-4 w-4" /> Riwayat
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Grid Layout */}
      <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-12">
        
        {/* User Info Bento Card */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="bento-card p-6 md:p-8 flex flex-col items-center text-center h-full bg-card/30 backdrop-blur-sm">
            <div className="relative mb-6">
              <div className={cn(
                "h-24 w-24 md:h-28 md:w-28 rounded-full flex items-center justify-center p-1 transition-all duration-500",
                profileBg
              )}>
                <Avatar className="h-full w-full border-4 border-background shadow-xl">
                  <AvatarImage src={displayPhotoURL} alt={user?.displayName || "Gamer"} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-black text-3xl">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-background border border-border p-1.5 rounded-lg shadow-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center mb-1 w-full overflow-hidden">
              <h2 
                className={cn(
                  "text-xl md:text-2xl font-black tracking-tight line-clamp-1 transition-all",
                  profileData?.nameColor || "text-foreground"
                )}
                style={profileData?.fontFamily ? { fontFamily: profileData.fontFamily } : {}}
              >
                {user?.displayName || "Gamer Pro"}
              </h2>
              {profileData?.vip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image src="/img/badge/vip.png" alt="VIP" width={24} height={24} className="shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-black">VIP Member STS Pedia</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-bold truncate max-w-full mb-6 opacity-70">
              {user?.email || "guest@stspedia.com"}
            </p>
            <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 text-[10px] font-black tracking-widest rounded-full uppercase">
              {profileData?.dev ? "Developer Verified" : (profileData?.vip ? "VIP Member" : "Member Verified")}
            </Badge>
          </div>
        </div>

        {/* STS Coin Bento Card */}
        <div className="md:col-span-7 lg:col-span-8">
          <div className="bento-card p-6 md:p-8 relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent h-full group">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-700" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">Loyalty Reward</p>
                  <h3 className="font-headline text-2xl md:text-3xl font-black text-foreground">Saldo STS Coin</h3>
                </div>
                <div className="h-14 w-14 md:h-16 md:w-16 flex items-center justify-center">
                  <img src="/img/coin.png" alt="STS Coin" className="h-full w-full object-contain" />
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-black text-primary tracking-tighter">0</span>
                  <span className="text-sm md:text-lg text-muted-foreground font-black uppercase tracking-widest">Coins</span>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-border/40 pt-6">
                  <p className="text-[11px] md:text-xs text-muted-foreground font-bold flex items-center gap-2 max-w-md italic">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    Setiap koin bernilai Rp 1. Gunakan koin untuk mendapatkan diskon instan saat checkout produk favorit Anda.
                  </p>
                  <Button variant="outline" size="sm" className="sm:ml-auto h-9 rounded-xl font-black text-[10px] uppercase tracking-widest border-primary/30 text-primary hover:bg-primary/10">
                    Beli Koin
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Digital Services Orders */}
        <div className="md:col-span-12">
          <div className="bento-card p-6 md:p-8 h-full bg-card/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="space-y-1">
                <h3 className="font-headline text-lg md:text-xl font-black text-foreground">Transaksi Terakhir</h3>
                <p className="text-[11px] md:text-xs text-muted-foreground font-bold opacity-70">Ringkasan status 3 pengisian produk game paling baru.</p>
              </div>
              <Link href="/history">
                <Button variant="ghost" className="text-xs font-black text-primary gap-2 hover:bg-primary/5 rounded-xl h-10 px-4">
                  Lihat Riwayat Lengkap <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground h-12">ID Order</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground h-12">Produk Game</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground h-12">Detail Paket</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground h-12">Total Bayar</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right h-12 pr-6">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECENT_TRANSACTIONS.map((tx) => (
                      <TableRow key={tx.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors group">
                        <TableCell className="font-mono text-[11px] font-bold text-muted-foreground group-hover:text-foreground whitespace-nowrap">{tx.id}</TableCell>
                        <TableCell className="text-xs font-black text-foreground whitespace-nowrap">{tx.game}</TableCell>
                        <TableCell className="text-xs font-bold text-muted-foreground whitespace-nowrap">{tx.item}</TableCell>
                        <TableCell className="text-sm font-black text-primary whitespace-nowrap">{tx.price}</TableCell>
                        <TableCell className="text-right whitespace-nowrap pr-6">
                          <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
