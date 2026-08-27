
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  Percent,
  Coins
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

const MOCK_VOUCHERS = [
  {
    id: "VOC-001",
    code: "STSMERDEKA",
    type: "Percentage",
    value: 10,
    minPurchase: 50000,
    maxDiscount: 15000,
    limit: 500,
    used: 420,
    expiry: "17 Agu 2026",
    status: "Active"
  },
  {
    id: "VOC-002",
    code: "NEWUSERPROMO",
    type: "Fixed",
    value: 5000,
    minPurchase: 20000,
    maxDiscount: 5000,
    limit: 1000,
    used: 856,
    expiry: "31 Des 2026",
    status: "Active"
  },
  {
    id: "VOC-003",
    code: "WEEKENDTOPUP",
    type: "Percentage",
    value: 5,
    minPurchase: 100000,
    maxDiscount: 25000,
    limit: 200,
    used: 200,
    expiry: "12 Agu 2026",
    status: "Exhausted"
  },
  {
    id: "VOC-004",
    code: "COINFLASH",
    type: "Percentage",
    value: 15,
    minPurchase: 150000,
    maxDiscount: 50000,
    limit: 50,
    used: 12,
    expiry: "10 Agu 2026",
    status: "Expired"
  },
  {
    id: "VOC-005",
    code: "VALORANTDAY",
    type: "Fixed",
    value: 10000,
    minPurchase: 150000,
    maxDiscount: 10000,
    limit: 100,
    used: 45,
    expiry: "25 Agu 2026",
    status: "Active"
  },
];

export default function AdminVouchersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVouchers = MOCK_VOUCHERS.filter(v =>
    v.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
      case "Exhausted":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Exhausted</Badge>;
      case "Expired":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Ticket className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Manajemen Voucher & Promo
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola kode diskon, kuota klaim, dan masa berlaku promo toko.</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20 gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Buat Voucher Baru
        </Button>
      </div>

      {/* Quick Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Total Kode", value: "24", icon: Ticket, color: "text-primary" },
          { label: "Voucher Aktif", value: "12", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Total Digunakan", value: "1,542", icon: TrendingUp, color: "text-blue-500" },
          { label: "Total Hemat", value: "Rp 12.4M", icon: Coins, color: "text-amber-500" },
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
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Katalog Promo</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Daftar seluruh voucher yang aktif dan riwayat promo.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Kode Voucher..."
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
            <Table className="min-w-[800px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Kode & Tipe</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Potongan</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Min. Belanja</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Penggunaan</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Masa Berlaku</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12 text-center">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      Tidak ada voucher ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <TableRow key={voucher.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            {voucher.type === "Percentage" ? <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> : <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-black font-mono tracking-wider truncate">{voucher.code}</span>
                            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold">{voucher.type === "Percentage" ? "Persentase" : "Potongan Tetap"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <span className="text-xs sm:text-sm font-black">
                          {voucher.type === "Percentage" ? `${voucher.value}%` : `Rp ${voucher.value.toLocaleString()}`}
                        </span>
                        {voucher.type === "Percentage" && (
                          <p className="text-[9px] text-muted-foreground font-bold">Maks. Rp {voucher.maxDiscount.toLocaleString()}</p>
                        )}
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <span className="text-xs font-bold">Rp {voucher.minPurchase.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col gap-1 w-28 sm:w-32">
                          <div className="flex justify-between text-[9px] font-black uppercase">
                            <span>{voucher.used} / {voucher.limit}</span>
                            <span>{Math.round((voucher.used / voucher.limit) * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-500",
                                voucher.used >= voucher.limit ? "bg-amber-500" : "bg-primary"
                              )}
                              style={{ width: `${(voucher.used / voucher.limit) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {voucher.expiry}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 text-center">
                        {getStatusBadge(voucher.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Voucher</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Voucher
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2" onClick={() => {
                              navigator.clipboard.writeText(voucher.code);
                            }}>
                              <Copy className="h-3.5 w-3.5 text-blue-500" /> Salin Kode
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Voucher
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
    </div>
  );
}
