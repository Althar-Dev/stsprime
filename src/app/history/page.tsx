"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Clock, History, RefreshCcw, Search, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const HISTORY_DATA = [
  { id: "STS-9821-X", item: "Mobile Legends - 172 Diamonds", date: "Oct 24, 2023", time: "14:20", price: "Rp 38,000", status: "Success", gameId: "12345678" },
  { id: "STS-8722-A", item: "Genshin Impact - 300 Crystals", date: "Oct 15, 2023", time: "09:45", price: "Rp 79,000", status: "Success", gameId: "UID: 8212132" },
  { id: "STS-7612-B", item: "Valorant Points - 1250 VP", date: "Sep 28, 2023", time: "22:10", price: "Rp 150,000", status: "Success", gameId: "User#RIOTT" },
  { id: "STS-6501-P", item: "Telkomsel - Rp 50,000 Credit", date: "Sep 12, 2023", time: "11:30", price: "Rp 51,500", status: "Success", gameId: "081234567890" },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="font-headline text-3xl md:text-4xl font-black mb-3 tracking-tight">Personal Ledger</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your transactions and quickly re-order your favorites.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4 items-start">
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <div className="bento-card p-5 md:p-6">
              <h3 className="font-black text-sm mb-4 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                  <p className="text-[10px] text-muted-foreground font-black tracking-widest">Total Orders</p>
                  <p className="text-xl md:text-2xl font-black">24</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                  <p className="text-[10px] text-muted-foreground font-black tracking-widest">Total Spent</p>
                  <p className="text-xl md:text-2xl font-black text-primary">Rp 1.450k</p>
                </div>
              </div>
            </div>

            <div className="bento-card p-5 md:p-6 bg-primary/5 hidden sm:block">
              <h3 className="font-black text-sm mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Top Pick
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary flex items-center justify-center font-headline font-black text-primary-foreground text-sm md:text-base">ML</div>
                <div>
                  <p className="font-black text-xs md:text-sm">Mobile Legends</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-bold">12 Orders</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search history..." className="pl-10 h-11 bg-card/30 border-border" />
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="rounded-full flex-1 sm:flex-none text-xs font-bold px-4">Export</Button>
                <Button variant="outline" size="sm" className="rounded-full flex-1 sm:flex-none text-xs font-bold px-4">Clear</Button>
              </div>
            </div>

            <div className="space-y-4">
              {HISTORY_DATA.map((order) => (
                <div key={order.id} className="bento-card p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 hover:translate-x-1 transition-transform border-border/50">
                  <div className="flex items-center gap-4 md:gap-5 w-full">
                    <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
                      <History className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-black text-sm md:text-lg truncate max-w-[150px] md:max-w-none">{order.item}</h4>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] md:text-[10px] font-black tracking-tight">Success</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[10px] md:text-xs text-muted-foreground font-bold">
                        <span>{order.date}</span>
                        <span className="hidden md:inline">•</span>
                        <span className="font-mono text-[9px] md:text-[10px] bg-muted px-1 rounded">{order.id}</span>
                        <span className="hidden md:inline">•</span>
                        <span className="truncate">ID: {order.gameId}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-border/50 pt-4 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] md:text-[10px] text-muted-foreground font-black">Paid Amount</p>
                      <p className="font-black text-lg md:text-xl text-foreground">{order.price}</p>
                    </div>
                    <Link href={`/topup/mlbb`}>
                      <Button variant="ghost" className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-border hover:bg-primary/10 hover:border-primary/50 text-primary p-0">
                        <RefreshCcw className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center py-6 md:py-8">
              <p className="text-[10px] md:text-sm text-muted-foreground font-bold tracking-widest">Showing 4 of 24 transactions</p>
              <Button variant="link" className="mt-2 text-primary font-black text-xs">Load more history</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
