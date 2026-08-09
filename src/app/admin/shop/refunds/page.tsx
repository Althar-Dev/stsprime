
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Undo2, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  CreditCard,
  ArrowUpRight,
  ShieldAlert,
  TrendingDown,
  History
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

const MOCK_REFUNDS = [
  {
    id: "RFD-0012",
    orderId: "STS-9821-X",
    user: "GamerPro99",
    amount: 38000,
    reason: "Salah Game ID (User Salah Input)",
    method: "QRIS",
    status: "Pending",
    date: "12 Agu 2026, 15:45",
  },
  {
    id: "RFD-0011",
    orderId: "STS-9805-A",
    user: "SultanFF",
    amount: 51500,
    reason: "Produk Out of Stock (API Provider)",
    method: "DANA",
    status: "Approved",
    date: "12 Agu 2026, 10:20",
  },
  {
    id: "RFD-0010",
    orderId: "STS-9788-B",
    user: "MobileBoy",
    amount: 19500,
    reason: "Double Payment terdeteksi",
    method: "QRIS",
    status: "Rejected",
    date: "11 Agu 2026, 14:15",
  },
  {
    id: "RFD-0009",
    orderId: "STS-9750-Z",
    user: "RiotGamer",
    amount: 150000,
    reason: "Transaksi Gagal tapi Saldo Terpotong",
    method: "GoPay",
    status: "Approved",
    date: "10 Agu 2026, 09:30",
  },
];

export default function AdminRefundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRefunds = MOCK_REFUNDS.filter(r => {
    const matchesSearch = r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "Pending":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md animate-pulse"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Undo2 className="h-8 w-8 text-primary" /> Manajemen Refund
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Audit dan eksekusi permohonan pengembalian dana pelanggan.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20">
            Refresh Antrean
          </Button>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Refund", value: "Rp 2.45M", icon: Undo2, color: "text-primary", trend: "Bulan ini" },
          { label: "Antrean Pending", value: "8", icon: Clock, color: "text-blue-500", trend: "Butuh Persetujuan" },
          { label: "Refund Rate", value: "0.82%", icon: TrendingDown, color: "text-amber-500", trend: "Sehat" },
          { label: "Diselamatkan", value: "Rp 420k", icon: CheckCircle2, color: "text-emerald-500", trend: "Refund Ditolak" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-black tabular-nums">{stat.value}</p>
                <p className="text-[9px] font-bold text-muted-foreground/60">{stat.trend}</p>
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
                <CardTitle className="text-lg font-black tracking-tight">Antrean Permohonan Refund</CardTitle>
                <CardDescription className="text-xs font-bold">Daftar transaksi yang diajukan untuk pembatalan dan pengembalian dana.</CardDescription>
              </div>
              <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                  <TabsTrigger value="pending" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:text-blue-500">Menunggu</TabsTrigger>
                  <TabsTrigger value="approved" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:text-emerald-500">Disetujui</TabsTrigger>
                  <TabsTrigger value="rejected" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:text-destructive">Ditolak</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari ID Refund / Order..." 
                  className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl h-10 border-border gap-2 font-black text-xs uppercase tracking-widest">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">ID Refund & Tanggal</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Order ID & User</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Nominal</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Alasan Pengajuan</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada permohonan refund ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRefunds.map((refund) => (
                    <TableRow key={refund.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] font-black text-primary tracking-tight">{refund.id}</span>
                          <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                            {refund.date}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[11px] font-bold text-foreground">{refund.orderId}</span>
                          <span className="text-[10px] text-muted-foreground font-black mt-1 uppercase tracking-tighter">
                            User: {refund.user}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black tabular-nums">Rp {refund.amount.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                            <CreditCard className="h-2.5 w-2.5" /> {refund.method}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-[10px] font-bold text-muted-foreground leading-tight">{refund.reason}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(refund.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Refund</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <ArrowUpRight className="h-3.5 w-3.5" /> Lihat Detail Transaksi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Setujui Refund
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <XCircle className="h-3.5 w-3.5" /> Tolak Pengajuan
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <History className="h-3.5 w-3.5" /> Chat dengan User
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
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Kebijakan Pengembalian</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Refund hanya diperbolehkan untuk kegagalan sistem pada sisi provider atau kesalahan input nominal yang belum terproses. Permohonan refund atas kesalahan User ID setelah item terkirim akan ditolak secara otomatis sesuai syarat dan ketentuan.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">SLA Penyelesaian</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Rata-rata waktu persetujuan refund saat ini: 14 menit.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border">
              Lihat Laporan SLA
            </Button>
        </Card>
      </div>
    </div>
  );
}
