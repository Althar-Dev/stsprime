
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  BarChart3,
  Calendar
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REVENUE_DATA = [
  { month: "Jan", revenue: 4500000 },
  { month: "Feb", revenue: 5200000 },
  { month: "Mar", revenue: 4800000 },
  { month: "Apr", revenue: 6100000 },
  { month: "May", revenue: 5900000 },
  { month: "Jun", revenue: 7400000 },
];

const GAME_SALES_DATA = [
  { name: "Mobile Legends", sales: 1240 },
  { name: "Free Fire", sales: 980 },
  { name: "Valorant", sales: 760 },
  { name: "Genshin", sales: 540 },
  { name: "PUBGM", sales: 430 },
];

const ORDER_STATUS_DATA = [
  { name: "Success", value: 85, color: "hsl(var(--primary))" },
  { name: "Processing", value: 10, color: "hsl(var(--accent))" },
  { name: "Failed", value: 5, color: "hsl(var(--destructive))" },
];

const KPI_STATS = [
  { 
    label: "Total Revenue", 
    value: "Rp 124.5M", 
    trend: "+12.5%", 
    trendUp: true, 
    icon: CreditCard,
    desc: "Bulan ini vs bulan lalu"
  },
  { 
    label: "Avg. Order Value", 
    value: "Rp 82.400", 
    trend: "+2.4%", 
    trendUp: true, 
    icon: ShoppingBag,
    desc: "Nilai rata-rata transaksi"
  },
  { 
    label: "New Registrations", 
    value: "1,420", 
    trend: "+18.2%", 
    trendUp: true, 
    icon: Users,
    desc: "Pertumbuhan member baru"
  },
  { 
    label: "Conversion Rate", 
    value: "4.2%", 
    trend: "-0.5%", 
    trendUp: false, 
    icon: Activity,
    desc: "Klik vs Checkout sukses"
  },
];

export default function AdminAnalytics() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" /> Analitik Performa
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Visualisasi data pertumbuhan dan performa bisnis STSPrime.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
          <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20">
            Unduh Laporan
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_STATS.map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.trendUp ? 'text-emerald-500' : 'text-destructive'}`}>
                  {stat.trend} {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{stat.label}</p>
                <p className="text-2xl font-black tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-bold">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 bento-card border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight">Tren Pendapatan</CardTitle>
            <CardDescription className="text-xs font-bold">Estimasi bruto dari seluruh kanal pembayaran.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `Rp${value / 1000000}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 900, color: 'hsl(var(--primary))' }}
                  labelStyle={{ fontSize: '10px', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', opacity: 0.6 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Donut Chart */}
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight">Status Pesanan</CardTitle>
            <CardDescription className="text-xs font-bold">Distribusi efisiensi fulfillment.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={ORDER_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ORDER_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              {ORDER_STATUS_DATA.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-1">
                  <div className="h-2 w-full rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">{item.name}</span>
                  <span className="text-xs font-black">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Sales Bar Chart */}
        <Card className="lg:col-span-1 bento-card border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight">Volume Per Game</CardTitle>
            <CardDescription className="text-xs font-bold">5 Game dengan transaksi terbanyak.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GAME_SALES_DATA} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: 'hsl(var(--foreground))' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 10, 10, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Performance Table */}
        <Card className="lg:col-span-2 bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight">Rangkuman Harian</CardTitle>
            <CardDescription className="text-xs font-bold">Performa operasional 5 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[500px] md:min-w-full">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Tanggal</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Transaksi</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Gross Revenue</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "12 Agu 2026", orders: 156, rev: "Rp 14.2M", status: "Optimal" },
                    { date: "11 Agu 2026", orders: 142, rev: "Rp 12.8M", status: "Optimal" },
                    { date: "10 Agu 2026", orders: 168, rev: "Rp 15.5M", status: "Peak" },
                    { date: "09 Agu 2026", orders: 98, rev: "Rp 8.9M", status: "Normal" },
                    { date: "08 Agu 2026", orders: 110, rev: "Rp 10.1M", status: "Normal" },
                  ].map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/20 border-border/30">
                      <TableCell className="font-bold text-xs py-4 pl-6">{row.date}</TableCell>
                      <TableCell className="font-black text-xs py-4">{row.orders}</TableCell>
                      <TableCell className="font-black text-xs text-primary py-4">{row.rev}</TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase tracking-tighter px-2",
                          row.status === "Peak" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
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
    </div>
  );
}
