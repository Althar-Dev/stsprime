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
import { Check, ChevronLeft, CreditCard, ShieldCheck, Wallet, Zap, MessageCircle, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";

const PACKS = [
  { id: 1, amount: "86 diamonds", price: "Rp 19,500", bonus: "+9 bonus" },
  { id: 2, amount: "172 diamonds", price: "Rp 38,000", bonus: "+18 bonus", popular: true },
  { id: 3, amount: "257 diamonds", price: "Rp 56,000", bonus: "+26 bonus" },
  { id: 4, amount: "344 diamonds", price: "Rp 74,000", bonus: "+35 bonus" },
  { id: 5, amount: "706 diamonds", price: "Rp 148,000", bonus: "+72 bonus" },
  { id: 6, amount: "1050 diamonds", price: "Rp 215,000", bonus: "+110 bonus" },
];

const PAYMENT_METHODS = [
  { id: "qris", name: "qris", icon: <CreditCard className="h-5 w-5" /> },
  { id: "dana", name: "dana", icon: <Wallet className="h-5 w-5" /> },
  { id: "gopay", name: "gopay", icon: <Wallet className="h-5 w-5" /> },
  { id: "ovo", name: "ovo", icon: <Wallet className="h-5 w-5" /> },
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

  const selectedPackData = PACKS.find(p => p.id === selectedPack);

  const StepHeader = ({ number, title }: { number: number; title: string }) => (
    <div className="-mx-5 -mt-5 mb-6 md:-mx-8 md:-mt-8 flex items-stretch overflow-hidden rounded-t-md bg-muted/30">
      <div className="flex w-10 md:w-16 shrink-0 items-center justify-center bg-primary text-primary-foreground font-black text-sm md:text-xl">
        {number}
      </div>
      <div className="flex-1 flex items-center px-4 py-3 md:px-6 md:py-4 bg-muted/50 border-b border-border">
        <h2 className="text-sm md:text-lg font-bold tracking-tight text-foreground">{title}</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Header Nav */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="-ml-2 text-muted-foreground hover:text-foreground text-xs md:text-sm font-bold"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            back
          </Button>
          
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo className="h-9 w-9 md:h-12 md:w-12" />
          </Link>
        </div>
      </nav>

      <main className="flex-grow pb-32 lg:pb-10">
        <div className="container mx-auto px-4 py-6 md:py-10">
          {/* Product Hero Section - No Card Wrapper */}
          <div className="mb-10 md:mb-16">
            <div className="relative h-44 md:h-80 w-full overflow-hidden rounded-md bg-muted shadow-lg">
              <Image 
                src={`https://picsum.photos/seed/${id}-banner/1200/400`} 
                alt="Banner background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
            </div>

            <div className="relative px-4 py-6 md:px-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
              <div className="relative -mt-20 md:-mt-32 h-32 w-32 md:h-52 md:w-52 shrink-0 rounded-md overflow-hidden shadow-2xl border-4 border-background bg-background z-20">
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
                  <p className="text-xs md:text-base text-muted-foreground font-bold opacity-70">
                    {itemImage.description || "official service"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-foreground">
                    <Zap className="h-4 w-4 text-primary fill-primary" />
                    <span>proses cepat</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-foreground">
                    <MessageCircle className="h-4 w-4 text-primary fill-primary/20" />
                    <span>layanan chat 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>pembayaran aman!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Form Content - Steps on the left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: User Data */}
              <div className="bento-card !rounded-md p-5 md:p-8">
                <StepHeader number={1} title="masukkan data akun" />
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-wider">user id</Label>
                    <Input 
                      id="userId" 
                      placeholder="e.g. 12345678" 
                      className="h-12 bg-background border-border text-sm font-bold rounded-md" 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zoneId" className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-wider">zone id</Label>
                    <Input 
                      id="zoneId" 
                      placeholder="e.g. 1234" 
                      className="h-12 bg-background border-border text-sm font-bold rounded-md"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Select Pack */}
              <div className="bento-card !rounded-md p-5 md:p-8">
                <StepHeader number={2} title="pilih nominal topup" />
                
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {PACKS.map((pack) => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPack(pack.id)}
                      className={`relative flex flex-col p-4 text-left rounded-md border transition-all ${
                        selectedPack === pack.id ? "bg-primary/10 border-primary ring-1 ring-primary" : "bg-muted/30 border-border"
                      }`}
                    >
                      {pack.popular && (
                        <Badge className="absolute -top-1.5 -right-1 bg-accent text-[9px] text-accent-foreground font-bold px-2 py-0.5 border-none">populer</Badge>
                      )}
                      <span className="text-[10px] md:text-xs font-bold text-muted-foreground truncate">{pack.amount}</span>
                      <span className="text-[10px] md:text-xs text-primary font-bold mt-0.5">{pack.bonus}</span>
                      <span className="text-sm md:text-lg font-bold mt-2">{pack.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="bento-card !rounded-md p-5 md:p-8">
                <StepHeader number={3} title="metode pembayaran" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center justify-between p-4 rounded-md border transition-all ${
                        selectedPayment === method.id ? "bg-primary/10 border-primary ring-1 ring-primary" : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-md bg-background flex items-center justify-center border border-border">
                          {method.icon}
                        </div>
                        <span className="font-bold text-sm">{method.name}</span>
                      </div>
                      {selectedPayment === method.id && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Content - Order Summary (Desktop Sticky) */}
            <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
              <div className="bento-card !rounded-md p-6 md:p-8 bg-gradient-to-br from-primary/20 via-background to-background border-primary/20 backdrop-blur-md">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold tracking-tight">ringkasan pesanan</h3>
                    <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                      <span>target id</span>
                      <span className="text-foreground">{userId || "-"} {zoneId ? `(${zoneId})` : ""}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                      <span>paket</span>
                      <span className="text-foreground">{selectedPack ? selectedPackData?.amount : "belum ada produk yang dipilih"}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-sm font-bold">total pembayaran</span>
                      <span className="text-2xl font-black text-primary">
                        {selectedPack ? selectedPackData?.price : "---"}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    disabled={!userId || !selectedPack || !selectedPayment}
                    onClick={handleOrder}
                    className="h-9 rounded-md px-8 text-sm font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform w-full"
                  >
                    bayar sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Summary Bar - Drawer Style from reference */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border p-5 pb-6 animate-in slide-in-from-bottom duration-300 rounded-t-md shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto space-y-4">
          {/* Product and Pack Info with Border */}
          <div className="flex items-center justify-between p-3 border border-border rounded-md bg-card/30 min-h-[64px]">
            {selectedPack ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted border border-border">
                    <Image 
                      src={itemImage.imageUrl} 
                      alt={itemImage.description} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-foreground leading-tight">
                      {String(id).replace("-", " ")}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground">
                      {selectedPackData?.amount}
                    </p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                  <ChevronUp className="h-5 w-5" />
                </div>
              </>
            ) : (
              <p className="text-[11px] font-bold text-muted-foreground w-full text-center">
                Belum ada produk yang dipilih.
              </p>
            )}
          </div>

          {/* Large Action Button */}
          <div className="space-y-3">
             <Button 
              disabled={!userId || !selectedPack || !selectedPayment}
              onClick={handleOrder}
              className="w-full h-9 rounded-md font-black text-sm bg-primary text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              bayar sekarang
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
