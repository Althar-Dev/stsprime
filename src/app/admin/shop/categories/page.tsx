"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Gamepad2, 
  Smartphone, 
  Zap, 
  Ticket, 
  Wallet,
  Eye,
  EyeOff,
  LayoutGrid,
  ArrowUpDown,
  CheckCircle2
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

const MOCK_CATEGORIES = [
  {
    id: "CAT-001",
    name: "Topup Game",
    slug: "topup-game",
    icon: Gamepad2,
    itemCount: 86,
    status: "Active",
    order: 1,
    color: "text-primary"
  },
  {
    id: "CAT-002",
    name: "Pulsa & Data",
    slug: "pulsa-data",
    icon: Smartphone,
    itemCount: 124,
    status: "Active",
    order: 2,
    color: "text-blue-500"
  },
  {
    id: "CAT-003",
    name: "Voucher Digital",
    slug: "voucher",
    icon: Ticket,
    itemCount: 42,
    status: "Active",
    order: 3,
    color: "text-amber-500"
  },
  {
    id: "CAT-004",
    name: "E-Wallet",
    slug: "e-wallet",
    icon: Wallet,
    itemCount: 15,
    status: "Active",
    order: 4,
    color: "text-emerald-500"
  },
  {
    id: "CAT-005",
    name: "Token Listrik",
    slug: "pln",
    icon: Zap,
    itemCount: 8,
    status: "Inactive",
    order: 5,
    color: "text-yellow-500"
  },
];

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = MOCK_CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Visible</Badge>;
      case "Inactive":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Hidden</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" /> Manajemen Kategori
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola pengelompokan layanan, ikon menu, dan struktur navigasi pengguna.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus className="h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Kategori", value: "12", icon: LayoutGrid, color: "text-primary" },
          { label: "Kategori Aktif", value: "8", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Produk/Kategori", value: "~42 SKU", icon: Layers, color: "text-blue-500" },
          { label: "Draft/Arsip", value: "4", icon: EyeOff, color: "text-amber-500" },
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
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black tracking-tight">Katalog Struktur Layanan</CardTitle>
              <CardDescription className="text-xs font-bold">Atur hierarki dan prioritas tampilan kategori di halaman utama.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama kategori..." 
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
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">URL Slug</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-center">Urutan</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Jumlah SKU</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada kategori ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border border-border/50 bg-background transition-transform group-hover:scale-110")}>
                            <cat.icon className={cn("h-5 w-5", cat.color)} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tight">{cat.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase">{cat.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <code className="text-[10px] font-bold bg-muted/50 px-2 py-1 rounded border border-border/50 text-muted-foreground">/{cat.slug}</code>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs font-black tabular-nums">{cat.order}</span>
                          <div className="flex flex-col">
                            <button className="text-muted-foreground hover:text-primary"><ArrowUpDown className="h-3 w-3" /></button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-black tabular-nums">{cat.itemCount} Produk</span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(cat.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Kategori</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Nama & Slug
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <LayoutGrid className="h-3.5 w-3.5 text-primary" /> Ganti Ikon
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {cat.status === "Active" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <EyeOff className="h-3.5 w-3.5" /> Sembunyikan (Draft)
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <Eye className="h-3.5 w-3.5" /> Tampilkan (Publish)
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Kategori
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
              <h3 className="font-black text-sm uppercase tracking-wider">Navigasi Dinamis</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Kategori yang berstatus "Visible" akan otomatis muncul di filter navigasi halaman utama. Urutan tampilan (Order) menentukan posisi tab dari kiri ke kanan. Gunakan ikon yang kontras untuk memudahkan pemindaian visual bagi pengguna.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Pemetaan Produk</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Terdapat 14 produk yang belum memiliki kategori induk.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border">
              Audit Produk Yatim
            </Button>
        </Card>
      </div>
    </div>
  );
}
