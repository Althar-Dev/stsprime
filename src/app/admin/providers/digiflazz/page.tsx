
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
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

  const [selectedCmdFilter, setSelectedCmdFilter] = useState<"all" | "prepaid" | "pasca">("all");

  // Pagination states (Options: 50, 100, 250)
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCmdFilter, pageSize]);

  // Sync Products handler (Prepaid & Pascabayar)
  const handleSyncProducts = async () => {
    setSyncing(true);
    setSyncStatus("Mengunduh Prabayar & Pascabayar...");
    try {
      // Call Server Action to sync directly to SQLite database/product.db
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
        title: "Sinkronisasi Berhasil!",
        description: `Total ${result.count} SKU tersimpan ke database/product.db (${result.prepaidCount} Prabayar, ${result.pascaCount} Pascabayar).`,
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
    const matchesQuery = (
      (p.productName || "").toLowerCase().includes(query) ||
      (p.skuCode || "").toLowerCase().includes(query) ||
      (p.brand || "").toLowerCase().includes(query) ||
      (p.category || "").toLowerCase().includes(query)
    );
    const matchesCmd = selectedCmdFilter === "all" || p.cmdType === selectedCmdFilter;
    return matchesQuery && matchesCmd;
  });

  // Calculate paginated products
  const totalItems = filteredSyncedProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProducts = filteredSyncedProducts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Server className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Integrasi DigiFlazz
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola kredensial API, sinkronisasi SKU produk, dan saldo deposit provider.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleSyncProducts}
            disabled={syncing || loading}
            className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", syncing && "animate-spin")} />
            {syncing ? syncStatus || "Sinkron..." : "Sinkron Produk"}
          </Button>
          <a href="https://member.digiflazz.com/buyer-area" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
            <Button className="w-full rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-10">
              Dashboard <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Provider Health Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
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

      <div className="space-y-6 w-full max-w-full min-w-0">
        <div className="space-y-6">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" /> Pengaturan Koneksi API
                  </CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs font-bold">Pastikan kredensial sesuai dengan yang ada di Member Area DigiFlazz.</CardDescription>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border shrink-0",
                  apiStatus === "ONLINE"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}>
                  <div className={cn(
                    "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full animate-pulse",
                    apiStatus === "ONLINE" ? "bg-emerald-500" : "bg-destructive"
                  )} />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase">{apiStatus === "ONLINE" ? "Connected" : "Disconnected"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3 shrink-0" /> Username DigiFlazz
                  </Label>
                  <Input
                    placeholder="username_digiflazz"
                    className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 text-xs sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3 shrink-0" /> API Key (Development/Prod)
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 pr-10 text-xs sm:text-sm"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 sm:h-9 sm:w-9 rounded-lg"><Settings2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-50" /></Button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-black text-foreground">Production Mode</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold">Aktifkan untuk memproses transaksi menggunakan saldo asli.</p>
                </div>
                <Switch checked={isProduction} onCheckedChange={setIsProduction} />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving || loading}
                  className="w-full sm:w-auto h-10 sm:h-11 px-6 sm:px-8 rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                >
                  <CheckCircle2 className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Synced SKU Table */}
      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
        <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <Server className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" /> Daftar SKU ({filteredSyncedProducts.length})
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Daftar produk prabayar & pascabayar.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex p-1 bg-background rounded-xl border border-border/50">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCmdFilter("all")}
                  className={cn("h-7 sm:h-8 px-3 rounded-lg text-[10px] font-black uppercase", selectedCmdFilter === "all" && "bg-primary text-primary-foreground shadow")}
                >
                  Semua ({syncedProducts.length})
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCmdFilter("prepaid")}
                  className={cn("h-7 sm:h-8 px-3 rounded-lg text-[10px] font-black uppercase", selectedCmdFilter === "prepaid" && "bg-primary text-primary-foreground shadow")}
                >
                  Prabayar ({syncedProducts.filter(p => p.cmdType === "prepaid").length})
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCmdFilter("pasca")}
                  className={cn("h-7 sm:h-8 px-3 rounded-lg text-[10px] font-black uppercase", selectedCmdFilter === "pasca" && "bg-primary text-primary-foreground shadow")}
                >
                  Pascabayar ({syncedProducts.filter(p => p.cmdType === "pasca").length})
                </Button>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari SKU, Nama, atau Brand..."
                  className="pl-9 sm:pl-10 h-9 sm:h-10 bg-background rounded-xl font-bold border-border/50 text-[11px] sm:text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[800px] whitespace-nowrap">
              <TableHeader>
                <TableRow className="border-b border-border/30 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4 pl-6">Kode SKU</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4">Tipe</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4">Nama Produk</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4">Brand</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4 text-right">Harga / Admin</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider py-4 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-xs font-bold text-muted-foreground/60">
                      Belum ada SKU terhubung. Klik "Sinkron Produk" di pojok kanan atas untuk menyinkronkan data dengan DigiFlazz.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((prod) => (
                    <TableRow key={prod.id} className="border-b border-border/20 hover:bg-muted/5 transition-colors">
                      <TableCell className="font-mono text-xs font-black text-primary py-4 pl-6">{prod.skuCode}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase py-0.5 px-2 rounded-md",
                          prod.cmdType === "pasca" ? "border-purple-500/30 text-purple-400 bg-purple-500/10" : "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
                        )}>
                          {prod.cmdType === "pasca" ? "Pasca" : "Prabayar"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-xs py-4">{prod.productName}</TableCell>
                      <TableCell className="font-bold text-xs py-4">
                        <Badge variant="outline" className="text-[9px] font-black uppercase py-0.5">{prod.category}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-xs py-4">{prod.brand}</TableCell>
                      <TableCell className="font-mono text-xs font-black text-right py-4 text-neutral-200">
                        {prod.cmdType === "pasca" ? (
                          <div className="flex flex-col items-end">
                            <span>Admin: Rp {(prod.admin || 0).toLocaleString("id-ID")}</span>
                            <span className="text-[9px] text-emerald-400 font-bold">Komisi: Rp {(prod.commission || 0).toLocaleString("id-ID")}</span>
                          </div>
                        ) : (
                          <span>Rp {(prod.price || 0).toLocaleString("id-ID")}</span>
                        )}
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

        {/* Pagination Footer */}
        <CardFooter className="p-4 border-t border-border/30 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-[11px] whitespace-nowrap">Tampilkan baris:</span>
            <div className="flex items-center gap-1 p-0.5 bg-background rounded-xl border border-border/50">
              {[50, 100, 250].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPageSize(size)}
                  className={cn(
                    "h-7 px-2.5 rounded-lg text-[10px] font-black",
                    pageSize === size && "bg-primary text-primary-foreground shadow"
                  )}
                >
                  {size}
                </Button>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground hidden md:inline">
              Menampilkan {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} dari {totalItems} SKU
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] text-muted-foreground md:hidden">
              {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border-border/50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border-border/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-[11px] font-black px-2 tabular-nums">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 rounded-lg border-border/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 rounded-lg border-border/50"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
