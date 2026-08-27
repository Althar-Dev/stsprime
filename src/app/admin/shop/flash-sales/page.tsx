
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  Gamepad2,
  TrendingUp,
  CheckCircle2,
  Timer,
  AlertCircle,
  PauseCircle,
  PlayCircle
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

const MOCK_FLASH_SALES = [
  {
    id: "FS-001",
    product: "Mobile Legends",
    item: "172 Diamonds",
    discount: 30,
    originalPrice: 38000,
    salePrice: 26600,
    sold: 92,
    limit: 100,
    status: "Running",
    expiry: "2 Jam 40 Menit",
    image: "https://picsum.photos/seed/mlbb/100/100"
  },
  {
    id: "FS-002",
    product: "Free Fire",
    item: "720 Diamonds",
    discount: 50,
    originalPrice: 51500,
    salePrice: 25750,
    sold: 45,
    limit: 50,
    status: "Running",
    expiry: "1 Jam 15 Menit",
    image: "https://picsum.photos/seed/ff/100/100"
  },
  {
    id: "FS-003",
    product: "Valorant",
    item: "1250 Points",
    discount: 20,
    originalPrice: 150000,
    salePrice: 120000,
    sold: 12,
    limit: 30,
    status: "Scheduled",
    expiry: "Mulai 14:00",
    image: "https://picsum.photos/seed/valorant/100/100"
  },
  {
    id: "FS-004",
    product: "Steam Wallet (IDR)",
    item: "Rp 100.000",
    discount: 15,
    originalPrice: 100000,
    salePrice: 85000,
    sold: 100,
    limit: 100,
    status: "Ended",
    expiry: "Berakhir",
    image: "https://picsum.photos/seed/steam/100/100"
  },
  {
    id: "FS-005",
    product: "Genshin Impact",
    item: "300 Crystals",
    discount: 10,
    originalPrice: 79000,
    salePrice: 71100,
    sold: 8,
    limit: 20,
    status: "Running",
    expiry: "5 Jam 20 Menit",
    image: "https://picsum.photos/seed/genshin/100/100"
  },
];

export default function AdminFlashSalesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSales = MOCK_FLASH_SALES.filter(s =>
    s.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md animate-pulse">Running</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Scheduled</Badge>;
      case "Ended":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Zap className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0 animate-pulse" /> Flash Sales
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola promo kilat berdurasi terbatas dan pantau stok kuota.</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20 gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Tambah Item Flash Sale
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Event Berjalan", value: "3", icon: Timer, color: "text-primary" },
          { label: "Produk Kilat", value: "12", icon: Gamepad2, color: "text-blue-500" },
          { label: "Rata-rata Terjual", value: "68%", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Sisa Waktu Global", value: "02:14:55", icon: Clock, color: "text-amber-500" },
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
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Daftar Penjualan Kilat</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Monitor progress stok dan efektivitas diskon event.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk Flash Sale..."
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
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[850px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Produk & Item</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Diskon</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Harga Sale</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Progress Stok</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Sisa Waktu / Jadwal</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12 text-center">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      Tidak ada event flash sale ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50">
                            <img src={sale.image} alt={sale.product} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-black truncate">{sale.product}</span>
                            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold truncate">{sale.item}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded">
                          -{sale.discount}%
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-black tabular-nums text-primary">Rp {sale.salePrice.toLocaleString()}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold line-through">Rp {sale.originalPrice.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col gap-1 w-28 sm:w-32">
                          <div className="flex justify-between text-[9px] font-black uppercase">
                            <span>{sale.sold} / {sale.limit}</span>
                            <span>{Math.round((sale.sold / sale.limit) * 100)}%</span>
                          </div>
                          <Progress value={(sale.sold / sale.limit) * 100} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {sale.expiry}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 text-center">
                        {getStatusBadge(sale.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Flash Sale</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Harga & Kuota
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Timer className="h-3.5 w-3.5 text-primary" /> Perpanjang Durasi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {sale.status === "Running" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <PauseCircle className="h-3.5 w-3.5" /> Berhentikan Paksa
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <PlayCircle className="h-3.5 w-3.5" /> Jalankan Sekarang
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Promo
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        <Card className="bento-card border-primary/20 bg-primary/5 p-4 sm:p-6">
          <div className="flex gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Tips Manajemen</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold leading-relaxed">
                Flash Sale dengan diskon di atas 30% terbukti meningkatkan volume transaksi hingga 2.5x lipat. Gunakan kuota terbatas (limit) untuk menciptakan efek urgensi bagi pengguna.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Jadwal Event Berikutnya</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-bold italic">Mega Flash Sale - 17 Agu 2026, 00:00 WIB</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border shrink-0">
            Lihat Kalender
          </Button>
        </Card>
      </div>
    </div>
  );
}
