
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Gamepad2,
  CreditCard,
  Layers,
  Upload,
  RefreshCw
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
import Image from "next/image";
import { R2UploadModal } from "@/components/admin/r2-upload-modal";

const MOCK_ICONS = [
  {
    id: "ICO-001",
    name: "Mobile Legends",
    category: "Game",
    imageUrl: "https://picsum.photos/seed/mlbb/100/100",
    status: "Active",
    usage: 42,
    updatedAt: "12 Agu 2026"
  },
];

export default function AdminIconsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredIcons = MOCK_ICONS.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || icon.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
      case "Inactive":
        return <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Grid3X3 className="h-8 w-8 text-primary" /> Manajemen Ikon
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola pustaka aset visual untuk kategori game, metode pembayaran, dan layanan.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2"
          >
            <Plus className="h-4 w-4" /> Upload Ikon R2
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Ikon", value: "148", icon: ImageIcon, color: "text-primary" },
          { label: "Ikon Game", value: "92", icon: Gamepad2, color: "text-blue-500" },
          { label: "Ikon Pembayaran", value: "34", icon: CreditCard, color: "text-emerald-500" },
          { label: "Tak Digunakan", value: "12", icon: XCircle, color: "text-amber-500" },
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
              <Input placeholder="Cari ikon..." className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                    <TableCell className="py-4 text-xs font-bold text-muted-foreground">{icon.updatedAt}</TableCell>
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
        folder="icons"
        onSuccess={(url) => {
          console.log("New icon uploaded to R2:", url);
        }}
      />
    </div>
  );
}
