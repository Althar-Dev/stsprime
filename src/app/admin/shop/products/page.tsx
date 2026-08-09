
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" /> Manajemen Produk
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola katalog game, voucher, dan integrasi API provider.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus className="h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Katalog", value: "124", icon: Package, color: "text-primary" },
          { label: "Produk Aktif", value: "112", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Maintenance", value: "8", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Total Terjual", value: "14.2k", icon: Zap, color: "text-blue-500" },
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
                <CardTitle className="text-lg font-black tracking-tight">Katalog Layanan Digital</CardTitle>
                <CardDescription className="text-xs font-bold">Daftar seluruh produk yang tampil pada halaman utama pengguna.</CardDescription>
              </div>
              <Tabs defaultValue="all" onValueChange={setCategoryFilter} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl overflow-x-auto no-scrollbar justify-start">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                  <TabsTrigger value="game" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Topup Game</TabsTrigger>
                  <TabsTrigger value="voucher" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Voucher</TabsTrigger>
                  <TabsTrigger value="pulsa" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Pulsa/Data</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari Produk atau ID..." 
                  className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl h-10 border-border gap-2 font-black text-xs uppercase tracking-widest">
                <Filter className="h-4 w-4" /> Filter Lanjut
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Produk & ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Provider API</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Varian Item</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-center">Total Terjual</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada produk ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black">{product.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground font-bold">{product.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          {product.category === "Topup Game" ? <Gamepad2 className="h-3.5 w-3.5 text-primary" /> : <Ticket className="h-3.5 w-3.5 text-accent" />}
                          <span className="text-xs font-bold">{product.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          <Server className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-bold">{product.provider}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-black tabular-nums">{product.items} SKU</span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="text-xs font-black tabular-nums">{product.sales.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
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
          <div className="p-4 border-t border-border/30 bg-muted/5 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Menampilkan {filteredProducts.length} dari 124 produk
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest px-4 border-border">Prev</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest px-4 border-border">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
