"use client";

import { useParams, useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Check, ChevronLeft, CreditCard, ShieldCheck, Wallet, Zap, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";

const PACKS = [
  { id: 1, amount: "86 Diamonds", price: "Rp 19,500", bonus: "+9 Bonus" },
  { id: 2, amount: "172 Diamonds", price: "Rp 38,000", bonus: "+18 Bonus", popular: true },
  { id: 3, amount: "257 Diamonds", price: "Rp 56,000", bonus: "+26 Bonus" },
  { id: 4, amount: "344 Diamonds", price: "Rp 74,000", bonus: "+35 Bonus" },
  { id: 5, amount: "706 Diamonds", price: "Rp 148,000", bonus: "+72 Bonus" },
  { id: 6, amount: "1050 Diamonds", price: "Rp 215,000", bonus: "+110 Bonus" },
];

const PAYMENT_METHODS = [
  { id: "qris", name: "QRIS", icon: <CreditCard className="h-5 w-5" /> },
  { id: "dana", name: "DANA", icon: <Wallet className="h-5 w-5" /> },
  { id: "gopay", name: "GoPay", icon: <Wallet className="h-5 w-5" /> },
  { id: "ovo", name: "OVO", icon: <Wallet className="h-5 w-5" /> },
];

export default function TopupPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");

  const itemImage = PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];

  const handleOrder = () => {
    if (!userId || !selectedPack || !selectedPayment) return;
    router.push("/status?orderId=STS-" + Math.floor(Math.random() * 90000 + 10000));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Header Nav */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="-ml-2 text-muted-foreground hover:text-foreground text-xs md:text-sm font-black"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Back
          </Button>
          
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo className="h-9 w-9 md:h-12 md:w-12" />
          </Link>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        {/* Product Hero Section */}
        <div className="mb-10 md:mb-16">
          <div className="relative h-44 md:h-80 w-full overflow-hidden rounded-3xl bg-muted shadow-lg">
            <Image 
              src={`https://picsum.photos/seed/${id}-banner/1200/400`} 
              alt="Banner Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          </div>

          <div className="relative px-4 py-6 md:px-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
            <div className="relative -mt-20 md:-mt-32 h-32 w-32 md:h-52 md:w-52 shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-background bg-background z-20">
              <Image 
                src={itemImage.imageUrl} 
                alt="Service" 
                fill 
                className="object-cover"
                data-ai-hint={itemImage.imageHint}
              />
            </div>

            <div className="flex-1 space-y-3 z-10">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                  {String(id).replace("-", " ")}
                </h1>
                <p className="text-xs md:text-base text-muted-foreground font-black opacity-70">
                  {itemImage.description || "Official service"}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-[10px] md:text-sm font-black text-foreground">
                  <Zap className="h-4 w-4 text-primary fill-primary" />
                  <span>Proses cepat</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-sm font-black text-foreground">
                  <MessageCircle className="h-4 w-4 text-primary fill-primary/20" />
                  <span>Layanan chat 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-sm font-black text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Pembayaran aman!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Form Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: User Data */}
            <div className="bento-card p-5 md:p-8">
              <div className="-mx-5 -mt-5 mb-6 md:-mx-8 md:-mt-8 px-5 py-4 md:px-8 md:py-5 border-b border-border bg-muted/30 rounded-t-[calc(var(--radius)-1px)] flex items-center gap-3 md:gap-4">
                <div className="flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-[10px] md:text-sm shadow-lg shadow-primary/20">1</div>
                <h2 className="text-sm md:text-xl font-black tracking-tight">Masukkan ID pengguna</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-[10px] md:text-xs font-black text-muted-foreground tracking-wider">User ID</Label>
                  <Input 
                    id="userId" 
                    placeholder="e.g. 12345678" 
                    className="h-12 bg-background border-border text-sm font-bold" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneId" className="text-[10px] md:text-xs font-black text-muted-foreground tracking-wider">Zone ID</Label>
                  <Input 
                    id="zoneId" 
                    placeholder="e.g. 1234" 
                    className="h-12 bg-background border-border text-sm font-bold"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Select Pack */}
            <div className="bento-card p-5 md:p-8">
              <div className="-mx-5 -mt-5 mb-6 md:-mx-8 md:-mt-8 px-5 py-4 md:px-8 md:py-5 border-b border-border bg-muted/30 rounded-t-[calc(var(--radius)-1px)] flex items-center gap-3 md:gap-4">
                <div className="flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-[10px] md:text-sm shadow-lg shadow-primary/20">2</div>
                <h2 className="text-sm md:text-xl font-black tracking-tight">Pilih nominal topup</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`relative flex flex-col p-4 text-left rounded-2xl border transition-all ${
                      selectedPack === pack.id ? "bg-primary/10 border-primary ring-1 ring-primary" : "bg-muted/30 border-border"
                    }`}
                  >
                    {pack.popular && (
                      <Badge className="absolute -top-1.5 -right-1 bg-accent text-[9px] text-accent-foreground font-black px-2 py-0.5 border-none">Populer</Badge>
                    )}
                    <span className="text-[10px] md:text-xs font-bold text-muted-foreground truncate">{pack.amount}</span>
                    <span className="text-[10px] md:text-xs text-primary font-black mt-0.5">{pack.bonus}</span>
                    <span className="text-sm md:text-lg font-black mt-2">{pack.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Step 3: Payment */}
            <div className="bento-card p-5 md:p-8">
              <div className="-mx-5 -mt-5 mb-6 md:-mx-8 md:-mt-8 px-5 py-4 md:px-8 md:py-5 border-b border-border bg-muted/30 rounded-t-[calc(var(--radius)-1px)] flex items-center gap-3 md:gap-4">
                <div className="flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-[10px] md:text-sm shadow-lg shadow-primary/20">3</div>
                <h2 className="text-sm md:text-xl font-black tracking-tight">Metode pembayaran</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedPayment === method.id ? "bg-primary/10 border-primary ring-1 ring-primary" : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-background flex items-center justify-center border border-border">
                        {method.icon}
                      </div>
                      <span className="font-black text-sm">{method.name}</span>
                    </div>
                    {selectedPayment === method.id && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Summary Card */}
            <div className="bento-card p-6 md:p-8 bg-gradient-to-br from-primary/20 via-background to-background border-primary/20 sticky bottom-4 z-40 backdrop-blur-md">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight">Ringkasan pesanan</h3>
                  <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                    <span>Target ID</span>
                    <span className="text-foreground">{userId || "-"} {zoneId ? `(${zoneId})` : ""}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                    <span>Paket</span>
                    <span className="text-foreground">{selectedPack ? PACKS.find(p => p.id === selectedPack)?.amount : "-"}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-sm font-black">Total pembayaran</span>
                    <span className="text-2xl font-black text-primary">
                      {selectedPack ? PACKS.find(p => p.id === selectedPack)?.price : "---"}
                    </span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  disabled={!userId || !selectedPack || !selectedPayment}
                  onClick={handleOrder}
                  className="h-14 md:h-16 rounded-full px-8 text-lg font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform w-full"
                >
                  Bayar sekarang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}