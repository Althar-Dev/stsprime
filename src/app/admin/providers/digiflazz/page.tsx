
"use client";

import { useState, useEffect } from "react";
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
  KeyRound,
  User,
  ExternalLink,
  CheckCircle2,
  Lock,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSyncedProductsFromSQLite, syncDigiflazzProducts, getDigiflazzBalance } from "@/app/actions/digiflazz-actions";
import { useToast } from "@/hooks/use-toast";


export default function AdminDigiFlazzPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isProduction, setIsProduction] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  
  const [syncedProducts, setSyncedProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [balance, setBalance] = useState<number | null>(null);
  const [apiStatus, setApiStatus] = useState<"ONLINE" | "OFFLINE" | "LOADING">("LOADING");

  // Load connection settings and products on mount
  useEffect(() => {
    const loadSettingsAndProducts = async () => {
      try {
        let currentUsername = username;
        let currentApiKey = apiKey;

        if (db) {
          const docRef = doc(db, "settings", "digiflazz");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.username) {
              setUsername(data.username);
              currentUsername = data.username;
            }
            if (data.apiKey) {
              setApiKey(data.apiKey);
              currentApiKey = data.apiKey;
            }
            if (data.isProduction !== undefined) setIsProduction(data.isProduction);
          }
        }
        
        // Load balance
        if (currentUsername && currentApiKey) {
          const balRes = await getDigiflazzBalance(currentUsername, currentApiKey);
          if (balRes.success) {
            setBalance(balRes.balance);
            setApiStatus("ONLINE");
          } else {
            setBalance(null);
            setApiStatus("OFFLINE");
          }
        }
        
        // Load products from SQLite
        const res = await getSyncedProductsFromSQLite();
        if (res.success) {
          setSyncedProducts(res.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading settings/products:", err);
        setLoading(false);
      }
    };
    loadSettingsAndProducts();
  }, [db]);

  const loadSyncedProducts = async () => {
    try {
      const res = await getSyncedProductsFromSQLite();
      if (res.success) {
        setSyncedProducts(res.data);
      }
    } catch (err) {
      console.error("Error reloading products:", err);
    }
  };

  // Save changes handler
  const handleSaveSettings = async () => {
    if (!db) return;
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "digiflazz");
      await setDoc(docRef, {
        username,
        apiKey,
        isProduction,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Refresh balance after saving settings
      const balRes = await getDigiflazzBalance(username, apiKey);
      if (balRes.success) {
        setBalance(balRes.balance);
        setApiStatus("ONLINE");
      } else {
        setBalance(null);
        setApiStatus("OFFLINE");
      }

      toast({
        title: "Pengaturan disimpan",
        description: "Kredensial API DigiFlazz berhasil disimpan.",
      });
    } catch (err) {
      console.error("Error saving settings:", err);
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan. Coba lagi.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Sync Products handler
  const handleSyncProducts = async () => {
    setSyncing(true);
    setSyncStatus("Mengunduh & Menyimpan ke SQLite...");
    try {
      // Call Server Action to sync directly to SQLite
      const result = await syncDigiflazzProducts(username, apiKey);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Refresh balance after syncing
      const balRes = await getDigiflazzBalance(username, apiKey);
      if (balRes.success) {
        setBalance(balRes.balance);
        setApiStatus("ONLINE");
      } else {
        setBalance(null);
        setApiStatus("OFFLINE");
      }

      toast({
        title: "Sinkronisasi berhasil!",
        description: `${result.count} SKU prabayar DigiFlazz tersimpan ke database/product.db.`,
      });
      await loadSyncedProducts();
    } catch (err: any) {
      console.error("Sync error:", err);
      toast({
        variant: "destructive",
        title: "Gagal sinkronisasi",
        description: err.message || "Terjadi kesalahan. Periksa kredensial dan koneksi.",
      });
    } finally {
      setSyncing(false);
      setSyncStatus("");
    }
  };

  const filteredSyncedProducts = syncedProducts.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      (p.productName || "").toLowerCase().includes(query) ||
      (p.skuCode || "").toLowerCase().includes(query) ||
      (p.brand || "").toLowerCase().includes(query) ||
      (p.category || "").toLowerCase().includes(query)
    );
  });

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
          <Button 
            variant="outline" 
            onClick={handleSyncProducts}
            disabled={syncing || loading}
            className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 h-10 border-border"
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} /> 
            {syncing ? syncStatus || "Sinkronisasi..." : "Sinkron Produk"}
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
          { 
            label: "Saldo DigiFlazz", 
            value: balance !== null ? `Rp ${balance.toLocaleString("id-ID")}` : "Loading...", 
            icon: Wallet, 
            color: "text-primary", 
            trend: "Saldo saat ini" 
          },
          { label: "Produk Terhubung", value: `${syncedProducts.length} SKU`, icon: Zap, color: "text-blue-500", trend: "Status aktif" },
          { label: "Success Rate", value: "98.4%", icon: Activity, color: "text-emerald-500", trend: "Bulan ini" },
          { 
            label: "API Status", 
            value: apiStatus, 
            icon: ShieldCheck, 
            color: apiStatus === "ONLINE" ? "text-emerald-500" : "text-destructive", 
            trend: apiStatus === "ONLINE" ? "Terhubung" : "Gagal terhubung" 
          },
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

      <div className="space-y-6">
        <div className="space-y-6">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-primary" /> Pengaturan Koneksi API
                  </CardTitle>
                  <CardDescription className="text-xs font-bold">Pastikan kredensial sesuai dengan yang ada di Member Area DigiFlazz.</CardDescription>
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full border",
                  apiStatus === "ONLINE" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}>
                  <div className={cn(
                    "h-2 w-2 rounded-full animate-pulse",
                    apiStatus === "ONLINE" ? "bg-emerald-500" : "bg-destructive"
                  )} />
                  <span className="text-[10px] font-black uppercase">{apiStatus === "ONLINE" ? "Connected" : "Disconnected"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" /> Username DigiFlazz
                  </Label>
                  <Input 
                    placeholder="username_digiflazz" 
                    className="h-11 bg-background rounded-xl font-bold border-border/50" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> API Key (Development/Prod)
                  </Label>
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="••••••••••••••••" 
                      className="h-11 bg-background rounded-xl font-bold border-border/50 pr-10" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)}
                    />
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
                <Button 
                  onClick={handleSaveSettings}
                  disabled={saving || loading}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20"
                >
                  <CheckCircle2 className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Synced SKU Table */}
      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30 bg-muted/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" /> Daftar SKU Terkoneksi ({filteredSyncedProducts.length})
              </CardTitle>
              <CardDescription className="text-xs font-bold">Daftar produk prabayar (prepaid) yang berhasil disinkronisasi dari provider DigiFlazz.</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari SKU, Nama, atau Brand..."
                className="pl-9 h-10 bg-background rounded-xl font-bold border-border/50 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/30 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4 pl-6">Kode SKU</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4">Nama Produk</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4">Brand</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4 text-right">Harga Buyer</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSyncedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-xs font-bold text-muted-foreground/60">
                      Belum ada SKU terhubung. Klik "Sinkron Produk" di pojok kanan atas untuk menyinkronkan data dengan DigiFlazz.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSyncedProducts.map((prod) => (
                    <TableRow key={prod.id} className="border-b border-border/20 hover:bg-muted/5 transition-colors">
                      <TableCell className="font-mono text-xs font-black text-primary py-4 pl-6">{prod.skuCode}</TableCell>
                      <TableCell className="font-bold text-xs py-4">{prod.productName}</TableCell>
                      <TableCell className="font-bold text-xs py-4">
                        <Badge variant="outline" className="text-[9px] font-black uppercase py-0.5">{prod.category}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-xs py-4">{prod.brand}</TableCell>
                      <TableCell className="font-mono text-xs font-black text-right py-4 text-neutral-200">
                        Rp {prod.price?.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                          prod.buyerProductStatus && prod.sellerProductStatus 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        )}>
                          {prod.buyerProductStatus && prod.sellerProductStatus ? "Aktif" : "Non-Aktif"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
