
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Filter,
  PieChart as PieChartIcon,
  ChevronRight,
  Calculator
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { cn } from "@/lib/utils";

const MONTHLY_SALES_DATA = [
  { month: "Jan", revenue: 4500000, profit: 450000 },
  { month: "Feb", revenue: 5200000, profit: 580000 },
  { month: "Mar", revenue: 4800000, profit: 420000 },
  { month: "Apr", revenue: 6100000, profit: 710000 },
  { month: "May", revenue: 5900000, profit: 650000 },
  { month: "Jun", revenue: 7400000, profit: 890000 },
  { month: "Jul", revenue: 8200000, profit: 950000 },
];

const TOP_PERFORMING_PRODUCTS = [
  { name: "Mobile Legends", revenue: 12500000, count: 420 },
  { name: "Free Fire", revenue: 9800000, count: 310 },
  { name: "Valorant", revenue: 7600000, count: 185 },
  { name: "Genshin", revenue: 5400000, count: 92 },
  { name: "PUBGM", revenue: 4200000, count: 110 },
];

export default function AdminReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("Last 30 Days");

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <BarChart3 className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Laporan Keuangan & Laba
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Ringkasan transaksi, profitabilitas produk, dan proyeksi pertumbuhan.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {reportPeriod}
          </Button>
          <Button className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-10 bg-primary text-primary-foreground">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Gross Revenue", value: "Rp 124.5M", trend: "+14.2%", up: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Net Profit", value: "Rp 18.2M", trend: "+8.5%", up: true, icon: Calculator, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Orders", value: "1,842", trend: "+12.1%", up: true, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Refund Rate", value: "0.8%", trend: "-2.4%", up: false, icon: ArrowDownRight, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shrink-0",
                  stat.up ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                )}>
                  {stat.trend} {stat.up ? <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <ArrowDownRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                </div>
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 truncate">{stat.label}</p>
                <p className="text-base sm:text-2xl font-black tabular-nums truncate">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {/* Sales Trend Area Chart */}
        <Card className="lg:col-span-2 bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
          <CardHeader className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border-b border-border/30 bg-muted/10">
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Tren Pendapatan & Profit</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Perbandingan pertumbuhan bruto dan neto mingguan.</CardDescription>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground">Profit</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 h-[260px] sm:h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `Rp${value / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 900 }}
                  labelStyle={{ fontSize: '9px', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', opacity: 0.6 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
          <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
            <CardTitle className="text-base sm:text-lg font-black tracking-tight">Volume Per Produk</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs font-bold">Kontribusi pendapatan dari 5 game teratas.</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 h-[260px] sm:h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_PERFORMING_PRODUCTS} layout="vertical" margin={{ left: -25, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: 'hsl(var(--foreground))' }}
                  width={75}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[0, 10, 10, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
              {TOP_PERFORMING_PRODUCTS.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] sm:text-xs font-bold border-b border-border/30 pb-1.5 sm:pb-2 last:border-0">
                  <span className="text-muted-foreground truncate">{p.name}</span>
                  <span className="text-primary font-black shrink-0">Rp {(p.revenue / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Monthly Summary Table */}
        <Card className="lg:col-span-3 bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between border-b border-border/30 bg-muted/10">
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Ringkasan Performa Tahunan</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Rangkuman audit per bulan untuk tahun {new Date().getFullYear()}.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs font-black text-primary gap-1 shrink-0">
              Detail <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 w-full max-w-full overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[650px] whitespace-nowrap">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Bulan</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Gross Revenue</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">COGS (Provider)</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Net Profit</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Margin</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { month: "Juli 2026", rev: "Rp 8.240.000", cogs: "Rp 7.290.000", profit: "Rp 950.000", margin: "11.5%", status: "Peak" },
                    { month: "Juni 2026", rev: "Rp 7.410.000", cogs: "Rp 6.520.000", profit: "Rp 890.000", margin: "12.0%", status: "Stable" },
                    { month: "Mei 2026", rev: "Rp 5.920.000", cogs: "Rp 5.270.000", profit: "Rp 650.000", margin: "10.9%", status: "Stable" },
                    { month: "April 2026", rev: "Rp 6.105.000", cogs: "Rp 5.395.000", profit: "Rp 710.000", margin: "11.6%", status: "High" },
                    { month: "Maret 2026", rev: "Rp 4.850.000", cogs: "Rp 4.430.000", profit: "Rp 420.000", margin: "8.6%", status: "Normal" },
                  ].map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/20 border-border/30">
                      <TableCell className="font-black text-xs py-3 sm:py-4 pl-4 sm:pl-6">{row.month}</TableCell>
                      <TableCell className="font-bold text-xs py-3 sm:py-4 tabular-nums">{row.rev}</TableCell>
                      <TableCell className="font-bold text-xs py-3 sm:py-4 text-muted-foreground tabular-nums">{row.cogs}</TableCell>
                      <TableCell className="font-black text-xs py-3 sm:py-4 text-primary tabular-nums">{row.profit}</TableCell>
                      <TableCell className="font-bold text-xs py-3 sm:py-4 tabular-nums">{row.margin}</TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase tracking-tighter px-2",
                          row.status === "Peak" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            row.status === "High" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        )}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Summary Footer Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        <Card className="bento-card border-primary/20 bg-primary/5 p-4 sm:p-6">
          <div className="flex gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Insight Profitabilitas</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold leading-relaxed">
                Produk "Mobile Legends" menyumbang 45% dari total laba bersih bulan ini. Mempertahankan margin di atas 10% adalah target ideal untuk menjaga stabilitas operasional STSPrime.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Antrean Laporan Otomatis</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-bold italic">Laporan mingguan akan dikirimkan ke email administrator setiap hari Senin pukul 08:00 WIB.</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border shrink-0">
            Lihat Pengaturan Notif
          </Button>
        </Card>
      </div>
    </div>
  );
}
