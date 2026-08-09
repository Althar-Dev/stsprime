"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle,
  MessageSquare,
  Mail,
  Send,
  Clock,
  Headphones,
  CheckCircle2,
  Loader2,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CONTACT_CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp CS 24/7",
    desc: "Respon tercepat di bawah 2 menit.",
    actionText: "Chat WhatsApp",
    href: "https://wa.me/6281234567890?text=Halo%20Admin%20STS%20PRIME%2C%20saya%20butuh%20bantuan",
    iconColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    buttonColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-emerald-500/5",
    badge: "Fast Response",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "Bantuan resmi via email.",
    actionText: "Kirim Email",
    href: "mailto:support@stsprime.com",
    iconColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    buttonColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 shadow-cyan-500/5",
    badge: "Official",
  },
  {
    icon: Send,
    title: "Telegram CS",
    desc: "Update info & bantuan cepat.",
    actionText: "Buka Telegram",
    href: "https://t.me/stsprime_official",
    iconColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    buttonColor: "bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20 shadow-sky-500/5",
    badge: "Community",
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    desc: "24 Jam Non-stop setiap hari.",
    actionText: "Online 24/7",
    href: "https://wa.me/6281234567890",
    iconColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    buttonColor: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 shadow-amber-500/5",
    badge: "24/7 Active",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("topup");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Harap isi nama, email, dan pesan Anda.",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate sending form
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);

    toast({
      title: "Pesan Terkirim!",
      description: "Tim Customer Service kami akan merespons pesan Anda sesegera mungkin.",
    });

    setName("");
    setEmail("");
    setOrderId("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pb-16 sm:pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-4 sm:space-y-6">
            <Badge className="bg-primary/10 text-primary border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-widest rounded-full">
              <Headphones className="h-3.5 w-3.5 mr-1.5" /> Hubungi Layanan Pelanggan
            </Badge>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Kami Siap Membantu <span className="text-primary">24/7</span>
            </h1>

            <p className="text-xs sm:text-base text-muted-foreground font-bold max-w-xl mx-auto opacity-80 leading-relaxed">
              Memiliki kendala transaksi, pertanyaan koin, atau penawaran kerja sama? Pilih saluran bantuan favorit Anda di bawah ini.
            </p>
          </div>
        </section>

        {/* CHANNELS GRID */}
        <section className="container mx-auto px-4 max-w-5xl pt-10 sm:pt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CONTACT_CHANNELS.map((ch, idx) => (
              <Card
                key={idx}
                className="bento-card p-5 sm:p-6 border-border/50 bg-card/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border shrink-0", ch.iconColor)}>
                      <ch.icon className="h-5 w-5" />
                    </div>
                    <Badge className={cn("text-[9px] font-black uppercase tracking-widest border", ch.badgeColor)}>
                      {ch.badge}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-headline font-black text-base text-foreground">{ch.title}</h3>
                    <p className="text-xs text-muted-foreground font-bold leading-relaxed">{ch.desc}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a href={ch.href} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className={cn("w-full h-10 rounded-xl font-black text-xs uppercase tracking-wider border shadow-sm transition-all", ch.buttonColor)}>
                      {ch.actionText}
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CONTACT FORM & FAQ SHORTCUT */}
        <section className="container mx-auto px-4 max-w-5xl pt-12 sm:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* FORM SIDE */}
            <div className="lg:col-span-7">
              <Card className="bento-card p-6 sm:p-8 border-border/50 bg-card/30 backdrop-blur-sm rounded-3xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="font-headline text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" /> Kirim Pesan Langsung
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold">
                      Isi formulir di bawah ini dan tim support kami akan membalas via email.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Nama Lengkap *
                      </Label>
                      <Input
                        placeholder="Nama Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 rounded-xl bg-background/50 border-border/60 text-xs sm:text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Email Aktif *
                      </Label>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-xl bg-background/50 border-border/60 text-xs sm:text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Kategori Pertanyaan
                      </Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-11 rounded-xl bg-background/50 border-border/60 text-xs font-bold">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="topup">Kendala Topup / Order</SelectItem>
                          <SelectItem value="payment">Masalah Pembayaran</SelectItem>
                          <SelectItem value="coins">Koin STS & VIP</SelectItem>
                          <SelectItem value="partnership">Kerjasama & Bisnis</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        ID Order (Opsional)
                      </Label>
                      <Input
                        placeholder="Contoh: STS-89211"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="h-11 rounded-xl bg-background/50 border-border/60 text-xs sm:text-sm font-bold font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Pesan atau Detail Kendala *
                    </Label>
                    <Textarea
                      placeholder="Jelaskan detail pertanyaan atau kendala Anda..."
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-xl bg-background/50 border-border/60 text-xs sm:text-sm font-bold resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Kirim Pesan Support
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* INFO & FAQ BANNER SIDE */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bento-card p-6 sm:p-8 border-border/50 bg-card/30 backdrop-blur-sm rounded-3xl space-y-5">
                <div className="space-y-2">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                    Garansi Layanan
                  </Badge>
                  <h3 className="font-headline text-lg sm:text-xl font-black text-foreground">Jaminan Respons Cepat</h3>
                  <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                    Setiap laporan kendala transaksi diprioritaskan oleh tim CS teknis kami. Kepuasan dan keamanan Anda adalah prioritas utama STS PRIME.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground">Verifikasi Otomatis Sistem Kilat</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground">Garansi Uang Kembali Jika Gagal</span>
                  </div>
                </div>
              </Card>

              {/* FAQ LINK CARD */}
              <Card className="bento-card p-6 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <HelpCircle className="h-4 w-4" /> Pusat Bantuan
                </div>
                <h4 className="font-headline font-black text-base text-foreground">Cari Jawaban Instan di FAQ</h4>
                <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                  Banyak pertanyaan seputar pengisian item dan pembayaran sudah terbukti dapat diselesaikan langsung di Pusat Bantuan.
                </p>
                <Link href="/support" className="block pt-1">
                  <Button variant="outline" className="w-full h-10 rounded-xl font-black text-xs border-primary/30 text-primary hover:bg-primary/10">
                    Buka Pusat Bantuan
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
