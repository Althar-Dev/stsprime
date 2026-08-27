
"use client";

import { useState, useEffect } from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  ShieldCheck, 
  MessageCircle, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Settings,
  Mail,
  Phone,
  Send,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LegalSection {
  title: string;
  content: string;
}

export default function AdminSettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Firestore Docs
  const { data: legalData, loading: legalLoading } = useDoc(db ? doc(db, "settings", "legal") : null);
  const { data: contactData, loading: contactLoading } = useDoc(db ? doc(db, "settings", "contact") : null);

  // States
  const [terms, setTerms] = useState<LegalSection[]>([]);
  const [privacy, setPrivacy] = useState<LegalSection[]>([]);
  const [contact, setContact] = useState({
    whatsapp: "",
    email: "",
    telegram: "",
    hours: "24 Jam Non-stop setiap hari"
  });

  useEffect(() => {
    if (legalData) {
      setTerms(legalData.terms || []);
      setPrivacy(legalData.privacy || []);
    }
    if (contactData) {
      setContact({
        whatsapp: contactData.whatsapp || "",
        email: contactData.email || "",
        telegram: contactData.telegram || "",
        hours: contactData.hours || "24 Jam Non-stop setiap hari"
      });
    }
  }, [legalData, contactData]);

  const handleSaveLegal = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "legal"), { terms, privacy }, { merge: true });
      toast({ title: "Berhasil", description: "Pengaturan legal telah diperbarui." });
    } catch (err) {
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContact = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "contact"), contact, { merge: true });
      toast({ title: "Berhasil", description: "Informasi kontak telah diperbarui." });
    } catch (err) {
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: 'terms' | 'privacy') => {
    const newSection = { title: "Judul Baru", content: "Isi konten di sini..." };
    if (type === 'terms') setTerms([...terms, newSection]);
    else setPrivacy([...privacy, newSection]);
  };

  const removeSection = (type: 'terms' | 'privacy', index: number) => {
    if (type === 'terms') setTerms(terms.filter((_, i) => i !== index));
    else setPrivacy(privacy.filter((_, i) => i !== index));
  };

  const updateSection = (type: 'terms' | 'privacy', index: number, field: keyof LegalSection, value: string) => {
    const list = type === 'terms' ? [...terms] : [...privacy];
    list[index] = { ...list[index], [field]: value };
    if (type === 'terms') setTerms(list);
    else setPrivacy(list);
  };

  if (legalLoading || contactLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-primary" /> General Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-bold">Kelola konten legal dan saluran komunikasi pelanggan.</p>
      </div>

      <Tabs defaultValue="terms" className="w-full space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="terms" className="gap-2 font-bold px-4 sm:px-6"><FileText className="h-4 w-4" /> Terms</TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2 font-bold px-4 sm:px-6"><ShieldCheck className="h-4 w-4" /> Privacy</TabsTrigger>
          <TabsTrigger value="contact" className="gap-2 font-bold px-4 sm:px-6"><MessageCircle className="h-4 w-4" /> Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/10 p-4 sm:p-6">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black">Syarat & Ketentuan</CardTitle>
                <CardDescription className="text-xs">Poin-poin aturan penggunaan layanan STSPrime.</CardDescription>
              </div>
              <Button onClick={() => addSection('terms')} size="sm" className="rounded-lg h-9 font-black gap-2">
                <Plus className="h-4 w-4" /> Tambah Poin
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              {terms.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-background/50 relative group">
                  <button 
                    onClick={() => removeSection('terms', idx)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="space-y-4 pr-10">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Judul Pasal {idx + 1}</Label>
                      <Input 
                        value={item.title} 
                        onChange={(e) => updateSection('terms', idx, 'title', e.target.value)}
                        className="bg-background border-border font-bold h-10" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Isi Deskripsi</Label>
                      <textarea 
                        value={item.content}
                        onChange={(e) => updateSection('terms', idx, 'content', e.target.value)}
                        className="w-full min-h-[100px] rounded-lg border border-border bg-background p-3 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={handleSaveLegal} disabled={isSaving} className="w-full sm:w-auto h-11 px-10 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Terms
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/10 p-4 sm:p-6">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black">Kebijakan Privasi</CardTitle>
                <CardDescription className="text-xs">Atur bagaimana data pengguna dikelola.</CardDescription>
              </div>
              <Button onClick={() => addSection('privacy')} size="sm" className="rounded-lg h-9 font-black gap-2">
                <Plus className="h-4 w-4" /> Tambah Poin
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              {privacy.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-background/50 relative group">
                  <button 
                    onClick={() => removeSection('privacy', idx)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="space-y-4 pr-10">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Judul Poin {idx + 1}</Label>
                      <Input 
                        value={item.title} 
                        onChange={(e) => updateSection('privacy', idx, 'title', e.target.value)}
                        className="bg-background border-border font-bold h-10" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Isi Deskripsi</Label>
                      <textarea 
                        value={item.content}
                        onChange={(e) => updateSection('privacy', idx, 'content', e.target.value)}
                        className="w-full min-h-[100px] rounded-lg border border-border bg-background p-3 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={handleSaveLegal} disabled={isSaving} className="w-full sm:w-auto h-11 px-10 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Privacy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/40 bg-muted/10 p-4 sm:p-6">
              <CardTitle className="text-lg font-black">Informasi Kontak</CardTitle>
              <CardDescription className="text-xs">Saluran dukungan resmi yang tampil di halaman Hubungi Kami.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3" /> WhatsApp Business
                  </Label>
                  <Input 
                    placeholder="6281234567890" 
                    value={contact.whatsapp}
                    onChange={(e) => setContact({...contact, whatsapp: e.target.value})}
                    className="bg-background border-border font-bold h-11 rounded-xl" 
                  />
                  <p className="text-[9px] text-muted-foreground italic font-bold">Gunakan format angka tanpa tanda + atau spasi.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Support
                  </Label>
                  <Input 
                    placeholder="support@stsprime.com" 
                    value={contact.email}
                    onChange={(e) => setContact({...contact, email: e.target.value})}
                    className="bg-background border-border font-bold h-11 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Send className="h-3 w-3" /> Telegram Username
                  </Label>
                  <Input 
                    placeholder="stsprime_official" 
                    value={contact.telegram}
                    onChange={(e) => setContact({...contact, telegram: e.target.value})}
                    className="bg-background border-border font-bold h-11 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Info className="h-3 w-3" /> Jam Operasional
                  </Label>
                  <Input 
                    placeholder="24 Jam Non-stop setiap hari" 
                    value={contact.hours}
                    onChange={(e) => setContact({...contact, hours: e.target.value})}
                    className="bg-background border-border font-bold h-11 rounded-xl" 
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveContact} disabled={isSaving} className="w-full sm:w-auto h-11 px-10 rounded-xl font-black gap-2 shadow-lg shadow-primary/20">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Kontak
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
