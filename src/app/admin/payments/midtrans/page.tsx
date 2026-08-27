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
  QrCode,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_MIDTRANS_LOGS = [
  { id: "MID-2021", orderId: "STS-9844-Z", type: "Gopay", amount: "Rp 15.000", status: "Settlement", date: "12 Agu 2026, 17:15" },
  { id: "MID-2020", orderId: "STS-9843-A", type: "VA", amount: "Rp 125.000", status: "Pending", channel: "BCA", date: "12 Agu 2026, 17:10" },
  { id: "MID-2019", orderId: "STS-9842-B", type: "QRIS", amount: "Rp 50.000", status: "Settlement", date: "12 Agu 2026, 16:55" },
  { id: "MID-2018", orderId: "STS-9841-C", type: "Credit Card", amount: "Rp 250.000", status: "Deny", date: "12 Agu 2026, 15:30" },
];

export default function AdminMidtransPage() {
  const [isProduction, setIsProduction] = useState(false);

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Globe className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Gateway Midtrans
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Konfigurasi integrasi Midtrans untuk Kartu Kredit, GoPay, QRIS, dan Virtual Account.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border">
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Cek Status API
          </Button>
          <a href="https://dashboard.midtrans.com" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
            <Button className="w-full rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-10">
              Merchant <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Gateway Status Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Volume Transaksi", value: "Rp 85.2M", icon: Wallet, color: "text-primary", trend: "Bulan ini" },
          { label: "Metode Aktif", value: "12 Jalur", icon: Zap, color: "text-blue-500", trend: "Konfigurasi aktif" },
          { label: "Success Rate", value: "95.8%", icon: Activity, color: "text-emerald-500", trend: "Sangat Stabil" },
          { label: "Koneksi", value: "ONLINE", icon: ShieldCheck, color: "text-emerald-500", trend: "Terverifikasi" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
                  <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter opacity-60">Midtrans</Badge>
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
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" /> Pengaturan API Midtrans
                  </CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs font-bold">Dapatkan kredensial dari Dashboard Midtrans menu Settings &gt; Access Keys.</CardDescription>
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border transition-colors shrink-0",
                  isProduction ? "bg-emerald-500/10 border-emerald-500/20" : "bg-blue-500/10 border-blue-500/20"
                )}>
                  <div className={cn("h-2 w-2 rounded-full animate-pulse", isProduction ? "bg-emerald-500" : "bg-blue-500")} />
                  <span className={cn("text-[9px] sm:text-[10px] font-black uppercase", isProduction ? "text-emerald-500" : "text-blue-500")}>
                    {isProduction ? "Production" : "Sandbox"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Server Key
                  </Label>
                  <div className="relative">
                    <Input type="password" placeholder="Mid-server-..." className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 pr-10 text-xs sm:text-sm" defaultValue="Mid-server-8821931211abcdef" />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 sm:h-9 sm:w-9 rounded-lg"><Settings2 className="h-4 w-4 opacity-50" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Client Key
                  </Label>
                  <Input placeholder="Mid-client-..." className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 text-xs sm:text-sm" defaultValue="Mid-client-ok-1234567890" />
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-black text-foreground">Gunakan Lingkungan Produksi</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold leading-tight">Aktifkan untuk mulai menerima pembayaran asli dari pelanggan.</p>
                </div>
                <Switch checked={isProduction} onCheckedChange={setIsProduction} className="shrink-0" />
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 rounded-xl font-black text-xs gap-2 shadow-lg shadow-primary/20">
                  <CheckCircle2 className="h-4 w-4" /> Simpan Konfigurasi
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Control */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Kanal Pembayaran Midtrans</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Aktifkan atau nonaktifkan metode pembayaran yang tersedia di Snap Checkout.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Credit / Debit Card", desc: "Visa, Mastercard, JCB, Amex", icon: CreditCard },
                  { label: "GoPay / QRIS", desc: "Digital Wallets & Scan QR", icon: QrCode },
                  { label: "Bank Transfer", desc: "BCA, Mandiri, BNI, BRI", icon: Building2 },
                  { label: "Indomaret / Alfamart", desc: "OTC (Over the counter)", icon: Wallet },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-background border border-border/40 group hover:border-primary/30 transition-all gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                        <item.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-black truncate">{item.label}</p>
                        <p className="text-[9px] text-muted-foreground font-bold truncate">{item.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked className="shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar / Log Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="bento-card border-primary/20 bg-primary/5 h-full min-w-0">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-widest">HTTP Notification Logs</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black text-primary hover:bg-primary/10 px-2">
                  Lihat Semua <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-4">
              <div className="divide-y divide-border/30">
                {MOCK_MIDTRANS_LOGS.map((log) => (
                  <div key={log.id} className="p-3.5 sm:p-4 hover:bg-muted/10 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] font-black text-primary truncate">{log.orderId}</span>
                        <Badge variant="outline" className="text-[8px] h-4 font-black uppercase px-1 shrink-0">{log.type}</Badge>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter shrink-0",
                        log.status === "Settlement" ? "text-emerald-500" : 
                        log.status === "Pending" ? "text-amber-500" : "text-destructive"
                      )}>{log.status}</span>
                    </div>
                    <div className="flex justify-between items-end gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold truncate">{log.channel || "Auto"}</p>
                        <p className="text-[10px] font-black text-foreground/80 tabular-nums truncate">{log.amount}</p>
                        <p className="text-[9px] text-muted-foreground font-bold truncate">{log.date}</p>
                      </div>
                      <code className="text-[9px] bg-background border border-border/50 px-1.5 py-0.5 rounded font-bold text-muted-foreground shrink-0">
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
                    Webhook Midtrans (Notification URL) harus diset ke URL API sistem Anda untuk memproses transaksi otomatis.
                  </p>
                </div>
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block text-left px-1">Notification URL</Label>
                   <div className="flex gap-1">
                      <Input readOnly value="https://stsprime.com/api/midtrans/webhook" className="h-9 bg-background rounded-lg font-mono text-[10px] border-border/50 min-w-0" />
                      <Button variant="outline" size="sm" className="h-9 rounded-lg px-2 shrink-0"><Settings2 className="h-3.5 w-3.5" /></Button>
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
