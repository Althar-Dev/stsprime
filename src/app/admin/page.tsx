
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserCheck,
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const STATS = [
  { label: "Total Pengguna", value: "1,284", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Transaksi Hari Ini", value: "156", icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pendapatan (Bln)", value: "Rp 12.4M", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Antrean Pesanan", value: "8", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
];

const PENDING_ORDERS = [
  { id: "STS-9821-X", game: "Mobile Legends", amount: "172 Diamonds", user: "GamerPro99", status: "Pending", time: "2 min ago" },
  { id: "STS-9822-Y", game: "Free Fire", amount: "720 Diamonds", user: "SultanFF", status: "Processing", time: "5 min ago" },
  { id: "STS-9823-Z", game: "Valorant", amount: "1250 Points", user: "RiotGamer", status: "Pending", time: "12 min ago" },
];

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20">
            Export Laporan
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {STATS.map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-6 flex items-center justify-between gap-1.5 sm:gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-sm sm:text-xl md:text-2xl font-black truncate">{stat.value}</p>
              </div>
              <div className={`h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Pending Orders Table */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> Antrean Pesanan
            </h3>
            <Button variant="ghost" className="text-xs font-black text-primary hover:bg-primary/5 h-8 px-2">
              Lihat Semua <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </div>
          <div className="bento-card border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[550px] whitespace-nowrap">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-9 sm:h-10">ID Order</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-9 sm:h-10">Produk</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-9 sm:h-10">User</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-9 sm:h-10 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PENDING_ORDERS.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/20 border-border/30">
                      <TableCell className="font-mono text-[10px] sm:text-[11px] font-bold py-3 sm:py-4">{order.id}</TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <p className="text-xs font-black">{order.game}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">{order.amount}</p>
                      </TableCell>
                      <TableCell className="text-xs font-bold py-3 sm:py-4">{order.user}</TableCell>
                      <TableCell className="text-right py-3 sm:py-4">
                        <Badge className={order.status === "Pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] sm:text-xs" : "bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] sm:text-xs"}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bento-card p-4 sm:p-6 border-primary/20 bg-primary/5">
            <h3 className="text-xs sm:text-sm font-black mb-3 sm:mb-4 tracking-widest uppercase">Kontrol Cepat</h3>
            <div className="space-y-2.5 sm:space-y-3">
              <Button className="w-full justify-start gap-2.5 sm:gap-3 h-10 sm:h-12 rounded-xl bg-card border-border hover:bg-muted text-[11px] sm:text-xs font-bold" variant="outline">
                <UserCheck className="h-4 w-4 text-primary shrink-0" /> Verifikasi Pembayaran Manual
              </Button>
              <Button className="w-full justify-start gap-2.5 sm:gap-3 h-10 sm:h-12 rounded-xl bg-card border-border hover:bg-muted text-[11px] sm:text-xs font-bold" variant="outline">
                <CreditCard className="h-4 w-4 text-primary shrink-0" /> Update Kurs Mata Uang
              </Button>
              <Button className="w-full justify-start gap-2.5 sm:gap-3 h-10 sm:h-12 rounded-xl bg-card border-border hover:bg-muted text-[11px] sm:text-xs font-bold" variant="outline">
                <AlertCircle className="h-4 w-4 text-primary shrink-0" /> Kirim Blast Notifikasi
              </Button>
            </div>
          </div>

          <div className="bento-card p-4 sm:p-6 space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase">System Health</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Payment Gateway</span>
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Game API Providers</span>
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Database Clusters</span>
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> STABLE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
