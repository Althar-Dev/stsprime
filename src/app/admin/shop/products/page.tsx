"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Package,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Power,
  Trash2,
  Gamepad2,
  Ticket,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Image as ImageIcon,
  Type,
  LayoutGrid,
  Activity,
  Link as LinkIcon
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: "Active" | "Inactive" | "Maintenance";
  items: number;
  sales: number;
  image: string;
  desc?: string;
  updatedAt?: string;
}

const INITIAL_SEED_PRODUCTS: ProductItem[] = [
  {
    id: "mlbb",
    name: "Mobile Legends: Bang Bang",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Active",
    items: 42,
    sales: 1240,
    image: "/img/popular/mlbb.png"
  },
  {
    id: "freefire",
    name: "Free Fire",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Active",
    items: 38,
    sales: 980,
    image: "/img/popular/ff.png"
  },
  {
    id: "valorant",
    name: "Valorant Points",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Active",
    items: 25,
    sales: 760,
    image: "/img/popular/valorant.png"
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    category: "Topup Game",
    provider: "DigiFlazz",
    status: "Active",
    items: 18,
    sales: 540,
    image: "/img/popular/genshin.png"
  }
];

export default function AdminProductsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination states
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dialog States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form States
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Topup Game");
  const [formProvider, setFormProvider] = useState("DigiFlazz");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive" | "Maintenance">("Active");
  const [formItems, setFormItems] = useState("10");
  const [formImage, setFormImage] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (db) {
        const colRef = collection(db, "products");
        const snap = await getDocs(colRef);
        
        if (snap.empty) {
          setProducts(INITIAL_SEED_PRODUCTS);
        } else {
          const list: ProductItem[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as ProductItem);
          });
          setProducts(list);
        }
      } else {
        setProducts(INITIAL_SEED_PRODUCTS);
      }
    } catch (err) {
      setProducts(INITIAL_SEED_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [db]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, pageSize]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormId("");
    setFormName("");
    setFormCategory("Topup Game");
    setFormProvider("DigiFlazz");
    setFormStatus("Active");
    setFormItems("10");
    setFormImage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setFormId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormProvider(product.provider);
    setFormStatus(product.status);
    setFormItems(product.items.toString());
    setFormImage(product.image || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: "ID Produk dan Nama Produk wajib diisi.",
      });
      return;
    }

    setSavingProduct(true);
    const productData: ProductItem = {
      id: formId.toLowerCase().trim(),
      name: formName,
      category: formCategory,
      provider: formProvider,
      status: formStatus,
      items: parseInt(formItems) || 0,
      sales: editingProduct ? editingProduct.sales : 0,
      image: formImage,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (db) {
        await setDoc(doc(db, "products", productData.id), productData, { merge: true });
      }
      setProducts((prev) => {
        const existing = prev.findIndex((p) => p.id === productData.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = productData;
          return updated;
        }
        return [productData, ...prev];
      });
      toast({
        title: editingProduct ? "Produk Diperbarui" : "Produk Ditambahkan",
        description: `Katalog "${productData.name}" berhasil disimpan.`,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat menyimpan ke database." });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleStatus = async (product: ProductItem) => {
    const nextStatus = product.status === "Active" ? "Maintenance" : "Active";
    try {
      if (db) {
        await setDoc(doc(db, "products", product.id), { status: nextStatus }, { merge: true });
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
      );
      toast({ title: "Status Diubah", description: `Status "${product.name}" diubah menjadi ${nextStatus}.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Gagal mengubah status." });
    }
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) return;
    try {
      if (db) {
        await deleteDoc(doc(db, "products", product.id));
      }
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast({ title: "Produk Dihapus", description: `Katalog "${product.name}" berhasil dihapus.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menghapus produk." });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md">Active</Badge>;
      case "Maintenance":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md">Maintenance</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md">Inactive</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Package className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Manajemen Produk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola katalog game, voucher, dan integrasi API provider.</p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-11 shadow-lg shadow-primary/20 gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {/* Product List Table Card */}
      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
        <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-0.5">
                <CardTitle className="text-base sm:text-lg font-black tracking-tight">Katalog Layanan Digital</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs font-bold">Daftar seluruh produk yang tampil pada halaman utama pengguna.</CardDescription>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Produk..."
                  className="pl-9 sm:pl-10 h-9 sm:h-10 bg-background border-border text-[11px] sm:text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[850px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Produk</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Kategori</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Provider</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Varian</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                    <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50 flex items-center justify-center p-1">
                          <img src={product.image || "/img/popular/mlbb.png"} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-black truncate">{product.name}</span>
                          <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground font-bold">{product.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 text-xs font-bold">{product.category}</TableCell>
                    <TableCell className="py-3 sm:py-4 text-xs font-bold">{product.provider}</TableCell>
                    <TableCell className="py-3 sm:py-4 text-xs font-black tabular-nums">{product.items} SKU</TableCell>
                    <TableCell className="py-3 sm:py-4">{getStatusBadge(product.status)}</TableCell>
                    <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Produk</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEditModal(product)} className="text-xs font-bold cursor-pointer gap-2">
                            <Edit className="h-3.5 w-3.5 text-primary" /> Edit Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(product)} className="text-xs font-bold cursor-pointer gap-2">
                            <Power className="h-3.5 w-3.5 text-amber-500" /> Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="text-xs font-bold cursor-pointer gap-2 text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Hapus Produk
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
        <CardFooter className="p-4 border-t border-border/30 bg-muted/5 flex items-center justify-between">
           <p className="text-[10px] font-bold text-muted-foreground">Menampilkan {paginatedProducts.length} dari {totalItems} produk.</p>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 rounded-lg px-2"><ChevronLeft className="h-4 w-4"/></Button>
             <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="h-8 rounded-lg px-2"><ChevronRight className="h-4 w-4"/></Button>
           </div>
        </CardFooter>
      </Card>

      {/* Modal Tambah / Edit Produk - Refactored for Responsiveness */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] p-0 rounded-2xl sm:rounded-3xl bg-card border-border overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
          {/* Header - Sticky */}
          <div className="bg-primary/10 border-b border-border p-5 sm:p-6 flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-black tracking-tight text-foreground truncate">
                {editingProduct ? "Edit Detail Produk" : "Tambah Produk Baru"}
              </DialogTitle>
              <DialogDescription className="text-[10px] sm:text-xs font-bold text-muted-foreground mt-0.5 truncate">
                {editingProduct ? `ID: ${editingProduct.id}` : "Konfigurasi layanan digital baru."}
              </DialogDescription>
            </div>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8 modal-scrollbar">
              
              {/* Visual Group */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-primary">
                  <ImageIcon className="h-3 w-3" /> Identitas Visual
                </div>
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl sm:rounded-3xl bg-muted/40 border border-border/60 flex items-center justify-center relative group overflow-hidden shrink-0">
                    {formImage ? (
                      <img 
                        src={formImage} 
                        alt="Preview" 
                        className="w-full h-full object-contain p-3 sm:p-4" 
                        onError={(e) => (e.target as HTMLImageElement).src = "/img/popular/mlbb.png"}
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <LinkIcon className="h-3 w-3" /> URL Gambar Ikon
                      </Label>
                      <Input
                        placeholder="Contoh: /img/mlbb.png atau https://..."
                        className="h-10 sm:h-11 bg-background rounded-xl text-xs sm:text-sm font-bold border-border/50 focus:border-primary/50"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="opacity-30" />

              {/* Data Group */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-primary">
                  <LayoutGrid className="h-3 w-3" /> Detail Layanan
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID Produk (SKU Slug)</Label>
                    <Input
                      placeholder="contoh-id-game"
                      className="h-10 sm:h-11 bg-muted/30 rounded-xl font-mono text-xs sm:text-sm font-black border-border/50"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      disabled={!!editingProduct}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pilih Provider API</Label>
                    <select
                      value={formProvider}
                      onChange={(e) => setFormProvider(e.target.value)}
                      className="h-10 sm:h-11 w-full bg-background rounded-xl font-bold border border-border/50 text-xs sm:text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="DigiFlazz">DigiFlazz</option>
                      <option value="Orderkuota">Orderkuota</option>
                      <option value="Internal">Internal / Manual</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Type className="h-3 w-3" /> Nama Produk Publik
                  </Label>
                  <Input
                    placeholder="Masukkan nama produk..."
                    className="h-10 sm:h-11 bg-background rounded-xl text-xs sm:text-sm font-black border-border/50"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kategori Produk</Label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="h-10 sm:h-11 w-full bg-background rounded-xl font-bold border border-border/50 text-xs sm:text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="Topup Game">Topup Game</option>
                      <option value="Voucher">Voucher Digital</option>
                      <option value="Pulsa/Data">Pulsa & Data</option>
                      <option value="PLN & Tagihan">PLN & Tagihan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Publikasi</Label>
                    <select
                      value={formStatus}
                      onChange={(e: any) => setFormStatus(e.target.value)}
                      className="h-10 sm:h-11 w-full bg-background rounded-xl font-bold border border-border/50 text-xs sm:text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="Active">Published (Aktif)</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Draft (Non-Aktif)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Activity className="h-3 w-3" /> Jumlah Varian SKU
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      placeholder="10"
                      className="h-10 sm:h-11 bg-background rounded-xl text-xs sm:text-sm font-black border-border/50 w-24 sm:w-28"
                      value={formItems}
                      onChange={(e) => setFormItems(e.target.value)}
                    />
                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground italic leading-tight">Mewakili total item unik di sisi provider.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Sticky */}
            <div className="p-5 sm:p-6 border-t border-border bg-muted/10 shrink-0">
              <div className="flex gap-3 sm:gap-4 max-w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-11 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-muted/50"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={savingProduct}
                  className="flex-[2] h-11 rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                >
                  {savingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {editingProduct ? "Simpan Perubahan" : "Publikasikan"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
