
"use client";

import { useState, useMemo } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Image as ImageIcon,
  ArrowUpCircle,
  Loader2,
  AlertTriangle,
  Eraser
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
import { R2UploadModal } from "@/components/admin/r2-upload-modal";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { format } from "date-fns";

export default function AdminBannersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const db = useFirestore();

  const bannersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "banners"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: banners, loading } = useCollection<any>(bannersQuery);

  const filteredBanners = banners.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSuccess = (url: string, filename: string) => {
    if (!db) return;
    const cleanTitle = filename.replace(/\.[^/.]+$/, "");
    const bannerData = {
      title: cleanTitle,
      imageUrl: url,
      link: "/",
      status: "Active",
      clicks: 0,
      order: banners.length + 1,
      createdAt: new Date().toISOString(),
    };

    addDoc(collection(db, "banners"), bannerData)
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'banners',
          operation: 'create',
          requestResourceData: bannerData
        }));
      });
  };

  const confirmDelete = () => {
    if (!db || !deleteId) return;
    deleteDoc(doc(db, "banners", deleteId)).catch(async (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `banners/${deleteId}`,
        operation: 'delete'
      }));
    });
    setDeleteId(null);
  };

  const handleClearAll = async () => {
    if (!db || banners.length === 0) return;
    setIsClearing(true);
    const batch = writeBatch(db);
    banners.forEach((b) => {
      batch.delete(doc(db, "banners", b.id));
    });

    batch.commit()
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'banners',
          operation: 'delete'
        }));
      })
      .finally(() => {
        setIsClearing(false);
        setIsClearAllOpen(false);
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] uppercase font-black">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Monitor className="h-8 w-8 text-primary" /> Manajemen Banner
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola slider promo utama dari Cloudflare R2.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="destructive"
            onClick={() => setIsClearAllOpen(true)}
            disabled={banners.length === 0 || loading}
            className="rounded-xl font-black text-xs uppercase tracking-widest px-6 gap-2"
          >
            <Eraser className="h-4 w-4" /> Hapus Semua
          </Button>
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2"
          >
            <Plus className="h-4 w-4" /> Upload Banner R2
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Banner", value: banners.length.toString(), icon: ImageIcon, color: "text-primary" },
          { label: "Banner Aktif", value: banners.filter(b => b.status === "Active").length.toString(), icon: ArrowUpCircle, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-black tabular-nums">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center">
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black tracking-tight">Daftar Visual Hero Section</CardTitle>
              <CardDescription className="text-xs font-bold">Data real-time dari database STSPrime.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari judul..." 
                  className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Menyelaraskan Galeri...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Visual & Judul</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Urutan</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Klik</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Dibuat</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBanners.map((banner) => (
                    <TableRow key={banner.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-32 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-muted">
                            <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black truncate max-w-[200px]">{banner.title}</span>
                            <span className="text-[10px] text-primary font-bold flex items-center gap-1 mt-1">
                              <ExternalLink className="h-3 w-3" /> {banner.link}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-black tabular-nums">{banner.order}</span>
                      </TableCell>
                      <TableCell className="py-4">{getStatusBadge(banner.status)}</TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-black tabular-nums">{banner.clicks?.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-bold text-muted-foreground">
                          {banner.createdAt ? format(new Date(banner.createdAt), "dd MMM yyyy") : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border">
                            <DropdownMenuItem className="text-xs font-bold gap-2"><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-xs font-bold text-destructive gap-2 cursor-pointer"
                              onClick={() => setDeleteId(banner.id)}
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
        folder="banners"
        onSuccess={handleUploadSuccess}
      />

      {/* Dialog Konfirmasi Hapus Satu */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-border bg-card">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="font-black text-xl tracking-tight">Hapus Banner?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus aset banner secara permanen dari database. Gambar di R2 tetap ada namun tidak akan muncul lagi di aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-border">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              Ya, Hapus Banner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Hapus SEMUA */}
      <AlertDialog open={isClearAllOpen} onOpenChange={setIsClearAllOpen}>
        <AlertDialogContent className="rounded-3xl border-border bg-card">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
              <Eraser className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="font-black text-xl tracking-tight">Bersihkan Semua Banner?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-xs text-muted-foreground leading-relaxed">
              PERHATIAN: Anda akan menghapus **SELURUH** {banners.length} data banner dari database. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-border">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAll}
              disabled={isClearing}
              className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              {isClearing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus Semua"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
