
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
  Server, 
  RefreshCw, 
  Settings2, 
  ShieldCheck, 
  Wallet, 
  Zap, 
  Activity, 
  AlertCircle,
  KeyRound,
  User,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

const MONG_DIGIFLAZZ_LOGS = [
  { id: "LOG-1021", orderId: "STS-9821-X", type: "Topup", item: "86 Diamonds", status: "Success", response: "00", date: "12 Agu 2026, 16:45" },
  { id: "LOG-1020", orderId: "STS-9820-Y", type: "Topup", item: "172 Diamonds", status: "Success", response: "00", date: "12 Agu 2026, 16:42" },
  { id: "LOG-1019", orderId: "STS-9819-Z", type: "Inquiry", item: "Check Balance", status: "Success", response: "OK", date: "12 Agu 2026, 16:30" },
  { id: "LOG-1018", orderId: "STS-9818-W", type: "Topup", item: "300 Crystals", status: "Failed", response: "01", date: "12 Agu 2026, 15:10" },
];

export default function AdminDigiFlazzPage() {
  const [isProduction, setIsProduction] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Server className="h-8 w-8 text-primary" /> DigiFlazz Provider
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola integrasi API DigiFlazz, pantau saldo akun, dan audit log transaksi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 h-10 border-border">
            <RefreshCw className="h-4 w-4" /> Sinkron Produk
          </Button>
          <a href="https://dashboard.digiflazz.com" target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2 h-10">
              Buka Dashboard <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Provider Health Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Saldo DigiFlazz", value: "Rp 4.250.000", icon: Wallet, color: "text-primary", trend: "Saldo mengendap" },
          { label: "Produk Terhubung", value: "142 SKU", icon: Zap, color: "text-blue-500", trend: "Status aktif" },
          { label: "Success Rate", value: "98.4%", icon: Activity, color: "text-emerald-500", trend: "Bulan ini" },
          { label: "API Status", value: "ONLINE", icon: ShieldCheck, color: "text-emerald-500", trend: "Terhubung" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter opacity-60">Provider API</Badge>
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
                    <KeyRound className="h-5 w-5 text-primary" /> Pengaturan Koneksi API
                  </CardTitle>
                  <CardDescription className="text-xs font-bold">Pastikan kredensial sesuai dengan yang ada di Member Area DigiFlazz.</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Connected</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" /> Username DigiFlazz
                  </Label>
                  <Input placeholder="username_digiflazz" className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="stsprime_admin" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> API Key (Development/Prod)
                  </Label>
                  <div className="relative">
                    <Input type="password" placeholder="••••••••••••••••" className="h-11 bg-background rounded-xl font-bold border-border/50 pr-10" defaultValue="dev-key-12345" />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-lg"><Settings2 className="h-4 w-4 opacity-50" /></Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-foreground">Production Mode</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Aktifkan untuk memproses transaksi menggunakan saldo asli.</p>
                </div>
                <Switch checked={isProduction} onCheckedChange={setIsProduction} />
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  <CheckCircle2 className="h-4 w-4" /> Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pricing / Markup Settings */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" /> Pengaturan Markup Global
              </CardTitle>
              <CardDescription className="text-xs font-bold">Atur persentase keuntungan untuk semua produk dari provider ini.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Markup Member (Persen)</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="0" className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="3" />
                    <div className="h-11 px-4 bg-muted flex items-center justify-center rounded-xl font-black border border-border/50">%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Markup Reseller/VIP (Persen)</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="0" className="h-11 bg-background rounded-xl font-bold border-border/50" defaultValue="1.5" />
                    <div className="h-11 px-4 bg-muted flex items-center justify-center rounded-xl font-black border border-border/50">%</div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 border-primary/20 text-primary hover:bg-primary/5">
                  Update Seluruh Harga SKU
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
                {MONG_DIGIFLAZZ_LOGS.map((log) => (
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
                        Resp: {log.response}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pt-6 text-center space-y-4">
                 <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-600 leading-tight">
                    Webhook belum terkonfigurasi. Update status transaksi mungkin terhambat.
                  </p>
                </div>
                <Button variant="outline" className="w-full rounded-xl h-10 font-black text-[10px] uppercase tracking-widest border-border">
                  Setup Webhook URL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
