
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
  Upload,
  Layers,
  CheckCircle2,
  AlertCircle,
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
import { R2UploadModal } from "@/components/admin/r2-upload-modal";

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
];

export default function AdminOtherAssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();

  const filteredAssets = MOCK_OTHER_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Live</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL Disalin", description: "Link aset telah disalin ke clipboard." });
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
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2"
        >
          <Plus className="h-4 w-4" /> Upload Aset R2
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Aset", value: "32 Aset", icon: Layers, color: "text-primary" },
          { label: "Ukuran Penyimpanan", value: "24.5 MB", icon: Upload, color: "text-emerald-500" },
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
            <CardTitle className="text-lg font-black tracking-tight">Katalog Aset Pendukung</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari nama..." className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/30">
                  <TableHead className="text-[10px] font-black uppercase pl-6 h-12">Pratampil Aset</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Nama & ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12 text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center">
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
                          <DropdownMenuItem className="text-xs font-bold text-destructive gap-2"><Trash2 className="h-3.5 w-3.5" /> Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <R2UploadModal 
        isOpen={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
        folder="others"
        onSuccess={(url) => {
          console.log("New asset uploaded to R2:", url);
        }}
      />
    </div>
  );
}
