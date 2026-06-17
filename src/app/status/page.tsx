
"use client";

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, Circle, Clock, Loader2, Package, Search } from "lucide-react";
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
    setIsSearching(true);
    setOrderStatus(null);
    setTimeout(() => {
      setIsSearching(false);
      setOrderStatus("processing");
      
      // Simulate status change after a few seconds
      setTimeout(() => {
        setOrderStatus("success");
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-black mb-4 uppercase">Track Your Order</h1>
            <p className="text-muted-foreground">Check the real-time fulfillment status of your transaction.</p>
          </div>

          <div className="bento-card p-6 mb-12">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter Order ID (e.g. STS-12345)" 
                className="h-12 bg-background" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <Button onClick={handleSearch} disabled={!orderId || isSearching} className="h-12 px-8 bg-primary text-primary-foreground font-bold">
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}
                Track
              </Button>
            </div>
          </div>

          {isSearching && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="font-bold text-muted-foreground">Fetching transaction details...</p>
            </div>
          )}

          {!isSearching && orderStatus && (
            <div className="space-y-6">
              <div className="bento-card p-8 border-primary/20 bg-primary/5">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">Order ID: {orderId}</Badge>
                    <h2 className="text-2xl font-black">Transaction Status</h2>
                  </div>
                  {orderStatus === "success" ? (
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 px-4 py-1.5 text-sm font-bold">Completed</Badge>
                  ) : (
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30 px-4 py-1.5 text-sm font-bold animate-pulse">Processing</Badge>
                  )}
                </div>

                <div className="relative space-y-10 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
                  <div className="relative flex gap-6">
                    <div className="z-10 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold">Order Received</p>
                      <p className="text-xs text-muted-foreground">We have received your payment and order details.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-6">
                    <div className={`z-10 h-6 w-6 rounded-full flex items-center justify-center ${
                      orderStatus === "processing" || orderStatus === "success" ? "bg-primary" : "bg-muted border border-border"
                    }`}>
                      {orderStatus === "processing" ? <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" /> : 
                       orderStatus === "success" ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> : <Clock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className={`font-bold ${orderStatus === "pending" ? "text-muted-foreground" : ""}`}>Validating Game ID</p>
                      <p className="text-xs text-muted-foreground">Instant validation with game server provider.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-6">
                    <div className={`z-10 h-6 w-6 rounded-full flex items-center justify-center ${
                      orderStatus === "success" ? "bg-primary" : "bg-muted border border-border"
                    }`}>
                      {orderStatus === "success" ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> : <Package className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className={`font-bold ${orderStatus !== "success" ? "text-muted-foreground" : ""}`}>Delivery Complete</p>
                      <p className="text-xs text-muted-foreground">Credits have been added to your account.</p>
                    </div>
                  </div>
                </div>

                {orderStatus === "success" && (
                  <div className="mt-12 p-6 bg-green-500/10 rounded-2xl border border-green-500/20 text-center">
                    <p className="text-green-500 font-bold mb-2">Transaction Successful!</p>
                    <p className="text-xs text-muted-foreground mb-4">You have successfully topped up 172 Diamonds for MLBB ID: 12345678.</p>
                    <Button variant="outline" className="rounded-full border-green-500/30 text-green-500 hover:bg-green-500/10">Download Receipt</Button>
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
