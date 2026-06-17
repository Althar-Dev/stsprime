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
    // Simulate order processing
    router.push("/status?orderId=STS-" + Math.floor(Math.random() * 90000 + 10000));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to catalog
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Info */}
          <div className="space-y-6">
            <div className="bento-card p-6 overflow-hidden">
              <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6">
                <Image 
                  src={itemImage.imageUrl} 
                  alt="Service" 
                  fill 
                  className="object-cover"
                  data-ai-hint={itemImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">{String(id).replace("-", " ")}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Top up {String(id).replace("-", " ")} instantly! Just enter your ID, select the pack you want, and complete the payment. Your top-up will be processed immediately.
              </p>
              
              <div className="mt-8 space-y-4 border-t border-border pt-6">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Official & Secure
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Various Payment Methods
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: User Data */}
            <div className="bento-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                <h2 className="text-xl font-bold">Enter User ID</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input 
                    id="userId" 
                    placeholder="e.g. 12345678" 
                    className="h-12 bg-background" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneId">Zone ID (Optional)</Label>
                  <Input 
                    id="zoneId" 
                    placeholder="e.g. 1234" 
                    className="h-12 bg-background"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                  />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">To find your ID, tap your avatar in the game. Your User ID and Zone ID are displayed there.</p>
            </div>

            {/* Step 2: Select Pack */}
            <div className="bento-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                <h2 className="text-xl font-bold">Select Topup Amount</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`relative flex flex-col p-4 text-left rounded-xl border transition-all hover:border-primary/50 ${
                      selectedPack === pack.id ? "bg-primary/10 border-primary ring-1 ring-primary" : "bg-muted/30 border-border"
                    }`}
                  >
                    {pack.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-secondary text-[10px] text-secondary-foreground font-bold">Best Value</Badge>
                    )}
                    <span className="text-sm font-bold">{pack.amount}</span>
                    <span className="text-xs text-primary font-medium mt-1">{pack.bonus}</span>
                    <span className="text-lg font-black mt-3">{pack.price}</span>
                    {selectedPack === pack.id && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="bento-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                <h2 className="text-xl font-bold">Select Payment</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedPayment === method.id ? "bg-primary/10 border-primary ring-1 ring-primary" : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border">
                        {method.icon}
                      </div>
                      <span className="font-bold">{method.name}</span>
                    </div>
                    {selectedPayment === method.id && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Checkout */}
            <div className="bento-card p-6 bg-gradient-to-br from-primary/20 to-secondary/10 border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-black">Total Summary</h3>
                  <p className="text-sm text-muted-foreground">Order for ID: {userId || "..."} ({zoneId || "..."})</p>
                  <p className="text-lg font-bold text-primary">
                    {selectedPack ? PACKS.find(p => p.id === selectedPack)?.price : "Select a pack"}
                  </p>
                </div>
                <Button 
                  size="lg" 
                  disabled={!userId || !selectedPack || !selectedPayment}
                  onClick={handleOrder}
                  className="h-16 rounded-full px-12 text-xl font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
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
