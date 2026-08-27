
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  Users, 
  Key,
  CheckCircle2,
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

const MOCK_ROLES = [
  {
    id: "ROLE-001",
    name: "Super Admin",
    description: "Akses penuh ke seluruh sistem dan pengaturan.",
    permissions: ["Full Access"],
    staffCount: 2,
    status: "Active",
    color: "text-red-500",
    bg: "bg-red-500/10",
    badgeIcon: "https://picsum.photos/seed/badge-admin/100/100"
  },
  {
    id: "ROLE-002",
    name: "Finance",
    description: "Mengelola transaksi, laporan, dan verifikasi deposit.",
    permissions: ["Transactions", "Reports", "Refunds"],
    staffCount: 3,
    status: "Active",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badgeIcon: "https://picsum.photos/seed/badge-finance/100/100"
  },
  {
    id: "ROLE-003",
    name: "Customer Service",
    description: "Membantu kendala user dan update status pesanan.",
    permissions: ["Transactions", "Users", "Support"],
    staffCount: 5,
    status: "Active",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    badgeIcon: "https://picsum.photos/seed/badge-support/100/100"
  },
  {
    id: "ROLE-004",
    name: "Content Manager",
    description: "Update banner, produk, dan katalog gallery.",
    permissions: ["Products", "Gallery", "Banners"],
    staffCount: 2,
    status: "Active",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    badgeIcon: "https://picsum.photos/seed/badge-content/100/100"
  }
];

export default function AdminRolesPage() {
  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate">
            <Lock className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" /> Peran & Izin Akses Staf
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola tingkatan otoritas staf dan izin modul aplikasi.</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl font-black text-xs uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 shadow-lg shadow-primary/20 gap-2 shrink-0">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Tambah Role Baru
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {[
          { label: "Total Role", value: "4 Grup", icon: ShieldCheck, color: "text-primary" },
          { label: "Staf Aktif", value: "12 User", icon: Users, color: "text-blue-500" },
          { label: "Izin Unik", value: "18 Akses", icon: Key, color: "text-amber-500" },
          { label: "Keamanan", value: "Tinggi", icon: CheckCircle2, color: "text-emerald-500" },
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
              <CardTitle className="text-base sm:text-lg font-black tracking-tight">Hirarki Otoritas Staf</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs font-bold">Tentukan siapa yang berhak mengelola modul tertentu.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 w-full max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[850px] whitespace-nowrap">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/30">
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-4 sm:pl-6 h-10 sm:h-12">Nama Role & Badge</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Daftar Izin</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Jumlah Staf</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest h-10 sm:h-12">Status</TableHead>
                  <TableHead className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-right pr-4 sm:pr-6 h-10 sm:h-12">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ROLES.map((role) => (
                  <TableRow key={role.id} className="hover:bg-muted/20 border-border/30 transition-colors group">
                    <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={cn("h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center border border-border/50 transition-transform group-hover:scale-110 p-1.5 shrink-0", role.bg)}>
                          <div className="relative h-full w-full">
                            <Image 
                              src={role.badgeIcon} 
                              alt={role.name} 
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className={cn("text-xs font-black tracking-wider", role.color)}>{role.name}</span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono font-bold uppercase">{role.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="text-[9px] font-black uppercase px-2 rounded-md bg-background/50 border-border/50">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-black tabular-nums">{role.staffCount} Orang</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] sm:text-[10px] font-black uppercase tracking-tighter px-2 rounded-md">
                        {role.status}
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
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Kontrol Role</DropdownMenuLabel>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                            <Edit className="h-3.5 w-3.5" /> Ubah Nama & Izin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-primary">
                            <Award className="h-3.5 w-3.5" /> Ganti Badge Identitas
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                            <Users className="h-3.5 w-3.5" /> Lihat Daftar Staf
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Hapus Role
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
              <Key className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Badge Otoritas Staf</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold leading-relaxed">
                Setiap peran staf dapat dikaitkan dengan badge identitas yang tampil langsung sebagai ikon peran. Badge ini berfungsi sebagai penanda resmi saat staf berinteraksi dengan sistem, memberikan rasa aman dan kepercayaan ekstra bagi tim.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
           <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">Audit Izin Akses</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold italic">Seluruh 12 staf telah menggunakan role yang sesuai.</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto rounded-xl font-black text-[10px] uppercase tracking-widest px-4 border-border shrink-0">
              Lihat Log Aktivitas Staf
            </Button>
        </Card>
      </div>
    </div>
  );
}
