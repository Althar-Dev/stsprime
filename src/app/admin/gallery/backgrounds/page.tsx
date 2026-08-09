
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Users,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock
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

const MOCK_BACKGROUNDS = [
  {
    id: "BG-001",
    name: "STS Gold",
    type: "Gradient",
    class: "bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600",
    usage: 1240,
    status: "Active",
    vipOnly: false,
  },
  {
    id: "BG-002",
    name: "STS Blue",
    type: "Gradient",
    class: "bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400",
    usage: 856,
    status: "Active",
    vipOnly: false,
  },
  {
    id: "BG-003",
    name: "Obsidian",
    type: "Special",
    class: "bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-800",
    usage: 420,
    status: "Active",
    vipOnly: true,
  },
  {
    id: "BG-004",
    name: "Cyber Void",
    type: "Special",
    class: "bg-gradient-to-tr from-zinc-900 via-purple-950 to-pink-900",
    usage: 215,
    status: "Active",
    vipOnly: true,
  },
  {
    id: "BG-005",
    name: "Rose Pink",
    type: "Solid",
    class: "bg-rose-500",
    usage: 124,
    status: "Inactive",
    vipOnly: false,
  },
  {
    id: "BG-006",
    name: "Prismatic",
    type: "Gradient",
    class: "bg-gradient-to-tr from-red-500 via-yellow-400 via-emerald-400 to-blue-500",
    usage: 340,
    status: "Active",
    vipOnly: false,
  }
];

export default function AdminBackgroundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBgs = MOCK_BACKGROUNDS.filter(bg => {
    const matchesSearch = bg.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === "all" || bg.type.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesType;
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
            <Palette className="h-8 w-8 text-primary" /> Manajemen Latar Belakang
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola pustaka warna, gradasi, dan desain eksklusif untuk kustomisasi profil pengguna.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus className="h-4 w-4" /> Tambah Asset Baru
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Aset", value: "28", icon: Layers, color: "text-primary" },
          { label: "Paling Populer", value: "STS Gold", icon: Sparkles, color: "text-amber-500" },
          { label: "Total Digunakan", value: "3.2k", icon: Users, color: "text-blue-500" },
          { label: "Edisi Khusus", value: "8", icon: Lock, color: "text-purple-500" },
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
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black tracking-tight">Koleksi Visual Profil</CardTitle>
                <CardDescription className="text-xs font-bold">Atur ketersediaan dan syarat akses latar belakang pengguna.</CardDescription>
              </div>
              <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl overflow-x-auto no-scrollbar justify-start">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg data-[state=active]:bg-background">Semua</TabsTrigger>
                  <TabsTrigger value="gradient" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Gradient</TabsTrigger>
                  <TabsTrigger value="solid" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Solid</TabsTrigger>
                  <TabsTrigger value="special" className="text-[10px] font-black uppercase tracking-widest px-4 rounded-lg">Special</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 self-end w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama desain..." 
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
            <Table className="min-w-[900px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Visual & Nama</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Tipe</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Akses</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-center">Penggunaan</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-bold">
                      Tidak ada latar belakang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBgs.map((bg) => (
                    <TableRow key={bg.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className={cn("h-10 w-10 rounded-full border border-background shadow-md shrink-0", bg.class)} />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black truncate">{bg.name}</span>
                            <span className="text-[9px] text-muted-foreground font-mono font-bold uppercase truncate max-w-[150px]">{bg.class}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-bold">{bg.type}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        {bg.vipOnly ? (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase tracking-tighter px-1.5 rounded-md gap-1">
                            <Lock className="h-2.5 w-2.5" /> VIP ONLY
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter px-1.5 rounded-md">FREE</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="text-xs font-black tabular-nums">{bg.usage.toLocaleString()} User</span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(bg.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Visual</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" /> Edit Nama & Syarat
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                              <Palette className="h-3.5 w-3.5 text-primary" /> Ubah Warna/Kelas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {bg.status === "Active" ? (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-amber-500">
                                <EyeOff className="h-3.5 w-3.5" /> Sembunyikan
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-emerald-500">
                                <Eye className="h-3.5 w-3.5" /> Aktifkan Kembali
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
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Tren Visual</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Latar belakang dengan tipe gradasi (*gradient*) memiliki tingkat penggunaan 3x lebih tinggi dibandingkan warna solid. Pertimbangkan untuk menambah variasi gradasi modern untuk menarik minat member.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Sinkronisasi Katalog</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Update database kustomisasi profil pengguna.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border gap-2">
              <CheckCircle2 className="h-4 w-4" /> Push Updates
            </Button>
        </Card>
      </div>
    </div>
  );
}
