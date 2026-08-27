
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpCircle,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Download,
  Calendar,
  User,
  RefreshCcw,
  Banknote,
  Send
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

const MOCK_WITHDRAWALS = [
  {
    id: "WD-98211",
    user: "GamerPro99",
    amount: 150000,
    fee: 4500,
    total: 145500,
    method: "Bank BCA",
    target: "8821931211",
    status: "Pending",
    date: "12 Agu 2026, 16:20",
  },
  {
    id: "WD-98210",
    user: "SultanFF",
    amount: 2500000,
    fee: 0,
    total: 2500000,
    method: "DANA",
    target: "081234567890",
    status: "Success",
    date: "12 Agu 2026, 15:45",
  },
  {
    id: "WD-98209",
    user: "MobileBoy",
    amount: 50000,
    fee: 4500,
    total: 45500,
    method: "Bank Mandiri",
    target: "1249912123",
    status: "Success",
    date: "12 Agu 2026, 14:10",
  },
  {
    id: "WD-98208",
    user: "RiotGamer",
    amount: 100000,
    fee: 1000,
    total: 99000,
    method: "GoPay",
    target: "08991234123",
    status: "Failed",
    date: "12 Agu 2026, 11:30",
  },
  {
    id: "WD-98207",
    user: "PrimogemLover",
    amount: 500000,
    fee: 4500,
    total: 495500,
    method: "Bank BRI",
    target: "001201992131",
    status: "Processing",
    date: "11 Agu 2026, 22:15",
  },
];

export default function AdminWithdrawalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredWithdrawals = MOCK_WITHDRAWALS.filter(w => {
    const matchesSearch = w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3 mr-1" /> Success</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md animate-pulse"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><Send className="h-3 w-3 mr-1" /> Processing</Badge>;
      case "Failed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <ArrowUpCircle className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Penarikan Saldo (WD)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola pencairan dana member ke rekening bank & e-wallet.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export Laporan
          </Button>
          <Button className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-10">
            <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Refresh Antrean
          </Button>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Dana Keluar", value: "Rp 12.8M", icon: Banknote, color: "text-primary", trend: "Bulan ini" },
          { label: "Antrean Pending", value: "6 Request", icon: Clock, color: "text-amber-500", trend: "Action Req" },
          { label: "Sedang Diproses", value: "Rp 1.2M", icon: Send, color: "text-blue-500", trend: "On delivery" },
          { label: "SLA Penyelesaian", value: "14 Menit", icon: ShieldCheck, color: "text-emerald-500", trend: "Sangat Cepat" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 flex items-center justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-2xl font-black tabular-nums truncate">{stat.value}</p>
                <div className="flex items-center gap-1 truncate">
                  <span className={cn("text-[9px] sm:text-[10px] font-black truncate", stat.color)}>{stat.trend}</span>
                </div>
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
                <CardTitle className="text-base sm:text-lg font-black tracking-tight">Daftar Permintaan Penarikan</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs font-bold">Monitor arus kas keluar dan status transfer ke pengguna.</CardDescription>
              </div>
              <div className="overflow-x-auto pb-1 sm:pb-0 w-full">
                <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full min-w-[320px]">
                  <TabsList className="bg-muted/40 p-1 rounded-xl w-full justify-start sm:justify-center">
                    <TabsTrigger value="all" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                    <TabsTrigger value="pending" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-amber-500">Menunggu</TabsTrigger>
                    <TabsTrigger value="processing" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-blue-500">Diproses</TabsTrigger>
                    <TabsTrigger value="success" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-emerald-500">Berhasil</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari ID WD, User, atau Rekening..."
                  className="pl-9 sm:pl-10 h-9 sm:h-10 bg-background border-border text-[11px] sm:text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl h-9 sm:h-10 border-border gap-2 font-black text-[11px] sm:text-xs uppercase tracking-widest shrink-0">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[850px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">ID WD & Tanggal</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">User / Pengirim</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Detail Rekening</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Nominal</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Total Cair</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12 text-center">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      Tidak ada data penarikan ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWithdrawals.map((wd) => (
                    <TableRow key={wd.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] sm:text-[11px] font-black text-primary tracking-tight">{wd.id}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 shrink-0" /> {wd.date}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-black truncate max-w-[120px]">{wd.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{wd.method}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono font-bold">{wd.target}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold tabular-nums">Rp {wd.amount.toLocaleString()}</span>
                          {wd.fee > 0 && <span className="text-[9px] text-destructive font-bold">Biaya: -Rp {wd.fee.toLocaleString()}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <span className="text-xs sm:text-sm font-black tabular-nums text-primary">Rp {wd.total.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 text-center">
                        {getStatusBadge(wd.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Penarikan</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <ArrowUpRight className="h-3.5 w-3.5" /> Lihat Detail User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {wd.status === "Pending" && (
                              <>
                                <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-blue-500">
                                  <Send className="h-3.5 w-3.5" /> Tandai Diproses
                                </DropdownMenuItem>
                              </>
                            )}
                            {(wd.status === "Pending" || wd.status === "Processing") && (
                              <>
                                <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Konfirmasi Berhasil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive">
                                  <XCircle className="h-3.5 w-3.5" /> Batalkan (Refund Saldo)
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Audit Keamanan Akun
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
              Menampilkan {filteredWithdrawals.length} permintaan penarikan
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial h-8 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 border-border">Prev</Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial h-8 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 border-border">Next</Button>
            </div>
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
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Keamanan Transaksi</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold leading-relaxed">
                Setiap penarikan di atas Rp 1.000.000 memerlukan verifikasi manual dua langkah. Pastikan nama pemilik rekening tujuan sesuai dengan nama yang terdaftar di profil pengguna untuk mencegah penyalahgunaan akun.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Performa Pencairan</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-bold italic">85% penarikan hari ini berhasil diselesaikan dalam waktu kurang dari 15 menit.</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border shrink-0">
            Lihat Grafik SLA
          </Button>
        </Card>
      </div>
    </div>
  );
}
