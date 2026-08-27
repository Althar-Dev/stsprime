
"use client";

import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ShieldAlert, Scale, AlertTriangle, Gavel, CheckCircle2, Loader2 } from "lucide-react";

const DEFAULT_TERMS = [
  {
    title: "1. Ketentuan Umum",
    content: "Dengan mengakses dan menggunakan layanan STSPrime, Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan ini. Kami berhak mengubah syarat ini sewaktu-waktu tanpa pemberitahuan sebelumnya."
  },
  {
    title: "2. Akun Pengguna",
    content: "Anda bertanggung jawab penuh atas kerahasiaan informasi akun dan password Anda. STSPrime tidak bertanggung jawab atas kerugian yang timbul akibat penyalahgunaan akun oleh pihak ketiga karena kelalaian pengguna."
  },
  {
    title: "3. Transaksi & Pembayaran",
    content: "Seluruh pembayaran dilakukan melalui gerbang pembayaran resmi yang tersedia di platform kami. Harga dapat berubah sewaktu-waktu sesuai dengan kebijakan provider game dan kurs mata uang yang berlaku."
  },
  {
    title: "4. Kebijakan Pengembalian (Refund)",
    content: "Transaksi yang telah berhasil diproses oleh sistem dan item telah terkirim ke User ID tujuan tidak dapat dibatalkan atau direfund dengan alasan apapun. Refund hanya berlaku jika kegagalan sistem terbukti berasal dari sisi STSPrime."
  },
  {
    title: "5. Batasan Tanggung Jawab",
    content: "STSPrime hanya bertindak sebagai perantara distribusi item digital. Kami tidak bertanggung jawab atas masalah yang terjadi di dalam game (banned, error server game, dsb) setelah proses topup dinyatakan sukses oleh sistem kami."
  }
];

const ICONS = [FileText, ShieldAlert, Scale, AlertTriangle, Gavel];

export default function TermsPage() {
  const db = useFirestore();
  const { data, loading } = useDoc(db ? doc(db, "settings", "legal") : null);

  const sections = data?.terms || DEFAULT_TERMS;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="px-4 py-1 border-primary/40 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase">
            Legal Document
          </Badge>
          <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-bold max-w-xl mx-auto opacity-80 leading-relaxed">
            Harap baca syarat dan ketentuan penggunaan layanan STSPrime dengan saksama untuk kenyamanan transaksi Anda.
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
                      <p className="text-xs md:text-sm text-muted-foreground font-bold leading-relaxed opacity-90">
                        {section.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-16 p-8 rounded-3xl border border-primary/20 bg-primary/5 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xs md:text-sm font-bold leading-relaxed">
            Terakhir diperbarui: 15 Agustus 2026. Dengan melanjutkan penggunaan layanan kami, Anda setuju untuk mematuhi semua poin di atas.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
