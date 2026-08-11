"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileImage, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy
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
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const MOCK_OTHER_ASSETS = [
  {
    id: "AST-001",
    name: "Tutorial Topup MLBB",
    category: "Tutorial",
    imageUrl: "https://picsum.photos/seed/tut1/400/300",
    status: "Active",
    usage: "Halaman Detail Produk",
    updatedAt: "12 Agu 2026"
  },
  {
    id: "AST-002",
    name: "Banner Promo Liburan",
    category: "Marketing",
    imageUrl: "https://picsum.photos/seed/mkt1/400/300",
    status: "Draft",
    usage: "Sidebar",
    updatedAt: "11 Agu 2026"
  },
  {
    id: "AST-003",
    name: "Latar Belakang Maintenance",
    category: "System",
    imageUrl: "https://picsum.photos/seed/sys1/400/300",
    status: "Active",
    usage: "Halaman Maintenance",
    updatedAt: "10 Agu 2026"
  },
  {
    id: "AST-004",
    name: "Ilustrasi Koin STS",
    category: "General",
    imageUrl: "/img/coin.png",
    status: "Active",
    usage: "Modal Reward",
    updatedAt: "08 Agu 2026"
  },
  {
    id: "AST-005",
    name: "Icon VIP Gold Glow",
    category: "General",
    imageUrl: "/img/badge/vip.png",
    status: "Active",
    usage: "Profile Badge",
    updatedAt: "05 Agu 2026"
  },
];

export default function AdminOtherAssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredAssets = MOCK_OTHER_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Live</Badge>;
      case "Draft":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Disalin",
      description: "Link aset telah disalin ke clipboard.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <FileImage className="h-8 w-8 text-primary" /> Aset Lainnya
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola aset pendukung seperti ilustrasi marketing, gambar tutorial, dan grafis sistem lainnya.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus className="h-4 w-4" /> Upload Aset Baru
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Aset", value: "32 Aset", icon: Layers, color: "text-primary" },
          { label: "Kategori Tutorial", value: "12 File", icon: ImageIcon, color: "text-blue-500" },
          { label: "Ukuran Penyimpanan", value: "24.5 MB", icon: Upload, color: "text-emerald-500" },
          { label: "Aset Tak Terpakai", value: "5 File", icon: AlertCircle, color: "text-amber-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-black truncate max-w-[120px]">{stat.value}</p>
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
              <CardTitle className="text-lg font-black tracking-tight">Katalog Aset Pendukung</CardTitle>
              <CardDescription className="text-xs font-bold">Daftar seluruh file visual yang digunakan di luar kategori utama.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama atau kategori..." 
                  className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl border-border shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Pratampil Aset</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Nama & ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Digunakan Pada</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada aset ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-border/50 bg-muted group-hover:border-primary/50 transition-all">
                          <Image 
                            src={asset.imageUrl} 
                            alt={asset.name} 
                            fill 
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black tracking-tight">{asset.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">{asset.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter px-2 rounded-md bg-muted/30">
                          {asset.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-bold text-muted-foreground italic">"{asset.usage}"</span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        {getStatusBadge(asset.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Aset</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2" onClick={() => copyUrl(asset.imageUrl)}>
                              <Copy className="h-3.5 w-3.5" /> Salin URL Gambar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Ganti File
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {asset.status === "Active" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <EyeOff className="h-3.5 w-3.5" /> Tandai Draft
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <Eye className="h-3.5 w-3.5" /> Aktifkan (Live)
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Hapus Aset
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
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bento-card border-primary/20 bg-primary/5 p-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Standar Penggunaan</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Gunakan format WebP untuk kompresi terbaik tanpa mengurangi kualitas visual. Untuk gambar tutorial, pastikan teks dapat terbaca dengan jelas pada perangkat mobile. Gunakan fitur "Salin URL" untuk menaruh gambar di konten artikel atau detail produk.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Audit Berkala</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Sistem mendeteksi 5 file yang tidak diakses dalam 30 hari terakhir.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border">
              Bersihkan Cache Aset
            </Button>
        </Card>
      </div>
    </div>
  );
}
