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
import { Check, ChevronLeft, CreditCard, ShieldCheck, Wallet, Zap, MessageCircle, ChevronUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const itemImage = PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];
  const selectedPackData = PACKS.find(p => p.id === selectedPack);
  const selectedPaymentData = PAYMENT_METHODS.find(m => m.id === selectedPayment);

  const handleOrder = () => {
    if (!userId || !selectedPack || !selectedPayment) return;
    setShowCheckout(true);
  };

  const confirmOrder = () => {
    router.push("/status?orderId=STS-" + Math.floor(Math.random() * 90000 + 10000));
  };

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
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="-ml-2 text-muted-foreground hover:text-foreground text-xs md:text-sm font-bold"
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

      <main className="flex-grow pb-32 lg:pb-10">
        <div className="container mx-auto px-4 py-6 md:py-10">
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
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none capitalize">
                    {String(id).replace("-", " ")}
                  </h1>
                  <p className="text-xs md:text-base text-muted-foreground font-bold opacity-70 capitalize">
                    {itemImage.description || "Official Service"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-foreground">
                    <Zap className="h-4 w-4 text-primary fill-primary" />
                    <span>Proses Cepat</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-foreground">
                    <MessageCircle className="h-4 w-4 text-primary fill-primary/20" />
                    <span>Layanan Chat 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Pembayaran Aman!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="bento-card !rounded-md p-5 md:p-8">
                <StepHeader number={1} title="Masukkan Data Akun" />
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-wider">User ID</Label>
                    <Input 
                      id="userId" 
                      placeholder="e.g. 12345678" 
                      className="h-12 bg-background border-border text-sm font-bold rounded-md" 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zoneId" className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-wider">Zone ID</Label>
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

              <div className="bento-card !rounded-md p-5 md:p-8">
                <StepHeader number={2} title="Pilih Nominal Topup" />
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
                        <Badge className="absolute -top-1.5 -right-1 bg-accent text-[9px] text-accent-foreground font-bold px-2 py-0.5 border-none">Populer</Badge>
                      )}
                      <span className="text-[10px] md:text-xs font-bold text-muted-foreground truncate">{pack.amount}</span>
                      <span className="text-[10px] md:text-xs text-primary font-bold mt-0.5">{pack.bonus}</span>
                      <span className="text-sm md:text-lg font-bold mt-2">{pack.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bento-card !rounded-md p-5 md:p-8">
                <StepHeader number={3} title="Metode Pembayaran" />
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

            <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
              <div className="bento-card !rounded-md p-6 md:p-8 bg-gradient-to-br from-primary/20 via-background to-background border-primary/20 backdrop-blur-md">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold tracking-tight">Ringkasan Pesanan</h3>
                    <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                      <span>Target ID</span>
                      <span className="text-foreground">{userId || "-"} {zoneId ? `(${zoneId})` : ""}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-muted-foreground border-b border-border/50 pb-2">
                      <span>Paket</span>
                      <span className="text-foreground">{selectedPack ? selectedPackData?.amount : "Belum ada produk yang dipilih"}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-sm font-bold">Total Pembayaran</span>
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
                    Bayar Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border p-5 pb-6 animate-in slide-in-from-bottom duration-300 rounded-t-md shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto space-y-4">
          {isDetailsOpen && selectedPack && (
            <div className="mb-2 space-y-2 border-b border-border pb-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                <span>Harga</span>
                <span className="text-foreground">{selectedPackData?.price}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                <span>Jumlah</span>
                <span className="text-foreground">{selectedPackData?.amount}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                <span>Biaya Layanan</span>
                <span className="text-foreground">Rp 0</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-xs font-bold">Total Pembayaran</span>
                <span className="text-base font-black text-primary">{selectedPackData?.price}</span>
              </div>
            </div>
          )}

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
                    <p className="text-sm font-bold text-foreground leading-tight capitalize">
                      {String(id).replace("-", " ")}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground">
                      {selectedPackData?.amount}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground transition-transform duration-300"
                  style={{ transform: isDetailsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              </>
            ) : (
              <p className="text-[11px] font-bold text-muted-foreground w-full text-center">
                Belum ada produk yang dipilih.
              </p>
            )}
          </div>

          <div className="space-y-3">
             <Button 
              disabled={!userId || !selectedPack || !selectedPayment}
              onClick={handleOrder}
              className="w-full h-9 rounded-md font-black text-sm bg-primary text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              Bayar Sekarang
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border bg-background rounded-xl">
          <DialogHeader className="p-6 md:p-8 bg-muted/30 border-b border-border">
            <DialogTitle className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-primary" />
              Konfirmasi Pesanan
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Item</span>
                <span className="text-sm font-black capitalize">{String(id).replace("-", " ")}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Target ID</span>
                <span className="text-sm font-black text-primary">{userId} {zoneId ? `(${zoneId})` : ""}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Nominal</span>
                <span className="text-sm font-black">{selectedPackData?.amount}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Metode</span>
                <span className="text-sm font-black">{selectedPaymentData?.name}</span>
              </div>
            </div>

            <div className="bg-primary/5 p-5 rounded-lg border border-primary/20 space-y-3">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Harga Paket</span>
                <span className="text-foreground">{selectedPackData?.price}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Biaya Layanan</span>
                <span className="text-foreground">Rp 0</span>
              </div>
              <Separator className="bg-primary/20" />
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-black">Total Bayar</span>
                <span className="text-xl font-black text-primary">{selectedPackData?.price}</span>
              </div>
            </div>
            
            <p className="text-[10px] text-muted-foreground text-center font-bold">
              Pastikan data akun dan nominal sudah benar sebelum melanjutkan.
            </p>
          </div>

          <DialogFooter className="p-6 md:p-8 bg-muted/30 border-t border-border flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowCheckout(false)}
              className="flex-1 h-11 rounded-lg font-bold border-border"
            >
              Batal
            </Button>
            <Button 
              onClick={confirmOrder}
              className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Pesan Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
