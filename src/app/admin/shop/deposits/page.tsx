
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ArrowDownCircle className="h-8 w-8 text-primary" /> Manajemen Deposit
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Pantau dan verifikasi pengisian saldo dompet digital pengguna.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 h-10 border-border">
            <Download className="h-4 w-4" /> Export Data
          </Button>
          <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2 h-10">
            <RefreshCcw className="h-4 w-4" /> Refresh Antrean
          </Button>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Deposit", value: "Rp 42.8M", icon: Wallet, color: "text-primary", trend: "+12.5%" },
          { label: "Antrean Pending", value: "14", icon: Clock, color: "text-amber-500", trend: "Action Req" },
          { label: "Deposit Sukses", value: "128", icon: CheckCircle2, color: "text-emerald-500", trend: "Hari ini" },
          { label: "Volume Growth", value: "8.4%", icon: TrendingUp, color: "text-blue-500", trend: "Bulan ini" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-black tabular-nums">{stat.value}</p>
                <div className="flex items-center gap-1">
                   <span className={cn("text-[10px] font-black", stat.trend === "Action Req" ? "text-amber-500" : "text-emerald-500")}>{stat.trend}</span>
                   {stat.trend !== "Hari ini" && stat.trend !== "Bulan ini" && stat.trend !== "Action Req" && <ArrowUpRight className="h-2.5 w-2.5 text-emerald-500" />}
                </div>
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
                <CardTitle className="text-lg font-black tracking-tight">Log Riwayat Deposit</CardTitle>
                <CardDescription className="text-xs font-bold">Daftar seluruh permintaan pengisian saldo masuk ke sistem.</CardDescription>
              </div>
              <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl overflow-x-auto no-scrollbar justify-start">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                  <TabsTrigger value="pending" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:text-amber-500">Menunggu</TabsTrigger>
                  <TabsTrigger value="success" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:text-emerald-500">Sukses</TabsTrigger>
                  <TabsTrigger value="failed" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:text-destructive">Gagal</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari ID Deposit / User..." 
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
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">ID Deposit & Tanggal</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">User / Pengirim</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Nominal Bersih</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Total Bayar</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Metode</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada data deposit ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeposits.map((deposit) => (
                    <TableRow key={deposit.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] font-black text-primary tracking-tight">{deposit.id}</span>
                          <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" /> {deposit.date}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-black truncate max-w-[120px]">{deposit.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-bold tabular-nums">Rp {deposit.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black tabular-nums text-foreground">Rp {deposit.total.toLocaleString()}</span>
                          {deposit.uniqueCode > 0 && (
                            <span className="text-[9px] text-primary font-black uppercase tracking-tighter">Unik: +{deposit.uniqueCode}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md border border-border/30">
                          {deposit.method}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        {getStatusBadge(deposit.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
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
          <div className="p-4 border-t border-border/30 bg-muted/5 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Menampilkan {filteredDeposits.length} transaksi deposit
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest px-4 border-border">Prev</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest px-4 border-border">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bento-card border-primary/20 bg-primary/5 p-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Audit Kode Unik</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Deposit via bank manual menggunakan sistem 3 digit kode unik di akhir nominal. Pastikan pengguna mentransfer nominal persis hingga digit terakhir untuk memudahkan verifikasi otomatis oleh bot mutasi.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Antrean Verifikasi</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Rata-rata waktu verifikasi manual saat ini: 8 menit.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border">
              Panduan Oksidasi Saldo
            </Button>
        </Card>
      </div>
    </div>
  );
}
