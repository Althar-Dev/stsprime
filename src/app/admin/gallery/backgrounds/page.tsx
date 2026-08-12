
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Gamepad2,
  Layers,
  CheckCircle2,
  Maximize2,
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
import Image from "next/image";
import { R2UploadModal } from "@/components/admin/r2-upload-modal";

const MOCK_PRODUCT_BACKGROUNDS = [
  {
    id: "HBG-001",
    gameName: "Mobile Legends",
    imageHint: "mobile legends night city",
    imageUrl: "https://picsum.photos/seed/mlbb-bg/1200/400",
    dimensions: "1200x400",
    status: "Active",
    lastUpdated: "12 Agu 2026"
  },
];

export default function AdminBackgroundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredBgs = MOCK_PRODUCT_BACKGROUNDS.filter(bg => 
    bg.gameName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Published</Badge>;
      case "Inactive":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Monitor className="h-8 w-8 text-primary" /> Gambar Header Produk
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola gambar latar belakang (spanduk) yang muncul di bagian atas halaman top-up setiap produk.</p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2"
        >
          <Plus className="h-4 w-4" /> Upload Header R2
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Header", value: "24 Aset", icon: Layers, color: "text-primary" },
          { label: "Aktif Digunakan", value: "18 Game", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Rasio Standar", value: "3:1 (Wide)", icon: Maximize2, color: "text-blue-500" },
          { label: "Draft / Antrean", value: "6 Aset", icon: ImageIcon, color: "text-amber-500" },
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
              <CardTitle className="text-lg font-black tracking-tight">Katalog Visual Header</CardTitle>
              <CardDescription className="text-xs font-bold">Sesuaikan estetika halaman top-up game Anda.</CardDescription>
            </div>
            <div className="relative w-full md:w-64 self-end">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari produk..." 
                className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/30">
                  <TableHead className="text-[10px] font-black uppercase pl-6 h-12">Pratampil Header</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Produk Game</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Dimensi</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBgs.map((bg) => (
                  <TableRow key={bg.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="relative h-20 w-60 rounded-lg overflow-hidden border border-border/50 bg-muted">
                        <Image src={bg.imageUrl} alt={bg.gameName} fill className="object-cover" unoptimized />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-black">{bg.gameName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-mono font-bold text-muted-foreground">{bg.dimensions}</span>
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadge(bg.status)}</TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem className="text-xs font-bold gap-2"><Edit className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
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
        folder="backgrounds"
        onSuccess={(url) => {
          console.log("New background uploaded to R2:", url);
        }}
      />
    </div>
  );
}
