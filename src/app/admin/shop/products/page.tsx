
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Power,
  Trash2,
  Gamepad2,
  Ticket,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server
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

const MOCK_PRODUCTS = [
  {
    id: "PRD-001",
    name: "Mobile Legends",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Active",
    items: 42,
    sales: 1240,
    image: "https://picsum.photos/seed/mlbb/100/100"
  },
  {
    id: "PRD-002",
    name: "Free Fire",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Active",
    items: 38,
    sales: 980,
    image: "https://picsum.photos/seed/ff/100/100"
  },
  {
    id: "PRD-003",
    name: "Valorant",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Active",
    items: 25,
    sales: 760,
    image: "https://picsum.photos/seed/valorant/100/100"
  },
  {
    id: "PRD-004",
    name: "Steam Wallet (IDR)",
    category: "Voucher",
    provider: "Orderkuota",
    status: "Active",
    items: 12,
    sales: 430,
    image: "https://picsum.photos/seed/steam/100/100"
  },
  {
    id: "PRD-005",
    name: "Spotify Premium",
    category: "Voucher",
    provider: "Internal",
    status: "Inactive",
    items: 5,
    sales: 120,
    image: "https://picsum.photos/seed/spotify/100/100"
  },
  {
    id: "PRD-006",
    name: "Genshin Impact",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Maintenance",
    items: 18,
    sales: 540,
    image: "https://picsum.photos/seed/genshin/100/100"
  },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</Badge>;
      case "Inactive":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><XCircle className="h-3 w-3 mr-1" /> Inactive</Badge>;
      case "Maintenance":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><AlertTriangle className="h-3 w-3 mr-1" /> Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Package className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Manajemen Produk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola katalog game, voucher, dan integrasi API provider.</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20 gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Total Katalog", value: "124", icon: Package, color: "text-primary" },
          { label: "Produk Aktif", value: "112", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Maintenance", value: "8", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Total Terjual", value: "14.2k", icon: Zap, color: "text-blue-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 flex items-center justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-2xl font-black tabular-nums truncate">{stat.value}</p>
              </div>
              <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-muted/30 flex items-center justify-center shrink-0">
                <stat.icon className={cn("h-4 w-4 sm:h-6 sm:w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
        <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-0.5">
                <CardTitle className="text-base sm:text-lg font-black tracking-tight">Katalog Layanan Digital</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs font-bold">Daftar seluruh produk yang tampil pada halaman utama pengguna.</CardDescription>
              </div>
              <div className="overflow-x-auto pb-1 sm:pb-0 w-full">
                <Tabs defaultValue="all" onValueChange={setCategoryFilter} className="w-full min-w-[320px]">
                  <TabsList className="bg-muted/40 p-1 rounded-xl w-full justify-start sm:justify-center">
                    <TabsTrigger value="all" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                    <TabsTrigger value="game" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg">Topup Game</TabsTrigger>
                    <TabsTrigger value="voucher" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg">Voucher</TabsTrigger>
                    <TabsTrigger value="pulsa" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg">Pulsa/Data</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Produk atau ID..."
                  className="pl-9 sm:pl-10 h-9 sm:h-10 bg-background border-border text-[11px] sm:text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl h-9 sm:h-10 border-border gap-2 font-black text-[11px] sm:text-xs uppercase tracking-widest shrink-0">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Filter Lanjut
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[850px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Produk & ID</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Kategori</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Provider API</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Varian Item</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12 text-center">Total Terjual</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      Tidak ada produk ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-black truncate">{product.name}</span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground font-bold">{product.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-1.5">
                          {product.category === "Topup Game" ? <Gamepad2 className="h-3.5 w-3.5 text-primary shrink-0" /> : <Ticket className="h-3.5 w-3.5 text-accent shrink-0" />}
                          <span className="text-xs font-bold">{product.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-1.5">
                          <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs font-bold">{product.provider}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <span className="text-xs font-black tabular-nums">{product.items} SKU</span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 text-center">
                        <span className="text-xs font-black tabular-nums">{product.sales.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Produk</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Detail & SKU
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Zap className="h-3.5 w-3.5 text-primary" /> Atur Markup Harga
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Power className="h-3.5 w-3.5 text-amber-500" /> Tandai Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Produk
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
          <div className="p-3 sm:p-4 border-t border-border/30 bg-muted/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center sm:text-left">
              Menampilkan {filteredProducts.length} dari 124 produk
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial h-8 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 border-border">Prev</Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial h-8 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 border-border">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
