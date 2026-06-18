"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, UserPlus, X, User, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
        
        // Update basic profile
        await updateProfile(user, { displayName });

        const userData = {
          email: user.email,
          displayName: displayName,
          createdAt: new Date().toISOString(),
        };

        const userDocRef = doc(db, "users", user.uid);
        
        // Save to Firestore with contextual error handling
        setDoc(userDocRef, userData)
          .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'write',
              requestResourceData: userData,
            } satisfies SecurityRuleContext);

            errorEmitter.emit('permission-error', permissionError);
          });

        toast({
          title: "Akun berhasil dibuat",
          description: `Selamat bergabung, ${displayName}!`,
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      let message = "Terjadi kesalahan saat mencoba masuk.";
      
      if (error.code === 'auth/configuration-not-found') {
        message = "Metode Email/Password belum diaktifkan di Firebase Console.";
      } else if (error.code === 'auth/invalid-credential') {
        message = "Email atau password salah.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "Email sudah digunakan oleh akun lain.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password terlalu lemah (minimal 6 karakter).";
      }

      toast({
        variant: "destructive",
        title: "Gagal Autentikasi",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setEmail("");
    setDisplayName("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "w-[95vw] sm:max-w-[400px] max-h-[85vh] p-0 overflow-y-auto border-border bg-background rounded-2xl sm:rounded-3xl outline-none shadow-2xl",
        "modal-scrollbar"
      )}>
        <div className="sticky top-0 z-50 p-6 md:p-8 flex flex-col items-center border-b border-border bg-accent">
          <DialogPrimitive.Close className="absolute right-4 top-4 z-[60] rounded-full p-1.5 text-accent-foreground/70 opacity-70 ring-offset-accent transition-all hover:opacity-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-accent-foreground/20 backdrop-blur-sm flex items-center justify-center mb-4">
            {mode === "login" ? (
              <ShieldCheck className="h-6 w-6 text-accent-foreground" />
            ) : (
              <UserPlus className="h-6 w-6 text-accent-foreground" />
            )}
          </div>
          <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-center text-accent-foreground">
            {mode === "login" ? "Selamat Datang" : "Daftar Akun"}
          </DialogTitle>
          <DialogDescription className="text-accent-foreground/80 font-bold text-[10px] md:text-xs mt-1 text-center">
            {mode === "login" 
              ? "Masuk untuk akses cepat ke semua layanan kami" 
              : "Buat akun untuk mendapatkan fitur eksklusif"}
          </DialogDescription>
        </div>

        <div className="p-5 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="username" className="text-[10px] font-black tracking-widest text-muted-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Nama lengkap atau username" 
                    className="pl-10 h-11 bg-muted/30 border-border text-sm font-bold"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black tracking-widest text-muted-foreground">
                Alamat Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11 bg-muted/30 border-border text-sm font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-black tracking-widest text-muted-foreground">
                  Kata Sandi
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  className="pl-10 pr-10 h-11 bg-muted/30 border-border text-sm font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="confirmPassword" className="text-[10px] font-black tracking-widest text-muted-foreground">
                  Konfirmasi Kata Sandi
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 bg-muted/30 border-border text-sm font-bold"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : (mode === "login" ? "Masuk Sekarang" : "Daftar Akun")}
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
