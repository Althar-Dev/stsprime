"use client";

import { useState, useMemo } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy, writeBatch, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileImage,
  FolderKanban,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Upload,
  Layers,
  Copy,
  Loader2,
  AlertTriangle,
  Eraser,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { R2UploadModal } from "@/components/admin/r2-upload-modal";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { format } from "date-fns";
import { deleteBatchFromR2 } from "@/app/actions/r2-actions";

export default function AdminOtherAssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  const assetsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "others"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: assets, loading } = useCollection<any>(assetsQuery);

  const filteredAssets = assets.filter(asset =>
    asset.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSuccess = (url: string, filename: string) => {
    if (!db) return;
    const cleanName = filename.replace(/\.[^/.]+$/, "");
    const assetData = {
      name: cleanName,
      category: "Tutorial",
      imageUrl: url,
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    addDoc(collection(db, "others"), assetData)
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'others',
          operation: 'create',
          requestResourceData: assetData
        }));
      });
  };

  const confirmDelete = () => {
    if (!db || !deleteId) return;
    deleteDoc(doc(db, "others", deleteId)).catch(async (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `others/${deleteId}`,
        operation: 'delete'
      }));
    });
    setDeleteId(null);
  };

  const handleClearAll = async () => {
    if (!db || assets.length === 0) return;
    setIsClearing(true);

    try {
      const configSnap = await getDoc(doc(db, "settings", "r2"));
      if (!configSnap.exists()) throw new Error("Konfigurasi R2 tidak ditemukan.");

      const config = configSnap.data() as any;
      const keysToDelete = assets.map((asset: any) => {
        const urlParts = asset.imageUrl.split('/');
        return `others/${urlParts[urlParts.length - 1]}`;
      });

      await deleteBatchFromR2(keysToDelete, {
        accountId: config.accountId,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        bucketName: config.bucketName,
        publicUrl: config.publicUrl
      });

      const batch = writeBatch(db);
      assets.forEach((asset) => {
        batch.delete(doc(db, "others", asset.id));
      });
      await batch.commit();

    } catch (error: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'others',
        operation: 'delete'
      }));
    } finally {
      setIsClearing(false);
      setIsClearAllOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Live</Badge>;
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL Disalin", description: "Link aset telah disalin ke clipboard." });
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <FolderKanban className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Galeri Aset Lainnya
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola gambar logo, latar dekoratif, dan elemen UI pendukung.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="destructive"
            onClick={() => setIsClearAllOpen(true)}
            disabled={assets.length === 0 || loading || isClearing}
            className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 gap-1.5 sm:gap-2 h-9 sm:h-11"
          >
            {isClearing ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Eraser className="h-3.5 w-3.5 sm:h-4 sm:w-4" />} Hapus Semua
          </Button>
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="flex-1 sm:flex-initial rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest px-4 sm:px-6 shadow-lg shadow-primary/20 gap-1.5 sm:gap-2 h-9 sm:h-11"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Upload Aset R2
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Total Aset", value: assets.length.toString(), icon: Layers, color: "text-primary" },
          { label: "Storage Status", value: "Connected", icon: Upload, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 flex items-center justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-xl font-black truncate">{stat.value}</p>
              </div>
              <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-muted/30 flex items-center justify-center shrink-0">
                <stat.icon className={cn("h-4 w-4 sm:h-6 sm:w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
        <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <CardTitle className="text-base sm:text-lg font-black tracking-tight">Katalog Aset Pendukung</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama..."
                className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-9 sm:h-10 bg-background border-border text-[11px] sm:text-xs font-bold rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          {loading ? (
            <div className="py-16 sm:py-20 flex flex-col items-center justify-center gap-3 sm:gap-4">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-50">Menyelaraskan Galeri...</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[800px] whitespace-nowrap">
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/30">
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase pl-4 sm:pl-6 h-10 sm:h-12">Pratampil Aset</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase h-10 sm:h-12">Nama & ID</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase h-10 sm:h-12">Kategori</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase h-10 sm:h-12 text-center">Status</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-black uppercase text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center shrink-0">
                          <Image src={asset.imageUrl} alt={asset.name} fill className="object-contain p-1" unoptimized />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black tracking-tight">{asset.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">{asset.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase px-2 rounded-md bg-muted/30">{asset.category}</Badge>
                      </TableCell>
                      <TableCell className="py-4 text-center">{getStatusBadge(asset.status)}</TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuItem className="text-xs font-bold gap-2" onClick={() => copyUrl(asset.imageUrl)}><Copy className="h-3.5 w-3.5" /> Salin URL</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs font-bold text-destructive gap-2 cursor-pointer"
                              onClick={() => setDeleteId(asset.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <R2UploadModal
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        folder="others"
        onSuccess={handleUploadSuccess}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-border bg-card">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="font-black text-xl tracking-tight">Hapus Aset Tambahan?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-xs text-muted-foreground leading-relaxed">
              Aset ini mungkin digunakan di modul marketing atau tutorial. Menghapus referensi ini akan merusak tampilan pada halaman terkait. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-border">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              Hapus Aset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isClearAllOpen} onOpenChange={setIsClearAllOpen}>
        <AlertDialogContent className="rounded-3xl border-border bg-card">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
              <Eraser className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="font-black text-xl tracking-tight">Hapus Semua Aset Tambahan?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus **{assets.length}** data aset dari database **DAN** Cloudflare R2 secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-border">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              disabled={isClearing}
              className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              {isClearing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus Semua & R2"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
