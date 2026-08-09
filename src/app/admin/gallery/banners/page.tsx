
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Image as ImageIcon,
  MousePointer2,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle
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

const MOCK_BANNERS = [
  {
    id: "BNR-001",
    title: "Promo Merdeka MLBB",
    imageUrl: "/img/bann1.webp",
    link: "/topup/mlbb",
    status: "Active",
    clicks: 1240,
    order: 1,
    createdAt: "10 Agu 2026"
  },
  {
    id: "BNR-002",
    title: "Valorant Points Flash Sale",
    imageUrl: "/img/bann2.webp",
    link: "/topup/valorant",
    status: "Active",
    clicks: 856,
    order: 2,
    createdAt: "11 Agu 2026"
  },
  {
    id: "BNR-003",
    title: "Metode Pembayaran Baru QRIS",
    imageUrl: "/img/bann3.webp",
    link: "/status",
    status: "Inactive",
    clicks: 432,
    order: 3,
    createdAt: "12 Agu 2026"
  },
  {
    id: "BNR-004",
    title: "Event FF Token Ring",
    imageUrl: "/img/bann4.webp",
    link: "/topup/ff",
    status: "Active",
    clicks: 2105,
    order: 4,
    createdAt: "13 Agu 2026"
  },
  {
    id: "BNR-005",
    title: "Genshin 4.0 Update",
    imageUrl: "/img/bann5.webp",
    link: "/topup/genshin",
    status: "Scheduled",
    clicks: 0,
    order: 5,
    createdAt: "14 Agu 2026"
  }
];

export default function AdminBannersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBanners = MOCK_BANNERS.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
      case "Inactive":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Inactive</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Monitor className="h-8 w-8 text-primary" /> Manajemen Banner
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola slider promo utama, urutan tampilan, dan statistik klik hero section.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus className="h-4 w-4" /> Upload Banner Baru
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Banner Aktif", value: "4", icon: ImageIcon, color: "text-primary" },
          { label: "Total Klik (30 Hari)", value: "14.2k", icon: MousePointer2, color: "text-blue-500" },
          { label: "Rata-rata CTR", value: "4.2%", icon: ArrowUpCircle, color: "text-emerald-500" },
          { label: "Event Berjalan", value: "2", icon: Calendar, color: "text-amber-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-black tabular-nums">{stat.value}</p>
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
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black tracking-tight">Daftar Visual Hero Section</CardTitle>
              <CardDescription className="text-xs font-bold">Atur urutan dan visibilitas kampanye marketing Anda.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari judul banner..." 
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
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Visual & Judul</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Urutan</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Statistik Klik</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Tanggal Upload</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada banner ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBanners.map((banner) => (
                    <TableRow key={banner.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-32 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-muted">
                            <Image 
                              src={banner.imageUrl} 
                              alt={banner.title} 
                              fill 
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black truncate max-w-[200px]">{banner.title}</span>
                            <span className="text-[10px] text-primary font-bold flex items-center gap-1 mt-1">
                              <ExternalLink className="h-3 w-3" /> {banner.link}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black tabular-nums">{banner.order}</span>
                          <div className="flex flex-col">
                            <button className="text-muted-foreground hover:text-primary"><ArrowUpCircle className="h-3 w-3" /></button>
                            <button className="text-muted-foreground hover:text-primary"><ArrowDownCircle className="h-3 w-3" /></button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(banner.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black tabular-nums">{banner.clicks.toLocaleString()}</span>
                          <span className="text-[9px] text-muted-foreground font-bold">Total Klik</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-bold text-muted-foreground">{banner.createdAt}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Banner</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Visual & Link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <ImageIcon className="h-3.5 w-3.5 text-primary" /> Ganti Gambar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {banner.status === "Active" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <EyeOff className="h-3.5 w-3.5" /> Sembunyikan
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <Eye className="h-3.5 w-3.5" /> Tampilkan
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Permanen
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
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Spesifikasi Visual</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Gunakan gambar dengan rasio 1200x400 (3:1) untuk hasil terbaik. Pastikan ukuran file di bawah 500KB untuk menjaga kecepatan loading halaman utama pengguna.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Eksperimen CTR</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Banner urutan pertama memiliki klik 40% lebih tinggi.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border">
              Lihat Laporan CTR
            </Button>
        </Card>
      </div>
    </div>
  );
}
