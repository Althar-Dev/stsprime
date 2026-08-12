
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Database, 
  Settings2, 
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
  Loader2,
  Info
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
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" /> R2 Storage Settings
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Konfigurasi penyimpanan aset Cloudflare R2 untuk galeri dan media sistem.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 h-10 border-border">
            <RefreshCw className="h-4 w-4" /> Tes Koneksi
          </Button>
          <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2 h-10">
              Console R2 <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Connection Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-primary" /> Kredensial Cloudflare R2
                  </CardTitle>
                  <CardDescription className="text-xs font-bold">Dapatkan kredensial S3 API dari Dashboard Cloudflare R2.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Database className="h-3 w-3" /> Account ID
                  </Label>
                  <Input 
                    placeholder="Contoh: f98a... (Ada di Dashboard R2)" 
                    className="h-11 bg-background rounded-xl font-bold border-border/50" 
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Access Key ID
                  </Label>
                  <Input 
                    placeholder="Access Key..." 
                    className="h-11 bg-background rounded-xl font-bold border-border/50" 
                    value={accessKeyId}
                    onChange={(e) => setAccessKeyId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Secret Access Key
                  </Label>
                  <div className="relative">
                    <Input 
                      type={showSecret ? "text" : "password"} 
                      placeholder="Secret Key..." 
                      className="h-11 bg-background rounded-xl font-bold border-border/50 pr-10" 
                      value={secretAccessKey}
                      onChange={(e) => setSecretAccessKey(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-1 top-1 h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground"
                    >
                      {showSecret ? <EyeOff className="h-4 w-4 opacity-50" /> : <Eye className="h-4 w-4 opacity-50" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Cloud className="h-3 w-3" /> Bucket Name
                  </Label>
                  <Input 
                    placeholder="Nama bucket Anda" 
                    className="h-11 bg-background rounded-xl font-bold border-border/50" 
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Public URL Endpoint
                  </Label>
                  <Input 
                    placeholder="Contoh: cdn.stspoint.id" 
                    className="h-11 bg-background rounded-xl font-bold border-border/50" 
                    value={publicUrl}
                    onChange={(e) => setPublicUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-foreground">Aktifkan Pengunggahan</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Izinkan admin mengunggah file baru ke bucket ini.</p>
                  </div>
                  <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full sm:w-auto h-12 px-10 rounded-xl font-black gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                  Simpan Konfigurasi R2
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Directory Status */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="text-lg font-black tracking-tight">Struktur Folder</CardTitle>
              <CardDescription className="text-xs font-bold">Aset akan disimpan secara otomatis ke dalam struktur folder berikut.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {["banners", "icons", "backgrounds", "badges", "others"].map((folder, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-background border border-border/40">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <HardDrive className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-[11px] font-black capitalize">{folder}/</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="bento-card border-amber-500/30 bg-amber-500/5 h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">PENTING: Agar Gambar Muncul</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">1</div>
                  <p className="text-[11px] font-bold leading-relaxed">
                    Masuk ke Cloudflare R2 Dashboard &gt; <strong>{bucketName || 'Bucket Anda'}</strong> &gt; Settings.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">2</div>
                  <p className="text-[11px] font-bold leading-relaxed">
                    Cari bagian <strong>Public Access</strong>. Aktifkan (Allow Access) atau hubungkan Custom Domain.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">3</div>
                  <p className="text-[11px] font-bold leading-relaxed">
                    Salin <strong>R2.dev Subdomain</strong> atau Custom Domain ke kolom <strong>Public URL Endpoint</strong> di formulir sebelah kiri.
                  </p>
                </div>
              </div>
              
              {publicUrl && (
                <div className="p-3 rounded-xl bg-background border border-border/50 space-y-2">
                  <Label className="text-[9px] font-black uppercase text-muted-foreground">Pratinjau URL Gambar:</Label>
                  <code className="block p-2 bg-muted rounded-lg text-[9px] font-mono text-primary break-all">
                    https://{publicUrl.replace(/^https?:\/\//, '')}/banners/promo.png
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bento-card border-primary/20 bg-primary/5 h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Kredensial S3 API</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Endpoint API (Internal)</Label>
                  <code className="block p-2 bg-background border border-border/50 rounded-lg text-[10px] font-mono text-primary truncate">
                    {accountId ? `https://${accountId}.r2.cloudflarestorage.com` : 'Menunggu Account ID...'}
                  </code>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
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
