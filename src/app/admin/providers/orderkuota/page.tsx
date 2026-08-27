
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
  Cpu,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Wallet,
  Zap,
  Activity,
  AlertCircle,
  KeyRound,
  IdCard,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_ORDERKUOTA_LOGS = [
  { id: "LOG-OK-201", orderId: "STS-9844-Z", type: "Voucher", item: "Steam IDR 100k", status: "Success", response: "200 OK", date: "12 Agu 2026, 17:15" },
  { id: "LOG-OK-200", orderId: "STS-9843-A", type: "Topup", item: "300 Crystals", status: "Success", response: "200 OK", date: "12 Agu 2026, 17:10" },
  { id: "LOG-OK-199", orderId: "STS-9842-B", type: "Inquiry", item: "Check Account", status: "Success", response: "Valid", date: "12 Agu 2026, 16:55" },
  { id: "LOG-OK-198", orderId: "STS-9841-C", type: "Topup", item: "Weekly Pass", status: "Failed", response: "403 Forbidden", date: "12 Agu 2026, 15:30" },
];

export default function AdminOrderkuotaPage() {
  const [isProduction, setIsProduction] = useState(true);

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Cpu className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Integrasi Orderkuota
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Pengaturan API ID, margin profit, dan log transaksi provider Orderkuota.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border">
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Sinkron Produk
          </Button>
          <a href="https://orderkuota.com" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
            <Button className="w-full rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-10">
              Merchant <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Provider Status Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Saldo Orderkuota", value: "Rp 1.840.500", icon: Wallet, color: "text-primary", trend: "Saldo mengalir" },
          { label: "SKU Terhubung", value: "86 Produk", icon: Zap, color: "text-blue-500", trend: "Terintegrasi" },
          { label: "Success Rate", value: "99.1%", icon: Activity, color: "text-emerald-500", trend: "Sangat Stabil" },
          { label: "Server Status", value: "ONLINE", icon: ShieldCheck, color: "text-emerald-500", trend: "Latency Rendah" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
                  <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter opacity-60">Provider API</Badge>
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-xl font-black tabular-nums truncate">{stat.value}</p>
                <p className="text-[9px] font-bold text-muted-foreground/60 italic truncate">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
        {/* Connection Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-primary" /> Konfigurasi API ID
                  </CardTitle>
                  <CardDescription className="text-xs font-bold">Input kredensial API Key dari profil akun Orderkuota Anda.</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Authenticated</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <IdCard className="h-3 w-3" /> Merchant ID / API ID
                  </Label>
                  <Input placeholder="OK-ID-XXXXX" className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="OK88211" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Secret API Key
                  </Label>
                  <div className="relative">
                    <Input type="password" placeholder="••••••••••••••••" className="h-11 bg-background rounded-xl font-bold border-border/50 pr-10" defaultValue="ok-secret-key-prod" />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-lg"><Settings2 className="h-4 w-4 opacity-50" /></Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-foreground">API Status Active</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Matikan sakelar ini untuk menghentikan seluruh transaksi melalui Orderkuota.</p>
                </div>
                <Switch checked={isProduction} onCheckedChange={setIsProduction} />
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  <CheckCircle2 className="h-4 w-4" /> Update Kredensial
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pricing / Markup Settings */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" /> Atur Profit Margin
              </CardTitle>
              <CardDescription className="text-xs font-bold">Hitung otomatis harga jual untuk semua SKU Orderkuota.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Markup Harga Jual (Persen)</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="0" className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="4" />
                    <div className="h-11 px-4 bg-muted flex items-center justify-center rounded-xl font-black border border-border/50">%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Markup Khusus VIP (Persen)</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="0" className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="2" />
                    <div className="h-11 px-4 bg-muted flex items-center justify-center rounded-xl font-black border border-border/50">%</div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 border-primary/20 text-primary hover:bg-primary/5">
                  Update Kalkulasi Harga
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar / Log Sidebar */}
        <div className="space-y-6">
          <Card className="bento-card border-primary/20 bg-primary/5 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Recent API Logs</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black text-primary hover:bg-primary/10">
                  Lihat Semua <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-border/30">
                {MOCK_ORDERKUOTA_LOGS.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/10 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-primary">{log.orderId}</span>
                        <Badge variant="outline" className="text-[8px] h-4 font-black uppercase px-1">{log.type}</Badge>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter",
                        log.status === "Success" ? "text-emerald-500" : "text-destructive"
                      )}>{log.status}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold truncate max-w-[120px]">{log.item}</p>
                        <p className="text-[9px] text-muted-foreground font-bold">{log.date}</p>
                      </div>
                      <code className="text-[9px] bg-background border border-border/50 px-1.5 py-0.5 rounded font-bold text-muted-foreground">
                        {log.response}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pt-6 text-center space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
                  <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-600 leading-tight">
                    Webhook Orderkuota sedang aktif. Status transaksi otomatis terupdate.
                  </p>
                </div>
                <Button variant="outline" className="w-full rounded-xl h-10 font-black text-[10px] uppercase tracking-widest border-border">
                  Ganti Callback URL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
