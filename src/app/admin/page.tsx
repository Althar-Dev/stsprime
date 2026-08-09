
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Ringkasan Sistem</h1>
          <p className="text-sm text-muted-foreground font-bold">Selamat datang kembali, Administrator. Berikut adalah performa STSPrime hari ini.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20">
            Export Laporan
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pending Orders Table */}
        <div className="lg:col-span-2 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Antrean Pesanan
            </h3>
            <Button variant="ghost" className="text-xs font-black text-primary hover:bg-primary/5">
              Lihat Semua <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="bento-card border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[500px] md:min-w-full">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">ID Order</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Produk</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">User</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PENDING_ORDERS.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/20 border-border/30">
                      <TableCell className="font-mono text-[11px] font-bold py-4">{order.id}</TableCell>
                      <TableCell className="py-4">
                        <p className="text-xs font-black">{order.game}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">{order.amount}</p>
                      </TableCell>
                      <TableCell className="text-xs font-bold py-4">{order.user}</TableCell>
                      <TableCell className="text-right py-4">
                        <Badge className={order.status === "Pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"}>
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
        <div className="space-y-6">
          <div className="bento-card p-6 border-primary/20 bg-primary/5">
            <h3 className="text-sm font-black mb-4 tracking-widest uppercase">Kontrol Cepat</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-card border-border hover:bg-muted text-xs font-bold" variant="outline">
                <UserCheck className="h-4 w-4 text-primary" /> Verifikasi Pembayaran Manual
              </Button>
              <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-card border-border hover:bg-muted text-xs font-bold" variant="outline">
                <CreditCard className="h-4 w-4 text-primary" /> Update Kurs Mata Uang
              </Button>
              <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-card border-border hover:bg-muted text-xs font-bold" variant="outline">
                <AlertCircle className="h-4 w-4 text-primary" /> Kirim Blast Notifikasi
              </Button>
            </div>
          </div>

          <div className="bento-card p-6 space-y-4">
            <h3 className="text-sm font-black tracking-widest uppercase">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Payment Gateway</span>
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Game API Providers</span>
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Database Clusters</span>
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
