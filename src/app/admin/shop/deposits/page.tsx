
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownCircle,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Wallet,
  TrendingUp,
  Download,
  Calendar,
  User,
  ArrowUpRight,
  ShieldCheck,
  RefreshCcw
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

const MOCK_DEPOSITS = [
  {
    id: "DEP-98211",
    user: "GamerPro99",
    amount: 50000,
    uniqueCode: 421,
    total: 50421,
    method: "Bank BCA (Manual)",
    status: "Pending",
    date: "12 Agu 2026, 16:20",
  },
  {
    id: "DEP-98210",
    user: "SultanFF",
    amount: 250000,
    uniqueCode: 0,
    total: 250000,
    method: "QRIS (Auto)",
    status: "Success",
    date: "12 Agu 2026, 15:45",
  },
  {
    id: "DEP-98209",
    user: "MobileBoy",
    amount: 100000,
    uniqueCode: 105,
    total: 100105,
    method: "Bank Mandiri",
    status: "Success",
    date: "12 Agu 2026, 14:10",
  },
  {
    id: "DEP-98208",
    user: "RiotGamer",
    amount: 15000,
    uniqueCode: 88,
    total: 15088,
    method: "DANA",
    status: "Failed",
    date: "12 Agu 2026, 11:30",
  },
  {
    id: "DEP-98207",
    user: "PrimogemLover",
    amount: 500000,
    uniqueCode: 0,
    total: 500000,
    method: "Virtual Account BRI",
    status: "Success",
    date: "11 Agu 2026, 22:15",
  },
];

export default function AdminDepositsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDeposits = MOCK_DEPOSITS.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3 mr-1" /> Success</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md animate-pulse"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
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
            <ArrowDownCircle className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Deposit Saldo Member
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Monitor antrean deposit, mutasi bank manual, dan gateway otomatis.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export Data
          </Button>
          <Button className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-10">
            <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Refresh Antrean
          </Button>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Total Deposit", value: "Rp 42.8M", icon: Wallet, color: "text-primary", trend: "+12.5%" },
          { label: "Antrean Pending", value: "14", icon: Clock, color: "text-amber-500", trend: "Action Req" },
          { label: "Deposit Sukses", value: "128", icon: CheckCircle2, color: "text-emerald-500", trend: "Hari ini" },
          { label: "Volume Growth", value: "8.4%", icon: TrendingUp, color: "text-blue-500", trend: "Bulan ini" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 flex items-center justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-2xl font-black tabular-nums truncate">{stat.value}</p>
                <div className="flex items-center gap-1 truncate">
                  <span className={cn("text-[9px] sm:text-[10px] font-black truncate", stat.trend === "Action Req" ? "text-amber-500" : "text-emerald-500")}>{stat.trend}</span>
                  {stat.trend !== "Hari ini" && stat.trend !== "Bulan ini" && stat.trend !== "Action Req" && <ArrowUpRight className="h-2.5 w-2.5 text-emerald-500 shrink-0" />}
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
                <CardTitle className="text-base sm:text-lg font-black tracking-tight">Log Riwayat Deposit</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs font-bold">Daftar seluruh permintaan pengisian saldo masuk ke sistem.</CardDescription>
              </div>
              <div className="overflow-x-auto pb-1 sm:pb-0 w-full">
                <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full min-w-[320px]">
                  <TabsList className="bg-muted/40 p-1 rounded-xl w-full justify-start sm:justify-center">
                    <TabsTrigger value="all" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                    <TabsTrigger value="pending" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-amber-500">Menunggu</TabsTrigger>
                    <TabsTrigger value="success" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-emerald-500">Sukses</TabsTrigger>
                    <TabsTrigger value="failed" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-destructive">Gagal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari ID Deposit / User..."
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
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">ID Deposit & Tanggal</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">User / Pengirim</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Nominal Bersih</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Total Bayar</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Metode</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12 text-center">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      Tidak ada data deposit ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeposits.map((deposit) => (
                    <TableRow key={deposit.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] sm:text-[11px] font-black text-primary tracking-tight">{deposit.id}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 shrink-0" /> {deposit.date}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-black truncate max-w-[120px]">{deposit.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <span className="text-xs font-bold tabular-nums">Rp {deposit.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black tabular-nums text-foreground">Rp {deposit.total.toLocaleString()}</span>
                          {deposit.uniqueCode > 0 && (
                            <span className="text-[9px] text-primary font-black uppercase tracking-tighter">Unik: +{deposit.uniqueCode}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md border border-border/30">
                          {deposit.method}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 text-center">
                        {getStatusBadge(deposit.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Deposit</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <ArrowUpRight className="h-3.5 w-3.5" /> Lihat Bukti Bayar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {deposit.status === "Pending" && (
                              <>
                                <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Konfirmasi Lunas
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive">
                                  <XCircle className="h-3.5 w-3.5" /> Batalkan Deposit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Cek Mutasi Bank
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
              Menampilkan {filteredDeposits.length} transaksi deposit
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
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Audit Kode Unik</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold leading-relaxed">
                Deposit via bank manual menggunakan sistem 3 digit kode unik di akhir nominal. Pastikan pengguna mentransfer nominal persis hingga digit terakhir untuk memudahkan verifikasi otomatis oleh bot mutasi.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Antrean Verifikasi</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-bold italic">Rata-rata waktu verifikasi manual saat ini: 8 menit.</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border shrink-0">
            Panduan Oksidasi Saldo
          </Button>
        </Card>
      </div>
    </div>
  );
}
