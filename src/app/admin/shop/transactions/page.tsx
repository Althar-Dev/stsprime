
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  CreditCard,
  Download,
  Calendar,
  Gamepad2,
  TrendingUp,
  ArrowUpRight
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

const MOCK_TRANSACTIONS = [
  {
    id: "STS-9821-X",
    user: "GamerPro99",
    product: "Mobile Legends",
    item: "172 Diamonds",
    amount: 38000,
    method: "QRIS",
    status: "Success",
    date: "12 Agu 2026, 14:20",
    target: "12345678 (2012)"
  },
  {
    id: "STS-9822-Y",
    user: "SultanFF",
    product: "Free Fire",
    item: "720 Diamonds",
    amount: 51500,
    method: "DANA",
    status: "Processing",
    date: "12 Agu 2026, 14:15",
    target: "981273912"
  },
  {
    id: "STS-9823-Z",
    user: "RiotGamer",
    product: "Valorant",
    item: "1250 Points",
    amount: 150000,
    method: "GoPay",
    status: "Pending",
    date: "12 Agu 2026, 14:05",
    target: "User#RIOTT"
  },
  {
    id: "STS-9824-W",
    user: "PrimogemLover",
    product: "Genshin Impact",
    item: "300 Crystals",
    amount: 79000,
    method: "ShopeePay",
    status: "Failed",
    date: "12 Agu 2026, 13:50",
    target: "UID: 8212132"
  },
  {
    id: "STS-9825-Q",
    user: "MobileBoy",
    product: "Mobile Legends",
    item: "86 Diamonds",
    amount: 19500,
    method: "QRIS",
    status: "Success",
    date: "12 Agu 2026, 13:42",
    target: "87212391 (2211)"
  },
];

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3 mr-1" /> Success</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md animate-pulse"><Clock className="h-3 w-3 mr-1" /> Processing</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
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
            <ShoppingBag className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Riwayat Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Audit dan pantau seluruh pergerakan kas masuk dari member.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export CSV
          </Button>
          <Button className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Volume Hari Ini", value: "156", icon: ShoppingBag, color: "text-primary", trend: "+12%" },
          { label: "Transaksi Sukses", value: "142", icon: CheckCircle2, color: "text-emerald-500", trend: "91%" },
          { label: "Pending/Proses", value: "14", icon: Clock, color: "text-amber-500", trend: "Action Req" },
          { label: "Gross Revenue", value: "Rp 14.2M", icon: TrendingUp, color: "text-blue-500", trend: "Today" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 flex items-center justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-2xl font-black tabular-nums truncate">{stat.value}</p>
                <p className="text-[9px] font-bold text-muted-foreground/60 truncate">{stat.trend}</p>
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
                <CardTitle className="text-base sm:text-lg font-black tracking-tight">Log Transaksi Real-time</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs font-bold">Menampilkan seluruh riwayat pembelian produk digital.</CardDescription>
              </div>
              <div className="overflow-x-auto pb-1 sm:pb-0 w-full">
                <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full min-w-[340px]">
                  <TabsList className="bg-muted/40 p-1 rounded-xl w-full justify-start sm:justify-center">
                    <TabsTrigger value="all" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                    <TabsTrigger value="success" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-emerald-500">Sukses</TabsTrigger>
                    <TabsTrigger value="processing" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-blue-500">Proses</TabsTrigger>
                    <TabsTrigger value="pending" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-amber-500">Pending</TabsTrigger>
                    <TabsTrigger value="failed" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:text-destructive">Gagal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Order ID / User..."
                  className="pl-9 sm:pl-10 h-9 sm:h-10 bg-background border-border text-[11px] sm:text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl h-9 sm:h-10 border-border gap-2 font-black text-[11px] sm:text-xs uppercase tracking-widest shrink-0">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Filter Tanggal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[850px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Order ID & Tanggal</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">User & Target</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Produk & Item</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Total Bayar</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      Tidak ada transaksi ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] sm:text-[11px] font-black text-primary tracking-tight">{tx.id}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 shrink-0" /> {tx.date}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-black truncate">{tx.user}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold bg-muted/40 px-1.5 py-0.5 rounded-md mt-0.5 sm:mt-1 w-fit">
                            Target: {tx.target}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black truncate">{tx.product}</span>
                            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold truncate">{tx.item}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-black tabular-nums">Rp {tx.amount.toLocaleString()}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                            <CreditCard className="h-2.5 w-2.5 shrink-0" /> {tx.method}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        {getStatusBadge(tx.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Pesanan</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <ArrowUpRight className="h-3.5 w-3.5" /> Lihat Detail Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Selesaikan Manual
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Clock className="h-3.5 w-3.5 text-blue-500" /> Tandai Sedang Proses
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <XCircle className="h-3.5 w-3.5" /> Batalkan & Refund
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
              Menampilkan {filteredTransactions.length} dari 1,280 transaksi
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial h-8 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 border-border">Previous</Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial h-8 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 border-border">Next Page</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
