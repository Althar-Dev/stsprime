"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    if (mode === "register" && password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password tidak cocok",
        description: "Password dan konfirmasi password harus sama.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Berhasil masuk",
          description: "Selamat datang kembali di STS Pedia!",
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Simpan data profil pengguna ke Firestore tanpa await (optimistic)
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: "",
          createdAt: new Date().toISOString(),
        });

        toast({
          title: "Akun berhasil dibuat",
          description: "Selamat bergabung di STS Pedia!",
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Autentikasi",
        description: error.message || "Terjadi kesalahan saat mencoba masuk.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "w-[95vw] sm:max-w-[400px] max-h-[90vh] p-0 overflow-y-auto border-border bg-background rounded-2xl sm:rounded-3xl outline-none",
        "modal-scrollbar"
      )}>
        <div className="p-6 md:p-8 flex flex-col items-center border-b border-border bg-primary/10 sticky top-0 z-10">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center mb-4">
            {mode === "login" ? (
              <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
            ) : (
              <UserPlus className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
            )}
          </div>
          <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-center text-foreground">
            {mode === "login" ? "Selamat Datang" : "Gabung di STS Pedia"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-bold text-[10px] md:text-xs mt-1 text-center">
            {mode === "login" 
              ? "Masuk untuk melihat riwayat pesanan dan checkout lebih cepat" 
              : "Buat akun untuk mulai memantau semua transaksi Anda"}
          </DialogDescription>
        </div>

        <div className="p-5 md:p-8 space-y-5 md:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] md:text-xs font-black tracking-widest text-muted-foreground">
                ALAMAT EMAIL
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11 bg-muted/30 border-border focus:ring-primary text-sm font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] md:text-xs font-black tracking-widest text-muted-foreground">
                  PASSWORD
                </Label>
                {mode === "login" && (
                  <button type="button" className="text-[10px] font-black text-primary hover:underline">
                    Lupa Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11 bg-muted/30 border-border focus:ring-primary text-sm font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="confirmPassword" className="text-[10px] md:text-xs font-black tracking-widest text-muted-foreground">
                  KONFIRMASI PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-muted/30 border-border focus:ring-primary text-sm font-bold"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : (mode === "login" ? "Masuk Sekarang" : "Buat Akun")}
            </Button>
          </form>

          <p className="text-center text-[10px] md:text-[11px] text-muted-foreground font-bold">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button onClick={toggleMode} className="text-primary hover:underline font-black">Daftar Sekarang</button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button onClick={toggleMode} className="text-primary hover:underline font-black">Masuk Saja</button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
