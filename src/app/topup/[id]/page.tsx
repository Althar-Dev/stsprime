"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Check, ChevronLeft, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        <Button 
          variant="ghost" 
          className="mb-4 md:mb-8 -ml-2 text-muted-foreground hover:text-foreground text-xs md:text-sm font-bold"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to catalog
        </Button>

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Left Column: Info */}
          <div className="space-y-6">
            <div className="bento-card p-5 md:p-6 overflow-hidden">
              <div className="relative h-40 md:h-52 w-full rounded-xl overflow-hidden mb-6">
                <Image 
                  src={itemImage.imageUrl} 
                  alt="Service" 
                  fill 
                  className="object-cover"
                  data-ai-hint={itemImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight">{String(id).replace("-", " ")}</h1>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Top up {String(id).replace("-", " ")} instantly! Just enter your ID, select the pack, and pay. Your top-up is processed immediately.
              </p>
              
              <div className="mt-8 space-y-4 border-t border-border pt-6">
                <div className="flex items-center gap-3 text-xs md:text-sm font-black uppercase tracking-tighter">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Official & Secure
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm font-black uppercase tracking-tighter">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Fast Payment
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: User Data */}
            <div className="bento-card p-5 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">1</div>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Enter User ID</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-xs font-black uppercase text-muted-foreground">User ID</Label>
                  <Input 
                    id="userId" 
                    placeholder="e.g. 12345678" 
                    className="h-12 bg-background border-border" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneId" className="text-xs font-black uppercase text-muted-foreground">Zone ID</Label>
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
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Select Amount</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`relative flex flex-col p-3 md:p-4 text-left rounded-xl border transition-all ${
                      selectedPack === pack.id ? "bg-primary/10 border-primary ring-1 ring-primary" : "bg-muted/30 border-border"
                    }`}
                  >
                    {pack.popular && (
                      <Badge className="absolute -top-2 -right-1 bg-accent text-[8px] md:text-[10px] text-accent-foreground font-black uppercase px-2 py-0">POPULAR</Badge>
                    )}
                    <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground">{pack.amount}</span>
                    <span className="text-[10px] md:text-xs text-primary font-black mt-0.5">{pack.bonus}</span>
                    <span className="text-sm md:text-lg font-black mt-2">{pack.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="bento-card p-5 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">3</div>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
                      <span className="font-black uppercase text-sm">{method.name}</span>
                    </div>
                    {selectedPayment === method.id && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Footer */}
            <div className="bento-card p-6 md:p-8 bg-gradient-to-br from-primary/20 via-background to-background border-primary/20 sticky bottom-4 md:static z-40 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-black uppercase">Summary</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase">ID: {userId || "NOT SET"} {zoneId ? `(${zoneId})` : ""}</p>
                  <p className="text-xl md:text-2xl font-black text-primary">
                    {selectedPack ? PACKS.find(p => p.id === selectedPack)?.price : "---"}
                  </p>
                </div>
                <Button 
                  size="lg" 
                  disabled={!userId || !selectedPack || !selectedPayment}
                  onClick={handleOrder}
                  className="h-14 md:h-16 rounded-full px-8 md:px-12 text-lg md:text-xl font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto"
                >
                  TOP UP NOW
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
