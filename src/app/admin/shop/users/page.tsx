
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
  Loader2
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
import { format } from "date-fns";

interface UserData {
  id: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  coins?: number;
  points?: number;
  vip?: boolean;
  admin?: boolean;
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
    admins: users.filter(u => u.admin).length
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-primary" /> Manajemen Pengguna
          </h1>
          <p className="text-sm text-muted-foreground font-bold">Kelola data profil, saldo koin, dan otoritas member.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20">
          Tambah User Baru
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Member</p>
              <p className="text-2xl font-black">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">VIP Members</p>
              <p className="text-2xl font-black">{stats.vip}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Administrators</p>
              <p className="text-2xl font-black">{stats.admins}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/30 bg-muted/20">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black tracking-tight">Daftar Member</CardTitle>
              <CardDescription className="text-xs font-bold">Menampilkan {filteredUsers.length} pengguna aktif.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama atau email..." 
                  className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl border-border shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-widest opacity-50">Menyelaraskan Data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">User</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Saldo & Poin</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Tanggal Join</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-bold">
                        Tidak ada pengguna ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/20 border-border/30 group">
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-xl border border-border group-hover:border-primary/50 transition-colors">
                              <AvatarImage src={user.photoURL} />
                              <AvatarFallback className="bg-muted font-black text-xs">
                                {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-black truncate">{user.displayName || "Gamer"}</span>
                              <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <Coins className="h-3 w-3 text-primary" />
                              <span className="text-xs font-black tabular-nums">{(user.coins || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Trophy className="h-3 w-3 text-amber-500" />
                              <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{(user.points || 0).toLocaleString()} pts</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1.5">
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
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px]">
                            <Calendar className="h-3 w-3" />
                            {user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy") : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Akun</DropdownMenuLabel>
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer">Lihat Detail Profil</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer">Edit Saldo & Koin</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer">Kirim Pesan Blast</DropdownMenuItem>
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
                    ))
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
