
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
  Grid3X3, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  Gamepad2,
  CreditCard,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { R2UploadModal } from "@/components/admin/r2-upload-modal";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { format } from "date-fns";

export default function AdminIconsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const db = useFirestore();

  const iconsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "icons"), orderBy("updatedAt", "desc"));
  }, [db]);

  const { data: icons, loading } = useCollection<any>(iconsQuery);

  const filteredIcons = icons.filter(icon => {
    const matchesSearch = icon.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || icon.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleUploadSuccess = (url: string, filename: string) => {
    if (!db) return;
    const cleanName = filename.replace(/\.[^/.]+$/, "");
    const iconData = {
      name: cleanName,
      category: activeCategory === "all" ? "Game" : activeCategory,
      imageUrl: url,
      status: "Active",
      updatedAt: new Date().toISOString(),
    };

    addDoc(collection(db, "icons"), iconData)
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'icons',
          operation: 'create',
          requestResourceData: iconData
        }));
      });
  };

  const confirmDelete = () => {
    if (!db || !deleteId) return;
    deleteDoc(doc(db, "icons", deleteId)).catch(async (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `icons/${deleteId}`,
        operation: 'delete'
      }));
    });
    setDeleteId(null);
  };

  const handleClearAll = async () => {
    if (!db || icons.length === 0) return;
    setIsClearing(true);
    const batch = writeBatch(db);
    icons.forEach((icon) => {
      batch.delete(doc(db, "icons", icon.id));
    });

    batch.commit()
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'icons',
          operation: 'delete'
        }));
      })
      .finally(() => {
        setIsClearing(false);
        setIsClearAllOpen(false);
      });
  };

  const getStatusBadge = (status: string) => {
    return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Grid3X3 className="h-8 w-8 text-primary" /> Manajemen Ikon
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola pustaka aset visual dari Cloudflare R2.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="destructive"
            onClick={() => setIsClearAllOpen(true)}
            disabled={icons.length === 0 || loading}
            className="rounded-xl font-black text-xs uppercase tracking-widest px-6 gap-2"
          >
            <Eraser className="h-4 w-4" /> Hapus Semua
          </Button>
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2"
          >
            <Plus className="h-4 w-4" /> Upload Ikon R2
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Ikon", value: icons.length.toString(), icon: ImageIcon, color: "text-primary" },
          { label: "Ikon Game", value: icons.filter(i => i.category === "Game").length.toString(), icon: Gamepad2, color: "text-blue-500" },
          { label: "Ikon Pembayaran", value: icons.filter(i => i.category === "Payment").length.toString(), icon: CreditCard, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-black tabular-nums">{stat.value}</p>
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
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4">
              <CardTitle className="text-lg font-black tracking-tight">Koleksi Aset Ikon</CardTitle>
              <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Semua</TabsTrigger>
                  <TabsTrigger value="game" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Game</TabsTrigger>
                  <TabsTrigger value="payment" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Pembayaran</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="relative w-full md:w-64 self-end">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari ikon..." 
                className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              <Table className="min-w-[900px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/30">
                    <TableHead className="text-[10px] font-black uppercase pl-6 h-12">Ikon & Nama</TableHead>
                    <TableHead className="text-[10px] font-black uppercase h-12">Kategori</TableHead>
                    <TableHead className="text-[10px] font-black uppercase h-12">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase h-12">Update</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-right pr-6 h-12">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIcons.map((icon) => (
                    <TableRow key={icon.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/50 shrink-0 bg-muted">
                            <Image src={icon.imageUrl} alt={icon.name} fill className="object-cover" unoptimized />
                          </div>
                          <span className="text-xs font-black truncate">{icon.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase px-2 rounded-md bg-muted/30">{icon.category}</Badge>
                      </TableCell>
                      <TableCell className="py-4">{getStatusBadge(icon.status)}</TableCell>
                      <TableCell className="py-4 text-xs font-bold text-muted-foreground">
                        {icon.updatedAt ? format(new Date(icon.updatedAt), "dd MMM yyyy") : "-"}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem className="text-xs font-bold gap-2"><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-xs font-bold text-destructive gap-2 cursor-pointer"
                              onClick={() => setDeleteId(icon.id)}
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
        folder="icons"
        onSuccess={handleUploadSuccess}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-border bg-card">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="font-black text-xl tracking-tight">Hapus Ikon?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus aset ikon ini? Data referensi di database akan hilang secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-border">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              Hapus Sekarang
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
            <AlertDialogTitle className="font-black text-xl tracking-tight">Hapus Seluruh Ikon?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus **SEMUA** {icons.length} ikon dari database. Ini akan merusak tampilan produk yang menggunakan ikon tersebut.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-border">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAll}
              disabled={isClearing}
              className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              {isClearing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Bersihkan Semua"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
