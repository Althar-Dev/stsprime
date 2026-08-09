import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ChevronRight, Newspaper, Flame, Tag } from "lucide-react";

const ARTICLES = [
  {
    id: "tips-topup-game-aman",
    title: "5 Tips Top Up Game Online Aman & Terpercaya Agar Terhindar Dari Penipuan",
    excerpt: "Panduan lengkap memilih tempat top up game yang legal, aman, cepat, dan terpercaya dengan berbagai pilihan metode pembayaran.",
    category: "Tips & Trik",
    date: "8 Agustus 2026",
    readTime: "4 min baca",
    image: "https://picsum.photos/seed/topup-guide/800/450",
    author: "Tim STS PRIME",
    featured: true,
  },
  {
    id: "update-patch-mobile-legends-terbaru",
    title: "Bocoran Update Patch MLBB Terbaru: Hero Buff & Nerf yang Wajib Kamu Tahu!",
    excerpt: "Simak ulasan mendalam mengenai penyesuaian hero dan item meta Mobile Legends musim ini untuk bantu kamu push rank ke Mythic.",
    category: "Game News",
    date: "7 Agustus 2026",
    readTime: "5 min baca",
    image: "https://picsum.photos/seed/mlbb-news/800/450",
    author: "Tim STS PRIME",
    featured: false,
  },
  {
    id: "promo-cashback-gopay-dana",
    title: "Promo Flash Sale & Extra Cashback E-Wallet Setiap Akhir Pekan",
    excerpt: "Dapatkan potongan harga khusus dan koin cashback menarik untuk setiap pembelian diamond dan voucher di STS PRIME.",
    category: "Promo",
    date: "5 Agustus 2026",
    readTime: "3 min baca",
    image: "https://picsum.photos/seed/promo-news/800/450",
    author: "Tim STS PRIME",
    featured: false,
  },
  {
    id: "panduan-topup-genshin-impact",
    title: "Panduan Top Up Genesis Crystal Genshin Impact Menggunakan UID Tanpa Login",
    excerpt: "Langkah mudah mengisi Genesis Crystal dan Blessing of the Welkin Moon tanpa khawatir akun diretas.",
    category: "Panduan",
    date: "3 Agustus 2026",
    readTime: "4 min baca",
    image: "https://picsum.photos/seed/genshin-news/800/450",
    author: "Tim STS PRIME",
    featured: false,
  },
];

export const metadata = {
  title: "Artikel & Berita Terbaru - STS PRIME",
  description: "Artikel, berita game, panduan top up, promo terbaru, dan tips trik menarik seputar dunia gaming dan e-wallet.",
};

export default function ArtikelPage() {
  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const regularArticles = ARTICLES.filter((a) => a.id !== featuredArticle.id);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <Badge variant="outline" className="px-4 py-1 border-primary/40 bg-primary/10 text-primary rounded-full text-xs font-bold gap-2">
            <Newspaper className="h-3.5 w-3.5" /> Artikel & Berita Gaming
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Informasi <span className="text-primary">Terbaru & Edukasi</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
            Temukan berita seputar game favoritmu, tips & trik topup aman, promo cashback terbaru, serta update patch terkini.
          </p>
        </div>

        {/* Featured Banner Article */}
        {featuredArticle && (
          <div className="mb-12">
            <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all rounded-3xl group shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="relative lg:col-span-7 aspect-video lg:aspect-auto min-h-[260px] overflow-hidden">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-bold shadow-md gap-1">
                      <Flame className="h-3.5 w-3.5" /> Artikel Utama
                    </Badge>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="text-primary font-bold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        {featuredArticle.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {featuredArticle.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {featuredArticle.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black group-hover:text-primary transition-colors line-clamp-2">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-border/40">
                    <span className="text-xs font-bold text-muted-foreground">By {featuredArticle.author}</span>
                    <button className="inline-flex items-center gap-1.5 text-xs font-black text-primary group-hover:translate-x-1 transition-transform">
                      Baca Selengkapnya <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all rounded-2xl group flex flex-col justify-between"
            >
              <CardContent className="p-0 flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-xs font-bold">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground text-xs line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-border/30 text-xs">
                    <span className="text-muted-foreground font-medium">{article.author}</span>
                    <span className="font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Baca <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
