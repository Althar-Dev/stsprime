
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
import { Check, ChevronLeft, CreditCard, ShieldCheck, Wallet } from "lucide-react";
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
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <Button 
            variant="ghost" 
            className="-ml-2 text-muted-foreground hover:text-foreground text-xs md:text-sm font-bold"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo className="h-9 w-9 md:h-12 md:w-12" />
          </Link>
        </div>

        {/* Product Info - Full Width Header with Banner */}
        <div className="mb-10 md:mb-16 relative overflow-hidden rounded-[2rem] border border-border bg-muted/20">
          {/* Background Banner Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://picsum.photos/seed/banner/1200/400" 
              alt="Banner Background"
              fill
              className="object-cover opacity-10 dark:opacity-30 blur-[2px]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center p-6 md:p-12">
            {/* Image Container */}
            <div className="relative h-44 w-full md:h-52 md:w-52 shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-background">
              <Image 
                src={itemImage.imageUrl} 
                alt="Service" 
                fill 
                className="object-cover"
                data-ai-hint={itemImage.imageHint}
              />
            </div>
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter capitalize">{String(id).replace("-", " ")}</h1>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xl">
                Top up {String(id).replace("-", " ")} instantly! Just enter your ID, select the pack, and pay. Your top-up is processed immediately.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] md:text-xs font-black tracking-tighter uppercase text-primary border border-primary/20">
                  <ShieldCheck className="h-4 w-4" />
                  Official & Secure
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] md:text-xs font-black tracking-tighter uppercase text-primary border border-primary/20">
                  <CreditCard className="h-4 w-4" />
                  Fast Payment
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Form Content: Steps 1 & 2 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: User Data */}
            <div className="bento-card p-5 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">1</div>
                <h2 className="text-lg md:text-xl font-black tracking-tight">Enter user ID</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-xs font-black text-muted-foreground">User ID</Label>
                  <Input 
                    id="userId" 
                    placeholder="e.g. 12345678" 
                    className="h-12 bg-background border-border" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneId" className="text-xs font-black text-muted-foreground">Zone ID</Label>
                  <Input 
                    id="zoneId" 
                    placeholder="e.g. 1234" 
                    className="h-12 bg-background border-border"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Select Pack */}
            <div className="bento-card p-5 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">2</div>
                <h2 className="text-lg md:text-xl font-black tracking-tight">Select amount</h2>
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
                      <Badge className="absolute -top-1.5 -right-1 bg-accent text-[9px] text-accent-foreground font-black px-2 py-0.5">Popular</Badge>
                    )}
                    <span className="text-[10px] md:text-xs font-bold text-muted-foreground truncate">{pack.amount}</span>
                    <span className="text-[10px] md:text-xs text-primary font-black mt-0.5">{pack.bonus}</span>
                    <span className="text-sm md:text-lg font-black mt-2">{pack.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content: Step 3 & Checkout */}
          <div className="space-y-6">
            {/* Step 3: Payment */}
            <div className="bento-card p-5 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">3</div>
                <h2 className="text-lg md:text-xl font-black tracking-tight">Payment</h2>
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
                  <h3 className="text-lg font-black">Order Summary</h3>
                  <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                    <span>Target ID</span>
                    <span className="text-foreground">{userId || "-"} {zoneId ? `(${zoneId})` : ""}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                    <span>Pack</span>
                    <span className="text-foreground">{selectedPack ? PACKS.find(p => p.id === selectedPack)?.amount : "-"}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-sm font-black">Total Price</span>
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
                  Top up now
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
