"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Clock,
  History,
  RefreshCcw,
  Search,
  ShoppingBag,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HISTORY_DATA = [
  {
    id: "STS-9821-X",
    game: "Mobile Legends",
    item: "172 Diamonds + 19 Bonus",
    date: "8 Agu 2026",
    time: "14:20 WIB",
    price: "Rp 38,000",
    status: "Sukses",
    gameId: "12345678 (2012)",
    slug: "mlbb",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "STS-8722-A",
    game: "Genshin Impact",
    item: "300 Genesis Crystals",
    date: "5 Agu 2026",
    time: "09:45 WIB",
    price: "Rp 79,000",
    status: "Sukses",
    gameId: "UID: 8212132",
    slug: "genshin",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "STS-7612-B",
    game: "Valorant",
    item: "1,250 Valorant Points",
    date: "1 Agu 2026",
    time: "22:10 WIB",
    price: "Rp 150,000",
    status: "Sukses",
    gameId: "User#RIOTT",
    slug: "valorant",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "STS-6501-P",
    game: "Free Fire",
    item: "720 Diamonds Super Sale",
    date: "28 Jul 2026",
    time: "11:30 WIB",
    price: "Rp 51,500",
    status: "Diproses",
    gameId: "981273912",
    slug: "freefire",
    statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  const filteredOrders = HISTORY_DATA.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.gameId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "semua" ? true : order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-grow container mx-auto px-3 sm:px-5 py-4 sm:py-7 max-w-6xl space-y-5 sm:space-y-6">
        {/* MAIN LAYOUT GRID */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-12 items-start">
          {/* LEFT SIDE: STATS & TOP PICK */}
          <div className="lg:col-span-4 space-y-3.5 sm:space-y-4">
            {/* STATS BENTO CARD */}
            <div className="bento-card p-3.5 sm:p-5 border-border/50 bg-card/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg space-y-3">
              <h3 className="font-headline font-black text-xs text-foreground flex items-center gap-2 uppercase tracking-wider">
                <ShoppingBag className="h-3.5 w-3.5 text-primary" /> Statistik Ringkas
              </h3>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-2.5 sm:p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                  <p className="text-[8.5px] sm:text-[9.5px] text-muted-foreground font-black tracking-widest uppercase">Total Order</p>
                  <p className="text-base sm:text-xl font-black text-foreground tabular-nums">24</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                  <p className="text-[8.5px] sm:text-[9.5px] text-muted-foreground font-black tracking-widest uppercase">Total Belanja</p>
                  <p className="text-sm sm:text-lg font-black text-primary tabular-nums">Rp 1.45jt</p>
                </div>
              </div>
            </div>

            {/* TOP PICK BENTO CARD */}
            <div className="bento-card p-3.5 sm:p-5 border-border/50 bg-gradient-to-br from-primary/10 via-card/30 to-transparent backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg space-y-2.5">
              <h3 className="font-headline font-black text-xs text-foreground flex items-center gap-2 uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5 text-primary" /> Game Favorit
              </h3>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-card/40 border border-border/40">
                <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                  ML
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-xs text-foreground truncate">Mobile Legends</p>
                  <p className="text-[9.5px] text-muted-foreground font-bold">12x Pengisian Sukses</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SEARCH & TRANSACTIONS LIST */}
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
            {/* SEARCH & FILTER BAR */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Cari ID order, nama game, atau User ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-card/40 border-border/60 text-xs font-bold shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex gap-1.5 shrink-0">
                <Button
                  variant={statusFilter === "semua" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("semua")}
                  className="rounded-lg sm:rounded-xl h-9 px-3 text-[11px] font-black uppercase tracking-wider"
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === "sukses" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("sukses")}
                  className="rounded-lg sm:rounded-xl h-9 px-3 text-[11px] font-black uppercase tracking-wider"
                >
                  Sukses
                </Button>
              </div>
            </div>

            {/* TRANSACTIONS CARDS LIST */}
            <div className="space-y-2.5 sm:space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-6 sm:p-10 rounded-xl sm:rounded-2xl border border-dashed border-border bg-card/20 text-center space-y-2">
                  <History className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                  <p className="font-bold text-xs text-foreground">Tidak ada transaksi ditemukan.</p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">Coba ubah kata kunci pencarian atau filter Anda.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bento-card p-3.5 sm:p-4 border-border/50 bg-card/30 backdrop-blur-sm rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:border-primary/40 transition-all shadow-md group"
                  >
                    {/* LEFT ITEM INFO */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>

                      <div className="flex-grow min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h4 className="font-headline font-black text-xs sm:text-sm text-foreground truncate">
                            {order.item}
                          </h4>
                          <Badge className={cn("text-[8.5px] font-black tracking-tight px-1.5 py-0.5 rounded-md border uppercase shrink-0", order.statusColor)}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] text-muted-foreground font-bold">
                          <span className="text-foreground/80">{order.game}</span>
                          <span>•</span>
                          <span className="font-mono text-[9px] bg-muted/60 px-1 py-0.5 rounded text-foreground">{order.id}</span>
                          <span>•</span>
                          <span className="truncate opacity-75">{order.gameId}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PRICE & RE-ORDER */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-border/40 pt-2.5 sm:pt-0">
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-[8.5px] sm:text-[9.5px] text-muted-foreground font-black uppercase tracking-wider whitespace-nowrap">Total Bayar</p>
                        <p className="font-black text-xs sm:text-sm text-primary tabular-nums whitespace-nowrap">{order.price}</p>
                      </div>

                      <Link href={`/topup/${order.slug}`} className="shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 sm:h-9 px-3 rounded-lg border-primary/30 text-primary hover:bg-primary/10 text-[11px] font-black gap-1.5 transition-all shadow-xs"
                        >
                          <RefreshCcw className="h-3 w-3" />
                          <span className="whitespace-nowrap">Beli Lagi</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION / FOOTER INFO */}
            <div className="text-center py-3">
              <p className="text-[9.5px] sm:text-[10.5px] text-muted-foreground font-bold tracking-widest uppercase opacity-70">
                Menampilkan {filteredOrders.length} dari 24 transaksi
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}