
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
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      publicUrl,
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Penyimpanan", value: "24.5 GB", icon: HardDrive, color: "text-primary", trend: "75% Terisi" },
          { label: "Total Objek", value: "1,240 Aset", icon: Cloud, color: "text-blue-500", trend: "Banners & Icons" },
          { label: "Bandwidth (Bln)", value: "128.4 GB", icon: Globe, color: "text-emerald-500", trend: "Delivery Opt" },
          { label: "Koneksi R2", value: isEnabled ? "AKTIF" : "NONAKTIF", icon: ShieldCheck, color: isEnabled ? "text-emerald-500" : "text-destructive", trend: "API V4 Status" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter opacity-60">S3 API</Badge>
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
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
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
                    placeholder="my-bucket-name" 
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
                    placeholder="https://pub-..." 
                    className="h-11 bg-background rounded-xl font-bold border-border/50" 
                    value={publicUrl}
                    onChange={(e) => setPublicUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-foreground">Aktifkan Pengunggahan</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Izinkan admin mengunggah file baru ke bucket ini.</p>
                </div>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Simpan Konfigurasi R2
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Directory Status */}
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="text-lg font-black tracking-tight">Struktur Folder</CardTitle>
              <CardDescription className="text-xs font-bold">Daftar direktori aktif yang digunakan oleh sistem unggah otomatis.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {["banners", "icons", "backgrounds", "badges", "others"].map((folder, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/40 group hover:border-primary/30 transition-all">
                    <div className="flex flex-col items-center gap-3 text-center w-full">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Database className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-black capitalize">{folder}/</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="bento-card border-primary/20 bg-primary/5 h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Informasi R2</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
                <p className="text-[10px] font-bold text-blue-600 leading-tight">
                  Gunakan Token R2 dengan izin "Edit" agar sistem dapat melakukan penulisan (upload) dan pembacaan objek.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">S3 Endpoint</Label>
                  <code className="block p-2 bg-background border border-border/50 rounded-lg text-[10px] font-mono text-primary truncate">
                    {accountId ? `https://${accountId}.r2.cloudflarestorage.com` : 'Menunggu Account ID...'}
                  </code>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Keamanan Aset</Label>
                  <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
                    Semua aset yang diunggah melalui Admin Panel akan menggunakan visibilitas "Public" melalui Public URL jika dikonfigurasi, atau diakses via API.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-5 space-y-4">
            <h3 className="text-sm font-black tracking-widest uppercase">Panduan Konfigurasi</h3>
            <div className="space-y-3">
              {[
                "Buka Dashboard Cloudflare > R2",
                "Klik 'Create bucket' jika belum ada",
                "Klik 'Manage R2 API Tokens'",
                "Klik 'Create API token'",
                "Berikan izin 'Object Read & Write'",
                "Salin ID dan Keys ke formulir ini"
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-[11px] font-bold text-muted-foreground leading-tight">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
