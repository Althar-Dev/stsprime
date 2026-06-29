"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { 
  Zap, 
  ShieldCheck, 
  MessageCircle, 
  Gift, 
  Star, 
  TrendingUp, 
  CreditCard, 
  Coins,
  ArrowRight,
  Gem,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const BENEFITS = [
  {
    title: "STS Coin Cashback",
    description: "Dapatkan STS Coin dari setiap transaksi yang sukses. Gunakan koin untuk potongan harga langsung pada pembelian berikutnya.",
    icon: <Coins className="h-6 w-6 text-primary" />,
    color: "bg-primary/10",
  },
  {
    title: "Proses Instan 24/7",
    description: "Sistem otomatis kami memastikan item digital atau koin game Anda terkirim dalam hitungan detik setelah pembayaran dikonfirmasi.",
    icon: <Zap className="h-6 w-6 text-accent" />,
    color: "bg-accent/10",
  },
  {
    title: "Prioritas Dukungan",
    description: "Member terverifikasi mendapatkan jalur cepat ke tim dukungan pelanggan kami yang tersedia 24 jam setiap hari.",
    icon: <MessageCircle className="h-6 w-6 text-green-500" />,
    color: "bg-green-500/10",
  },
  {
    title: "Keamanan Terjamin",
    description: "Setiap transaksi dilindungi oleh sistem keamanan berlapis untuk memastikan data dan pembayaran Anda selalu aman.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    color: "bg-primary/10",
  },
];

const TIERS = [
  {
    name: "ROOKIE",
    requirement: "Pendaftaran Baru",
    multiplier: "1x Poin",
    features: ["Akses Semua Game", "Standard Support"],
    icon: <Star className="h-5 w-5" />,
    current: true
  },
  {
    name: "PRO GAMER",
    requirement: "10+ Transaksi",
    multiplier: "1.5x Poin",
    features: ["Diskon Member", "Priority Support", "STS Coin Bonus"],
    icon: <TrendingUp className="h-5 w-5" />,
    current: false
  },
  {
    name: "LEGENDARY",
    requirement: "50+ Transaksi",
    multiplier: "2.5x Poin",
    features: ["Flash Sale Eksklusif", "Personal Concierge", "Gift Tahunan"],
    icon: <Trophy className="h-5 w-5" />,
    current: false
  }
];

export default function BenefitPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-[10px] md:text-xs font-black tracking-widest uppercase">
              Exclusive Member Perks
            </Badge>
            <h1 className="font-headline text-4xl md:text-7xl font-black mb-6 tracking-tighter">
              Banyak Untungnya di <span className="text-primary">STSPrime</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto font-bold opacity-80 leading-relaxed px-4">
              Kami tidak hanya sekadar tempat topup. Kami adalah mitra gaming Anda yang memberikan nilai lebih di setiap klik.
            </p>
          </div>
        </div>

        {/* Core Benefits Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="bento-card p-6 md:p-8 flex flex-col items-start hover:translate-y-[-4px] transition-all duration-300">
                <div className={`h-12 w-12 rounded-2xl ${benefit.color} flex items-center justify-center mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="font-headline text-lg font-black mb-3">{benefit.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-bold leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* STS Coin Focus Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="bento-card bg-primary/5 border-primary/20 p-8 md:p-16 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                  <Coins className="h-3.5 w-3.5" /> DIGITAL CURRENCY
                </div>
                <h2 className="font-headline text-3xl md:text-5xl font-black tracking-tight leading-none">
                  Kenalan dengan <br/><span className="text-primary">STS Coin</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-bold leading-relaxed">
                  STS Coin adalah mata uang virtual eksklusif di ekosistem STSPrime. Setiap kali Anda melakukan topup, Anda akan mendapatkan koin yang bisa dikumpulkan. 
                  <br/><br/>
                  Semakin sering Anda bertransaksi, semakin banyak saldo STS Coin yang Anda miliki untuk mendapatkan potongan harga hingga gratis topup!
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-primary text-primary-foreground font-black px-8">
                    Cara Dapat Koin
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="rounded-full font-black px-8 border-border">
                      Belanja Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative h-64 w-64 md:h-80 md:w-80 animate-in zoom-in duration-1000">
                  <img 
                    src="/img/coin.png" 
                    alt="STS Coin Large" 
                    className="h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(242,255,0,0.3)] animate-pulse" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Tier Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-5xl font-black mb-4">Membership Level</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-bold tracking-widest uppercase">Semakin sering topup, semakin tinggi pangkatmu!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TIERS.map((tier, i) => (
              <div key={i} className={`bento-card p-8 flex flex-col relative ${tier.current ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'opacity-80'}`}>
                {tier.current && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-black text-[10px] px-3">
                    TIER AWAL
                  </Badge>
                )}
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-6 ${tier.current ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {tier.icon}
                </div>
                <h4 className="font-headline text-xl font-black mb-1">{tier.name}</h4>
                <p className="text-[10px] font-black text-muted-foreground mb-4">{tier.requirement}</p>
                
                <div className="p-3 bg-muted/50 rounded-lg mb-6 flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground">POINT MULTIPLIER</span>
                  <span className="text-sm font-black text-primary">{tier.multiplier}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="text-xs font-bold flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button variant={tier.current ? "default" : "outline"} className="w-full font-black text-xs rounded-xl">
                  {tier.current ? "Anda di Sini" : "Segera Hadir"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <h2 className="font-headline text-3xl md:text-6xl font-black tracking-tighter">Siap Menikmati Keuntungan?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg gap-2 shadow-xl shadow-primary/20 w-full sm:w-auto">
                  Mulai Topup Sekarang <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-black text-lg border-border w-full sm:w-auto">
                Daftar Akun
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
