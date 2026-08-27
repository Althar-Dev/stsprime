"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
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
  Award,
  Gem,
  Sparkles
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

const MOCK_VIP_LEVELS = [
  {
    id: "VIP-I",
    name: "VIP LEVEL I",
    requirement: "Akumulasi Topup Rp 1jt",
    multiplier: "1.2x Poin",
    cashback: "2%",
    members: 145,
    status: "Active",
    color: "text-slate-300",
    bg: "bg-slate-300/10",
    badgeIcon: "/img/badge/vip.png"
  },
  {
    id: "VIP-II",
    name: "VIP LEVEL II",
    requirement: "Akumulasi Topup Rp 5jt",
    multiplier: "1.5x Poin",
    cashback: "5%",
    members: 62,
    status: "Active",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    badgeIcon: "/img/badge/vip.png"
  },
  {
    id: "VIP-III",
    name: "VIP LEVEL III",
    requirement: "Akumulasi Topup Rp 15jt",
    multiplier: "2.0x Poin",
    cashback: "8%",
    members: 24,
    status: "Active",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    badgeIcon: "/img/badge/vip.png"
  },
  {
    id: "VIP-IV",
    name: "VIP LEVEL IV",
    requirement: "Akumulasi Topup Rp 50jt",
    multiplier: "3.5x Poin",
    cashback: "12%",
    members: 8,
    status: "Active",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    badgeIcon: "/img/badge/vip.png"
  },
  {
    id: "VIP-V",
    name: "VIP LEVEL V",
    requirement: "Akumulasi Topup Rp 100jt",
    multiplier: "5.0x Poin",
    cashback: "20%",
    members: 3,
    status: "Active",
    color: "text-primary",
    bg: "bg-primary/10",
    badgeIcon: "/img/badge/vip.png"
  }
];

export default function AdminVipManagementPage() {
  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Crown className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Member VIP (Tiering)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola eksklusivitas pengguna, multiplier reward, dan hak istimewa sultan.</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20 gap-2 shrink-0">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Tambah Level VIP
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Populasi VIP", value: "242 User", icon: Users, color: "text-primary" },
          { label: "Tier Tertinggi", value: "LEVEL V", icon: Gem, color: "text-blue-500" },
          { label: "Multiplier Maks.", value: "5.0x Poin", icon: Zap, color: "text-amber-500" },
          { label: "Margin VIP", value: "Rp 14.2M", icon: TrendingUp, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 flex items-center justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <p className="text-base sm:text-xl font-black truncate">{stat.value}</p>
              </div>
              <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-muted/30 flex items-center justify-center shrink-0">
                <stat.icon className={cn("h-4 w-4 sm:h-6 sm:w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden w-full max-w-full min-w-0">
        <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg font-black tracking-tight text-primary">Hirarki Sultan & Benefit</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Setiap kenaikan level memberikan multiplier poin dan cashback yang lebih besar.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[850px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Level & Badge</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Ambang Batas Topup</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Reward System</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Jumlah Member</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_VIP_LEVELS.map((level) => (
                  <TableRow key={level.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                    <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={cn("h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center border border-border/50 transition-transform group-hover:scale-110 p-1.5 shadow-inner shrink-0", level.bg)}>
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
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono font-bold uppercase">{level.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <span className="text-xs font-bold">{level.requirement}</span>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                          <span className="text-xs font-black tabular-nums">{level.multiplier}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Percent className="h-3 w-3 text-primary shrink-0" />
                          <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tabular-nums">Extra {level.cashback} Cashback</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <span className="text-xs font-black tabular-nums">{level.members.toLocaleString()} User</span>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] sm:text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">
                        {level.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-4 sm:pr-6 py-3 sm:py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-xl border-border">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol VIP</DropdownMenuLabel>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                            <Edit className="h-3.5 w-3.5" /> Sesuaikan Benefit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-primary">
                            <Award className="h-3.5 w-3.5" /> Ganti Ikon Badge
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Hapus Tingkatan
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        <Card className="bento-card border-primary/20 bg-primary/5 p-4 sm:p-6">
          <div className="flex gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Otomatisasi Leveling</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold leading-relaxed">
                Sistem akan secara otomatis menaikkan level VIP pengguna saat total akumulasi transaksi mencapai ambang batas yang ditentukan. Badge VIP akan langsung tampil pada profil dan memberikan efek visual pada nama pengguna di leaderboard.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
           <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Strategi Loyalitas
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold italic">Member VIP memberikan kontribusi 65% dari total omzet harian.</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border shrink-0">
              Lihat Analitik Sultan
            </Button>
        </Card>
      </div>
    </div>
  );
}
