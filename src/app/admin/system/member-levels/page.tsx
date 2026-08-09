
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Zap,
  ShieldCheck,
  ArrowUpCircle,
  Users,
  Percent,
  Award
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

const MOCK_LEVELS = [
  {
    id: "LVL-001",
    name: "BRONZE",
    requirement: "Pendaftaran Baru",
    multiplier: "1x Poin",
    cashback: "1%",
    members: 842,
    status: "Active",
    color: "text-orange-700",
    bg: "bg-orange-700/10",
    badgeIcon: "https://picsum.photos/seed/badge-bronze/100/100"
  },
  {
    id: "LVL-002",
    name: "SILVER",
    requirement: "10+ Transaksi",
    multiplier: "1.2x Poin",
    cashback: "2%",
    members: 312,
    status: "Active",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    badgeIcon: "https://picsum.photos/seed/badge-silver/100/100"
  },
  {
    id: "LVL-003",
    name: "GOLD",
    requirement: "50+ Transaksi",
    multiplier: "1.5x Poin",
    cashback: "5%",
    members: 86,
    status: "Active",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    badgeIcon: "/img/badge/vip.png"
  },
  {
    id: "LVL-004",
    name: "PLATINUM",
    requirement: "200+ Transaksi",
    multiplier: "2.5x Poin",
    cashback: "10%",
    members: 12,
    status: "Active",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    badgeIcon: "https://picsum.photos/seed/badge-platinum/100/100"
  }
];

export default function AdminMemberLevelsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" /> Manajemen Level Member
          </h1>
          <p className="text-sm text-muted-foreground font-bold italic">Konfigurasi tingkatan keanggotaan, multiplier reward, dan hak istimewa pengguna.</p>
        </div>
        <Button className="rounded-xl font-black text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus className="h-4 w-4" /> Buat Level Baru
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Level", value: "4 Tingkat", icon: ShieldCheck, color: "text-primary" },
          { label: "Populasi Terbesar", value: "BRONZE", icon: Users, color: "text-blue-500" },
          { label: "Multiplier Maks.", value: "2.5x Poin", icon: Zap, color: "text-amber-500" },
          { label: "Rata-rata Tier", value: "SILVER", icon: ArrowUpCircle, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-black">{stat.value}</p>
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
              <CardTitle className="text-lg font-black tracking-tight">Hirarki Keanggotaan & Hadiah</CardTitle>
              <CardDescription className="text-xs font-bold">Atur ambang batas transaksi, keuntungan, dan lencana identitas untuk setiap tier.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6 h-12">Level & Badge</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Syarat Kenaikan</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Reward Multiplier</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Populasi</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6 h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LEVELS.map((level) => (
                  <TableRow key={level.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border border-border/50 transition-transform group-hover:scale-110 p-1.5", level.bg)}>
                          <div className="relative h-full w-full">
                            <Image 
                              src={level.badgeIcon} 
                              alt={level.name} 
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className={cn("text-xs font-black tracking-wider", level.color)}>{level.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase">{level.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-bold">{level.requirement}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3 w-3 text-amber-500" />
                          <span className="text-xs font-black tabular-nums">{level.multiplier}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Percent className="h-3 w-3 text-primary" />
                          <span className="text-[10px] font-bold text-muted-foreground tabular-nums">Extra {level.cashback}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-black tabular-nums">{level.members.toLocaleString()} User</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">
                        {level.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Level</DropdownMenuLabel>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                            <Edit className="h-3.5 w-3.5" /> Edit Keuntungan
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-primary">
                            <Award className="h-3.5 w-3.5" /> Ganti Badge Lencana
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Hapus Level
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
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bento-card border-primary/20 bg-primary/5 p-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Mekanisme Badge Terintegrasi</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                Setiap level member kini langsung menggunakan lencana (badge) sebagai ikon identitasnya. Saat pengguna naik level, badge ini akan otomatis terpasang pada foto profil mereka di halaman publik dan leaderboard.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-6 flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider">Distribusi Member</h3>
              <p className="text-xs text-muted-foreground font-bold italic">Terdapat lonjakan 15% pada level SILVER bulan ini.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border">
              Lihat Grafik Pertumbuhan
            </Button>
        </Card>
      </div>
    </div>
  );
}
