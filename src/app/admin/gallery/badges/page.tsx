"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Star,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Sparkles,
  Upload
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const MOCK_BADGES = [
  {
    id: "BDG-001",
    name: "VIP Member",
    category: "Status",
    imageUrl: "/img/badge/vip.png",
    requirement: "Berlangganan VIP",
    owners: 128,
    status: "Active",
    color: "text-amber-500"
  },
  {
    id: "BDG-002",
    name: "Early Adopter",
    category: "Achievement",
    imageUrl: "https://picsum.photos/seed/early/100/100",
    requirement: "Daftar sebelum Season 1",
    owners: 540,
    status: "Active",
    color: "text-blue-500"
  },
  {
    id: "BDG-003",
    name: "Top Spender",
    category: "Achievement",
    imageUrl: "https://picsum.photos/seed/spender/100/100",
    requirement: "Total Transaksi > 10jt",
    owners: 12,
    status: "Active",
    color: "text-emerald-500"
  },
  {
    id: "BDG-004",
    name: "Bug Hunter",
    category: "Special",
    imageUrl: "https://picsum.photos/seed/bug/100/100",
    requirement: "Melaporkan bug valid",
    owners: 5,
    status: "Active",
    color: "text-purple-500"
  },
  {
    id: "BDG-005",
    name: "Event Merdeka",
    category: "Event",
    imageUrl: "https://picsum.photos/seed/merdeka/100/100",
    requirement: "Topup selama event 17an",
    owners: 856,
    status: "Expired",
    color: "text-red-500"
  },
];

export default function AdminBadgesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBadges = MOCK_BADGES.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || badge.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
      case "Expired":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" /> Manajemen Badge Akun
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola koleksi lencana pencapaian, status VIP, dan ikon identitas profil pengguna.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus className="h-4 w-4" /> Tambah Badge Baru
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Badge", value: "18 Aset", icon: Award, color: "text-primary" },
          { label: "Terdistribusi", value: "1,541 User", icon: Users, color: "text-blue-500" },
          { label: "Achievement", value: "12 Lencana", icon: Target, color: "text-emerald-500" },
          { label: "Event Khusus", value: "2 Aktif", icon: Sparkles, color: "text-amber-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-black truncate max-w-[120px]">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center">
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black tracking-tight">Katalog Lencana</CardTitle>
                <CardDescription className="text-xs font-bold">Daftar seluruh badge yang tersedia di ekosistem STSPrime.</CardDescription>
              </div>
              <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl overflow-x-auto no-scrollbar justify-start">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                  <TabsTrigger value="status" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Status</TabsTrigger>
                  <TabsTrigger value="achievement" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Achievement</TabsTrigger>
                  <TabsTrigger value="event" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Event</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama badge..." 
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
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Ikon & Lencana</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Syarat Perolehan</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Total Pemilik</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBadges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada badge ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBadges.map((badge) => (
                    <TableRow key={badge.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted/50 flex items-center justify-center p-1 border border-border/50 group-hover:border-primary/50 transition-all">
                            <Image 
                              src={badge.imageUrl} 
                              alt={badge.name} 
                              width={40}
                              height={40}
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={cn("text-sm font-black truncate", badge.color)}>{badge.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase">{badge.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter px-2 rounded-md bg-muted/30">
                          {badge.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-bold text-muted-foreground italic">"{badge.requirement}"</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-black tabular-nums">{badge.owners.toLocaleString()} User</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(badge.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Badge</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Syarat & Nama
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Upload className="h-3.5 w-3.5 text-primary" /> Ganti Gambar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {badge.status === "Active" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <XCircle className="h-3.5 w-3.5" /> Nonaktifkan
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Aktifkan Kembali
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Badge
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
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bento-card border-primary/20 bg-primary/5 p-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Mekanisme Badge</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Badge bersifat pameran di profil pengguna. Pastikan resolusi gambar minimal 200x200 px dengan format PNG transparan agar terlihat tajam di semua ukuran tampilan.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Penghargaan Musim</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Lencana "Top 3 Season 1" akan didistribusikan otomatis bulan depan.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border">
              Lihat Antrean Hadiah
            </Button>
        </Card>
      </div>
    </div>
  );
}
