
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Gamepad2,
  CreditCard,
  Layers,
  Upload,
  RefreshCw
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

const MOCK_ICONS = [
  {
    id: "ICO-001",
    name: "Mobile Legends",
    category: "Game",
    imageUrl: "https://picsum.photos/seed/mlbb/100/100",
    status: "Active",
    usage: 42,
    updatedAt: "12 Agu 2026"
  },
  {
    id: "ICO-002",
    name: "Free Fire",
    category: "Game",
    imageUrl: "https://picsum.photos/seed/ff/100/100",
    status: "Active",
    usage: 38,
    updatedAt: "12 Agu 2026"
  },
  {
    id: "ICO-003",
    name: "QRIS Payment",
    category: "Payment",
    imageUrl: "https://picsum.photos/seed/qris/100/100",
    status: "Active",
    usage: 124,
    updatedAt: "10 Agu 2026"
  },
  {
    id: "ICO-004",
    name: "Steam Wallet",
    category: "Game",
    imageUrl: "https://picsum.photos/seed/steam/100/100",
    status: "Active",
    usage: 15,
    updatedAt: "11 Agu 2026"
  },
  {
    id: "ICO-005",
    name: "Dana E-Wallet",
    category: "Payment",
    imageUrl: "https://picsum.photos/seed/dana/100/100",
    status: "Active",
    usage: 86,
    updatedAt: "08 Agu 2026"
  },
  {
    id: "ICO-006",
    name: "General Voucher",
    category: "Service",
    imageUrl: "https://picsum.photos/seed/voucher/100/100",
    status: "Inactive",
    usage: 0,
    updatedAt: "01 Agu 2026"
  },
];

export default function AdminIconsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredIcons = MOCK_ICONS.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || icon.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
      case "Inactive":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Grid3X3 className="h-8 w-8 text-primary" /> Manajemen Ikon
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola pustaka aset visual untuk kategori game, metode pembayaran, dan layanan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2">
            <RefreshCw className="h-4 w-4" /> Sinkron Aset
          </Button>
          <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
            <Plus className="h-4 w-4" /> Upload Ikon
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Ikon", value: "148", icon: ImageIcon, color: "text-primary" },
          { label: "Ikon Game", value: "92", icon: Gamepad2, color: "text-blue-500" },
          { label: "Ikon Pembayaran", value: "34", icon: CreditCard, color: "text-emerald-500" },
          { label: "Tak Digunakan", value: "12", icon: XCircle, color: "text-amber-500" },
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
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black tracking-tight">Koleksi Aset Ikon</CardTitle>
                <CardDescription className="text-xs font-bold">Daftar seluruh ikon sistem untuk klasifikasi layanan digital.</CardDescription>
              </div>
              <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl overflow-x-auto no-scrollbar justify-start">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                  <TabsTrigger value="game" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Game</TabsTrigger>
                  <TabsTrigger value="payment" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Pembayaran</TabsTrigger>
                  <TabsTrigger value="service" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Layanan</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama ikon..." 
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
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Ikon & Nama</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Digunakan Pada</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Terakhir Update</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIcons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada ikon ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIcons.map((icon) => (
                    <TableRow key={icon.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/50 shrink-0 bg-muted flex items-center justify-center p-1">
                            <Image 
                              src={icon.imageUrl} 
                              alt={icon.name} 
                              fill 
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black truncate">{icon.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase">{icon.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          {icon.category === "Game" && <Gamepad2 className="h-3.5 w-3.5 text-primary" />}
                          {icon.category === "Payment" && <CreditCard className="h-3.5 w-3.5 text-blue-500" />}
                          {icon.category === "Service" && <Layers className="h-3.5 w-3.5 text-amber-500" />}
                          <span className="text-xs font-bold">{icon.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(icon.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-black tabular-nums">{icon.usage} Produk</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-bold text-muted-foreground">{icon.updatedAt}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Aset</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Nama & Kategori
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Upload className="h-3.5 w-3.5 text-primary" /> Ganti File Gambar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {icon.status === "Active" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <XCircle className="h-3.5 w-3.5" /> Nonaktifkan
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Aktifkan Kembali
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
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Panduan Upload Ikon</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Gunakan format PNG transparan atau WebP dengan dimensi minimal 200x200 px. Ikon dengan latar belakang transparan memberikan hasil visual terbaik pada daftar produk pengguna.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Pembersihan Aset</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Terdapat 8 ikon yang tidak terhubung ke produk manapun.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border text-destructive hover:bg-destructive/10">
              Hapus Aset Yatim
            </Button>
        </Card>
      </div>
    </div>
  );
}
