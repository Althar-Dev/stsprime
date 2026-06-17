"use client";

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, Loader2, Package, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function StatusPage() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"pending" | "processing" | "success" | null>(null);

  useEffect(() => {
    if (initialOrderId) {
      handleSearch();
    }
  }, [initialOrderId]);

  const handleSearch = () => {
    if (!orderId) return;
    setIsSearching(true);
    setOrderStatus(null);
    setTimeout(() => {
      setIsSearching(false);
      setOrderStatus("processing");
      setTimeout(() => {
        setOrderStatus("success");
      }, 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-headline text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">Track Your Order</h1>
            <p className="text-xs md:text-base text-muted-foreground max-w-md mx-auto">Enter your transaction ID to check the real-time fulfillment status of your purchase.</p>
          </div>

          <div className="bento-card p-4 md:p-6 mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Enter Order ID (e.g. STS-12345)" 
                className="h-12 md:h-14 bg-background border-border text-base md:text-lg" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <Button onClick={handleSearch} disabled={!orderId || isSearching} className="h-12 md:h-14 px-8 bg-primary text-primary-foreground font-black text-base md:text-lg uppercase">
                {isSearching ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6 mr-2" />}
                Track
              </Button>
            </div>
          </div>

          {isSearching && (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 animate-pulse">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
              <p className="font-black text-muted-foreground uppercase tracking-widest text-sm">Validating order sequence...</p>
            </div>
          )}

          {!isSearching && orderStatus && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bento-card p-6 md:p-10 border-primary/20 bg-primary/5">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
                  <div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 mb-3 font-black px-3 py-1 text-[10px] md:text-xs">#{orderId}</Badge>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Order Status</h2>
                  </div>
                  {orderStatus === "success" ? (
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/40 px-5 py-2 text-xs md:text-sm font-black uppercase">Completed</Badge>
                  ) : (
                    <Badge className="bg-accent/20 text-accent border-accent/40 px-5 py-2 text-xs md:text-sm font-black uppercase animate-pulse">Processing</Badge>
                  )}
                </div>

                <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border/50">
                  {/* Step 1 */}
                  <div className="relative flex gap-6 md:gap-8">
                    <div className="z-10 h-6 w-6 shrink-0 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(242,255,0,0.5)]">
                      <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-black uppercase text-sm md:text-base tracking-tight">Order Received</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase mt-1">Payment verified by the gateway.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex gap-6 md:gap-8">
                    <div className={`z-10 h-6 w-6 shrink-0 rounded-full flex items-center justify-center ${
                      orderStatus === "processing" || orderStatus === "success" ? "bg-primary shadow-[0_0_10px_rgba(242,255,0,0.5)]" : "bg-muted border border-border"
                    }`}>
                      {orderStatus === "processing" ? <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" /> : 
                       orderStatus === "success" ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> : <Clock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className={`font-black uppercase text-sm md:text-base tracking-tight ${orderStatus === "pending" ? "text-muted-foreground" : "text-foreground"}`}>Game ID Validation</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase mt-1">Authenticating with game provider servers.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex gap-6 md:gap-8">
                    <div className={`z-10 h-6 w-6 shrink-0 rounded-full flex items-center justify-center ${
                      orderStatus === "success" ? "bg-primary shadow-[0_0_10px_rgba(242,255,0,0.5)]" : "bg-muted border border-border"
                    }`}>
                      {orderStatus === "success" ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> : <Package className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className={`font-black uppercase text-sm md:text-base tracking-tight ${orderStatus !== "success" ? "text-muted-foreground" : "text-foreground"}`}>Delivery Complete</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase mt-1">Credits injected into your target account.</p>
                    </div>
                  </div>
                </div>

                {orderStatus === "success" && (
                  <div className="mt-12 p-6 md:p-8 bg-green-500/5 rounded-2xl border border-green-500/20 text-center">
                    <p className="text-green-500 font-black uppercase text-sm md:text-base mb-2">Transaction Successful!</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase mb-6 max-w-xs mx-auto">Check your game mailbox. Credits have been delivered instantly.</p>
                    <Button variant="outline" className="rounded-full border-green-500/40 text-green-500 hover:bg-green-500/10 font-black uppercase text-xs px-8">Download Receipt</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
