
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  ShieldAlert,
  MoreVertical,
  Mail,
  Coins,
  Trophy,
  Filter,
  Calendar,
  Loader2,
  Wallet,
  ArrowUpRight
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
import Image from "next/image";
import { format } from "date-fns";

interface UserData {
  id: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  dev?: boolean;
  profileBg?: string;
  coins?: number;
  points?: number;
  balance?: number;
  vip?: boolean;
  admin?: boolean;
  nameColor?: string;
  fontId?: string;
  fontFamily?: string;
  badgeId?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const db = useFirestore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      if (!db) return;
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as UserData));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [db]);

  const filteredUsers = users.filter(u =>
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    vip: users.filter(u => u.vip).length,
    totalBalance: users.reduce((acc, curr) => acc + (curr.balance || 0), 0)
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <UsersIcon className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Manajemen Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola data profil, saldo utama, koin reward, dan otoritas member.</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20 shrink-0">
          Tambah User Baru
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full">
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
          <CardContent className="p-3.5 sm:p-6 flex items-center gap-2 sm:gap-4">
            <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <UsersIcon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">Total Member</p>
              <p className="text-base sm:text-2xl font-black truncate">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
          <CardContent className="p-3.5 sm:p-6 flex items-center gap-2 sm:gap-4">
            <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">VIP Members</p>
              <p className="text-base sm:text-2xl font-black truncate">{stats.vip}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm col-span-2 sm:col-span-1 min-w-0">
          <CardContent className="p-3.5 sm:p-6 flex items-center gap-2 sm:gap-4">
            <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">Total Saldo Member</p>
              <p className="text-base sm:text-2xl font-black truncate">Rp {stats.totalBalance.toLocaleString("id-ID")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
        <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/20">
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Daftar Member</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Menampilkan {filteredUsers.length} pengguna aktif beserta aset digital mereka.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau email..."
                  className="pl-9 sm:pl-10 h-9 sm:h-10 bg-background border-border text-[11px] sm:text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border-border shrink-0">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3 sm:gap-4">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-50">Menyelaraskan Data...</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[800px] whitespace-nowrap">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">User</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Saldo Utama (IDR)</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Coin & Poin</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Status</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Tanggal Join</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16 text-muted-foreground font-bold text-xs">
                        Tidak ada pengguna ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const displayPhoto = user.photoURL || (user.dev ? "/img/avas/dev.png" : "");
                      const profileBg = user.profileBg || "bg-muted/40";
                      return (
                        <TableRow key={user.id} className="hover:bg-muted/20 border-border/30 group">
                          <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center p-0.5 shrink-0 shadow-sm", profileBg)}>
                                <Avatar className="h-full w-full border border-background shadow-sm shrink-0">
                                  <AvatarImage src={displayPhoto} alt={user.displayName || user.email} />
                                  <AvatarFallback className="bg-muted font-black text-[10px] sm:text-xs">
                                    {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span 
                                    className={cn("text-xs sm:text-sm font-black truncate", user.nameColor || "text-foreground")}
                                    style={user.fontFamily ? { fontFamily: user.fontFamily } : {}}
                                  >
                                    {user.displayName || "Gamer"}
                                  </span>
                                  {user.vip && (
                                    <Image src="/img/badge/vip.png" alt="VIP" width={14} height={14} className="shrink-0" />
                                  )}
                                </div>
                                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3 shrink-0" /> {user.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                        <TableCell className="py-3 sm:py-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-500">
                            <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                            <span className="text-xs sm:text-sm font-black tabular-nums">Rp {(user.balance || 0).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 sm:py-4">
                          <div className="flex flex-col gap-0.5 sm:gap-1">
                            <div className="flex items-center gap-1.5">
                              <img src="/img/coin.png" className="h-3 w-3" alt="coin" />
                              <span className="text-[11px] sm:text-xs font-black tabular-nums text-primary">{(user.coins || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Trophy className="h-3 w-3 text-amber-500 shrink-0" />
                              <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tabular-nums">{(user.points || 0).toLocaleString()} pts</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 sm:py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.admin && (
                              <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] font-black uppercase tracking-tighter px-1.5">
                                Admin
                              </Badge>
                            )}
                            {user.vip && (
                              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase tracking-tighter px-1.5">
                                VIP
                              </Badge>
                            )}
                            {!user.admin && !user.vip && (
                              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter px-1.5">
                                Member
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 sm:py-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[9px] sm:text-[10px]">
                            <Calendar className="h-3 w-3 shrink-0" />
                            {user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy") : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                                <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Akun</DropdownMenuLabel>
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                                <ArrowUpRight className="h-3.5 w-3.5" /> Lihat Detail Profil
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                                <Wallet className="h-3.5 w-3.5 text-emerald-500" /> Edit Saldo Utama
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                                <Coins className="h-3.5 w-3.5 text-primary" /> Edit Coin & Poin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className={cn(
                                "text-xs font-bold cursor-pointer",
                                user.vip ? "text-destructive" : "text-amber-500"
                              )}>
                                {user.vip ? "Batalkan Status VIP" : "Berikan Status VIP"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer text-destructive focus:text-destructive">
                                Suspend Akun
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
