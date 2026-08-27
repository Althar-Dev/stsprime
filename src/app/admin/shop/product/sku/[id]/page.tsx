"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, doc, query, orderBy, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
  Zap,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SKUItem {
  id: string;
  name: string;
  skuCode: string;
  price: number;
  cost?: number;
  status: "Active" | "Inactive" | "FlashSale";
  order: number;
}

export default function ProductSKUPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSKU, setEditingSKU] = useState<SKUItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSkuCode, setFormSkuCode] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCost, setFormCost] = useState("");
  const [formOrder, setFormOrder] = useState("0");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive" | "FlashSale">("Active");

  // Fetch Product Info
  const productRef = useMemo(() => id && db ? doc(db, "products", id as string) : null, [id, db]);
  const { data: product, loading: loadingProduct } = useDoc<any>(productRef);

  // Fetch SKUs
  const skusRef = useMemo(() => id && db ? query(collection(db, "products", id as string, "skus"), orderBy("order", "asc")) : null, [id, db]);
  const { data: skus, loading: loadingSKUs } = useCollection<SKUItem>(skusRef);

  const filteredSKUs = skus.filter(sku => 
    sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingSKU(null);
    setFormName("");
    setFormSkuCode("");
    setFormPrice("");
    setFormCost("");
    setFormOrder(String(skus.length + 1));
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sku: SKUItem) => {
    setEditingSKU(sku);
    setFormName(sku.name);
    setFormSkuCode(sku.skuCode);
    setFormPrice(String(sku.price));
    setFormCost(String(sku.cost || ""));
    setFormOrder(String(sku.order));
    setFormStatus(sku.status);
    setIsModalOpen(true);
  };

  const handleSaveSKU = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !db) return;

    setSaving(true);
    const skuData = {
      name: formName,
      skuCode: formSkuCode,
      price: parseInt(formPrice) || 0,
      cost: parseInt(formCost) || 0,
      order: parseInt(formOrder) || 0,
      status: formStatus,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingSKU) {
        await setDoc(doc(db, "products", id as string, "skus", editingSKU.id), skuData, { merge: true });
      } else {
        await addDoc(collection(db, "products", id as string, "skus"), skuData);
      }
      
      toast({
        title: "Berhasil",
        description: `Varian SKU "${formName}" telah disimpan.`,
      });
      setIsModalOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSKU = async (sku: SKUItem) => {
    if (!confirm(`Hapus varian "${sku.name}"?`) || !id || !db) return;
    try {
      await deleteDoc(doc(db, "products", id as string, "skus", sku.id));
      toast({ title: "Dihapus", description: "Varian SKU berhasil dihapus." });
    } catch (err) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus varian." });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2">Active</Badge>;
      case "FlashSale":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2">Flash Sale</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2">Inactive</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="w-fit -ml-2 h-8 text-muted-foreground hover:text-primary gap-1 font-bold text-xs"
          >
            <ChevronLeft className="h-4 w-4" /> Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                {loadingProduct ? "Memuat..." : product?.name || "Varian SKU"}
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest">
                Manajemen Varian ID: <span className="text-foreground font-mono">{id}</span>
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-6 h-10 sm:h-12 shadow-lg shadow-primary/20 gap-2"
        >
          <Plus className="h-4 w-4" /> Tambah Varian
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Product Quick Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Ringkasan Produk</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">Kategori</span>
                <span className="text-sm font-black">{product?.category || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">Provider API</span>
                <span className="text-sm font-black text-primary">{product?.provider || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">Total SKU</span>
                <span className="text-sm font-black tabular-nums">{skus.length} Item</span>
              </div>
              <div className="pt-2">
                <Badge className={cn(
                  "font-black uppercase tracking-tighter px-3 py-1",
                  product?.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                )}>
                  Status: {product?.status || "Unknown"}
                </Badge>
              </div>
            </div>
          </Card>
          
          <Card className="bento-card border-primary/20 bg-primary/5 p-5">
             <div className="flex items-center gap-2 text-primary mb-2">
                <Zap className="h-4 w-4 fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Informasi</span>
             </div>
             <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
               Gunakan SKU Code yang sesuai dengan provider (DigiFlazz/Orderkuota) agar sistem dapat memproses transaksi secara otomatis.
             </p>
          </Card>
        </div>

        {/* SKU Table */}
        <Card className="lg:col-span-3 bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10 flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Daftar Varian Item</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Sesuaikan harga jual dan status untuk setiap paket digital.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari SKU atau Nama..."
                className="pl-9 h-9 bg-background border-border text-[11px] font-bold rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="text-[9px] font-black uppercase w-12 text-center">No</TableHead>
                    <TableHead className="text-[9px] font-black uppercase">Nama Varian</TableHead>
                    <TableHead className="text-[9px] font-black uppercase">Kode SKU</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-right">Harga Jual</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-center">Status</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingSKUs ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredSKUs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-xs font-bold text-muted-foreground">
                        Belum ada varian SKU. Klik "Tambah Varian" untuk memulai.
                      </TableCell>
                    </TableRow>
                  ) : filteredSKUs.map((sku, index) => (
                    <TableRow key={sku.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors group">
                      <TableCell className="text-center py-4 text-[11px] font-black text-muted-foreground">{sku.order || index + 1}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-black">{sku.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-mono text-[10px] font-black text-primary">{sku.skuCode}</TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs sm:text-sm font-black text-foreground tabular-nums">Rp {sku.price.toLocaleString()}</span>
                          {sku.cost && <span className="text-[9px] text-muted-foreground font-bold">Modal: Rp {sku.cost.toLocaleString()}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">{getStatusBadge(sku.status)}</TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(sku)} className="text-xs font-bold gap-2">
                              <Edit className="h-3.5 w-3.5 text-primary" /> Edit Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteSKU(sku)} className="text-xs font-bold text-destructive gap-2">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Varian
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-border/30 bg-muted/5">
             <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
               Total {filteredSKUs.length} varian aktif untuk produk ini.
             </p>
          </CardFooter>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-border bg-card p-0 overflow-hidden shadow-2xl">
          <div className="bg-primary/10 border-b border-border p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black tracking-tight">
                {editingSKU ? "Edit Varian SKU" : "Tambah Varian SKU Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-muted-foreground">
                Konfigurasi item paket digital untuk produk {product?.name}.
              </DialogDescription>
            </div>
          </div>

          <form onSubmit={handleSaveSKU} className="p-6 space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nama Varian (Tampil di Publik)</Label>
                <Input 
                  placeholder="Contoh: 172 Diamonds + 19 Bonus" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-11 bg-muted/30 border-border/50 rounded-xl font-bold text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kode SKU Provider</Label>
                  <Input 
                    placeholder="ML-86" 
                    value={formSkuCode} 
                    onChange={(e) => setFormSkuCode(e.target.value)}
                    className="h-11 bg-muted/30 border-border/50 rounded-xl font-mono font-black text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Urutan Tampil</Label>
                  <Input 
                    type="number"
                    value={formOrder} 
                    onChange={(e) => setFormOrder(e.target.value)}
                    className="h-11 bg-muted/30 border-border/50 rounded-xl font-black text-sm text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Harga Jual (IDR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black opacity-50">Rp</span>
                    <Input 
                      type="number"
                      placeholder="0" 
                      value={formPrice} 
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="h-11 pl-9 bg-muted/30 border-border/50 rounded-xl font-black text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Harga Modal (Opsional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black opacity-50">Rp</span>
                    <Input 
                      type="number"
                      placeholder="0" 
                      value={formCost} 
                      onChange={(e) => setFormCost(e.target.value)}
                      className="h-11 pl-9 bg-muted/30 border-border/50 rounded-xl font-black text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Item</Label>
                <div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/50">
                  {["Active", "FlashSale", "Inactive"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormStatus(s as any)}
                      className={cn(
                        "flex-1 h-9 rounded-lg text-[10px] font-black uppercase transition-all",
                        formStatus === s 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {s === "FlashSale" ? "Flash Sale" : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-12 rounded-xl font-bold text-xs uppercase tracking-widest"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="flex-[2] h-12 rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {editingSKU ? "Simpan Perubahan" : "Tambah Varian"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
