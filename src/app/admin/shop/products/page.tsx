"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy
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
  Filter,
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
  Image as ImageIcon
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
import { getSyncedProductsFromSQLite } from "@/app/actions/digiflazz-actions";

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
  },
  {
    id: "steam",
    name: "Steam Wallet Code (IDR)",
    category: "Voucher",
    provider: "DigiFlazz",
    status: "Active",
    items: 12,
    sales: 430,
    image: "/img/popular/steam.png"
  },
  {
    id: "pln",
    name: "Token & Tagihan PLN",
    category: "PLN & Tagihan",
    provider: "DigiFlazz",
    status: "Active",
    items: 15,
    sales: 2150,
    image: "/img/popular/pln.png"
  },
  {
    id: "telkomsel",
    name: "Pulsa & Data Telkomsel",
    category: "Pulsa/Data",
    provider: "DigiFlazz",
    status: "Active",
    items: 30,
    sales: 3100,
    image: "/img/popular/telkomsel.png"
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    category: "Voucher",
    provider: "Internal",
    status: "Inactive",
    items: 5,
    sales: 120,
    image: "/img/popular/spotify.png"
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

  // Load Products from Firestore with permission-safe fallback
  const loadProducts = async () => {
    setLoading(true);
    try {
      if (db) {
        const colRef = collection(db, "products");
        const snap = await getDocs(colRef);
        
        if (snap.empty) {
          try {
            for (const item of INITIAL_SEED_PRODUCTS) {
              await setDoc(doc(db, "products", item.id), item);
            }
          } catch (seedErr) {
            console.warn("Firestore seed notice:", seedErr);
          }
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
      console.warn("Firestore permission/connection notice, using default seed catalog:", err);
      setProducts(INITIAL_SEED_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [db]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, pageSize]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormId(`prd-${Date.now().toString().slice(-4)}`);
    setFormName("");
    setFormCategory("Topup Game");
    setFormProvider("DigiFlazz");
    setFormStatus("Active");
    setFormItems("10");
    setFormImage("/img/popular/mlbb.png");
    setIsModalOpen(true);
  };

  // Open Edit Modal
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

  // Save / Update Product
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
      image: formImage || "/img/popular/mlbb.png",
      updatedAt: new Date().toISOString(),
    };

    try {
      if (db) {
        await setDoc(doc(db, "products", productData.id), productData, { merge: true });
      }
    } catch (err: any) {
      console.warn("Firestore save notice:", err);
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
    setSavingProduct(false);
  };

  // Toggle Maintenance / Active Status
  const handleToggleStatus = async (product: ProductItem) => {
    const nextStatus = product.status === "Active" ? "Maintenance" : "Active";
    try {
      if (db) {
        await setDoc(doc(db, "products", product.id), { status: nextStatus }, { merge: true });
      }
    } catch (err: any) {
      console.warn("Firestore status update notice:", err);
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
    );

    toast({
      title: "Status Diubah",
      description: `Status "${product.name}" diubah menjadi ${nextStatus}.`,
    });
  };

  // Delete Product
  const handleDeleteProduct = async (product: ProductItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) return;
    try {
      if (db) {
        await deleteDoc(doc(db, "products", product.id));
      }
    } catch (err: any) {
      console.warn("Firestore delete notice:", err);
    }

    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    toast({
      title: "Produk Dihapus",
      description: `Katalog "${product.name}" berhasil dihapus.`,
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "game" && p.category.toLowerCase().includes("game")) ||
      (categoryFilter === "voucher" && p.category.toLowerCase().includes("voucher")) ||
      (categoryFilter === "pulsa" && (p.category.toLowerCase().includes("pulsa") || p.category.toLowerCase().includes("data"))) ||
      (categoryFilter === "pln" && p.category.toLowerCase().includes("pln"));

    return matchesSearch && matchesCategory;
  });

  // Calculate paginated products
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</Badge>;
      case "Inactive":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><XCircle className="h-3 w-3 mr-1" /> Inactive</Badge>;
      case "Maintenance":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"><AlertTriangle className="h-3 w-3 mr-1" /> Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeCount = products.filter((p) => p.status === "Active").length;
  const maintenanceCount = products.filter((p) => p.status === "Maintenance").length;
  const totalSales = products.reduce((acc, p) => acc + (p.sales || 0), 0);

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
          className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20 gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Total Katalog", value: `${products.length} Layanan`, icon: Package, color: "text-primary" },
          { label: "Produk Aktif", value: `${activeCount} Aktif`, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Maintenance", value: `${maintenanceCount} Produk`, icon: AlertTriangle, color: "text-amber-500" },
          { label: "Total Terjual", value: `${totalSales.toLocaleString()} Trx`, icon: Zap, color: "text-blue-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 flex items-center justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-2xl font-black tabular-nums truncate">{stat.value}</p>
              </div>
              <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-muted/30 flex items-center justify-center shrink-0">
                <stat.icon className={cn("h-4 w-4 sm:h-6 sm:w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product List Table Card */}
      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
        <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-0.5">
                <CardTitle className="text-base sm:text-lg font-black tracking-tight">Katalog Layanan Digital ({filteredProducts.length})</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs font-bold">Daftar seluruh produk yang tampil pada halaman utama pengguna.</CardDescription>
              </div>
              <div className="overflow-x-auto pb-1 sm:pb-0 w-full">
                <Tabs defaultValue="all" onValueChange={setCategoryFilter} className="w-full min-w-[320px]">
                  <TabsList className="bg-muted/40 p-1 rounded-xl w-full justify-start sm:justify-center">
                    <TabsTrigger value="all" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                    <TabsTrigger value="game" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg">Topup Game</TabsTrigger>
                    <TabsTrigger value="voucher" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg">Voucher</TabsTrigger>
                    <TabsTrigger value="pulsa" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg">Pulsa/Data</TabsTrigger>
                    <TabsTrigger value="pln" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-4 rounded-lg">PLN</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Produk atau Provider..."
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
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Produk & ID</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Kategori</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Provider API</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Varian Item</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12 text-center">Total Terjual</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                      Memuat katalog produk...
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-bold text-xs">
                      Tidak ada produk ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                      <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50 flex items-center justify-center p-1">
                            <img
                              src={product.image || "/img/popular/mlbb.png"}
                              alt={product.name}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/img/popular/mlbb.png";
                              }}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-black truncate">{product.name}</span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground font-bold">{product.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-1.5">
                          {product.category.includes("Game") ? (
                            <Gamepad2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : (
                            <Ticket className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className="text-xs font-bold">{product.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-1.5">
                          <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs font-bold">{product.provider}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        <span className="text-xs font-black tabular-nums">{product.items} SKU</span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 text-center">
                        <span className="text-xs font-black tabular-nums">{(product.sales || 0).toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Produk</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(product)}
                              className="text-xs font-bold cursor-pointer gap-2"
                            >
                              <Edit className="h-3.5 w-3.5 text-primary" /> Edit Detail Produk
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(product)}
                              className="text-xs font-bold cursor-pointer gap-2"
                            >
                              <Power className="h-3.5 w-3.5 text-amber-500" />
                              {product.status === "Active" ? "Set Maintenance" : "Set Aktif"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteProduct(product)}
                              className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Produk
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              Menampilkan {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} dari {totalItems} Produk
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

      {/* Modal Tambah / Edit Produk */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {editingProduct ? "Edit Detail Produk" : "Tambah Produk Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-muted-foreground">
              Isi data detail katalog produk yang akan ditampilkan kepada pengguna.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID Produk (SKU Slug)</Label>
                <Input
                  placeholder="mlbb"
                  className="h-10 bg-background rounded-xl font-mono text-xs font-bold border-border/50"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  disabled={!!editingProduct}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Provider API</Label>
                <select
                  value={formProvider}
                  onChange={(e) => setFormProvider(e.target.value)}
                  className="h-10 w-full bg-background rounded-xl font-bold border border-border/50 text-xs px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="DigiFlazz">DigiFlazz</option>
                  <option value="Orderkuota">Orderkuota</option>
                  <option value="Internal">Internal / Manual</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nama Produk</Label>
              <Input
                placeholder="Mobile Legends: Bang Bang"
                className="h-10 bg-background rounded-xl text-xs font-bold border-border/50"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kategori</Label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="h-10 w-full bg-background rounded-xl font-bold border border-border/50 text-xs px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Topup Game">Topup Game</option>
                  <option value="Voucher">Voucher Digital</option>
                  <option value="Pulsa/Data">Pulsa & Data</option>
                  <option value="PLN & Tagihan">PLN & Tagihan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Produk</Label>
                <select
                  value={formStatus}
                  onChange={(e: any) => setFormStatus(e.target.value)}
                  className="h-10 w-full bg-background rounded-xl font-bold border border-border/50 text-xs px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">Active (Aktif)</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive (Non-Aktif)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL Ikon / Gambar</Label>
                <Input
                  placeholder="/img/popular/mlbb.png"
                  className="h-10 bg-background rounded-xl text-xs font-bold border-border/50"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jumlah Varian SKU</Label>
                <Input
                  type="number"
                  placeholder="10"
                  className="h-10 bg-background rounded-xl text-xs font-bold border-border/50"
                  value={formItems}
                  onChange={(e) => setFormItems(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-3 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="h-10 rounded-xl font-black text-xs uppercase tracking-widest"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={savingProduct}
                className="h-10 rounded-xl font-black text-xs uppercase tracking-widest gap-2"
              >
                {savingProduct && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
