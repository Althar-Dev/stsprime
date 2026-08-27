
"use client";

import { useState, useEffect, useMemo } from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Database, 
  ShieldCheck, 
  Cloud, 
  ExternalLink, 
  CheckCircle2, 
  Lock, 
  KeyRound,
  HardDrive,
  Globe,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminR2StoragePage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  // State form
  const [accountId, setAccountId] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // Memoize document reference to prevent infinite re-renders
  const r2DocRef = useMemo(() => (db ? doc(db, "settings", "r2") : null), [db]);
  const { data: config, loading } = useDoc(r2DocRef);

  // Update local state when data is loaded
  useEffect(() => {
    if (config) {
      setAccountId(config.accountId || "");
      setAccessKeyId(config.accessKeyId || "");
      setSecretAccessKey(config.secretAccessKey || "");
      setBucketName(config.bucketName || "");
      setPublicUrl(config.publicUrl || "");
      setIsEnabled(!!config.isEnabled);
    }
  }, [config]);

  const handleSave = async () => {
    if (!db) return;
    
    setIsSaving(true);
    const data = {
      accountId: accountId.trim(),
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
      bucketName: bucketName.trim(),
      publicUrl: publicUrl.trim().replace(/\/$/, ""), // Bersihkan URL
      isEnabled,
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, "settings", "r2");
    
    setDoc(docRef, data, { merge: true })
      .then(() => {
        toast({
          title: "Berhasil Disimpan",
          description: "Konfigurasi R2 telah diperbarui di database.",
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Database className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Cloudflare R2 Storage
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Konfigurasi penyimpanan aset Cloudflare R2 untuk galeri dan media sistem.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 sm:gap-2 h-9 sm:h-10 border-border">
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Tes Koneksi
          </Button>
          <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
            <Button className="w-full rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-10">
              Console <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
        {/* Connection Settings */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" /> Kredensial Cloudflare R2
                  </CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs font-bold">Dapatkan kredensial S3 API dari Dashboard Cloudflare R2.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Database className="h-3 w-3" /> Account ID
                  </Label>
                  <Input 
                    placeholder="Contoh: f98a... (HANYA ID, bukan URL)" 
                    className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 text-xs sm:text-sm" 
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  />
                  <p className="text-[9px] text-muted-foreground font-bold">Dapatkan di Dashboard R2 &gt; Account ID (kolom kanan bawah).</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Access Key ID
                  </Label>
                  <Input 
                    placeholder="Access Key..." 
                    className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 text-xs sm:text-sm" 
                    value={accessKeyId}
                    onChange={(e) => setAccessKeyId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Secret Access Key
                  </Label>
                  <div className="relative">
                    <Input 
                      type={showSecret ? "text" : "password"} 
                      placeholder="Secret Key..." 
                      className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 pr-10 text-xs sm:text-sm" 
                      value={secretAccessKey}
                      onChange={(e) => setSecretAccessKey(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-1 top-1 h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center text-muted-foreground"
                    >
                      {showSecret ? <EyeOff className="h-4 w-4 opacity-50" /> : <Eye className="h-4 w-4 opacity-50" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Cloud className="h-3 w-3" /> Bucket Name
                  </Label>
                  <Input 
                    placeholder="Nama bucket Anda" 
                    className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 text-xs sm:text-sm" 
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Public URL Endpoint
                  </Label>
                  <Input 
                    placeholder="Contoh: cdn.stspoint.id" 
                    className="h-10 sm:h-11 bg-background rounded-xl font-bold border-border/50 text-xs sm:text-sm" 
                    value={publicUrl}
                    onChange={(e) => setPublicUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs sm:text-sm font-black text-foreground">Aktifkan Pengunggahan</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold leading-tight">Izinkan admin mengunggah file baru ke bucket ini.</p>
                  </div>
                  <Switch checked={isEnabled} onCheckedChange={setIsEnabled} className="shrink-0" />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full sm:w-auto h-10 sm:h-12 px-6 sm:px-10 rounded-xl font-black text-xs gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                  Simpan Konfigurasi R2
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Directory Status */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Struktur Folder</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Aset akan disimpan secara otomatis ke dalam struktur folder berikut.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {["banners", "icons", "backgrounds", "badges", "others"].map((folder, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-background border border-border/40">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <HardDrive className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-black capitalize truncate">{folder}/</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="bento-card border-primary/20 bg-primary/5 h-fit min-w-0">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-widest">Contoh URL Gambar Anda</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold leading-relaxed">
                Berikut adalah visualisasi bagaimana URL gambar Anda akan terbentuk berdasarkan domain yang Anda masukkan:
              </p>
              
              {publicUrl ? (
                <div className="p-3 sm:p-4 rounded-xl bg-background border border-border/50 space-y-2.5 sm:space-y-3 min-w-0">
                  <div className="space-y-1 min-w-0">
                    <Label className="text-[9px] font-black uppercase text-primary">URL Utama (Banners)</Label>
                    <code className="block p-2 bg-muted rounded-lg text-[9px] font-mono text-foreground break-all border border-border/30">
                      https://{publicUrl.replace(/^https?:\/\//, '')}/banners/promo-gaming.png
                    </code>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label className="text-[9px] font-black uppercase text-primary">URL Ikon (Icons)</Label>
                    <code className="block p-2 bg-muted rounded-lg text-[9px] font-mono text-foreground break-all border border-border/30">
                      https://{publicUrl.replace(/^https?:\/\//, '')}/icons/mlbb-diamond.png
                    </code>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-xl border border-dashed border-border flex items-center justify-center text-center">
                  <p className="text-[10px] font-bold text-muted-foreground italic">Masukkan Public URL untuk melihat pratinjau.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bento-card border-amber-500/30 bg-amber-500/5 h-fit min-w-0">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 shrink-0" />
                <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-widest">PENTING: Agar Gambar Muncul</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">1</div>
                  <p className="text-[10px] sm:text-[11px] font-bold leading-relaxed">
                    Masuk ke Cloudflare R2 Dashboard &gt; <strong>{bucketName || 'Bucket Anda'}</strong> &gt; Settings.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">2</div>
                  <p className="text-[10px] sm:text-[11px] font-bold leading-relaxed">
                    Cari bagian <strong>Public Access</strong>. Aktifkan (Allow Access) atau hubungkan Custom Domain.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">3</div>
                  <p className="text-[10px] sm:text-[11px] font-bold leading-relaxed">
                    Salin <strong>R2.dev Subdomain</strong> atau Custom Domain ke kolom <strong>Public URL Endpoint</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bento-card border-primary/20 bg-primary/5 h-fit min-w-0">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-widest">Kredensial S3 API</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div className="space-y-3 sm:space-y-4 min-w-0">
                <div className="space-y-1 min-w-0">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Endpoint API (Internal)</Label>
                  <code className="block p-2 bg-background border border-border/50 rounded-lg text-[9px] sm:text-[10px] font-mono text-primary truncate">
                    {accountId ? `https://${accountId.trim()}.r2.cloudflarestorage.com` : 'Menunggu Account ID...'}
                  </code>
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold leading-relaxed">
                  Endpoint di atas digunakan sistem untuk mengunggah file. Sedangkan Public URL digunakan browser untuk menampilkan gambar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
