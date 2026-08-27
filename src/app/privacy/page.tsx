
"use client";

import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Eye, Database, Share2, Mail, ShieldCheck, Loader2 } from "lucide-react";

const DEFAULT_PRIVACY = [
  {
    title: "Data yang Kami Kumpulkan",
    content: "Kami mengumpulkan informasi yang Anda berikan saat melakukan transaksi, seperti User ID Game, Alamat Email, dan nomor telepon untuk tujuan pengiriman notifikasi status pesanan."
  },
  {
    title: "Penggunaan Informasi",
    content: "Informasi Anda digunakan semata-mata untuk memproses pesanan, memverifikasi pembayaran, serta memberikan pembaruan layanan dan promo eksklusif koin STSPrime kepada Anda."
  },
  {
    title: "Keamanan Data",
    content: "Kami menerapkan standar keamanan enkripsi SSL untuk melindungi data sensitif Anda. Kami tidak menyimpan informasi kartu kredit atau detail pembayaran pribadi lainnya di server kami."
  },
  {
    title: "Berbagi dengan Pihak Ketiga",
    content: "Kami tidak menjual atau menyewakan data pribadi Anda. Data hanya dibagikan kepada mitra gateway pembayaran dan provider game resmi untuk kepentingan penyelesaian transaksi."
  },
  {
    title: "Kontak Kami",
    content: "Jika Anda memiliki pertanyaan mengenai kebijakan privasi kami atau ingin meminta penghapusan data akun, silakan hubungi tim dukungan kami melalui layanan pelanggan 24/7."
  }
];

const ICONS = [Database, Eye, Lock, Share2, Mail];

export default function PrivacyPage() {
  const db = useFirestore();
  const { data, loading } = useDoc(db ? doc(db, "settings", "legal") : null);

  const sections = data?.privacy || DEFAULT_PRIVACY;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="px-4 py-1 border-primary/40 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase">
            Privacy Matters
          </Badge>
          <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-bold max-w-xl mx-auto opacity-80 leading-relaxed">
            Keamanan dan privasi data Anda adalah prioritas tertinggi kami. Pelajari bagaimana kami melindungi informasi Anda.
          </p>
        </div>

        {/* Content Sections */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-6">
            {sections.map((section: any, idx: number) => {
              const Icon = ICONS[idx % ICONS.length];
              return (
                <Card 
                  key={idx} 
                  className="bento-card border-border/50 bg-card/30 backdrop-blur-sm rounded-3xl hover:border-primary/30 transition-all duration-300"
                >
                  <CardContent className="p-6 md:p-8 flex gap-5 md:gap-6 items-start">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-headline text-lg md:text-xl font-black text-foreground">{section.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-bold leading-relaxed opacity-90 text-justify">
                        {section.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Security Badge Note */}
        <div className="mt-16 p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/20">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-lg">Keamanan Berlapis</h4>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold max-w-md">
              Sistem kami secara rutin diaudit untuk memastikan standar keamanan data global tetap terjaga bagi seluruh gamer STSPrime.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
