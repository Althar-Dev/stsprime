"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  CreditCard,
  Coins,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HELP_CATEGORIES = [
  {
    id: "topup",
    icon: Zap,
    title: "Panduan Topup",
    desc: "Cara melakukan pengisian saldo & diamond game secara cepat.",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Metode Pembayaran",
    desc: "Informasi seputar QRIS, Transfer Bank, E-Wallet, dan Virtual Account.",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    id: "coins",
    icon: Coins,
    title: "Koin STS & VIP",
    desc: "Sistem cashback koin, tukar voucher, serta manfaat member VIP.",
    color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Keamanan & Garansi",
    desc: "Jaminan transaksi 100% legal, aman, dan garansi pengembalian dana.",
    color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  },
];

const FAQS = [
  {
    id: "faq-1",
    category: "topup",
    question: "Berapa lama proses pengisian topup di STS PRIME?",
    answer:
      "Seluruh transaksi di STS PRIME diproses secara otomatis oleh sistem kilat kami 24/7. Rata-rata waktu pemrosesan adalah 1-3 detik setelah pembayaran berhasil diverifikasi.",
  },
  {
    id: "faq-2",
    category: "topup",
    question: "Bagaimana jika item/diamond belum masuk setelah membayar?",
    answer:
      "Jika dalam waktu 5 menit item belum masuk, silakan periksa status transaksi di halaman Riwayat Transaksi. Apabila status sukses namun item belum bertambah, cukup klik tombol 'Hubungi CS' untuk klaim bantuan langsung.",
  },
  {
    id: "faq-3",
    category: "payment",
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Kami mendukung pembayaran instan via QRIS (BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay, LinkAja), Virtual Account Bank, serta E-Wallet.",
  },
  {
    id: "faq-4",
    category: "payment",
    question: "Bagaimana cara melakukan pembayaran menggunakan QRIS?",
    answer:
      "Setelah memilih produk & checkout, pilih metode QRIS. Pindai (scan) kode QR yang tampil menggunakan aplikasi m-banking atau e-wallet pilihan Anda. Pembayaran akan terdeteksi otomatis tanpa perlu konfirmasi manual.",
  },
  {
    id: "faq-5",
    category: "coins",
    question: "Bagaimana cara mendapatkan dan menggunakan Koin STS?",
    answer:
      "Setiap kali Anda melakukan transaksi topup, Anda akan mendapatkan cashback Koin STS. 1 Koin STS bernilai Rp 1 dan dapat digunakan langsung untuk potongan harga instan pada transaksi berikutnya.",
  },
  {
    id: "faq-6",
    category: "coins",
    question: "Apa keuntungan menjadi member VIP STS PRIME?",
    answer:
      "Member VIP mendapatkan harga khusus yang lebih murah, bonus koin cashback lebih tinggi, prioritas antrean CS, serta badge eksklusif VIP pada profil akun.",
  },
  {
    id: "faq-7",
    category: "security",
    question: "Apakah topup di STS PRIME aman dan legal?",
    answer:
      "Ya, 100% aman dan legal! Kami hanya menyediakan pengisian resmi (official topup) yang terhubung langsung dengan publisher game resmi.",
  },
  {
    id: "faq-8",
    category: "security",
    question: "Apakah saldo koin saya bisa kedaluwarsa?",
    answer:
      "Tidak! Koin STS yang berada di akun Anda berlaku selamanya tanpa batas waktu kedaluwarsa.",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? faq.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pb-16 sm:pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-4 sm:space-y-6">
            <Badge className="bg-primary/10 text-primary border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-widest rounded-full">
              <HelpCircle className="h-3.5 w-3.5 mr-1.5" /> Pusat Bantuan & Support
            </Badge>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Ada yang bisa kami <span className="text-primary">bantu?</span>
            </h1>

            <p className="text-xs sm:text-base text-muted-foreground font-bold max-w-xl mx-auto opacity-80 leading-relaxed">
              Cari panduan cepat, bantuan pembayaran, atau informasi seputar layanan topup game di STS PRIME.
            </p>

            {/* SEARCH INPUT */}
            <div className="max-w-xl mx-auto relative pt-2">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ketik pertanyaan Anda (misal: cara topup, koin, QRIS)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-2xl bg-card/80 backdrop-blur-md border-border/60 text-xs sm:text-sm font-bold shadow-xl focus:border-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* HELP CATEGORIES */}
        <section className="container mx-auto px-4 max-w-5xl pt-10 sm:pt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {HELP_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <Card
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={cn(
                    "bento-card p-5 sm:p-6 cursor-pointer border-border/50 bg-card/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-[1.02]",
                    isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/40"
                  )}
                >
                  <CardContent className="p-0 space-y-3">
                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border", cat.color)}>
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-headline font-black text-sm sm:text-base text-foreground">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground font-bold leading-relaxed">{cat.desc}</p>
                    <div className="flex items-center gap-1 text-[11px] font-black text-primary pt-1">
                      <span>{isSelected ? "Tampilkan Semua" : "Lihat Topik"}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="container mx-auto px-4 max-w-4xl pt-12 sm:pt-16 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-headline text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> Pertanyaan Populer (FAQ)
              </h2>
              <p className="text-xs text-muted-foreground font-bold">
                Jawaban instan untuk hal-hal yang sering ditanyakan pelanggan.
              </p>
            </div>
            {selectedCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-black rounded-xl border-border"
              >
                Hapus Filter Kategori
              </Button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-border bg-card/20 text-center space-y-3">
              <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <p className="font-bold text-sm text-foreground">Tidak ada jawaban yang sesuai pencarian Anda.</p>
              <p className="text-xs text-muted-foreground">Coba gunakan kata kunci lain atau hubungi Tim Support kami.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bento-card border border-border/50 bg-card/30 backdrop-blur-sm rounded-2xl px-5 sm:px-6 py-1 transition-all hover:border-primary/30"
                >
                  <AccordionTrigger className="font-black text-xs sm:text-sm md:text-base text-left hover:no-underline py-4 text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground font-bold leading-relaxed pb-4 opacity-90">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>

        {/* STILL NEED HELP BANNER */}
        <section className="container mx-auto px-4 max-w-4xl pt-14 sm:pt-20">
          <div className="bento-card p-6 sm:p-10 border-primary/30 bg-gradient-to-r from-primary/10 via-card/50 to-primary/5 backdrop-blur-md rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left relative z-10">
              <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-widest">
                Layanan 24 Jam
              </Badge>
              <h3 className="font-headline text-xl sm:text-2xl font-black text-foreground">Belum menemukan jawaban?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-bold max-w-md">
                Tim Customer Support kami siap membantu kendala Anda 24 jam sehari via WhatsApp atau Email.
              </p>
            </div>

            <Link href="/contact" className="shrink-0 relative z-10 w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Headphones className="h-4 w-4" /> Hubungi Customer Service <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
