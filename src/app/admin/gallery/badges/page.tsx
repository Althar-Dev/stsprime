
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Star,
  Users,
  Sparkles,
  Upload
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

const MOCK_BADGES = [
  {
    id: "BDG-001",
    name: "VIP Member",
    category: "Status",
    imageUrl: "/img/badge/vip.png",
    requirement: "Berlangganan VIP",
    owners: 128,
    status: "Active",
    color: "text-amber-500"
  },
];

export default function AdminBadgesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredBadges = MOCK_BADGES.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || badge.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">Active</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" /> Manajemen Badge Akun
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Kelola koleksi lencana pencapaian, status VIP, dan ikon identitas profil pengguna.</p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2"
        >
          <Plus className="h-4 w-4" /> Upload Badge R2
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Badge", value: "18 Aset", icon: Award, color: "text-primary" },
          { label: "Terdistribusi", value: "1,541 User", icon: Users, color: "text-blue-500" },
          { label: "Achievement", value: "12 Lencana", icon: Star, color: "text-emerald-500" },
          { label: "Event Khusus", value: "2 Aktif", icon: Sparkles, color: "text-amber-500" },
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
              <CardTitle className="text-lg font-black tracking-tight">Katalog Lencana</CardTitle>
              <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase px-4 rounded-lg">Semua</TabsTrigger>
                  <TabsTrigger value="status" className="text-[10px] font-black uppercase px-4 rounded-lg">Status</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="relative w-full md:w-64 self-end">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari badge..." className="pl-10 h-10 bg-background border-border text-xs font-bold rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/30">
                  <TableHead className="text-[10px] font-black uppercase pl-6 h-12">Ikon & Lencana</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Total Pemilik</TableHead>
                  <TableHead className="text-[10px] font-black uppercase h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBadges.map((badge) => (
                  <TableRow key={badge.id} className="hover:bg-muted/20 border-border/30 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center p-1">
                          <Image src={badge.imageUrl} alt={badge.name} width={40} height={40} className="object-contain" unoptimized />
                        </div>
                        <span className={cn("text-sm font-black truncate", badge.color)}>{badge.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="text-[10px] font-black uppercase px-2 rounded-md bg-muted/30">{badge.category}</Badge>
                    </TableCell>
                    <TableCell className="py-4 text-xs font-black tabular-nums">{badge.owners.toLocaleString()} User</TableCell>
                    <TableCell className="py-4">{getStatusBadge(badge.status)}</TableCell>
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
        folder="badges"
        onSuccess={(url) => {
          console.log("New badge uploaded to R2:", url);
        }}
      />
    </div>
  );
}
