
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
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-headline text-4xl font-black mb-4 uppercase tracking-tight">Personal Ledger</h1>
          <p className="text-muted-foreground">Manage your transactions and quickly re-order your favorites.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1 space-y-6">
            <div className="bento-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Orders</p>
                  <p className="text-2xl font-black">24</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Spent</p>
                  <p className="text-2xl font-black text-primary">Rp 1.450.000</p>
                </div>
              </div>
            </div>

            <div className="bento-card p-6 bg-primary/5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Favorite Game
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center font-headline font-black text-primary-foreground">ML</div>
                <div>
                  <p className="font-bold">Mobile Legends</p>
                  <p className="text-xs text-muted-foreground">12 transactions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search history..." className="pl-10 h-11 bg-card/50" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full">Export PDF</Button>
                <Button variant="outline" size="sm" className="rounded-full">Clear Filter</Button>
              </div>
            </div>

            <div className="space-y-4">
              {HISTORY_DATA.map((order) => (
                <div key={order.id} className="bento-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
                      <History className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{order.item}</h4>
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-[10px] font-bold">SUCCESS</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {order.date} at {order.time}</span>
                        <span className="font-mono">{order.id}</span>
                        <span>ID: {order.gameId}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-border pt-4 sm:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Price</p>
                      <p className="font-black text-xl">{order.price}</p>
                    </div>
                    <Link href={`/topup/mlbb`}>
                      <Button variant="ghost" className="h-12 w-12 rounded-full border border-border hover:bg-primary/10 hover:border-primary/50 text-primary">
                        <RefreshCcw className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Showing 4 of 24 transactions</p>
              <Button variant="link" className="mt-2 text-primary">Load more history</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
