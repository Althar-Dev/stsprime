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
  Settings2, 
  TrendingUp, 
  Filter,
  Plus,
  Loader2,
  Gift,
  Edit,
  CircleDollarSign,
  Zap,
  Percent,
  ToggleLeft,
  ToggleRight,
  Trash2
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

const MOCK_REWARD_RULES = [
  { id: "RULE-001", name: "Cashback Standar", condition: "Semua Transaksi", reward: "1% dari Nominal", status: "Active", lastUpdated: "12 Agu 2026" },
  { id: "RULE-002", name: "Bonus Member VIP", condition: "Khusus Member VIP", reward: "2% dari Nominal", status: "Active", lastUpdated: "10 Agu 2026" },
  { id: "RULE-003", name: "Event Weekend Flash", condition: "Sabtu - Minggu", reward: "+500 Koin Flat", status: "Inactive", lastUpdated: "05 Agu 2026" },
  { id: "RULE-004", name: "Promo Merdeka", condition: "Min. Rp 100.000", reward: "5% (Maks 5k)", status: "Active", lastUpdated: "13 Agu 2026" },
  { id: "RULE-005", name: "Topup Pertama", condition: "User Baru", reward: "1000 Koin Tetap", status: "Active", lastUpdated: "01 Agu 2026" },
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
          <p className="text-sm text-muted-foreground font-bold italic">Kelola aturan cashback, strategi perolehan koin, dan monitor kolektor terbanyak.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
            <Plus className="h-4 w-4" /> Buat Aturan Baru
          </Button>
        </div>
      </div>

      {/* Reward System KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Koin Beredar", value: "12.4M", icon: Coins, color: "text-primary", trend: "Total liability reward" },
          { label: "Aturan Aktif", value: "4 Aturan", icon: Settings2, color: "text-blue-500", trend: "Strategi cashback" },
          { label: "Cashback (Hari Ini)", value: "142.500", icon: Zap, color: "text-emerald-500", trend: "Koin baru dihasilkan" },
          { label: "Diskon (Hari Ini)", value: "98.200", icon: ArrowDownRight, color: "text-amber-500", trend: "Koin dibakar (Burn)" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter opacity-60">Reward System</Badge>
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

        {/* Reward Rules Table */}
        <Card className="lg:col-span-2 bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="p-6 bg-muted/10 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" /> Aturan Perolehan Reward
              </CardTitle>
              <CardDescription className="text-xs font-bold">Konfigurasi otomatisasi pemberian koin cashback.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Cari aturan..." 
                  className="pl-8 h-9 bg-background border-border text-xs font-bold rounded-xl"
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
                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Nama Aturan</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Syarat & Kondisi</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Nilai Reward</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_REWARD_RULES.map((rule) => (
                    <TableRow key={rule.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{rule.name}</span>
                          <span className="text-[9px] text-muted-foreground font-mono font-bold uppercase">{rule.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Badge variant="outline" className="text-[9px] font-black px-1.5 py-0 rounded bg-muted/40">
                            {rule.condition}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-primary tabular-nums">
                            {rule.reward}
                          </span>
                          <img src="/img/coin.png" className="h-3 w-3" alt="coin" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                         <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded",
                          rule.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground"
                        )}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Manajemen Aturan</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Ubah Nilai Reward
                            </DropdownMenuItem>
                            {rule.status === "Active" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <ToggleLeft className="h-3.5 w-3.5" /> Nonaktifkan
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <ToggleRight className="h-3.5 w-3.5" /> Aktifkan
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Aturan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 bg-muted/5 border-t border-border/30 flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Konfigurasi Reward Sistem</p>
              <Button variant="ghost" className="text-[10px] font-black text-primary h-8 uppercase tracking-widest">
                Log Mutasi Koin <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
