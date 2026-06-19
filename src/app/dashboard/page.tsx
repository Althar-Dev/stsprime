"use client";

import { useUser } from "@/firebase";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gamepad2, History, LayoutDashboard, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const RECENT_TRANSACTIONS = [
  { id: "STS-9821-X", game: "Mobile Legends", item: "172 Diamonds", price: "Rp 38,000", status: "Success", date: "24 Okt 2023" },
  { id: "STS-8722-A", game: "Genshin Impact", item: "300 Crystals", price: "Rp 79,000", status: "Success", date: "15 Okt 2023" },
  { id: "STS-7612-B", game: "Valorant", item: "1250 Points", price: "Rp 150,000", status: "Success", date: "28 Sep 2023" },
];

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Gamer Dashboard
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 font-bold">
              Pantau aktivitas saldo koin, pengeluaran topup, dan status item digital Anda.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-none">
              <Button className="w-full rounded-xl font-black text-xs h-10 bg-primary text-primary-foreground gap-2">
                <Gamepad2 className="h-4 w-4" /> Topup Game
              </Button>
            </Link>
            <Link href="/history" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full rounded-xl font-bold text-xs h-10 border-border gap-2">
                <History className="h-4 w-4" /> Riwayat
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 items-start">
          
          {/* User Info Bento Card */}
          <div className="col-span-1">
            <div className="bento-card p-6 flex flex-col items-center text-center h-full">
              <Avatar className="h-20 w-20 border-2 border-primary/50 mb-4">
                <AvatarImage src={user?.photoURL || ""} alt={user?.email || "Gamer"} />
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-2xl">
                  {user?.email?.charAt(0).toUpperCase() || "G"}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-headline text-xl font-black tracking-tight text-foreground">
                {user?.displayName || "Gamer Pro"}
              </h2>
              <p className="text-xs text-muted-foreground font-bold truncate max-w-full mb-3">
                {user?.email || "belum_login@stspedia.com"}
              </p>
              <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-[10px] font-black tracking-wider rounded-full">
                MEMBER VERIFIED
              </Badge>
            </div>
          </div>

          {/* STS Coin Bento Card */}
          <div className="col-span-1">
            <div className="bento-card p-6 relative overflow-hidden border-primary/20 bg-card/50 h-full">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black tracking-widest">SALDO DIGITAL</p>
                    <h3 className="font-headline text-2xl font-black text-foreground mt-1">STS Coin</h3>
                  </div>
                  <img src="/img/coin.png" alt="STS Coin" className="h-10 w-10 object-contain" />
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-primary">0</span>
                  <span className="text-xs text-muted-foreground font-bold">Coins</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold mt-4 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Gunakan koin untuk diskon instan saat checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Digital Services Orders */}
          <div className="col-span-1 md:col-span-2">
            <div className="bento-card p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-headline text-base font-black text-foreground">Transaksi Terakhir</h3>
                  <p className="text-[10px] text-muted-foreground font-bold mt-0.5">3 pengisian produk game paling baru.</p>
                </div>
                <Link href="/history" className="text-xs font-black text-primary flex items-center gap-1 hover:underline">
                  Lihat Semua <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-border/60">
                    <TableRow>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground whitespace-nowrap">ID TRANSAKSI</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground whitespace-nowrap">PRODUK GAME</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground whitespace-nowrap">NOMINAL</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground whitespace-nowrap">TOTAL</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground text-right whitespace-nowrap">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECENT_TRANSACTIONS.map((tx) => (
                      <TableRow key={tx.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-foreground whitespace-nowrap">{tx.id}</TableCell>
                        <TableCell className="text-xs font-black text-foreground whitespace-nowrap">{tx.game}</TableCell>
                        <TableCell className="text-xs font-bold text-muted-foreground whitespace-nowrap">{tx.item}</TableCell>
                        <TableCell className="text-xs font-black text-primary whitespace-nowrap">{tx.price}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black px-2 py-0.5">
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
      </main>

      <Footer />
    </div>
  );
}
