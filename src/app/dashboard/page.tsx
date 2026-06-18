"use client";

import { useUser } from "@/firebase";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Gamepad2, History, LayoutDashboard, Settings, ArrowUpRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

const CHART_DATA = [
  { month: "Mei", spent: 45000 },
  { month: "Jun", spent: 120000 },
  { month: "Jul", spent: 85000 },
  { month: "Agu", spent: 240000 },
  { month: "Sep", spent: 150000 },
  { month: "Okt", spent: 315000 },
];

const CHART_CONFIG = {
  spent: {
    label: "Total Topup (Rp)",
    color: "hsl(var(--primary))",
  },
};

const RECENT_TRANSACTIONS = [
  { id: "STS-9821-X", game: "Mobile Legends", item: "172 Diamonds", price: "Rp 38,000", status: "Success", date: "24 Okt 2023" },
  { id: "STS-8722-A", game: "Genshin Impact", item: "300 Crystals", price: "Rp 79,000", status: "Success", date: "15 Okt 2023" },
  { id: "STS-7612-B", game: "Valorant", item: "1250 Points", price: "Rp 150,000", status: "Success", date: "28 Sep 2023" },
];

export default function DashboardPage() {
  const { user, loading } = useUser();

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
        <div className="grid gap-6 md:grid-cols-3 items-start">
          
          {/* Left Block: Profile & Coins */}
          <div className="space-y-6 md:col-span-1">
            {/* User Info Bento Card */}
            <div className="bento-card p-6 flex flex-col items-center text-center">
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

            {/* STS Coin Bento Card */}
            <div className="bento-card p-6 relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-muted-foreground font-black tracking-widest">SALDO DIGITAL</p>
                  <h3 className="font-headline text-2xl font-black text-foreground mt-1">STS Coin</h3>
                </div>
                <img src="/img/coin.png" alt="STS Coin" className="h-10 w-10 object-contain animate-bounce" />
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

          {/* Right Block: Charts & Transactions */}
          <div className="space-y-6 md:col-span-2">
            {/* Analytics Chart Card */}
            <Card className="border border-border bg-card/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-headline text-lg font-black text-foreground flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Analisis Pengeluaran
                    </CardTitle>
                    <CardDescription className="text-xs font-bold text-muted-foreground mt-0.5">
                      Statistik pengisian voucher dan kredit digital 6 bulan terakhir.
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground tracking-widest">TOTAL SPENT</p>
                    <p className="text-lg font-black text-primary">Rp 955,000</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={CHART_CONFIG} className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-muted-foreground font-bold" />
                      <YAxis tickLine={false} axisLine={false} className="text-muted-foreground font-bold" />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area type="monotone" dataKey="spent" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Digital Services Orders */}
            <div className="bento-card p-6">
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
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground">ID TRANSAKSI</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground">PRODUK GAME</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground">NOMINAL</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground">TOTAL</TableHead>
                      <TableHead className="font-black text-xs tracking-wider text-muted-foreground text-right">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECENT_TRANSACTIONS.map((tx) => (
                      <TableRow key={tx.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-foreground">{tx.id}</TableCell>
                        <TableCell className="text-xs font-black text-foreground">{tx.game}</TableCell>
                        <TableCell className="text-xs font-bold text-muted-foreground">{tx.item}</TableCell>
                        <TableCell className="text-xs font-black text-primary">{tx.price}</TableCell>
                        <TableCell className="text-right">
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
