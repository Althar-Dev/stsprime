"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Coins, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  TrendingUp, 
  Filter,
  Plus,
  Loader2,
  Gift,
  ArrowRightLeft,
  CircleDollarSign,
  Zap,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface UserCoinData {
  id: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  coins?: number;
}

const MOCK_COIN_LOGS = [
  { id: "LOG-001", user: "GamerPro99", type: "Cashback", amount: 1500, reason: "Order MLBB #STS-9821", date: "12 Agu 2026, 14:20" },
  { id: "LOG-002", user: "SultanFF", type: "Discount", amount: 5000, reason: "Used on Order #STS-9822", date: "12 Agu 2026, 14:15" },
  { id: "LOG-003", user: "RiotGamer", type: "Cashback", amount: 2400, reason: "Order Valorant #STS-9823", date: "12 Agu 2026, 13:50" },
  { id: "LOG-004", user: "PrimogemLover", type: "Discount", amount: 10000, reason: "Full Coin Payment #STS-9824", date: "11 Agu 2026, 22:10" },
  { id: "LOG-005", user: "Admin", type: "Adjustment", amount: 50000, reason: "System Event Bonus", date: "11 Agu 2026, 10:00" },
];

export default function AdminCoinsPage() {
  const db = useFirestore();
  const [users, setUsers] = useState<UserCoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchTopHolders() {
      if (!db) return;
      try {
        const usersRef = collection(db, "users");
        // Ambil pemegang koin reward terbanyak
        const q = query(usersRef, orderBy("coins", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as UserCoinData));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching coin holders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopHolders();
  }, [db]);

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-primary">
            <Coins className="h-8 w-8 text-primary" /> Ekonomi Koin (Reward)
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola mata uang loyalitas, audit cashback, dan atur strategi diskon koin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2">
            <Percent className="h-4 w-4" /> Atur % Cashback
          </Button>
          <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
            <Gift className="h-4 w-4" /> Drop Koin Massal
          </Button>
        </div>
      </div>

      {/* Reward System KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Koin Beredar", value: "12.4M", icon: Coins, color: "text-primary", trend: "Total liability reward" },
          { label: "Cashback (Hari Ini)", value: "142.500", icon: Zap, color: "text-emerald-500", trend: "Koin baru dihasilkan" },
          { label: "Diskon (Hari Ini)", value: "98.200", icon: ArrowDownRight, color: "text-amber-500", trend: "Koin dibakar (Burn)" },
          { label: "Efektivitas Reward", value: "4.2%", icon: TrendingUp, color: "text-blue-500", trend: "Rasio penggunaan koin" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter opacity-60">Loyalty</Badge>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-black tabular-nums">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground/60 italic">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Loyalists Table */}
        <Card className="lg:col-span-1 bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="p-6 bg-muted/10 border-b border-border/30">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-primary" /> Top Loyalists
            </CardTitle>
            <CardDescription className="text-xs font-bold">Member dengan tabungan koin terbanyak.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Memuat Daftar...</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filteredUsers.length === 0 ? (
                  <div className="py-20 text-center text-xs font-bold text-muted-foreground">Belum ada data koin.</div>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] font-black text-muted-foreground w-4">{idx + 1}</span>
                        <Avatar className="h-9 w-9 rounded-lg border border-border group-hover:border-primary/50 transition-colors">
                          <AvatarImage src={user.photoURL} />
                          <AvatarFallback className="bg-muted text-[10px] font-black">{user.displayName?.charAt(0) || "G"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-black truncate">{user.displayName || "Gamer"}</span>
                          <span className="text-[9px] text-muted-foreground font-bold truncate">{user.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                        <img src="/img/coin.png" className="h-3.5 w-3.5" alt="coin" />
                        <span className="text-xs font-black text-primary tabular-nums">{(user.coins || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="p-4 bg-muted/5 border-t border-border/30 text-center">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary h-8 hover:bg-primary/5">
                Lihat Semua Kolektor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reward Mutation Logs */}
        <Card className="lg:col-span-2 bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="p-6 bg-muted/10 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Log Mutasi Reward
              </CardTitle>
              <CardDescription className="text-xs font-bold">Audit aliran koin dari cashback dan penggunaan diskon.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Cari user..." 
                  className="pl-8 h-9 bg-background border-border text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">User & Referensi</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Tipe</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Jumlah Koin</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Waktu</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Audit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_COIN_LOGS.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{log.user}</span>
                          <span className="text-[10px] text-muted-foreground font-bold">{log.reason}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded",
                          log.type === "Cashback" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                          log.type === "Discount" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                          "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        )}>
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "text-xs font-black tabular-nums",
                            log.type === "Cashback" ? "text-emerald-500" : log.type === "Discount" ? "text-amber-500" : "text-blue-500"
                          )}>
                            {log.type === "Discount" ? "-" : "+"}{log.amount.toLocaleString()}
                          </span>
                          <img src="/img/coin.png" className="h-3 w-3" alt="coin" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[10px] font-bold text-muted-foreground">{log.date}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Audit Reward</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer">Buka Invoice Referensi</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer">Tinjau Dompet User</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer text-destructive">Batalkan Cashback</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 bg-muted/5 border-t border-border/30 flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Log Reward Aktif</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest px-3 border-border">Prev</Button>
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest px-3 border-border">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
