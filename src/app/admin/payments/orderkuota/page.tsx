
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  RefreshCw, 
  Settings2, 
  ShieldCheck, 
  Activity, 
  AlertCircle,
  KeyRound,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock,
  Wallet,
  Building2,
  QrCode,
  Zap,
  IdCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_ORDERKUOTA_PAY_LOGS = [
  { id: "OKP-501", orderId: "STS-9844-Z", type: "QRIS", amount: "Rp 15.000", status: "Success", date: "12 Agu 2026, 17:15" },
  { id: "OKP-500", orderId: "STS-9843-A", type: "E-Wallet", amount: "Rp 125.000", status: "Pending", date: "12 Agu 2026, 17:10" },
  { id: "OKP-499", orderId: "STS-9842-B", type: "QRIS", amount: "Rp 50.000", status: "Success", date: "12 Agu 2026, 16:55" },
  { id: "OKP-498", orderId: "STS-9841-C", type: "Retail", amount: "Rp 250.000", status: "Failed", date: "12 Agu 2026, 15:30" },
];

export default function AdminOrderkuotaPaymentPage() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" /> Orderkuota Gateway
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Konfigurasi payment gateway Orderkuota untuk mendukung berbagai metode pembayaran otomatis.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 h-10 border-border">
            <RefreshCw className="h-4 w-4" /> Cek Saldo Gateway
          </Button>
          <a href="https://orderkuota.com" target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2 h-10">
              Orderkuota Portal <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Gateway Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Saldo Gateway", value: "Rp 1.250.000", icon: Wallet, color: "text-primary", trend: "Saldo mengendap" },
          { label: "Transaksi Berhasil", value: "856", icon: Zap, color: "text-blue-500", trend: "Bulan ini" },
          { label: "Success Rate", value: "98.2%", icon: Activity, color: "text-emerald-500", trend: "Sangat Stabil" },
          { label: "Status API", value: "TERHUBUNG", icon: ShieldCheck, color: "text-emerald-500", trend: "Terverifikasi" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter opacity-60">Gateway</Badge>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-black tabular-nums">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground/60 italic">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Connection Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-primary" /> Pengaturan API Gateway
                  </CardTitle>
                  <CardDescription className="text-xs font-bold">Gunakan kredensial API dari akun Orderkuota Anda (Menu Profil &gt; API ID).</CardDescription>
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full border transition-colors",
                  isActive ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted border-border"
                )}>
                  <div className={cn("h-2 w-2 rounded-full", isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
                  <span className={cn("text-[10px] font-black uppercase", isActive ? "text-emerald-500" : "text-muted-foreground")}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <IdCard className="h-3 w-3" /> Merchant / API ID
                  </Label>
                  <Input placeholder="OK-ID-..." className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="OK88211" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> API Key
                  </Label>
                  <div className="relative">
                    <Input type="password" placeholder="••••••••••••••••" className="h-11 bg-background rounded-xl font-bold border-border/50 pr-10" defaultValue="ok-secret-key-prod" />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-lg"><Settings2 className="h-4 w-4 opacity-50" /></Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-foreground">Aktifkan Gateway Orderkuota</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Jika dimatikan, metode pembayaran via Orderkuota tidak akan muncul di checkout.</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  <CheckCircle2 className="h-4 w-4" /> Perbarui Kredensial
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Channels Control */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="text-lg font-black tracking-tight">Kanal Pembayaran Aktif</CardTitle>
              <CardDescription className="text-xs font-bold">Pilih metode apa saja yang ingin Anda terima melalui gateway ini.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "QRIS All Payment", desc: "Scan otomatis via saldo gateway", icon: QrCode },
                  { label: "E-Wallet (Dana, OVO)", desc: "Direct payment wallet", icon: Wallet },
                  { label: "Virtual Account", desc: "BCA, BNI, Mandiri, BRI", icon: Building2 },
                  { label: "Retail Outlet", desc: "Alfamart / Indomaret", icon: CreditCard },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/40 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <item.icon className={cn("h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors")} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black">{item.label}</p>
                        <p className="text-[9px] text-muted-foreground font-bold">{item.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar / Log Sidebar */}
        <div className="space-y-6">
          <Card className="bento-card border-primary/20 bg-primary/5 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Gateway API Logs</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black text-primary hover:bg-primary/10">
                  Lihat Semua <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-border/30">
                {MOCK_ORDERKUOTA_PAY_LOGS.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/10 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-primary">{log.orderId}</span>
                        <Badge variant="outline" className="text-[8px] h-4 font-black uppercase px-1">{log.type}</Badge>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter",
                        log.status === "Success" ? "text-emerald-500" : 
                        log.status === "Pending" ? "text-amber-500" : "text-destructive"
                      )}>{log.status}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold">Orderkuota IPN / Webhook</p>
                        <p className="text-[10px] font-black text-foreground/80">{log.amount}</p>
                        <p className="text-[9px] text-muted-foreground font-bold">{log.date}</p>
                      </div>
                      <code className="text-[9px] bg-background border border-border/50 px-1.5 py-0.5 rounded font-bold text-muted-foreground">
                        {log.id}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pt-6 text-center space-y-4">
                 <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
                  <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-600 leading-tight">
                    Pastikan Callback URL di Dashboard Orderkuota sudah diarahkan ke URL sistem Anda untuk pemrosesan pembayaran otomatis.
                  </p>
                </div>
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block text-left px-1">IPN / Callback URL</Label>
                   <div className="flex gap-1">
                      <Input readOnly value="https://stsprime.com/api/callback/orderkuota" className="h-9 bg-background rounded-lg font-mono text-[10px] border-border/50" />
                      <Button variant="outline" size="sm" className="h-9 rounded-lg px-2"><Settings2 className="h-3.5 w-3.5" /></Button>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
