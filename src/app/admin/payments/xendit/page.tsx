
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
  Globe,
  Wallet,
  Building2,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_XENDIT_LOGS = [
  { id: "XEN-1021", externalId: "STS-9821-X", type: "QRIS", amount: "Rp 38.000", status: "Paid", channel: "ShopeePay", date: "12 Agu 2026, 16:45" },
  { id: "XEN-1020", externalId: "STS-9820-Y", type: "VA", amount: "Rp 125.000", status: "Pending", channel: "BNI", date: "12 Agu 2026, 16:42" },
  { id: "XEN-1019", externalId: "STS-9819-Z", type: "E-Wallet", amount: "Rp 50.000", status: "Paid", channel: "OVO", date: "12 Agu 2026, 16:30" },
  { id: "XEN-1018", externalId: "STS-9818-W", type: "Retail", amount: "Rp 215.000", status: "Expired", channel: "Alfamart", date: "12 Agu 2026, 15:10" },
];

export default function AdminXenditPage() {
  const [isLiveMode, setIsLiveMode] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" /> Xendit Gateway
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Konfigurasi payment gateway Xendit untuk Virtual Account, E-Wallet, dan Retail Outlet.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 h-10 border-border">
            <RefreshCw className="h-4 w-4" /> Cek Koneksi
          </Button>
          <a href="https://dashboard.xendit.co" target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2 h-10">
              Dashboard Xendit <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Gateway Health Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Terproses", value: "Rp 124.8M", icon: Wallet, color: "text-primary", trend: "Bulan ini" },
          { label: "Kanal Aktif", value: "18 Metode", icon: Globe, color: "text-blue-500", trend: "VA & E-Wallet" },
          { label: "Success Rate", value: "97.2%", icon: Activity, color: "text-emerald-500", trend: "Pembayaran Berhasil" },
          { label: "API Status", value: "ONLINE", icon: ShieldCheck, color: "text-emerald-500", trend: "Terhubung" },
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
                    <KeyRound className="h-5 w-5 text-primary" /> Kredensial API Xendit
                  </CardTitle>
                  <CardDescription className="text-xs font-bold">Gunakan Secret Key dari Dashboard Xendit menu Settings > API Keys.</CardDescription>
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full border transition-colors",
                  isLiveMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-blue-500/10 border-blue-500/20"
                )}>
                  <div className={cn("h-2 w-2 rounded-full animate-pulse", isLiveMode ? "bg-emerald-500" : "bg-blue-500")} />
                  <span className={cn("text-[10px] font-black uppercase", isLiveMode ? "text-emerald-500" : "text-blue-500")}>
                    {isLiveMode ? "Live Mode" : "Test Mode"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Secret Key (xnd_...)
                  </Label>
                  <div className="relative">
                    <Input type="password" placeholder="xnd_production_..." className="h-11 bg-background rounded-xl font-bold border-border/50 pr-10" defaultValue="xnd_test_1234567890abcdef" />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-lg"><Settings2 className="h-4 w-4 opacity-50" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Callback Verification Token
                  </Label>
                  <Input placeholder="Token verifikasi webhook" className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="v3rify_t0k3n_xnd" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-foreground">Gunakan Production / Live Mode</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Pastikan kredensial sudah menggunakan kunci produksi sebelum mengaktifkan ini.</p>
                </div>
                <Switch checked={isLiveMode} onCheckedChange={setIsLiveMode} />
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  <CheckCircle2 className="h-4 w-4" /> Simpan Konfigurasi
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Control */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="text-lg font-black tracking-tight">Status Metode Pembayaran</CardTitle>
              <CardDescription className="text-xs font-bold">Aktifkan atau nonaktifkan kanal pembayaran tertentu di sisi checkout.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Virtual Account (VA)", desc: "BCA, Mandiri, BNI, BRI", icon: Building2 },
                  { label: "E-Wallets", desc: "OVO, Dana, LinkAja", icon: Wallet },
                  { label: "QRIS", desc: "Dynamic QR Code", icon: QrCode },
                  { label: "Retail Outlets", desc: "Alfamart, Indomaret", icon: CreditCard },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/40 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <item.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
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
                <CardTitle className="text-sm font-black uppercase tracking-widest">Xendit Webhook Logs</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black text-primary hover:bg-primary/10">
                  Lihat Semua <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-border/30">
                {MOCK_XENDIT_LOGS.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/10 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-primary">{log.externalId}</span>
                        <Badge variant="outline" className="text-[8px] h-4 font-black uppercase px-1">{log.type}</Badge>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter",
                        log.status === "Paid" ? "text-emerald-500" : 
                        log.status === "Pending" ? "text-amber-500" : "text-destructive"
                      )}>{log.status}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold">{log.channel}</p>
                        <p className="text-[10px] font-black text-foreground/80">{log.amount}</p>
                        <p className="text-[9px] text-muted-foreground font-bold">{log.date}</p>
                      </div>
                      <code className="text-[9px] bg-background border border-border/50 px-1.5 py-0.5 rounded font-bold text-muted-foreground">
                        ID: {log.id}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pt-6 text-center space-y-4">
                 <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
                  <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-600 leading-tight">
                    Webhook URL harus didaftarkan di Dashboard Xendit agar sistem dapat menerima notifikasi pembayaran otomatis.
                  </p>
                </div>
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block text-left px-1">Webhook URL Target</Label>
                   <div className="flex gap-1">
                      <Input readOnly value="https://stsprime.com/api/webhooks/xendit" className="h-9 bg-background rounded-lg font-mono text-[10px] border-border/50" />
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
